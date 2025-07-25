require('dotenv').config();

const express = require('express');
const http = require('http');
const corsOptions = require('./config/cors');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/authMiddleware');
const proxy = require('./middlewares/proxies/proxy');
const app = express();
const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';

// CORS設定
app.use(corsOptions());
//Cookieパーサー
app.use(cookieParser());
//jwt検証
app.use(authMiddleware);

// ヘルスチェックエンドポイント
if (!isProduction) {
  app.get('/health', (req, res) => {
    res.status(200).send('API Gateway is healthy!');
  });
}

// 認証状態確認エンドポイント
app.get('/auth/check', (req, res) => {
  res.status(200).json({
    isAuthenticated: true,
    user: {
      id: req.user.id,
      username: req.user.username,
    },
  });
});

//プロキシの設定
app.use('/auth', proxy.authServiceProxyMiddleware);
app.use('/user', proxy.userServiceProxyMiddleware);
app.use('/ocrx', proxy.ocrxServiceProxyMiddleware);
app.use('/memo', proxy.httpMemoServiceProxyMiddleware);

/**
 * <attention>
 * プロキシでヘッダー装飾をいじっているので
 * プロキシより後ろにする必要がある
 */
app.use(express.json());

// --- ログアウトエンドポイント---
app.post('/logout', (req, res) => {
  //cookieをクリア
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'Lax',
    path: '/',
    domain: 'localhost',
  });
  console.log('JWT Cookieをクリアしました。');
  res.status(200).json({ message: 'ログアウトしました。' });
});

const server = http.createServer(app);
server.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/memo')) {
    proxy.wsMemoServiceProxyMiddleware.upgrade(req, socket, head);
  }
});

server.listen(8000, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
