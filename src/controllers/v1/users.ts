import { NextFunction, Request, Response } from "express";

/**
 * GET /api/v1/hello-world
 * HelloWorld API examples.
 */
export let helloWorld = (req: Request, res: Response) => {
  res.send("helloWorld");
};

/**
 * GET /api/v1/error
 * Error test API
 */
export let error = (req: Request, res: Response, next: NextFunction) => {
  return next(new Error("error test"));
};

/**
 * GET /api/v1/render
 * List of User API .
 */
export let render = (req: Request, res: Response) => {
  res.render("index");
};


