// 🏆 THAAI TAMIZHANS - TRAINING & PRACTICE API (/api/practice)
const { getDb, ensureTables } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = getDb();
  await ensureTables(sql);
  const STATE_KEY = 'thaai_tamizhans_main_state';

  try {
    const rows = await sql`SELECT data FROM club_data WHERE id = ${STATE_KEY} LIMIT 1`;
    let clubData = rows && rows.length > 0 ? rows[0].data : {};

    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        todayPractice: clubData.todayPractice || null,
        practiceCalendar: clubData.practiceCalendar || []
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body.todayPractice) {
        clubData.todayPractice = body.todayPractice;
      }
      if (body.practiceCalendar) {
        clubData.practiceCalendar = body.practiceCalendar;
      }
      if (body.session) {
        let calendar = clubData.practiceCalendar || [];
        const idx = calendar.findIndex(c => c.id === body.session.id);
        if (idx >= 0) {
          calendar[idx] = Object.assign({}, calendar[idx], body.session);
        } else {
          body.session.id = body.session.id || Date.now();
          calendar.push(body.session);
        }
        clubData.practiceCalendar = calendar;
      }

      await sql`
        INSERT INTO club_data (id, data, updated_at)
        VALUES (${STATE_KEY}, ${JSON.stringify(clubData)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id)
        DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({
        success: true,
        todayPractice: clubData.todayPractice,
        practiceCalendar: clubData.practiceCalendar
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Practice API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
