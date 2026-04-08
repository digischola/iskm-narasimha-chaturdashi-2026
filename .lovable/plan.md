

## Plan: Remove Volunteer Section Entirely

### What's changing
The client doesn't need volunteer functionality for this festival. We'll remove all volunteer-related UI, form fields, logic, and backend handling across the entire app.

### Changes

**1. `src/App.tsx` — Registration Form**
- Remove `VOLUNTEER_CATEGORIES` array
- Remove state: `isVolunteer`, `volCats`
- Remove the "Would you like to volunteer?" dropdown (lines 401-407)
- Remove Step 2 entirely (the volunteer details form with age, gender, remarks, volunteer categories — lines 413-443)
- Remove multi-step logic: no more `step` state, `stepCount`, step dots, `handleStep2`
- Simplify `completeRegistration` — always pass `is_volunteer: false`, remove volunteer WhatsApp message branch
- Remove `toggleCat` function
- Simplify button text (no "Next — Volunteer Details" conditional)

**2. `src/App.tsx` — Volunteer Component**
- Delete the entire `Volunteer()` component (lines 697-711, the "Serve & Be Blessed" section)
- Remove `<Volunteer />` from `LandingPage` render (line 853)

**3. `src/App.tsx` — Stats Component**
- Change "50 Dedicated Volunteers" stat to something else relevant (e.g., "10+ Cultural Programmes" or remove that stat entry)

**4. `src/pages/Admin.tsx` — Dashboard**
- Remove "Volunteers" stat card
- Remove "Volunteer" and "Categories" columns from the table
- Remove those fields from CSV export headers/data
- Remove `volunteerCount` calculation
- Remove `is_volunteer` and `volunteer_categories` from the Registration interface (keep in type but ignore)

**5. `supabase/functions/submit-registration/index.ts` — Edge Function**
- Remove `is_volunteer` and `volunteer_categories` parsing
- Stop inserting those fields (they'll default to `false` and `null` in the DB, so no migration needed)

**6. CSS cleanup**
- Volunteer-related CSS classes (`.volunteer-banner`, `.volunteer-inner`, etc.) can be left as dead code or cleaned up

### What stays
- The database columns remain (no migration needed — they have defaults). Existing data is preserved.
- The edge function still accepts these fields silently if sent, but the UI won't send them.

