require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { Status, Msg, InternalServerError } = require('./errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001 } = process.env;
const allowedCors = [
  'https://diploma.deneroxin.nomoredomains.monster',
  'http://localhost:3001',
];
const ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const app = express();

app.use(helmet());
app.use(express.json());

app.use(requestLogger);

app.use((req, res, next) => {
  const { origin } = req.headers;
  const headers = allowedCors.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin } : {};
  if (req.method === 'OPTIONS') {
    res.set({
      ...headers,
      'Access-Control-Allow-Methods': ALLOWED_METHODS,
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

app.use((err, req, res, next) => {
  const { statusCode = InternalServerError.code } = err;
  const message = (statusCode === InternalServerError.code)
    ? Msg.INTERNAL_ERROR : err.message;
  res.status(statusCode).send({ message });
  next();
});

mongoose.connect('mongodb://0.0.0.0:27017/bitfilmsdb');

app.listen(PORT);
