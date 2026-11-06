-- January 2027 campaign: which offer someone wants, and when they agreed to
-- Kickstart emails (empty means no recorded consent). Additive and nullable, so
-- existing rows are unchanged. No RLS changes: the insert policy only checks
-- verified/verified_at. Apply this BEFORE deploying the campaign code, because
-- the form writes to both columns.

alter table violin_kickstart_waitlist
  add column if not exists program_interest text,
  add column if not exists email_consent_at timestamptz;
