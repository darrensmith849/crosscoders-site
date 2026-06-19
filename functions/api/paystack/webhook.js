// Cloudflare Pages Function — POST /api/paystack/webhook
// Receives Paystack events. It VERIFIES the x-paystack-signature (HMAC-SHA512 of
// the raw body, keyed with your secret key) before trusting anything — so only
// genuine Paystack calls are honoured.
//
// >>> Set THIS URL as your Live Webhook URL in the Paystack dashboard:
//     https://crosscoders.dev/api/paystack/webhook
//     (replacing the old turkeyvisa.co.za/?callback=gravityformspaystack one)

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
      // const ref = event.data?.reference;
      // const amount = (event.data?.amount ?? 0) / 100;
      // const email = event.data?.customer?.email;
      // TODO: record the gift (e.g. email the team via Brevo, like /api/pledge does).
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

// constant-time-ish comparison so we don't leak timing on the signature check
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
