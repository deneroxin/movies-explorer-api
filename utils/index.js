const rateLimiter = require('express-rate-limit');

const { GeneralError } = require('../errors');

function createRateLimiter(minutes, tries) {
  return rateLimiter({
    windowMs: minutes * 60 * 1000,
    max: tries,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next, { message, statusCode }) => {
      next(new GeneralError(message, statusCode));
    },
  });
}

function getSecretKey() {
  const { NODE_ENV, JWT_SECRET } = process.env;
  return NODE_ENV === 'production' ? JWT_SECRET : 'hardcoded_secret_key';
}

module.exports = {
  createRateLimiter,
  getSecretKey,
};
