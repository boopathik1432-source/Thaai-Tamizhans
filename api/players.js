const { neon } = require('@neondatabase/serverless');

const DEFAULT_NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_CKLVMeg3Jq0m@ep-polished-grass-azd3syyx-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_NEON_DATABASE_URL;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(DATABASE_URL);
    const rows = await sql`
      SELECT data->'players' as players 
      FROM club_data 
      WHERE id = 'thaai_tamizhans_main_state' 
      LIMIT 1;
    `;
    const players = rows && rows[0] && rows[0].players ? rows[0].players : [];
    return res.status(200).json({ success: true, count: players.length, players });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
