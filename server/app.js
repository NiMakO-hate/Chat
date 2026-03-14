const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const serverConfig = require("./src/config/serverConfig");
const apiRouter = require("./src/routes/api.routes");
const MessageService = require("./src/services/Message.service");

const PORT = process.env.PORT || 3000;

const app = express();
serverConfig(app);
app.use("/api", apiRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const { user } = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const currentUserId = socket.user.id;

  socket.join(String(currentUserId));

  socket.on("message:send", async ({ receiverId, content }) => {
    try {
      const message = await MessageService.createMessage({
        senderId: currentUserId,
        receiverId,
        content,
      });

      socket.emit("message:sent", message);
      io.to(String(receiverId)).emit("message:received", message);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("message:read", async ({ fromUserId }) => {
    try {
      const updatedCount = await MessageService.markAsRead({
        userId: currentUserId,
        fromUserId,
      });

      io.to(String(fromUserId)).emit("message:read:update", {
        userId: currentUserId,
        fromUserId,
        count: updatedCount,
      });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});