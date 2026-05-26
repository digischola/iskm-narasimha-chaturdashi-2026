# Lovable prompt — paste this into Lovable's chat

> I've pushed a new branch `feat/kids-ratha-yatra-2026` with a complete design handoff under `_design-handoff/kids-ratha-yatra-2026/`. Please read `_design-handoff/kids-ratha-yatra-2026/INTEGRATION_BRIEF.md` first — it spells out exactly what to build and how it connects to the existing infrastructure.
>
> **Summary of the work:**
>
> 1. Create a new route `/kids-ratha-yatra-2026` rendered by `src/pages/KidsRathaYatra.tsx` + `src/pages/KidsRathaYatra.css`. Mirror the structure and patterns of `src/pages/RathaYatra.tsx` exactly — sections, hooks, helper components, registration flow, all of it. The visual target is `_design-handoff/kids-ratha-yatra-2026/index.html` — match it pixel-perfectly. Don't redesign.
>
> 2. Add a Supabase migration creating `public.kids_ratha_yatra_registrations` with the columns and RLS policies described in the brief.
>
> 3. Extend three existing edge functions (`submit-registration`, `check-duplicate`, `sync-to-wabo`) to recognise the new `event_slug` `kids_ratha_yatra_2026`. Clone the three rathayatra email functions (`send-rathayatra-{confirmation,reminder,thankyou}`) into `send-kry-{confirmation,reminder,thankyou}` with the kids festival copy from the brief.
>
> 4. Wire up Meta Pixel + CAPI events on `ViewContent` (mount) and `Lead` (form submit) with `content_name: "Kids Ratha Yatra 2026"`. Wire Wabo CRM sync as fire-and-forget.
>
> 5. Add a tab to `/admin` that lists Kids Ratha Yātrā registrations with the same CSV export + email-queue indicators as the existing tabs.
>
> 6. Copy the 23 images from `_design-handoff/kids-ratha-yatra-2026/images/` to `public/images/kids-ratha-yatra/` and the videos to `public/videos/kids-ratha-yatra/`. Update all asset references in the new page accordingly.
>
> **Hard rules — must not violate:**
> - No ॐ Devanagari Om symbol anywhere (locked client directive).
> - No "ISKCON" — always "ISKM Singapore".
> - Pink only for primary CTAs.
> - Sanskrit terms with IAST diacritics (`kīrtana, prasādam, Kṛṣṇa, Jagannātha`).
> - No "served / serving by the children" — keep softer language already used in the standalone HTML.
> - Font Awesome 6.5.1 only.
>
> **When you're done:**
> - Confirm: route renders, form submits insert into the new table, confirmation email queued, Wabo sync logged, Pixel Lead fires, admin tab shows the test row.
> - Run the testing checklist in the brief.
> - Open a PR `feat/kids-ratha-yatra-2026` → `main` with a description summarising the changes and the migration.
>
> Do not merge — I'll review the PR before it ships.

---

## Notes for you (the human)

- **Pixel Helper test before launch:** load `/kids-ratha-yatra-2026` in Chrome with Facebook Pixel Helper, confirm `ViewContent` fires. Submit the form with a throwaway email, confirm `Lead` fires.
- **First production registration:** do it yourself with a real phone number you control, confirm the SMS/email confirmation arrives and the Wabo entry appears.
- **Capark venue address:** the brief uses "ISKM Capark" without a street address. Update the `EVENT.venueAddress` constant and the Google Maps embed URL once you have the actual Capark address.
- **Pizza stall image** is the AI-generated `pizza_stall.jpg`. If anyone asks, you can label the card "subject to final confirmation" in the body copy.
- **Testimonials** in the standalone HTML are realistic but **not from real people**. Before launch, replace them with real parent quotes from last year's attendees (or remove the carousel entirely until you have them).
