import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import * as HttpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import UserCache from "../caches/user.cache";
import { User } from "../models/User";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.user = null;

    if (req.headers.authorization) {
      const { uuid }: any = await jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.JWT_SECRET
      );
      const userCache = new UserCache();
      let user = await userCache.find(uuid);

      if (!user) {
        // Cache 가 존재하지 않으면 DB 에서 받아옴
        const uuidBuffer: any = Buffer.from(uuid, "hex");
        user = await User.findOne({
          attributes: ["id", "email", "nickname", "uuid"],
          where: { uuid: uuidBuffer }
        });
        if (!user) {
          return next(
            createError(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
          );
        }
        userCache.store(user);
        req.user = user;
      } else {
        req.user = JSON.parse(user);
      }
    }
    next();
  } catch (e) {
    return next(
      createError(HttpStatus.UNAUTHORIZED, "토큰 정보가 유효하지 않습니다.")
    );
  }
};
