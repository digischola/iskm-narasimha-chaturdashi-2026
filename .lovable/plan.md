## Weekend Love Feast — full rename + two-day model

Scope: SLF page, related edge functions, DB table, and Wabo keys. No changes to Prasadam or NC.

### What you'll need to do in Wabo (before I deploy)

In your Wabo workspace, create three new custom-field keys:
- **`weekend_love_feast`** — boolean / "yes" tag (replaces `sunday_love_feast`)
- **`wlf_attendance_date`** — date field (replaces `slf_attendance_date`)
- **`wlf_attendance_day`** — text field, value will be `"Saturday"` or `"Sunday"`

No backfill of existing Wabo contacts needed — historic SLF data is not migrated. Tell me when these three keys exist in Wabo and I'll deploy the updated sync function.

### 1. Routing & URL

- New canonical route: `/weekend-love-feast`
- Old route `/sunday-love-feast` → React redirect to `/weekend-love-feast` (preserves query strings). Existing WhatsApp/print links keep working.
- Page component renamed `SundayLoveFeast.tsx` → `WeekendLoveFeast.tsx` (and `.css` likewise)
- Image folder renamed `public/images/sunday-love-feast/` → `public/images/weekend-love-feast/` and all references updated

### 2. Two-day model (Sat + Sun)

- New helper `getNextEligibleDay()` returns whichever comes first: upcoming Saturday 5 PM SGT or Sunday 5 PM SGT (with same "if today is the day, before 5 PM SGT counts" logic).
- Calendar option builder extended: include both Saturdays AND Sundays in the next ~31-day window.
- Calendar grid: Saturday cells get **pink** accent (`#f8a4c0`); Sunday cells get **gold** (existing). Both selectable; disabled days unchanged. Day-of-week header colors S(at) pink and S(un) gold.
- Validator (`validateAttendanceDate`) accepts both Saturday (`getUTCDay()===6`) and Sunday (`===0`).
- Selected-date label shows e.g. "Saturday, 2 May 2026" or "Sunday, 3 May 2026".

### 3. Countdown timer

Targets the next eligible day (Sat or Sun, whichever sooner) instead of next Sunday only.

### 4. Copy rewrites (page)

| Location | Old | New |
|---|---|---|
| `<title>` / og:title / twitter:title | "Srikrishnamandir - Events Page" | "Weekend Love Feast — ISKM Singapore" |
| meta description | "Sunday Love Feast every week..." | "Weekend Love Feast — every Saturday & Sunday at ISKM Singapore. Free Bhajan, Bhagavad Gītā class, Kīrtana & Prasādam feast." |
| Ribbon | "Every Sunday" | "Every Saturday & Sunday" |
| Hero h1 | "Sunday Love Feast / Every Week" | "Weekend Love Feast / Every Saturday & Sunday" |
| Hero detail chip | "Every Sunday" | "Every Saturday & Sunday" |
| Hero CTA | "Register This Sunday" | "Register This Weekend" |
| Hero video overlay | "250+ devotees gather every Sunday" | "250+ devotees gather every weekend" |
| Reg section h2 | "Reserve Your Seat This Sunday" | "Reserve Your Seat This Weekend" |
| Calendar field placeholder | "Select a Sunday" | "Select Saturday or Sunday" |
| Validation message | "choose which Sunday" | "choose which day you'll attend" |
| Social proof footer | "registered for this Sunday" | "registered for this weekend" |
| Schedule h2 sub | "Every Sunday, experience..." | "Every Saturday & Sunday, experience..." |
| Testimonials section | "More Than a Sunday Gathering" / "make Sunday Love Feast" | "More Than a Weekend Gathering" / "make Weekend Love Feast" |
| Testimonial quotes | "every Sunday" / "single Sunday" / "one Sunday" | rewritten to "every weekend" / "single week" / "one weekend", same warm voice |
| Sponsor h2 | "Sponsor the Sunday Love Feast" | "Sponsor the Weekend Love Feast" |
| Sponsor price line | "$501 per Sunday feast sponsorship" | "$501 per feast sponsorship" |
| Sponsor WhatsApp text | "sponsoring a Sunday Love Feast" | "sponsoring a Weekend Love Feast" |
| Gallery badge / sub | "Past Sundays" / "Sunday gatherings" | "Past Weekends" / "weekend gatherings" |
| FAQs | every "Sunday Love Feast" / "Sunday-only" mention | rewritten for "Weekend Love Feast" + "either Saturday or Sunday" |
| Location card | "Every Sunday" | "Every Saturday & Sunday" |
| Final CTA h2 | "See You This Sunday" | "See You This Weekend" |
| Final CTA next-date | next Sunday | next eligible day (Sat or Sun) |
| Mobile sticky CTA | "This Sunday" | "This Weekend" |
| Image alt text | every "Sunday Love Feast" mention | rewritten to "Weekend Love Feast" |

### 5. Share buttons (WhatsApp / Facebook / Telegram)

