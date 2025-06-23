const Joi = require('joi');

// ユーザー登録のバリデーションスキーマ
const registerUserSchema = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().required(),
});

module.exports = {
  registerUserSchema,
};
