
# Ratha Yatra 2026 Integration Plan

## Overview
Add the Ratha Yatra 2026 landing page from the uploaded files, wire it into routing, create a dedicated database table, extend existing edge functions to support multi-event dispatch, and create Ratha Yatra-specific confirmation/reminder emails.

---

## 1. Copy assets into project

- Copy `RathaYatra.tsx` → `src/pages/RathaYatra.tsx`
- Copy `RathaYatra.css` → `src/pages/RathaYatra.css`
- Copy 25 WebP images → `public/images/ratha-yatra/`

---

## 2. Wire route in App.tsx

- Add lazy import: `const RathaYatra = lazy(() => import("@/pages/RathaYatra"))`
- Add route: `<Route path="/ratha-yatra-2026" element={<Suspense ...><RathaYatra /></Suspense>} />`
- No changes to `/` route (Narasimha stays as homepage)

---

## 3. OG/Twitter meta tags (react-helmet-async)

- Install `react-helmet-async`
- Wrap `<BrowserRouter>` with `<HelmetProvider>`
- Add `<Helmet>` in RathaYatra page with title "Ratha Yātrā 2026 — Sri Krishna Mandir Singapore", OG image `/images/ratha-yatra/hero.webp`, etc.
- Add `<Helmet>` in the existing Narasimha `LandingPage` to preserve its current meta
- Add hero image preload link in RathaYatra's Helmet

---

## 4. Database: new `ratha_yatra_registrations` table

Migration:
```sql
CREATE TABLE public.ratha_yatra_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  attendees integer NOT NULL DEFAULT 1,
  is_volunteer boolean NOT NULL DEFAULT false,
  confirmation_sent boolean NOT NULL DEFAULT false,
  reminder_sent boolean NOT NULL DEFAULT false
);

ALTER TABLE public.ratha_yatra_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for Ratha Yatra"
  ON public.ratha_yatra_registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Only admins can read Ratha Yatra registrations"
  ON public.ratha_yatra_registrations FOR SELECT
  TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role full access on ratha_yatra"
  ON public.ratha_yatra_registrations FOR ALL
  TO public USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
```

---

## 5. Extend `submit-registration` edge function

Currently hardcoded to `registrations` table and `send-nc-confirmation`. Change to:
- Accept optional `event_slug` field in request body
- Dispatch logic:
  - `"ratha_yatra_2026"` → insert into `ratha_yatra_registrations`, call `send-rathayatra-confirmation`
  - default (no slug or `undefined`) → existing behavior (`registrations` table, `send-nc-confirmation`)
- Same validation logic for both paths

---

## 6. Extend `check-duplicate` edge function

Currently uses a `table` param with map `{nc, slf, prasadam}`. The RathaYatra page sends `event_slug` instead of `table`. Update to:
- Accept `event_slug` as an alternative to `table`
- Add mapping: `"ratha_yatra_2026"` → `ratha_yatra_registrations`
- Backward compatible: existing `table` param still works

---

## 7. Extend `sync-to-wabo`

- Add `"ratha_yatra_2026"` to `ALLOWED_EVENT_SLUGS`
- This means a `ratha_yatra_2026: "yes"` custom field will be sent to Wabo
- **Pre-requisite (user action)**: Create `ratha_yatra_2026` custom field in Wabo workspace before deploying

---

## 8. Create `send-rathayatra-confirmation` edge function

Clone from `send-nc-confirmation` with Ratha Yatra-specific content:
- Subject: "You're in, {name} — Ratha Yātrā 2026 🪷"
- Event details: Sunday 5 July, 5:00–9:30 PM, Clementi Stadium
- Schedule items updated for Ratha Yatra programme
- Calendar link pointing to the correct date/venue
- Tracking pixel + click tracking using `ry-confirm-` prefix
- Enqueue via same `transactional_emails` queue
- Update `ratha_yatra_registrations.confirmation_sent`

---

## 9. Create `send-rathayatra-reminder` edge function

Clone from `send-nc-reminder` with Ratha Yatra content:
- Subject: "Tomorrow — Ratha Yātrā 2026"
- Same queue-based sending pattern
- Update `ratha_yatra_registrations.reminder_sent`

---

## 10. Update Admin dashboard

- Query `ratha_yatra_registrations` table
- Add a new "Ratha Yatra" tab alongside NC, WLF, Prasadam
- Show registrations list, CSV export with `ratha_yatra_` prefix
- Add engagement metrics row (open rate, calendar saves) scoped to `ry-*` email types

---

## 11. RathaYatra.tsx adjustments

Minor fixes needed for the uploaded component:
- The page sends `event_slug` to `check-duplicate` but the current function expects `table` — this will be fixed in step 6
- Brand token alignment: replace any raw hex colors with CSS variables where applicable
- Video paths will 404 (as noted) — no changes needed now

---

## Pre-deployment: Wabo custom field

Before the sync works, you'll need to create one custom field in Wabo:
- **`ratha_yatra_2026`** — boolean / "yes" tag

---

## Files touched

| File | Action |
|------|--------|
| `src/pages/RathaYatra.tsx` | New (from upload) |
| `src/pages/RathaYatra.css` | New (from upload) |
| `public/images/ratha-yatra/*` | New (25 WebP files) |
| `src/App.tsx` | Edit (add lazy import + route) |
| `supabase/functions/submit-registration/index.ts` | Edit (multi-event dispatch) |
| `supabase/functions/check-duplicate/index.ts` | Edit (add event_slug support) |
| `supabase/functions/sync-to-wabo/index.ts` | Edit (add slug to whitelist) |
| `supabase/functions/send-rathayatra-confirmation/index.ts` | New |
| `supabase/functions/send-rathayatra-reminder/index.ts` | New |
| `src/pages/Admin.tsx` | Edit (add Ratha Yatra tab) |
| DB migration | New table `ratha_yatra_registrations` |
