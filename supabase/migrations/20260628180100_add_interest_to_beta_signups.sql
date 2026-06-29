-- Practice Pals interest list gained a required "interest" textarea field when the
-- form was refactored onto the generic Inquiry Engine. This backfills the column
-- the engine now writes to.

alter table beta_signups add column if not exists interest text;
