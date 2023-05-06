const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { UnauthorizedError, Msg } = require('../errors');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: true,
      unique: true,
      required: true,
      validate: {
        validator: validator.isEmail,
        message: Msg.WRONG_EMAIL_FORMAT,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
  },
  {
    toJSON: {
      transform: function removePassword(doc, ret) {
        const retAlias = ret; // linter ругается, но нет уверенности, что добавление лишних
        delete retAlias.password; //                      игнорирующих опций будет одобрено:
        return retAlias; //                no-param-reassign: ["error", { "props": false }]
      },
    },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').lean()
    .then((user) => {
      if (!user) throw new UnauthorizedError(Msg.WRONG_CREDENTIALS);
      const { password: hash, ...userData } = user;
      return bcrypt.compare(password, hash)
        .then((matched) => {
          if (!matched) throw new UnauthorizedError(Msg.WRONG_CREDENTIALS);
          return userData;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
