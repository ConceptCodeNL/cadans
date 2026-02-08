-- Add access code system for student and second reviewer
-- Each session gets access codes, each meeting gets unique tokens

-- Step 1: Add access code columns to grading_sessions
ALTER TABLE grading_sessions
  ADD COLUMN IF NOT EXISTS student_access_code TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_access_code TEXT,
  ADD COLUMN IF NOT EXISTS student_code_attempts INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reviewer_code_attempts INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS student_code_locked BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reviewer_code_locked BOOLEAN DEFAULT FALSE;

-- Step 2: Add unique tokens to meetings for student and reviewer access
ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS student_token UUID DEFAULT uuid_generate_v4(),
  ADD COLUMN IF NOT EXISTS reviewer_token UUID DEFAULT uuid_generate_v4();

-- Step 3: Make tokens unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_meetings_student_token ON meetings(student_token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_meetings_reviewer_token ON meetings(reviewer_token);

-- Step 4: Backfill existing meetings with tokens
UPDATE meetings SET student_token = uuid_generate_v4() WHERE student_token IS NULL;
UPDATE meetings SET reviewer_token = uuid_generate_v4() WHERE reviewer_token IS NULL;

-- Step 5: Add RLS policies for anonymous access (public meeting links)

-- Allow anonymous users to read meetings by token
CREATE POLICY "Public can read meetings by token"
  ON meetings FOR SELECT
  TO anon
  USING (student_token IS NOT NULL OR reviewer_token IS NOT NULL);

-- Allow anonymous users to update meetings (for grading via public link)
CREATE POLICY "Public can update meetings by token"
  ON meetings FOR UPDATE
  TO anon
  USING (student_token IS NOT NULL OR reviewer_token IS NOT NULL)
  WITH CHECK (student_token IS NOT NULL OR reviewer_token IS NOT NULL);

-- Allow anonymous users to read grading_sessions for code verification
CREATE POLICY "Public can read sessions for code verification"
  ON grading_sessions FOR SELECT
  TO anon
  USING (TRUE);

-- Allow anonymous to update attempt counts on sessions
CREATE POLICY "Public can update session code attempts"
  ON grading_sessions FOR UPDATE
  TO anon
  USING (TRUE)
  WITH CHECK (TRUE);

