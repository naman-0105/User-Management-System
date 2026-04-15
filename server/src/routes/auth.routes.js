import express from "express";
import {
  register,
  login,
  refreshToken,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshTokenSchema), refreshToken);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

export default router;