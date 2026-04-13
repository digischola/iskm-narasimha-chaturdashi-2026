## Plan: Mobile Content Sizing + Gallery Carousel

### Problem Summary

1. **Oversized mobile elements** — Nav brand name, "Register Free" button, and other header elements are too large for 390px viewport
2. **Gallery on mobile** — Current masonry grid causes excessive scroll and poor image framing; switching to a horizontal swipeable carousel

### Changes

#### 1. Mobile typography & sizing downsizing (SundayLoveFeast.css)

In the `@media (max-width: 900px)` and `@media (max-width: 600px)` breakpoints:

- **Nav brand**: Reduce font-size from 18px → 14px
- **Nav CTA button** ("Register Free"): Reduce padding and font-size (13px → 11px, padding 8px 22px → 6px 14px)
- **Ribbon**: Already 12px — fine
- **Section titles**: Reduce `section-title` font-size on mobile (e.g. clamp down to ~1.4rem)
- **Section subtitles/badges**: Slightly smaller on mobile
- **Schedule card text, sponsor cards, FAQ question text**: Audit and reduce by ~1px each where too large
- **Hero h1**: Already responsive via clamp — verify it's not too big at 390px (currently 2rem at 600px, 1.7rem at 380px — reasonable)

#### 2. Gallery → Horizontal Carousel (SundayLoveFeast.tsx + .css)

Replace the masonry grid gallery with a touch-swipeable horizontal carousel:

- **Layout**: Single row of images, horizontally scrollable with `overflow-x: auto`, `scroll-snap-type: x mandatory`
- **Each image**: Fixed aspect ratio (3:4), rounded corners, ~280px wide on mobile, scroll-snap-align: center, auto scroll 4 second
- **Navigation**: CSS-only scroll with optional dot indicators showing position
- **Desktop (>900px)**: Keep existing masonry grid layout — carousel only applies on mobile
- **Lightbox**: Still opens on tap

**Implementation approach**: Pure CSS scroll-snap (no external library needed). On desktop, render the existing grid. On mobile, render a horizontal scroll container with the same images.

#### 3. Files Modified

- `src/pages/SundayLoveFeast.css` — Add mobile size overrides, carousel styles
- `src/pages/SundayLoveFeast.tsx` — Gallery section: conditionally render carousel markup on mobile (or use CSS to switch layout)