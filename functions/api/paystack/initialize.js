// Cloudflare Pages Function — POST /api/paystack/initialize
// Starts a Paystack transaction SERVER-SIDE. The secret key lives only in
// env.PAYSTACK_SECRET_KEY (a Cloudflare Pages secret) — it never reaches the
// browser or the repo. Returns { authorization_url, reference }; the browser
// then redirects the giver to Paystack's hosted, PCI-compliant checkout.

import { isProject } from './_lib.js';

export async function onRequestPost({ request, env }) {
  if (!env.PAYSTACK_SECRET_KEY) return json({ error: 'not_configured' }, 500);

  let f;
  try { f = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }

  if (f.hp_check) return json({ ok: true, skip: true }); // honeypot — silently accept, do nothing

  const email = (f.email || '').toString().trim();
  if (!email || !/.+@.+\..+/.test(email)) return json({ error: 'invalid_email' }, 400);

  // Amount arrives in major units (Rand). Paystack expects the subunit (cents).
  const rand = Math.floor(Number(f.amount));
  if (!Number.isFinite(rand) || rand < 10) return json({ error: 'invalid_amount' }, 400);   // min R10
  if (rand > 1_000_000) return json({ error: 'amount_too_large' }, 400);                      // sanity cap

  const origin = new URL(request.url).origin;
  const name = (f.name || '').toString().slice(0, 120);
  const allocToken = crypto.randomUUID(); // one-time token → only the payer can allocate on the thank-you page
  const project = isProject((f.project || '').toString()) ? f.project.toString() : null; // directed-giving intent (from a project page)

  try {
    const r = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: rand * 100,
        currency: 'ZAR',
        callback_url: `${origin}/give/callback`,
        metadata: {
          name,
          alloc_token: allocToken,
          project,
          purpose: 'CrossCoders — give',
          custom_fields: name
            ? [{ display_name: 'Name', variable_name: 'name', value: name }]
            : [],
        },
      }),
    });
    const data = await r.json();
    if (!r.ok || !data?.status || !data?.data?.authorization_url) {
      return json({ error: 'init_failed', detail: (data && data.message) || 'unknown' }, 502);
    }
    return json({ authorization_url: data.data.authorization_url, reference: data.data.reference, alloc_token: allocToken });
  } catch {
    return json({ error: 'fetch_failed' }, 502);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
