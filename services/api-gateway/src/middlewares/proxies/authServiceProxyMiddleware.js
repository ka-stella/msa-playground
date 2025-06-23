const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Auth Service のルーティング
 * '/auth/*' のリクエストを Auth Service に転送
 * 例: /auth/register -> /register
 */
const authServiceProxyMiddleware = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '',
  },
  logLevel: 'debug',
  timeout: 10000,
  onProxyReq: (proxyReq, req, res) => {
    console.log(
      `リクエストを転送: ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
    );
  },
  onError: (err, req, res, target) => {
    console.error(`プロキシエラー: ${err.message} for ${req.url}`);
    res.status(500).send('プロキシエラーが発生しました。');
  },
});

module.exports = authServiceProxyMiddleware;
