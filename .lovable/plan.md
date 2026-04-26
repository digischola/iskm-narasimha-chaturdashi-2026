## Goal

Replace the always-visible 2-month calendar grid with an **inline collapsible date field** that matches the other SLF form inputs. Click the field → calendar expands inline within the form (pushing content below it down, no popover/modal). Pick a Sunday → calendar collapses → field text updates.

## Visual & Interaction

```text
┌─────────────────────────────────────────┐
│ Choose Date *                           │
│ ┌─────────────────────────────────┐ ▼   │
│ │ Sunday, 26 Apr 2026 (this Sun.) │     │  ← looks like other inputs
│ └─────────────────────────────────┘     │
└─────────────────────────────────────────┘
       ↓ click ↓
┌─────────────────────────────────────────┐
│ Choose Date *                           │
│ ┌─────────────────────────────────┐ ▲   │
│ │ Sunday, 26 Apr 2026             │     │
│ └─────────────────────────────────┘     │
│ ┌─────────────────────────────────────┐ │
│ │  ‹     April 2026              ›    │ │  ← inline, in form flow
│ │  S  M  T  W  T  F  S                │ │
│ │  ...     [26]  ...                  │ │  ← only Sundays clickable
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│ (next form row pushed down)             │
└─────────────────────────────────────────┘
```

- Closed state: a single field that visually matches the Name/Email/Phone inputs, with a small chevron on the right and the selected Sunday formatted as readable text.
- Click anywhere on the field → toggles open. Click chevron → toggles open. Click outside or pick a date → closes.
- Open state: a compact 1-month calendar appears **inside the form column**, pushing the rows beneath it down. No portal, no `position: absolute`, no shadcn Popover.
- Month header has small `‹` / `›` arrows to step months. Disabled when there are no eligible Sundays in the prev/next month.
- Sundays within the next ~31 days = clickable + highlighted in gold.
- All other days = greyed, non-clickable.
- Past Sundays and Sundays beyond ~31 days = visible but disabled.
- Selecting a Sunday immediately collapses the calendar and updates the field text.

## Scope

Only `src/pages/SundayLoveFeast.tsx` and `src/pages/SundayLoveFeast.css`. No DB / edge function changes — `attendance_date` ISO submission, validation, email, and Wabo sync are already correct.

## Implementation Details

1. **Remove** the always-open 2-month grid markup (`<div className="slf-cal">…calendarMonths.map…`) and the `buildCalendarMonths` helper output's full-window rendering.
2. **Add** state: `const [calOpen, setCalOpen] = useState(false)` and `const [calCursor, setCalCursor] = useState<{y:number; m:number}>(...)` initialised to the month of the default Sunday.
3. **Reuse** `eligibleIsoSet` (already built from `sundayOptions`) to decide which dates are clickable.
4. **Render**:
   - A button styled like an `input` (same height, border, padding, font as `.slf .form-group input`) showing the formatted selected Sunday + chevron icon. `aria-expanded={calOpen}`.
   - When `calOpen`, render a single-month `.slf-cal-inline` block immediately after the trigger (sibling div inside the same `.form-group`), in normal document flow.
   - Header row: `‹ Month YYYY ›` — prev/next buttons disabled when stepping outside the eligible month range.
   - Weekday header `S M T W T F S` (Sunday in gold).
   - Day grid: only `isSunday && isEligible && !isPast` cells get the selectable styling; all other cells render as plain greyed numbers.
   - On select: `setFormAttendanceDate(iso); setCalOpen(false);`.
5. **Outside-click close**: `useEffect` listening to `mousedown` on `document`, closing if click target is outside the wrapper `ref`.
6. **Keyboard**: `Escape` closes; `Enter`/`Space` on the trigger toggles.
7. **CSS** (`SundayLoveFeast.css`):
   - `.slf-cal-trigger` — same look as `.slf .form-group input` (border, radius, padding, font, color), with flex layout for text + chevron.
   - `.slf-cal-trigger[aria-expanded="true"]` — focused border colour.
   - `.slf-cal-inline` — replaces current `.slf-cal`; `margin-top: 8px`, no shadow/popover styling, fits within form column. Drop the old `max-width: 360px` and let it span the form column width.
   - `.slf-cal-nav` — month header row with prev/next icon buttons.
   - Keep existing `.slf-cal-cell` styling for selectable / selected / disabled / Sunday colouring; just removed from inside the always-open container.
   - Mobile: full width, slightly smaller cell font.
8. **Cleanup**: remove `selectedSundayLabel` extra line below (it's now redundant — the trigger itself shows it). Remove unused `calendarMonths` ref / helper if no longer referenced.

## Out of Scope

- No changes to countdown, hero, testimonials, glimpses, edge functions, DB schema, Wabo sync, confirmation email, or admin dashboard.
- No shadcn Popover / Dialog / Calendar component (keeps the page self-contained and matches existing inline styling).

## Test Checklist (≤2 min)

1. Field shows "Sunday, 26 Apr 2026 (this Sunday)" by default and looks like the other input fields.
2. Click field → calendar expands inline, form rows below shift down, no overlay.
3. Only the Sundays within the next ~31 days are gold/clickable. All other days greyed.
4. Click a different Sunday → calendar closes, field text updates to that date.
5. Click `›` → next month shows; if no eligible Sundays remain, `›` is disabled.
6. Click outside the field/calendar → closes.
7. Submit form → `attendance_date` in DB and Wabo `slf_attendance_date` reflect the picked Sunday.
