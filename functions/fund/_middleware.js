// Cloudflare Pages middleware — soft password gate for the investor preview.
// Scoped ONLY to /fund/* : it does not touch any public page or the /api functions.
// Password: "Crosscoders" (matched case-insensitively, trimmed).
const PASSWORD = 'crosscoders';
const COOKIE = 'kc_fund';
const TOKEN = 'kc-fund-ok';

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Password submission
  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const pw = ((form && form.get('password')) || '').toString().trim().toLowerCase();
    if (pw === PASSWORD) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname,
          'Set-Cookie': `${COOKIE}=${TOKEN}; Path=/fund; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`,
        },
      });
    }
    return gate(true);
  }

  // Already unlocked?
  const cookie = request.headers.get('Cookie') || '';
  if (cookie.split(/;\s*/).includes(`${COOKIE}=${TOKEN}`)) return next();

  return gate(false);
}

function gate(wrong) {
  return new Response(page(wrong), {
    status: wrong ? 401 : 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

function page(wrong) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>Kingdom Come Foundation — Investor Preview</title>
<style>
  :root{--ink:#161310;--cream:#F5EFE0;--muted:#C8C0AE;--brass:#E5C685;--forest:#13B24A}
  *{box-sizing:border-box;margin:0}
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
    font-family:Inter,system-ui,sans-serif;color:var(--cream);background:#0F0E0C;
    background-image:radial-gradient(ellipse 600px 400px at 50% 12%,rgba(201,169,97,.18),transparent 62%)}
  .card{width:100%;max-width:380px;text-align:center}
  .mark{width:72px;height:72px;margin:0 auto 22px;display:block}
  .eyebrow{font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;color:var(--brass);font-weight:600}
  h1{font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:1.7rem;margin:12px 0 6px;letter-spacing:-.01em}
  p{color:var(--muted);font-size:.92rem;line-height:1.55;margin-bottom:22px}
  form{display:flex;gap:8px}
  input{flex:1;font:inherit;font-size:1rem;color:var(--ink);background:var(--cream);border:0;border-radius:11px;padding:13px 15px}
  input:focus{outline:2px solid var(--forest)}
  button{font:inherit;font-weight:600;color:#fff;background:var(--forest);border:0;border-radius:11px;padding:0 20px;cursor:pointer}
  .err{color:#E8B0A4;font-size:.82rem;margin-top:14px;min-height:1em}
</style></head>
<body><div class="card">
  <svg class="mark" viewBox="0 0 100 100" aria-hidden="true">
    <rect x="6" y="6" width="88" height="88" rx="20" fill="#161310" stroke="rgba(245,239,224,.1)" stroke-width="1.5"/>
    <g stroke="#C9A961" stroke-width="2.4" stroke-linecap="round" opacity=".7">
      <line x1="50" y1="64" x2="50" y2="13"/><line x1="50" y1="64" x2="33" y2="16"/><line x1="50" y1="64" x2="67" y2="16"/>
      <line x1="50" y1="64" x2="20" y2="26"/><line x1="50" y1="64" x2="80" y2="26"/>
    </g>
    <path d="M22 64 a28 28 0 0 1 56 0 Z" fill="#C9A961"/>
    <rect x="4" y="64" width="92" height="32" fill="#161310"/>
    <line x1="13" y1="64" x2="87" y2="64" stroke="#3FD174" stroke-width="2.4" stroke-linecap="round"/>
    <g fill="#F5EFE0"><rect x="46.4" y="29" width="7.2" height="43" rx="2.6"/><rect x="37.5" y="41" width="25" height="7.2" rx="2.6"/></g>
  </svg>
  <div class="eyebrow">Kingdom Come Foundation</div>
  <h1>Investor preview</h1>
  <p>This page is private. Enter the password you were given to continue.</p>
  <form method="POST" autocomplete="off">
    <input type="password" name="password" placeholder="Password" autofocus aria-label="Password" />
    <button type="submit">Enter</button>
  </form>
  <div class="err">${wrong ? 'That password isn’t right — please try again.' : ''}</div>
</div></body></html>`;
}
