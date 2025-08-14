// routes/metrics.js
const express = require('express');
const router = express.Router();


///symbol — stock ticker symbol (unique short code for a company in the stock market).
//peRatio -  investors are paying $ for every $1 the company earns per share per year.
//marketCap the total value of all a company’s shares.

// Example metrics data
// const metrics = [
//   { symbol: "AAPL", peRatio: 28.5, marketCap: "2.8T" },
//   { symbol: "MSFT", peRatio: 34.1, marketCap: "2.5T" },
//   { symbol: "GOOGL", peRatio: 22.3, marketCap: "1.7T" },
//   { symbol: "AMZN", peRatio: 60.2, marketCap: "1.6T" },
//   { symbol: "TSLA", peRatio: 80.0, marketCap: "800B" }
// ];

const metrics = [
  { symbol: "AAPL", week52_high: 199.62, week52_low: 134.12, average_volume: 55400000 },
  { symbol: "MSFT", week52_high: 350.00, week52_low: 245.50, average_volume: 28900000 },
  { symbol: "GOOGL", week52_high: 145.34, week52_low: 94.23, average_volume: 1520000 },
  { symbol: "AMZN", week52_high: 174.65, week52_low: 81.43, average_volume: 4200000 },
  { symbol: "TSLA", week52_high: 299.29, week52_low: 138.80, average_volume: 6000000 }
];

// GET /metrics
router.get('/', (req, res) => {
  const symbol = req.query.symbol?.toUpperCase();
  const data = metrics.find(m => m.symbol === symbol);
  res.json(data || {});
});

module.exports = router;
