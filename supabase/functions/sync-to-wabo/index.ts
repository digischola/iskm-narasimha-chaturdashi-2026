const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { success: false, error: "Method not allowed" });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const countryCode = typeof body.country_code === "string" ? body.country_code : "";
    const phone = typeof body.phone === "string" ? body.phone : "";
    const attendeesRaw = body.attendees;

    if (!name || !email) {
      return json(400, { success: false, error: "name and email are required" });
    }

    // Normalise phone: strip "+" from country code, strip non-digits from phone, concatenate
    const cc = countryCode.replace(/\D/g, "");
    const ph = phone.replace(/\D/g, "");
    const mobile_phone_number = `${cc}${ph}`;

    const pax = typeof attendeesRaw === "string" ? attendeesRaw : String(attendeesRaw ?? "");

    const apiKey = Deno.env.get("WABO_API_KEY");
    if (!apiKey) {
      console.error("WABO_API_KEY is not set");
      return json(200, { success: false, error: "Wabo not configured" });
    }

    const wabPayload = {
      name,
      mobile_phone_number,
      email,
      source: "Nrsimha Caturdasi 2026 - Landing Page",
      nrsimhachaturdasi2026: "yes",
      pax,
    };

    try {
      const res = await fetch(
        "https://api-core.geta.ai/api/v1/workspace/contacts/submit-contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "geta-host": apiKey,
          },
          body: JSON.stringify(wabPayload),
        },
      );
      const text = await res.text();
      console.log("Wabo response:", res.status, text);

      if (!res.ok) {
        return json(200, {
          success: false,
          error: `Wabo returned ${res.status}`,
          wabo_status: res.status,
          wabo_body: text,
        });
      }

      return json(200, { success: true, wabo_status: res.status });
    } catch (waboErr) {
      console.error("Wabo fetch failed:", waboErr);
      return json(200, { success: false, error: "Wabo request failed" });
    }
  } catch (err) {
    console.error("sync-to-wabo error:", err);
    return json(200, { success: false, error: "Internal error" });
  }
});
