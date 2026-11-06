const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");

const { PORT } = require("./config/dotenv");

const { initializeSocket } = require("./config/socket");

// Create HTTP Server
const httpServer = http.createServer(app);

// Start Server
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Initialize Socket.IO
    initializeSocket(httpServer);

    // Start HTTP Server
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log("--------------------------------");
      console.log("Parental Control Backend Started");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log("Socket.IO: Active");
      console.log("--------------------------------");
    });

  } catch (error) {
    console.error("Server Startup Failed:", error.message);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
const shutdown = async () => {
  console.log("Server shutting down...");

  httpServer.close(async () => {
    const mongoose = require("mongoose");

    await mongoose.disconnect();

    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = httpServer;