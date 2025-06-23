const prisma = require('../config/prisma');

/**
 * ユーザ登録
 * @param {string} id 認証id
 * @param {string} nickname 表示用名前
 * @returns {Promise<object>}
 */
async function registerUser(id, nickname) {
  return await prisma.user.create({
    data: {
      id: id,
      nickname: nickname,
    },
  });
}

/**
 * ユーザプロフィール取得
 * @param {string} id 認証id
 * @returns {Promise<object>}
 */
async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      nickname: true,
    },
  });
}

module.exports = {
  registerUser,
  getUserById,
};
