

## Plan: Fix Header Gap, Add Backend, and Hero Effects

### 1. Fix Ribbon-to-Nav Gap on Mobile

The ribbon uses `flex-direction: column` on mobile, making it taller than the hardcoded `top` offset on `.sticky-nav`. Fix by dynamically measuring ribbon height or adjusting the CSS offsets so nav sits flush below the ribbon with no gap.

**Changes:**
- `src/index.css`: Adjust `.sticky-nav` top values at 768px and 480px breakpoints to match actual ribbon height. Remove gap by fine-tuning `top` from `52px`/`46px` to the correct measured values (ribbon on mobile is ~50px with column layout). Also adjust `.hero` margin-top accordingly.

---

### 2. Backend — Save Registration Data with Lovable Cloud

Enable Lovable Cloud to get a Supabase-backed database. Create a `registrations` table and an edge function to store form submissions.

**Changes:**
- **Database table** `registrations`: columns for `id`, `name`, `email`, `phone`, `attendees`, `is_volunteer`, `age`, `gender`, `remarks`, `volunteer_categories` (text array), `created_at`
- **Edge function** `submit-registration`: Validates input with Zod, inserts into `registrations` table, returns success
- **`src/App.tsx`**: Update `completeRegistration()` to call the edge function via `supabase.functions.invoke('submit-registration', ...)` before opening WhatsApp
- **`src/integrations/supabase/client.ts`**: Standard Supabase client setup (created automatically by Lovable Cloud)

**Admin Dashboard:**
- New route `/admin` with a simple dashboard page
- Fetches registration data from `registrations` table
- Shows: total registrations, total attendees, volunteer count, registrations over time chart, and a data table with search/filter
- Protected by a basic check (can discuss auth approach separately)

---

### 3. Hero Section Dynamic Effects

Add three visual effects to make the hero feel alive:

**a) Animated gradient background** — Slowly shifting gradient using CSS `@keyframes` on the `.hero` background, cycling between navy/deep-blue/purple tones.

**b) Parallax scrolling** — The hero image (`hero-painting`) moves at a slower rate than the content as the user scrolls, using a lightweight `useEffect` with `transform: translateY()` based on scroll position.

**c) Golden particle/sparkle effects** — A canvas-based particle system rendered behind the hero content showing floating golden particles that drift upward, giving a divine/celestial feel. Implemented as a React component `<GoldenParticles />` using `<canvas>` with `requestAnimationFrame`.

**Changes:**
- `src/App.tsx`: Add `<GoldenParticles />` component in the hero section, add parallax scroll handler to hero painting
- `src/index.css`: Add `@keyframes gradient-shift` animation on `.hero`, ensure canvas is positioned absolutely behind content

---

### Technical Details

**Files modified:**
- `src/index.css` — Gap fix, animated gradient keyframes
- `src/App.tsx` — Supabase integration in form, parallax hook, GoldenParticles canvas component
- `supabase/functions/submit-registration/index.ts` — New edge function
- `src/pages/Admin.tsx` — New admin dashboard page
- `src/App.tsx` or routing setup — Add `/admin` route
- Database migration for `registrations` table

