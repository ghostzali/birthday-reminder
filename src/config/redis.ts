import Redis from "ioredis";

const redisConfig = {
  port: Number(process.env.REDIS_PORT || 6379),
  host: process.env.REDIS_HOST || "localhost",
  password: process.env.REDIS_PASSWORD || "",
  maxRetriesPerRequest: null,
};

export const redis = new Redis(redisConfig);
