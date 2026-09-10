// 🏆 THAAI TAMIZHANS - NEON POSTGRESQL DATABASE ENGINE
const { neon } = require('@neondatabase/serverless');

const DEFAULT_DB_URL = 'postgresql://neondb_owner:npg_CKLVMeg3Jq0m@ep-polished-grass-azd3syyx-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

function getDb() {
  const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;
  return neon(connectionString);
}

// Auto-initialize tables if needed
let initialized = false;
async function ensureTables(sql) {
  if (initialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS club_data (
        id VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    initialized = true;
  } catch (err) {
    console.warn('Table check warning:', err.message);
  }
}

module.exports = { getDb, ensureTables };