All point to `https://events.srikrishnamandir.org/weekend-love-feast`. Share text: "Join us for Weekend Love Feast at ISKM Singapore — every Saturday & Sunday 5–7:30 PM. Free Prasadam, Kirtan & Bhagavad Gita class."

### 6. Confirmation email (`send-slf-confirmation` → renamed `send-wlf-confirmation`)

- All "Sunday Love Feast" → "Weekend Love Feast" (subject, hero card, body, plain text, preheader, footer link)
- "Your Sunday" hero label → "Your Day"
- Email shows the specific day from `event_date_iso` — already day-aware via `formatDatePretty` (works for Sat and Sun)
- Calendar URL text "Sunday Love Feast" → "Weekend Love Feast"
- Footer link `/sunday-love-feast` → `/weekend-love-feast`
- Idempotency key prefix `slf-confirm-` → `wlf-confirm-`

### 7. Backend rename (DB + edge functions + Wabo)

**Migration (schema only):**
```sql
ALTER TABLE public.slf_registrations RENAME TO weekend_love_feast_registrations;
```
RLS policies auto-follow the rename. No data migration; existing Sunday rows preserved as-is.

**Edge functions renamed:**
- `submit-slf-registration` → `submit-wlf-registration`
  - Validator updated for Sat OR Sun
  - Inserts to `weekend_love_feast_registrations`
  - Calls `send-wlf-confirmation`
  - Wabo payload uses new keys including `wlf_attendance_day` (computed `"Saturday"` or `"Sunday"` from the chosen ISO date in SGT)
- `send-slf-confirmation` → `send-wlf-confirmation`
- Old function directories deleted via `supabase--delete_edge_functions`

**Wabo whitelist (`sync-to-wabo/index.ts`):**
- `ALLOWED_EVENT_SLUGS`: replace `"sunday_love_feast"` with `"weekend_love_feast"` (keep `nrsimhachaturdasi2026`, `prasadam_sponsor`)
- `ALLOWED_EXTRA_KEYS`: drop `"slf_attendance_date"`, add `"wlf_attendance_date"` and `"wlf_attendance_day"`
- Submit function passes:
  ```ts
  event_slug: "weekend_love_feast",
  source: "Weekend Love Feast - Landing Page",
  extras: {
    wlf_attendance_date: "2026-05-02",
    wlf_attendance_day: "Saturday",
  }
  ```

### 8. Admin dashboard (`Admin.tsx`)

- Query target `slf_registrations` → `weekend_love_feast_registrations`
- CSV export prefix `slf_registrations` → `weekend_love_feast`
- Tab label "Sunday Love Feast" → "Weekend Love Feast"
- Heading "Sunday Love Feast Registrations" → "Weekend Love Feast Registrations"
- Internal `eventTab === "slf"` keys kept (purely internal, no UI impact)

### Files touched

- `src/pages/SundayLoveFeast.tsx` → renamed `WeekendLoveFeast.tsx` (rewritten for two-day model + new copy)
- `src/pages/SundayLoveFeast.css` → renamed `WeekendLoveFeast.css` (Sat pink accent added)
- `src/App.tsx` (lazy import, route, redirect for old path)
- `index.html` (title + meta + og + twitter)
- `src/pages/Admin.tsx` (table name, label, CSV prefix)
- `src/integrations/supabase/types.ts` — auto-updated by migration; not hand-edited
- `supabase/functions/submit-slf-registration/` → renamed `submit-wlf-registration/`
- `supabase/functions/send-slf-confirmation/` → renamed `send-wlf-confirmation/`
- `supabase/functions/sync-to-wabo/index.ts` (whitelist update)
- `public/images/sunday-love-feast/` → renamed `weekend-love-feast/` (all references updated)
- New SQL migration: rename table

### Test checklist (after deploy)

1. Visit `/sunday-love-feast` → instantly redirects to `/weekend-love-feast`
2. Browser tab title says "Weekend Love Feast — ISKM Singapore"
3. Hero shows "Every Saturday & Sunday"; countdown counts to whichever of Sat/Sun comes first
4. Open the date picker → both Saturdays (pink) and Sundays (gold) selectable in the next month
5. Pick a Saturday, register → success badge shows the chosen Saturday; confirmation email subject + hero card both show that Saturday; "Add to Calendar" prefills that Saturday's event
6. Pick a Sunday in a different submission → confirmation flow shows that Sunday
7. Share buttons open WhatsApp/Telegram/Facebook with text mentioning "Weekend Love Feast" and link `/weekend-love-feast`
8. Sponsor section reads "$501 per feast sponsorship"
9. In Wabo: new contact appears with `weekend_love_feast=yes`, `wlf_attendance_date` set to the chosen ISO date, and `wlf_attendance_day` = `"Saturday"` or `"Sunday"` matching the pick
10. Admin dashboard "Weekend Love Feast" tab shows registrations from the renamed table