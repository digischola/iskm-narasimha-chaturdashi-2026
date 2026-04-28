import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

/**
 * Weekend Love Feast registration submit.
 * Body: { name, email, phone, country_code?, attendees, first_time, attendance_date }
 *
 * attendance_date: required, ISO yyyy-mm-dd, must be a Saturday OR Sunday in SGT and not in the past.
 */

const SGT_OFFSET_MS = 8 * 60 * 60 * 1000;

/** Validate yyyy-mm-dd is a Saturday or Sunday in SGT, not in the past, within ~120 days. */
function validateAttendanceDate(iso: string): { ok: boolean; reason?: string; dayName?: "Saturday" | "Sunday" } {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return { ok: false, reason: "Please choose a valid date." };
  }
  const picked = new Date(iso + "T00:00:00+08:00");
  if (Number.isNaN(picked.getTime())) {
    return { ok: false, reason: "Please choose a valid date." };
  }
  const sgt = new Date(picked.getTime() + SGT_OFFSET_MS);
  const dow = sgt.getUTCDay();
  if (dow !== 0 && dow !== 6) {
    return { ok: false, reason: "Please choose a Saturday or Sunday." };
  }
  const nowSgt = new Date(Date.now() + SGT_OFFSET_MS);
  const todayMidnightSgt = Date.UTC(nowSgt.getUTCFullYear(), nowSgt.getUTCMonth(), nowSgt.getUTCDate());
  const pickedMidnightSgt = Date.UTC(sgt.getUTCFullYear(), sgt.getUTCMonth(), sgt.getUTCDate());
  if (pickedMidnightSgt < todayMidnightSgt) {
    return { ok: false, reason: "Date cannot be in the past." };
  }
  if ((pickedMidnightSgt - todayMidnightSgt) / 86400000 > 120) {
    return { ok: false, reason: "Date is too far in the future." };
  }
  return { ok: true, dayName: dow === 6 ? "Saturday" : "Sunday" };
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
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const attendees = Math.min(Math.max(parseInt(body.attendees) || 1, 1), 20);
    const firstTime = body.first_time === true || body.first_time === "yes";
    const rawPhone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";
    const countryCode = typeof body.country_code === "string" && /^\+\d{1,4}$/.test(body.country_code.trim())
      ? body.country_code.trim() : null;

    let phone: string | null = null;
    if (rawPhone) {
      const cleaned = rawPhone.replace(/[\s\-().]/g, "");
      if (!/^\+?\d{8,15}$/.test(cleaned)) {
        return new Response(JSON.stringify({ error: "Invalid phone number format" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      phone = cleaned;
    }

    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone number is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const attendanceDateRaw = typeof body.attendance_date === "string" ? body.attendance_date.trim() : "";
    const dateCheck = validateAttendanceDate(attendanceDateRaw);
    if (!dateCheck.ok) {
      return new Response(JSON.stringify({ error: dateCheck.reason || "Invalid attendance date" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const attendanceDate = attendanceDateRaw;
    const attendanceDay = dateCheck.dayName!; // "Saturday" or "Sunday"

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Multi-day registrations allowed — no dedupe.
    const registrationId = crypto.randomUUID();
    const { error } = await supabase.from("weekend_love_feast_registrations").insert({
      id: registrationId,
      name, email, phone,
      country_code: countryCode,
      attendees,
      first_time: firstTime,
      attendance_date: attendanceDate,
    });

    if (error) {
      console.error("submit-wlf-registration insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to save registration" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fire-and-forget confirmation email
    try {
      await supabase.functions.invoke("send-wlf-confirmation", {
        body: {
          registration_id: registrationId,
          name, email, attendees,
          event_date_iso: attendanceDate,
          event_day: attendanceDay,
        },
      });
    } catch (emailErr) {
      console.error("Failed to trigger WLF confirmation email:", emailErr);
    }

    // Fire-and-forget Wabo sync — pass picked day & date
    try {
      await supabase.functions.invoke("sync-to-wabo", {
        body: {
          event_slug: "weekend_love_feast",
          source: "Weekend Love Feast - Landing Page",
          name, email,
          country_code: countryCode || "+65",
          phone,
          extras: {
            wlf_attendance_date: attendanceDate,
            wlf_attendance_day: attendanceDay,
            wlf_attendees: attendees,
          },
        },
      });
    } catch (waboErr) {
      console.error("Wabo sync error (WLF):", waboErr);
    }

    const { count } = await supabase
      .from("weekend_love_feast_registrations")
      .select("*", { count: "exact", head: true });

    return new Response(JSON.stringify({ success: true, count: count || 0, event_date: attendanceDate }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-wlf-registration error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
