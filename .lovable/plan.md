## Part 1 — Data hygiene check on admin metrics

I queried the live data backing the admin dashboard. Findings:

### ✅ Rendering correctly
- **Email send log dedup** (latest-status-per-message_id) is working: 296 NC, 1043 RY, 70 WLF/SLF, 1 Prasadam unique sends.
- **Calendar Saves** count (overall = 117 clicks) matches `email_tracking_events` where `link_name = 'calendar'`.
- **Per-event open / click bucketing** by `email_type` prefix matches the data:
  - NC (`confirmation`/`reminder`/`nc-…`) → 166 unique opens / 296 sent → ~56% open rate ✅
  - RY (`ry-…`, including legacy `ry-confirm` + new `ry-confirmation`) → 521 unique opens / 1043 sent → ~50% ✅
  - WLF/SLF (`wlf-…` + `slf-…`) → ~26 unique opens / 70 sent → ~37% ✅
  - Prasadam → 1/1 ✅
- **Date column** for WLF (Sat/Sun) renders correctly after the recent SGT fix.

### ⚠️ Minor issues worth fixing while we're in there
1. **Open rate denominator slightly off**: `openRate = uniqueOpens(by recipient) / sent(messages)`. If a recipient receives multiple emails (e.g. confirmation + reminder), the unique-recipient numerator can never reach the message-count denominator, so rate is artificially depressed. Fix: divide unique opens by unique recipients sent to.
2. **NC sent fallback (line 350-351)** uses a JS `||` over a `0` — currently happens to work because `nc-` prefix matches, but it's fragile. Replace with an explicit prefix check.
3. **Inconsistent `email_type` values in tracking pixel**: RY emails have logged both `ry-confirm` and `ry-confirmation`. Both currently match the `ry-` filter so it doesn't break stats, but worth normalizing the pixel param in `send-rathayatra-confirmation` to `ry-confirmation` for consistency. (1 stray `ry-confirmation` row vs 974 `ry-confirm`.)
4. **`unknown` email_type** (1 click) — harmless, just a stale tracking link.
5. **Calendar Saves per-event** counts raw clicks (not unique recipients). Showing both "Total saves" and "Unique savers" would be more useful, but the current number isn't wrong — just coarse.

None of these are breaking the dashboard. (1) and (2) are the only ones I'd actually change in code.

---

## Part 2 — Add filters to Registration Logs page

Currently the Registration Logs page only has event tabs (NC / RY / WLF / Prasadam) plus the global header search. Add inline filters above the table that change based on the active event tab:

### Filters to add

**Always visible (all event tabs):**
- **Search** (already exists in header — keep) — name / email
- **Date range** for `created_at` (presets: Last 24h, 7 days, 30 days, All; plus optional custom range)

**Weekend Love Feast tab only:**
- **Day filter**: All · Saturday · Sunday (filters by `attendance_date` weekday in SGT, using the same noon-SGT parsing as the column renderer to avoid the off-by-one)
- **First time filter**: All · First-timers · Returning
- **Attendance date** dropdown: list of distinct upcoming `attendance_date` values from the data, so admin can pick "this Saturday's list"

**Nṛsiṁha & Ratha Yātrā tabs:**
- **Confirmation sent**: All · Sent · Not sent
- **Volunteer**: All · Volunteers · Attendees only

**Prasadam tab:** keep existing status filter as-is.

### Layout
A single `admin-filter-row` strip directly under the event tabs, with the relevant filter chips/dropdowns for that tab. Clearing filters resets to page 1. Total count in the table header reflects the filtered result.

### Technical notes
- All filtering is client-side over already-fetched arrays (`ncData`, `ryData`, `slfData`, `prasadamData`) — no schema or edge-function changes.
- WLF day calculation must use `new Date(attendance_date + "T12:00:00+08:00").getDay()` to stay consistent with the column.
- New state hooks: `regDateRange`, `slfDayFilter`, `slfFirstTimeFilter`, `slfDateFilter`, `regConfFilter`, `regVolFilter`. Reset to defaults when switching tabs.
- Files touched: `src/pages/Admin.tsx` only (plus minor styles in `src/pages/admin/AdminStyles.css` for the filter row).

### Optional follow-ups (not in this plan unless you want them)
- Fix open-rate denominator (item 1 above)
- Normalize `ry-confirm` → `ry-confirmation` in the tracking pixel
- Add "unique calendar savers" alongside total saves

Tell me if you want any of the optional fixes folded in, otherwise I'll proceed with Part 2 only.