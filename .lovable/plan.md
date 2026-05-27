# Sync KRY emails & fix Wabo attendees

## Source of truth (from landing page)
- **Date:** Saturday, 27 June 2026
- **Time:** 7:00 PM – 9:15 PM SGT (doors 6:45 PM; prasādam from 9:15 PM)
- **Venue:** ISKM Singapore, No. 9 Lorong 29 Geylang, Singapore 388062
- **Event URL:** https://events.srikrishnamandir.org/kids-ratha-yatra-2026

## Issues found

### 1. Add-to-calendar links (timing + venue wrong)
Both the landing page and the confirmation email use:
`dates=20260627T100000Z/20260627T130000Z` (= 6:00–9:00 PM SGT) and `location=ISKM+Capark%2C+Singapore`.

Should be: `dates=20260627T110000Z/20260627T131500Z` (= 7:00–9:15 PM SGT) and `location=ISKM+Singapore%2C+9+Lorong+29+Geylang%2C+Singapore+388062`. Also drop "ISKM Capark" from the details text.

Files: `src/pages/KidsRathaYatra.tsx` (calUrl, line ~273), `supabase/functions/send-kry-confirmation/index.ts` (CALENDAR_URL, line 5).

### 2. KRY confirmation email (`send-kry-confirmation/index.ts`)
- Line 80: "6:00 PM to 9:00 PM" → "7:00 PM – 9:15 PM"
- Line 82: "ISKM Capark" → "ISKM Singapore, No. 9 Lorong 29 Geylang, Singapore 388062"
- Line 41: "ISKM Capark" → "ISKM Singapore"
- Line 6 (WA_SHARE): "ISKM Capark … 6 PM" → "ISKM Singapore … 7 PM"
- Line 268 (plain text): "6:00 PM to 9:00 PM\nISKM Capark, Singapore" → "7:00 PM – 9:15 PM\nISKM Singapore, No. 9 Lorong 29 Geylang"

### 3. KRY reminder email (`send-kry-reminder/index.ts`)
- Line 116: "ISKM Capark" → "ISKM Singapore"
- Line 128–131: rewrite agenda timings to match landing schedule (7:00 PM speech & deities, 7:25 PM ārati/kīrtana, 7:40 PM chariot pulling, 8:50–9:00 PM final ārati, 9:15 PM prasādam)
- Line 208: "doors 6:00 PM. Chariots roll at 6:00 PM." → "doors 6:45 PM. Chariots roll at 7:40 PM."
- Line 209: "ISKM Capark, Singapore" → "ISKM Singapore, 9 Lorong 29 Geylang"
- Line 219: "MRT: ISKM Capark" → correct venue line
- Line 241: "until 9:00 PM" → "until 9:15 PM"
- Line 273 (subject): "Tomorrow at 6 PM … ISKM Capark" → "Tomorrow at 7 PM … ISKM Singapore"

### 4. KRY thank-you email
Reads clean; no date/time/venue fields to update. Leave as-is.

### 5. Wabo `attendees` field not arriving
**Root cause:** `src/pages/KidsRathaYatra.tsx` sends `attendees` as a top-level body field, and `supabase/functions/sync-to-wabo/index.ts` destructures it — but never actually adds it to the outgoing payload. Only the whitelisted `extras` are spread; `attendees` is silently dropped for every flow (KRY, RY, WLF).

**Fix:** In `sync-to-wabo/index.ts`, after building the base `payload`, add:
```ts
if (attendees !== undefined && attendees !== null && String(attendees).trim() !== "") {
  payload.attendees = String(attendees);
}
```
This will deliver `attendees` to Wabo for every event that passes it (already wired on KRY, RY, and WLF callers).

## Files touched
- `src/pages/KidsRathaYatra.tsx` — calUrl only
- `supabase/functions/send-kry-confirmation/index.ts`
- `supabase/functions/send-kry-reminder/index.ts`
- `supabase/functions/sync-to-wabo/index.ts`

## Out of scope
- Ratha Yātrā (adult) emails — say so if you want those checked too
- Visual layout / styling changes
- New copy beyond aligning date/time/venue/links
