

## Plan: Seva Cards, Sticky Bar, Significance Section Fixes

### Changes Overview

**1. Seva Cards Updates** (`src/App.tsx`, lines 485-506)
- Remove "Puṣpa-Alaṅkāra" and "Mandira Puṣpa Sevā" cards from `SEVA_CARDS`
- Rename "General Donation" → "Charity Donation", link to `https://srikrishnamandir.org/product/outright-donation/`
- Link "Annadānam Sevā" to `https://srikrishnamandir.org/product/annadanam-seva/`
- Rename "Abhiṣeka Sevā" → "Join As a Patron", update description to something like "Become a patron and support the temple's spiritual mission", link to `https://srikrishnamandir.org/join-as-a-patron/`
- Copy uploaded patron image (`user-uploads://Patron-Program-img.jpg`) to `public/images/patron-program.jpg` and use it for the patron card
- Update Seva component to use `<a>` tags with `target="_blank"` for each card's contribute button

**2. Sticky Ribbon & Nav Bar Fixes** (`src/index.css`)
- Fix ribbon overlapping header on mobile: reduce ribbon padding, ensure proper `top` offset for `.sticky-nav`
- Fix "Register Free" button contrast: change `.nav-cta` to use `color: var(--navy)` or darker text on the pink background for better readability
- Ensure ribbon + nav don't overlap content by adjusting `hero` margin-top values across breakpoints

**3. Significance Section Mobile Fixes** (`src/index.css`)
- Center-align `.editorial-text` on mobile (text-align: center)
- Fix `.editorial-visual` on mobile: ensure image fills the card properly with `width: 100%`, `object-fit: cover`, and appropriate `aspect-ratio`
- Adjust `.editorial-overlay` padding and text sizing for mobile so mantra text is readable and properly positioned within the image card

### Technical Details

**Files modified:**
- `src/App.tsx` — Update `SEVA_CARDS` array and `Seva` component
- `src/index.css` — Mobile responsive fixes for ribbon, nav, and editorial section
- `public/images/patron-program.jpg` — New asset copied from upload

