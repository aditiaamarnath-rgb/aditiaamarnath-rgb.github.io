const MAX_BODY = 16000;
const EMAIL = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

export async function handleContact(request, env, send = fetch) {
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean);
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' };
  const respond = (status, error, extra = {}) => Response.json(error ? { error } : { ok: true }, { status, headers: { ...headers, ...extra } });
  if (!origin || !allowed.includes(origin)) return respond(403, 'This site is not allowed to send messages.');
  headers['Access-Control-Allow-Origin'] = origin;
  headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type';
  if (new URL(request.url).pathname !== '/contact') return respond(404, 'Not found.');
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return respond(405, 'Use POST.', { Allow: 'POST, OPTIONS' });
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return respond(415, 'Use JSON.');
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO || !env.CONTACT_RATE_LIMITER) return respond(503, 'Message sending is temporarily unavailable. Please email me directly.');

  try {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: `contact:${request.headers.get('CF-Connecting-IP') || 'unknown'}` });
    if (!success) return respond(429, 'Too many messages. Please wait a minute and try again.', { 'Retry-After': '60' });
  } catch {
    return respond(503, 'Message sending is temporarily unavailable.');
  }

  // Bound actual bytes, including chunked requests, before parsing JSON.
  const reader = request.body?.getReader();
  if (!reader) return respond(400, 'Please enter a message.');
  const chunks = [];
  let bytes = 0;
  let body;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY) { await reader.cancel(); return respond(413, 'Message is too long.'); }
      chunks.push(value);
    }
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
    body = JSON.parse(new TextDecoder().decode(buffer));
  } catch {
    return respond(400, 'Invalid message. Please try again.');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return respond(400, 'Invalid message.');
  // Silently discard submissions that filled the bot-only field.
  if (body.website) return respond(200);
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!message || message.length > 4000) return respond(400, 'Enter a message between 1 and 4,000 characters.');
  if ((body.email != null && typeof body.email !== 'string') || email.length > 254 || (email && !EMAIL.test(email))) return respond(400, 'Please enter a valid reply email, or leave it blank.');

  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        subject: 'Message from your portfolio',
        text: `Reply email: ${email || 'Not provided'}\n\n${message}`,
        ...(email ? { reply_to: email } : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return respond(502, 'Could not send your message. Please try again later or email me directly.');
    const result = await response.json();
    if (!result.id) return respond(502, 'Could not confirm your message. Please email me directly.');
    return respond(200);
  } catch {
    return respond(502, 'Could not send your message. Please try again later or email me directly.');
  }
}

export default {
  fetch(request, env) { return handleContact(request, env); },
};
