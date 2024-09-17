const Joi = require("joi");

const UserReq = Joi.object({
  id: Joi.number(),
  name: Joi.string().required(),
  surname: Joi.string(),
});

const UserDB = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  surname: Joi.string().allow(null),
});

const UserRes = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  surname: Joi.alternatives().try(
    Joi.string(),
    Joi.any().strip()
  ),
  username: Joi.string(),
});

module.exports = { UserReq, UserDB, UserRes };
