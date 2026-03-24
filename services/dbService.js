const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function initDb() {
  try {
    // 先確認 todos 表是否已存在
    const { rows } = await pool.query(
      `SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='todos') AS exists`
    );
    if (!rows[0].exists) {
      await pool.query(`
        CREATE TABLE todos (
          id SERIAL PRIMARY KEY,
          text TEXT NOT NULL,
          done BOOLEAN DEFAULT FALSE,
          "order" INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('todos 資料表建立完成');
    } else {
      console.log('todos 資料表已存在，跳過建立');
    }
  } catch (err) {
    console.error('initDb 錯誤:', err.message);
    throw err;
  }
  console.log('資料庫初始化完成');
}

async function query(sql, params) {
  return pool.query(sql, params);
}

module.exports = { initDb, query };
