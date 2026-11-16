// Cloudflare Pages Function — POST /api/apply
// Emails a Foundation application to the team via Cloudflare Email Sending (lib/send-email.js).
// Sender + recipient are overridable via env (APPLY_FROM / APPLY_TO).

import { emailConfigured, sendEmail } from '../../lib/send-email.js';

const DEFAULT_TO = 'daniel@crosscoders.co.za';
const DEFAULT_CC = 'darren@crosscoders.co.za';
const DEFAULT_FROM = { name: 'CrossCoders Foundation', email: 'contact@2ko.co.za' };

export async function onRequestPost({ request, env }) {
  if (!emailConfigured(env)) return json({ error: 'not_configured' }, 500);

  let f;
  try { f = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }

  if (f.hp_check) return json({ ok: true }); // honeypot — silently accept bots

  const name = (f.name || '').toString().trim();
  const email = (f.email || '').toString().trim();
  if (!name || !email) return json({ error: 'missing_fields' }, 400);

  const esc = (s) => (s == null ? '' : String(s)).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])).slice(0, 4000);
  const rows = [
    ['Name', f.name], ['Organisation', f.org], ['Email', f.email], ['Phone', f.phone],
    ['Location', f.location], ['What they need', f.need], ['Message', f.message], ['Source', f.source || 'apply form'],
  ].filter(([, v]) => v != null && String(v).trim())
    .map(([k, v]) => `<tr><td style="padding:5px 14px 5px 0;color:#8A8472;vertical-align:top;white-space:nowrap"><b>${k}</b></td><td style="padding:5px 0;color:#1A1612">${esc(v)}</td></tr>`)
    .join('');

  const html = `<div style="font-family:system-ui,-apple-system,sans-serif;color:#1A1612;max-width:560px">
    <h2 style="font-family:Georgia,serif;color:#0E8A38;margin:0 0 14px">New build application</h2>
    <table style="font-size:14px;border-collapse:collapse">${rows}</table>
    <p style="color:#8A8472;font-size:12px;margin-top:18px;border-top:1px solid #eee;padding-top:10px">Sent from the CrossCoders Foundation apply form. Reply to this email to reach the applicant.</p>
  </div>`;

  const sender = (env.APPLY_FROM)
    ? { name: 'CrossCoders Foundation', email: env.APPLY_FROM }
    : DEFAULT_FROM;

  try {
    const r = await sendEmail(env, {
      from: sender,
      to: env.APPLY_TO || DEFAULT_TO,
      cc: env.APPLY_CC || DEFAULT_CC,
      replyTo: { email, name },
      subject: `New build application — ${String(f.org || name).slice(0, 80)}`,
      html,
    });
    if (!r.ok) return json({ error: 'send_failed', status: r.status, detail: r.detail }, 502);
    return json({ ok: true });
  } catch {
    return json({ error: 'send_failed' }, 502);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
