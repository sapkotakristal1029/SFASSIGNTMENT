const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/", userController.createUser);
router.post("/login", userController.login);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
