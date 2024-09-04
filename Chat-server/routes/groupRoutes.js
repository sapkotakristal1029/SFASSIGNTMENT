const express = require("express");
const router = express.Router();
const groups = [];

// Create Group Route
router.post("/", (req, res) => {
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
router.delete("/:groupId", (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const groupIndex = groups.findIndex((group) => group.groupId === groupId);
  if (groupIndex !== -1) {
    groups.splice(groupIndex, 1);
    res.status(200).send({ message: "Group removed successfully" });
  } else {
    res.status(404).send({ message: "Group not found" });
  }
});

module.exports = router;
