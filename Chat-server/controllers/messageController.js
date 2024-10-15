const Message = require("../models/messageModel");

// Create a new Message
exports.createMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Messages for a Channel
exports.getMessagesByChannel = async (req, res) => {
  try {
    const messages = await Message.find({
      channel: req.params.channelId,
    }).populate("sender channel");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate(
      "sender channel"
    );
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
