import express from "express";
import { Controller } from "./controller";

export class DefaultController extends Controller {
  constructor(router: express.Router) {
    super(router);
    this.setup();
  }

  protected setup(): void {
    this.router.get("/", this.rootHandler);
    this.router.post("/", this.rootHandler);
  }

  static routes(router: express.Router) {
    const instance = new DefaultController(router);

    return instance.routes();
  }

  protected rootHandler: express.RequestHandler = async (
    _req: express.Request,
    res: express.Response
  ) => {
    res.status(200).json({ status: "OK" });
  };
}
