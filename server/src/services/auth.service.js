import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { USER_STATUS, USER_ROLES } from "../constants/user.constants.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import ApiError from "../utils/apiError.js";

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

export const registerUser = async (data, createdBy = null) => {
  const { name, email, password, role } = data;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const safeRole = role && role !== USER_ROLES.ADMIN
    ? role
    : USER_ROLES.USER;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: safeRole,
    status: USER_STATUS.ACTIVE,
    createdBy,
    updatedBy: createdBy,
  });

  return sanitizeUser(user);
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(403, "User account is inactive");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
};

export const refreshAccessToken = async (token) => {
  if (!token) {
    throw new ApiError(400, "Refresh token is required");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(403, "User is inactive");
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    return generateAccessToken(payload);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};