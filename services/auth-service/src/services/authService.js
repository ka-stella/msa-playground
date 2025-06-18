const prisma = require('../config/prisma');

/**
 * ユーザ登録
 * @param {string} username
 * @param {string} passwordHash
 * @param {string} [provider] ソーシャルログインプロバイダー名 (例: 'google')
 * @param {string} [providerUserId] ソーシャルログインプロバイダーのユーザーID
 * @returns {Promise<object>}
 */
async function registerUser(username, passwordHash, provider = null, providerUserId = null) {
  try {
    const newUser = await prisma.authUser.create({
      data: {
        username: username,
        passwordHash: passwordHash,
        provider: provider,
        providerUserId: providerUserId,
      },
    });
    return newUser;
  } catch (error) {
    throw error;
  }
}

/**
 * ユーザ名からユーザ情報を取得
 * @param {string} username
 * @returns {Promise<object>}
 */
async function findUserByUserName(username) {
  try {
    const user = await prisma.authUser.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * idからユーザ情報を取得
 * @param {int} id
 * @returns {Promise<object>}
 */
async function findUserById(id) {
  try {
    const user = await prisma.authUser.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * プロファイルからユーザーを検索し、存在しなければ新規作成する
 * @param {string} provider プロバイダー名
 * @param {string} providerUserId 各プロバイダーでのユーザー固有のID
 * @param {string} usernameBase ユーザー名を生成するためのベースとなる値（メールアドレス、表示名など）
 * @returns {Promise<Object>}
 */
async function findOrRegisterUser(provider, providerUserId, usernameBase) {
  try {
    let user = await prisma.authUser.findUnique({
      where: {
        provider_providerUserId: {
          provider: provider,
          providerUserId: providerUserId,
        },
      },
    });

    if (!user) {
      //ユーザ名がユニークになるように命名
      let uniqueUsername = usernameBase;
      let counter = 0;
      while (await prisma.authUser.findUnique({ where: { username: uniqueUsername } })) {
        uniqueUsername = `${usernameBase}_${++counter}`;
        if (counter > 100) {
          throw new Error(`ユーザ名の生成に失敗しました。（${counter}回試行）`);
        }
      }

      user = await prisma.authUser.create({
        data: {
          username: uniqueUsername,
          passwordHash: null,
          provider: provider,
          providerUserId: providerUserId,
        },
      });
    }
    return user;
  } catch (error) {
    console.error('findOrRegisterUserのエラー', error);
    throw error;
  }
}

module.exports = {
  registerUser,
  findUserByUserName,
  findUserById,
  findOrRegisterUser,
};
