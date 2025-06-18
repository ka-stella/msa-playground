/**
 * auth-serviceのエントリーポイント
 */
const express = require('express');
const app = express();
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
const corsMiddleware = require('./middlewares/corsMiddleware');

require('dotenv').config();
require('./config/passport');

const authRoutes = require('./routes/auth');
const socialRoutes = require('./routes/social');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS設定 (設定要確認)
app.use(corsMiddleware);

//ソーシャルログイン関連
app.use(passport.initialize());

//ヘルスチェック
app.get('/health', (req, res) => {
  res.status(200).send('起動OK');
});

//ルーティング
app.use('/', authRoutes);
app.use('/social', socialRoutes);

//swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
