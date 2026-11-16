// Cloudflare Email Sending for the Pages Functions.
// Pages Functions can't take a `send_email` binding, so they reach it through
// the private `crosscoders-mailer` Worker (mailer/) over the MAILER service
// binding. No API token or key exists for this anywhere.
// The from address must be contact@2ko.co.za: 2ko.co.za is onboarded for Email
// Sending, and the mailer refuses any other sender.

export function emailConfigured(env) {
  return Boolean(env.MAILER);
}

// from / replyTo: { email, name }. to / cc: a string or an array of strings.
// Resolves to { ok, status, detail }.
export async function sendEmail(env, { from, to, cc, replyTo, subject, html }) {
  const r = await env.MAILER.fetch('https://mailer/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [].concat(to), cc: cc ? [].concat(cc) : undefined, replyTo, subject, html, text: htmlToText(html) }),
  });
  let detail = '';
  try { const d = await r.json(); detail = d.ok ? '' : `${d.error || ''} ${d.detail || ''}`.trim(); } catch { detail = 'bad mailer response'; }
  return { ok: r.ok && !detail, status: r.status, detail };
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
