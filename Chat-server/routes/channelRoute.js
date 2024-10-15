const express = require("express");
const channelController = require("../controllers/channelController");
const router = express.Router();

router.post("/", channelController.createChannel);
router.get("/", channelController.getChannels);
router.get("/:id", channelController.getChannelById);
router.put("/:id", channelController.updateChannel);
router.delete("/:id", channelController.deleteChannel);

module.exports = router;
