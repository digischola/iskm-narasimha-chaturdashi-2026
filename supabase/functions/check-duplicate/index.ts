import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

/**
 * Duplicate check for any registration table.
 * Body: { field: "email" | "phone", value: string, table?: string, event_slug?: string }
 * - `table` (legacy): "nc" | "slf" | "prasadam"
 * - `event_slug` (new): "ratha_yatra_2026" etc. — takes precedence over `table`
 */

const TABLE_MAP: Record<string, string> = {
  nc: "registrations",
  slf: "weekend_love_feast_registrations",
  prasadam: "prasadam_sponsorships",
};

const SLUG_TABLE_MAP: Record<string, string> = {
  ratha_yatra_2026: "ratha_yatra_registrations",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const field = body.field;
    const value = typeof body.value === "string" ? body.value.trim() : "";

    // Resolve table: event_slug takes priority, then table param, default to "nc"
    let table: string | undefined;
    if (typeof body.event_slug === "string" && SLUG_TABLE_MAP[body.event_slug]) {
      table = SLUG_TABLE_MAP[body.event_slug];
    } else {
      const tableKey = typeof body.table === "string" ? body.table : "nc";
      table = TABLE_MAP[tableKey];
    }

    if (!table || !field || !value || (field !== "email" && field !== "phone")) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data } = await supabase
      .from(table)
      .select("id")
      .eq(field, value)
      .maybeSingle();

    return new Response(JSON.stringify({ exists: !!data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("check-duplicate error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
