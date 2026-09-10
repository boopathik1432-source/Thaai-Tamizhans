// 🏆 THAAI TAMIZHANS - FULL APP STATE CLOUD SYNC API (/api/sync)
const { getDb, ensureTables } = require('./db');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const sql = getDb();
  await ensureTables(sql);

  const STATE_KEY = 'thaai_tamizhans_main_state';

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT data, updated_at FROM club_data WHERE id = ${STATE_KEY} LIMIT 1`;
      if (rows && rows.length > 0) {
        return res.status(200).json({
          success: true,
          syncedAt: rows[0].updated_at,
          data: rows[0].data
        });
      } else {
        return res.status(200).json({
          success: true,
          syncedAt: null,
          data: null
        });
      }
    } catch (error) {
      console.error('Error fetching sync state:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const clientData = body.data || body;

      if (!clientData || typeof clientData !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid data payload' });
      }

      await sql`
        INSERT INTO club_data (id, data, updated_at)
        VALUES (${STATE_KEY}, ${JSON.stringify(clientData)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id)
        DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({
        success: true,
        message: 'Cloud state synced successfully',
        syncedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving sync state:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
