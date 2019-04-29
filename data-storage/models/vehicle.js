const mongoose = require('mongoose');
const Joi = require('joi');

const vehicleSchema = new mongoose.Schema({
  vehicle: {
    type: String,
    required: true
  },
  time: Number,
  energy: Number,
  gps:[String],
  odo: Number,
  speed: Number,
  soc: Number
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

function validate(msg) {
  const schema = {
    time: Joi.number().integer().allow('', null).required(),
    energy: Joi.number().allow('', null).required(),
    gps: [Joi.string().required(), Joi.string().required()],
    odo: Joi.number().allow('', null).required(),
    speed: Joi.number().integer().allow('', null).required(),
    soc: Joi.number().allow('', null).required()
  };

  return Joi.validate(msg, schema);
}

module.exports = {
  Vehicle,
  validate
}
