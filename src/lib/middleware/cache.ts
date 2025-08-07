/**
 * 高级缓存中间件
 * 
 * 功能特性：
 * 1. 分布式锁防止并发问题
 * 2. 强制 TTL 要求
 * 3. 完整的错误处理和日志记录
 * 4. 支持复杂数据类型序列化
 * 
 * 基于 Bun.redis 实现，提供类型安全的缓存操作
 */

import { createMiddleware } from '@tanstack/react-start';
import SuperJSON from 'superjson';
import { getLogger, loggerMiddleware } from './logger';

// ==================== 常量配置 ====================
const DEFAULT_LOCK_TTL = 30; // 分布式锁默认过期时间（秒）
const LOCK_POLL_INTERVAL = 100; // 锁轮询间隔（毫秒）
const LOCK_MAX_WAIT = 30000; // 等待锁的最大时间（毫秒）
const CACHE_LOCK_SUFFIX = ':lock'; // 锁键名后缀

// ==================== 简化缓存数据结构 ====================

// ==================== 类型定义 ====================

/**
 * 基础缓存选项
 */
export interface CacheOptions {
  ttl: number; // 缓存过期时间（秒），必须提供
  lockTtl?: number; // 分布式锁过期时间（秒）
  maxLockWait?: number; // 等待锁的最大时间（毫秒）
  namespace?: string; // 缓存命名空间（保留字段）
}



/**
 * 分布式锁选项
 */
export interface LockOptions {
  ttl?: number; // 锁的过期时间（秒）
  maxWait?: number; // 等待锁的最大时间（毫秒）
  retryInterval?: number; // 重试间隔（毫秒）
}

/**
 * 缓存中间件提供的所有功能接口
 */
export interface CacheFunctions {
  // ==================== 基础缓存操作 ====================
  
  /** 从缓存获取数据，自动处理过期检查 */
  get: <T>(key: string) => Promise<T | null>;
  
  /** 设置缓存数据，必须指定 TTL */
  set: <T>(key: string, value: T, ttl: number) => Promise<void>;
  
  /** 删除缓存键 */
  del: (key: string) => Promise<boolean>;
  
  /** 检查缓存键是否存在 */
  exists: (key: string) => Promise<boolean>;
  
  /** 设置缓存键的过期时间 */
  expire: (key: string, ttl: number) => Promise<boolean>;
  
  /** 获取缓存键的剩余过期时间 */
  ttl: (key: string) => Promise<number>;



  // ==================== 分布式锁操作 ====================
  
  /** 尝试获取分布式锁 */
  acquireLock: (key: string, options?: LockOptions) => Promise<boolean>;
  
  /** 释放分布式锁 */
  releaseLock: (key: string) => Promise<void>;
  
  /** 在分布式锁保护下执行函数 */
  withLock: <T>(
    key: string,
    fn: () => Promise<T>,
    options?: LockOptions,
  ) => Promise<T>;

  // ==================== 实用工具函数 ====================
  
  /** 清除缓存，支持模式匹配 */
  clear: (pattern?: string) => Promise<number>;
  
  /** 获取匹配模式的所有键名 */
  keys: (pattern?: string) => Promise<string[]>;

  // ==================== 原始 Redis 客户端 ====================
  
  /** 原始 Redis 客户端，用于高级操作 */
  redis: typeof Bun.redis;
}

// ==================== 工具函数 ====================

/**
 * 验证 Redis 键名的有效性
 * 防止使用无效字符和过长的键名
 */
function validateKey(key: string): void {
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Cache key must be a non-empty string');
  }
  if (key.includes('\0') || key.includes('\n') || key.includes('\r')) {
    throw new Error('Cache key contains invalid characters');
  }
  if (key.length > 512) {
    throw new Error('Cache key too long (max 512 characters)');
  }
}



// ==================== 分布式锁实现 ====================

/**
 * 获取分布式锁
 * 使用 Redis SET 命令的 NX（仅在不存在时设置）和 EX（设置过期时间）参数
 * 实现原子性锁操作，防止多个实例并发执行相同任务
 * 
 * @param key 锁的标识键
 * @param options 锁选项，包括 TTL 等
 * @returns 获取成功返回 true，失败返回 false
 */
