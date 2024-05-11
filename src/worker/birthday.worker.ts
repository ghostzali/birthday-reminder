import { Worker, QueueEvents, Job } from "bullmq";
import { User } from "../entity/user.entity";
import { EmailService } from "../service/email.service";
import { birthdayQueue, birthdayQueueName } from "../queue/birthday.queue";
import { redis } from "../config";
import { UserService } from "../service/user.service";
import { ApplicationDS } from "../data-source";

export class BirthdayWorker {
  private emailService: EmailService;
  private userService: UserService;

  constructor() {
    this.emailService = new EmailService();
    this.userService = new UserService(ApplicationDS.getRepository(User));
  }

  async start(): Promise<string> {
    const worker = new Worker(
      birthdayQueueName,
      async (job) => {
        const user = await this.userService.getById(job.data.userId);
        if (!user) {
          throw new Error("User not found");
        }
        console.log(`Sending birthday message to ${job.data.name}`);

        try {
          const message = `Hey, ${job.data.name} it's your birthday! 🎉`;
          await this.emailService.sendTextEmail(user.email, message);
        } catch (error) {
          console.error(`Error sending email to ${user.email}: ${error}`);
          throw new Error("Failed to send email");
        }
      },
      { connection: redis }
    );

    const queueEvents = new QueueEvents(birthdayQueueName, {
      connection: redis,
    });
    queueEvents.on("completed", async (job) => {
      console.info(`Job ${job.jobId} on ${worker.id} completed`);

      try {
        const jobDetail = await Job.fromId(birthdayQueue, job.jobId);
        await this.userService.birthdayMessageSent(jobDetail?.data.userId);
      } catch (e) {
        console.error(e);
      }
    });
    queueEvents.on("failed", async (job) => {
      console.error(
        `Job ${job.jobId} on ${worker.id} failed with error: ${job.failedReason}`
      );
      const jobDetail = await Job.fromId(birthdayQueue, job.jobId);
      // Retry failed jobs after a delay
      await birthdayQueue.add("send-birthday-message", jobDetail?.data, {
        repeat: { every: 300000 }, // Retry after 5 minutes (300000 milliseconds)
      });
    });

    return worker.id;
  }
}
