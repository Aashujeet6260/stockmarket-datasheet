const express = require('express');
const router = express.Router();

// Static list of at least 10 companies (symbol, name)
// Defining a static list of companies
const companies = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "DIS", name: "Walt Disney Co." },
  { symbol: "NFLX", name: "Netflix Inc." }
];

// Return company list
router.get('/', (req, res) => {
  res.json(companies);
});

module.exports = router; // ✅ correctly exporting the router
