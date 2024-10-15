// Import the necessary libraries and modules
const app = require("../server.js"); // Adjust the path if necessary
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const Group = require("../models/groupModel");

// Use Chai HTTP
chai.use(chaiHttp);

describe("Group Routes", () => {
  // Run before all tests
  before(function () {
    console.log("Starting Group Routes tests...");
  });

  // Run after all tests
  after(function () {
    console.log("Completed Group Routes tests.");
  });

  // Test for creating a new group
  describe("/POST group", () => {
    it("it should POST a new group", (done) => {
      const group = {
        name: "Test Group",
        description: "This is a test group",
      };
      chai
        .request(app)
        .post("/api/groups")
        .send(group) // Send the group object
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("name").eql("Test Group");
          done();
        });
    });
  });

  // Test for fetching all groups
  describe("/GET groups", () => {
    it("it should GET all the groups", (done) => {
      chai
        .request(app)
        .get("/api/groups")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  // Test for fetching a group by ID
  describe("/GET group by ID", () => {
    it("it should GET a group by the given ID", (done) => {
      const group = new Group({
        name: "Test Group By ID",
        description: "Test",
      });
      group.save((err, group) => {
        chai
          .request(app)
          .get(`/api/groups/${group._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name").eql("Test Group By ID");
            done();
          });
      });
    });
  });

  // Test for updating a group
  describe("/PUT group", () => {
    it("it should UPDATE a group given the ID", (done) => {
      const group = new Group({ name: "Group To Update", description: "Test" });
      group.save((err, group) => {
        chai
          .request(app)
          .put(`/api/groups/${group._id}`)
          .send({ name: "Updated Group" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("name").eql("Updated Group");
            done();
          });
      });
    });
  });

  // Test for deleting a group
  describe("/DELETE group", () => {
    it("it should DELETE a group given the ID", (done) => {
      const group = new Group({ name: "Group To Delete", description: "Test" });
      group.save((err, group) => {
        chai
          .request(app)
          .delete(`/api/groups/${group._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have
              .property("message")
              .eql("Group deleted successfully");
            done();
          });
      });
    });
  });
});
