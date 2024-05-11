import express from "express";
export abstract class Controller {
  constructor(protected router: express.Router) {}

  protected routes(): express.Router {
    return this.router;
  }
}
