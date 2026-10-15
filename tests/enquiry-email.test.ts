import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliverEnquiry } from '../lib/enquiry-email.ts';
import { enquirySchema } from '../lib/enquiries.ts';
import { handleEnquiry } from '../lib/enquiry-handler.ts';
const data = () => enquirySchema.parse({ submissionId:crypto.randomUUID(), queries:['website','strategy'], name:'Test Visitor', contactMethod:'email', contact:'visitor@example.com' });
const config = { RESEND_API_KEY:'fake-test-key', RESEND_FROM_EMAIL:'Portfolio <enquiries@example.com>', CONTACT_TO_EMAIL:'owner@example.com' };
function stub(status=200, result:unknown={id:'test-email-id'}) {
  const calls: Array<{url: string; options: RequestInit}> = [];
  const request = (async (url: string|URL|Request, options?: RequestInit) => {
    calls.push({url:String(url),options:options || {}});
    return Response.json(result,{status});
  }) as typeof fetch;
  return {calls,request};
}
test('emails only the owner with query labels and visitor Reply-To',async()=>{
  const {calls,request}=stub(); const entry=data();
  await deliverEnquiry(entry,config,request);
  assert.equal(calls.length,1); assert.equal(calls[0].url,'https://api.resend.com/emails');
  const payload=JSON.parse(calls[0].options.body as string);
  assert.deepEqual(payload.to,['owner@example.com']); assert.equal(payload.reply_to,entry.contact);
  assert.ok(payload.text.includes('I need a website')); assert.ok(payload.text.includes('I need product guidance'));
  assert.equal(payload.from,config.RESEND_FROM_EMAIL);
});
test('phone enquiries work without an email address or database',async()=>{
  const {calls,request}=stub();
  await deliverEnquiry({...data(),contactMethod:'phone',contact:'+91 98765 43210'},config,request);
  const payload=JSON.parse(calls[0].options.body as string);
  assert.equal(payload.reply_to,undefined); assert.ok(payload.text.includes('+91 98765 43210'));
});
test('exact retries use a stable key; changed details use a new key',async()=>{
  const {calls,request}=stub(); const entry=data();
  await deliverEnquiry(entry,config,request); await deliverEnquiry(entry,config,request);
  await deliverEnquiry({...entry,name:'Updated name'},config,request);
  const key=(i:number)=>(calls[i].options.headers as Record<string,string>)['Idempotency-Key'];
  assert.equal(key(0),key(1)); assert.notEqual(key(0),key(2)); assert.ok(key(0).length<=256);
});
test('missing configuration never archives or contacts Resend',async()=>{
  for(const missing of ['RESEND_API_KEY','RESEND_FROM_EMAIL','CONTACT_TO_EMAIL']){
    const {calls,request}=stub(); let archived=false;
    await assert.rejects(()=>deliverEnquiry(data(),{...config,[missing]:''},request,async()=>{archived=true}));
    assert.equal(calls.length,0); assert.equal(archived,false);
  }
});
test('provider rejection and invalid success bodies are treated as failures',async()=>{
  for(const [status,result] of [[403,{message:'rejected'}],[429,{message:'limited'}],[200,{}],[200,{id:''}]] as const){
    await assert.rejects(()=>deliverEnquiry(data(),config,stub(status,result).request));
  }
});
test('network failures propagate as a retryable form error',async()=>{
  const request = (async()=>{throw new Error('network failure')}) as typeof fetch;
  const entry=data();
  const incoming=new Request('https://portfolio.example/api/enquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(entry)});
  const result=await handleEnquiry(incoming,d=>deliverEnquiry(d,config,request));
  assert.equal(result.status,503); assert.equal((await result.json() as {error:string}).error,'Your enquiry could not be sent. Please try again in a moment.');
});
test('optional database archive completes before email and blocks email if it fails',async()=>{
  const {calls,request}=stub(); let archived=false;
  await deliverEnquiry(data(),config,request,async()=>{assert.equal(calls.length,0);archived=true});
  assert.equal(archived,true); assert.equal(calls.length,1);
  const failed=stub();
  await assert.rejects(()=>deliverEnquiry(data(),config,failed.request,async()=>{throw new Error('database failed')}));
  assert.equal(failed.calls.length,0);
});
test('visitor text remains plain text and cannot inject a subject header',async()=>{
  const {calls,request}=stub();
  await deliverEnquiry({...data(),name:'Test\r\nBcc: other@example.com <script>'},config,request);
  const payload=JSON.parse(calls[0].options.body as string);
  assert.ok(!/[\r\n]/.test(payload.subject)); assert.equal(payload.html,undefined);
});
