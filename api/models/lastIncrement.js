import joi from 'joi';

const lastIncrementModel = joi.object().keys({
  rfid: joi.string.length(8).required(),
  timeStamp: joi.date().required(),
});

export default lastIncrementModel;

// const rfidPath = Joi.object().keys({
//     rfid: Joi.string().length(8).required(),
//     timeStamp: Joi.date().required(),
//   });
