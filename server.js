const express = require('express');
const path = require('path');
const apiApp = require('./api/index');

const app = express();
const PORT = process.env.PORT || 8080;

// Mount API routes
app.use(apiApp);

// Serve static frontend assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname)));

// Fallback all routes to index.html (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏆 THAAI TAMIZHANS (தாய் தமிழன்ஸ்) KABADDI PORTAL`);
  console.log(`🚀 Full-Stack Server listening at: http://localhost:${PORT}`);
  console.log(`📡 Backend API Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`📊 Cloud Data Endpoint: http://localhost:${PORT}/api/data\n`);
});
