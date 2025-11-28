const express = require('express');
const pool = require('../db');

const router = express.Router();

// Create
router.post('/', async (req, res, next) => {
  try {
    const { customer_id, service_name, quantity } = req.body;

    if (!customer_id) return res.status(400).json({ success: false, error: 'customer_id is required' });
    if (!service_name || !service_name.trim()) return res.status(400).json({ success: false, error: 'service_name is required' });
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) return res.status(400).json({ success: false, error: 'quantity must be a positive integer' });

    // check if customer exist
    const [custRows] = await pool.query('SELECT id FROM customers WHERE id = ?', [customer_id]);
    if (custRows.length === 0) return res.status(404).json({ success: false, error: 'Customer not found' });

    const [result] = await pool.query(
      'INSERT INTO orders (customer_id, service_name, quantity) VALUES (?, ?, ?)',
      [customer_id, service_name.trim(), qty]
    );

    const [rows] = await pool.query('SELECT o.*, c.name as customer_name FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// List all orders with  customer name
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.customer_id, c.name as customer_name, o.service_name, o.quantity, o.status, o.created_date
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       ORDER BY o.created_date DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// Update order status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    if (!status || !status.trim()) return res.status(400).json({ success: false, error: 'status is required' });

    // check order exists
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orderRows.length === 0) return res.status(404).json({ success: false, error: 'Order not found' });

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status.trim(), orderId]);

    const [rows] = await pool.query('SELECT o.*, c.name as customer_name FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = ?', [orderId]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
