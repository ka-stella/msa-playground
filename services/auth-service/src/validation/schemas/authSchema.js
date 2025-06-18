const Joi = require('joi');

// ユーザー登録のバリデーションスキーマ
const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'ユーザー名は英数字のみ入力してください',
    'string.min': 'ユーザー名は{#limit}文字以上にしてください',
    'string.max': 'ユーザー名は{#limit}文字以下にしてください',
    'any.required': 'ユーザー名は必須です。',
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
    'string.pattern.base': 'パスワードは英数字のみを含み、3～30文字である必要があります。',
    'any.required': 'パスワードは必須です。',
  }),
});

// ログインのバリデーションスキーマ（例）
const loginUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
};
