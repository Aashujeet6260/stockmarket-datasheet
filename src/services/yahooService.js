const yahooFinance = require('yahoo-finance2').default;

async function fetchHistorical(symbol, period = '1y', interval = '1d') {
  let end = new Date();
  let start = new Date();

  // Convert period string to actual date range
  if (period.endsWith('y')) {
    start.setFullYear(end.getFullYear() - parseInt(period));
  } else if (period.endsWith('m')) {
    start.setMonth(end.getMonth() - parseInt(period));
  } else if (period.endsWith('d')) {
    start.setDate(end.getDate() - parseInt(period));
  } else {
    throw new Error('Invalid period format — use like 1y, 6m, 30d');
  }

  return await yahooFinance.historical(symbol, {
    period1: start.toISOString().split('T')[0],
    period2: end.toISOString().split('T')[0],
    interval
  });
}

module.exports = { fetchHistorical };
