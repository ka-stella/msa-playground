const express = require('express');
const router = express.Router();
const { register, getProfile } = require('../controllers/userController');
const validate = require('../middlewares/validationMiddleware');
const { registerUserSchema } = require('../validation/userSchema');

// 新規ユーザープロフィール登録
router.post('/register', validate(registerUserSchema, 'body'), register);

// 既存ユーザープロフィール取得
router.get('/profile/:id', getProfile);

// 既存ユーザープロフィール更新
// router.put('/:id', updateUser);

module.exports = router;
