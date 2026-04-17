import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "User Management System API",
    version: "1.0.0",
    description:
      "User Management System API documentation.\n\n" +
      "TEST USERS:\n" +
      "- admin@test.com -> ADMIN\n" +
      "- manager@test.com -> MANAGER\n" +
      "- user@test.com -> USER\n\n" +
      "Steps to test role-based access:\n" +
      "1. Call /api/auth/login\n" +
      "2. Copy access token\n" +
      "3. Click Authorize in Swagger UI\n" +
      "4. Paste token\n" +
      "5. Test APIs (role-based access applies automatically)",
  },

  tags: [
    { name: "Auth", description: "Authentication and token lifecycle" },
    { name: "Users", description: "User lifecycle and profile operations" },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "JWT token obtained from /api/auth/login. Role (ADMIN/MANAGER/USER) is embedded in token.",
      },
    },

    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          statusCode: { type: "integer", example: 200 },
          message: { type: "string", example: "Success" },
          data: { type: "object" },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          statusCode: { type: "integer", example: 400 },
          message: { type: "string", example: "Validation failed" },
          errors: { type: "array", items: { type: "string" } },
        },
      },

      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Jane Doe" },
          email: { type: "string", format: "email", example: "jane@example.com" },
          password: { type: "string", minLength: 6, example: "StrongPass123" },
        },
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@test.com" },
          password: { type: "string", example: "StrongPass123" },
        },
      },

      RefreshRequest: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string", example: "eyJhbGciOi..." },
        },
      },

      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67f2f1f5c5a9a2c8d3a4b9c1" },
          name: { type: "string", example: "Jane Doe" },
          email: { type: "string", format: "email", example: "jane@example.com" },
          role: {
            type: "string",
            enum: ["ADMIN", "MANAGER", "USER"],
            example: "USER",
          },
          status: {
            type: "string",
            enum: ["ACTIVE", "INACTIVE"],
            example: "ACTIVE",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      CreateUserRequest: {
        type: "object",
        required: ["name", "email", "role", "status"],
        properties: {
          name: { type: "string", example: "New User" },
          email: {
            type: "string",
            format: "email",
            example: "new.user@example.com",
          },
          role: {
            type: "string",
            enum: ["ADMIN", "MANAGER", "USER"],
            example: "USER",
          },
          status: {
            type: "string",
            enum: ["ACTIVE", "INACTIVE"],
            example: "ACTIVE",
          },
        },
      },

      UpdateUserRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Updated Name" },
          email: {
            type: "string",
            format: "email",
            example: "updated@example.com",
          },
          role: {
            type: "string",
            enum: ["ADMIN", "MANAGER", "USER"],
          },
          status: {
            type: "string",
            enum: ["ACTIVE", "INACTIVE"],
          },
        },
      },

      UpdateProfileRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Jane Updated" },
          email: {
            type: "string",
            format: "email",
            example: "jane.updated@example.com",
          },
          password: {
            type: "string",
            minLength: 6,
            example: "NewStrongPass123",
          },
        },
      },
    },
  },

  // ✅ GLOBAL SECURITY (optional but recommended)
  security: [
    {
      bearerAuth: [],
    },
  ],

  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
          },
          400: {
            description: "Validation error",
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate user and issue JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
          },
          401: {
            description: "Invalid credentials",
          },
        },
      },
    },

    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token using refresh token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshRequest" },
            },
          },
        },
        responses: {
          200: { description: "Token refreshed" },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },

    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List users with filters and pagination",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", example: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
          { name: "search", in: "query", schema: { type: "string", example: "john" } },
          {
            name: "role",
            in: "query",
            schema: { type: "string", enum: ["ADMIN", "MANAGER", "USER"] },
          },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
          },
        ],
        responses: {
          200: { description: "Users fetched" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden (insufficient role)" },
        },
      },

      post: {
        tags: ["Users"],
        summary: "Create a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
            },
          },
        },
        responses: {
          201: { description: "User created" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden (insufficient role)" },
        },
      },
    },

    "/api/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current authenticated user profile",
        responses: {
          200: { description: "Profile fetched" },
        },
      },

      put: {
        tags: ["Users"],
        summary: "Update current authenticated user profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
            },
          },
        },
        responses: {
          200: { description: "Profile updated" },
          400: { description: "Validation error" },
        },
      },
    },

    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "User fetched" },
          404: { description: "User not found" },
        },
      },

      put: {
        tags: ["Users"],
        summary: "Update user by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            },
          },
        },
        responses: {
          200: { description: "User updated" },
          403: { description: "Forbidden (insufficient role)" },
          404: { description: "User not found" },
        },
      },

      delete: {
        tags: ["Users"],
        summary: "Deactivate user by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "User deactivated" },
          403: { description: "Forbidden (insufficient role)" },
          404: { description: "User not found" },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;