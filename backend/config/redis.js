const redis = require("redis")

let redisClient

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    })

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err)
    })

    redisClient.on("connect", () => {
      console.log("Connected to Redis")
    })

    await redisClient.connect()
  } catch (error) {
    console.error("Redis connection error:", error)
  }
}

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client not initialized")
  }
  return redisClient
}

// Cache helper functions
const cache = {
  async get(key) {
    try {
      const data = await redisClient.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Cache get error:", error)
      return null
    }
  },

  async set(key, data, expireInSeconds = 3600) {
    try {
      await redisClient.setEx(key, expireInSeconds, JSON.stringify(data))
      return true
    } catch (error) {
      console.error("Cache set error:", error)
      return false
    }
  },

  async del(key) {
    try {
      await redisClient.del(key)
      return true
    } catch (error) {
      console.error("Cache delete error:", error)
      return false
    }
  },

  async flush() {
    try {
      await redisClient.flushAll()
      return true
    } catch (error) {
      console.error("Cache flush error:", error)
      return false
    }
  },
}

module.exports = {
  connectRedis,
  getRedisClient,
  cache,
}
