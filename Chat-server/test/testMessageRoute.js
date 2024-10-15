const request = require("supertest");
const app = require("../server"); // Assuming app is exported from server.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Message = require("../models/messageModel");

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

describe("Message Routes", () => {
  it("should create a new message", async () => {
    const messageData = {
      text: "Hello World!",
      sender: new mongoose.Types.ObjectId(),
      channel: new mongoose.Types.ObjectId(),
    };

    const response = await request(app).post("/api/messages").send(messageData);
    expect(response.status).toBe(201);
    expect(response.body.text).toBe("Hello World!");
  });

  it("should get messages by channel", async () => {
    const channelId = new mongoose.Types.ObjectId();
    await Message.create({
      text: "Sample message",
      sender: new mongoose.Types.ObjectId(),
      channel: channelId,
    });

    const response = await request(app).get(
      `/api/messages/channel/${channelId}`
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should delete a message", async () => {
    const message = await Message.create({
      text: "Message to delete",
      sender: new mongoose.Types.ObjectId(),
      channel: new mongoose.Types.ObjectId(),
    });

    const response = await request(app).delete(`/api/messages/${message._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Message deleted successfully");
  });
});
