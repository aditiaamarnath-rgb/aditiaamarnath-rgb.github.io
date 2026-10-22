# Terminal contact form

The frontend remains on GitHub Pages. This Cloudflare Worker sends email via Resend; it never exposes the email API key to the browser. The recipient is fixed in server configuration, visitors can optionally supply a reply email, and replies use Resend's `reply_to` field.

## Activate

1. Create a Resend API key and verify a sending domain in Resend. In `wrangler.toml`, set `CONTACT_FROM` to a sender on that domain, such as `Portfolio <hello@yourdomain.com>`. Keep `CONTACT_TO` as `aditi.amarnath@gmail.com`.
2. Set `ALLOWED_ORIGINS` to the actual frontend origin(s), comma-separated, without trailing slashes or paths. The supplied GitHub Pages origin is `https://aditiaamarnath-rgb.github.io`. Add your custom origin if applicable.
3. Authenticate with Cloudflare and store the key as a Worker secret (enter it only at the CLI prompt):

   ```sh
   npx wrangler login
   npx wrangler secret put RESEND_API_KEY --config server/contact/wrangler.toml
   npx wrangler deploy --config server/contact/wrangler.toml
   ```

4. Copy the resulting Worker URL and append `/contact`. In GitHub repository **Settings → Secrets and variables → Actions → Variables**, add `VITE_CONTACT_ENDPOINT` with this URL. The Pages workflow reads it at build time. Rebuild/redeploy the frontend.
5. For local frontend development, copy `.env.example` to `.env.local`, set `VITE_CONTACT_ENDPOINT`, and restart Vite. Add `http://localhost:5173` to the Worker's allowed origins while testing. To run the Worker locally, create `server/contact/.dev.vars` with `RESEND_API_KEY=...`, then run `npx wrangler dev --config server/contact/wrangler.toml`; use `http://localhost:8787/contact` as the frontend endpoint.
6. Send a short test message through the terminal and confirm receipt in the target inbox. Provider acceptance does not guarantee inbox delivery; check Resend delivery events if it does not arrive.

Without an endpoint or server key, the form shows an honest unavailable message and leaves the visitor's text intact. The direct email link continues to work.

## Protections and limits

The Worker validates request origin, JSON, optional reply email and a 4,000-character message limit. It uses plain-text email, a hidden honeypot, a fixed recipient, a 16KB request limit, and a Cloudflare rate-limiter binding configured for three requests per IP per minute. Cloudflare rate limits are approximate and apply per location; this is lightweight spam protection, not bot-proof authentication. Shared IPs can share the limit. No message content, API responses, or credentials are logged by application code. The rate-limit namespace `1001` should be changed if another Worker in your account already uses it for an unrelated limit.

Tests mock the email provider, so they do not send real email:

```sh
npm run test:contact
```

References: [Cloudflare rate-limiter binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [Resend email API](https://resend.com/docs/api-reference/emails/send-email).
