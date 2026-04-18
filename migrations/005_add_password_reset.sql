-- Migration 005: Add password reset columns to users table
-- Description: Supports self-service password reset via email-delivered token

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS reset_token TEXT,
  ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users (reset_token);
