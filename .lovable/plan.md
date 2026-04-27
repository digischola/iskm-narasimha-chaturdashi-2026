## Sunday Love Feast — fixes

Scope: SLF page + SLF edge functions only. No changes to Prasadam, NC, or admin.

### 1. Date showing one day earlier (Sat instead of Sun)

**Root cause:** Several places format an SGT-anchored ISO date (`new Date("2026-05-10T00:00:00+08:00")`) using `toLocaleDateString("en-SG", {...})` *without* passing `timeZone: "Asia/Singapore"`. The `Date` object is the UTC instant `2026-05-09T16:00:00Z`. When formatted in the user's browser timezone (e.g. India UTC+5:30, Europe, Americas) or the edge function server timezone (UTC), it renders as **Saturday 9 May**.

**Fix — add `timeZone: "Asia/Singapore"` everywhere a Sunday is printed:**

- `src/pages/SundayLoveFeast.tsx`
  - `formatNextSunday()` (line 30) — used in the "Next Date" footer card.
  - The success badge "We look forward to seeing you on …" (line 653) — currently the visible bug in your screenshot.
- `supabase/functions/send-slf-confirmation/index.ts`
  - `formatDatePretty()` (line 237) — used in the email subject body, plain-text version, and the dark "Your Sunday" hero card.

### 2. Email "Add to Calendar" not working

The Google Calendar URL in the email uses `https://www.google.com/calendar/render` and the click-tracker regex matches `calendar.google.com/...`, so the calendar link is *not* tracked but rendered as-is. The `www.google.com/calendar/render` host is the legacy form and is unreliable on mobile (often opens a Google search rather than the calendar prefill). 

**Fix:** switch `buildCalendarUrl` in `supabase/functions/send-slf-confirmation/index.ts` (and the matching `buildSlfCalendarUrl` on the success badge in `SundayLoveFeast.tsx`) to `https://calendar.google.com/calendar/render?action=TEMPLATE&...` and update the click-tracking regex to match this host as well so analytics still capture clicks.

### 3. Email "Get Directions" lands on wrong place

The email currently links to a truncated URL: `https://www.google.com/maps/place/International+Sri+Krishna+Mandir+(ISKM)/@1.3146362,103.8807558,17z` — Google Maps drops the place context and falls back to a generic search.

**Fix:** Replace it with the full canonical URL the user provided, including the `data=!3m1!5s…!16s%2Fg%2F1tf33gsl` portion that pins the result to the real ISKM listing. Update both the email template href and the click-tracking regex in `addClickTracking` so the longer URL is still matched (the existing `[^"]+` already covers it, just confirm).

### 4. WhatsApp / Facebook / Telegram share buttons go to homepage

In `SundayLoveFeast.tsx` (lines 1043–1045) the share URLs all point to `https://events.srikrishnamandir.org` (root). 

**Fix:** point all three share links at the SLF page itself — `https://events.srikrishnamandir.org/sunday-love-feast` — and tweak the WhatsApp/Telegram share text to say "See you this Sunday — register at …" so the link itself is the SLF landing page.

### 5. Remove "already registered" restriction

A user can register for multiple Sundays now, so the email/phone duplicate check shouldn't block a second submission.

**Fix:**
- In `supabase/functions/submit-slf-registration/index.ts`, remove the email duplicate check (lines 124–135) and phone duplicate check (lines 137–148). Keep the insert as-is — multiple rows for the same email/phone are now allowed.
- In `src/pages/SundayLoveFeast.tsx`:
  - Remove the `checkEmailDup` / `checkPhoneDup` invocations and `onBlur` calls.
  - Remove the inline "already registered" warnings (lines 689 and 723).
  - Remove the duplicate-blocks in `handleSubmit` (lines 468–474).
  - Leave the `check-duplicate` edge function untouched (still used by NC and Prasadam).

### Test checklist

1. Open the SLF page in a non-SGT timezone (e.g. set system to UTC or India). The "Next Date" footer and the form's "Choose Date" button both show **Sunday**, not Saturday.
2. Submit a registration. The success badge says **"Sunday, 10 May 2026"**.
3. Receive the email. The hero card, subject preview, and plain-text body all say **Sunday**.
4. Click "Add to Calendar" in the email — it opens the Google Calendar prefill page (not a search results page) on both desktop and mobile.
5. Click "Get Directions" in the email — it lands on the ISKM Maps listing with the address card, not a generic search.
6. Click the WhatsApp / Facebook / Telegram share buttons in the page footer — they all share `https://events.srikrishnamandir.org/sunday-love-feast`.
7. Register twice with the same email + phone for two different Sundays — both submissions succeed, two confirmation emails arrive (one per Sunday), Wabo gets two updates with the corresponding `slf_attendance_date`.

### Files touched

- `src/pages/SundayLoveFeast.tsx`
- `supabase/functions/send-slf-confirmation/index.ts`
- `supabase/functions/submit-slf-registration/index.ts`
