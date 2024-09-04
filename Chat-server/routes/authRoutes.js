const express = require("express");
const router = express.Router();
const users = require("../data/users.json");

// User Authentication Route
router.post("/login", (req, res) => {
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
router.post("/user", (req, res) => {
  const { username, email, password } = req.body;
  const usernameExists = users.some((u) => u.username === username);
  if (usernameExists) {
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

// Logout Route
router.post("/logout", (req, res) => {
  req.session = null; // Assuming session is being used
  res.status(200).send({ message: "Logout successful" });
});

module.exports = router;
