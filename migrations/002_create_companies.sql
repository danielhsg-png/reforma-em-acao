-- Migration 002: Create companies table
-- Description: Stores company profiles collected during the diagnostic journey

CREATE TABLE IF NOT EXISTS companies (
  id                        VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   VARCHAR NOT NULL DEFAULT '',
  company_name              TEXT NOT NULL,
  cnpj                      TEXT NOT NULL DEFAULT '',
  sector                    TEXT NOT NULL,
  regime                    TEXT NOT NULL,
  operations                TEXT NOT NULL DEFAULT 'b2c',
  purchase_profile          TEXT NOT NULL DEFAULT 'mixed_suppliers',
  sales_states              TEXT[] NOT NULL DEFAULT '{}',
  cost_structure            TEXT NOT NULL DEFAULT 'mercadorias',
  risk_score                INTEGER NOT NULL DEFAULT 0,
  monthly_revenue           TEXT NOT NULL DEFAULT '100k_500k',
  employee_count            TEXT NOT NULL DEFAULT '1_10',
  profit_margin             TEXT NOT NULL DEFAULT '10_20',
  erp_system                TEXT NOT NULL DEFAULT 'nenhum',
  nfe_emission              TEXT NOT NULL DEFAULT 'contador',
  invoice_volume            TEXT NOT NULL DEFAULT 'ate_100',
  supplier_count            TEXT NOT NULL DEFAULT 'ate_20',
  simples_supplier_percent  TEXT NOT NULL DEFAULT 'ate_30',
  has_long_term_contracts   TEXT NOT NULL DEFAULT 'nao',
  price_revision_clause     TEXT NOT NULL DEFAULT 'nao_sei',
  tax_responsible           TEXT NOT NULL DEFAULT 'contador_externo',
  split_payment_aware       TEXT NOT NULL DEFAULT 'nao',
  main_concern              TEXT NOT NULL DEFAULT 'custos',
  special_regimes           TEXT[] NOT NULL DEFAULT '{}',
  extended_data             JSONB DEFAULT '{}',
  created_at                TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_companies_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies (user_id);
