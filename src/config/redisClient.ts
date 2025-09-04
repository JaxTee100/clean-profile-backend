import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config();

let redis: RedisClientType | null = null;

export async function connectRedis() {
  if (!process.env.REDIS_URL) {
    console.warn("⚠️ No REDIS_URL found in environment, Redis will be disabled.");
    return null;
  }

  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          console.warn(`🔄 Redis reconnect attempt #${retries}`);
          return Math.min(retries * 100, 3000); // backoff up to 3s
        },
      },
    });

    redis.on("error", (err) => {
      console.error("❌ Redis Client Error:", err);
      redis = null; // reset so next call can retry
    });

    try {
      await redis.connect();
      console.log(`✅ Connected to Redis at ${process.env.REDIS_URL}`);
    } catch (err) {
      console.error("❌ Failed to connect to Redis:", err);
      redis = null;
    }
  }

  return redis;
}

// Always return a connected instance
export function getRedis(): RedisClientType | null {
  return redis;
}
