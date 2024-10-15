const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const userRoutes = require("./routes/userRoute");
const groupRoutes = require("./routes/groupRoute");
const channelRoutes = require("./routes/channelRoute");
const messageRoutes = require("./routes/messageRoute");
const notificationRoutes = require("./routes/notificationRoute");
const requestAccessRoutes = require("./routes/requestAccessRoute");
const { Server } = require("socket.io");

const swaggerFile = require("./swagger_output.json");
const swaggerUi = require("swagger-ui-express");
const Message = require("./models/messageModel");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.json());

// // Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("connected", "Welcome to the chat app!");

  // Join user-specific room to send personal messages
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
  });

  // Join channel-specific room to send channel-wide messages
  socket.on("joinChannelRoom", (channelId) => {
    socket.join(channelId);
  });

  // Emit event when access is approved
  socket.on("accessApproved", ({ userId, channelId }) => {
    // You can also emit to the channel room, notifying the group of a new member
    io.to(channelId).emit("newUserJoined", {
      message: `A new user has been added to the channel.`,
      userId,
    });
  });

  // Handle when a user sends a message
  socket.on("sendMessage", async ({ text, userId, channelId }) => {
    try {
      // Create a new message in the database (Message model)
      const newMessage = await Message.create({
        text,
        sender: userId,
        channel: channelId,
      });

      console.log("New message created:", newMessage);

      // Fetch the full message with user details (optional)
      const message = await Message.findById(newMessage._id).populate(
        "sender",
        "Channel"
      );

      // Broadcast the message to all users in the channel
      io.to(channelId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/requests", requestAccessRoutes);

const PORT = process.env.PORT || 5000;
mongoose
  .connect("mongodb://localhost:27017/chatapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => app.listen(4000, () => console.log(`Server running on port ${PORT}`))
    // console.log("Connected to MongoDB")
  )
  .catch((err) => console.log(err));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = io;
