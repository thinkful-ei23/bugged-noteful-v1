'use strict';

const express = require('express');
const morgan = require('morgan');

const data = require('./db/notes');
const simDB = require('./db/simDB');
// const notes = simDB.initialize(data);

const notesRouter = require('./router/notes.router');

const { PORT } = require('./config');

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));
app.use(express.json());

app.use('/api', notesRouter);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


