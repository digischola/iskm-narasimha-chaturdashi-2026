
The user wants to rotate the `WABO_API_KEY` secret. No code changes — just delete the existing secret and prompt for a new value via the secure secrets input.

## Plan

1. Delete the existing `WABO_API_KEY` runtime secret from the Supabase project.
2. Prompt for a fresh `WABO_API_KEY` value via the secure `add_secret` input so the 152-char token can be pasted directly.
3. Confirm once saved. No edge function or frontend code will be touched — `sync-to-wabo` already reads `Deno.env.get("WABO_API_KEY")`, so it will pick up the new value automatically on next invocation.

No schema changes, no migrations, no file edits.
