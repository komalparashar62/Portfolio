import { neon } from '@neondatabase/serverless';
import { handleEnquiry } from '../../../lib/enquiry-handler';
import type { Enquiry } from '../../../lib/enquiry-handler';
import { deliverEnquiry } from '../../../lib/enquiry-email';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  return handleEnquiry(request, async (data) => {
    const connection = process.env.DATABASE_URL?.trim();
    const archive = connection ? async (entry: Enquiry) => {
      const sql = neon(connection);
      await sql`
        INSERT INTO enquiries (submission_id, queries, name, contact_method, contact)
        VALUES (${entry.submissionId}::uuid, ${JSON.stringify(entry.queries)}::jsonb, ${entry.name}, ${entry.contactMethod}, ${entry.contact})
        ON CONFLICT (submission_id) DO UPDATE SET
          queries = EXCLUDED.queries, name = EXCLUDED.name,
          contact_method = EXCLUDED.contact_method, contact = EXCLUDED.contact
      `;
    } : undefined;
    await deliverEnquiry(data, {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    }, fetch, archive);
  });
}
