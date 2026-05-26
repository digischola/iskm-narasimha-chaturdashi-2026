# Kids Ratha Yātrā 2026 — Lovable Integration Brief

This brief tells Lovable exactly how to take the standalone landing page in this folder and integrate it into the existing `events.srikrishnamandir.org` codebase, matching the pattern of `/ratha-yatra-2026` and `/nrsimha-caturdasi-2026`.

## Goal

Add a new route `/kids-ratha-yatra-2026` to the Lovable repo, fully wired to Supabase (registration table, edge functions, confirmation emails), Meta Pixel + CAPI, and Wabo CRM sync. **The visual design is locked** — see `index.html` and `colors_and_type.css` in this folder for the exact pixel-perfect target. Do not redesign.

## Repo context (already in place — do not touch unless instructed)

- **Stack:** Vite + React 18 + TypeScript, Tailwind (used minimally — most styles are scoped per-page CSS), `react-router-dom` v7, `react-helmet-async`, `@supabase/supabase-js`.
- **Brand source of truth:** `src/index.css` already declares all design tokens (navy / gold / pink / cream + Playfair Display + Source Sans Pro). The standalone page links a copy of `colors_and_type.css` — use the equivalent variables already in the repo.
- **Hard brand rules** (from `ISKM-Brand-Guidelines.md` / SKILL.md):
  - **Never use the ॐ Devanagari Om symbol.** Locked client directive 2026-04-30.
  - Never write "ISKCON" — always "ISKM Singapore".
  - Pink (`#f8a4c0`) is for primary CTAs only.
  - Pure white only for form fields, modals, table rows. Page bg is cream.
  - Sanskrit terms carry IAST diacritics on first reference: `kīrtana, prasādam, Kṛṣṇa, Jagannātha, Subhadrā, Mahāprabhu, Ratha Yātrā, Gauḍīya`.
  - Font Awesome 6.5.1 only.
  - Banned phrases: transformative, world-class, premium, unlock, discover, next-level, reimagined.
  - **Never use the words "serving / served / serve by the children"** — soften to "kids' stall", "prepared by", "offered with love", etc. (child-labour-safety language from round-3 feedback).
- **Existing event pages** to copy the pattern from:
  - `src/pages/RathaYatra.tsx` (1,738 lines) + `src/pages/RathaYatra.css` (1,990 lines) — closest sibling, copy patterns liberally.
  - `src/pages/WeekendLoveFeast.tsx` — multi-event registration pattern reference.
  - `src/pages/FreePrasadamProgram.tsx` — multi-event registration with extras.

## What to build

### 1. New page: `src/pages/KidsRathaYatra.tsx` + `KidsRathaYatra.css`

Convert the standalone `index.html` into a single React component using the exact same hook + section layout pattern as `RathaYatra.tsx`. **Do not change visual design.** Sections in order:

1. Skip link
2. Ribbon (gold-dot urgency + pink CTA link)
3. Sticky nav (logo + 4 desk links + register CTA)
4. Scroll progress bar
5. Hero (responsive video bg, eyebrow, H1 with gold accent, italic tagline, 3-item meta row, countdown card, scroll-down hint, cursor-following glow on hover, floating gold petals, trust strip beneath)
6. Registration form (cream-on-white card)
7. About / "Why a Kids Ratha Yātrā?" — center-aligned header, magazine 2-col on desktop, image-then-text on mobile
8. Attractions grid (9 cards including Pizza Stall; staggered fade-in + hover tilt)
9. Gallery (dual marquee film-strip, top row L→R, bottom R→L, paused on hover, 60s loop)
10. 3 cycling testimonials (no avatar circles, 6s auto-cycle)
11. Schedule timeline (cream-warm bg, gold icon dots, peak-moment cards, scroll-linked gold rail)
12. FAQ (accordion)
13. Location (Google Maps iframe + info card)
14. Share row (WhatsApp, Telegram, Calendar, Copy link)
15. Final CTA (navy with gold radial glow)
16. Footer (4-col with logo + nav)
17. Mobile sticky register bar

