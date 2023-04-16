const router = require('express').Router();
const { NotFoundError, Msg } = require('../errors');
const { login, createUser, clearCookie } = require('../controllers/users');
const { authorize } = require('../middlewares/auth');
const { createRateLimiter } = require('../utils');
const validation = require('../middlewares/validation');

router.use(/^\/(?:sign|crash).*/, createRateLimiter(5, 10));

router.get('/crash-test', () => {
  setTimeout(() => { throw new Error(Msg.TEST_SERVER_RECOVER); }, 0);
});

router.post('/signin', validation.signin, login);
router.post('/signup', validation.signup, createUser);
router.get('/signout', clearCookie); // Но я не сохраняю JWT в куках

router.use(createRateLimiter(5, 100), authorize);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError(Msg.PAGE_NOT_FOUND));
});

module.exports = router;
