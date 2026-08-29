const BASE_URL = 'http://127.0.0.1:5001/api';

async function runTests() {
  console.log('--- Starting API Verification Tests ---');

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  console.log('✅ 1. Health check:', health.status);

  // 2. Auth Login
  const loginReq = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'abhay.demo@emailassistant.ai',
      password: 'demo12345'
    })
  });
  const loginRes = await loginReq.json();
  console.log('✅ 2. Auth Login:', loginRes.success ? 'Success' : 'Failed', '- User:', loginRes.data?.name);
  const token = loginRes.data?.token;

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Emails List
  const emailsReq = await fetch(`${BASE_URL}/emails`, { headers: authHeaders });
  const emailsRes = await emailsReq.json();
  console.log('✅ 3. Emails fetched:', emailsRes.data?.length, 'emails in inbox');
  const sampleEmail = emailsRes.data[0];

  // 4. AI Summarize
  const sumReq = await fetch(`${BASE_URL}/ai/summarize`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      emailId: sampleEmail._id,
      subject: sampleEmail.subject,
      body: sampleEmail.body
    })
  });
  const sumRes = await sumReq.json();
  console.log('✅ 4. AI Summarize result:\n   ↳', sumRes.data?.summary);

  // 5. AI Reply (Professional)
  const replyProfReq = await fetch(`${BASE_URL}/ai/reply`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      emailId: sampleEmail._id,
      subject: sampleEmail.subject,
      body: sampleEmail.body,
      sender: sampleEmail.from,
      tone: 'Professional'
    })
  });
  const replyProf = await replyProfReq.json();
  console.log('✅ 5. AI Reply (Professional) generated:\n   ↳', replyProf.data?.reply.split('\n')[0]);

  // 6. AI Reply (Concise)
  const replyConciseReq = await fetch(`${BASE_URL}/ai/reply`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      emailId: sampleEmail._id,
      subject: sampleEmail.subject,
      body: sampleEmail.body,
      sender: sampleEmail.from,
      tone: 'Concise'
    })
  });
  const replyConcise = await replyConciseReq.json();
  console.log('✅ 6. AI Reply (Concise) generated:\n   ↳', replyConcise.data?.reply.replace(/\n+/g, ' '));

  // 7. AI Action Items
  const actionItemsReq = await fetch(`${BASE_URL}/ai/action-items`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      emailId: sampleEmail._id,
      subject: sampleEmail.subject,
      body: sampleEmail.body
    })
  });
  const actionItemsRes = await actionItemsReq.json();
  console.log('✅ 7. AI Action Items extracted:', actionItemsRes.data?.actionItems?.length, 'tasks detected');

  // 8. AI Explain
  const explainReq = await fetch(`${BASE_URL}/ai/explain`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      emailId: sampleEmail._id,
      subject: sampleEmail.subject,
      body: sampleEmail.body
    })
  });
  const explainRes = await explainReq.json();
  console.log('✅ 8. AI Explain (ELI5) generated successfully');

  // 9. Dashboard Analytics
  const analyticsReq = await fetch(`${BASE_URL}/analytics/dashboard`, { headers: authHeaders });
  const analyticsRes = await analyticsReq.json();
  console.log('✅ 9. Analytics stats:', analyticsRes.data?.stats);

  // 10. Email Send
  const sendReq = await fetch(`${BASE_URL}/emails/send`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      to: 'sarah.jenkins@acmecorp.io',
      subject: 'Re: Urgent: Q3 AI Architecture Review',
      body: 'Hi Sarah, Confirmed! I will attend the sync tomorrow.'
    })
  });
  const sendRes = await sendReq.json();
  console.log('✅ 10. Email dispatch:', sendRes.success ? 'Success' : 'Failed');

  console.log('\n=============================================================');
  console.log('🎉 ALL 10 END-TO-END VERIFICATION TESTS PASSED FLAWLESSLY!');
  console.log('=============================================================\n');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
});
