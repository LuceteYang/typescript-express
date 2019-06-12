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

import { logger, stream } from "./configs/winston";

import jwtMiddleware from './middlewares/jwt.middleware'

import { Handlers, init } from "@sentry/node";

import { sequelize } from "./models";
// initialize configuration
dotenv.config({ path: ".env" });

// Create Express server
const app = express();
// db connect
sequelize.sync();

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

if (process.env.NODE_ENV === "production") {
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
      { stream }
    )
  );
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan("dev", { stream }));
}

// 컨트롤러를 타기 전에 jwt 로부터 user 를 조회
app.use(jwtMiddleware)

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
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let apiError = err;
    if (!err.status) {
      apiError = createError(err);
    }
    const errObj = {
      req: {
        headers: req.headers,
        query: req.query,
        body: req.body,
        route: req.route
      },
      error: {
        message: apiError.message,
        stack: apiError.stack,
        status: apiError.status
      },
      user: req.user
    };
    logger.error(`${moment().format("YYYY-MM-DD HH:mm:ss")}`, errObj);
    if (process.env.NODE_ENV === "production" && apiError.status > 499) {
      return res.status(apiError.status).json();
    } else {
      return res.status(apiError.status).json({ message: apiError.message });
    }
  }
);

export default app;
