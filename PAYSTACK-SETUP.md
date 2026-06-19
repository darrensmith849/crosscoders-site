# Paystack giving — setup & go-live

A secure, server-side Paystack integration for the `/give` page. Your **secret key
never touches the browser or the repo** — it lives only as a Cloudflare Pages secret
that you set yourself. All card handling happens on Paystack's hosted checkout.

## What was built

| Piece | Path | Job |
|---|---|---|
| Initialize | `functions/api/paystack/initialize.js` | Starts a transaction server-side, returns the Paystack checkout URL |
| Verify | `functions/api/paystack/verify.js` | Confirms a transaction by reference (used by the thank-you page) |
| Webhook | `functions/api/paystack/webhook.js` | Receives Paystack events, signature-verified with your secret key |
| Give page | `src/pages/give.astro` → `/give` | Amount picker + name/email, redirects to secure checkout |
| Thank-you | `src/pages/give/callback.astro` → `/give/callback` | Verifies and shows the result after payment |
| Env template | `.env.example` | Where the keys go (real `.env` is gitignored) |

The giver flow: **/give → our `initialize` function → Paystack checkout → back to
/give/callback → our `verify` function shows the result.** Paystack also calls our
`webhook` independently as the source of truth.

## Go-live checklist (your steps)

**1. Rotate the secret key** (it was shown in a screenshot, so treat it as exposed)
- Paystack Dashboard → **Settings → API Keys & Webhooks → Generate new secret key**.
- Copy the **new** `sk_live_…`.

**2. Set the secret on Cloudflare** (never in a file)
```bash
# from the repo root
npx wrangler pages secret put PAYSTACK_SECRET_KEY --project-name crosscoders
# paste the NEW sk_live_… when prompted
```
To test first, use your `sk_test_…` instead — same command, test key.

**3. Point the webhook at this site** (replace the old turkeyvisa.co.za one)
- Paystack Dashboard → **Settings → API Keys & Webhooks → Live Webhook URL**:
  ```
  https://crosscoders.dev/api/paystack/webhook
  ```
  (use your live domain; on the Pages domain it's `https://crosscoders.pages.dev/api/paystack/webhook`)

**4. (Optional) Whitelist nothing extra / leave IP whitelist empty** unless you have a fixed egress IP — Cloudflare Functions don't use one, so leave it blank.

**5. Deploy**
```bash
npm run build && npx wrangler pages deploy dist --project-name crosscoders --branch main
```

**6. Link the button** — when you're ready for the public to use it, point the
"Fuel a build" CTA at the new page by changing `src/lib/content.ts`:
```js
fund: { label: 'Fuel a build', href: '/give' },   // was '/foundation'
```

**7. Reactivate the dormant account** — make one **real** transaction of your own
through `/give` (your own card, any amount ≥ R10). That completes a genuine charge
and reactivates the account. Verify it landed in Paystack → Transactions.

## Local testing
```bash
cp .env.example .env          # paste your sk_test_… into .env
npx wrangler pages dev dist   # serves the static site AND the functions together
```
`astro dev` alone will NOT run the `/api/paystack/*` functions — use `wrangler pages dev`.

## Notes
- Currency is **ZAR**; amounts are entered in Rand and converted to cents server-side.
- Min R10, sanity cap R1,000,000 — adjust in `initialize.js` if needed.
- The webhook only trusts requests whose `x-paystack-signature` matches an HMAC-SHA512
  of the body keyed with your secret key — so it can't be spoofed.
- To email the team on each gift, fill in the `charge.success` case in `webhook.js`
  (the `/api/pledge.js` function shows the Brevo pattern already in use).
