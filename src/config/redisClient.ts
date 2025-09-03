import dotenv from "dotenv"
import {createClient} from "redis"
dotenv.config();

const url = process.env.REDIS_URL
export const redis = createClient({
    url
})

redis.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis(){
  try {
    await redis.connect();
    console.log(`Connected to Redis successfully at ${url}`);
    return redis;
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}