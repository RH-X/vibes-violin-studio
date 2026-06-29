# Inquiry Engine — Launch Readiness Checklist

Required before this goes live in production. Until these are done, Turnstile fails
closed (blocks all submissions) once keys are expected but missing, and studio
notification emails may silently fail to send.

- [ ] **Cloudflare Turnstile keys created and added to Vercel**
  - `PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`
- [ ] **Resend domain verification confirmed for `vibesviolin.studio`**, so studio
  notification emails can send reliably to `vibesviolinstudio@gmail.com`
