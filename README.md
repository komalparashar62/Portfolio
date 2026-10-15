# Komal Parashar — Portfolio

Complete editable portfolio website, prepared as a standalone Next.js project for Vercel.

## What's included

- The full cream, plum and orange portfolio design and all website copy.
- Design capabilities, product management expertise, working approach and about section.
- Responsive navigation, expandable PM sections and a two-step enquiry form.
- A server-side enquiry endpoint with validation and duplicate-submission protection.
- Neon Postgres database schema and setup script.
- No client case studies, fabricated testimonials, personal contact details or secret credentials.

## Start locally

Install Node.js 22.13+ (Node 22 LTS is a suitable choice), then open a terminal in this folder:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The website can run before you connect a database. Enquiries can only be saved after completing database setup below; the form reports an error rather than displaying a false success message.

## Publish on Vercel

1. Extract this ZIP. The project root is the `komal-portfolio` folder containing `package.json`.
2. Create a GitHub repository and upload the **contents** of this folder. Include `package-lock.json`, but do not upload `.env.local`, `node_modules` or `.next`.
3. In Vercel, create a project and import that repository.
4. Choose **Next.js** as the framework. If your repository contains the `komal-portfolio` folder as a subfolder, select it as the Root Directory.
5. Build command: `npm run build`. Install command: `npm ci`. Keep the default output directory.
6. Deploy. Then connect the database using the next section and redeploy if you added environment variables after the first deployment.

Alternatively, use the official Vercel CLI from this project folder:

```sh
npx vercel
```

No Vercel project, domain or database has been created by this ZIP. It contains source code and setup instructions only.

## Activate enquiry storage

This standalone version uses Neon Postgres instead of the original host's database. Existing enquiries from the original website are not copied.

1. Create a Neon database, either through Vercel's Storage/Marketplace integration or directly in Neon.
2. In the Neon SQL editor, run the contents of `database/schema.sql` once.
3. Copy the database connection string into Vercel's server-side environment variable **DATABASE_URL**. If the integration has already added this variable, use that value.
4. Enable it for the deployment environments where the form should work. Redeploy after adding or changing the value.
5. Send a test enquiry. Confirm a new row appears in the `enquiries` table before sharing the site with potential clients.

For local development, copy `.env.example` to `.env.local` and replace the placeholder connection string. You can then initialise the table using:

```sh
npm run db:setup
```

Do not prefix DATABASE_URL with NEXT_PUBLIC_. Never commit your real connection string.

## View enquiries

Use the Neon dashboard's table viewer or SQL editor. For a basic list:

```sql
SELECT created_at, name, queries, contact_method, contact
FROM enquiries
ORDER BY created_at DESC;
```

No public endpoint exposes enquiries. This package does not include an admin inbox, email alerts or SMS notifications. Phone and email are visitor-selected contact preferences; the form does not send a message to them automatically.

## Edit with Claude or any code editor

- `app/page.tsx`: sections, text, interactions and contact form.
- `app/globals.css`: colours, typography, layout and responsive styles.
- `lib/enquiries.ts`: selectable queries and validation rules.
- `app/layout.tsx`: page title and description.
- `public/favicon.svg`: browser icon.
- `app/api/enquiries/route.ts`: Neon database connection and insert.
- `lib/enquiry-handler.ts`: request handling and validation.
- `CONTENT.md`: editable website copy in plain language.
- `CLAUDE-BRIEF.md`: project context for further changes.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

The tests cover valid email and phone submissions, invalid inputs, storage failures, request origins and oversized or malformed requests. A real Neon connection is needed to verify a hosted submission end to end.

## Official setup references

- Next.js on Vercel: https://vercel.com/docs/frameworks/full-stack/nextjs
- Import a Git repository: https://vercel.com/docs/git
- Neon integration: https://vercel.com/marketplace/neon/neon
- Neon serverless driver: https://neon.com/docs/serverless/serverless-driver

## Fonts

DM Sans and Manrope load from Google Fonts, with local system fallbacks. The decorative artwork is created in CSS; it does not require external image assets.
