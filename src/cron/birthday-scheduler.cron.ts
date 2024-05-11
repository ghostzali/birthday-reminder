import { BirthdayService } from "../service/birthday.service";
import cron from "node-cron";

// Schedule birthday messages to be sent every day at the start of the day
export async function birthdaySchedulerCron(): Promise<void> {
  cron.schedule("0 9 * * *", async () => {
    const service = new BirthdayService();
    await service.scheduleBirthdayMessages();
    console.log("Birthday messages scheduled successfully");
  });
}
