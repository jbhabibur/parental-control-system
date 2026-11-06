const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const pinoHttp = require("pino-http");

const { CLIENT_URL } = require("./config/dotenv");

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(pinoHttp());

// Rate Limiter
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Parental Control Backend Running"
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");

  res.json({
    success: true,
    message: "API is Healthy",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected"
  });
});

// API Routes will be registered here

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// Error Handler
app.use((err, req, res, next) => {
  req.log?.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : "Internal Server Error"
  });
});

module.exports = app;