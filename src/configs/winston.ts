import dotenv from "dotenv";
import fs from "fs";
import winston from "winston";
dotenv.config({ path: ".env" });

const logDir = __dirname + "/../../logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transports: any = [
  new winston.transports.Console({
    format: winston.format.simple(),
    level: "info"
  })
];

if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "info.log",
      dirname: logDir,
      level: "info"
    })
  );
}

const logger = winston.createLogger({
  transports
});
const stream = {
  write: (message: any) => {
    logger.info(message);
  }
};

export { logger, stream };
