import Joi from 'joi';


// Validate user form in HTTP request
const check = (query, checker) => !Joi.validate(query, checker).error;

// User schema
const user = Joi.object().keys({
  name: Joi.string().min(2).max(35).required(),
  study: Joi.string().valid('Komtek', 'Data').required(),
  rfid: Joi.string().min(0).required(),
  kaffeScore: Joi.number().min(0).required(),
  year: Joi.number().min(1).max(5).required(),
});


export { check, user };
