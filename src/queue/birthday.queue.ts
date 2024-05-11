import { Queue } from "bullmq";
import { redis } from "../config";

export const birthdayQueueName = "birthday-messages";

export const birthdayQueue = new Queue(birthdayQueueName, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3, // retry 3 times
    backoff: { type: "exponential", delay: 1000 },
  },
});
