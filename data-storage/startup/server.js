const http = require('http');
const express = require('express');
const logger = require('morgan');

const app = express();
const server = http.createServer(app);

const indexRouter = require('../routes/index');
const vehiclesRouter = require('../routes/vehicles');

// Middleware
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', indexRouter);
app.use('/api/vehicles', vehiclesRouter);

// catch 404
app.use(function(req, res, next) {
  const err = new Error('404 Not Found');
  err.status = 404;

  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err.status == 404) {
    return res.status(404).send(err.message);
  }

  console.log(err.message, err);
  res.status(500).send('Something failed.');
});

// const port = process.env.PORT;
// server.listen(port, () => console.log(`data-storage: Server is up on port ${port}.`));

module.exports = server;
