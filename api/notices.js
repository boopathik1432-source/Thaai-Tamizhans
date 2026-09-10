// 🏆 THAAI TAMIZHANS - MATCH NOTICES API (/api/notices)
const { getDb, ensureTables } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = getDb();
  await ensureTables(sql);
  const STATE_KEY = 'thaai_tamizhans_main_state';

  try {
    const rows = await sql`SELECT data FROM club_data WHERE id = ${STATE_KEY} LIMIT 1`;
    let clubData = rows && rows.length > 0 ? rows[0].data : {};
    let notices = clubData.matchNotices || [];

    if (req.method === 'GET') {
      return res.status(200).json({ success: true, notices });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const notice = body.notice || body;

      if (!notice.title) {
        return res.status(400).json({ success: false, error: 'Notice title is required' });
      }

      const idx = notices.findIndex(n => n.id === notice.id);
      if (idx >= 0) {
        notices[idx] = Object.assign({}, notices[idx], notice);
      } else {
        notice.id = notice.id || Date.now();
        notices.unshift(notice);
      }

      clubData.matchNotices = notices;
      await sql`
        INSERT INTO club_data (id, data, updated_at)
        VALUES (${STATE_KEY}, ${JSON.stringify(clubData)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id)
        DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({ success: true, notice, notices });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Notices API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
