const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { NotFoundError, Msg } = require('../errors');
const { login, createUser } = require('../controllers/users');
const { authorize } = require('../middlewares/auth');
const { createRateLimiter } = require('../utils');

router.use(['/sign', '/crash'], createRateLimiter(5, 10));
router.use(['/users', '/movies'], createRateLimiter(5, 100), authorize);

router.get('/crash-test', () => {
  setTimeout(() => { throw new Error(Msg.TEST_SERVER_RECOVER); }, 0);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError(Msg.PAGE_NOT_FOUND));
});

module.exports = router;
