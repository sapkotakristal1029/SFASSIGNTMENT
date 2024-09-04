const express = require("express");
const router = express.Router();
const users = require("../data/users.json");

// Promote User to Group Admin Route
router.post("/promote", (req, res) => {
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
router.post("/upgrade", (req, res) => {
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
router.delete("/:userId", (req, res) => {
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
router.get("/", (req, res) => {
  res.status(200).send(users);
});

module.exports = router;
