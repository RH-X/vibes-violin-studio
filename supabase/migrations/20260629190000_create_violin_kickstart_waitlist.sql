-- Violin Kickstart waitlist submissions (hidden prelaunch landing page).
-- Same shape and security model as contact_inquiries / beta_signups so the
-- generic Inquiry Engine pipeline (src/lib/inquiry/*) works unmodified.

create table if not exists violin_kickstart_waitlist (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  played_before text,
  has_violin_access text,
  six_month_goal text,
  biggest_blocker text,
  token text,
  token_expires timestamptz,
  verified boolean not null default false,
  verified_at timestamptz,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists violin_kickstart_waitlist_email_idx on violin_kickstart_waitlist (email);
create index if not exists violin_kickstart_waitlist_token_idx on violin_kickstart_waitlist (token);
create index if not exists violin_kickstart_waitlist_ip_created_idx on violin_kickstart_waitlist (ip_address, created_at);

-- ── Row Level Security ──
-- Same defense-in-depth model as contact_inquiries/beta_signups: the app's API
-- routes use the service_role key (bypasses RLS). With RLS enabled and no
-- SELECT/UPDATE/DELETE policy, anon/authenticated callers are denied those
-- operations by default — no reading, updating, deleting, or enumerating
-- waitlist entries. Only INSERT is allowed, and the WITH CHECK clause blocks
-- an anon caller from self-marking a submission as already verified.

alter table violin_kickstart_waitlist enable row level security;

drop policy if exists "anon can submit violin kickstart waitlist entries" on violin_kickstart_waitlist;
create policy "anon can submit violin kickstart waitlist entries"
  on violin_kickstart_waitlist
  for insert
  to anon
  with check (
    verified = false
    and verified_at is null
  );
