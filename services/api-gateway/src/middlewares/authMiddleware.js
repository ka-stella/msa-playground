const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('環境変数 JWT_SECRET が設定されていません。');
  process.exit(1);
}

//認証不要なパス
const EXEMPT_PATHS = [
  '/auth/login',
  '/logout',
  '/auth/register',
  '/auth/social/google',
  '/auth/social/google/callback',
  '/health',
];

const authMiddleware = (req, res, next) => {
  if (EXEMPT_PATHS.includes(req.path) || req.method === 'OPTIONS') {
    return next();
  }

  const jwtCookie = req.cookies && req.cookies.jwt;

  if (!jwtCookie) {
    console.warn('認証トークンがありません。');
    return res.status(401).json({ message: '認証トークンがありません。ログインしてください' });
  }

  if (req.user) {
    proxyReq.headers['X-User-Id'] = req.user.id;
    proxyReq.headers['X-User-Role'] = req.user.role;
    console.log(`Proxyヘッダーにユーザ情報を追加: ID=${req.user.id}, ROLE=${req.user.role}`);
  }

  try {
    const decoded = jwt.verify(jwtCookie, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(`JWT検証成功 ユーザID: ${decoded.id}`);
    next();
  } catch (error) {
    console.error('JWT検証失敗 :', error.message);
    return res.status(401).json({ message: '認証トークンが無効です。ログインしてください。' });
  }
};

module.exports = authMiddleware;
