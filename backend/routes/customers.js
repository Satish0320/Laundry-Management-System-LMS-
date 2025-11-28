const express = require('express');
const pool = require('../db');

const router = express.Router();

// ADD
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ success: false, error: 'Name is required' });
    if (!phone || !phone.trim()) return res.status(400).json({ success: false, error: 'Phone is required' });

    const [result] = await pool.query(
      'INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)',
      [name.trim(), phone.trim(), address || null]
    );

    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// List all 
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
