// Cloudflare Pages Function — GET /api/paystack/benefactors?project=<slug|general>
// Public benefactor board for a project (or the general fund). Returns ONLY public
// fields — never email, never per-giver amounts. Powers the thank-you confirmation
// now; project pages in Phase B.

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: 'no_db' }, 500);

  const project = new URL(request.url).searchParams.get('project');
  const isGeneral = !project || project === 'general';
  const where = isGeneral ? 'project_slug IS NULL' : 'project_slug = ?';
  const binds = isGeneral ? [] : [project];

  const named = await env.DB.prepare(
    `SELECT display_name AS displayName, giver_type AS giverType
       FROM gifts
      WHERE status='success' AND anonymous=0 AND display_name IS NOT NULL AND ${where}
      ORDER BY datetime(created_at) DESC
      LIMIT 200`
  ).bind(...binds).all();

  const totals = await env.DB.prepare(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN anonymous=1 OR display_name IS NULL THEN 1 ELSE 0 END), 0) AS anon,
            COALESCE(SUM(amount_cents), 0) AS raisedCents
       FROM gifts WHERE status='success' AND ${where}`
  ).bind(...binds).first();

  return json({
    project: isGeneral ? 'general' : project,
    benefactors: (named && named.results) || [],
    total: (totals && totals.total) || 0,
    anonymous: (totals && totals.anon) || 0,
    raisedCents: (totals && totals.raisedCents) || 0,
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
