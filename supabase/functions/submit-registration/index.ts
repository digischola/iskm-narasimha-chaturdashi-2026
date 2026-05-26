import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

/**
 * Multi-event registration handler.
 * Accepts optional `event_slug` to dispatch to the right table + confirmation email.
 * Default (no slug) = Narasimha Caturdasi (registrations table).
 */

interface EventConfig {
  table: string;
  confirmationFn: string;
  phoneRequired: boolean;
}

const EVENT_CONFIGS: Record<string, EventConfig> = {
  default: {
    table: "registrations",
    confirmationFn: "send-nc-confirmation",
    phoneRequired: true,
  },
  ratha_yatra_2026: {
    table: "ratha_yatra_registrations",
    confirmationFn: "send-rathayatra-confirmation",
    phoneRequired: true,
  },
  kids_ratha_yatra_2026: {
    table: "kids_ratha_yatra_registrations",
    confirmationFn: "send-kry-confirmation",
    phoneRequired: true,
  },
};

// Tables that use split adults/kids counts instead of a single attendees integer.
const ADULTS_KIDS_TABLES = new Set(["kids_ratha_yatra_registrations"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const eventSlug = typeof body.event_slug === "string" ? body.event_slug : "default";
    const config = EVENT_CONFIGS[eventSlug] || EVENT_CONFIGS["default"];

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
    const rawPhone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";
    const phone = rawPhone ? rawPhone.replace(/[\s\-().]/g, "") : "";

    const phoneOptional = body.phone_optional === true;

    if (config.phoneRequired && !phoneOptional) {
      if (!phone || !/^\+\d{8,15}$/.test(phone)) {
        return new Response(JSON.stringify({ error: "Valid phone number is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for duplicate email
    const { data: emailMatch } = await supabase
      .from(config.table)
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
        .from(config.table)
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

    // Generate registration ID for tracking
    const registrationId = crypto.randomUUID();

    const insertData: Record<string, unknown> = {
      id: registrationId,
      name,
      email,
      phone: phone || null,
    };

    if (ADULTS_KIDS_TABLES.has(config.table)) {
      const adults = Math.min(Math.max(parseInt(body.adults) || 1, 0), 20);
      const kids = Math.min(Math.max(parseInt(body.kids) || 0, 0), 20);
      insertData.adults = adults;
      insertData.kids = kids;
      if (typeof body.source === "string" && body.source.trim()) {
        insertData.source = body.source.trim().slice(0, 255);
      }
    } else {
      insertData.attendees = attendees;
    }

    // Only include is_volunteer if the table supports it
    if (typeof body.is_volunteer === "boolean") {
      insertData.is_volunteer = body.is_volunteer;
    }

    const { error } = await supabase.from(config.table).insert(insertData);

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to save registration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Trigger confirmation email (fire and forget)
    try {
      await supabase.functions.invoke(config.confirmationFn, {
        body: {
          registration_id: registrationId,
          name,
          email,
        },
      });
    } catch (emailErr) {
      console.error("Failed to trigger confirmation email:", emailErr);
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
