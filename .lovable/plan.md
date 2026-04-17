

## Incorrect URLs to fix

The canonical URL is `https://events.srikrishnamandir.org/nrsimha-caturdasi-2026`. Found these wrong references:

**`src/App.tsx` — ShareSection (lines 723, 729, 737, 738):**
1. `copyLink()` copies `srikrishnamandir.org/festival/...`
2. `openGoogleCalendar()` includes `srikrishnamandir.org/festival/...` in details
3. WhatsApp share link → `srikrishnamandir.org/festival/...`
4. Telegram share link → `srikrishnamandir.org/festival/...`

**`src/App.tsx` — RegistrationForm success screen (line 293):**
5. Post-registration "Add to Google Calendar" details link points to `https://narasimha-caturdasi-2026.lovable.app` (old Lovable preview URL).

**`supabase/functions/meta-capi/index.ts` (line 59):**
6. `event_source_url` fallback uses old `narasimha-caturdasi-2026.lovable.app` — server-only, but should match canonical domain for clean attribution.

**Verified clean** (already use correct domain): `confirmation.html`, `reminder.html`, `send-nc-reminder/index.ts`, `index.html`.

## Plan

Replace every occurrence above with `https://events.srikrishnamandir.org/nrsimha-caturdasi-2026`:

1. **`src/App.tsx`** — update the 4 share/calendar URLs in `ShareSection` and the post-registration calendar `details` URL in `RegistrationForm`.
2. **`supabase/functions/meta-capi/index.ts`** — update fallback `event_source_url` to canonical domain. Redeploy the edge function so the change takes effect.

No schema, no new files, no logic changes — pure URL string replacements.

<lov-actions>
<lov-suggestion message="Verify share links, calendar, and post-registration screen all open with the correct events.srikrishnamandir.org URL">Verify all links work end-to-end</lov-suggestion>
</lov-actions>

