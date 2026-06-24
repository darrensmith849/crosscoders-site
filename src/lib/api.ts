// Base URL for the CrossCoders backend API (apply/contact/support/pledge + the
// Paystack giving endpoints + benefactor boards). Defaults to same-origin so
// builds keep working against the legacy Cloudflare Functions; the launch build
// sets PUBLIC_API_BASE=https://api.crosscoders.co.za to point at the Hetzner
// backend. Always call with a leading-slash path, e.g. api('/api/paystack/initialize').
export const API_BASE: string = import.meta.env.PUBLIC_API_BASE ?? '';

export const api = (path: string): string => API_BASE + path;
