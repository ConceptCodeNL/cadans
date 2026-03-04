-- Add separate columns for reviewer's form data (independent from teacher's data)
ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS reviewer_overall_grade TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_competency_scores JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reviewer_competency_notes JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reviewer_general_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_meeting_date DATE,
  ADD COLUMN IF NOT EXISTS reviewer_status TEXT DEFAULT 'draft';