**Key event constant block at the top of the file:**
```ts
const EVENT = {
  slug: "kids_ratha_yatra_2026",
  title: "Kids Ratha Yātrā 2026",
  date: "Saturday, 27 June 2026",
  time: "6:00 PM – 9:00 PM (SGT)",
  venue: "ISKM Capark, Singapore",
  venueAddress: "ISKM Capark, Singapore",   // Replace with real Capark street address when client provides
  countdownIso: "2026-06-27T18:00:00+08:00",
  url: "https://events.srikrishnamandir.org/kids-ratha-yatra-2026",
  pixelContent: "Kids Ratha Yatra 2026",
};
```

### 2. Add the route

In `src/App.tsx`, add the lazy-imported route:

```tsx
const KidsRathaYatra = lazy(() => import("@/pages/KidsRathaYatra"));
// inside <Routes>:
<Route path="/kids-ratha-yatra-2026" element={
  <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>}>
    <KidsRathaYatra />
  </Suspense>
} />
```

### 3. Asset migration

Copy the entire contents of `Landing Page/images/` into `public/images/kids-ratha-yatra/` and the videos into `public/videos/kids-ratha-yatra/`. Update all asset references inside `KidsRathaYatra.tsx` accordingly. Filenames already follow snake_case web convention.

### 4. Database migration

Create `supabase/migrations/YYYYMMDDHHMMSS_kids_ratha_yatra_registrations.sql`:

```sql
-- Kids Ratha Yātrā 2026 registrations
CREATE TABLE public.kids_ratha_yatra_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  adults integer NOT NULL DEFAULT 1,
  kids integer NOT NULL DEFAULT 0,
  source text,
  confirmation_sent boolean NOT NULL DEFAULT false,
  reminder_sent boolean NOT NULL DEFAULT false,
  thankyou_sent boolean NOT NULL DEFAULT false
);

ALTER TABLE public.kids_ratha_yatra_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can register (anon insert)
CREATE POLICY "Anyone can register for Kids Ratha Yatra"
  ON public.kids_ratha_yatra_registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Only admins can read Kids Ratha Yatra registrations"
  ON public.kids_ratha_yatra_registrations FOR SELECT
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role full access
CREATE POLICY "Service role full access on kids_ratha_yatra"
  ON public.kids_ratha_yatra_registrations FOR ALL
  TO public USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- Useful indexes
CREATE INDEX idx_kry_email   ON public.kids_ratha_yatra_registrations (email);
CREATE INDEX idx_kry_phone   ON public.kids_ratha_yatra_registrations (phone);
CREATE INDEX idx_kry_created ON public.kids_ratha_yatra_registrations (created_at DESC);
```

### 5. Edge function updates (5 files)

**5a. `supabase/functions/submit-registration/index.ts`** — add an entry to `EVENT_CONFIGS`:

```ts
const EVENT_CONFIGS: Record<string, EventConfig> = {
  // ...existing entries...
  kids_ratha_yatra_2026: {
    table: "kids_ratha_yatra_registrations",
    confirmationFn: "send-kry-confirmation",
    phoneRequired: true,
  },
};
```

Also extend the insert payload to accept `adults` + `kids` (split from the single `attendees` count the existing pattern uses). Validate both as integers 0–20.

**5b. `supabase/functions/check-duplicate/index.ts`** — add to `SLUG_TABLE_MAP`:

```ts
const SLUG_TABLE_MAP: Record<string, string> = {
  // ...existing entries...
  kids_ratha_yatra_2026: "kids_ratha_yatra_registrations",
};
```

**5c. `supabase/functions/sync-to-wabo/index.ts`** — add to `ALLOWED_EVENT_SLUGS`:

```ts
const ALLOWED_EVENT_SLUGS = new Set([
  // ...existing entries...
  "kids_ratha_yatra_2026",
]);
```

