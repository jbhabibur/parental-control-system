const { Server } = require("socket.io");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:8081",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    // Parent joins room
    socket.on("join-parent", (parentId) => {
      if (!parentId) return;

      socket.join(`parent-${parentId}`);

      console.log(`Parent joined: ${parentId}`);
    });

    // Child joins room
    socket.on("join-child", (childId) => {
      if (!childId) return;

      socket.join(`child-${childId}`);

      console.log(`Child joined: ${childId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket Disconnected:", socket.id);
    });
  });

  console.log("Socket.IO Initialized Successfully!");

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized!");
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO
};