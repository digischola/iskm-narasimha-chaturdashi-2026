import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Validate required fields
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!name || name.length < 2 || name.length > 255) {
      return new Response(JSON.stringify({ error: "Valid name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const attendees = Math.min(Math.max(parseInt(body.attendees) || 1, 1), 20);
    const rawPhone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : null;
    // Validate phone: must be + followed by 8-15 digits
    const phone = rawPhone && /^\+\d{8,15}$/.test(rawPhone.replace(/[\s\-().]/g, "")) ? rawPhone.replace(/[\s\-().]/g, "") : (rawPhone ? null : null);
    if (rawPhone && !phone) {
      return new Response(JSON.stringify({ error: "Invalid phone number format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check for duplicate email
    const { data: emailMatch } = await supabase
      .from("registrations")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (emailMatch) {
      return new Response(JSON.stringify({ success: false, error: "This email has already been registered" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for duplicate phone (if provided)
    if (phone) {
      const { data: phoneMatch } = await supabase
        .from("registrations")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (phoneMatch) {
        return new Response(JSON.stringify({ success: false, error: "This phone number has already been registered" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { error } = await supabase.from("registrations").insert({
      name,
      email,
      phone,
      attendees,
    });

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to save registration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
