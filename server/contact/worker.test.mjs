import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from './worker.js';

const origin = 'https://aditiaamarnath-rgb.github.io';
const env = {
  ALLOWED_ORIGINS: origin,
  CONTACT_FROM: 'Portfolio <hello@example.com>',
  CONTACT_TO: 'aditi.amarnath@gmail.com',
  RESEND_API_KEY: 'test-only-not-a-real-key',
  CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
};
const request = (body, overrides = {}) => new Request('https://example.workers.dev/contact', {
  method: 'POST',
  headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' },
  body: JSON.stringify(body),
  ...overrides,
});
const noEmail = () => { assert.fail('Email service must not be called'); };

test('sends to the fixed recipient and sets visitor reply-to; only acknowledges provider acceptance', async () => {
  let payload;
  const response = await handleContact(request({ message: 'Hello <script>test</script>', email: 'reader@example.com', to: 'attacker@example.com' }), env, async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    payload = JSON.parse(options.body);
    return Response.json({ id: 'test-message-id' });
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(payload.to, ['aditi.amarnath@gmail.com']);
  assert.equal(payload.reply_to, 'reader@example.com');
  assert.equal(payload.html, undefined);
  assert.match(payload.text, /Hello <script>test<\/script>/);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
});

test('optional email can be omitted', async () => {
  const response = await handleContact(request({ message: 'Anonymous note' }), env, async (_url, options) => {
    assert.equal(JSON.parse(options.body).reply_to, undefined);
    return Response.json({ id: 'accepted' });
  });
  assert.equal(response.status, 200);
});

test('rejects blank, oversized, malformed and invalid reply-email submissions', async () => {
  for (const body of [{ message: ' ' }, { message: 'x'.repeat(4001) }, { message: 'hi', email: 'bad\r\nBcc: injected@example.com' }, { message: 'hi', email: {} }, null, []]) {
    assert.equal((await handleContact(request(body), env, noEmail)).status, 400);
  }
  assert.equal((await handleContact(request({}, { body: '{invalid' }), env, noEmail)).status, 400);
  assert.equal((await handleContact(request({ message: 'x'.repeat(17000) }), env, noEmail)).status, 413);
});

test('honeypot silently discards bots', async () => {
  assert.equal((await handleContact(request({ message: 'bot', website: 'spam' }), env, noEmail)).status, 200);
});

test('only allows configured origins, JSON POST and CORS preflight', async () => {
  assert.equal((await handleContact(request({ message: 'hi' }, { headers: { Origin: 'https://other.example' } }), env, noEmail)).status, 403);
  assert.equal((await handleContact(request({}, { method: 'GET', body: undefined }), env, noEmail)).status, 405);
  assert.equal((await handleContact(request({}, { method: 'OPTIONS', body: undefined }), env, noEmail)).status, 204);
  assert.equal((await handleContact(request({}, { headers: { Origin: origin, 'Content-Type': 'text/plain' } }), env, noEmail)).status, 415);
});

test('fails closed without credentials or when rate-limited', async () => {
  assert.equal((await handleContact(request({ message: 'hi' }), { ...env, RESEND_API_KEY: '' }, noEmail)).status, 503);
  const limited = { ...env, CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) } };
  const response = await handleContact(request({ message: 'hi' }), limited, noEmail);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
});

test('provider failures never claim delivery or reveal credentials', async () => {
  for (const send of [async () => Response.json({ error: 'secret diagnostics' }, { status: 403 }), async () => { throw new Error('private token'); }, async () => Response.json({})]) {
    const response = await handleContact(request({ message: 'hi' }), env, send);
    assert.equal(response.status, 502);
    const result = await response.text();
    assert.doesNotMatch(result, /private token|secret diagnostics/);
  }
});
