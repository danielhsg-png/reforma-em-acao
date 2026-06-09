-- 011_add_pagarme_subscription_fields.sql
-- Idempotente: ADD COLUMN IF NOT EXISTS, constraint via DO block, sem backfill

-- 1. Adicionar coluna pagarme_customer_id
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS pagarme_customer_id TEXT;

-- 2. Adicionar coluna pagarme_subscription_id
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS pagarme_subscription_id TEXT;

-- 3. Adicionar coluna subscription_status
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS subscription_status TEXT;

-- 4. Adicionar CHECK constraint em subscription_status de forma idempotente
--    (PostgreSQL não suporta ADD CONSTRAINT IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_subscription_status_check'
      AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_subscription_status_check
      CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'pending', 'unpaid'));
  END IF;
END $$;

-- Nota: nenhum UPDATE de backfill — os 17 usuários existentes ficam com NULL nas 3 colunas
