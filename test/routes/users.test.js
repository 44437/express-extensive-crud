const request = require("supertest");
const express = require("express");
const UsersRouter = require("../../routes/users");
const UsersRepository = require("../../repository/users");
const connectionPool = require("../../repository");

UsersRepository.prototype.getUsers = jest.fn()
  .mockResolvedValueOnce([{ id: 1, name: "John", surname: "Doe" }])
  .mockRejectedValueOnce("Something went wrong");

UsersRepository.prototype.createUser = jest.fn().mockResolvedValueOnce(1).mockRejectedValueOnce("Something went wrong");

UsersRepository.prototype.getUserByID = jest.fn()
  .mockResolvedValueOnce({ id: 1, name: "John", surname: "Doe" })
  .mockRejectedValueOnce("Something went wrong");

UsersRepository.prototype.updateUser = jest.fn().mockResolvedValueOnce().mockRejectedValueOnce("Something went wrong");

UsersRepository.prototype.deleteUser = jest.fn().mockResolvedValueOnce().mockRejectedValueOnce("Something went wrong");

const mockUsersRepository = new UsersRepository(connectionPool);
const usersRouter = express.Router();

const app = express();
app.use(express.json());
app.use("/users", new UsersRouter(usersRouter, mockUsersRepository).router);

describe("GET /users", function () {
  it("should return a successful response", function () {
    return request(app)
      .get("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .then((response) => {
        expect(response.body[0].id).toEqual(1);
        expect(response.body[0].name).toEqual("John");
        expect(response.body[0].surname).toEqual("Doe");
      });
  });

  it("should return a failed response", function () {
    return request(app)
      .get("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(500)
      .then((response) => {
        expect(response.body.error).toEqual("Something went wrong");
      });
  });
});

describe("POST /users", function () {
  it("should return a successful response", function () {
    return request(app)
      .post("/users")
      .send({ name: "John", surname: "Doe" })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201)
      .then((response) => {
        expect(response.body.id).toEqual(1);
      });
  });

  it("should return a failed response because of the request body", function () {
    return request(app)
      .post("/users")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBeDefined();
      });
  });

  it("should return a failed response because of the layer repository", function () {
    return request(app)
      .post("/users")
      .send({ name: "John", surname: "Doe" })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(500)
      .then((response) => {
        expect(response.body.error).toBeDefined();
      });
  });
});

describe("GET /users/:userID", function () {
  it("should return a successful response", function () {
    return request(app)
      .get("/users/1")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .then((response) => {
        expect(response.body.id).toEqual(1);
        expect(response.body.name).toEqual("John");
        expect(response.body.surname).toEqual("Doe");
      });
  });

  it("should return a failed response", function () {
    return request(app)
      .get("/users/1")
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(500)
      .then((response) => {
        expect(response.body.error).toBeDefined();
      });
  });
});

describe("PUT /users/:userID", function () {
  it("should return a successful response", function () {
    return request(app).put("/users/1").send({ name: "Jane" }).set("Content-Type", "application/json").expect(204);
  });

  it("should return a failed response because of the request body", function () {
    return request(app)
      .put("/users/1")
      .set("Content-Type", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBeDefined();
      });
  });

  it("should return a failed response because of the layer repository", function () {
    return request(app)
      .put("/users/1")
      .send({ name: "Jane" })
      .set("Content-Type", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(500)
      .then((response) => {
        expect(response.body.error).toBeDefined();
      });
  });
});

describe("DELETE /users/:userID", function () {
  it("should return a successful response", function () {
    return request(app).delete("/users/1").expect(204);
  });

  it("should return a failed response", function () {
    return request(app)
      .delete("/users/1")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(500)
      .then((response) => {
        expect(response.body.error).toBeDefined();
      });
  });
});
