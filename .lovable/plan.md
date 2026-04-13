

## Plan: Sunday Love Feast Backend Integration + Admin Dashboard

### What We're Building

1. **New database table** (`slf_registrations`) dedicated to Sunday Love Feast registrations, separate from the Nrsimha Caturdasi `registrations` table
2. **New edge function** (`submit-slf-registration`) to handle Sunday Love Feast form submissions with validation, duplicate checks, and "first time visiting" field
3. **Wire up the Sunday Love Feast form** to the backend — add form state, validation, duplicate checking, submission logic, and success screen
4. **Admin dashboard update** — add a tab/toggle on `/admin` so admins can switch between "Nrsimha Caturdasi" and "Sunday Love Feast" registrations, with stats, chart, search, and CSV download for each program

### Database Changes

**New table: `slf_registrations`**
- `id` (uuid, PK, default gen_random_uuid())
- `name` (text, NOT NULL)
- `email` (text, NOT NULL)
- `phone` (text, nullable)
- `attendees` (integer, NOT NULL, default 1)
- `first_time` (boolean, NOT NULL, default false)
- `created_at` (timestamptz, NOT NULL, default now())

**RLS policies:**
- INSERT: allow `anon` and `authenticated` (public registration)
- SELECT: only authenticated users with admin role

### Edge Functions

**`submit-slf-registration`** — validates name/email/phone/attendees, checks email duplicates against `slf_registrations`, inserts row. Reuses the same pattern as the existing `submit-registration` function.

### Frontend Changes

**`src/pages/SundayLoveFeast.tsx`:**
- Add form state (name, email, phone, attendees, firstTime, submitting, success)
- Add validation and duplicate email check on blur (direct call to edge function)
- Wire `onSubmit` to call `submit-slf-registration`
- Show success state with confetti after registration
- Fetch real registration count from backend for the social proof counter

**`src/pages/Admin.tsx`:**
- Add a program selector (tabs: "Nrsimha Caturdasi" / "Sunday Love Feast")
- When "Sunday Love Feast" is selected, query `slf_registrations` table
- Show matching stats cards (Total Registrations, Total Attendees, First-Time Visitors)
- Show registrations-over-time chart and searchable table with relevant columns
- CSV download for the selected program

### Files Modified
- `src/pages/SundayLoveFeast.tsx` — form state + backend integration
- `src/pages/Admin.tsx` — dual-program dashboard
- `supabase/functions/submit-slf-registration/index.ts` — new edge function
- Database migration for `slf_registrations` table + RLS

