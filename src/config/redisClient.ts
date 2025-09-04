import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

let redis: ReturnType<typeof createClient> | null = null;

export async function connectRedis() {
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: true, // needed for Upstash (rediss://)
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.error("❌ Too many Redis retries, disabling Redis.");
            return new Error("Redis connection failed");
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    client.on("error", (err) => {
      console.error("⚠️ Redis Client Error:", err);
    });

    await client.connect();
    console.log("✅ Connected to Redis successfully");

    redis = client;
    return redis;
  } catch (error) {
    console.error("⚠️ Redis not available, continuing without it.");
    redis = null;
    return null;
  }
}

export function getRedis() {
  return redis; // can be null if not connected
}
