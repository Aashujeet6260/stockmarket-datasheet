// SQLite wrapper using better-sqlite3 (synchronous SQLite library for Node.js)
const Database = require('better-sqlite3');

// Module for working with file and directory paths
const path = require('path');

// Full path to the SQLite database file (../data/stocks.db relative to current file)
const dbPath = path.join(__dirname, '..', 'data', 'stocks.db');

let db; // Variable to store the database connection instance

module.exports = {
  // Initializes the database (creates file, folder, and tables if needed)
  init() {
    const fs = require('fs');
    // Get directory where the database file should be stored
    const dir = path.dirname(dbPath);
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    // Open (or create) the SQLite database
    db = new Database(dbPath);

    // Create the historical table and index if they don't already exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS historical (
        symbol TEXT,      -- Stock ticker symbol (e.g., AAPL, MSFT)
        date TEXT,        -- Date of the stock data (YYYY-MM-DD)
        open REAL,        -- Opening price
        high REAL,        -- Highest price during the day
        low REAL,         -- Lowest price during the day
        close REAL,       -- Closing price
        volume INTEGER,   -- Trading volume
        PRIMARY KEY(symbol, date) -- Ensure unique entry per symbol/date
      );

      -- Create an index on symbol and date to speed up queries
      CREATE INDEX IF NOT EXISTS idx_symbol_date ON historical(symbol, date);
    `);
  },

  // Returns the database instance for running queries elsewhere
  getDB() { 
    return db; 
  }
};
