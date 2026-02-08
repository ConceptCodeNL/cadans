-- Fix profile trigger + backfill missing profiles
-- Run this in Supabase SQL Editor

-- Step 1: Backfill missing profiles for all existing users
INSERT INTO profiles (id, role)
SELECT id, 'teacher'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Fix the trigger function (ensure it bypasses RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'teacher')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Verify profiles exist
SELECT p.id, p.role, u.email 
FROM profiles p 
JOIN auth.users u ON u.id = p.id;

