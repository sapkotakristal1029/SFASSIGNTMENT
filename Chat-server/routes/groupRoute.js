const express = require("express");
const groupController = require("../controllers/groupController");
const router = express.Router();

router.post("/", groupController.createGroup);
router.get("/", groupController.getGroups);
router.get("/user-groups/:id", groupController.getUserGroups);
router.get("/:id", groupController.getGroupById);
router.put("/:id", groupController.updateGroup);
router.delete("/:id", groupController.deleteGroup);

module.exports = router;
