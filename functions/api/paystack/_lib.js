// Shared helpers for the Paystack giving functions. (Underscore prefix → not a route.)
// Keep VALID_PROJECTS in sync with `queue` in src/lib/content.ts (Phase C will generate it).
export const VALID_PROJECTS = new Set([
  'grace-chapel', 'hope-community', 'lighthouse-youth', 'new-life-mission', 'cornerstone-fellowship',
]);

export function isProject(slug) {
  return typeof slug === 'string' && VALID_PROJECTS.has(slug);
}
