-- Row Level Security (RLS) Policies
-- Run this after 001_initial_schema.sql

-- ============================================
-- HELPER FUNCTIONS (to avoid RLS recursion)
-- ============================================

-- Function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's organization_id (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_organization_id(user_id UUID)
RETURNS UUID AS $$
DECLARE
  org_id UUID;
BEGIN
  SELECT organization_id INTO org_id
  FROM profiles
  WHERE id = user_id;
  RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is teacher or admin (bypasses RLS)
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

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE competency_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE end_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but allow it)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles in their organization
-- Fixed: Use security definer function to avoid recursion
CREATE POLICY "Admins can view organization profiles"
  ON profiles FOR SELECT
  USING (
    is_admin(auth.uid())
    AND get_user_organization_id(auth.uid()) IS NOT NULL
    AND get_user_organization_id(auth.uid()) = profiles.organization_id
  );

-- ============================================
-- STUDENTS POLICIES
-- ============================================

-- Teachers can view all students
-- Fixed: Use security definer function to avoid recursion
CREATE POLICY "Teachers can view students"
  ON students FOR SELECT
  USING (is_teacher_or_admin(auth.uid()));

-- Teachers can create students
-- Fixed: Use security definer function to avoid recursion
CREATE POLICY "Teachers can create students"
  ON students FOR INSERT
  WITH CHECK (is_teacher_or_admin(auth.uid()));

-- Teachers can delete students
CREATE POLICY "Teachers can delete students"
  ON students FOR DELETE
  USING (is_teacher_or_admin(auth.uid()));

-- ============================================
-- GRADING SESSIONS POLICIES
-- ============================================

-- Teachers can view their own grading sessions
CREATE POLICY "Teachers can view own sessions"
  ON grading_sessions FOR SELECT
  USING (teacher_id = auth.uid());

-- Company graders can view sessions they're invited to
CREATE POLICY "Company graders can view invited sessions"
  ON grading_sessions FOR SELECT
  USING (company_grader_id = auth.uid());

-- Second reviewers can view sessions they're invited to
CREATE POLICY "Second reviewers can view invited sessions"
  ON grading_sessions FOR SELECT
  USING (second_reviewer_id = auth.uid());

-- Teachers can create grading sessions
CREATE POLICY "Teachers can create sessions"
  ON grading_sessions FOR INSERT
  WITH CHECK (teacher_id = auth.uid());

-- Teachers can update their own sessions
CREATE POLICY "Teachers can update own sessions"
  ON grading_sessions FOR UPDATE
  USING (teacher_id = auth.uid());

-- ============================================
-- MEETINGS POLICIES
-- ============================================

-- Users can view meetings for sessions they have access to
CREATE POLICY "Users can view accessible meetings"
  ON meetings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM grading_sessions gs
      WHERE gs.id = meetings.grading_session_id
      AND (
        gs.teacher_id = auth.uid()
        OR gs.company_grader_id = auth.uid()
        OR gs.second_reviewer_id = auth.uid()
      )
    )
  );

-- Teachers and company graders can create/update meetings
CREATE POLICY "Teachers and graders can manage meetings"
  ON meetings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM grading_sessions gs
      WHERE gs.id = meetings.grading_session_id
      AND (
        gs.teacher_id = auth.uid()
        OR gs.company_grader_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM grading_sessions gs
      WHERE gs.id = meetings.grading_session_id
      AND (
        gs.teacher_id = auth.uid()
        OR gs.company_grader_id = auth.uid()
      )
    )
  );

-- ============================================
-- END GRADES POLICIES
-- ============================================

-- Users can view end grades for sessions they have access to
CREATE POLICY "Users can view accessible end grades"
  ON end_grades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM grading_sessions gs
      WHERE gs.id = end_grades.grading_session_id
      AND (
        gs.teacher_id = auth.uid()
        OR gs.company_grader_id = auth.uid()
        OR gs.second_reviewer_id = auth.uid()
      )
    )
  );

-- Teachers can update end grades
CREATE POLICY "Teachers can update end grades"
  ON end_grades FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM grading_sessions gs
      WHERE gs.id = end_grades.grading_session_id
      AND gs.teacher_id = auth.uid()
    )
  );

-- Company graders can update their advice
CREATE POLICY "Company graders can update advice"
  ON end_grades FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM grading_sessions gs
      WHERE gs.id = end_grades.grading_session_id
      AND gs.company_grader_id = auth.uid()
    )
  );

-- ============================================
-- INVITATIONS POLICIES
-- ============================================

-- Teachers can view invitations for their sessions
CREATE POLICY "Teachers can view session invitations"
  ON invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM grading_sessions gs
      WHERE gs.id = invitations.grading_session_id
      AND gs.teacher_id = auth.uid()
    )
  );

-- Teachers can create invitations
CREATE POLICY "Teachers can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM grading_sessions gs
      WHERE gs.id = invitations.grading_session_id
      AND gs.teacher_id = auth.uid()
    )
  );

-- Anyone with the token can view their invitation
CREATE POLICY "Users can view own invitation by token"
  ON invitations FOR SELECT
  USING (true); -- Token will be validated in application logic

-- ============================================
-- ORGANIZATIONS POLICIES
-- ============================================

-- Users can view organizations they belong to
-- Fixed: Use security definer function to avoid recursion
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (
    get_user_organization_id(auth.uid()) = organizations.id
  );

-- Admins can update their organization
CREATE POLICY "Admins can update organization"
  ON organizations FOR UPDATE
  USING (
    is_admin(auth.uid())
    AND get_user_organization_id(auth.uid()) = organizations.id
  );

-- ============================================
-- COMPETENCY TEMPLATES POLICIES
-- ============================================

-- Everyone can view system default competencies
CREATE POLICY "Everyone can view system competencies"
  ON competency_templates FOR SELECT
  USING (is_system_default = TRUE);

-- Users can view competencies from their organization
-- Fixed: Use security definer function to avoid recursion
CREATE POLICY "Users can view organization competencies"
  ON competency_templates FOR SELECT
  USING (
    organization_id IS NULL
    OR get_user_organization_id(auth.uid()) = competency_templates.organization_id
  );

-- Admins can manage organization competencies
CREATE POLICY "Admins can manage organization competencies"
  ON competency_templates FOR ALL
  USING (
    is_admin(auth.uid())
    AND get_user_organization_id(auth.uid()) = competency_templates.organization_id
  );

-- ============================================
-- ORGANIZATION SETTINGS POLICIES
-- ============================================

-- Users can view their organization settings
-- Fixed: Use security definer function to avoid recursion
CREATE POLICY "Users can view organization settings"
  ON organization_settings FOR SELECT
  USING (
    get_user_organization_id(auth.uid()) = organization_settings.organization_id
  );

-- Admins can update organization settings
CREATE POLICY "Admins can update organization settings"
  ON organization_settings FOR UPDATE
  USING (
    is_admin(auth.uid())
    AND get_user_organization_id(auth.uid()) = organization_settings.organization_id
  );

