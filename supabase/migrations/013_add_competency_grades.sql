-- Add competency_grades JSONB column to meetings for end grade numeric scores (1-10)
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS competency_grades JSONB DEFAULT '{}';


