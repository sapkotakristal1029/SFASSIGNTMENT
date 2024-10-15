// test/testChannelRoutes.js
const app = require("../server.js"); // Ensure correct path
const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const Channel = require("../models/channelModel.js");
const Group = require("../models/groupModel.js");

const should = chai.should();

// Use Chai HTTP
chai.use(chaiHttp);

describe("Channel Routes", function () {
  before(function () {
    console.log("Starting Channel Routes tests...");
  });

  after(function () {
    console.log("Completed Channel Routes tests.");
    // Restore the original methods after tests
    sinon.restore();
  });

  describe("/POST channel", () => {
    it("it should POST a new channel", (done) => {
      const groupMock = { _id: "12345", name: "Test Group For Channel" };

      // Mock the Group model's save method
      const groupStub = sinon
        .stub(Group.prototype, "save")
        .returns(Promise.resolve(groupMock));

      const channelData = {
        name: "Test Channel",
        group: groupMock._id,
      };

      // Mock the Channel model's save method
      const channelStub = sinon
        .stub(Channel.prototype, "save")
        .returns(Promise.resolve(channelData));

      chai
        .request(app)
        .post("/api/channels")
        .send(channelData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("/GET channels", () => {
    it("it should GET all the channels", (done) => {
      const channelsMock = [{ name: "Channel 1" }, { name: "Channel 2" }];

      // Mock the Channel model's find method
      sinon.stub(Channel, "find").returns(Promise.resolve(channelsMock));

      chai
        .request(app)
        .get("/api/channels")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("/GET channel by ID", () => {
    it("it should GET a channel by the given ID", (done) => {
      const channelMock = { _id: "12345", name: "Test Channel By ID" };

      // Mock the Channel model's findById method
      sinon.stub(Channel, "findById").returns(Promise.resolve(channelMock));

      chai
        .request(app)
        .get(`/api/channels/${channelMock._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name").eql("Test Channel By ID");
          done();
        });
    });
  });

  describe("/PUT channel", () => {
    it("it should UPDATE a channel given the ID", (done) => {
      const channelMock = { _id: "12345", name: "Channel To Update" };
      const updatedChannel = { ...channelMock, name: "Updated Channel" };

      // Mock the Channel model's findByIdAndUpdate method
      sinon
        .stub(Channel, "findByIdAndUpdate")
        .returns(Promise.resolve(updatedChannel));

      chai
        .request(app)
        .put(`/api/channels/${channelMock._id}`)
        .send({ name: "Updated Channel" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("name").eql("Updated Channel");
          done();
        });
    });
  });

  describe("/DELETE channel", () => {
    it("it should DELETE a channel given the ID", (done) => {
      const channelMock = { _id: "12345", name: "Channel To Delete" };

      // Mock the Channel model's findByIdAndDelete method
      sinon
        .stub(Channel, "findByIdAndDelete")
        .returns(Promise.resolve(channelMock));

      chai
        .request(app)
        .delete(`/api/channels/${channelMock._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eql("Channel deleted successfully");
          done();
        });
    });
  });
});
