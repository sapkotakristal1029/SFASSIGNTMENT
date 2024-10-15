const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // assuming this is the main app entry point
const User = require("../models/userModel");

const { expect } = chai;
chai.use(chaiHttp);

describe("User API", () => {
  // Cleanup the test database before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Test the creation of a new user
  describe("POST /api/users", () => {
    it("should create a new user", (done) => {
      const newUser = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      chai
        .request(server)
        .post("/api/users")
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("username").equal("testuser");
          done();
        });
    });
  });

  // Test user login
  describe("POST /api/users/login", () => {
    it("should login user with correct credentials", async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      await user.save();

      const loginDetails = {
        username: "testuser",
        password: "password123",
      };

      chai
        .request(server)
        .post("/api/users/login")
        .send(loginDetails)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("username").equal("testuser");
        });
    });

    it("should return an error for invalid login credentials", (done) => {
      const loginDetails = {
        username: "wronguser",
        password: "password123",
      };

      chai
        .request(server)
        .post("/api/users/login")
        .send(loginDetails)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error").equal("User not found");
          done();
        });
    });
  });

  // Test fetching users
  describe("GET /api/users", () => {
    it("should get all users", async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      await user.save();

      chai
        .request(server)
        .get("/api/users")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.equal(1);
        });
    });
  });

  // Test fetching user by ID
  describe("GET /api/users/:id", () => {
    it("should get user by ID", async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      const savedUser = await user.save();

      chai
        .request(server)
        .get(`/api/users/${savedUser._id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("username").equal("testuser");
        });
    });

    it("should return 404 for non-existing user", (done) => {
      const invalidId = "64b0c8b7c39d493244000000"; // random invalid ID

      chai
        .request(server)
        .get(`/api/users/${invalidId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error").equal("User not found");
          done();
        });
    });
  });

  // Test updating a user
  describe("PUT /api/users/:id", () => {
    it("should update a user", async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      const savedUser = await user.save();

      const updatedDetails = { username: "updateduser" };

      chai
        .request(server)
        .put(`/api/users/${savedUser._id}`)
        .send(updatedDetails)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("username").equal("updateduser");
        });
    });
  });

  // Test deleting a user
  describe("DELETE /api/users/:id", () => {
    it("should delete a user", async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      const savedUser = await user.save();

      chai
        .request(server)
        .delete(`/api/users/${savedUser._id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.have.property("message")
            .equal("User deleted successfully");
        });
    });
  });
});
