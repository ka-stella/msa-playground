const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const { registerUserSchema } = require('../validation/schemas/authSchema');

// ユーザー登録エンドポイント
router.post('/register', validate(registerUserSchema, 'body'), register);

//ログインエンドポイント
router.post('/login', login);

module.exports = router;
