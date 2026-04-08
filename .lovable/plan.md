

## Prevent duplicate registrations by email or phone

### Approach
Add a duplicate check in the edge function before inserting. Query the `registrations` table for existing rows matching the submitted email OR phone number (if provided). Return a user-friendly error if a match is found. Also add a unique constraint on `email` at the database level as a safety net.

### Changes

**1. Database migration** — Add unique index on `email` column:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS registrations_email_unique ON public.registrations (email);
```

**2. Edge function (`supabase/functions/submit-registration/index.ts`)** — Add duplicate check before insert (after validation, before insert):
- Query `registrations` table for rows where `email = $email` OR (phone is not null AND `phone = $phone`)
- If match found on email → return 409 with message "This email has already been registered"
- If match found on phone → return 409 with message "This phone number has already been registered"

**3. Frontend (`src/App.tsx`)** — Handle the 409 response in the form submission handler:
- Parse the error message from the response
- Display it in the existing error UI (toast or inline) instead of a generic failure message

