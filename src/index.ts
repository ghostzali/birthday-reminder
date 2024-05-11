import { ApplicationDS } from "./data-source";
import express from "express";
import routes from "./routes";
import { config } from "dotenv";
import { BirthdayWorker } from "./worker/birthday.worker";
import { birthdaySchedulerCron } from "./cron/birthday-scheduler.cron";

config({ path: `${process.cwd()}/.env` }); // load .env

const app = express();
app.use(express.json());
app.use("/", routes);

ApplicationDS.initialize()
  .then(async () => {
    new BirthdayWorker()
      .start()
      .then((workerId) => console.info(`Birthday Worker ${workerId} started.`))
      .catch((error) => console.error("BirthdayWorker", error));

    birthdaySchedulerCron().catch((error) =>
      console.error("BirthdayService", error)
    );

    const PORT = Number(process.env.PORT || 3000);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
