const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Socket.io Setup for Real-Time Communication
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // Replace this with the correct frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for incoming messages and broadcast them
  socket.on("message", (message) => {
    io.emit("message", message);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Data Storage
const users = [
  {
    id: 1,
    username: "super",
    password: "123",
    roles: ["Super Admin"],
    groups: [],
  },
  {
    id: 2,
    username: "group",
    password: "123",
    roles: ["Group Admin"],
    groups: [],
  },
  {
    id: 3,
    username: "user",
    password: "123",
    roles: ["User"],
    groups: [
      { id: 11, name: "string", channels: [{ id: 11, name: "string" }] },
    ],
  },
  {
    id: 4,
    username: "super1",
    password: "123",
    roles: ["Super Admin"],
    groups: [],
  },
  {
    id: 5,
    username: "group1",
    password: "123",
    roles: ["Group Admin"],
    groups: [],
  },
  {
    id: 6,
    username: "user1",
    password: "123",
    roles: ["User"],
    groups: [],
  },
];

const groups = [];
const channels = [];

// API Routes
// User Authentication Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.status(200).send({ message: "Login successful", user });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

// User Registration Route
app.post("/user", (req, res) => {
  const { username, email, password } = req.body;
  const usernameExists = users.some((u) => u.username === username);
  if (usernameExists) {
    // Send a 409 Conflict status code with a message
    res.status(409).send({ message: "Username already exists" });
  } else {
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password,
      roles: ["User"],
      groups: [],
    };
    users.push(newUser);
    res.status(201).send({ message: "User created", user: newUser });
  }
});

// Promote User to Group Admin Route
app.post("/user/promote", (req, res) => {
  const { userId } = req.body;
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.roles.push("Group Admin");
    res.status(200).send({ message: "User promoted to Group Admin", user });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Upgrade User to Super Admin Route
app.post("/user/upgrade", (req, res) => {
  const { userId } = req.body;
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.roles.push("Super Admin");
    res.status(200).send({ message: "User upgraded to Super Admin", user });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Remove User Route
app.delete("/user/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(200).send({ message: "User removed successfully" });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Get Users Route
app.get("/users", (req, res) => {
  res.status(200).send(users); // Return the list of users
});

// Create Group Route
app.post("/group", (req, res) => {
  const { groupName, adminId } = req.body;
  const newGroup = {
    groupId: groups.length + 1,
    groupName,
    adminIds: [adminId],
    userIds: [adminId],
  };
  groups.push(newGroup);
  res.status(201).send({ message: "Group created", group: newGroup });
});

// Remove Group Route
app.delete("/group/:groupId", (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const groupIndex = groups.findIndex((group) => group.groupId === groupId);
  if (groupIndex !== -1) {
    groups.splice(groupIndex, 1);
    res.status(200).send({ message: "Group removed successfully" });
  } else {
    res.status(404).send({ message: "Group not found" });
  }
});

// Create Channel Route
app.post("/channel", (req, res) => {
  const { channelName, groupId } = req.body;
  const newChannel = {
    channelId: channels.length + 1,
    channelName,
    groupId,
    userIds: [],
  };
  channels.push(newChannel);
  res.status(201).send({ message: "Channel created", channel: newChannel });
});

// Remove Channel Route
app.delete("/channel/:groupId/:channelId", (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const channelId = parseInt(req.params.channelId);
  const group = groups.find((group) => group.groupId === groupId);
  if (group) {
    const channelIndex = group.channels.findIndex(
      (channel) => channel.channelId === channelId
    );
    if (channelIndex !== -1) {
      group.channels.splice(channelIndex, 1);
      res.status(200).send({ message: "Channel removed successfully" });
    } else {
      res.status(404).send({ message: "Channel not found" });
    }
  } else {
    res.status(404).send({ message: "Group not found" });
  }
});
// Logout Route
app.post("/logout", (req, res) => {
  // Clear the session data or token to simulate logout
  req.session = null; // Assuming session is being used
  res.status(200).send({ message: "Logout successful" });
});

// Ban User from Channel Route
app.post("/ban-user", (req, res) => {
  const { groupId, channelId, userId } = req.body;
  // Implement the logic to ban the user from the channel
  res.status(200).send({
    message: `User ${userId} is banned from Channel ${channelId} in Group ${groupId}`,
  });
});

// Start the Server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
