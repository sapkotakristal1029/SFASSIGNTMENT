const express = require("express");
const router = express.Router();
const channels = [];

// Create Channel Route
router.post("/", (req, res) => {
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
router.delete("/:groupId/:channelId", (req, res) => {
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

module.exports = router;
