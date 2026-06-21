// Cloudflare Pages Function — GET /api/paystack/verify?reference=...
// Confirms a transaction with Paystack using the server-side secret key. The
// browser calls this on the /give/callback page to show a trustworthy result.
// Never trust the browser's word that a payment succeeded — always verify here.

export async function onRequestGet({ request, env }) {
  if (!env.PAYSTACK_SECRET_KEY) return json({ error: 'not_configured' }, 500);

  const reference = new URL(request.url).searchParams.get('reference');
  if (!reference) return json({ error: 'missing_reference' }, 400);

  try {
    const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await r.json();
    if (!r.ok || !data?.data) return json({ error: 'verify_failed' }, 502);

    const d = data.data;
    return json({
      status: d.status,                                   // 'success' | 'failed' | 'abandoned' | ...
      reference: d.reference,
      amount: d.amount != null ? d.amount / 100 : null,   // back to major units (Rand)
      currency: d.currency,
      paid_at: d.paid_at || null,
      name: d.metadata?.name || null,
      project: d.metadata?.project || null,
    });
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
