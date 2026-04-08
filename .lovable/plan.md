

## Fix: Standardize event time to 6:30 PM – 10:00 PM SGT

### Issues Found (all in `src/App.tsx`)

| Location | Current | Fix |
|----------|---------|-----|
| **Line 112** – Hero meta | `6:30 PM – 9:45 PM` | `6:30 PM – 10:00 PM` |
| **Line 198** – WhatsApp message | `6:30 PM – 9:45 PM` | `6:30 PM – 10:00 PM` |
| **Line 216** – Google Calendar URL | `dates=20260430T103000Z/20260430T134500Z` (ends 9:45 PM SGT) | `dates=20260430T103000Z/20260430T140000Z` (ends 10:00 PM SGT) |

The schedule timeline (lines 516–519) already correctly ends at 10:00 PM — no change needed there.

### Changes
**File: `src/App.tsx`** — 3 edits:
1. Line 112: Replace `9:45 PM` with `10:00 PM`
2. Line 198: Replace `9:45 PM` with `10:00 PM` in WhatsApp template
3. Line 216: Change calendar end time from `T134500Z` to `T140000Z` (13:45 UTC → 14:00 UTC = 10:00 PM SGT)

