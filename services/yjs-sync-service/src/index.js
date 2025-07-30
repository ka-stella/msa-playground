require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const PORT = process.env.PORT || 3005;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req);
  console.log('Yjs WebSocket接続が開始されました');

  conn.on('close', () => {
    console.log('Yjs WebSocket接続が閉じられました');
  });

  conn.on('error', error => {
    console.error('Yjs WebSocketエラー: ', error);
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket サーバ起動: ws://localhost:${PORT}`);
});
