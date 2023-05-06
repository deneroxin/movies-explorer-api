const jwt = require('jsonwebtoken');
const { getSecretKey } = require('../utils');
const { UnauthorizedError, Msg } = require('../errors');

module.exports = {

  authorize: (req, res, next) => {
    const token = req.get('Authorization');
    if (!token || !token.startsWith('Bearer ')) {
      next(new UnauthorizedError(Msg.WRONG_TOKEN_FORMAT));
      return;
    }
    try {
      req.user = jwt.verify(token.replace('Bearer ', ''), getSecretKey());
    } catch (err) {
      next(new UnauthorizedError(Msg.TOKEN_INCORRECT));
      return;
    }
    next();
  },

  authorizeAdmin: (req, res, next) => {
    const adminKey = req.get('Admin-key');
    if (adminKey !== getSecretKey()) throw new UnauthorizedError(Msg.UNAUTHORIZED);
    next();
  },
};
