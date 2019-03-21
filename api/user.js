import Joi from 'joi';


// Validate user form in HTTP request
const check = (query, checker) => !Joi.validate(query, checker).error;

// User schema
const user = Joi.object().keys({
  name: Joi.string().min(2).max(35).required(),
  study: Joi.string().valid('komtek', 'data').required(),
  rfid: Joi.number().min(0).required(),
  kaffeScore: Joi.number().min(0).required(),
});


export { check, user };
