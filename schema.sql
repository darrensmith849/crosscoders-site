-- CrossCoders — gifts / benefactors store (Phase A)
-- One row per gift. Created by the Paystack webhook (safe defaults) and/or the
-- post-payment allocation step (the giver's choices). Idempotent on `reference`.

CREATE TABLE IF NOT EXISTS gifts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  reference     TEXT UNIQUE NOT NULL,             -- Paystack reference (idempotency key)
  amount_cents  INTEGER NOT NULL,                 -- store cents; display ÷100
  currency      TEXT NOT NULL DEFAULT 'ZAR',
  email         TEXT,                             -- giver email — PRIVATE, never exposed publicly
  name          TEXT,                             -- name entered on /give
  source        TEXT NOT NULL DEFAULT 'paystack', -- 'paystack' | 'eft'
  status        TEXT NOT NULL DEFAULT 'success',
  project_slug  TEXT,                             -- NULL = general fund
  display_name  TEXT,                             -- what shows on the benefactor board
  giver_type    TEXT NOT NULL DEFAULT 'individual', -- 'individual' | 'business'
  anonymous     INTEGER NOT NULL DEFAULT 0,       -- 0 = named, 1 = anonymous
  email_updates INTEGER NOT NULL DEFAULT 0,       -- explicit opt-in to journey emails
  token_hash    TEXT,                             -- SHA-256 of the one-time alloc token
  allocated_at  TEXT,                             -- set when the giver completes the thank-you step
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gifts_project ON gifts(project_slug);
CREATE INDEX IF NOT EXISTS idx_gifts_status  ON gifts(status);
