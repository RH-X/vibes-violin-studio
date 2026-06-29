-- Contact page Inquiry Engine submissions.
-- Mirrors beta_signups' double-opt-in shape so both inquiries share the same
-- src/lib/inquiry/* pipeline (submissions.ts, validate.ts, email.ts).

create table if not exists contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  interest text,
  token text,
  token_expires timestamptz,
  verified boolean not null default false,
  verified_at timestamptz,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists contact_inquiries_email_idx on contact_inquiries (email);
create index if not exists contact_inquiries_token_idx on contact_inquiries (token);
create index if not exists contact_inquiries_ip_created_idx on contact_inquiries (ip_address, created_at);

-- ── Row Level Security ──
-- The app's API routes (src/pages/api/inquiry/[slug]/*.ts) talk to Supabase using
-- the service_role key, which bypasses RLS entirely — these policies exist as
-- defense-in-depth in case the anon key is ever used client-side. With RLS enabled
-- and no SELECT/UPDATE/DELETE policy defined, those operations are denied by
-- default for anon/authenticated roles: public visitors cannot read, update,
-- delete, or enumerate inquiry records. Only INSERT is explicitly allowed, and the
-- WITH CHECK clause blocks an anon caller from self-marking a submission as
-- already verified (bypassing the double opt-in email step).

alter table contact_inquiries enable row level security;

drop policy if exists "anon can submit contact inquiries" on contact_inquiries;
create policy "anon can submit contact inquiries"
  on contact_inquiries
  for insert
  to anon
  with check (
    verified = false
    and verified_at is null
  );
