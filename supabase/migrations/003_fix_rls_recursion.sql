-- Fix RLS Recursion Issues
-- Run this if you already ran 002_row_level_security.sql and have recursion errors

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view organization profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can view students" ON students;
DROP POLICY IF EXISTS "Teachers can create students" ON students;
DROP POLICY IF EXISTS "Teachers can delete students" ON students;
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
DROP POLICY IF EXISTS "Admins can update organization" ON organizations;
DROP POLICY IF EXISTS "Users can view organization competencies" ON competency_templates;
DROP POLICY IF EXISTS "Admins can manage organization competencies" ON competency_templates;
DROP POLICY IF EXISTS "Users can view organization settings" ON organization_settings;
DROP POLICY IF EXISTS "Admins can update organization settings" ON organization_settings;

-- Create helper functions (bypass RLS to avoid recursion)
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

-- Recreate policies with fixed functions

-- Admins can view all profiles in their organization
CREATE POLICY "Admins can view organization profiles"
  ON profiles FOR SELECT
  USING (
    is_admin(auth.uid())
    AND get_user_organization_id(auth.uid()) IS NOT NULL
    AND get_user_organization_id(auth.uid()) = profiles.organization_id
  );

-- Teachers can view all students
CREATE POLICY "Teachers can view students"
  ON students FOR SELECT
  USING (is_teacher_or_admin(auth.uid()));

-- Teachers can create students
CREATE POLICY "Teachers can create students"
  ON students FOR INSERT
  WITH CHECK (is_teacher_or_admin(auth.uid()));

-- Teachers can delete students
CREATE POLICY "Teachers can delete students"
  ON students FOR DELETE
  USING (is_teacher_or_admin(auth.uid()));

-- Users can view organizations they belong to
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

-- Users can view competencies from their organization
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

-- Users can view their organization settings
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