And add to `ALLOWED_EXTRA_KEYS` if you want to pass kids count to Wabo:

```ts
const ALLOWED_EXTRA_KEYS = new Set([
  // ...existing entries...
  "kry_adults",
  "kry_kids",
]);
```

**5d. `supabase/functions/process-email-queue/index.ts`** — register the new send / reminder / thankyou functions in the queue dispatcher.

### 6. New email functions (3 files — clone & rename)

Clone the rathayatra trio with `find/replace`:
- `send-rathayatra-confirmation` → `send-kry-confirmation`
- `send-rathayatra-reminder`     → `send-kry-reminder`
- `send-rathayatra-thankyou`     → `send-kry-thankyou`

In each new function:
- Update `EVENT_URL` → `https://events.srikrishnamandir.org/kids-ratha-yatra-2026`
- Update `CALENDAR_URL` (date `20260627T100000Z/20260627T130000Z`)
- Update `WA_SHARE` and `TG_SHARE` URLs with kids festival copy
- Replace `ratha_yatra_registrations` table reference with `kids_ratha_yatra_registrations`
- Replace `thankyou_sent` / `reminder_sent` column references (same names, no change)
- Update email subject lines: e.g. *"You're registered for Kids Ratha Yātrā 2026 🚩"*
- Update email body copy to reference the children-led festival, the seven attractions, the 27 June date, and the venue
- Clone the `_shared/nc-email-templates/confirmation.html` template if needed and rebrand for kids festival (or keep a single template with event-aware copy)

Reminder cadence: 7 days before, 1 day before, day-of (match rathayatra pattern).

### 7. Meta Pixel + CAPI events

Inside `KidsRathaYatra.tsx`:

```ts
// On mount
trackPixelEvent("ViewContent", { content_name: EVENT.pixelContent });

// On form submit (after Supabase insert succeeds)
const eid = genEventId();
trackPixelEvent("Lead", { content_name: EVENT.pixelContent }, eid);
trackCapiEvent({
  eventName: "Lead",
  eventId: eid,
  userEmail: email.trim(),
  userPhone: getFullPhone() || undefined,
  customData: { content_name: EVENT.pixelContent },
});
```

Pixel ID stays `584081669242535` (existing, shared across events).

### 8. Wabo CRM sync (fire-and-forget after registration)

```ts
supabase.functions.invoke("sync-to-wabo", {
  body: {
    event_slug: EVENT.slug,
    source: `${EVENT.title} - Landing Page`,
    name: name.trim(),
    email: email.trim(),
    country_code: phoneCode,
    phone: phoneNum,
    attendees: String(adults + kids),
    extras: {
      kry_adults: String(adults),
      kry_kids: String(kids),
    },
  },
}).catch(e => console.error("Wabo sync exception:", e));
```

### 9. Form behaviour (match existing pattern)

- Real-time validation (name ≥ 2 chars, email regex, phone 8–15 digits with country code)
- Duplicate check on email + phone blur, via `check-duplicate` edge function with `event_slug` param
- Inline check / cross icons during typing
- Submit button disabled until all fields valid AND no duplicate detected
- On success: confetti burst + "You're registered!" state + Add-to-Google-Calendar button
- All form copy + UI patterns: copy verbatim from `RathaYatra.tsx`'s `RegistrationForm` component

### 10. Admin dashboard integration

The existing `/admin` page lists registrations by event. Add a new tab or filter for Kids Ratha Yātrā that:
- Queries `kids_ratha_yatra_registrations` (RLS-guarded — only admins)
- Shows: created_at, name, email, phone, adults, kids, total = adults+kids, confirmation_sent flag, source
- Same CSV export pattern as existing tabs
- Same email-queue-status indicators

### 11. Update `src/components/RathaYatraWheel.tsx`?

