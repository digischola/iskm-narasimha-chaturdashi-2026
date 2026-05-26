# Step-by-step: get this page in front of Lovable

You have two paths. Pick the one that matches how you usually work with Lovable.

---

## Path A — Push a branch to GitHub, then prompt Lovable to integrate (recommended)

This puts the design handoff in the repo as a reference Lovable can read, then Lovable does the actual integration in a normal feature branch / PR cycle.

### 1. Clone the existing Lovable repo locally (one-time)

```bash
# Replace with your actual GitHub remote
git clone git@github.com:<your-org>/iskm-events.git
cd iskm-events
```

### 2. Create the feature branch

```bash
git checkout main
git pull
git checkout -b feat/kids-ratha-yatra-2026
```

### 3. Drop in the design handoff

```bash
mkdir -p _design-handoff/kids-ratha-yatra-2026
cp -R "~/Desktop/Sri Krishna Mandir/Kids Ratha Yatra/Landing Page/." \
      _design-handoff/kids-ratha-yatra-2026/
```

### 4. Commit + push

```bash
git add _design-handoff/kids-ratha-yatra-2026
git commit -m "feat(kry): add design handoff for Kids Ratha Yatra 2026 landing page"
git push -u origin feat/kids-ratha-yatra-2026
```

### 5. Open Lovable, switch to the branch

In Lovable: **Project Settings → GitHub → Branch → `feat/kids-ratha-yatra-2026`**.

### 6. Paste the prompt from `LOVABLE_PROMPT.md` into Lovable's chat

Lovable will read `INTEGRATION_BRIEF.md`, generate the migration, edit the edge functions, build the new page, and commit each step back to the same branch. Watch the chat — it'll ask you to confirm the migration before applying it to Supabase.

### 7. Review the PR Lovable opens

When Lovable has finished and opened a PR from `feat/kids-ratha-yatra-2026` → `main`, review:
- The migration SQL (compare against `INTEGRATION_BRIEF.md` §4)
- The new `KidsRathaYatra.tsx` (compare visual against the standalone `index.html` in a side-by-side browser)
- Each modified edge function (only adds to maps, no deletes)
- The three new email functions (subject lines + body copy match the kids festival voice)

Run through the **Testing checklist** at the bottom of `INTEGRATION_BRIEF.md` before merging.

### 8. Merge to `main` → Lovable auto-deploys to `events.srikrishnamandir.org`

---

## Path B — Skip the branch, just drive Lovable from chat

Faster if you trust Lovable to do the conversion in one pass. Lower auditability.

### 1. Upload the standalone files into Lovable's "Knowledge" / context panel

Lovable lets you attach reference files to a conversation. Upload:
- `index.html`
- `colors_and_type.css`
- `INTEGRATION_BRIEF.md`
- A couple of the key images (hero, conch, samosa, pizza, souvenir) for visual context

### 2. Paste the prompt from `LOVABLE_PROMPT.md`

Lovable will work in its standard branch model (usually `lovable/main` or similar) and you'll get the same PR at the end.

### 3. Manually copy the 23 production images + 2 videos to `public/` after Lovable's done

Lovable's web UI doesn't always handle large binary uploads well. After Lovable has set up the page + asset references, you may need to pull the branch locally and `cp -R` the images / videos into `public/images/kids-ratha-yatra/` and `public/videos/kids-ratha-yatra/`, then push. The brief calls out the exact target paths.

---

## What to expect from Lovable

- **Time:** 15–40 minutes of generation depending on how busy the model is. The bulk is the new `KidsRathaYatra.tsx` (~1,500–1,800 lines once expanded into a proper React component) and the three new email functions.
- **Cost:** counts toward your Lovable monthly credit. The brief is pre-digested so it should be a single multi-step conversation, not a back-and-forth.
- **Quality control:** Lovable will get the migration, route, and edge function updates right almost every time. The thing to watch is the React conversion — make sure it preserves the **mobile breakpoints** (`@media (max-width: 980px)` and `(max-width: 640px)`) and the **`prefers-reduced-motion`** rules. Both are in the standalone CSS.

## If Lovable gets stuck

- Drop the relevant section from `INTEGRATION_BRIEF.md` into chat as a follow-up prompt.
- For visual issues, screenshot the standalone `index.html` and Lovable's output side-by-side and ask Lovable to match the standalone.
- For Supabase issues, paste the migration error directly — Lovable will fix the SQL.

## After ship

- First registration: do it yourself with a real phone, verify the email arrives, the Wabo entry shows up, and Pixel Helper logs `ViewContent` + `Lead`.
- Then enable the marketing campaign you've been planning (the brief mentions a 1-month window, 27 May → 27 June).
- Live counter: the standalone page had a "84 families already registered" pill that we removed in round 3. If you want to add it back later, the existing pattern from `RathaYatra.tsx` shows how (it polls the registrations table).
