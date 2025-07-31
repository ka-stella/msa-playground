const config = require('./config');
const { WebSocketServer } = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;
const redisService = require('./services/redisService');
const kafkaService = require('./services/kafkaService');
const { setPersistence } = require('y-websocket/bin/utils');
const { bindState, writeState } = require('./services/yjsPersistence');
const logger = require('./utils/logger');

let wss = null;

async function startApplication() {
  try {
    logger.info('Initializing services...');
    await kafkaService.initialize();

    // Yjs 永続化設定
    setPersistence({
      bindState,
      writeState,
      provider: null,
    });

    logger.info('Services initialized. Starting WebSocket server...');

    wss = new WebSocketServer({ port: config.PORT });

    wss.on('connection', (conn, req) => {
      const docName = (req.url || '').slice(1).split('?')[0];
      setupWSConnection(conn, req);

      conn.on('close', () => {
        logger.info(`Client disconnected: ${docName}`);
      });

      conn.on('error', error => {
        logger.error(`WebSocket error: ${docName}`, error);
      });
    });

    wss.on('listening', () => {
      logger.info(`WebSocket server started on ws://localhost:${config.PORT}`);
    });

    wss.on('close', async () => {
      await shutdown();
    });

    wss.on('error', error => {
      logger.error('WebSocket server error:', error);
    });
  } catch (error) {
    logger.error('Application startup failed:', error);
    await shutdown(1);
  }
}

async function shutdown(exitCode = 0) {
  try {
    logger.info('Shutting down application...');

    if (wss) {
      await new Promise(resolve => {
        wss.close(() => resolve());
      });
    }

    // サービスをシャットダウン
    await kafkaService.disconnect();
    await redisService.publisher.disconnect();
    await redisService.subscriber.disconnect();

    logger.info('Application shutdown complete');
    process.exit(exitCode);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// シグナルハンドリング
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach(signal => {
  process.on(signal, async () => {
    logger.info(`${signal} received, shutting down...`);
    await shutdown();
  });
});

// アプリケーション起動
startApplication().catch(async error => {
  logger.error('Application error :', error);
  await shutdown(1);
});
