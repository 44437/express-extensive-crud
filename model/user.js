const Joi = require("joi");

const User = Joi.object({
  id: Joi.number(),
  name: Joi.string(),
  surname: Joi.string(),
});

module.exports = User;
