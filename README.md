# The Richmond Veterinary Hospital

Booking and clinic-operations showcase template for **The Richmond Veterinary Hospital** — Animal Hospital & Wellness Center, Richmond, Greater London.
Built with TanStack Start (React), Tailwind, Zustand and Supabase/Postgres.

## Run

```bash
npm install
npm run dev      # http://localhost:8080
npm run build
```

## Portals

| Route | Who | What |
| --- | --- | --- |
| `/` | Public | Landing page, services, FAQ, map |
| `/app` | Pet owners | Book with pet details, appointments, payments |
| `/staff` | Clinic team | Queue, accept bookings, walk-ins, calendar |
| `/admin` | Management | Services, team, reports, gallery, settings |
| `/enter` | Everyone | Sign-in entry |

## Vet-specific features

- Pet name, type, breed and age on every booking
- WhatsApp booking message and Google Calendar / ICS
- Services: wellness, vaccines, dental, diagnostics, medicated grooming
- English / Swahili

## Deploy (Vercel)

Set these environment variables in the Vercel project:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Supabase) |
| `BETTER_AUTH_SECRET` | Long random string used to sign sessions |
| `BETTER_AUTH_URL` | Your public site URL, e.g. `https://your-domain.com` |
| `VITE_SITE_URL` | Same public URL; makes the share image and canonical link absolute |

Staff sign in with email and password. Existing staff will need to sign in once
again after this update (the session cookie was renamed).

## Brand assets

Transparent vector logos live in `public/brand/` (`vet-logo.svg` blue, `vet-logo-light.svg` white,
`vet-mark*.svg` emblem only). The app switches colourway automatically by theme.

## Notes

Database tables keep their original `salon_*` names (and `stylist_id` columns / `stylist` role value)
so existing Supabase data and RLS policies keep working. These are internal identifiers only; nothing
user-facing says "salon" any more. Rename them with a SQL migration when convenient.

Clinic WhatsApp: +255 713 325 000
