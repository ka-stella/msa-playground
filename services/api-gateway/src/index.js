const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).send('API Gateway is healthy!');
});

/**
 * Auth Service のルーティング
 * '/auth/*' のリクエストを Auth Service に転送
 * 例: /auth/register -> /register
 */
app.use(
  '/auth',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/auth': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying request: ${req.method} ${req.url} -> <span class="math-inline">\{proxyReq\.protocol\}//</span>{proxyReq.host}${proxyReq.path}`,
      );
    },
  }),
);

/**
 * User Service のルーティング
 * '/user/*' のリクエストを User Service に転送
 */
app.use(
  '/users',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/users': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying request: ${req.method} ${req.url} -> <span class="math-inline">\{proxyReq\.protocol\}//</span>{proxyReq.host}${proxyReq.path}`,
      );
    },
  }),
);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
