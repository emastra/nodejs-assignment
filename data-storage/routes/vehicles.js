const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { Vehicle } = require('../models/vehicle');


router.get('/', async (req, res) => {
  const docs = await Vehicle.find().sort('time');

  res.send(docs);
});

router.get('/:vehicle', async (req, res, next) => {
  try {
    const docs = await Vehicle.find({vehicle: req.params.vehicle}).sort('time');

    res.send(docs);
  } catch (err) {
    return next(err);
  }
});

router.get('/:vehicle/last-update', async (req, res) => {
  const doc = await Vehicle.findOne({vehicle: req.params.vehicle}).sort('-time');
  // Model.findOne(), results may be null
  if (!doc) return res.send([]);

  res.send(doc);
});


module.exports = router;
