const Redis = require('ioredis');
const config = require('../config');
const logger = require('../utils/logger');

class RedisService {
  constructor() {
    this.publisher = new Redis(config.REDIS_URL);
    this.subscriber = new Redis(config.REDIS_URL);
    this.subscriptions = new Map(); // channel -> handler
  }

  // バイナリデータをBase64文字列として取得
  async get(key) {
    return this.publisher.get(key);
  }

  // バイナリデータまたは文字列をそのまま保存
  async set(key, value) {
    return this.publisher.set(key, value);
  }

  // RedisからBase64文字列を取り出し、Bufferに戻すユーティリティ
  async getUpdateBuffer(key) {
    try {
      const base64 = await this.get(key);
      if (!base64) return null;
      return Buffer.from(base64, 'base64');
    } catch (err) {
      logger.error(`Failed to get update buffer from Redis for key: ${key}`, err);
      throw err;
    }
  }

  // Y.DocにRedisから復元処理を行う
  async restoreUpdateFromRedis(doc, key) {
    try {
      const updateBuffer = await this.getUpdateBuffer(key);
      if (updateBuffer) {
        Y.applyUpdate(doc, updateBuffer);
        logger.info(`Restored Y.Doc from Redis key: ${key}`);
      }
    } catch (err) {
      logger.error(`Failed to restore doc from Redis key: ${key}`, err);
      throw err;
    }
  }

  // Y.DocのupdateをBase64に変換してRedisに保存
  async saveUpdateToRedis(key, update) {
    try {
      const base64 = Buffer.from(update).toString('base64');
      await this.set(key, base64);
      logger.info(`Saved update to Redis key: ${key}`);
    } catch (err) {
      logger.error(`Failed to save update to Redis key: ${key}`, err);
      throw err;
    }
  }

  async subscribe(channel, handler) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) handler(msg);
    });
    this.subscriptions.set(channel, handler);
  }

  async unsubscribe(channel) {
    await this.subscriber.unsubscribe(channel);
    this.subscriptions.delete(channel);
  }

  async publish(channel, message) {
    return this.publisher.publish(channel, message);
  }
}

module.exports = new RedisService();
