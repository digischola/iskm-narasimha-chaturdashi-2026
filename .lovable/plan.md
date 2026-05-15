## Goal
All date values sent to the Wabo CRM should be in `dd-mm-yyyy` format. Today they go out as `yyyy-mm-dd` (the ISO format we store in Postgres).

## Where dates are sent to Wabo
Only one edge function calls Wabo: `supabase/functions/sync-to-wabo/index.ts`. The whitelisted keys that carry date values are:
- `preferred_date` — Free Prasadam sponsorship flow
- `wlf_attendance_date` — Weekend Love Feast registration flow

(`wlf_attendance_day` is "Saturday"/"Sunday" — not a date, leave alone.)

## Change
In `sync-to-wabo/index.ts`, when spreading `extras` into the outgoing payload, detect date keys and reformat the value from `YYYY-MM-DD` to `DD-MM-YYYY` before sending.

- Add `DATE_KEYS = new Set(["preferred_date", "wlf_attendance_date"])`.
- For each extra whose key is in `DATE_KEYS` and whose value matches `^\d{4}-\d{2}-\d{2}$`, convert to `DD-MM-YYYY`.
- Values that don't match the ISO pattern pass through unchanged (safety net).

DB storage stays ISO `YYYY-MM-DD`; only the wire format to Wabo changes. Confirmation emails, calendar links, and reminders are unaffected.

## Files touched
- `supabase/functions/sync-to-wabo/index.ts`
