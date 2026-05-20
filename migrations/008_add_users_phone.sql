-- Migration 008: Add phone column to users
-- Description: Allows the Admin Panel to store and edit a contact phone for each user.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone TEXT;
