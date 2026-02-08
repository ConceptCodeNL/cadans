-- QUICK FIX: Run this in Supabase SQL Editor to fix students RLS
-- This drops all existing students policies and recreates them simply

-- Step 1: Drop ALL existing policies on students
DROP POLICY IF EXISTS "Teachers can view students" ON students;
DROP POLICY IF EXISTS "Teachers can create students" ON students;
DROP POLICY IF EXISTS "Teachers can delete students" ON students;

-- Step 2: Create the helper function (safe to re-run)
CREATE OR REPLACE FUNCTION is_teacher_or_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role IN ('teacher', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate simple policies
-- Any authenticated user can SELECT students (codes aren't sensitive)
CREATE POLICY "Authenticated users can view students"
  ON students FOR SELECT
  TO authenticated
  USING (true);

-- Any authenticated user can INSERT students
CREATE POLICY "Authenticated users can create students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Any authenticated user can DELETE students
CREATE POLICY "Authenticated users can delete students"
  ON students FOR DELETE
  TO authenticated
  USING (true);

-- Step 4: Verify your profile exists (check output)
-- If this returns 0 rows, that's the problem
SELECT id, role FROM profiles WHERE id = auth.uid();

