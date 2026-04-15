import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import { USER_STATUS } from "../constants/user.constants.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Token missing");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(403, "User is inactive");
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      message: error.message || "Invalid or expired token",
    });
  }
};