-- 010_add_user_plan_and_quota.sql
-- Idempotente: ADD COLUMN IF NOT EXISTS, constraint via DO block, backfills seguros

-- 1. Adicionar coluna plan
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'trial';

-- 2. Adicionar coluna diagnoses_used
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS diagnoses_used INTEGER NOT NULL DEFAULT 0;

-- 3. Adicionar CHECK constraint de forma idempotente (PostgreSQL não suporta ADD CONSTRAINT IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_plan_check'
      AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_plan_check
      CHECK (plan IN ('trial', 'monthly', 'annual'));
  END IF;
END $$;

-- 4. Backfill: promover usuários criados ANTES desta migração para 'annual'
--    (escopo por data — NÃO afeta cadastros futuros em trial)
UPDATE users
SET plan = 'annual'
WHERE plan = 'trial'
  AND created_at < '2026-06-02 18:00:00';

-- 5. Backfill: inicializar diagnoses_used com contagem real de companies
--    (seguro re-executar — apenas recalcula, não acumula)
UPDATE users
SET diagnoses_used = (
  SELECT COUNT(*) FROM companies
  WHERE companies.user_id = users.id
);
