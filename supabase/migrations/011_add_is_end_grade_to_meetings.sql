-- Add is_end_grade flag to meetings table
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS is_end_grade BOOLEAN DEFAULT false;

-- Update existing sessions: no action needed as existing meetings don't have end grade meetings yet

