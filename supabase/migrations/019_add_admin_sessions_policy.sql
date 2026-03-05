-- Allow admins to view all grading sessions within their organization

CREATE POLICY "Admins can view organization sessions"
  ON grading_sessions FOR SELECT
  USING (
    is_admin(auth.uid())
    AND get_user_organization_id(auth.uid()) IS NOT NULL
    AND get_user_organization_id(auth.uid()) = (
      SELECT p.organization_id FROM profiles p WHERE p.id = grading_sessions.teacher_id
    )
  );

-- Allow admins to update sessions within their organization
CREATE POLICY "Admins can update organization sessions"
  ON grading_sessions FOR UPDATE
  USING (
    is_admin(auth.uid())
    AND get_user_organization_id(auth.uid()) IS NOT NULL
    AND get_user_organization_id(auth.uid()) = (
      SELECT p.organization_id FROM profiles p WHERE p.id = grading_sessions.teacher_id
    )
  );