Not needed for this page — the standalone uses a custom `hero-wheel` SVG inline. The Kids page does NOT use the existing `RathaYatraWheel` component; the standalone hero has been intentionally stripped of the wheel + deco text per round-6 feedback. **Just port the hero exactly as-is** (video bg + countdown + trust strip, no rotating wheel or ghost wordmark).

### 12. `index.html` + `vite.config.ts`

No changes needed — existing build serves the new route via React Router.

### 13. Open Graph / SEO

- `<title>` Kids Ratha Yātrā 2026 — ISKM Singapore
- `<meta name="description">` Little Hands, Big Service for Lord Jagannātha. A joyful kids-led Ratha Yātrā celebration at ISKM Singapore — Saturday 27 June 2026, 6:00 PM – 9:00 PM. Free entry, free prasādam, all are welcome.
- `og:image`: `/images/kids-ratha-yatra/hero_02_mom_boy_chariot.jpg` (the warmest hero shot)
- `og:url`: `https://events.srikrishnamandir.org/kids-ratha-yatra-2026`

### 14. Optional but recommended

- **JSON-LD event schema** for Google Events rich result. Type `Event`, `startDate` `2026-06-27T18:00:00+08:00`, `endDate` `2026-06-27T21:00:00+08:00`, `location.address.streetAddress` `ISKM Capark`, `offers.price` `0`.
- **Sitemap.xml entry**.
- **Favicon variants** for iOS / Android.

## Data safety checklist (cannot ship without)

- [ ] RLS enabled on `kids_ratha_yatra_registrations`
- [ ] Anon role: INSERT only, no SELECT/UPDATE/DELETE
- [ ] Authenticated role: SELECT only when `has_role(uid, 'admin')`
- [ ] Service role: full access (for edge functions)
- [ ] Email/phone duplicate prevention via `check-duplicate`
- [ ] Server-side validation in `submit-registration` (length limits, regex)
- [ ] No PII in client-side `console.log` in production builds
- [ ] Meta CAPI sends `email + phone` hashed (SHA-256) — confirm existing `meta-capi` function hashes
- [ ] Wabo sync is fire-and-forget so failures don't expose data or break UX
- [ ] `.env` secrets not committed (`VITE_SUPABASE_*` keys are anon, OK to ship; `WABO_API_KEY` + `SUPABASE_SERVICE_ROLE_KEY` are edge-function-only)

## Testing checklist

- [ ] Register a test entry, confirm row appears in `kids_ratha_yatra_registrations`
- [ ] Confirmation email arrives within 30s
- [ ] Reminder email queues for 7 / 1 / 0 days before
- [ ] Wabo sync succeeds (check Wabo dashboard for `kids_ratha_yatra_2026: yes` field)
- [ ] Duplicate email registration blocked
- [ ] Duplicate phone registration blocked
- [ ] Meta Pixel `Lead` event fires (check Pixel Helper)
- [ ] CAPI event arrives within 30s (check Meta Events Manager)
- [ ] Mobile view: image-before-text on About, hero video plays, marquee scrolls smoothly, no horizontal overflow
- [ ] Reduced-motion preference respected (no animations)
- [ ] Lighthouse: LCP < 2.5s, CLS < 0.1

## Files in this folder (the design handoff)

```
Landing Page/
├── index.html                  ← Visual design source of truth (pixel-perfect target)
├── colors_and_type.css         ← Brand token reference (already in repo as src/index.css)
├── images/                     ← 23 photos, all web-optimised, move to public/images/kids-ratha-yatra/
├── video/
│   ├── hero-loop-desktop.mp4   ← 1920×1080, 5.3MB, 23s — used at ≥768px
│   ├── hero-loop.mp4           ← 1080×1920, 4MB, 23s — used at <768px
│   ├── hero-loop-desktop-poster.jpg
│   └── hero-loop-poster.jpg
├── INTEGRATION_BRIEF.md        ← This document
└── LOVABLE_PROMPT.md           ← Copy-paste prompt for Lovable's chat
```
