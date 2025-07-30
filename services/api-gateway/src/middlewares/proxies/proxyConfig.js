module.exports = {
  auth: {
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    pathRewrite: { '^/auth': '' },
  },
  user: {
    target: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    pathRewrite: { '^/user': '' },
  },
  ocrx: {
    target: process.env.OCR_SERVICE_URL || 'http://localhost:3003',
    pathRewrite: { '^/ocrx': '' },
  },
  memo: {
    target: process.env.MEMO_SERVICE_URL || 'http://localhost:3004',
    pathRewrite: { '^/memo': '' },
  },
  ySync: {
    target: process.env.YJS_SYNC_SERVICE_URL || 'http://localhost:3005',
    ws: true,
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
      console.log('WebSocketプロキシリクエスト');
    },
    onOpen: proxySocket => {
      console.log('WebSocket接続オープン');
    },
    onClose: proxySocket => {
      console.log('WebSocket接続クローズ');
    },
    onError: (err, req, res) => {
      console.error('Yjs Sync Service WebSocketプロキシエラー:', err);
    },
  },
};
