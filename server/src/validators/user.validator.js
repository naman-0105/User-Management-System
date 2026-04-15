import Joi from "joi";
import {
  name,
  email,
  password,
  role,
  status,
  objectId,
} from "./common.validator.js";

export const createUserSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.optional(),
  role: role.required(),
  status: status.optional(),
});

export const updateUserSchema = Joi.object({
  name: name.optional(),
  email: email.optional(),
  role: role.optional(),
  status: status.optional(),
}).min(1);

export const updateProfileSchema = Joi.object({
  name: name.optional(),
  password: password.optional(),
}).min(1);

export const userQuerySchema = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
  role: role.optional(),
  status: status.optional(),
  search: Joi.string().optional(),
  sortBy: Joi.string().valid("name", "email", "createdAt", "updatedAt").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
});

export const userIdParamSchema = Joi.object({
  id: objectId.required(),
});