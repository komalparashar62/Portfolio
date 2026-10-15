import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
const connection = process.env.DATABASE_URL;
if (!connection) { console.error('Set DATABASE_URL in .env.local first.'); process.exit(1); }
try {
  const sql = neon(connection);
  const schema = await readFile(new URL('../database/schema.sql', import.meta.url), 'utf8');
  await sql.query(schema);
  console.log('Enquiries table is ready.');
} catch { console.error('Database setup failed. Check your connection string and database access.'); process.exit(1); }
