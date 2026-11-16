// Cloudflare Email Sending, over its REST API.
// Pages Functions can't take a `send_email` binding, so this posts to the API
// with an account id + token (env.CLOUDFLARE_ACCOUNT_ID / env.CLOUDFLARE_EMAIL_TOKEN).
// The REST field names differ from the Workers binding and a wrong one is
// dropped silently: `from` takes `address` (not `email`), reply-to is `reply_to`.
// The from address must be on a domain onboarded for Email Sending (2ko.co.za is).

export function emailConfigured(env) {
  return Boolean(env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_EMAIL_TOKEN);
}

// from / replyTo: { email, name }. to / cc: a string or an array of strings.
// Resolves to { ok, status, detail }. A 200 with a permanent bounce is not ok.
export async function sendEmail(env, { from, to, cc, replyTo, subject, html }) {
  const body = {
    from: { address: from.email, name: from.name },
    to: [].concat(to),
    subject,
    html,
    text: htmlToText(html),
  };
  if (cc) body.cc = [].concat(cc);
  if (replyTo && replyTo.email) body.reply_to = { address: replyTo.email, name: replyTo.name || replyTo.email };

  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`, {
    method: 'POST',
    headers: { authorization: `Bearer ${env.CLOUDFLARE_EMAIL_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const raw = await r.text();
  if (!r.ok) return { ok: false, status: r.status, detail: raw.slice(0, 300) };

  let bounced = [];
  try { bounced = JSON.parse(raw)?.result?.permanent_bounces || []; } catch { /* non-JSON 200: treat as sent */ }
  if (bounced.length) return { ok: false, status: r.status, detail: `permanent bounce: ${bounced.join(', ')}` };

  return { ok: true, status: r.status, detail: '' };
}

function htmlToText(html) {
  return String(html)
    .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<\/(p|h\d|div|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}
