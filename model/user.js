const Joi = require("joi");

const UserReq = Joi.object({
  id: Joi.number(),
  name: Joi.string(),
  surname: Joi.string(),
});

const UserDB = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
  surname: Joi.string(),
});

const UserRes = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
  surname: Joi.string(),
  username: Joi.string(),
});

module.exports = { UserReq, UserDB, UserRes };
