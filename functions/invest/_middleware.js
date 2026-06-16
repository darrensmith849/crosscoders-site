// The investor preview moved to /fund. This dynamic route supersedes any stale
// edge-cached /invest asset and redirects to the gated /fund page. no-store so it
// is never cached itself. Safe to delete once the old /invest cache has expired.
export async function onRequest() {
  return new Response(null, {
    status: 301,
    headers: { Location: '/fund/', 'Cache-Control': 'no-store' },
  });
}
