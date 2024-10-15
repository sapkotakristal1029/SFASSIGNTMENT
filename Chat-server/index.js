const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Handle WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle incoming messages from clients
  socket.on("chat message", (msg) => {
    console.log("Message received: " + msg);

    // Broadcast the message to all connected clients
    io.emit("chat message", msg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
