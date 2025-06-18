const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { registerUser, findUserByUserName } = require('../services/authService');
const { Prisma } = require('@prisma/client');
const { PrismaClientKnownRequestError } = Prisma;

/**
 * ユーザ登録
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @returns
 */
async function register(req, res) {
  const { username, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    const newUser = await registerUser(username, passwordHash);
    console.log(`ユーザ登録処理成功 ユーザ名: ${newUser.username} (ID: ${newUser.id})`);
    res.status(201).json({ message: 'ユーザ登録成功', userId: newUser.id });
  } catch (error) {
    // Prismaの既知のエラー
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.error(
          `ユニーク制約違反: ユーザー名 '${username}' で重複エラーが発生しました。`,
          error.meta,
        );
        return res.status(409).json({
          message: 'このユーザー名はすでに使用されている可能性があります。',
        });
      }
      console.error('データベース操作エラー (Prisma): ', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      return res.status(500).json({
        message: 'データベース操作中にエラーが発生しました',
        error: { code: error.code, details: error.meta },
      });
    } else {
      // 予期せぬエラー（例: bcryptのエラーなど）
      console.error('サーバー内部エラー: ', {
        message: error.message,
        stack: error.stack,
      });
      return res.status(500).json({
        message: 'サーバー内部で予期せぬエラーが発生しました',
        error: error.message,
      });
    }
  }
}

/**
 * ログイン
 * @param {object} req
 * @param {object} res
 */
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await findUserByUserName(username);

    if (!user) {
      console.warn(`ログイン失敗: ユーザー名 '${username}' が見つかりません。`);
      return res.status(401).json({ message: 'ユーザー名またはパスワードが不正です。' });
    }

    //パスワードの比較
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      console.warn(`ログイン失敗: ユーザー名 '${username}' のパスワードが不正です。`);
      return res.status(401).json({ message: 'ユーザー名またはパスワードが不正です。' });
    }

    //JWTトークンの生成
    const token = generateToken({ id: user.id, username: user.username });

    console.log(`ログイン成功: ユーザー名 '${username}' (ID: ${user.id})`);
    res.status(200).json({ message: '認証成功。', token });
  } catch (error) {
    console.error('認証失敗（サーバーエラー）:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'サーバー内部エラーが発生しました。' });
  }
}

module.exports = {
  register,
  login,
};
