const express = require("express");
const { StatusCodes } = require("http-status-codes");
const User = require("../model/user");

const router = express.Router();
let users = [];

router.get("/", (req, res) => {
  res.send(users);
});

router.post("/", (req, res) => {
  const { error, value: user } = User.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
  }

  user.id = users.length;
  users.push(user);

  return res.status(StatusCodes.CREATED).json({ id: user.id });
});

router.get("/:userID", (req, res) => {
  const expectedId = Number(req.params.userID);
  const index = users.findIndex((user) => user.id === expectedId);

  if (index !== -1) {
    return res.send(users[index]);
  }

  return res.sendStatus(StatusCodes.NOT_FOUND);
});

router.put("/:userID", (req, res) => {
  const expectedId = Number(req.params.userID);
  const { error, value: reqUser } = User.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
  }

  const index = users.findIndex((user) => user.id === expectedId);
  if (index !== -1) {
    reqUser.id = users[index].id;
    users[index] = reqUser;

    return res.sendStatus(StatusCodes.OK);
  }

  return res.sendStatus(StatusCodes.BAD_REQUEST);
});

router.delete("/:userID", (req, res) => {
  users = users.filter((user) => user.id != req.params.userID);
  res.sendStatus(StatusCodes.OK);
});

router.patch("/:userID", (req, res) => {
  const expectedId = Number(req.params.userID);
  const { error, value: reqUser } = User.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
  }

  const index = users.findIndex((user) => user.id === expectedId);
  const user = users[index];
  if (index !== -1) {
    for (const userField in reqUser) {
      if (userField === "id") {
        continue;
      }

      user[userField] = reqUser[userField];
    }

    return res.sendStatus(StatusCodes.OK);
  }

  return res.sendStatus(StatusCodes.BAD_REQUEST);
});

module.exports = router;
