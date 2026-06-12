-- 013_add_consent_fields.sql
-- Aceite de Termos/Política + opt-in de marketing.
-- Idempotente: ADD COLUMN IF NOT EXISTS. Sem backfill.
-- Legados (usuários existentes) ficam com terms_accepted_at/terms_version NULL
-- (aceite ainda não registrado — correto) e marketing_opt_in=false (padrão seguro).
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_version TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_opt_in_at TIMESTAMP;
