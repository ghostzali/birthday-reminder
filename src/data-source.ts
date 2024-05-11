import "reflect-metadata";
import { DataSource } from "typeorm";
import { database } from "./config";

export const ApplicationDS = new DataSource(database);
