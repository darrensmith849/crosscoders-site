// Cloudflare Pages Function — GET /api/paystack/summary
// One call that powers the thank-you carousel: per-project funding totals + a
// preview of named benefactors. Public fields only — never email, never amounts
// per giver. Projects with no gifts simply don't appear (the card shows "be the
// first").

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'no_db' }, 500);

  const totals = await env.DB.prepare(
    `SELECT COALESCE(project_slug, 'general') AS slug,
            COUNT(*) AS total,
            COALESCE(SUM(amount_cents), 0) AS raisedCents,
            COALESCE(SUM(CASE WHEN anonymous=1 OR display_name IS NULL THEN 1 ELSE 0 END), 0) AS anon
       FROM gifts WHERE status='success'
      GROUP BY COALESCE(project_slug, 'general')`
  ).all();

  const named = await env.DB.prepare(
    `SELECT COALESCE(project_slug, 'general') AS slug, display_name AS displayName, giver_type AS giverType
       FROM gifts
      WHERE status='success' AND anonymous=0 AND display_name IS NOT NULL
      ORDER BY datetime(created_at) DESC`
  ).all();

  const projects = {};
  for (const r of (totals.results || [])) {
    projects[r.slug] = { raisedCents: r.raisedCents, total: r.total, anonymous: r.anon, benefactors: [] };
  }
  for (const b of (named.results || [])) {
    const p = projects[b.slug] || (projects[b.slug] = { raisedCents: 0, total: 0, anonymous: 0, benefactors: [] });
    if (p.benefactors.length < 6) p.benefactors.push({ displayName: b.displayName, giverType: b.giverType });
  }

  return json({ projects });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
