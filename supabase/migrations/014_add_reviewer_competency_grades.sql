-- Add separate column for reviewer's competency grades (reference for teacher)
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS reviewer_competency_grades JSONB DEFAULT '{}';

