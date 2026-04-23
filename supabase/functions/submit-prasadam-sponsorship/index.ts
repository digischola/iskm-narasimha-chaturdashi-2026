import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

/**
 * Server-side validation, dup checks, and insert for Free Prasadam Program sponsorships.
 * Body: {
 *   full_name, email, country_code, phone, preferred_date,
 *   tier, occasion?, dedication?
 * }
 *
 * On success: triggers send-prasadam-confirmation (fire-and-forget).
 * Returns { success: true, sponsorship_id, ref } so the form can show a reference number.
 */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const countryCode = typeof body.country_code === "string" ? body.country_code.trim() : "";
    const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
    const preferredDate = typeof body.preferred_date === "string" ? body.preferred_date.trim() : "";
    const tier = typeof body.tier === "string" ? body.tier.trim() : "";
    const occasion = typeof body.occasion === "string" && body.occasion.trim() ? body.occasion.trim() : null;
    const dedication = typeof body.dedication === "string" && body.dedication.trim() ? body.dedication.trim().slice(0, 1000) : null;

    if (!fullName || fullName.length < 2 || fullName.length > 255) {
      return new Response(JSON.stringify({ error: "Valid full name is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!countryCode || !/^\+\d{1,4}$/.test(countryCode)) {
      return new Response(JSON.stringify({ error: "Valid country code is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const phone = rawPhone.replace(/[\s\-().]/g, "");
    if (!phone || !/^\d{4,15}$/.test(phone)) {
      return new Response(JSON.stringify({ error: "Valid phone number is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const totalDigits = countryCode.replace(/\D/g, "").length + phone.length;
    if (totalDigits < 8 || totalDigits > 15) {
      return new Response(JSON.stringify({ error: "Phone number must be 8–15 digits including country code" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return new Response(JSON.stringify({ error: "Valid preferred date is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!tier || (tier !== "weekday-300" && tier !== "sunday-500")) {
      return new Response(JSON.stringify({ error: "Valid tier is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Duplicate checks (within prasadam_sponsorships only)
    const { data: emailMatch } = await supabase
      .from("prasadam_sponsorships")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (emailMatch) {
      return new Response(
        JSON.stringify({ success: false, error: "This email has already submitted a sponsorship" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: phoneMatch } = await supabase
      .from("prasadam_sponsorships")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (phoneMatch) {
      return new Response(
        JSON.stringify({ success: false, error: "This phone number has already submitted a sponsorship" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const sponsorshipId = crypto.randomUUID();
    const { error } = await supabase.from("prasadam_sponsorships").insert({
      id: sponsorshipId,
      full_name: fullName,
      email,
      country_code: countryCode,
      phone,
      preferred_date: preferredDate,
      tier,
      occasion,
      dedication,
      email_needs_backfill: false,
      phone_needs_verification: false,
    });

    if (error) {
      console.error("submit-prasadam-sponsorship insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to save sponsorship. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const refId = sponsorshipId.split("-")[0].toUpperCase();

    // Fire-and-forget confirmation email
    try {
      await supabase.functions.invoke("send-prasadam-confirmation", {
        body: {
          sponsorship_id: sponsorshipId,
          full_name: fullName,
          email,
          tier,
          preferred_date: preferredDate,
          occasion,
          dedication,
        },
      });
    } catch (emailErr) {
      console.error("Failed to trigger prasadam confirmation email:", emailErr);
    }

    return new Response(
      JSON.stringify({ success: true, sponsorship_id: sponsorshipId, ref: refId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("submit-prasadam-sponsorship error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
