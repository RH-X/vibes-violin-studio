# Restoring the previous Violin Kickstart page

The page as it stood before the January 2027 campaign is kept in Git. It isn't a live route, so there's no duplicate content for search engines.

- **Tag:** `kickstart-page-pre-jan2027` (local until it's pushed)
- **Commit:** `1da8cd5`, which is on `main` and on GitHub, so it stays available even if the tag is never pushed

## Restore the page

```bash
git checkout 1da8cd5 -- src/pages/violin-kickstart.astro src/lib/inquiries/violin-kickstart.ts src/components/KickstartAnnouncementBanner.astro
```

Then run `npm run build` and review the page. The shared form changes (checkbox fields and so on) are opt-in and can stay. So can the `program_interest` and `email_consent_at` columns, which are nullable and go unused by the old form.

## Copy retired from the page

Kept here so nothing has to be rebuilt from memory. The full text is in the commit above.

**Held back until the owner confirms they apply to January:**
- Weekly personalized feedback
- Direct access to Rae
- Early access to Practice Pals, including the "Help shape something new" section

**Replaced by the January offers:**
- "Four live group sessions", once a week for four weeks
- "One private 30-minute lesson"
- The "next cohort is being planned" section, with its format, includes, group size and enrollment list

**Form questions removed:** whether they've played before, violin access, preferred cohort time, six-month goal, and biggest blocker. Their database columns and existing answers are unchanged.
