import http from "http";
import "./config/dotenv.js";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import initializeSocket from "./config/socket.js";
import env from "./config/dotenv.js";

const startServer = async () => {
  await connectDatabase();

  // Create shared HTTP server so Express & Socket.IO run on the same port
  const httpServer = http.createServer(app);
  initializeSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log("--------------------------------");
    console.log("Parental Control Backend (PostgreSQL + Socket.IO)");
    console.log(`[SUCCESS] Server is running on port ${env.PORT}`);
    console.log(`Local URL: http://localhost:${env.PORT}`);
    console.log("--------------------------------");
  });
};

startServer();
