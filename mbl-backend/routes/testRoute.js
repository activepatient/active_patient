import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/db-check', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT GETDATE() AS CurrentTime');
    res.json({ success: true, result: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
