-- Merge students table into grading_sessions
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns to grading_sessions
ALTER TABLE grading_sessions
  ADD COLUMN IF NOT EXISTS code TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS own_reference TEXT DEFAULT '';

-- Step 2: Copy student codes into grading_sessions
UPDATE grading_sessions gs
SET code = gs.student_code
WHERE gs.code IS NULL;

-- Step 3: Make code NOT NULL and UNIQUE
ALTER TABLE grading_sessions
  ALTER COLUMN code SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_grading_sessions_code ON grading_sessions(code);

-- Step 4: Drop the foreign key to students
ALTER TABLE grading_sessions
  DROP CONSTRAINT IF EXISTS grading_sessions_student_code_fkey;

-- Step 5: Drop the student_code column (replaced by code)
ALTER TABLE grading_sessions
  DROP COLUMN IF EXISTS student_code;

-- Step 6: Drop old indexes
DROP INDEX IF EXISTS idx_grading_sessions_student_code;
DROP INDEX IF EXISTS idx_students_code;
DROP INDEX IF EXISTS idx_students_type;

-- Step 7: Drop students table
DROP TABLE IF EXISTS students CASCADE;

-- Step 8: Drop old students RLS policies (if they exist)
-- (table is dropped so policies are gone too)

-- Step 9: Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_grading_sessions_company ON grading_sessions(company);

-- Step 10: Update RLS for grading_sessions
-- Make sure authenticated users can SELECT, INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Teachers can view own sessions" ON grading_sessions;
DROP POLICY IF EXISTS "Company graders can view invited sessions" ON grading_sessions;
DROP POLICY IF EXISTS "Second reviewers can view invited sessions" ON grading_sessions;
DROP POLICY IF EXISTS "Authenticated users can create sessions" ON grading_sessions;
DROP POLICY IF EXISTS "Teachers can update own sessions" ON grading_sessions;

CREATE POLICY "Authenticated users can view sessions"
  ON grading_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create sessions"
  ON grading_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sessions"
  ON grading_sessions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete sessions"
  ON grading_sessions FOR DELETE
  TO authenticated
  USING (true);

