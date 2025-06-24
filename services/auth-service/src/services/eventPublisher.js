const { connectProducer, sendEvent, disconnectProducer } = require('../kafka/producer');

/**
 * 認証ユーザ登録イベントを発行
 * @param {authUser} user
 */
async function publishUserCreatedEvent(user) {
  try {
    await connectProducer();
    await sendEvent('auth.register', {
      id: user.id,
      username: user.username,
    });
  } catch (err) {
    console.error('Kafkaイベント送信エラー:', err);
  } finally {
    await disconnectProducer();
  }
}

module.exports = { publishUserCreatedEvent };
