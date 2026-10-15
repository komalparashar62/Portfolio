import { neon } from '@neondatabase/serverless';
import { handleEnquiry } from '../../../lib/enquiry-handler';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  return handleEnquiry(request, async (data) => {
    const connection = process.env.DATABASE_URL;
    if (!connection) throw new Error('Database is not configured.');
    const sql = neon(connection);
    await sql`
      INSERT INTO enquiries (submission_id, queries, name, contact_method, contact)
      VALUES (${data.submissionId}::uuid, ${JSON.stringify(data.queries)}::jsonb, ${data.name}, ${data.contactMethod}, ${data.contact})
      ON CONFLICT (submission_id) DO NOTHING
    `;
  });
}
