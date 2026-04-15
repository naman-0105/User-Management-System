import Joi from "joi";
import { USER_ROLES, USER_STATUS } from "../constants/user.constants.js";

export const name = Joi.string().min(2).max(50).trim();

export const email = Joi.string().email().trim();

export const password = Joi.string().min(6);

export const role = Joi.string().valid(...Object.values(USER_ROLES));

export const status = Joi.string().valid(...Object.values(USER_STATUS));

export const objectId = Joi.string().hex().length(24);