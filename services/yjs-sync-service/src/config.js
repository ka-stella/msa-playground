require('dotenv').config();

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PORT: parseInt(process.env.PORT || '3005', 10),
  REDIS_URL: process.env.REDIS_URL || 'redis://redis:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'yjs-sync-service',
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'kafka:29092',
  MEMO_SERVICE_URL: process.env.MEMO_SERVICE_URL || 'http://localhost:3004',
  YJS_DOC_SAVE_INTERVAL_MS: parseInt(process.env.YJS_DOC_SAVE_INTERVAL_MS || '5000', 10),
};
