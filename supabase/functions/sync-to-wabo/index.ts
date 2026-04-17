import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, country_code, phone, attendees } = await req.json();

    const cc = String(country_code || "").replace(/\D/g, "");
    const ph = String(phone || "").replace(/\D/g, "");
    const mobile_phone_number = cc + ph;

    const wabo_token = Deno.env.get("WABO_API_KEY");
    if (!wabo_token) {
      console.error("WABO_API_KEY secret is missing");
      return new Response(JSON.stringify({ ok: false, reason: "missing_secret" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = {
      name: name || "",
      mobile_phone_number,
      email: email || "",
      source: "Nrsimha Caturdasi 2026 - Landing Page",
      nrsimhachaturdasi2026: "yes",
      pax: String(attendees || ""),
    };

    const resp = await fetch(
      "https://api-core.geta.ai/api/v1/workspace/contacts/submit-contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "geta-host": wabo_token,
        },
        body: JSON.stringify(payload),
      }
    );

    const body = await resp.text();
    console.log(`Wabo response: ${resp.status} ${body}`);

    return new Response(
      JSON.stringify({ ok: resp.ok, wabo_status: resp.status, wabo_body: body }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("sync-to-wabo error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
