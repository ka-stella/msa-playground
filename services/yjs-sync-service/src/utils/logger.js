const config = require('../config');
const winston = require('winston');

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`),
  ),
  transports: [
    // コンソールに出力
    new winston.transports.Console(),
    // ファイルにも出力する場合
    // new winston.transports.File({ filename: 'combined.log' })
  ],
});

module.exports = logger;
