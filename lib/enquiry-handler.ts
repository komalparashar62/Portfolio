import { enquirySchema } from './enquiries.ts';
export type Enquiry = ReturnType<typeof enquirySchema.parse>;
export async function handleEnquiry(request: Request, save: (data: Enquiry) => Promise<void>) {
  const response = (data: unknown, status: number) => Response.json(data, {status, headers: {'Cache-Control':'no-store'}});
  const origin = request.headers.get('origin');
  if (origin) {
    try { if (new URL(origin).host !== new URL(request.url).host) return response({error:'Please submit from this website.'},403); }
    catch { return response({error:'Invalid request origin.'},403); }
  }
  if (!request.headers.get('content-type')?.includes('application/json')) return response({error:'Unsupported request.'},415);
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 8192) return response({error:'Request is too large.'},413);
    body = JSON.parse(raw);
  } catch { return response({error:'Please check your details and try again.'},400); }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return response({error:parsed.error.issues[0]?.message || 'Please check your details.'},400);
  try {
    await save(parsed.data);
    return response({ok:true},201);
  } catch { return response({error:'Your enquiry could not be saved. Please try again in a moment.'},503); }
}
