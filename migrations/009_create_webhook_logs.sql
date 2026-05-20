-- Migration 009: webhook_logs
-- Description: Records every inbound webhook (Pagar.me, etc.) — full payload + headers + status —
-- so we can audit and debug integrations from the super-admin panel.

CREATE TABLE IF NOT EXISTS webhook_logs (
  id              VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  source          TEXT NOT NULL,
  event_type      TEXT,
  status          TEXT NOT NULL,
  http_status     INTEGER NOT NULL,
  ip              TEXT,
  auth_ok         BOOLEAN NOT NULL DEFAULT FALSE,
  message         TEXT,
  external_id     TEXT,
  customer_email  TEXT,
  headers         JSONB DEFAULT '{}'::jsonb,
  payload         JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_source ON webhook_logs (source);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs (status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_external_id ON webhook_logs (external_id);
