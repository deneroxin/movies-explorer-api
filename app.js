require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { Status, generalErrorHandler } = require('./errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const config = require('./config');

const app = express();

app.use(helmet());
app.use(express.json());

app.use(requestLogger);

app.use((req, res, next) => {
  const { origin } = req.headers;
  const headers = config.allowedCors.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin } : {};
  if (req.method === 'OPTIONS') {
    res.set({
      ...headers,
      'Access-Control-Allow-Methods': config.allowedMethods,
      'Access-Control-Allow-Headers': req.headers['access-control-request-headers'],
    }).status(Status.NO_CONTENT).end();
  } else {
    res.set(headers);
    next();
  }
});

app.use(require('./routes'));

app.use(errorLogger);
app.use(errors());

app.use(generalErrorHandler);

mongoose.connect(config.databaseAddress);

app.listen(config.port);
