const express = require('express');

const app = express();

const cookies = require('cookie-parser');

const cors = require('cors');

const bodyParser = require('body-parser');

const errorHandler = require('./api/middlewares/errorHandler');

const router = require('./api/routes');

const corsOptions = require('./config/cors');

app.use(express.json());
app.use(cookies());

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cors(corsOptions));

app.use(router);

// error handler
app.use(errorHandler);

module.exports = app;
