

## Root cause

Email "Add to Calendar" and "WhatsApp" links go through the `track-email` edge function:
`https://…/track-email?t=c&…&r=<encoded original URL>` → function does `decodeURIComponent(redirect)` → sets that as `Location` header → 302.

The decoded URLs (e.g. `…text=Śrī+Nṛsiṁha+Caturdaśī+2026…`, `…text=Join us for Śrī Nṛsiṁha…`) contain raw multi-byte UTF-8 characters. HTTP header values must be **ByteString (Latin-1)**, so Deno throws:

```
TypeError: Value is not a valid ByteString
   at new Response (… 23_response.js:326)
   at handler (track-email/index.ts:75)
```

Result: every click on a tracked link returns **500 Internal Server Error**.

The function logs confirm this — multiple identical errors at `track-email/index.ts:75` (the `new Response({ Location: … })` line in the deployed version).

## Fix

In `supabase/functions/track-email/index.ts`, sanitize the redirect URL so the `Location` header is always ASCII-safe. Two-line change:

```ts
if (type === "c" && redirect) {
  // Decode once (reverse the encodeURIComponent done by the wrapper),
  // then re-encode any non-ASCII chars so the Location header stays Latin-1 / ByteString-safe.
  const target = encodeURI(decodeURIComponent(redirect));
  return new Response(null, {
    status: 302,
    headers: { Location: target },
  });
}
```

`encodeURI` preserves valid URL structure (`?`, `&`, `=`, `+`, `:`, `/`, `#`) and only percent-encodes characters that would break the header — exactly what's needed.

Then redeploy `track-email`.

## Verification

After redeploy, call the function with a Unicode-laden URL:

```
GET /functions/v1/track-email?t=c&r=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Frender%3Ftext%3D%C5%9Ar%C4%AB
```

Expect a clean **302** with `Location` header containing the percent-encoded URL — no 500, no ByteString error in logs.

## Scope

- Edit: `supabase/functions/track-email/index.ts` (one block, ~3 lines).
- Deploy: `track-email`.
- No frontend changes, no schema changes, no template changes. Existing wrapped links in already-sent emails will start working immediately.

