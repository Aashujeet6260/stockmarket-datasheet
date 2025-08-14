const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const app = express();

// Allows requests from any origin
app.use(cors({
  origin: '*'
}));

// Convert JSON request bodies into JavaScript objects
app.use(bodyParser.json());
// Initialize DB
db.init();

// Safe router loader to avoid invalid export issues
function loadRouter(routerPath) {
    const router = require(routerPath);

    // Check if router is a valid Express Router
    // as if the router is not null or undefined, and if it has a stack property, it is likely an Express Router.
    if (router && typeof router === 'function' && router.stack) {
        return router;
    }
    throw new Error(`Invalid router export in ${routerPath}`);
}

// Routers 
app.use('/companies', loadRouter('./routes/companies'));
app.use('/history', loadRouter('./routes/history'));
app.use('/metrics', loadRouter('./routes/metrics'));
app.use('/predict', loadRouter('./routes/predict'));

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Catch-all for SPA routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
