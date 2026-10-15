import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleEnquiry } from '../lib/enquiry-handler.ts';
const valid = () => ({submissionId:crypto.randomUUID(),queries:['website','strategy'],name:' Test Visitor ',contactMethod:'email',contact:'visitor@example.com'});
const request = (body: unknown, origin = 'https://portfolio.example') => new Request('https://portfolio.example/api/enquiries', {method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(body)});
test('email enquiry saves trimmed details before reporting success',async()=>{
  const saved: unknown[]=[];
  const result=await handleEnquiry(request(valid()), async data=>{saved.push(data)});
  assert.equal(result.status,201); assert.equal((saved[0] as {name:string}).name,'Test Visitor'); assert.deepEqual(await result.json(),{ok:true});
});
test('phone is accepted without requiring an email',async()=>{
  const result=await handleEnquiry(request({...valid(),contactMethod:'phone',contact:'+91 98765 43210'}),async()=>{});
  assert.equal(result.status,201);
});
test('invalid and bot submissions never reach storage',async()=>{
  for(const patch of [{queries:[]},{queries:['unknown']},{queries:['website','website']},{name:' '},{contact:'bad'},{contactMethod:'phone',contact:'123'},{website:'spam'},{submissionId:'invalid'}]){
    let calls=0;
    const result=await handleEnquiry(request({...valid(),...patch}),async()=>{calls++});
    assert.equal(result.status,400); assert.equal(calls,0);
  }
});
test('database failures are not shown as successful submissions',async()=>{
  const result=await handleEnquiry(request(valid()),async()=>{throw new Error('unavailable')});
  assert.equal(result.status,503); assert.equal((await result.json() as {ok?:boolean}).ok,undefined);
});
test('rejects cross-origin and malformed origins',async()=>{
  for(const origin of ['https://other.example','invalid']){
    const result=await handleEnquiry(request(valid(),origin),async()=>{throw new Error('must not save')});
    assert.equal(result.status,403);
  }
});
test('rejects malformed JSON and oversized requests',async()=>{
  const make=(body:string)=>new Request('https://portfolio.example/api/enquiries',{method:'POST',headers:{'content-type':'application/json'},body});
  assert.equal((await handleEnquiry(make('{broken'),async()=>{})).status,400);
  assert.equal((await handleEnquiry(make(JSON.stringify({padding:'x'.repeat(9000)})),async()=>{})).status,413);
});
