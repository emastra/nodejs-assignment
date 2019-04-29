const mongoose = require('mongoose');
const Joi = require('joi');

const incidentSchema = new mongoose.Schema({
  vehicle: {
    type: String,
    required: true
  },
  time: Number,
  energy: Number,
  gps: [String],
  odo: Number,
  speed: Number,
  soc: Number,
  alarm: {
    key: String,
    message: String
  }
});

const Incident = mongoose.model('Incident', incidentSchema);

function checkIncidents(msg) {
  const schema = {
    time: Joi.number().integer().required(),
    energy: Joi.number().max(99).required(),
    gps: [Joi.string().required(), Joi.string().required()],
    odo: Joi.number().required(),
    speed: Joi.number().integer().max(44),
    soc: Joi.number().min(12).required()
  };

  return Joi.validate(msg, schema);
}

module.exports = {
  Incident,
  checkIncidents
}
