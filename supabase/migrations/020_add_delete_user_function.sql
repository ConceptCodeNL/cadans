-- Allow authenticated users to delete their own account
-- Deleting from auth.users cascades to:
--   profiles → grading_sessions → meetings, end_grades, invitations

CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;
