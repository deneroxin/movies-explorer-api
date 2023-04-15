const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { authorizeAdmin } = require('../middlewares/auth');
const {
  getAllUsers, getUserById, getCurrentUser, updateUserData,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUserData);

// To be allowed to make the following requests,
// you should send a secret-key in the 'Admin-key' header.
// The same secret key as the token gets verified with,
// is chosen to be used, for simplicity.

router.get('/', authorizeAdmin, getAllUsers);

router.get('/:userId', authorizeAdmin, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

module.exports = router;
