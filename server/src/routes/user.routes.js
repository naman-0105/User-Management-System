import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { USER_ROLES } from "../constants/user.constants.js";

import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  userQuerySchema,
  userIdParamSchema,
} from "../validators/user.validator.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, validate(updateProfileSchema), updateProfile);

router.post(
  "/",
  authMiddleware,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(createUserSchema),
  createUser
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(userQuerySchema, "query"),
  getUsers
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(userIdParamSchema, "params"),
  getUser
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(USER_ROLES.ADMIN),
  validate(userIdParamSchema, "params"),
  deleteUser
);

export default router;