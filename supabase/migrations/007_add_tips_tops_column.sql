-- Add tips_tops JSONB column to meetings table
-- Run this in Supabase SQL Editor

ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS tips_tops JSONB DEFAULT '[]';


