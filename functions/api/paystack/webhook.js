// Cloudflare Pages Function — POST /api/paystack/webhook
// Receives Paystack events. It VERIFIES the x-paystack-signature (HMAC-SHA512 of
// the raw body, keyed with your secret key) before trusting anything — so only
// genuine Paystack calls are honoured.
//
// >>> Set THIS URL as your Live Webhook URL in the Paystack dashboard:
//     https://crosscoders.co.za/api/paystack/webhook
//     (replacing the old turkeyvisa.co.za/?callback=gravityformspaystack one)

import { isProject } from './_lib.js';

export async function onRequestPost({ request, env }) {
  if (!env.PAYSTACK_SECRET_KEY) return new Response('not configured', { status: 500 });

  const raw = await request.text();
  const signature = request.headers.get('x-paystack-signature') || '';
  const expected = await hmacSha512Hex(env.PAYSTACK_SECRET_KEY, raw);

  if (!signature || !timingSafeEqual(signature, expected)) {
    return new Response('invalid signature', { status: 401 });
  }

  let event;
  try { event = JSON.parse(raw); } catch { return new Response('bad json', { status: 400 }); }

  // Respond 200 quickly. Keep handlers light; offload heavy work if needed.
  switch (event.event) {
    case 'charge.success': {
      // Record the gift with SAFE DEFAULTS (general fund, named by the giver's name,
      // no journey emails). The thank-you page later enriches this with the giver's
      // explicit choices. Idempotent on `reference`, so re-delivered webhooks are no-ops.
      const d = event.data || {};
      const meta = d.metadata || {};
      if (d.reference && env.DB) {
        const giftName = (meta.name || '').toString().slice(0, 120) || null;
        const tokenHash = meta.alloc_token ? await sha256Hex(meta.alloc_token) : null;
        const proj = isProject(meta.project) ? meta.project : null; // directed-giving intent → default allocation
        try {
          await env.DB.prepare(
            `INSERT OR IGNORE INTO gifts
               (reference, amount_cents, currency, email, name, source, status,
                project_slug, display_name, giver_type, anonymous, email_updates, token_hash)
             VALUES (?, ?, ?, ?, ?, 'paystack', 'success', ?, ?, 'individual', 0, 0, ?)`
          ).bind(d.reference, d.amount ?? 0, d.currency || 'ZAR',
                 (d.customer && d.customer.email) || null, giftName, proj, giftName, tokenHash).run();
        } catch (e) {
          // Never fail the webhook on a DB hiccup — Paystack would retry indefinitely.
        }
      }
      // Email the giver a thank-you + a 24h personalization link (best-effort, gated on Brevo).
      if (d.reference && env.BREVO_API_KEY && d.customer && d.customer.email) {
        const origin = new URL(request.url).origin;
        const link = `${origin}/give/callback?reference=${encodeURIComponent(d.reference)}` +
                     (meta.alloc_token ? `&t=${encodeURIComponent(meta.alloc_token)}` : '');
        await sendGiftEmail(env, { email: d.customer.email, name: meta.name, amountCents: d.amount ?? 0, link }).catch(() => {});
      }
      break;
    }
    default:
      break;
  }

  return new Response('ok', { status: 200 });
}

async function hmacSha512Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(message) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function esc(s) {
  return (s == null ? '' : String(s)).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])).slice(0, 200);
}

// Thank-you + 24h "personalize your gift" link. Mirrors the Brevo pattern in /api/pledge.
async function sendGiftEmail(env, { email, name, amountCents, link }) {
  const sender = { name: 'CrossCoders Foundation', email: env.APPLY_FROM || 'contact@2ko.co.za' };
  const first = (name || '').toString().trim().split(/\s+/)[0] || 'friend';
  const amount = 'R' + Math.round((amountCents || 0) / 100).toLocaleString('en-ZA');
  const html = `<div style="font-family:system-ui,-apple-system,sans-serif;color:#1A1612;max-width:520px;line-height:1.6">
    <h2 style="font-family:Georgia,serif;color:#0E8A38">Thank you, ${esc(first)} 🙏</h2>
    <p>Your gift of <b>${esc(amount)}</b> is in — and it's already at work. <b>Nothing more is needed from you.</b></p>
    <p>If you'd like to make it personal, you have <b>24 hours</b> to choose a specific build to support and how you'd like to be shown:</p>
    <p><a href="${link}" style="display:inline-block;background:#13B24A;color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:600">Personalize my gift →</a></p>
    <p style="color:#8A8472;font-size:13px">After 24 hours your gift simply joins the general fund, used at our discretion to fund the builds that need it most.</p>
    <p style="color:#8A8472;font-size:13px;border-top:1px solid #eee;padding-top:12px;margin-top:18px">CrossCoders · Kingdom Come Foundation — free software for the church.</p>
  </div>`;
  return fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender, to: [{ email }], subject: 'Thank you for your gift — personalize it within 24h', htmlContent: html }),
  });
}

// constant-time-ish comparison so we don't leak timing on the signature check
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
