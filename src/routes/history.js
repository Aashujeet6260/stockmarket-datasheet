
// express used to create a web server
// body-parser used to parse JSON request bodies

const express = require('express');
const router = express.Router();
const yahoo = require('../services/yahooService');
const db = require('../db').getDB();

// GET /history?symbol=SYMBOL&period=1y

// Example - GET /history?symbol=AAPL&period=1y

router.get('/', async (req, res) => {
  try {

    // Converts symbol to uppercase (e.g., "aapl" → "AAPL")
    const symbol = (req.query.symbol || '').toUpperCase();
    const period = req.query.period || '1y'; // Default to 1 year 
    if (!symbol) return res.status(400).json({ error: 'symbol query param required' });

    // Fetch from Yahoo Finance
    const rows = await yahoo.fetchHistorical(symbol, period, '1d');

// Save into SQLite (upsert)

    // If a row with the same unique key already exists, it will delete the old one and insert the new data.
    const insert = db.prepare('INSERT OR REPLACE INTO historical (symbol,date,open,high,low,close,volume) VALUES (?,?,?,?,?,?,?)');


    const insertMany = db.transaction((arr) => {
      for (const r of arr) {
        const d = new Date(r.date).toISOString().slice(0,10);
        // Coverting date into the string format YYYY-MM-DD and then slicing it to get only the date part date -> YYYY-MM-DD
        insert.run(symbol, d, r.open, r.high, r.low, r.close, r.volume);
      }
    });
    insertMany(rows);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
