-- Add read-only viewer access code to sessions and viewer token to meetings

-- Step 1: Add viewer access code columns to grading_sessions
ALTER TABLE grading_sessions
  ADD COLUMN IF NOT EXISTS viewer_access_code TEXT,
  ADD COLUMN IF NOT EXISTS viewer_code_attempts INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS viewer_code_locked BOOLEAN DEFAULT FALSE;

-- Step 2: Add viewer token to meetings
ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS viewer_token UUID DEFAULT uuid_generate_v4();

-- Step 3: Make token unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_meetings_viewer_token ON meetings(viewer_token);

-- Step 4: Backfill existing meetings with tokens
UPDATE meetings SET viewer_token = uuid_generate_v4() WHERE viewer_token IS NULL;
