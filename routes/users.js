const router = require('express').Router();
// const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  updateUserInfo, getUserInfo,
} = require('../controllers/users');
// const { userDataValidator } = require('../utils/validators');

router.get('/me', auth, getUserInfo);
router.patch('/me', auth, updateUserInfo);

module.exports = router;
