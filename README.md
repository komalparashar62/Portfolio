# Komal Parashar — Portfolio

Complete editable Next.js portfolio for Vercel, with Resend email enquiries.

## What's included

- Full cream, plum and orange design and editable website copy.
- Design capabilities, PM expertise, working approach and about section.
- Responsive navigation, expandable PM sections and a two-step enquiry form.
- Server-side validation, Resend delivery and retry deduplication.
- Optional Neon Postgres archive.
- No fabricated testimonials, client case studies or secret credentials.

## Start locally

Install Node.js 22.13+ and open a terminal in this folder:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The site renders without credentials, but sending enquiries requires the Resend setup below.

## Publish on Vercel

1. Import the `Portfolio` GitHub repository into a Vercel project.
2. Use **Next.js** as the framework and the repository root as Root Directory.
3. Use `npm ci` to install and `npm run build` to build. Keep the default output directory.
4. Add the three Resend environment variables below for Production and any Preview environment where the form should work.
5. Deploy, or redeploy if variables were added after the initial deployment.

For a downloaded ZIP, extract the `komal-portfolio` folder and upload its contents to your repository first. Do not upload `.env.local`, `node_modules` or `.next`.

Alternatively, from the project folder:

```sh
npx vercel
```

## Enable emails with Resend

The enquiry endpoint sends **one email to your configured inbox** containing the visitor's name, selected queries and chosen phone number or email. A visitor who chooses phone does not need to provide an email. Email enquiries set Reply-To to the visitor, so you can reply from your inbox. No automatic receipt or marketing email is sent to visitors.

In Vercel > Project Settings > Environment Variables, add:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | Your Resend sending API key |
| `RESEND_FROM_EMAIL` | A sender from your verified domain, such as `Komal Portfolio <enquiries@your-domain.com>` |
| `CONTACT_TO_EMAIL` | The single inbox where you want enquiries delivered |

All three variables are server-only. Never add a `NEXT_PUBLIC_` prefix, put an API key in source code, or commit a real `.env.local`.

### Sender setup

1. Add a domain you own in the Resend dashboard and add its required DNS records.
2. Wait until Resend marks it verified, then use a sender address on that domain for `RESEND_FROM_EMAIL`.
3. Create a sending API key with access to that domain.
4. Add your receiving inbox as `CONTACT_TO_EMAIL`.
5. Redeploy Vercel after setting the variables.

For testing, Resend's `onboarding@resend.dev` sender can send only to the email associated with your Resend account. In that mode, `CONTACT_TO_EMAIL` must be that account email. Use a verified domain for production.

For local development, copy `.env.example` to `.env.local`, fill in the three values and restart the dev server.

### Verify the real setup

Submit a test enquiry through the deployed website, check the request in Resend's dashboard, then confirm receipt in your inbox. A successful API response means Resend accepted the email; it does not guarantee inbox delivery. The form reports failure if credentials are missing, Resend rejects the message or the request times out. Visitor-entered details remain available to retry.

Exact retries carry the same idempotency key. Resend deduplicates them within its 24-hour retention window. Changing enquiry details creates a new email payload and key.

## Optional database archive

You do **not** need Neon or DATABASE_URL for email enquiries.

If you also want records in a database:

1. Create a Neon database through its dashboard or Vercel's marketplace.
2. Run `database/schema.sql` once in the Neon SQL editor.
3. Set `DATABASE_URL` in Vercel, then redeploy.

When configured, the database archive must succeed before sending. Both operations support retries. A saved record alone does not prove email delivery. The original website's records are not automatically copied.

For local setup, add the real DATABASE_URL to `.env.local` and run:

```sh
npm run db:setup
```

To view the archive, use Neon's table viewer or:

```sql
SELECT created_at, name, queries, contact_method, contact
FROM enquiries
ORDER BY created_at DESC;
```

There is no public read endpoint or admin inbox in this project.

## Edit with Claude or another code editor

- `app/page.tsx`: content, sections, interactions and form.
- `app/globals.css`: colours, typography and responsive layout.
- `lib/enquiries.ts`: selectable queries and validation.
- `lib/enquiry-email.ts`: email content, Resend request and idempotency.
- `lib/enquiry-handler.ts`: request handling and validation.
- `app/api/enquiries/route.ts`: server-only configuration and optional Neon archive.
- `app/layout.tsx`: title and description.
- `public/favicon.svg`: browser icon.
- `CONTENT.md`: website text in plain language.
- `CLAUDE-BRIEF.md`: project context for future changes.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Tests use a mocked email provider. They do not send real emails or require secrets. A live Resend account and sender configuration are needed for an end-to-end delivery test.

## Official setup references

- Next.js on Vercel: https://vercel.com/docs/frameworks/full-stack/nextjs
- Send email with Resend: https://resend.com/docs/api-reference/emails/send-email
- Resend idempotency: https://resend.com/docs/dashboard/emails/idempotency-keys
- Testing sender restrictions: https://resend.com/docs/knowledge-base/403-error-resend-dev-domain
- Neon serverless driver: https://neon.com/docs/serverless/serverless-driver

DM Sans and Manrope load from Google Fonts with system fallbacks. The decorative artwork is CSS and needs no image assets.
