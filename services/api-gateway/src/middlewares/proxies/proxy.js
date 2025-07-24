const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../../utils/logger');
const config = require('./proxyConfig');

function createProxy(config) {
  const defaults = {
    changeOrigin: true,
    onError: handleError,
    onProxyReq: logRequest,
    proxyReqOptDecorator: decorateProxyReq,
    logLevel: 'debug',
    logger: logger,
  };
  return createProxyMiddleware({ ...defaults, ...config });
}

function handleError(err, req, res) {
  console.error(`[ERROR] ${err.message}`);
  logger.error(`[ERROR] ${req.method} ${req.url}: ${err.message}`);
  res.status(502).json({ error: 'Bad Gateway' });
}

function logRequest(proxyReq, req) {
  logger.info(
    `[Proxy] ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
  );
  logger.debug(`[ProxyReq Path Check] proxyReq.path: ${proxyReq.path}`);
}

function decorateProxyReq(proxyReq, req) {
  // 特定の条件で装飾をスキップ
  if (req.path.startsWith('/auth')) {
    return proxyReq;
  }

  // ユーザー情報があればヘッダーに追加
  if (req.user) {
    proxyReq.headers['X-User-Id'] = req.user.id;
    proxyReq.headers['X-User-Role'] = req.user.role;
  }
  return proxyReq;
}

module.exports = {
  authServiceProxyMiddleware: createProxy(config.auth),
  userServiceProxyMiddleware: createProxy(config.user),
  ocrxServiceProxyMiddleware: createProxy(config.ocrx),
  httpMemoServiceProxyMiddleware: createProxy(config.memoHttp),
  wsMemoServiceProxyMiddleware: createProxy(config.memoWs),
};
