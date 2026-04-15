import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      throw new ApiError(400, `${key} is required`);
    }
  }
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  validateFields({ name, email, password });

  const user = await authService.registerUser(
    { name, email, password },
    req.user?.id || null
  );

  res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  validateFields({ email, password });

  const data = await authService.loginUser(email, password);

  if (!data) {
    throw new ApiError(401, "Invalid credentials");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Login successful", data));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "Refresh token is required");
  }

  const accessToken = await authService.refreshAccessToken(token);

  if (!accessToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Token refreshed", { accessToken }));
});