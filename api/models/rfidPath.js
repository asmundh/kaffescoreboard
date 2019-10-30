import Joi from 'joi';


// Validate user form in HTTP request
const rfidPathCheck = (query, checker) => !Joi.validate(query, checker).error;

// User schema
const rfidPath = Joi.object().keys({
  rfid: Joi.string().length(8).required(),
  timeStamp: Joi.date().required(),
});


export { rfidPathCheck, rfidPath };
