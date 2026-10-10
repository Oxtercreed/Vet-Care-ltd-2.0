# Vet Care LTD

Booking and clinic-operations app for **Vet Care LTD** — Migombani Street, Mikocheni, Dar es Salaam.
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

## Brand assets

Transparent vector logos live in `public/brand/` (`vet-logo.svg` blue, `vet-logo-light.svg` white,
`vet-mark*.svg` emblem only). The app switches colourway automatically by theme.

## Notes

Database tables keep their original `salon_*` names (and `stylist_id` columns / `stylist` role value)
so existing Supabase data and RLS policies keep working. These are internal identifiers only; nothing
user-facing says "salon" any more. Rename them with a SQL migration when convenient.

Clinic WhatsApp: +255 713 325 000
