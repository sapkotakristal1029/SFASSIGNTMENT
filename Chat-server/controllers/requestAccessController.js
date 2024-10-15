const RequestAccess = require("../models/requestAccessModel");
const Channel = require("../models/channelModel");
const User = require("../models/userModel");
const io = require("../server"); // Assuming your Socket.io server is exported
const Group = require("../models/groupModel");

// User requests access to a channel
exports.requestAccess = async (req, res) => {
  try {
    const { userId, groupId } = req.body;

    const request = new RequestAccess({
      user: userId,
      group: groupId,
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all access requests for groups where the user is an admin
exports.getRequestsByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all groups where the user is an admin
    const groups = await Group.find({ admins: userId });

    if (groups.length === 0) {
      return res
        .status(404)
        .json({ message: "No groups found where the user is an admin" });
    }

    // Extract group IDs
    const groupIds = groups.map((group) => group._id.toString());

    console.log("Group IDs:", groupIds);

    // Find all access requests for those groups
    const requests = await RequestAccess.find({
      group: { $in: groupIds },
      status: "Pending",
    })
      .populate("user", "name email")
      .populate("group", "name");

    return res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin approves or rejects the access request
exports.approveOrRejectRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body; // status: 'Approved' or 'Rejected'

    const request = await RequestAccess.findById(requestId).populate(
      "user group"
    );
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (status === "Approved") {
      // Add user to the channel
      const group = await Group.findById(request.group._id);
      if (!group.users.includes(request.user._id)) {
        group.users.push(request.user._id);
        await group.save();

        // Send socket message to notify the user
        // io.to(request.user._id.toString()).emit("accessApproved", {
        //   message: `You have been added to the group ${group.name}`,
        // });

        // Also send a message to the group
        io.to(group._id.toString()).emit("newMessage", {
          message: `${request.user.username} has joined the group.`,
        });
      }

      request.status = "Approved";
    } else {
      request.status = "Rejected";
    }

    await request.save();
    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all pending requests for a specific channel (for Admins)
exports.getPendingRequests = async (req, res) => {
  try {
    const { channelId } = req.params;

    const requests = await RequestAccess.find({
      channel: channelId,
      status: "Pending",
    }).populate("user");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
