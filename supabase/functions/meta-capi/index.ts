import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

const PIXEL_ID = "584081669242535";
const CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const accessToken = Deno.env.get("META_CAPI_ACCESS_TOKEN");
  if (!accessToken) {
    console.error("META_CAPI_ACCESS_TOKEN not configured");
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      event_name,
      event_id,
      event_time,
      user_email,
      user_phone,
      source_url,
      custom_data,
    } = body;

    if (!event_name || !event_id) {
      return new Response(JSON.stringify({ error: "event_name and event_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Hash user data for CAPI (SHA-256)
    const hashValue = async (val: string) => {
      const data = new TextEncoder().encode(val.trim().toLowerCase());
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    };

    const userData: Record<string, string> = {};
    if (user_email) userData.em = [await hashValue(user_email)];
    if (user_phone) userData.ph = [await hashValue(user_phone)];

    const eventData = {
      data: [
        {
          event_name,
          event_id,
          event_time: event_time || Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: source_url || "https://narasimha-caturdasi-2026.lovable.app",
          user_data: userData,
          custom_data: custom_data || {},
        },
      ],
    };

    const res = await fetch(`${CAPI_URL}?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Meta CAPI error:", JSON.stringify(result));
      return new Response(JSON.stringify({ error: "CAPI request failed", details: result }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Meta CAPI error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
