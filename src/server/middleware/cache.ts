import { createMiddleware } from '@tanstack/react-start'
import SuperJSON from 'superjson'
import { getLogger, loggerMiddleware } from './logger'

// Constants
// const DEFAULT_TTL = 60 // 1 minutes
const DEFAULT_LOCK_TTL = 10 // 10 seconds
const LOCK_POLL_INTERVAL = 100 // ms
const CACHE_LOCK_SUFFIX = ':lock'

export interface CacheFunctions {
  getCacheValue: <T>(key: string) => Promise<T | null>
  setCacheValue: <T>(key: string, value: T, ttl?: number) => Promise<void>
  getCacheValueOrSet: <T>(
    key: string,
    fn: () => Promise<T>,
    options?: { ttl: number, lockTtl?: number }
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
    getLogger().error(error, `Failed to acquire lock for key ${key}:`, error)
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
    getLogger().error(error, `Failed to release lock for key ${key}:`, error)
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
  .middleware([loggerMiddleware])
  .server(async ({ next, context: { logger } }) => {
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
        logger.error({ error }, `Failed to get cache value for key ${key}:`)
        return null
      }
    }

    /**
     * Sets a value in cache with optional TTL
     */
    async function setCacheValue<T>(key: string, value: T, ttl?: number): Promise<void> {
      validateKey(key)
      try {
        const serialized = SuperJSON.stringify(value)
        if (ttl !== undefined && ttl > 0) {
          await Bun.redis.set(key, serialized, 'EX', ttl)
        }
        else {
          await Bun.redis.del(key)
        }
      }
      catch (error) {
        logger.error({ error }, `Failed to set cache value for key ${key}`)
        throw error
      }
    }

    /**
     * Gets a value from cache or sets it using the provided function
     */
    async function getCacheValueOrSet<T>(
      key: string,
      fn: () => Promise<T>,
      options?: { ttl: number, lockTtl?: number },
    ): Promise<T> {
      validateKey(key)

      // Try to get cached value first
      const cached = await getCacheValue<T>(key)
      if (cached !== null) {
        return cached
      }

      const lockKey = `${key}${CACHE_LOCK_SUFFIX}`
      const lockTtl = options?.lockTtl ?? DEFAULT_LOCK_TTL

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
        const value = await fn()
        await setCacheValue(key, value, options?.ttl)
        return value
      }
      finally {
        await releaseLock(lockKey)
      }
    }

    const context = {
      getCacheValue,
      setCacheValue,
      getCacheValueOrSet,
      cache: Bun.redis,
    } satisfies CacheFunctions

    return next({
      context,
    })
  })
