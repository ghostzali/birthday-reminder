import express from "express";
import { DefaultController } from "./controller/default.controller";
import { UserController } from "./controller/user.controller";
import { ApplicationDS } from "./data-source";

const router = express.Router();

DefaultController.routes(router);
UserController.routes(router, ApplicationDS);

export default router;
