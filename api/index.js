const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));

const DEFAULT_NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_CKLVMeg3Jq0m@ep-polished-grass-azd3syyx-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_NEON_DATABASE_URL;

let sql = null;
try {
  const { neon } = require('@neondatabase/serverless');
  sql = neon(DATABASE_URL);
} catch (err) {
  console.error('Error initializing Neon serverless driver:', err);
}

// Ensure club_data table exists
async function ensureTables() {
  if (!sql) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS club_data (
        id VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (e) {
    console.warn('Table check warning:', e.message);
  }
}

// 1. Healthcheck Endpoint
app.get('/api/health', async (req, res) => {
  try {
    if (sql) {
      await sql`SELECT 1 as ping;`;
      return res.json({
        status: 'healthy',
        database: 'connected',
        provider: 'Neon PostgreSQL (aws-ap-southeast-1)',
        timestamp: new Date().toISOString()
      });
    }
    return res.json({ status: 'healthy', database: 'standalone', timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({
      status: 'degraded',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 2. GET All Club Data
app.get('/api/data', async (req, res) => {
  try {
    if (!sql) {
      return res.status(503).json({ success: false, error: 'Database driver unavailable' });
    }
    await ensureTables();
    const rows = await sql`
      SELECT data, updated_at 
      FROM club_data 
      WHERE id = 'thaai_tamizhans_main_state' 
      LIMIT 1;
    `;

    if (rows && rows.length > 0) {
      return res.json({
        success: true,
        data: rows[0].data,
        updatedAt: rows[0].updated_at
      });
    }

    return res.json({
      success: true,
      data: null,
      message: 'No cloud record found yet, using initial data'
    });
  } catch (error) {
    console.error('API GET /api/data error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. POST / Save Club Data (Upsert to Neon PostgreSQL)
app.post('/api/data', async (req, res) => {
  try {
    const payload = req.body && req.body.data ? req.body.data : req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid payload: data object required' });
    }

    if (!sql) {
      return res.status(503).json({ success: false, error: 'Database connection unavailable' });
    }

    await ensureTables();

    // Sanitize heavy files data URLs so payload remains fast and responsive
    const sanitized = JSON.parse(JSON.stringify(payload));
    if (sanitized.files && Array.isArray(sanitized.files)) {
      sanitized.files = sanitized.files.map(f => {
        const item = Object.assign({}, f);
        if (item.url && (item.url.startsWith('blob:') || item.url.startsWith('data:video/'))) {
          item.url = '';
        }
        return item;
      });
    }

    const rows = await sql`
      INSERT INTO club_data (id, data, updated_at)
      VALUES ('thaai_tamizhans_main_state', ${JSON.stringify(sanitized)}, NOW())
      ON CONFLICT (id) 
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      RETURNING updated_at;
    `;

    return res.json({
      success: true,
      message: 'Cloud database synchronized with Neon PostgreSQL',
      updatedAt: rows && rows[0] ? rows[0].updated_at : new Date().toISOString()
    });
  } catch (error) {
    console.error('API POST /api/data error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Quick API endpoint for Players roster
app.get('/api/players', async (req, res) => {
  try {
    if (!sql) return res.status(503).json({ success: false, error: 'DB unavailable' });
    const rows = await sql`
      SELECT data->'players' as players 
      FROM club_data 
      WHERE id = 'thaai_tamizhans_main_state' 
      LIMIT 1;
    `;
    const players = rows && rows[0] && rows[0].players ? rows[0].players : [];
    return res.json({ success: true, count: players.length, players });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Export Express app for both Vercel Serverless and server.js
module.exports = app;
