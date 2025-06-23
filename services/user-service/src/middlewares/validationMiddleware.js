const Joi = require('joi');

/**
 * バリデーションミドルウェア
 * @param {Joi.Schema} schema
 * @param {'body' | 'params' | 'query'} property
 */
const validate = (schema, property) => (req, res, next) => {
  const { error } = schema.validate(req[property], { abortEarly: false }); // abortEarly: false で全てのエラーを収集

  if (error) {
    const errors = error.details.map(detail => detail.message);
    console.warn('バリデーションエラー:', errors);
    return res.status(400).json({
      message: errors[0] || '入力データに問題があります。',
      errors: errors,
    });
  }
  next();
};

module.exports = validate;
