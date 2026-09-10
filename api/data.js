const { neon } = require('@neondatabase/serverless');

const DEFAULT_NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_CKLVMeg3Jq0m@ep-polished-grass-azd3syyx-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_NEON_DATABASE_URL;

async function ensureTable(sql) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS club_data (
        id VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (e) {
    console.warn('ensureTable error:', e.message);
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(DATABASE_URL);
    await ensureTable(sql);

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT data, updated_at 
        FROM club_data 
        WHERE id = 'thaai_tamizhans_main_state' 
        LIMIT 1;
      `;

      if (rows && rows.length > 0) {
        return res.status(200).json({
          success: true,
          data: rows[0].data,
          updatedAt: rows[0].updated_at
        });
      }

      return res.status(200).json({
        success: true,
        data: null,
        message: 'No record in database yet'
      });
    }

    if (req.method === 'POST') {
      let payload = req.body;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch (e) {}
      }
      if (payload && payload.data) {
        payload = payload.data;
      }

      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, error: 'Valid data object required' });
      }

      // Sanitize heavy files data URLs
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

      return res.status(200).json({
        success: true,
        message: 'Saved to Neon PostgreSQL successfully',
        updatedAt: rows && rows[0] ? rows[0].updated_at : new Date().toISOString()
      });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (err) {
    console.error('api/data serverless error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
