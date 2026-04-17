import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(cors({
  origin: ["https://user-management-system-ruby-six.vercel.app"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  const docsUrl = `${req.protocol}://${req.get("host")}/api-docs`;

  res.status(200).json({
    success: true,
    status: "OK",
    message: "Welcome to UMS API",
    version: "1.0.0",
    documentation: docsUrl,
    endpoints: {
      auth: {
        register: "/api/auth/register",
        login: "/api/auth/login",
        refresh: "/api/auth/refresh",
      },
      users: {
        list: "/api/users",
        create: "/api/users",
        profile: "/api/users/me",
        byId: "/api/users/:id",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
