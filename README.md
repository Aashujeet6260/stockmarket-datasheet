
# Stock Market Dashboard — Backend

#Deploy on Render 
click - Visit - https://stockmarket-datasheet.onrender.com

## Overview
This is a Node.js + SQLite backend for a Stock Market Dashboard.  
Features:
- REST API (Express) that serves:
  - `/companies` — list of companies
  - `/history?symbol=SYMBOL&period=1y` — historical OHLCV data
  - `/metrics?symbol=SYMBOL` — 52-week high/low, average volume
  - `/predict` — next-day price prediction (calls a Python script)
- Uses `yahoo-finance2` npm package to fetch live data
- Caches historical data in SQLite
- Prediction: a simple ML model implemented in Python (scikit-learn Linear Regression)

## Requirements
- Node.js 18+ and npm
- Python 3.8+
- For Python prediction: install dependencies in `python/requirements.txt`

## Install & Run
1. Install Node deps
   ```bash
   cd stock-dashboard-backend
   npm install
   ```
2. Install Python deps (optional, for prediction)
   ```bash
   cd python
   python -m pip install -r requirements.txt
   ```
3. Run server
   ```bash
   cd ..
   node src/index.js
   ```
4. Server runs on http://localhost:4000 by default.

## Notes
- The prediction endpoint expects the server to fetch historical data and will call the Python script with historical close prices passed via stdin.
- The Python script returns a JSON with predicted next-day close and simple statistics.

- Screent Shot

![SS1](https://github.com/user-attachments/assets/6573a929-d4ea-4b7b-b3b7-23969c5a1d0a)
![SS2](http![SS3](https://github.com/user-attachments/assets/d72e99cf-e51d-4522-95b6-15f83ed4cec4)
s://github.com/user-attachments/assets/6142d133-dd1c-403a-8ae0-f0e18d16f672)
![SS4](https://github.com/user-attachments/assets/546c0d51-7f88-493b-944e-54e8e4428ddf)
![SS5](https://github.com/user-attachments/assets/3c6aabe9-4d7d-4c87-983e-11d3228b07c9)




