const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./proxyConfig');

function createProxy(config) {
  const defaults = {
    changeOrigin: true,
    onError: handleError,
    onProxyReq: logRequest,
    proxyReqOptDecorator: decorateProxyReq,
    logLevel: 'debug',
    logger: {
      log: (...args) => console.log('[Proxy]', ...args),
      debug: (...args) => console.debug('[Proxy Debug]', ...args),
      info: (...args) => console.info('[Proxy Info]', ...args),
      warn: (...args) => console.warn('[Proxy Warn]', ...args),
      error: (...args) => console.error('[Proxy Error]', ...args),
    },
  };
  return createProxyMiddleware({ ...defaults, ...config });
}

function handleError(err, req, res) {
  console.error(`[ERROR] ${err.message}`);
  res.status(502).json({ error: 'Bad Gateway' });
}

function logRequest(proxyReq, req) {
  console.log(
    `[Proxy] ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
  );
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
  memoServiceProxyMiddleware: createProxy(config.memo),
  yjsSyncServiceProxyMiddleware: createProxy(config.ySync),
};
