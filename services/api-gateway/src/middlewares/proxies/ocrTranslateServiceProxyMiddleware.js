const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * ルーティング
 */
const ocrTranslateServiceProxyMiddleware = createProxyMiddleware({
  target: process.env.OCR_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/ocrx': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(
      `リクエストを転送: ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
    );
  },
  proxyReqOptDecorator: (proxyReq, req) => {
    // JWT検証で取得したユーザー情報をUser Serviceに転送
    if (req.user) {
      // カスタムヘッダーとしてユーザー情報を転送
      proxyReq.headers['X-User-Id'] = req.user.id;
      proxyReq.headers['X-User-Name'] = req.user.username;
    }
    return proxyReq;
  },
  onError: (err, req, res, target) => {
    console.error(`Ocr Translate Serviceへプロキシエラー: ${err.message}`);
    res.status(500).json({ message: 'Ocr Translate Serviceに接続できません。' });
  },
});

module.exports = ocrTranslateServiceProxyMiddleware;
