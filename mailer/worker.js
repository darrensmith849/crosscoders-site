// Sends one email through the EMAIL binding. Called only over the MAILER service
// binding from the CrossCoders Pages Functions (see lib/send-email.js).
// Body: { from: { email, name }, to, cc, replyTo: { email, name }, subject, html, text }

const SENDER = 'contact@2ko.co.za';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

    let m;
    try { m = await request.json(); } catch { return json({ ok: false, error: 'bad_request' }, 400); }

    if (!m || !m.subject || !m.html || !m.to) return json({ ok: false, error: 'missing_fields' }, 400);
    if (!m.from || m.from.email !== SENDER) return json({ ok: false, error: 'sender_not_allowed' }, 400);

    const message = {
      from: { email: SENDER, name: m.from.name || 'CrossCoders Foundation' },
      // cc rides along as extra `to` recipients: every address still gets it.
      to: [].concat(m.to, m.cc || []),
      subject: m.subject,
      html: m.html,
      text: m.text || '',
    };
    if (m.replyTo && m.replyTo.email) message.replyTo = m.replyTo.email;

    try {
      await env.EMAIL.send(message);
      return json({ ok: true });
    } catch (e) {
      return json({ ok: false, error: 'send_failed', detail: String(e && (e.code || e.message) || e).slice(0, 300) }, 502);
    }
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}
