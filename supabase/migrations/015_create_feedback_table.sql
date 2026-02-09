create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  path text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.feedback enable row level security;

create policy "feedback_insert_own" on public.feedback
  for insert
  with check (auth.uid() is not null and user_id = auth.uid());

create policy "feedback_select_own" on public.feedback
  for select
  using (auth.uid() is not null and user_id = auth.uid());


