## Goal

Communicate honestly that **Prasādam is free**, while the other 6 stalls run on a **small contribution** — without over-hyping "free" or making the festival feel transactional.

## Changes

### 1. `src/pages/KidsRathaYatra.tsx` — stall cards

Add a `tag` field to each item in the `STALLS` array:


| Stall                     | Tag               |
| ------------------------- | ----------------- |
| Prasādam Mercy Corner     | `Free seva`       |
| Jagannātha's Fruit Fiesta | `By contribution` |
| Govinda's Cool Corner     | `By contribution` |
| Little Souls Bhakti Hub   | `By contribution` |
| Handmade Souvenir Stall   | `By contribution` |
| Samosa Seva Stop          | `By contribution` |
| Pizza Stall               | `By contribution` |


Render the tag as a small chip inside each stall card (top-right of the card body, above the title) so it sits consistently across all 7 cards.

### 2. `src/pages/KidsRathaYatra.tsx` — stalls subhead

Replace the current empty `​` subhead paragraph under "Visit the Stalls" with:

> *Mahāprasādam is offered free to everyone. A few stalls run on a small contribution that supports the festival.*

### 3. `src/pages/KidsRathaYatra.css` — chip styles

Two chip variants using existing tokens (no new colors):

- `.stall-tag-free` — soft gold background, navy text (matches the existing experience-tag treatment but quieter).
- `.stall-tag-contribution` — neutral cream/sand background, muted navy text.

Both: small caps, 11px, rounded, ~4px/8px padding. Positioned at the top of the card body so they don't fight the image.

### 4. Confirmation email — `supabase/functions/send-kry-confirmation/index.ts`

In the "what to expect" / stalls block, add one neutral line:

> *Mahāprasādam is free for everyone. A few stalls (snacks, souvenirs, cool drinks) run on a small contribution.*

Place it right after the existing stalls/attractions paragraph so it reads as context, not as a sales pitch. Redeploy the function after the edit.

## Out of scope (per your answers)

- No FAQ entry added.
- No price chips, no "$" symbols, no donation language.
- No changes to the Experiences section, schedule, hero, or any other copy.

## Verification

- Load `/kids-ratha-yatra-2026` at desktop + mobile widths; confirm all 7 stall cards show a chip, Mahāprasādam is the only "Free seva", the 3-3-1 grid still centers the 7th card on desktop.
- Trigger a test registration and confirm the confirmation email contains the new line.