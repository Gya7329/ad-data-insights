// src/queues/analysisQueue.ts
import Queue from "bull";
import IORedis, { RedisOptions } from "ioredis";

// Common options you want everywhere
const baseRedisOpts: RedisOptions = {
  host: process.env.REDIS_HOST  || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  // don't set maxRetriesPerRequest or enableReadyCheck here
  // so they default—which bull is okay with on the "client" connection
};

// Options for subscriber & bclient where those two must be disabled
const subRedisOpts: RedisOptions = {
  ...baseRedisOpts,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
};

export const analysisQueue = new Queue("analysis", {
  createClient: (type) => {
    switch (type) {
      // this is the normal client for commands
      case "client":
        return new IORedis(baseRedisOpts);
      // these two need to disable readyCheck + retries
      case "subscriber":
      case "bclient":
        return new IORedis(subRedisOpts);
      default:
        return new IORedis(baseRedisOpts);
    }
  },
});

// Optional: log when connected / errored
analysisQueue.on("ready", () => {
  console.log("✅ Analysis queue ready");
});
analysisQueue.on("error", (err) => {
  console.error("❌ Analysis queue error:", err);
});
