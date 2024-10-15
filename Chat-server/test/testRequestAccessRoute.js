const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const RequestAccess = require("../models/requestAccessModel");

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

describe("Request Access Routes", () => {
  it("should request access to a channel", async () => {
    const requestData = {
      userId: new mongoose.Types.ObjectId(),
      groupId: new mongoose.Types.ObjectId(),
    };

    const response = await request(app)
      .post("/api/request-access")
      .send(requestData);
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("Pending");
  });

  it("should approve an access request", async () => {
    const accessRequest = await RequestAccess.create({
      user: new mongoose.Types.ObjectId(),
      group: new mongoose.Types.ObjectId(),
    });

    const response = await request(app)
      .put("/api/request-access/approve")
      .send({ requestId: accessRequest._id, status: "Approved" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Request Approved");
  });
});
