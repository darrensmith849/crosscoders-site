// Cloudflare Pages Function — POST /api/paystack/allocate
// The post-payment step. The giver chooses where their gift goes and how they're
// shown. We NEVER trust the browser that a payment happened — we re-verify with
// Paystack, and require the one-time alloc_token (minted at checkout) so only the
// actual payer can allocate or de-anonymise this gift.

import { isProject } from './_lib.js';

export async function onRequestPost({ request, env }) {
  if (!env.PAYSTACK_SECRET_KEY) return json({ error: 'not_configured' }, 500);
  if (!env.DB) return json({ error: 'no_db' }, 500);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }

  const reference = (body.reference || '').toString().trim();
  const token = (body.alloc_token || '').toString();
  if (!reference || !token) return json({ error: 'missing_params' }, 400);

  // 1) Verify with Paystack — the source of truth that this is a real, successful gift.
  let v;
  try {
    const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    });
    v = await r.json();
  } catch { return json({ error: 'verify_failed' }, 502); }

  const d = v && v.data;
  if (!d || d.status !== 'success') return json({ error: 'not_successful' }, 402);

  // 2) Authorise — the token must match the one we put in the metadata at checkout.
  if (!d.metadata || d.metadata.alloc_token !== token) return json({ error: 'unauthorised' }, 403);

  // 2b) The 24-hour personalization window. After that the gift simply stays in the
  // general fund (the webhook already recorded it), so we decline further changes.
  const paidAt = d.paid_at ? Date.parse(d.paid_at) : 0;
  if (paidAt && Date.now() - paidAt > 24 * 60 * 60 * 1000) return json({ error: 'window_closed' }, 410);

  // 3) Sanitise the giver's choices.
  let projectSlug = (body.project || '').toString().trim();
  if (!projectSlug || projectSlug === 'general' || !isProject(projectSlug)) projectSlug = null;
  const anonymous = body.anonymous ? 1 : 0;
  const giverType = body.giverType === 'business' ? 'business' : 'individual';
  const emailUpdates = body.emailUpdates ? 1 : 0;
  let displayName = (body.displayName || d.metadata.name || '').toString().trim().slice(0, 120) || null;
  if (anonymous) displayName = null;

  // 4) Upsert — create the row if the webhook hasn't yet, else enrich it with the choices.
  try {
    await env.DB.prepare(
      `INSERT INTO gifts (reference, amount_cents, currency, email, name, source, status,
         project_slug, display_name, giver_type, anonymous, email_updates, allocated_at)
       VALUES (?, ?, ?, ?, ?, 'paystack', 'success', ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(reference) DO UPDATE SET
         project_slug  = excluded.project_slug,
         display_name  = excluded.display_name,
         giver_type    = excluded.giver_type,
         anonymous     = excluded.anonymous,
         email_updates = excluded.email_updates,
         allocated_at  = datetime('now')`
    ).bind(
      reference, d.amount ?? 0, d.currency || 'ZAR', (d.customer && d.customer.email) || null,
      d.metadata.name || null, projectSlug, displayName, giverType, anonymous, emailUpdates
    ).run();
  } catch { return json({ error: 'save_failed' }, 500); }

  // 5) Their position on the board (this gift included).
  const countRow = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM gifts WHERE status='success' AND ` +
    (projectSlug ? 'project_slug = ?' : 'project_slug IS NULL')
  ).bind(...(projectSlug ? [projectSlug] : [])).first();

  return json({ ok: true, project: projectSlug || 'general', benefactorNumber: (countRow && countRow.n) || 1 });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
