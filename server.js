'use strict';

const express = require('express');
// const morgan = require('morgan');
const data = require('./db/notes');
const { PORT } = require('./config');
const { myLogger } = require('./middleware/logger');
const app = express();

// app.use(morgan('dev'));
app.use(express.static('public'));

app.use(myLogger);

app.get('/api/notes', (req, res) => {
  const search = req.query.searchTerm;
  if (search) {
    let filteredList = data.filter(item => item.title.includes(search));
    res.json(filteredList);
  } else {
    res.json(data);
  }
  // const { searchTerm } = req.query;
  // res.json{searchTerm ? data.filter}
});
app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  let note = data.find(item => item.id === Number(id));
  res.json(note);

  // res.json{data.find(item => item.id === Number(id))};
});


app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
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