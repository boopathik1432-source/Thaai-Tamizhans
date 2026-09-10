// 🏆 THAAI TAMIZHANS - SQUAD ATHLETES API (/api/players)
const { getDb, ensureTables } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = getDb();
  await ensureTables(sql);
  const STATE_KEY = 'thaai_tamizhans_main_state';

  try {
    const rows = await sql`SELECT data FROM club_data WHERE id = ${STATE_KEY} LIMIT 1`;
    let clubData = rows && rows.length > 0 ? rows[0].data : {};
    let players = clubData.players || [];

    if (req.method === 'GET') {
      return res.status(200).json({ success: true, players });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const player = body.player || body;

      if (!player.name) {
        return res.status(400).json({ success: false, error: 'Player name is required' });
      }

      const existingIndex = players.findIndex(p => p.id === player.id);
      if (existingIndex >= 0) {
        players[existingIndex] = Object.assign({}, players[existingIndex], player);
      } else {
        player.id = player.id || Date.now();
        players.push(player);
      }

      clubData.players = players;
      await sql`
        INSERT INTO club_data (id, data, updated_at)
        VALUES (${STATE_KEY}, ${JSON.stringify(clubData)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id)
        DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({ success: true, player, players });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Player ID required' });
      }

      players = players.filter(p => String(p.id) !== String(id));
      clubData.players = players;

      await sql`
        UPDATE club_data SET data = ${JSON.stringify(clubData)}, updated_at = CURRENT_TIMESTAMP WHERE id = ${STATE_KEY};
      `;

      return res.status(200).json({ success: true, message: 'Player removed', players });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Players API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
