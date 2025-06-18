const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 *id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,           -- 通常ログイン用、NULL許容に
  password_hash VARCHAR(255),            -- 通常ログイン用、NULL許容に
  provider VARCHAR(50),                  -- 'google' など。NULL = 通常ログイン
  provider_user_id VARCHAR(100),         -- Googleのprofile.idなど
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 */
pool.connect().then(client => {
  console.log('postgres接続成功');
  return client
    .query(
      `
    CREATE TABLE IF NOT EXISTS auth_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE,
      password_hash VARCHAR(255),
      provider VARCHAR(50),
      provider_user_id VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `,
    )
    .then(() => {
      console.log('ユーザテーブルが存在しないため作成しました。');
    })
    .catch(e => {
      console.error('データベース接続エラー', e);
      process.exit(1);
    });
});

module.exports = pool;
