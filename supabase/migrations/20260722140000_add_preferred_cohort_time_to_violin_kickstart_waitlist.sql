-- Adds the founding-cohort scheduling-availability question to the Violin
-- Kickstart waitlist form. Nullable text column, same shape as the other
-- radio-backed fields on this table (played_before, has_violin_access) —
-- no RLS changes needed since the existing insert policy only checks
-- verified/verified_at, not individual field values.

alter table violin_kickstart_waitlist
  add column if not exists preferred_cohort_time text;
