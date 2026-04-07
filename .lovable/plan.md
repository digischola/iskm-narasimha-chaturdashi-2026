

## Plan: Kavacha Section, Stats Fix, Significance Image, Schedule Update, Logo Link

### 1. Add Nṛsiṁha Kavacha sales section
New `KavachaSection` component placed after `Seva` and before `Volunteer` in the LandingPage. Styled as a product highlight card with:
- Title: "Silver Nṛsiṁha Kavacha"
- Description text as provided
- Pricing: ~~$351~~ **$281.80** (special price)
- "Shop Now" button linking to `https://srikrishnamandir.org`
- Styled consistently with the existing seva/editorial sections

### 2. Link logo and brand name to srikrishnamandir.org
Update the `Navbar` component (line 84): change the `<a href="#">` on `.nav-brand` to `<a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer">`.

### 3. Fix Stats data (line 367-368)
- Targets: `[14, 500, 50, 30]` → `[50, 500, 50, 30]`
- Labels: `"Years of Service"` stays, `"Festivals Celebrated"` → `"Festivals Celebrated Yearly"`

### 4. Update Significance section image
- Copy uploaded `user-uploads://The_Significance-2.jpg` to `public/images/the-significance.jpg`
- Update `.editorial-visual` CSS in `src/index.css`: change from portrait/vertical aspect ratio to landscape/rectangular (e.g. `aspect-ratio: 16/10`, `max-height` adjustment)

### 5. Update Schedule timings (lines 517-518)
- Cultural Programme: `8:00 – 8:45 PM` → `8:00 – 10:00 PM`
- Prasādam: `8:45 PM` → `8:30 PM`

### Files Modified
- `src/App.tsx` — new KavachaSection component, navbar link, stats fix, schedule times
- `src/index.css` — kavacha section styles, editorial-visual landscape orientation
- `public/images/the-significance.jpg` — replaced with uploaded image

