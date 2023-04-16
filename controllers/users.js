const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getSecretKey } = require('../utils');
const {
  Status, Msg, NotFoundError, ConflictError,
} = require('../errors');

function checkForConflict(err, next) {
  if (err.code === 11000) {
    next(new ConflictError(Msg.USER_EXISTS));
  } else {
    next(err);
  }
}

module.exports = {

  createUser: (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create([{ ...req.body, password: hash }], { validateBeforeSave: true }))
      .then(([newlyCreatedUser]) => {
        res.status(Status.CREATED).send(newlyCreatedUser);
      })
      .catch((err) => checkForConflict(err, next));
  },

  login: (req, res, next) => {
    const { email, password } = req.body;
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          getSecretKey(),
          { expiresIn: '7d' },
        );
        res.status(Status.OK).send({ ...user, token });
      })
      .catch(next);
  },

  clearCookie: (req, res) => {
    res.clearCookie('jwt', {
      sameSite: 'none',
      secure: true,
    }).status(Status.NO_CONTENT).send({ message: Msg.SIGNOUT });
  },

  getCurrentUser: (req, res, next) => {
    User.findById(req.user._id)
      .then((user) => {
        if (!user) throw new NotFoundError(Msg.YOU_ARENT_FOUND);
        res.status(Status.OK).send(user);
      })
      .catch(next);
  },

  updateUserData: (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true })
      .then((updatedUserData) => {
        // поскольку req.user._id берётся из payload токена, а не путём поиска в базе данных,
        // то нет уверенности, что в базе данных такой пользователь всё ещё есть.
        // За время хранения токена база данных могла быть повреждена, и пользователь удалился.
        if (!updatedUserData) throw new NotFoundError(Msg.YOU_ARENT_FOUND);
        res.status(Status.OK).send(updatedUserData);
      })
      .catch((err) => checkForConflict(err, next));
  },

  getAllUsers: (req, res, next) => {
    User.find({})
      .sort('email')
      .then((arrayOfUsers) => {
        res.status(Status.OK).send(arrayOfUsers);
      })
      .catch(next);
  },

  getUserById: (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
      .then((user) => {
        if (!user) throw new NotFoundError(Msg.USER_NOT_FOUND);
        res.status(Status.OK).send(user);
      })
      .catch(next);
  },
};
