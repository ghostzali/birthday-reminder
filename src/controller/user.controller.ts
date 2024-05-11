import { DataSource, Repository } from "typeorm";
import { UserService } from "../service/user.service";
import { Controller } from "./controller";
import express from "express";
import { User } from "../entity/user.entity";
import moment from "moment-timezone";
import { createUserValidation, deleteUserValidation } from "../validation";
import { validationResult } from "express-validator";

export class UserController extends Controller {
  private userService: UserService;

  constructor(router: express.Router, ds: DataSource) {
    super(router);
    this.userService = new UserService(ds.getRepository(User));
    this.setup();
  }

  protected setup() {
    this.router.post("/user", createUserValidation(), this.createHandler);
    this.router.delete(
      "/user/:userId",
      deleteUserValidation(),
      this.deleteHandler
    );
  }

  static routes(router: express.Router, ds: DataSource) {
    const instance = new UserController(router, ds);

    return instance.routes();
  }

  protected createHandler: express.RequestHandler = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { firstName, lastName, email, dob, city } = req.body;
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        dob,
        address: city,
      });

      const offset = moment.tz(user.timezone).utcOffset();
      res.status(201).json({ ...user, offset });
    } catch (error) {
      res
        .status(500)
        .json({ message: error instanceof Error ? error.message : `${error}` });
    }
  };

  protected deleteHandler: express.RequestHandler = async (req, res) => {
    const { userId } = req.params;
    try {
      await this.userService.delete(parseInt(userId, 10));
      res.sendStatus(204);
    } catch (error) {
      res
        .status(500)
        .json({ message: error instanceof Error ? error.message : `${error}` });
    }
  };
}
