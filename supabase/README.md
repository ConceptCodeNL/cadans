# Supabase Setup

This directory contains SQL migrations and setup instructions for the CADANS Supabase database.

## Files

- `migrations/001_initial_schema.sql` - Creates all database tables, indexes, and triggers
- `migrations/002_row_level_security.sql` - Sets up RLS policies for data security
- `SETUP.md` - Step-by-step setup guide

## Quick Start

1. Create a Supabase project at https://supabase.com
2. Get your credentials (URL and anon key) and add to `.env`
3. Run migrations in order:
   - First: `001_initial_schema.sql`
   - Then: `002_row_level_security.sql`
4. Configure authentication settings
5. Test by creating a user account

See `SETUP.md` for detailed instructions.


