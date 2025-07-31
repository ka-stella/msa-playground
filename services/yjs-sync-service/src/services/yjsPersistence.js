const Y = require('yjs');
const redisService = require('./redisService');
const kafkaService = require('./kafkaService');
const logger = require('../utils/logger');
const path = require('path');
const debounce = require('lodash.debounce');

async function bindState(docName, doc) {
  const memoId = path.basename(docName);
  try {
    // Redisから復元
    const savedState = await redisService.getUpdateBuffer(`ydoc:${memoId}`);
    if (savedState) {
      Y.applyUpdate(doc, savedState);
      logger.info(`Restored document from Redis: ${memoId}`);
    }
  } catch (err) {
    logger.error(`Failed to restore doc from Redis (${memoId}):`, err);
  }

  const debounceKafkaSend = debounce(async () => {
    try {
      const ytextTitle = doc.getText(`memo-title-${memoId}`);
      const ytextContent = doc.getText(`memo-content-${memoId}`);
      await kafkaService.sendEvent('memo.update', memoId, {
        id: memoId,
        title: ytextTitle.toString(),
        content: ytextContent.toString(),
      });
    } catch (err) {
      logger.error(`Error sending to kafka ${memoId}:`, err);
    }
  }, 5000);

  const updateHandler = async update => {
    redisService.saveUpdateToRedis(`ydoc:${memoId}`, update).catch(err => {
      logger.error(`Error saving update to Redis for ${memoId}:`, err);
    });
    // Kafka送信はdebounceで遅延実行
    debounceKafkaSend();
  };

  doc.on('update', updateHandler);
  return updateHandler;
}

async function writeState(docName, doc) {
  const memoId = path.basename(docName);
  try {
    const fullState = Y.encodeStateAsUpdate(doc);
    await redisService.set(`ydoc:${memoId}`, fullState);
  } catch (err) {
    logger.error(`Failed to save full state for doc (${memoId}):`, err);
  }
}

module.exports = { bindState, writeState };
