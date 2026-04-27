import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

/**
 * Sends Sunday Love Feast confirmation email.
 * Body: { registration_id: string, name: string, email: string, attendees: number, event_date_iso: string }
 *
 * event_date_iso: e.g. "2026-04-26" — the upcoming Sunday the user is registering for.
 * Idempotent via slf-confirm-{registration_id}; pgmq queue is `transactional_emails`.
 */

const CONFIRMATION_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>You're in — Sunday Love Feast</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Source+Sans+Pro:wght@400;600;700&display=swap');
  body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; outline: none; text-decoration: none; }
  body { margin: 0 !important; padding: 0 !important; width: 100% !important; background: #fdf5ed; }
  a { color: #1e3a6e; }
  .btn-primary:hover { background: #f590b3 !important; }
  @media screen and (max-width: 600px) {
    .container { width: 100% !important; max-width: 100% !important; }
    .p-mobile { padding: 24px !important; }
    .hero-title { font-size: 30px !important; }
    .h2 { font-size: 22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#fdf5ed;font-family:'Source Sans Pro',-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:#333333;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fdf5ed;">
  Sunday {{event_date_pretty}} · 5:00 PM. Your seat is saved. Bhajan, Gita, Kīrtana &amp; free Prasādam.
  &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj;
</div>

<center style="width:100%;background:#fdf5ed;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(30,58,110,0.08);">
      <tr><td style="height:4px;background:linear-gradient(90deg,#f8a4c0,#f4c96b);background-color:#f4c96b;line-height:4px;font-size:0;">&nbsp;</td></tr>

      <tr><td align="center" style="padding:32px 24px 16px;background:#ffffff;">
        <img src="https://events.srikrishnamandir.org/images/logo.webp" width="72" height="72" alt="ISKM Singapore" style="display:block;border-radius:50%;border:2px solid #f4c96b;">
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:13px;font-weight:700;color:#1e3a6e;letter-spacing:2px;text-transform:uppercase;margin-top:12px;">ISKM Singapore</div>
      </td></tr>

      <tr><td align="center" style="padding:24px 24px 8px;" class="p-mobile">
        <div style="display:inline-block;padding:6px 14px;background:#fdf5ed;border:1px solid #f4c96b;border-radius:999px;font-size:11px;font-weight:700;color:#1e3a6e;letter-spacing:1.5px;text-transform:uppercase;">✓ Registered for Sunday Love Feast</div>
      </td></tr>

      <tr><td align="center" style="padding:16px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:700;color:#1e3a6e;line-height:1.15;letter-spacing:-0.5px;">
          You're in, {{first_name}}.
        </h1>
      </td></tr>

      <tr><td align="center" style="padding:8px 32px 24px;" class="p-mobile">
        <p style="margin:0;font-size:17px;line-height:1.6;color:#555555;max-width:460px;">
          Your seat for the Sunday Love Feast is saved — {{attendees_pretty}}.
        </p>
      </td></tr>

      <tr><td style="padding:0 24px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e3a6e;border-radius:14px;">
          <tr><td align="center" style="padding:28px 24px;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Your Sunday</div>
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:30px;font-weight:700;color:#ffffff;line-height:1.2;margin-bottom:6px;">{{event_date_pretty}}</div>
            <div style="font-size:16px;color:#f8a4c0;font-weight:600;margin-bottom:20px;">5:00 PM – 7:30 PM</div>
            <div style="font-size:14px;color:#ffffff;opacity:0.85;line-height:1.5;">
              International Sri Krishna Mandir<br>
              No.9 Lorong 29 Geylang, #03-02<br>
              Singapore 388065
            </div>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">Hare Krishna {{first_name}},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">
          Every Sunday evening, devotees and seekers come together at the temple for an evening that nourishes both heart and stomach — soul-stirring <strong style="color:#1e3a6e;">Bhajan</strong>, transformative <strong style="color:#1e3a6e;">Bhagavad Gītā class</strong>, ecstatic <strong style="color:#1e3a6e;">Kīrtana</strong>, and a blessed <strong style="color:#1e3a6e;">Prasādam feast</strong>.
        </p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#444444;">
          Walk in with a smile. We'll have a plate ready.
        </p>
      </td></tr>

      <tr><td align="center" style="padding:8px 32px 32px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:999px;background:#f8a4c0;">
            <a href="{{calendar_url}}" class="btn-primary" style="display:inline-block;padding:16px 36px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;background:#f8a4c0;">Add to Calendar →</a>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:0 32px;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <tr><td style="padding:32px 32px 8px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Your Evening</div>
        <h2 class="h2" style="margin:0 0 20px;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:700;color:#1e3a6e;">Hour by Hour</h2>
      </td></tr>

      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;width:120px;">5:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Bhajan</strong><br>
              <span style="color:#777;font-size:14px;">Open the evening with melodious devotional songs</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">5:30 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Bhagavad Gītā Class</strong><br>
              <span style="color:#777;font-size:14px;">Adults &amp; children's parallel classes</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">6:30 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Ārati &amp; Kīrtana</strong><br>
              <span style="color:#777;font-size:14px;">Congregational chanting &amp; the Ārati ceremony</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;vertical-align:top;">7:15 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;vertical-align:top;">
              <strong style="color:#1e3a6e;">Prasādam Feast</strong><br>
              <span style="color:#777;font-size:14px;">Vegetarian feast offered to Lord Krishna — free for all</span>
            </td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="padding:8px 32px 24px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Getting Here</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:6px 0;font-size:15px;color:#444;line-height:1.6;">
              <strong style="color:#1e3a6e;">🚇 MRT:</strong> Aljunied (EW9) or Paya Lebar (CC9/EW9) — 10 min walk
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:15px;color:#444;line-height:1.6;">
              <strong style="color:#1e3a6e;">🚌 Bus:</strong> 2, 13, 21, 26, 51, 67 — along Geylang Road
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:15px;color:#444;line-height:1.6;">
              <strong style="color:#1e3a6e;">🅿️ Parking:</strong> Street parking on Lorong 29
            </td>
          </tr>
        </table>
        <div style="margin-top:16px;">
          <a href="https://www.google.com/maps/place/International+Sri+Krishna+Mandir+(ISKM)/@1.3146362,103.8807558,17z" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;text-decoration:none;border:2px solid #1e3a6e;border-radius:999px;">Get Directions →</a>
        </div>
      </td></tr>

      <tr><td style="padding:24px 32px 8px;" class="p-mobile">
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#555;">
          Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/6562502280" style="color:#1e3a6e;font-weight:700;">+65 6250 2280</a>.
        </p>
        <p style="margin:16px 0 4px;font-size:15px;color:#444;">Yours in service,</p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1e3a6e;">ISKM Singapore</p>
      </td></tr>

      <tr><td style="padding:0;background:#1e3a6e;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="padding:24px;color:#ffffff;font-size:13px;line-height:1.6;">
            <div style="margin-bottom:8px;font-weight:700;">ISKM Singapore</div>
            <div style="opacity:0.7;">No.9 Lorong 29 Geylang, #03-02 · Singapore 388065</div>
            <div style="margin-top:16px;font-size:12px;opacity:0.7;">
              <a href="https://events.srikrishnamandir.org/sunday-love-feast" style="color:#ffffff;opacity:0.7;">events.srikrishnamandir.org</a>
              · 
              <a href="{{unsubscribe_url}}" style="color:#ffffff;opacity:0.7;">Unsubscribe</a>
            </div>
          </td></tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</center>
{{tracking_pixel}}
</body>
</html>
`;

function renderTemplate(html: string, vars: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll("{{" + key + "}}", value);
  }
  return result;
}

function trackUrl(base: string, rid: string, et: string, email: string, linkName: string, originalUrl: string): string {
  return `${base}?t=c&et=${et}&rid=${rid}&e=${encodeURIComponent(email)}&l=${linkName}&r=${encodeURIComponent(originalUrl)}`;
}

function addClickTracking(html: string, trackBase: string, rid: string, et: string, email: string): string {
  // Match both calendar.google.com and www.google.com/calendar
  html = html.replace(
    /href="(https:\/\/(?:calendar\.google\.com|www\.google\.com\/calendar)[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, "calendar", url)}"`,
  );
  html = html.replace(
    /href="(https:\/\/www\.google\.com\/maps\/place[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, "directions", url)}"`,
  );
  return html;
}

function buildCalendarUrl(eventDateIso: string): string {
  // Sunday Love Feast: 5:00 PM – 7:30 PM SGT (UTC+8) → 09:00–11:30 UTC
  const ymd = eventDateIso.replace(/-/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent("Sunday Love Feast — ISKM Singapore")}` +
    `&dates=${ymd}T090000Z/${ymd}T113000Z` +
    `&details=${encodeURIComponent("Bhajan, Bhagavad Gītā Class, Ārati & Kīrtana, and free Prasādam feast.\n\nVenue: No.9 Lorong 29 Geylang, #03-02, Singapore 388065\n\nMore info: https://events.srikrishnamandir.org/sunday-love-feast")}` +
    `&location=${encodeURIComponent("No.9 Lorong 29 Geylang, #03-02, Singapore 388065")}`;
}

function formatDatePretty(eventDateIso: string): string {
  try {
    const d = new Date(eventDateIso + "T00:00:00+08:00");
    return d.toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  } catch {
    return eventDateIso;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { registration_id, name, email, attendees, event_date_iso } = await req.json();

    if (!registration_id || !name || !email || !event_date_iso) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Idempotency: skip if already logged as sent or pending
    const messageId = "slf-confirm-" + registration_id;
    const { data: existingLog } = await supabase
      .from("email_send_log")
      .select("id")
      .eq("message_id", messageId)
      .limit(1)
      .maybeSingle();

    if (existingLog) {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstName = String(name).trim().split(/\s+/)[0];
    const attendeesPretty = attendees && attendees > 1
      ? `we've reserved ${attendees} seats`
      : `we've reserved your seat`;

    const token = crypto.randomUUID();
    const unsubscribeUrl = "https://events.srikrishnamandir.org/unsubscribe?token=" + token;

    await supabase.from("email_unsubscribe_tokens").insert({ email, token });

    const trackBase = supabaseUrl + "/functions/v1/track-email";
    const pixelUrl = `${trackBase}?t=o&et=slf-confirmation&rid=${registration_id}&e=${encodeURIComponent(email)}`;

    let html = renderTemplate(CONFIRMATION_HTML, {
      first_name: firstName,
      attendees_pretty: attendeesPretty,
      event_date_pretty: formatDatePretty(event_date_iso),
      calendar_url: buildCalendarUrl(event_date_iso),
      unsubscribe_url: unsubscribeUrl,
      tracking_pixel: `<img src="${pixelUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`,
    });

    html = addClickTracking(html, trackBase, registration_id, "slf-confirmation", email);

    const text = `You're in, ${firstName} — Sunday Love Feast\n\n${attendeesPretty} for ${formatDatePretty(event_date_iso)}, 5:00 PM – 7:30 PM.\n\nInternational Sri Krishna Mandir\nNo.9 Lorong 29 Geylang, #03-02, Singapore 388065\n\nSchedule:\n5:00 PM – Bhajan\n5:30 PM – Bhagavad Gītā Class\n6:30 PM – Ārati & Kīrtana\n7:15 PM – Prasādam Feast\n\nQuestions? WhatsApp +65 6250 2280\n\nISKM Singapore\nhttps://events.srikrishnamandir.org/sunday-love-feast\n\nUnsubscribe: ${unsubscribeUrl}`;

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: email,
        from: "ISKM Singapore <noreply@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: `You're in, ${firstName} — Sunday Love Feast 🌸`,
        html,
        text,
        purpose: "transactional",
        label: "slf-confirmation",
        message_id: messageId,
        idempotency_key: messageId,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "slf-confirmation",
      recipient_email: email,
      status: "pending",
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-slf-confirmation error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
