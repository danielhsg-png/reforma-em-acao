-- Migration 003: Create checklist_items table
-- Description: Stores compliance checklist items tied to each company diagnosis

CREATE TABLE IF NOT EXISTS checklist_items (
  id          VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  VARCHAR NOT NULL,
  question_id TEXT NOT NULL,
  question    TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'validating',

  CONSTRAINT fk_checklist_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_checklist_company_id ON checklist_items (company_id);
