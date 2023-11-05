const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
