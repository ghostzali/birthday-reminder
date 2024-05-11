import moment from "moment-timezone";
import { ApplicationDS } from "../data-source";
import { User } from "../entity/user.entity";
import { UserService } from "./user.service";
import { birthdayQueue } from "../queue/birthday.queue";

export class BirthdayService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(ApplicationDS.getRepository(User));
  }

  async scheduleBirthdayMessages(): Promise<void> {
    const users = await this.userService.getAll();
    const today = moment();

    for (const user of users) {
      const birthday = moment(user.dob).tz(user.timezone);
      if (
        birthday.date() === today.date() &&
        birthday.month() === today.month() &&
        !moment().isSame(birthday, "day")
      ) {
        const jobData = {
          userId: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        };
        const scheduledTime = birthday.startOf("day").add(9, "hours");
        await birthdayQueue.add("send-birthday-message", jobData, {
          delay: moment().diff(scheduledTime, "milliseconds"),
        });
      }
    }
  }
}
