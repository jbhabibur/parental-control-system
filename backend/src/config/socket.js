import { Server } from "socket.io";
import env from "./dotenv.js";

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || env.CLIENT_ORIGINS.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Origin not allowed"));
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default initializeSocket;
