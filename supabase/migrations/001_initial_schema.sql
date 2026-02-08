-- CADANS Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT,
  logo TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'company_grader', 'second_reviewer', 'admin')),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competency templates
CREATE TABLE IF NOT EXISTS competency_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_weight DECIMAL(3,1) DEFAULT 1.0,
  is_system_default BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grading sessions (= students, merged)
CREATE TABLE IF NOT EXISTS grading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE CHECK (char_length(code) = 6),
  type TEXT NOT NULL DEFAULT 'standard_intern' CHECK (type IN ('standard_intern', 'graduation')),
  company TEXT DEFAULT '',
  own_reference TEXT DEFAULT '',
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_grader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  second_reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  number_of_meetings INTEGER NOT NULL DEFAULT 3 CHECK (number_of_meetings > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  competencies JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (start_date IS NULL OR end_date IS NULL OR end_date > start_date)
);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grading_session_id UUID NOT NULL REFERENCES grading_sessions(id) ON DELETE CASCADE,
  meeting_number INTEGER NOT NULL,
  meeting_date DATE,
  overall_grade TEXT CHECK (overall_grade IN ('bad', 'go_but_needs_attention', 'all_good')),
  competency_scores JSONB DEFAULT '{}',
  competency_notes JSONB DEFAULT '{}',
  general_notes TEXT,
  tips_tops JSONB DEFAULT '[]',
  graded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(grading_session_id, meeting_number)
);

-- End grades
CREATE TABLE IF NOT EXISTS end_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grading_session_id UUID NOT NULL UNIQUE REFERENCES grading_sessions(id) ON DELETE CASCADE,
  company_grader_advice DECIMAL(3,1) CHECK (company_grader_advice >= 0 AND company_grader_advice <= 10),
  company_grader_notes TEXT,
  company_grader_submitted_at TIMESTAMPTZ,
  teacher_grade DECIMAL(3,1) NOT NULL CHECK (teacher_grade >= 0 AND teacher_grade <= 10),
  teacher_notes TEXT,
  teacher_submitted_at TIMESTAMPTZ NOT NULL,
  final_grade DECIMAL(3,1),
  competency_final_scores JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'partial', 'completed')),
  finalized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grading_session_id UUID REFERENCES grading_sessions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('company_grader', 'second_reviewer')),
  token TEXT NOT NULL UNIQUE,
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization settings
CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  use_system_competencies BOOLEAN DEFAULT TRUE,
  custom_competency_set_id UUID REFERENCES competency_templates(id) ON DELETE SET NULL,
  grade_scale TEXT DEFAULT 'numeric_0_10' CHECK (grade_scale IN ('numeric_0_10', 'letter', 'percentage')),
  competency_score_scale TEXT DEFAULT '1_5' CHECK (competency_score_scale IN ('1_5', '1_10')),
  meeting_grade_labels JSONB DEFAULT '{"bad": "Bad", "go_but_needs_attention": "Go but needs attention", "all_good": "All good"}',
  branding JSONB DEFAULT '{"primaryColor": "#86efac", "secondaryColor": "#6ee7b7"}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_grading_sessions_code ON grading_sessions(code);
CREATE INDEX IF NOT EXISTS idx_grading_sessions_teacher_id ON grading_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_grading_sessions_company_grader_id ON grading_sessions(company_grader_id);
CREATE INDEX IF NOT EXISTS idx_grading_sessions_second_reviewer_id ON grading_sessions(second_reviewer_id);
CREATE INDEX IF NOT EXISTS idx_grading_sessions_company ON grading_sessions(company);
CREATE INDEX IF NOT EXISTS idx_grading_sessions_type ON grading_sessions(type);
CREATE INDEX IF NOT EXISTS idx_meetings_grading_session_id ON meetings(grading_session_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email_status ON invitations(email, status);
CREATE INDEX IF NOT EXISTS idx_competency_templates_organization_id ON competency_templates(organization_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grading_sessions_updated_at BEFORE UPDATE ON grading_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_end_grades_updated_at BEFORE UPDATE ON end_grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'teacher')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default system competencies
INSERT INTO competency_templates (name, description, default_weight, is_system_default, "order")
VALUES
  ('Working according a plan', 'Ability to work according to a structured plan', 1.0, TRUE, 1),
  ('Problem solving and building software', 'Technical problem-solving and software development skills', 2.0, TRUE, 2),
  ('Research', 'Research and information gathering capabilities', 1.0, TRUE, 3),
  ('Collaboration and communication', 'Teamwork and communication skills', 1.0, TRUE, 4),
  ('Professional attitude', 'Professionalism and work ethic', 1.0, TRUE, 5)
ON CONFLICT DO NOTHING;