async function acquireLock(
  key: string,
  options: LockOptions = {},
): Promise<boolean> {
  const lockKey = `${key}${CACHE_LOCK_SUFFIX}`; // 添加锁后缀避免与普通缓存键冲突
  const ttl = options.ttl || DEFAULT_LOCK_TTL;

  try {
    // 使用 SET key value NX EX ttl 实现原子性锁操作
    const result = await Bun.redis.set(
      lockKey,
      '1',
      'NX', // 仅在键不存在时设置
      'EX', // 设置过期时间（秒）
      ttl.toString(),
    );
    return result === 'OK'; // Redis 返回 'OK' 表示获取锁成功
  } catch (error) {
    getLogger().error({ error, key: lockKey }, 'Failed to acquire lock');
    return false;
  }
}

/**
 * 释放分布式锁
 * 直接删除锁键来释放锁
 * 
 * @param key 锁的标识键
 */
async function releaseLock(key: string): Promise<void> {
  const lockKey = `${key}${CACHE_LOCK_SUFFIX}`;

  try {
    await Bun.redis.del(lockKey); // 删除锁键即可释放锁
  } catch (error) {
    getLogger().error({ error, key: lockKey }, 'Failed to release lock');
    // 释放锁失败不抛出异常，避免影响业务逻辑
  }
}

/**
 * 等待锁释放，带有超时保护
 * 轮询检查锁是否存在，直到锁被释放或超时
 * 
 * @param key 锁的标识键
 * @param maxWait 最大等待时间（毫秒）
 * @throws 超时时抛出错误
 */
async function waitForLockRelease(
  key: string,
  maxWait: number = LOCK_MAX_WAIT,
): Promise<void> {
  const lockKey = `${key}${CACHE_LOCK_SUFFIX}`;
  const startTime = Date.now();

  // 轮询检查锁状态
  while (await Bun.redis.exists(lockKey)) {
    // 检查是否超时
    if (Date.now() - startTime > maxWait) {
      throw new Error(`Lock wait timeout for key: ${key}`);
    }
    // 短暂等待后再次检查
    await new Promise((resolve) => setTimeout(resolve, LOCK_POLL_INTERVAL));
  }
}

// ==================== 缓存中间件实现 ====================

