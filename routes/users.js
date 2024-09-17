const { StatusCodes } = require("http-status-codes");
const { UserReq } = require("../model/user");

function UsersRouter(router, usersRepository) {
  this.router = router;
  this.usersRepository = usersRepository;

  this.router.get("/", (req, res) => {
    usersRepository
      .getUsers()
      .then((users) => res.send(users))
      .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
  });

  this.router.post("/", (req, res) => {
    const { error, value: user } = UserReq.validate(req.body);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error });
    }

    this.usersRepository
      .createUser(user)
      .then((id) => res.status(StatusCodes.CREATED).json({ id: id }))
      .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
  });

  this.router.get("/:userID", (req, res) => {
    this.usersRepository
      .getUserByID(Number(req.params.userID))
      .then((user) => res.send(user))
      .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
  });

  this.router.put("/:userID", (req, res) => {
    const { error, value: user } = UserReq.validate(req.body);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
    }

    this.usersRepository
      .updateUser(user, Number(req.params.userID))
      .then((_) => res.sendStatus(StatusCodes.NO_CONTENT))
      .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
  });

  this.router.delete("/:userID", (req, res) => {
    this.usersRepository
      .deleteUser(Number(req.params.userID))
      .then((_) => res.sendStatus(StatusCodes.NO_CONTENT))
      .catch((error) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error }));
  });
}

module.exports = UsersRouter;
