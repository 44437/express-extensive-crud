const express = require("express");
const { StatusCodes } = require("http-status-codes");
const UsersRepository = require("../repository/users");
const { UserReq } = require("../model/user");

const router = express.Router();

router.get("/", (req, res) => {
  UsersRepository.getUsers()
    .then((users) => res.send(users))
    .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
});

router.post("/", (req, res) => {
  const { error, value: user } = UserReq.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error });
  }

  UsersRepository.createUser(user)
    .then((id) => res.status(StatusCodes.CREATED).json({ id: id }))
    .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
});

router.get("/:userID", (req, res) => {
  UsersRepository.getUserByID(Number(req.params.userID))
    .then((user) => res.send(user))
    .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
});

router.put("/:userID", (req, res) => {
  const { error, value: user } = UserReq.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
  }

  UsersRepository.updateUserPUT(user, Number(req.params.userID))
    .then((_) => res.sendStatus(StatusCodes.OK))
    .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
});

router.delete("/:userID", (req, res) => {
  UsersRepository.deleteUser(Number(req.params.userID))
    .then((_) => res.sendStatus(StatusCodes.OK))
    .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
});

router.patch("/:userID", (req, res) => {
  const expectedId = Number(req.params.userID);
  const { error, value: reqUser } = User.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error });
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
