import express from "express";
import cors from "cors";
import helmet from "helmet";

import indexRouter from "./routes/index.routes.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
