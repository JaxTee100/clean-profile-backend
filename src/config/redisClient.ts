import dotenv from "dotenv"
import {createClient} from "redis"
dotenv.config();


export const redis = createClient({
    url: process.env.REDIS_URL
})

redis.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis(){
  try {
    await redis.connect();
    console.log(`Connected to Redis successfully at ${process.env.REDIS_URL}`);
    return redis;
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}