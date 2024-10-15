const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Notification = require("../models/notificationModel");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Notification Routes", () => {
  it("should create a new notification", async () => {
    const notificationData = {
      message: "New Notification",
      groupId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    };

    const response = await request(app)
      .post("/api/notifications")
      .send(notificationData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("New Notification");
  });

  it("should get all notifications", async () => {
    await Notification.create({
      message: "Sample Notification",
      groupId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    });

    const response = await request(app).get("/api/notifications");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should delete a notification", async () => {
    const notification = await Notification.create({
      message: "Notification to delete",
      groupId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    });

    const response = await request(app).delete(
      `/api/notifications/${notification._id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Notification deleted successfully");
  });
});
