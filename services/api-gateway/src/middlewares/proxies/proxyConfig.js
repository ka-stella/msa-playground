module.exports = {
  auth: {
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
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
  memoHttp: {
    target: process.env.MEMO_SERVICE_URL || 'http://localhost:3004',
    pathRewrite: { '^/memo': '' },
  },
  memoWs: {
    target: (process.env.MEMO_SERVICE_URL || 'http://localhost:3004').replace(/^http/, 'ws'),
    ws: true,
    pathRewrite: { '^/memo': '' },
  },
};
