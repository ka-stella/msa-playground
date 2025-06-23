const cors = require('cors');

const corsOptions = () => {
  return cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080', //フロントエンドからのアクセスを許可
    credentials: true, // Cookieをクロスオリジンで送受信するための設定
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
};

module.exports = corsOptions;
