const jwt = require('jsonwebtoken');
const { getSecretKey } = require('../utils');
const { UnauthorizedError, Msg } = require('../errors');

module.exports = {

  authorize: (req, res, next) => {
    try {
      const token = req.get('Authorization');
      if (!token || !token.startsWith('Bearer ')) throw new Error();
      req.user = jwt.verify(token.replace('Bearer ', ''), getSecretKey());
      next();
    } catch (err) {
      next(new UnauthorizedError(Msg.UNAUTHORIZED));
    }
  },

  authorizeAdmin: (req, res, next) => {
    const adminKey = req.get('Admin-key');
    if (adminKey !== getSecretKey()) throw new UnauthorizedError(Msg.UNAUTHORIZED);
    next();
  },
};
