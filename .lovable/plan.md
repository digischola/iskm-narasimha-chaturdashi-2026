
## Plan: Ratha Yatra Hero Section Overhaul

### 1. Create `src/components/RathaYatraWheel.jsx`

Copy the uploaded ornate Konark-style chariot wheel component verbatim from `user-uploads://RathaYatraWheel.jsx`. This replaces the simple SVG wheel currently inline in the hero.

### 2. Update `src/pages/RathaYatra.tsx` — Hero section

- **Remove** the inline `<svg className="hero-wheel">` (lines 309-329).
- **Import** and render `RathaYatraWheel` as a background layer behind all hero content:
  ```
  <div className="hero-wheel-layer">
    <RathaYatraWheel className="hero-wheel-ornate" rotationSeconds={90} />
  </div>
  ```
- **Tagline line break**: Split the tagline so "Take home the blessing." is on its own line using a `<br />` with a CSS class for responsive control (visible on both mobile and desktop per the request).
- **Remove** `margin-top: 0` on `.hero` — the Narasimha page uses `margin-top: 93px` (accounting for ribbon + nav). Since Ratha Yatra has no ribbon, set `margin-top: 48px` (nav height only).

### 3. Update `src/pages/RathaYatra.css` — Styling changes

**a) Ornate wheel layer styling**
- `.hero-wheel-layer`: absolute positioned, centered, `pointer-events: none`, `z-index: 0`.
- `.hero-wheel-ornate`: `w-[180%]` on mobile scaling to `w-[140%]` on desktop, `opacity: 0.15`, centered with flex.
- Remove old `.hero-wheel` styles (lines 1522-1538).

**b) Overlay / contrast strengthening**
- Add a `::after` pseudo-element on `.hero` with a dark radial gradient overlay (`rgba(15,31,58,0.4)` center fading to `rgba(15,31,58,0.7)` edges) to ensure text readability over the ornate wheel. `z-index: 1` so it sits between wheel and content.

**c) Mobile hero spacing (header to image)**
- Match Narasimha exactly: `.hero-top` padding on mobile (`max-width: 768px`) becomes `30px 20px 30px` (same as Narasimha's 768px breakpoint).
- `.hero-painting` on mobile: `width: 240px` (matching Narasimha's 768px value), `margin: 0 auto 24px`, `order: -1`.

**d) Mobile hero image frame alignment**
- Copy Narasimha's exact frame values: `border-radius: 16px`, `::before inset: -6px / border-radius: 20px`, `::after inset: -12px / border-radius: 24px`.

**e) Tagline layout**
- Mobile: `text-align: center` (already set). The `<br>` ensures "Take home the blessing." wraps.
- Desktop: `text-align: right` on `.hero-tagline`. The `<br>` also applies on desktop for visual balance.
- Desktop countdown timer: Place the countdown inline with the tagline area using `display: inline-flex` on the countdown row within the text flow, or position it on the same baseline via flexbox alignment. The countdown sits to the right of / inline with the tagline text rather than stacked below.
- Mobile countdown: Leave stacked as-is.

**f) Safe-area padding**
- Add `padding-top: env(safe-area-inset-top)` to `.hero` for iOS notch safety.

**g) Reduced motion**
- The RathaYatraWheel component already handles `prefers-reduced-motion`. Keep the existing petal animation pause rule.

### 4. Brand constraints preserved

- All colors from existing tokens only (navy, gold, pink, cream).
- Fonts remain Playfair Display + Source Sans Pro.
- Touch targets on CTA already meet 44x44px minimum.
- No new hex values introduced.

### Key reference values from Narasimha (index.css)

| Property | Narasimha value |
|---|---|
| `.hero-top` padding (desktop) | `50px 50px 50px` |
| `.hero-top` padding (mobile 768px) | `30px 20px 30px` |
| `.hero-painting` width (desktop) | `340px` |
| `.hero-painting` width (mobile 1024px) | `280px` |
| `.hero-painting` width (mobile 768px) | `240px` |
| `.hero-painting` margin (mobile) | `0 auto 24px` |
| Frame `::before` inset | `-6px`, border-radius `20px` |
| Frame `::after` inset | `-12px`, border-radius `24px` |
