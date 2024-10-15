const express = require("express");
const requestAccessController = require("../controllers/requestAccessController");
const router = express.Router();

// User requests access to a channel
router.post("/request-access", requestAccessController.requestAccess);

// Admin approves or rejects a request
router.put("/approve-request", requestAccessController.approveOrRejectRequest);

// Get all pending requests for a channel (Admin)
router.get(
  "/:channelId/pending-requests",
  requestAccessController.getPendingRequests
);

router.get(
  "/request-by-admin/:userId",
  requestAccessController.getRequestsByAdmin
);

module.exports = router;