export const cacheMiddleware = createMiddleware({ type: 'function' })
  .middleware([loggerMiddleware])
  .server(async ({ next, context: { logger } }) => {
    
    // ========== 基础缓存操作实现 ==========

    /**
     * 从缓存获取数据
     * 直接从 Redis 获取并反序列化数据
     * 
     * @param key 缓存键名
     * @returns 缓存的数据，不存在返回 null
     */
    async function get<T>(key: string): Promise<T | null> {
      validateKey(key); // 验证键名的有效性
      
      try {
        const value = await Bun.redis.get(key);
        if (!value) return null; // 键不存在

        // 使用 SuperJSON 反序列化数据
        return SuperJSON.parse(value) as T;
      } catch (error) {
        logger.error({ error, key }, 'Failed to get cache value');
        return null; // 发生错误时返回 null，不中断业务流程
      }
    }

    /**
     * 设置缓存数据
     * 直接序列化数据并存储到 Redis
     * 
     * @param key 缓存键名
     * @param value 要缓存的数据
     * @param ttl 过期时间（秒），必须为正数
     * @throws TTL 为非正数或存储失败时抛出错误
     */
    async function set<T>(key: string, value: T, ttl: number): Promise<void> {
      validateKey(key); // 验证键名有效性

      // 必须提供有效的 TTL
      if (ttl <= 0) {
        throw new Error('TTL must be a positive number');
      }

      try {
        // 使用 SuperJSON 序列化，支持复杂数据类型
        const serialized = SuperJSON.stringify(value);

        // 存储到 Redis 并设置过期时间
        await Bun.redis.set(key, serialized, 'EX', ttl);
      } catch (error) {
        logger.error({ error, key, ttl }, 'Failed to set cache value');
        throw error; // 存储失败时抛出错误，让调用者处理
      }
    }

    /**
     * Delete key from cache
     */
    async function del(key: string): Promise<boolean> {
      validateKey(key);
      try {
        const result = await Bun.redis.del(key);
        return result > 0;
      } catch (error) {
        logger.error({ error, key }, 'Failed to delete cache key');
        return false;
      }
    }

    /**
     * Check if key exists
     */
    async function exists(key: string): Promise<boolean> {
      validateKey(key);
      try {
        return await Bun.redis.exists(key);
      } catch (error) {
        logger.error({ error, key }, 'Failed to check cache key existence');
        return false;
      }
    }

    /**
     * Set expiration for existing key
     */
    async function expire(key: string, ttl: number): Promise<boolean> {
      validateKey(key);
      try {
        const result = await Bun.redis.expire(key, ttl);
        return result === 1;
      } catch (error) {
        logger.error({ error, key, ttl }, 'Failed to set cache key expiration');
        return false;
      }
    }

    /**
     * Get TTL for key
     */
    async function ttl(key: string): Promise<number> {
      validateKey(key);
      try {
        return await Bun.redis.ttl(key);
      } catch (error) {
        logger.error({ error, key }, 'Failed to get cache key TTL');
        return -1;
      }
    }



    // ========== Lock Functions ==========

    /**
     * Acquire distributed lock
     */
    async function acquireLockFn(
      key: string,
      options: LockOptions = {},
    ): Promise<boolean> {
      return await acquireLock(key, options);
    }

    /**
     * Release distributed lock
     */
    async function releaseLockFn(key: string): Promise<void> {
      await releaseLock(key);
    }

    /**
     * Execute function with distributed lock
     */
    async function withLock<T>(
      key: string,
      fn: () => Promise<T>,
      options: LockOptions = {},
    ): Promise<T> {
      const maxWait = options.maxWait || LOCK_MAX_WAIT;

      // Try to acquire lock
      if (!(await acquireLock(key, options))) {
        await waitForLockRelease(key, maxWait);

        // Try one more time after waiting
        if (!(await acquireLock(key, options))) {
          throw new Error(`Failed to acquire lock for key: ${key}`);
        }
      }

      try {
        return await fn();
      } finally {
        await releaseLock(key);
      }
    }

    // ========== Utility Functions ==========

    /**
     * Clear cache entries by pattern
     */
    async function clear(pattern?: string): Promise<number> {
      try {
        if (!pattern) {
          await Bun.redis.send('FLUSHDB', []);
          return 0; // FLUSHDB doesn't return count
        }

        // Get keys matching pattern and delete them
        const matchingKeys = await getKeys(pattern);
        if (matchingKeys.length === 0) return 0;

        return await Bun.redis.del(...matchingKeys);
      } catch (error) {
        logger.error({ error, pattern }, 'Failed to clear cache');
        return 0;
      }
    }

    /**
     * Get keys matching pattern
     */
    async function getKeys(pattern: string = '*'): Promise<string[]> {
      try {
        // Use SCAN for better performance than KEYS
        const result: string[] = [];
        let cursor = 0;

        do {
          const scanResult = await Bun.redis.send('SCAN', [
            cursor.toString(),
            'MATCH',
            pattern,
            'COUNT',
            '100',
          ]);
          cursor = parseInt(scanResult[0]);
          result.push(...(scanResult[1] as string[]));
        } while (cursor !== 0);

        return result;
      } catch (error) {
        logger.error({ error, pattern }, 'Failed to get cache keys');
        return [];
      }
    }

    // ========== Context Assembly ==========

    const context = {
      // Basic operations
      get,
      set,
      del,
      exists,
      expire,
      ttl,

      // Lock operations
      acquireLock: acquireLockFn,
      releaseLock: releaseLockFn,
      withLock,

      // Utility operations
      clear,
      keys: getKeys,

      // Raw Redis access
      redis: Bun.redis,
    } satisfies CacheFunctions;

    return next({
      context,
    });
  });
