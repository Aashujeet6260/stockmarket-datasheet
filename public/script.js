const API_BASE = window.location.hostname.includes('localhost')
  ? 'http://localhost:4000'
  : 'https://stockmarket-datasheet.onrender.com';



let  chart;

async function fetchCompanies() {
    const res = await fetch(`${API_BASE}/companies`);
    return res.json();
}

async function fetchHistory(symbol) {
    const res = await fetch(`${API_BASE}/history?symbol=${symbol}&period=1y`);
    return res.json();
}

async function fetchMetrics(symbol) {
    const res = await fetch(`${API_BASE}/metrics?symbol=${symbol}`);
    return res.json();
}

async function fetchPrediction(symbol) {
    const res = await fetch(`${API_BASE}/predict?symbol=${symbol}`);
    return res.json();
}

function renderChart(symbol, history) {
    const labels = history.map(item => new Date(item.date).toLocaleDateString());
    const prices = history.map(item => item.close);

    if (chart) chart.destroy();

    const ctx = document.getElementById('stockChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${symbol} Close Price`,
                data: prices,
                borderColor: 'green',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });
}

async function selectCompany(symbol, name) {
    document.getElementById('stock-title').textContent = `${name} (${symbol})`;
    const history = await fetchHistory(symbol);
    renderChart(symbol, history);
    const metrics = await fetchMetrics(symbol);
    document.getElementById('metrics').innerHTML = `
        <h3>Metrics</h3>
        <p>52-Week High: ${metrics.week52_high}</p>
        <p>52-Week Low: ${metrics.week52_low}</p>
        <p>Average Volume: ${metrics.average_volume}</p>
    `;
    const prediction = await fetchPrediction(symbol);
    document.getElementById('prediction').innerHTML = `
        <h3>Prediction</h3>
        <p>Last Close: ${prediction.last_close}</p>
        <p>Predicted Next Close: ${prediction.pred_next}</p>
    `;
}

async function init() {
    const companies = await fetchCompanies();
    const list = document.getElementById('company-list');
    companies.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.name;
        li.addEventListener('click', () => selectCompany(c.symbol, c.name));
        list.appendChild(li);
    });
}

init();
