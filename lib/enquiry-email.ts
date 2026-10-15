import { createHash } from 'node:crypto';
import { z } from 'zod';
import { queryOptions } from './enquiries.ts';
import type { Enquiry } from './enquiry-handler.ts';

export type EmailEnvironment = {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
};
const configSchema = z.object({
  RESEND_API_KEY: z.string().trim().min(1),
  RESEND_FROM_EMAIL: z.string().trim().min(1).refine(value => !/[\r\n]/.test(value)),
  CONTACT_TO_EMAIL: z.string().trim().email(),
});

export async function deliverEnquiry(
  data: Enquiry,
  environment: EmailEnvironment,
  request: typeof fetch = fetch,
  archive?: (data: Enquiry) => Promise<void>,
) {
  const config = configSchema.safeParse(environment);
  if (!config.success) throw new Error('Enquiry email configuration is incomplete.');

  const titles = queryOptions.filter(option => data.queries.includes(option.id)).map(option => option.title);
  const body = {
    from: config.data.RESEND_FROM_EMAIL,
    to: [config.data.CONTACT_TO_EMAIL],
    subject: `Portfolio enquiry — ${data.name.replace(/[\r\n]+/g, ' ')}`,
    text: [
      'New portfolio enquiry', '',
      `Name: ${data.name}`,
      `Preferred contact method: ${data.contactMethod === 'email' ? 'Email' : 'Phone'}`,
      `Contact: ${data.contact}`, '',
      'Selected queries:', ...titles.map(title => `- ${title}`), '',
      `Submission reference: ${data.submissionId}`,
    ].join('\n'),
    ...(data.contactMethod === 'email' ? { reply_to: data.contact } : {}),
  };
  // A changed submission gets a new key; exact retries retain the same payload and key.
  const payload = JSON.stringify(body);
  const digest = createHash('sha256').update(payload).digest('hex');
  const idempotencyKey = `portfolio-enquiry/${data.submissionId}/${digest}`;

  // If an archive is explicitly configured, require it to save before sending.
  // Retrying after an email failure is safe because both storage and email are idempotent.
  if (archive) await archive(data);
  const response = await request('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.data.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: payload,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Email provider did not accept the enquiry.');
  const result: unknown = await response.json();
  if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id) {
    throw new Error('Email provider returned an invalid confirmation.');
  }
}
