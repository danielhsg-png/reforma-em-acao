-- Migration 004: Create implementation_tasks table
-- Description: Stores weekly action plan tasks generated per company diagnosis

CREATE TABLE IF NOT EXISTS implementation_tasks (
  id          VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  VARCHAR NOT NULL,
  week        INTEGER NOT NULL,
  task_name   TEXT NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,

  CONSTRAINT fk_tasks_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON implementation_tasks (company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_week ON implementation_tasks (company_id, week);
