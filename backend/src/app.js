import express from "express";
import cors from "cors";
import helmet from "helmet";

import env from "./config/dotenv.js";
import indexRouter from "./routes/index.routes.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware — supports configured origins + Expo Web localhost dev servers
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (
        env.CLIENT_ORIGINS.includes(origin) ||
        origin === process.env.FRONTEND_URL
      ) {
        return callback(null, true);
      }
      if (
        env.NODE_ENV !== "production" &&
        /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/i.test(
          origin,
        )
      ) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed"));
    },
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "1mb" }));

// Base route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Parental Control Server with Supabase PostgreSQL is Running",
  });
});

// API routes
app.use("/api", indexRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
