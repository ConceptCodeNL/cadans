# Supabase Setup Guide

This guide will help you set up your Supabase project for CADANS.

## Prerequisites

- Supabase account (sign up at https://supabase.com)
- A new Supabase project created

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: CADANS (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (2-3 minutes)

## Step 2: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon public** key → Use as `VITE_SUPABASE_ANON_KEY`
3. Add these to your `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Run Database Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. Wait for success message
6. Repeat for `supabase/migrations/002_row_level_security.sql`

**Important**: Run migrations in order (001 first, then 002)

## Step 4: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following:

### Site URL
- Set to your development URL: `http://localhost:3000`
- For production, update to your Vercel URL

### Email Templates (Optional)
- Customize email templates if desired
- Default templates work fine for now

### Email Auth
- Ensure "Enable Email Signup" is ON
- Ensure "Confirm email" is ON (recommended for production)
- For development, you can turn off email confirmation temporarily

### Redirect URLs
Add these redirect URLs:
- `http://localhost:3000/**`
- `http://localhost:3000/auth/callback`
- Your production URL (when ready)

## Step 5: Verify Setup

1. Go to **Table Editor**
2. You should see these tables:
   - `organizations`
   - `profiles`
   - `students`
   - `competency_templates`
   - `grading_sessions`
   - `meetings`
   - `end_grades`
   - `invitations`
   - `organization_settings`

3. Check **competency_templates** table - it should have 5 default competencies

## Step 6: Test Authentication

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/register`
3. Create a test account
4. Check **Authentication** → **Users** in Supabase dashboard
5. You should see your new user
6. Check **profiles** table - a profile should be automatically created

## Step 7: Create Your First Organization (Optional)

If you want to test with an organization:

1. Go to **SQL Editor**
2. Run this query (replace with your user ID from auth.users):
   ```sql
   -- Get your user ID first
   SELECT id, email FROM auth.users;
   
   -- Then create an organization and link your profile
   INSERT INTO organizations (name) VALUES ('My Organization') RETURNING id;
   
   -- Update your profile (replace USER_ID and ORG_ID)
   UPDATE profiles 
   SET organization_id = 'ORG_ID_HERE', role = 'admin'
   WHERE id = 'USER_ID_HERE';
   ```

## Troubleshooting

### Migration Errors

**Error: "relation already exists"**
- Tables already exist, skip that migration or drop tables first

**Error: "permission denied"**
- Make sure you're running as the postgres user
- Check that RLS is enabled correctly

### Authentication Issues

**Can't sign up**
- Check that email signup is enabled in Auth settings
- Check redirect URLs are configured
- Check browser console for errors

**Profile not created**
- Check that the trigger function `handle_new_user()` exists
- Check Supabase logs for errors

### RLS Issues

**Can't access data**
- Verify RLS policies are created
- Check user role in profiles table
- Test with different user roles

## Next Steps

Once setup is complete:

1. ✅ Database schema created
2. ✅ RLS policies enabled
3. ✅ Default competencies inserted
4. ✅ Authentication configured
5. ✅ Test user created

You're ready to start building features!

## Production Checklist

Before deploying to production:

- [ ] Update Site URL in Auth settings
- [ ] Add production redirect URLs
- [ ] Enable email confirmation
- [ ] Set up custom email templates (optional)
- [ ] Configure email service (Brevo) for Edge Functions
- [ ] Set up database backups
- [ ] Review and test RLS policies
- [ ] Set up monitoring (optional)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)


