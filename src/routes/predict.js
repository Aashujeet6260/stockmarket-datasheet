const express = require('express');
const router = express.Router();
const yahoo = require('../services/yahooService');
const { spawn } = require('child_process');
const path = require('path');

async function handlePrediction(req, res) {
   // Converts symbol to uppercase (e.g., "aapl" → "AAPL") and sets default period 1y
  const symbol = (req.body.symbol || '').toUpperCase();
  const period = req.body.period || '1y';
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  try {
    const rows = await yahoo.fetchHistorical(symbol, period, '1d');

    // Prepare array of {date, close}
    const series = rows.map(r => ({
      date: new Date(r.date).toISOString().slice(0, 10),
      close: r.close
    }));

    // Correct path to Python script (python folder is in project root)
    const pyPath = path.join(__dirname, '..', '..', 'python', 'predict.py');

    // Spawn Python script and send JSON via stdin
    // Bascially we are sending the symbol and series to the Python script
  
    const py = spawn('python3', [pyPath], { stdio: ['pipe', 'pipe', 'inherit'] });
     // The spawn function creates a new process to run the Python script.
    py.stdin.write(JSON.stringify({ symbol, series }));
    // The JSON.stringify converts the JavaScript object into a JSON string. 
    py.stdin.end();

    // Collect output from Python script
    let output = '';
    py.stdout.on('data', (data) => { output += data.toString(); });

    py.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'prediction script failed', code });
      }
      try {
        const json = JSON.parse(output);
        res.json(json);
      } catch (e) {
        res.status(500).json({
          error: 'invalid prediction output',
          detail: e.message,
          raw: output
        });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}

// POST /predict
router.post('/', handlePrediction);

// GET /predict?symbol=...&period=...
router.get('/', (req, res) => {
  req.body = { symbol: req.query.symbol, period: req.query.period };
  handlePrediction(req, res);
});

module.exports = router;
