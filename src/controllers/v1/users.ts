import * as Joi from "@hapi/joi";
import { NextFunction, Request, Response } from "express";
import { logger } from "../../configs/winston";
import * as userScheme from "../../schemas/users";
import { User } from "../../models/User";
import bcrypt from "bcrypt";
import * as HttpStatus from "http-status-codes";
import createError from "http-errors";
import { uuid } from "../../utils/uuid";
import jwt from "jsonwebtoken";

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
  logger.error("error test");
  return next(new Error("error test"));
};

/**
 * GET /api/v1/render
 * List of User API .
 */
export let render = (req: Request, res: Response) => {
  res.render("index");
};

/**
 * GET /api/v1/users
 * List of User API .
 */
export let getUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(
      createError(HttpStatus.UNAUTHORIZED, "토큰 정보가 유효하지 않습니다.")
    );
  }
  return res.json({ user: req.user });
};

/**
 * POST /api/v1/login
 * Rester User API.
 */
export let userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = Joi.validate(req.body, userScheme.userLogin);
  if (result.error !== null) {
    return next(createError(HttpStatus.BAD_REQUEST, result.error));
  }
  const { email, password } = result.value;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (!exUser) {
      return next(
        createError(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
      );
    }
    // 비밀번호 compare
    const match = await bcrypt.compare(password, exUser.password);

    if (!match) {
      return next(
        createError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          "비밀번호를 확인 해주세요."
        )
      );
    }
    // jwt payload 에 담길 내용
    const payload = {
      email: exUser.email,
      uuid: exUser.uuid
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN
    });
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
};

export let userJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = Joi.validate(req.body, userScheme.userJoin);
  if (result.error !== null) {
    return next(createError(HttpStatus.BAD_REQUEST, result.error));
  }
  const { email, password, nickname } = result.value;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return next(createError(HttpStatus.CONFLICT, result.error));
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nickname,
      password: hash,
      uuid: Buffer.from(uuid(), "hex")
    });
    return res.send();
  } catch (error) {
    return next(error);
  }
};
