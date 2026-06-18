// Generates the social share (Open Graph) card HTML with brand fonts inlined as
// base64, so headless Chrome renders Fraunces/Inter exactly with no load race.
// Usage: node scripts/build-og.mjs  ->  writes /tmp/og-card.html
import { writeFileSync } from 'node:fs';

const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=Inter:wght@500;600;700&display=swap';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const css = await (await fetch(FONT_CSS, { headers: { 'User-Agent': UA } })).text();
// Keep only the `latin` subset blocks to keep the file small.
const latinBlocks = css
  .split('/*')
  .filter((b) => b.trimStart().startsWith('latin */'))
  .map((b) => '/*' + b);
let fontFaces = latinBlocks.join('\n');
const urls = [...new Set([...fontFaces.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1]))];
await Promise.all(
  urls.map(async (u) => {
    const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
    fontFaces = fontFaces.replaceAll(u, `data:font/woff2;base64,${buf.toString('base64')}`);
  }),
);

const mark = `<svg width="74" height="74" viewBox="0 0 100 100">
  <rect x="6" y="6" width="88" height="88" rx="20" fill="#1A1612"/>
  <rect x="44" y="14" width="8" height="58" rx="3" fill="#3FD174"/>
  <rect x="29" y="25" width="38" height="8" rx="3" fill="#3FD174"/>
  <rect x="60" y="58" width="8" height="12" rx="1.5" fill="#C9A961"/>
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
.og{position:relative;width:1200px;height:630px;background:#F7F2E8;overflow:hidden;padding:60px 74px;display:flex;flex-direction:column;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
.g{position:absolute;pointer-events:none}
.g1{width:820px;height:560px;left:-200px;top:-240px;background:radial-gradient(ellipse at center,rgba(201,169,97,.32),transparent 62%)}
.g2{width:760px;height:560px;right:-200px;top:-220px;background:radial-gradient(ellipse at center,rgba(19,178,74,.22),transparent 62%)}
.g3{width:900px;height:360px;right:-160px;bottom:-200px;background:radial-gradient(ellipse at center,rgba(231,213,178,.5),transparent 64%)}
.brand{position:relative;z-index:2;display:flex;align-items:center;gap:16px}
.bt{display:flex;flex-direction:column}
.bn{font-family:'Fraunces',serif;font-weight:600;font-size:35px;color:#1A1612;letter-spacing:-.02em;line-height:1}
.bs{font-weight:600;font-size:12.5px;letter-spacing:.2em;color:#8A8472;margin-top:6px}
.main{position:relative;z-index:2;margin-top:auto;margin-bottom:4px}
.eyebrow{display:flex;align-items:center;gap:11px;font-weight:600;font-size:18px;letter-spacing:.17em;color:#0E8A38}
.dot{width:9px;height:9px;border-radius:50%;background:#13B24A;box-shadow:0 0 0 5px rgba(19,178,74,.14)}
h1{font-family:'Fraunces',serif;font-weight:600;font-size:79px;line-height:1.06;letter-spacing:-.015em;color:#1A1612;margin:24px 0 0}
.hl{font-style:italic;font-weight:500;color:#0E8A38;background:linear-gradient(transparent 60%,rgba(63,209,116,.42) 60% 93%,transparent 93%);padding:0 .04em}
.trust{font-weight:500;font-size:20px;color:#5C5145;margin-top:30px;letter-spacing:.01em}
</style></head><body>
<div class="og">
  <div class="g g1"></div><div class="g g2"></div><div class="g g3"></div>
  <div class="brand">${mark}<div class="bt"><div class="bn">CrossCoders</div><div class="bs">KINGDOM&nbsp;COME&nbsp;FOUNDATION</div></div></div>
  <div class="main">
    <div class="eyebrow"><span class="dot"></span>A CHRISTIAN SOFTWARE NONPROFIT</div>
    <h1>Free, quality software,<br><span class="hl">given</span> to the church.</h1>
    <div class="trust">Free for churches&nbsp;&nbsp;·&nbsp;&nbsp;Built with Claude&nbsp;&nbsp;·&nbsp;&nbsp;Shipped in days, not months</div>
  </div>
</div>
</body></html>`;

writeFileSync('/tmp/og-card.html', html);
console.log('wrote /tmp/og-card.html —', urls.length, 'latin font files inlined');
