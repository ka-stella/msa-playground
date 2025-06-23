const { registerUser, getUserById } = require('../services/userService');
const { Prisma } = require('@prisma/client');
const { PrismaClientKnownRequestError } = Prisma;
/**
 *
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @returns {Promise<Response>}
 */
async function register(req, res) {
  const { id, username } = req.body;

  try {
    const newUser = await registerUser(Number(id), username);

    res.status(201).json({
      message: 'ユーザーが正常に作成されました。',
      user: newUser,
    });
  } catch (error) {
    // Prismaの既知のエラー
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.error(`ユニーク制約違反: 認証ID '${id}' で重複エラーが発生しました。`, error.meta);
        return res.status(409).json({
          message: 'この認証IDはすでに登録されています。',
        });
      }
      console.error('データベース操作エラー (Prisma): ', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      return res.status(500).json({
        message: 'データベース操作中にエラーが発生しました',
        error: error.message,
      });
    } else {
      // 予期せぬエラー
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
 *
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @returns {Promise<Response>}
 */
async function getProfile(req, res) {
  const { id } = req.params;

  try {
    const user = await getUserById(Number(id));

    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('ユーザープロフィール取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
}

module.exports = {
  register,
  getProfile,
};
