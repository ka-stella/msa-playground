const kafka = require('../config/kafkaClient');
const { registerUser } = require('../services/userService');

const consumer = kafka.consumer({ groupId: 'user-service-group' });

/**
 * auth serviceが発行したイベントを購読、ユーザを作成
 */
async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'auth.register', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log('user-service が購読:', payload);

      if (!payload.id || !payload.username) {
        console.warn('idとusernameが存在しないため処理をスキップ:', payload);
        return;
      }
      await registerUser(payload.id, payload.username);
    },
  });
}

module.exports = { startConsumer };
