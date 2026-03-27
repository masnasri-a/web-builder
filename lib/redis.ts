import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

redis.on("error", (err) => {
  console.error("[Redis]", err.message)
})

export { redis }

/**
 * Fetch from cache or compute + store.
 * @param key   Redis key
 * @param ttl   Time-to-live in seconds
 * @param fn    Async function to compute the value on cache miss
 */
export async function cached<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    const hit = await redis.get(key)
    if (hit) return JSON.parse(hit) as T
  } catch {
    // Redis unavailable — fall through to compute
  }

  const data = await fn()

  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl)
  } catch {
    // Redis unavailable — ignore
  }

  return data
}

/** Delete one or more cache keys. */
export async function invalidate(...keys: string[]) {
  if (keys.length === 0) return
  try {
    await redis.del(...keys)
  } catch {
    // Redis unavailable — ignore
  }
}

/** Delete all keys matching a glob pattern, e.g. "backgrounds:user:abc123:*" */
export async function invalidatePattern(pattern: string) {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) await redis.del(...keys)
  } catch {
    // Redis unavailable — ignore
  }
}
