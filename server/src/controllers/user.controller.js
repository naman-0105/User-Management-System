import * as userService from "../services/user.service.js";
import { USER_ROLES } from "../constants/user.constants.js";
import asyncHandler from "express-async-handler";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const filterFields = (body, allowedFields) => {
  const filtered = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      filtered[field] = body[field];
    }
  });
  return filtered;
};

export const createUser = asyncHandler(async (req, res) => {
  const result = await userService.createUser(req.body, req.user.id);

  res.status(201).json(new ApiResponse(201, "User created", result));
});

export const getUsers = asyncHandler(async (req, res) => {
  const data = await userService.getAllUsers(req.query, req.user.role);

  res.json(new ApiResponse(200, "Users fetched", data));
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (
    req.user.role === USER_ROLES.MANAGER &&
    user.role === USER_ROLES.ADMIN
  ) {
    throw new ApiError(403, "Managers cannot access admin users");
  }

  res.json(new ApiResponse(200, "User fetched", user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const targetUser = await userService.getUserById(req.params.id);

  if (
    req.user.role === USER_ROLES.MANAGER &&
    targetUser.role === USER_ROLES.ADMIN
  ) {
    throw new ApiError(403, "Managers cannot modify admin users");
  }

  const allowedUpdates =
    req.user.role === USER_ROLES.ADMIN
      ? ["name", "email", "role", "status"]
      : ["name", "email", "status"];
  const updates = filterFields(req.body, allowedUpdates);

  const user = await userService.updateUser(
    req.params.id,
    updates,
    req.user.id
  );

  res.json(new ApiResponse(200, "User updated", user));
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id.toString() === req.params.id) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }

  const user = await userService.deactivateUser(
    req.params.id,
    req.user.id
  );

  res.json(new ApiResponse(200, "User deactivated", user));
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  res.json(new ApiResponse(200, "Profile fetched", user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ["name", "email", "password"];
  const updates = filterFields(req.body, allowedUpdates);

  const user = await userService.updateUser(
    req.user.id,
    updates,
    req.user.id
  );

  res.json(new ApiResponse(200, "Profile updated", user));
});