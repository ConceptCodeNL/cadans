-- Add student-specific form fields so student self-reflection never overwrites teacher data
ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS student_overall_grade TEXT,
  ADD COLUMN IF NOT EXISTS student_competency_scores JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS student_competency_notes JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS student_general_notes TEXT,
  ADD COLUMN IF NOT EXISTS student_meeting_date DATE,
  ADD COLUMN IF NOT EXISTS student_status TEXT DEFAULT 'draft';
