const { Kafka } = require('kafkajs');
const config = require('../config');
const logger = require('../utils/logger');

class KafkaService {
  constructor() {
    this.producer = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      const kafka = new Kafka({
        clientId: config.KAFKA_CLIENT_ID,
        brokers: [config.KAFKA_BROKER],
        retry: {
          maxRetryTime: 30000,
          initialRetryTime: 1000,
          retries: 5,
        },
      });

      this.producer = kafka.producer();
      await this.producer.connect();
      this.isInitialized = true;

      logger.info('Kafka Producer initialized successfully');
    } catch (error) {
      logger.error('Kafka initialization failed:', error);
      throw error;
    }
  }

  async sendEvent(topic, key, payload) {
    if (!this.isInitialized) {
      throw new Error('Kafka producer not initialized');
    }

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: String(key),
            value: JSON.stringify(payload),
            timestamp: Date.now(),
          },
        ],
      });

      logger.debug(`Event sent to ${topic}`);
    } catch (error) {
      logger.error('Failed to send Kafka event:', { topic, key, error });
      throw error;
    }
  }

  async disconnect() {
    if (this.producer && this.isInitialized) {
      try {
        await this.producer.disconnect();
        logger.info('Kafka producer disconnected');
      } catch (error) {
        logger.error('Error disconnecting Kafka producer:', error);
      } finally {
        this.producer = null;
        this.isInitialized = false;
      }
    }
  }
}

module.exports = new KafkaService();
