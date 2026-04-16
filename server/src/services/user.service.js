import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import { USER_STATUS, USER_ROLES } from "../constants/user.constants.js";
import ApiError from "../utils/apiError.js";

const AUDIT_POPULATE = [
  { path: "createdBy", select: "name email role" },
  { path: "updatedBy", select: "name email role" },
];

const filterFields = (data, allowedFields) => {
  const filtered = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      filtered[field] = data[field];
    }
  });
  return filtered;
};

const buildUserQueryFilter = ({ role, status, search }, currentUserRole) => {
  const filter = {};

  if (role) {
    filter.role = role;
  }
  if (status) {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (currentUserRole === USER_ROLES.MANAGER) {
    filter.role = { $ne: USER_ROLES.ADMIN };
  }

  return filter;
};

export const createUser = async (data, createdBy) => {
  const { name, email, role, status } = data;
  let { password } = data;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  if (role && !Object.values(USER_ROLES).includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  if (status && !Object.values(USER_STATUS).includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  if (!password) {
    password = crypto.randomBytes(8).toString("hex");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || USER_ROLES.USER,
    status: status || USER_STATUS.ACTIVE,
    createdBy,
    updatedBy: createdBy,
  });

  const fullUser = await User.findById(user._id)
    .select("-password")
    .populate(AUDIT_POPULATE);

  return {
    user: fullUser,
    generatedPassword: data.password ? null : password,
  };
};

export const getAllUsers = async (query, currentUserRole) => {
  let { page = 1, limit = 10, role, status, search, sortBy, sortOrder } = query;

  page = Number(page);
  limit = Number(limit);

  const filter = buildUserQueryFilter(
    { role, status, search },
    currentUserRole
  );

  const sortField = sortBy || "createdAt";
  const direction = sortOrder === "asc" ? 1 : -1;

  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sortField]: direction })
    .select("-password")
    .populate(AUDIT_POPULATE);

  const total = await User.countDocuments(filter);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password").populate(AUDIT_POPULATE);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateUser = async (id, data, updatedBy) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const allowedUpdates = ["name", "email", "password", "role", "status"];
  const updates = filterFields(data, allowedUpdates);

  if (updates.email) {
    updates.email = updates.email.toLowerCase();
    const existingUser = await User.findOne({
      email: updates.email,
      _id: { $ne: id },
    });
    if (existingUser) {
      throw new ApiError(409, "Email is already used by another account");
    }
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { ...updates, updatedBy },
    { new: true, runValidators: true }
  )
    .select("-password")
    .populate(AUDIT_POPULATE);

  return updatedUser;
};

export const deactivateUser = async (id, updatedBy) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.status === USER_STATUS.INACTIVE) {
    throw new ApiError(400, "User already inactive");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status: USER_STATUS.INACTIVE, updatedBy },
    { new: true, runValidators: true }
  )
    .select("-password")
    .populate(AUDIT_POPULATE);

  return updatedUser;
};