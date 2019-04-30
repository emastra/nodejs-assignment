const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const asyncWrap = require('../middleware/asyncWrapper');

const { Vehicle } = require('../models/vehicle');


// GET /api/vehicles
router.get('/', asyncWrap(async (req, res, next) => {
    const docs = await Vehicle.find().sort('time');

    res.send(docs);
}));

// GET /api/vehicles/:vehicle
router.get('/:vehicle', asyncWrap(async (req, res, next) => {
    const docs = await Vehicle.find({vehicle: req.params.vehicle}).sort('time');

    res.send(docs);
}));

// GET /api/vehicles/:vehicle/last-update
router.get('/:vehicle/last-update', asyncWrap(async (req, res, next) => {
    const doc = await Vehicle.findOne({vehicle: req.params.vehicle}).sort('-time');
    // Model.findOne() may be null
    if (!doc) return res.send([]);

    res.send(doc);
}));


module.exports = router;
