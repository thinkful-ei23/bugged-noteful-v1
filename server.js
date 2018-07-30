'use strict';

const express = require('express');

const data = require('./db/notes');

const app = express();

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  const search = req.query.searchTerm;
  if (search) {
    let searchResults = data.filter(item => item.title.includes(search));
    res.json(searchResults);
  } else {
    res.json(data);
  }
});
app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  // let requestedData;
  // for (let i = 0; i < data.length; i++) {
  //   if (data[i].id === Number(id)) {
  //     requestedData = data[i];
  //   }
  // }
  const note = data.find(item => item.id === Number(id));
  console.log(note);
  res.json(note);
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});