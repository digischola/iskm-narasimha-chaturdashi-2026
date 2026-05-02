## Changes

### 1. About section: collapsible "Read more" text

Show only the first two paragraphs (heading + "Ratha Yatra is one of India's oldest..." + "Traditionally held on the second day..."). The remaining three paragraphs will be hidden behind a "Read more about the festival" toggle button, with a smooth expand/collapse animation.

- Add `readMore` state to the `About` component
- Wrap paragraphs 3-5 in a `.read-more-content` div
- Add a toggle button styled like the Rama Utsav page (text-only, navy color, with arrow indicator)
- Add `.read-more-content` CSS with max-height/opacity transition

### 2. Reduce sticky nav height

The sticky header currently has `height: 56px`. After removing the ribbon, there's too much visual gap. Reduce the nav height to `48px` and adjust the logo size from 32px to 28px. Update `.chip-bar` top offset and `scroll-padding-top` accordingly.

### 3. Map/Location layout cleanup

The current location section has a separate grid with `.loc-map` using absolute-positioned iframe causing whitespace issues. Switch to the Rama Utsav pattern:

- Use a `bg-white rounded-2xl overflow-hidden shadow grid grid-cols-1 md:grid-cols-2` container (via CSS classes on `.location-wrap`)
- Make the map iframe use `w-full h-full min-h` instead of absolute positioning
- Remove the `.loc-map` absolute positioning and let the iframe flow naturally within the grid cell
- This eliminates the whitespace gap around the map

### Files modified

- `src/pages/RathaYatra.tsx` -- Add `readMore` state to About, wrap paragraphs, add toggle button
- `src/pages/RathaYatra.css` -- Add `.read-more-content` styles, reduce nav height, fix map layout  
  
4. Copy fix on the Ratha Yatra exit-intent modal — current text says "14,000+ already saved their seat" which is factually wrong since 2026 registrations are just opening. The 14,000+ figure refers to 2025 attendance, not 2026 sign-ups, and we don't want to claim social proof we haven't earned yet.
  In src/pages/RathaYatra.tsx, inside the ExitIntentModal component, please update the modal copy as follows:
  1. Eyebrow line: change to "Wait, don't leave yet"
     (drop the em-dash, replace with comma — em-dashes are banned across this brand's voice)
  2. Headline (h3): change "14,000+ already saved their seat" to "14,000+ joined us last year"
  3. Body paragraph (p): change to:
     "Sunday, 5 July at Clementi Stadium. Three chariots, ecstatic kīrtana, free 5-course Prasadam. Drop your name and email and we'll send you a reminder so you don't miss it."
  4. Keep the CTA "Save my spot →" and the "No thanks, I'll register later" skip link as-is.
  5. Success state: keep the existing copy ("You're on the list! · We'll send you a reminder before Sunday, 5 July. See you at Clementi Stadium.") — that one is already grounded.
  This keeps the FOMO (14,000+ is a real number that builds authority) but anchors it correctly in last year's scale rather than implying current-year over-claim. Voice principle for this brand: factual, grounded, no marketing puff, no em-dashes. 