import * as Joi from "@hapi/joi";

export const postRegister = Joi.object().keys({
  content: Joi.string()
    .min(3)
    .required(),
  image: Joi.object()
});
