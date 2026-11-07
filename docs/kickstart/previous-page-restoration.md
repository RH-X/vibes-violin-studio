# Restoring the previous Violin Kickstart page

The page and waitlist form as they stood before the January 2027 campaign are saved here. None of this is a live route, so there's no duplicate content for search engines.

## Where everything is

| What | Where |
|---|---|
| Old page, form settings and banner | `docs/kickstart/archive/`, which isn't part of the website build |
| Full-page screenshots, desktop and phone | `docs/kickstart/archive/live-page-desktop.png` and `live-page-phone.png` |
| Git commit | `1da8cd5`, on `main` and on GitHub |
| Git tag | `kickstart-page-pre-jan2027` |
| Frozen live copy | `vibesviolinstudio-juat7xykh-raes-projects-333d0fbe.vercel.app`, after signing in to Vercel. Its form can't submit, because Turnstile rejects that address. |
| Old form answers | The same columns in `violin_kickstart_waitlist`, which are unchanged |

## Restore the page and form

On a new branch:

```bash
git checkout 1da8cd5 -- src/pages/violin-kickstart.astro src/lib/inquiries/violin-kickstart.ts src/components/KickstartAnnouncementBanner.astro
```

Then run `npm run build`, review the page, and release as usual. This was rehearsed on 2026-11-07: the build passed, the old page and all five old questions appeared, and a test submission against fake services saved every answer.

No database change is needed. `program_interest` and `email_consent_at` stay in the table and are left empty by the old form. The shared form changes (checkbox fields and so on) are opt-in and can stay.

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
