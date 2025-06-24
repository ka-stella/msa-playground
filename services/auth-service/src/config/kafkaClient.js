const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID || 'auth-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
});

module.exports = kafka;
