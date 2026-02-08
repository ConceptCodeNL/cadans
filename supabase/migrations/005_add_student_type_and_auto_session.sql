-- Add student type + make grading_sessions dates nullable for auto-creation
-- Run this in Supabase SQL Editor

-- Step 1: Add type to students table
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'standard_intern'
  CHECK (type IN ('standard_intern', 'graduation'));

-- Step 2: Make grading_sessions dates nullable (for auto-created sessions)
ALTER TABLE grading_sessions
  ALTER COLUMN start_date DROP NOT NULL;

ALTER TABLE grading_sessions
  ALTER COLUMN end_date DROP NOT NULL;

-- Drop the date check constraint if it exists
ALTER TABLE grading_sessions
  DROP CONSTRAINT IF EXISTS grading_sessions_check;

-- Re-add it allowing nulls
ALTER TABLE grading_sessions
  ADD CONSTRAINT grading_sessions_check
  CHECK (start_date IS NULL OR end_date IS NULL OR end_date > start_date);

-- Step 3: Add type to grading_sessions too
ALTER TABLE grading_sessions
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'standard_intern'
  CHECK (type IN ('standard_intern', 'graduation'));

-- Step 4: Add index on student type
CREATE INDEX IF NOT EXISTS idx_students_type ON students(type);
CREATE INDEX IF NOT EXISTS idx_grading_sessions_type ON grading_sessions(type);

-- Step 5: Fix RLS for grading_sessions and meetings
-- (same pattern as students fix - allow authenticated users)

-- Grading sessions: allow authenticated insert
DROP POLICY IF EXISTS "Teachers can create sessions" ON grading_sessions;
CREATE POLICY "Authenticated users can create sessions"
  ON grading_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Meetings: allow authenticated insert
DROP POLICY IF EXISTS "Teachers and graders can manage meetings" ON meetings;

CREATE POLICY "Authenticated users can insert meetings"
  ON meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update meetings"
  ON meetings FOR UPDATE
  TO authenticated
  USING (true);

-- End grades: allow authenticated insert/update
DROP POLICY IF EXISTS "Teachers can update end grades" ON end_grades;
DROP POLICY IF EXISTS "Company graders can update advice" ON end_grades;

CREATE POLICY "Authenticated users can insert end grades"
  ON end_grades FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update end grades"
  ON end_grades FOR UPDATE
  TO authenticated
  USING (true);

