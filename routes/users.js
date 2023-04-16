const router = require('express').Router();
const { authorizeAdmin } = require('../middlewares/auth');
const {
  getAllUsers, getUserById, getCurrentUser, updateUserData,
} = require('../controllers/users');
const validation = require('../middlewares/validation');

router.get('/me', getCurrentUser);

router.patch('/me', validation.updateUserData, updateUserData);

// To be allowed to make the following requests,
// you should send a secret-key in the 'Admin-key' header.
// The same secret key as the token gets verified with,
// is chosen to be used, for simplicity.

router.get('/', authorizeAdmin, getAllUsers);

router.get('/:userId', authorizeAdmin, validation.getUserById, getUserById);

module.exports = router;
