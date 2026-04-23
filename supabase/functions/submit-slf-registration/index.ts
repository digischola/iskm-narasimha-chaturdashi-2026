import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

/**
 * Sunday Love Feast registration submit.
 * Body: { name, email, phone, country_code?, attendees, first_time }
 *
 * Validates, dedupes (within slf_registrations only), inserts, then fires the
 * confirmation email + Wabo sync (both fire-and-forget).
 */

function getNextSundayIso(): string {
  // Singapore time. If today is Sunday before 19:00 SGT, that Sunday counts;
  // otherwise next Sunday.
  const nowUtc = new Date();
  const sgtOffsetMs = 8 * 60 * 60 * 1000;
  const sgt = new Date(nowUtc.getTime() + sgtOffsetMs);
  const day = sgt.getUTCDay(); // sgt date in UTC fields
  let diff = (7 - day) % 7;
  if (day === 0 && sgt.getUTCHours() < 19) diff = 0;
  if (diff === 0 && day !== 0) diff = 7;
  const target = new Date(sgt.getTime() + diff * 86400000);
  const y = target.getUTCFullYear();
  const m = String(target.getUTCMonth() + 1).padStart(2, "0");
  const d = String(target.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!name || name.length < 2 || name.length > 255) {
      return new Response(JSON.stringify({ error: "Valid name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const attendees = Math.min(Math.max(parseInt(body.attendees) || 1, 1), 20);
    const firstTime = body.first_time === true || body.first_time === "yes";
    const rawPhone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";
    const countryCode = typeof body.country_code === "string" && /^\+\d{1,4}$/.test(body.country_code.trim())
      ? body.country_code.trim()
      : null;

    let phone: string | null = null;
    if (rawPhone) {
      const cleaned = rawPhone.replace(/[\s\-().]/g, "");
      if (!/^\+?\d{8,15}$/.test(cleaned)) {
        return new Response(JSON.stringify({ error: "Invalid phone number format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      phone = cleaned;
    }

    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone number is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: emailMatch } = await supabase
      .from("slf_registrations")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (emailMatch) {
      return new Response(JSON.stringify({ success: false, error: "This email has already been registered" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: phoneMatch } = await supabase
      .from("slf_registrations")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (phoneMatch) {
      return new Response(JSON.stringify({ success: false, error: "This phone number has already been registered" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const registrationId = crypto.randomUUID();
    const { error } = await supabase.from("slf_registrations").insert({
      id: registrationId,
      name,
      email,
      phone,
      country_code: countryCode,
      attendees,
      first_time: firstTime,
    });

    if (error) {
      console.error("submit-slf-registration insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to save registration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const eventDateIso = getNextSundayIso();

    // Fire-and-forget confirmation email
    try {
      await supabase.functions.invoke("send-slf-confirmation", {
        body: {
          registration_id: registrationId,
          name,
          email,
          attendees,
          event_date_iso: eventDateIso,
        },
      });
    } catch (emailErr) {
      console.error("Failed to trigger SLF confirmation email:", emailErr);
    }

    // Fire-and-forget Wabo sync (no pax for SLF per spec)
    try {
      await supabase.functions.invoke("sync-to-wabo", {
        body: {
          event_slug: "sunday_love_feast",
          source: "Sunday Love Feast - Landing Page",
          name,
          email,
          country_code: countryCode || "+65",
          phone,
        },
      });
    } catch (waboErr) {
      console.error("Wabo sync error (SLF):", waboErr);
    }

    const { count } = await supabase
      .from("slf_registrations")
      .select("*", { count: "exact", head: true });

    return new Response(JSON.stringify({ success: true, count: count || 0, event_date: eventDateIso }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-slf-registration error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
