import Joi from "joi";
import { email, password, name, role } from "./common.validator.js";

export const registerSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  role: role.optional(),
});

export const loginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

export const refreshTokenSchema = Joi.object({
  token: Joi.string().required(),
});