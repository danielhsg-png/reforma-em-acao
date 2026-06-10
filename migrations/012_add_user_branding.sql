-- 012_add_user_branding.sql
-- Idempotente: ADD COLUMN IF NOT EXISTS, sem CHECK constraints, sem backfill

-- 1. Nome do escritório/profissional
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS brand_name TEXT;

-- 2. Telefone de contato
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS brand_phone TEXT;

-- 3. E-mail de contato
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS brand_email TEXT;

-- 4. Site/URL
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS brand_website TEXT;

-- 5. Registro profissional (CRC/OAB)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS brand_registration TEXT;

-- 6. Logo em Base64 (data URL — carregada sob demanda via GET /api/user/branding/logo)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS brand_logo TEXT;

-- Nota: sem backfill — todos os usuários existentes ficam com NULL nas 6 colunas
