# Simple prediction script using scikit-learn LinearRegression

import sys, json
import numpy as np
from sklearn.linear_model import LinearRegression

def main():
    # Read JSON data from standard input (stdin)
    obj = json.load(sys.stdin)
    
    # Extract stock symbol from input JSON
    symbol = obj.get('symbol')
    
    # Extract the price series; default to empty list if missing
    series = obj.get('series', [])
    
    # Sort the series in ascending order by date to ensure chronological order
    series = sorted(series, key=lambda x: x['date'])
    
    # Extract closing prices as floats, skipping entries with missing close values
    closes = [float(x['close']) for x in series if x.get('close') is not None]
    
    # Check if there are at least 10 data points; otherwise, exit with error JSON
    if len(closes) < 10:
        print(json.dumps({"error": "not enough data; need at least 10 data points"}))
        sys.exit(0)

    # Window size: use the last 5 days of prices to predict the next day's price
    window = 5
    X = []  # Feature matrix (past prices)
    y = []  # Target vector (next day's price)
    
    # Build the dataset using a sliding window approach
    for i in range(window, len(closes)):
        # Features: previous 5 closing prices
        X.append(closes[i-window:i])
        # Target: current day's closing price
        y.append(closes[i])
    
    # Convert lists to NumPy arrays for scikit-learn
    X = np.array(X)
    y = np.array(y)

    # Initialize and train a simple Linear Regression model
    model = LinearRegression()
    model.fit(X, y)

    # Prepare the last window (most recent 5 closing prices) for prediction
    #reshapes the array into 1 row × 5 columns (because scikit-learn expects a 2D array for prediction, even for one sample).
    last_window = np.array(closes[-window:]).reshape(1, -1)
    
    # Predict the next day's closing price
    pred = float(model.predict(last_window)[0])
    
    # Prepare result JSON with prediction and metadata
    result = {
        "symbol": symbol,
        "pred_next": pred,                 # Predicted next price
        "last_close": float(closes[-1]),   # Last actual closing price
        "model": "LinearRegression",       # Model type
        "n_points": len(closes),           # Number of data points used
        "window": window                   # Window size used
    }
    
    # Output the result as JSON
    print(json.dumps(result))

# Entry point of the script
if __name__ == '__main__':
    main()
