import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Generalised Wabo CRM sync.
 * Body shape:
 * {
 *   event_slug: "nrsimhachaturdasi2026" | "sunday_love_feast" | "prasadam_sponsor",
 *   source: string,
 *   name: string,
 *   email?: string,
 *   country_code: string, // e.g. "+65"
 *   phone: string,        // local part (digits only or with separators)
 *   attendees?: string | number, // optional; sent as `attendees`
 *   extras?: Record<string, string | number | boolean | null>, // top-level Wabo keys (must be in whitelist)
 * }
 *
 * Whitelisted Wabo custom-field keys (no others allowed):
 *   nrsimhachaturdasi2026, weekend_love_feast, prasadam_sponsor,
 *   attendees, tier, preferred_date, occasion, wlf_attendance_date, wlf_attendance_day
 *
 * Auth: only `geta-host` header with WABO_API_KEY secret. No Authorization header.
 * Fire-and-forget — non-200 logs only, never blocks UX.
 */

const ALLOWED_EVENT_SLUGS = new Set([
  "nrsimhachaturdasi2026",
  "weekend_love_feast",
  "prasadam_sponsor",
]);

const ALLOWED_EXTRA_KEYS = new Set([
  "tier",
  "preferred_date",
  "occasion",
  "wlf_attendance_date",
  "wlf_attendance_day",
  "wlf_attendees",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      event_slug,
      source,
      name,
      email,
      country_code,
      phone,
      attendees,
      extras,
    } = body || {};

    if (!event_slug || !ALLOWED_EVENT_SLUGS.has(event_slug)) {
      console.error("sync-to-wabo: invalid or missing event_slug:", event_slug);
      return new Response(
        JSON.stringify({ ok: false, reason: "invalid_event_slug" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!source || typeof source !== "string") {
      console.error("sync-to-wabo: missing source string");
      return new Response(
        JSON.stringify({ ok: false, reason: "missing_source" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const wabo_token = Deno.env.get("WABO_API_KEY");
    if (!wabo_token) {
      console.error("sync-to-wabo: WABO_API_KEY secret is missing");
      return new Response(
        JSON.stringify({ ok: false, reason: "missing_secret" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const cc = String(country_code || "").replace(/\D/g, "");
    const ph = String(phone || "").replace(/\D/g, "");
    const mobile_phone_number = cc + ph;

    // Build payload — explicit fields first, then event_slug=yes, then optional attendees + whitelisted extras
    const payload: Record<string, string | number> = {
      name: String(name || ""),
      mobile_phone_number,
      email: String(email || ""),
      source,
      [event_slug]: "yes",
    };

    // Spread extras using only whitelisted keys
    if (extras && typeof extras === "object") {
      for (const [k, v] of Object.entries(extras)) {
        if (!ALLOWED_EXTRA_KEYS.has(k)) {
          console.warn(`sync-to-wabo: dropping non-whitelisted extra key "${k}"`);
          continue;
        }
        if (v === undefined || v === null) continue;
        payload[k] = String(v);
      }
    }

    console.log(
      `sync-to-wabo: sending event_slug=${event_slug}, keys=${JSON.stringify(Object.keys(payload))}`,
    );

    const resp = await fetch(
      "https://api-core.geta.ai/api/v1/workspace/contacts/submit-contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "geta-host": wabo_token,
        },
        body: JSON.stringify(payload),
      },
    );

    const body_text = await resp.text();
    console.log(`sync-to-wabo response: ${resp.status} ${body_text}`);

    return new Response(
      JSON.stringify({ ok: resp.ok, wabo_status: resp.status, wabo_body: body_text }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("sync-to-wabo error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
