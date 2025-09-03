"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/redisClient.ts
const ioredis_1 = __importDefault(require("ioredis"));
console.log("🔑 REDIS_PASSWORD from env:", process.env.REDIS_PASSWORD ? "[SET]" : "[NOT SET]");
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
});
redis.on("connect", () => {
    console.log("✅ Connected to Redis");
});
redis.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
exports.default = redis;
