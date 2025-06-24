const kafka = require('../config/kafkaClient');
const producer = kafka.producer();

/**
 * Kafkaプロデューサーと接続
 */
async function connectProducer() {
  await producer.connect();
}

/**
 * 指定されたトピックにイベントを送信
 *
 * @param {string} topic Kafkaのトピック名
 * @param {*} payload 送信したいデータ
 */
async function sendEvent(topic, payload) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }],
  });
}

/**
 * Kafkaプロデューサーとの接続を切断
 */
async function disconnectProducer() {
  await producer.disconnect();
}

module.exports = {
  connectProducer,
  sendEvent,
  disconnectProducer,
};
