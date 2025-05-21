import type { MiddlewareAfterServer } from '@tanstack/react-start'
import { createMiddleware } from '@tanstack/react-start'
import SuperJSON from 'superjson'

// Constants
const DEFAULT_TTL = 60 * 60 // 1 hour in seconds
const DEFAULT_LOCK_TTL = 10 // 10 seconds
const LOCK_POLL_INTERVAL = 100 // ms
const LOCK_KEY_PREFIX = 'lock:'
const CACHE_LOCK_SUFFIX = ':lock'

// Types
interface CacheValue<T> {
  value: T
  ttl: number
}

interface CacheFunctions {
  getCacheValue: <T>(key: string) => Promise<T | null>
  setCacheValue: <T>(key: string, value: T, ttl?: number) => Promise<void>
  getCacheValueOrSet: <T>(
    key: string,
    fn: () => Promise<{ value: T, ttl: number }>,
    options?: { ttl?: number, lockTtl?: number }
  ) => Promise<T>
  synchronizedFn: <T>(
    key: string,
    fn: () => Promise<T>,
    options?: { lockTtl?: number }
  ) => Promise<T>
  cache: typeof Bun.redis
}

/**
 * Validates Redis key to prevent potential issues
 */
function validateKey(key: string): void {
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Cache key must be a non-empty string')
  }
  if (key.includes('\0') || key.includes('\n') || key.includes('\r')) {
    throw new Error('Cache key contains invalid characters')
  }
}

/**
 * Creates a lock with a TTL
 */
async function acquireLock(
  key: string,
  ttl: number = DEFAULT_LOCK_TTL,
): Promise<boolean> {
  try {
    return (await Bun.redis.set(key, '1', 'NX', 'EX', ttl.toString())) === 'OK'
  }
  catch (error) {
    console.error(`Failed to acquire lock for key ${key}:`, error)
    return false
  }
}

/**
 * Releases a lock
 */
async function releaseLock(key: string): Promise<void> {
  try {
    await Bun.redis.del(key)
  }
  catch (error) {
    console.error(`Failed to release lock for key ${key}:`, error)
  }
}

/**
 * Waits for a lock to be released
 */
async function waitForLockRelease(key: string): Promise<void> {
  while (await Bun.redis.exists(key)) {
    await new Promise(resolve => setTimeout(resolve, LOCK_POLL_INTERVAL))
  }
}

export const cacheMiddleware = createMiddleware()
  .server(async ({ next }) => {
    /**
     * Retrieves a value from cache
     */
    async function getCacheValue<T>(key: string): Promise<T | null> {
      validateKey(key)
      try {
        const value = await Bun.redis.get(key)
        return value ? SuperJSON.parse<T>(value) : null
      }
      catch (error) {
        console.error(`Failed to get cache value for key ${key}:`, error)
        return null
      }
    }

    /**
     * Sets a value in cache with optional TTL
     */
    async function setCacheValue<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<void> {
      validateKey(key)
      try {
        const serialized = SuperJSON.stringify(value)
        if (ttl > 0) {
          await Bun.redis.set(key, serialized, 'EX', ttl)
        }
        else {
          await Bun.redis.set(key, serialized)
        }
      }
      catch (error) {
        console.error(`Failed to set cache value for key ${key}:`, error)
        throw error
      }
    }

    /**
     * Gets a value from cache or sets it using the provided function
     */
    async function getCacheValueOrSet<T>(
      key: string,
      fn: () => Promise<CacheValue<T>>,
      options: { ttl?: number, lockTtl?: number } = {},
    ): Promise<T> {
      validateKey(key)

      // Try to get cached value first
      const cached = await getCacheValue<T>(key)
      if (cached !== null) {
        return cached
      }

      const lockKey = `${key}${CACHE_LOCK_SUFFIX}`
      const lockTtl = options.lockTtl ?? DEFAULT_LOCK_TTL

      // Try to acquire lock
      if (!(await acquireLock(lockKey, lockTtl))) {
        await waitForLockRelease(lockKey)
        // After lock is released, try to get from cache again
        const retryCached = await getCacheValue<T>(key)
        if (retryCached !== null) {
          return retryCached
        }
      }

      try {
        const { value, ttl: valueTtl } = await fn()
        const ttlToUse = options.ttl ?? valueTtl
        await setCacheValue(key, value, ttlToUse)
        return value
      }
      finally {
        await releaseLock(lockKey)
      }
    }

    /**
     * Ensures only one instance of a function runs at a time for a given key
     */
    async function synchronizedFn<T>(
      key: string,
      fn: () => Promise<T>,
      options: { lockTtl?: number } = {},
    ): Promise<T> {
      validateKey(key)
      const lockKey = `${LOCK_KEY_PREFIX}${key}`
      const lockTtl = options.lockTtl ?? DEFAULT_LOCK_TTL

      // Try to acquire lock
      if (!(await acquireLock(lockKey, lockTtl))) {
        await waitForLockRelease(lockKey)
        return synchronizedFn(key, fn, options) // Retry after lock is released
      }

      try {
        return await fn()
      }
      finally {
        await releaseLock(lockKey)
      }
    }

    const context = {
      getCacheValue,
      setCacheValue,
      getCacheValueOrSet,
      synchronizedFn,
      cache: Bun.redis,
    }

    return next({
      context,
    })
  })

export type CacheMiddleware = MiddlewareAfterServer<unknown, undefined, CacheFunctions, undefined, undefined, undefined, any>

declare module '@tanstack/react-start' {
  interface Register {
    cache: CacheFunctions
  }
}
