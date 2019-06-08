import bodyParser from "body-parser";
import compression from "compression"; // compresses requests
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import createError from "http-errors";
import lusca from "lusca";
import moment from "moment";
import morgan from "morgan";
import path from "path";

import controllers from "./controllers";

import { Handlers, init } from "@sentry/node";

// initialize configuration
dotenv.config({ path: ".env" });

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.use(morgan("dev"));

/**
 * API controllers.
 */
app.use("/api", controllers);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const err = createError(404, "Not Found");
    next(err);
  }
);

if (process.env.NODE_ENV === "production") {
  init({ dsn: process.env.SENTRY_DSN });
  app.use(Handlers.errorHandler());
}

// error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  let apiError = err;

  if (!err.status) {
    apiError = createError(err);
  }

  // set locals, only providing error in development
  res.locals.message = apiError.message;
  res.locals.error = process.env.NODE_ENV === "development" ? apiError : {};

  // render the error page
  return res.status(apiError.status).json({ message: apiError.message });
});

export default app;
