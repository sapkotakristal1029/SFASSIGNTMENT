const Channel = require("../models/channelModel");
const Group = require("../models/groupModel");

// Create a new Channel
exports.createChannel = async (req, res) => {
  try {
    const { name, group } = req.body;
    const channel = new Channel({ name });
    await channel.save();

    // Update the group's channels array
    const groupB = await Group.findById(group);
    if (!groupB) return res.status(404).json({ error: "Group not found" });

    console.log("hdsl", channel);
    groupB.channels.push(channel._id);
    console.log(groupB.channels);
    await groupB.save();

    res.status(201).json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Channels
exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find().populate("group");
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Channel by ID
exports.getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("group");
    if (!channel) return res.status(404).json({ error: "Channel not found" });
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Channel
exports.updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!channel) return res.status(404).json({ error: "Channel not found" });
    res.status(200).json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Channel
exports.deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    await Channel.findByIdAndDelete(req.params.id);
    if (!channel) return res.status(404).json({ error: "Channel not found" });

    // Remove the channel from the group's channels array
    // const group = await Group.findById(channel.group);
    // if (!group) return res.status(404).json({ error: "Group not found" });
    // group.channels.pull(channel._id);
    // await group.save();

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
