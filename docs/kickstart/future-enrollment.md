# Future enrollment for the January Kickstart offers

Nothing here is built yet. There's no Stripe code, product or payment link, and no price is published.

## Product identifiers

Defined in `src/lib/kickstart.ts`.

| Offer | Product ID | Waitlist value (`program_interest`) |
|---|---|---|
| Violin Kickstart | `kickstart_weekly` | `weekly` |
| Kickstart Intensive | `kickstart_intensive` | `intensive` |
| Undecided | none | `unsure` |

## Simplest path

Product selection, then approved price and enrollment details, then Stripe-hosted checkout, then verified payment, then confirmation and onboarding.

1. Approve prices and the final deliverables for each offer.
2. Create one Stripe product and price per offer, tested in Stripe's test mode first.
3. Start with a Stripe Payment Link per offer, added as a `checkoutUrl` on each entry in `src/lib/kickstart.ts`. This needs no new server code and no card fields on the site.
4. Treat a seat as booked only after Stripe confirms payment. A waitlist row is never a booking.
5. Add a Checkout Session and webhook only if seats need to be capped automatically or payments matched to waitlist rows.

Contact waitlist entries only if they have a value in `email_consent_at`. Earlier signups have none, so follow up with them personally.
