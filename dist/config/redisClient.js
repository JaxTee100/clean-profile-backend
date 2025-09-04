"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = connectRedis;
exports.getRedis = getRedis;
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("redis");
dotenv_1.default.config();
let redis = null;
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.REDIS_URL) {
            console.warn("⚠️ No REDIS_URL found in environment, Redis will be disabled.");
            return null;
        }
        if (!redis) {
            redis = (0, redis_1.createClient)({
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
                yield redis.connect();
                console.log(`✅ Connected to Redis at ${process.env.REDIS_URL}`);
            }
            catch (err) {
                console.error("❌ Failed to connect to Redis:", err);
                redis = null;
            }
        }
        return redis;
    });
}
// Always return a connected instance
function getRedis() {
    return redis;
}
