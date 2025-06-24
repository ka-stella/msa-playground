/**
 * ユーザサービスのエントリーポイント
 */
require('dotenv').config();

const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
const corsOptions = require('./config/cors');
const { startConsumer } = require('./kafka/consumer');

//kafka 購読開始
startConsumer();

const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// CORS設定
app.use(corsOptions());

// ヘルスチェックエンドポイント
if (!isProduction) {
  app.get('/health', (req, res) => {
    res.status(200).send('ユーザサービス起動');
  });
}

//ルーティング
app.use('/', require('./routes/user'));

// Swagger UI の設定
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT, () => {
  console.log(`User Service running on port ${process.env.PORT}`);
});
