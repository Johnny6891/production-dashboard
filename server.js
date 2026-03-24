require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./services/dbService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/todos', require('./routes/todos'));

// 生產環境：提供 React 靜態檔案
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

// 啟動伺服器
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`伺服器啟動於 http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('伺服器啟動失敗:', err);
  process.exit(1);
});
