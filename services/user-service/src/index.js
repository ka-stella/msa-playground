const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../swagger.json');
const YAML = require('yamljs');
const path = require('path');
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool
  .connect()
  .then(client => {
    return client.query(`
      CREATE TABLE IF NOT EXISTS users_data (
          id SERIAL PRIMARY KEY,
          auth_user_id INTEGER UNIQUE NOT NULL,
          name VARCHAR(100),
          email VARCHAR(100) UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
  `);
  })
  .catch(err => {
    console.error('接続失敗:', err);
    process.exit(1);
  });

// CORS設定 (開発用、本番ではより厳格に設定)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).send('User Service is healthy!');
});

// ユーザー詳細情報登録エンドポイント
app.post('/create', async (req, res) => {
  const { auth_user_id, name, email } = req.body;
  if (!auth_user_id) {
    return res.status(400).json({ message: 'Auth User ID is required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users_data (auth_user_id, name, email) VALUES ($1, $2, $3) RETURNING id, name, email',
      [auth_user_id, name, email],
    );
    res.status(201).json({ message: 'User data created successfully.', user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      // UNIQUE制約違反 (auth_user_id or email)
      return res
        .status(409)
        .json({ message: 'User data with this Auth User ID or email already exists.' });
    }
    console.error('Error creating user data:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ユーザー詳細情報取得エンドポイント
app.get('/profile/:authUserId', async (req, res) => {
  const { authUserId } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users_data WHERE auth_user_id = $1',
      [authUserId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Swagger UI の設定
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
