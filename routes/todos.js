const express = require('express');
const router = express.Router();
const db = require('../services/dbService');

// GET /api/todos - 取得所有待辦
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM todos ORDER BY "order" ASC, created_at ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/todos - 新增待辦
router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: '內容不能為空' });
  try {
    const { rows } = await db.query(
      'INSERT INTO todos (text, done, "order") VALUES ($1, false, (SELECT COALESCE(MAX("order"), 0) + 1 FROM todos)) RETURNING *',
      [text.trim()]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/todos/reorder - 批次更新排序
router.patch('/reorder', async (req, res) => {
  const { items } = req.body; // [{ id, order }, ...]
  if (!Array.isArray(items)) return res.status(400).json({ error: '格式錯誤' });
  try {
    for (const { id, order } of items) {
      await db.query('UPDATE todos SET "order" = $1 WHERE id = $2', [order, id]);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/todos/:id - 更新待辦 (text / done)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;
  try {
    const fields = [];
    const values = [];
    if (text !== undefined) { fields.push(`text = $${fields.length + 1}`); values.push(text); }
    if (done !== undefined) { fields.push(`done = $${fields.length + 1}`); values.push(done); }
    if (!fields.length) return res.status(400).json({ error: '沒有要更新的欄位' });
    values.push(id);
    const { rows } = await db.query(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/todos/:id - 刪除待辦
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
