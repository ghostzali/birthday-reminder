import { DataSourceOptions } from "typeorm";
import { User } from "../entity/user.entity";
import { config } from "dotenv";

config({ path: `${process.cwd()}/.env` }); // load .env

export const database: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
};
