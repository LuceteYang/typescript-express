import * as Joi from "@hapi/joi";
import { NextFunction, Request, Response } from "express";
import * as formidable from "formidable";
import { postRegister } from "../../validations/posts";
import { Post } from "../../models/Post";
import * as HttpStatus from "http-status-codes";
import createError from "http-errors";

/**
 * GET /api
 * List of Post API examples.
 */
export let getPosts = (req: Request, res: Response, next: NextFunction) => {
  Post.findAll()
    .then(posts => {
      return res.json({ posts });
    })
    .catch(error => {
      return next(error);
    });
};

export let registerPosts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(
      createError(HttpStatus.UNAUTHORIZED, "토큰 정보가 유효하지 않습니다.")
    );
  }
  const form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.uploadDir = __dirname + "../../../upload";
  form.multiples = true;
  form.keepExtensions = true;
  form.parse(
    req,
    async (err: any, fields: formidable.Fields, files: formidable.Files) => {
      try {
        const result: any = Joi.validate(
          { ...fields, ...files },
          postRegister
        );
        if (result.error !== null) {
          return res.status(400).send(result.error);
        }
        const { content, image } = result.value;
        const post = await Post.create({
          content,
          image: image ? image.path : null,
          userId: req.user.id
        });
        return res.json(post);
      } catch (error) {
        return next(error);
      }
    }
  );
};
