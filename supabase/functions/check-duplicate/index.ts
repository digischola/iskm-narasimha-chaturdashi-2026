import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

/**
 * Duplicate check for any of the 3 registration tables.
 * Body: { field: "email" | "phone", value: string, table?: "nc" | "slf" | "prasadam" }
 * - `nc` (default): checks `registrations`
 * - `slf`: checks `slf_registrations`
 * - `prasadam`: checks `prasadam_sponsorships`
 *
 * Cross-table matches are NOT treated as duplicates — each table is independent.
 */

const TABLE_MAP: Record<string, string> = {
  nc: "registrations",
  slf: "slf_registrations",
  prasadam: "prasadam_sponsorships",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const field = body.field;
    const value = typeof body.value === "string" ? body.value.trim() : "";
    const tableKey = typeof body.table === "string" ? body.table : "nc";
    const table = TABLE_MAP[tableKey];

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
