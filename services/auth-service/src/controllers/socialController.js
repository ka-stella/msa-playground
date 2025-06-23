const { generateToken } = require('../utils/jwt');
const fs = require('fs');
const path = require('path');

const loginSuccessHtmlPath = path.join(__dirname, '../views/login-success.html');
let loginSuccessHtmlTemplate = '';

//テンプレートファイルを読み込む
fs.readFile(loginSuccessHtmlPath, 'utf8', (err, data) => {
  if (err) {
    console.error('HTMLテンプレートファイルの読み込みに失敗しました:', err);
  } else {
    loginSuccessHtmlTemplate = data;
  }
});

/**
 * ソーシャルログイン コールバック用
 * @param {object} req
 * @param {object} res
 * @returns {Promise<Object>}
 */
async function handleAuthCallback(req, res) {
  if (!req.user) {
    //ソーシャルログインに成功したらreq.userに認証されたユーザ情報が格納されるはず
    console.worn('ソーシャルログイン失敗:req.userが存在しません。');
    return res.redirect(`${process.env.FRONTEND_URL}/#/login?error=ソーシャル認証に失敗しました。`);
  }

  try {
    const user = req.user;
    const token = generateToken({ id: user.id, username: user.username });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: process.env.COOKIE_EXPIRES,
      sameSite: 'Lax',
      path: '/',
      domain: 'localhost',
    });

    if (!loginSuccessHtmlTemplate) {
      console.error('HTMLテンプレートが読み込まれていません。');
      return res.status(500).send('認証成功ページをロードできませんでした。');
    }

    const successHtml = loginSuccessHtmlTemplate.replace(
      'FRONTEND_URL_PLACEHOLDER',
      process.env.FRONTEND_URL || '',
    );

    res.send(successHtml);
  } catch (error) {
    console.error('ソーシャル認証失敗（サーバーエラー）:', {
      message: error.message,
      stack: error.stack,
    });
    return res.redirect(
      `${process.env.FRONTEND_URL}/#/login?error=サーバー内部エラーが発生しました。`,
    );
  }
}

module.exports = {
  handleAuthCallback,
};
