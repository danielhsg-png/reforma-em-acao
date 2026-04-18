-- Migration 007: email_logs
-- Description: Records every outbound email attempt (sent or failed) so the
-- super-admin panel can audit password resets, welcome onboarding, etc.

CREATE TABLE IF NOT EXISTS email_logs (
  id         VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient  TEXT NOT NULL,
  subject    TEXT NOT NULL,
  kind       TEXT NOT NULL,
  status     TEXT NOT NULL,
  error      TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_kind ON email_logs (kind);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs (status);
