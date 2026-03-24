const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../services/sheetsService');
const CONFIG = require('../config');

// GET /api/dashboard - 取得儀表板資料
router.get('/', async (req, res) => {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (err) {
    console.error('dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/config - 取得前端設定
router.get('/config', (req, res) => {
  res.json({
    leftCardName: CONFIG.LEFT_CARD.NAME,
    rightCardName: CONFIG.RIGHT_CARD.NAME,
    links: CONFIG.LINKS,
    fieldIcons: CONFIG.FIELD_ICONS
  });
});

module.exports = router;
