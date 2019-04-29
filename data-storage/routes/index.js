const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to Data-storage API!');
});

module.exports = router;
