-- Migration 006: Add role column to users
-- Description: Distinguishes regular users from super admins who can see
-- the admin panel (list all users, view all generated diagnoses).

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
