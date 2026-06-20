// Cloudflare Pages Function — POST /api/pledge
// Handles two intents from the queue: `pledge` (intent to give toward a named
// build) and `follow` (email updates on a build). Emails the team via Brevo and
// sends the supporter a confirmation. No money moves — Phase 0 register-interest.

const DEFAULT_TO = 'darren@2ko.co.za';
const DEFAULT_FROM = { name: 'CrossCoders Foundation', email: 'contact@2ko.co.za' };

export async function onRequestPost({ request, env }) {
  if (!env.BREVO_API_KEY) return json({ error: 'not_configured' }, 500);

  let f;
  try { f = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }

  if (f.hp_check) return json({ ok: true }); // honeypot

  const intent = f.intent === 'follow' ? 'follow' : 'pledge';
  const email = (f.email || '').toString().trim();
  if (!email || !/.+@.+\..+/.test(email)) return json({ error: 'missing_fields' }, 400);
  if (intent === 'pledge' && !(f.name || '').toString().trim()) return json({ error: 'missing_fields' }, 400);

  const esc = (s) => (s == null ? '' : String(s)).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])).slice(0, 4000);
  const churchName = (f.churchName || f.church || 'a build').toString().slice(0, 120);
  const amount = f.amount ? 'R' + String(f.amount).replace(/[^\d]/g, '').slice(0, 9) : '';

  const sender = env.APPLY_FROM ? { name: 'CrossCoders Foundation', email: env.APPLY_FROM } : DEFAULT_FROM;

  // 1) Notify the team (must succeed)
  const rows = [
    ['Intent', intent === 'pledge' ? 'PLEDGE' : 'Follow updates'],
    ['Church / build', churchName],
    ['Amount', amount],
    ['Name', f.name],
    ['Email', f.email],
    ['Message', f.message],
    ['Source', f.source || 'queue'],
  ].filter(([, v]) => v != null && String(v).trim())
    .map(([k, v]) => `<tr><td style="padding:5px 14px 5px 0;color:#8A8472;vertical-align:top;white-space:nowrap"><b>${k}</b></td><td style="padding:5px 0;color:#1A1612">${esc(v)}</td></tr>`)
    .join('');

  const teamHtml = `<div style="font-family:system-ui,-apple-system,sans-serif;color:#1A1612;max-width:560px">
    <h2 style="font-family:Georgia,serif;color:#0E8A38;margin:0 0 14px">${intent === 'pledge' ? 'New pledge' : 'New build follower'} — ${esc(churchName)}</h2>
    <table style="font-size:14px;border-collapse:collapse">${rows}</table>
    <p style="color:#8A8472;font-size:12px;margin-top:18px;border-top:1px solid #eee;padding-top:10px">From the queue on crosscoders. Reply to reach the supporter.</p>
  </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender,
        to: [{ email: env.APPLY_TO || DEFAULT_TO }],
        replyTo: { email, name: (f.name || '').toString().slice(0, 80) || email },
        subject: `${intent === 'pledge' ? `Pledge${amount ? ' ' + amount : ''}` : 'Follow'} — ${churchName}`,
        htmlContent: teamHtml,
      }),
    });
    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      return json({ error: 'send_failed', status: r.status, detail }, 502);
    }
  } catch {
    return json({ error: 'send_failed' }, 502);
  }

  // 2) Confirm to the supporter (best-effort — never fails the request)
  const firstName = (f.name || '').toString().trim().split(/\s+/)[0] || 'there';
  const confHtml = intent === 'pledge'
    ? `<div style="font-family:system-ui,-apple-system,sans-serif;color:#1A1612;max-width:520px;line-height:1.6">
        <h2 style="font-family:Georgia,serif;color:#0E8A38">Thank you, ${esc(firstName)}.</h2>
        <p>We’ve logged your pledge${amount ? ` of <b>${esc(amount)}</b>` : ''} toward <b>${esc(churchName)}</b>.</p>
        <p>No money moves yet — pledges simply register your intent. The moment giving opens (once the Foundation is registered), we’ll email you to complete it, and we’ll keep you posted as ${esc(churchName)} moves from funded to built to launched.</p>
        <p style="color:#8A8472;font-size:13px;border-top:1px solid #eee;padding-top:12px;margin-top:18px">CrossCoders · Kingdom Come Foundation — free software for the church.</p>
      </div>`
    : `<div style="font-family:system-ui,-apple-system,sans-serif;color:#1A1612;max-width:520px;line-height:1.6">
        <h2 style="font-family:Georgia,serif;color:#0E8A38">You’re following ${esc(churchName)}.</h2>
        <p>We’ll email you each time this build moves forward — funded, building, and the day it launches.</p>
        <p style="color:#8A8472;font-size:13px;border-top:1px solid #eee;padding-top:12px;margin-top:18px">CrossCoders · Kingdom Come Foundation — free software for the church.</p>
      </div>`;

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender,
        to: [{ email }],
        subject: intent === 'pledge' ? `Your pledge to ${churchName}` : `You're following ${churchName}`,
        htmlContent: confHtml,
      }),
    });
  } catch { /* best-effort */ }

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
