-- beta_signups predates the Inquiry Engine and the supabase/migrations history —
-- it was created directly in the dashboard, where tables default to RLS disabled
-- (wide open to the anon key). Locking it down to match contact_inquiries: public
-- may insert a new signup, but cannot read, update, delete, or enumerate rows, and
-- cannot self-mark a signup as verified on insert.

alter table beta_signups enable row level security;

drop policy if exists "anon can submit beta signups" on beta_signups;
create policy "anon can submit beta signups"
  on beta_signups
  for insert
  to anon
  with check (
    verified = false
    and verified_at is null
  );
