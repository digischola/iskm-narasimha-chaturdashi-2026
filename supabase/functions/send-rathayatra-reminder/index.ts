import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const REMINDER_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Tomorrow — Ratha Yātrā 2026</title>
<!--[if mso]>
<xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<style>* { font-family: Georgia, serif !important; }</style>
<![endif]-->
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
    .hero-title { font-size: 36px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#fdf5ed;font-family:'Source Sans Pro',-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:#333333;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fdf5ed;">
  Ratha Yātrā is tomorrow. Three chariots. One evening. Your final checklist inside.
  &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj;
</div>

<center style="width:100%;background:#fdf5ed;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;">
  <tr><td align="center" style="padding:32px 16px;">

    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(30,58,110,0.08);">

      <tr><td style="height:4px;background:linear-gradient(90deg,#f8a4c0,#f4c96b);background-color:#f4c96b;line-height:4px;font-size:0;">&nbsp;</td></tr>

      <tr><td align="center" style="padding:32px 24px 16px;background:#ffffff;">
        <img src="https://events.srikrishnamandir.org/images/logo.webp" width="72" height="72" alt="Sri Krishna Mandir" style="display:block;border-radius:50%;border:2px solid #f4c96b;">
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:13px;font-weight:700;color:#1e3a6e;letter-spacing:2px;text-transform:uppercase;margin-top:12px;">Sri Krishna Mandir</div>
      </td></tr>

      <tr><td align="center" style="padding:24px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:42px;font-weight:700;color:#1e3a6e;line-height:1.15;">
          Tomorrow, {{first_name}}.
        </h1>
      </td></tr>

      <tr><td align="center" style="padding:8px 32px 24px;" class="p-mobile">
        <p style="margin:0;font-size:17px;line-height:1.6;color:#555;max-width:460px;">
          Three grand chariots. Ecstatic kirtan. Free 5-course feast. It's all happening at Clementi Stadium.
        </p>
      </td></tr>

      <!-- DATE CARD -->
      <tr><td style="padding:0 24px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e3a6e;border-radius:14px;">
          <tr><td align="center" style="padding:28px 24px;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Tomorrow</div>
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;color:#ffffff;line-height:1.2;margin-bottom:6px;">Sunday, 5 July 2026</div>
            <div style="font-size:16px;color:#f8a4c0;font-weight:600;margin-bottom:20px;">5:00 PM – 9:30 PM</div>
            <div style="font-size:14px;color:#ffffff;opacity:0.85;line-height:1.5;">
              Clementi Stadium<br>
              10 West Coast Walk, Singapore 127156
            </div>
          </td></tr>
        </table>
      </td></tr>

      <!-- QUICK CHECKLIST -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Quick Checklist</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">✅ Wear comfortable shoes (you'll want to pull the rope!)</td></tr>
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">✅ Arrive by 5 PM for priority seating</td></tr>
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">✅ Free 5-course feast served during procession — come hungry!</td></tr>
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">✅ Bring family & friends — everyone is welcome</td></tr>
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td align="center" style="padding:8px 32px 32px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:999px;background:#f8a4c0;">
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ratha+Y%C4%81tr%C4%81+2026+%E2%80%93+Clementi+Stadium&dates=20260705T090000Z/20260705T133000Z&details=Three+chariots%2C+ecstatic+kirtan%2C+cultural+performances%2C+free+5-course+prasadam.%0A%0AVenue%3A+10+West+Coast+Walk%2C+Singapore+127156%0A%0AMore+info%3A+https%3A%2F%2Fevents.srikrishnamandir.org%2Fratha-yatra-2026&location=Clementi+Stadium%2C+10+West+Coast+Walk%2C+Singapore+127156" class="btn-primary" style="display:inline-block;padding:16px 36px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;background:#f8a4c0;">Add to Calendar →</a>
          </td></tr>
        </table>
        <div style="margin-top:12px;">
          <a href="https://www.google.com/maps/place/Clementi+Stadium/@1.3145,103.7630,17z" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;text-decoration:none;border:2px solid #1e3a6e;border-radius:999px;">Get Directions →</a>
        </div>
      </td></tr>

      <!-- SIGN OFF -->
      <tr><td style="padding:8px 32px 32px;" class="p-mobile">
        <p style="margin:0 0 4px;font-size:15px;color:#444;">See you tomorrow,</p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1e3a6e;">Sri Krishna Mandir</p>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="padding:0;background:#1e3a6e;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="padding:32px 24px;color:#ffffff;">
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#ffffff;margin-bottom:8px;">Sri Krishna Mandir</div>
            <div style="font-size:12px;color:#ffffff;opacity:0.5;margin-top:12px;line-height:1.6;">
              © 2026 International Sri Krishna Mandir
            </div>
            <div style="font-size:11px;color:#ffffff;opacity:0.4;margin-top:16px;">
              You received this because you registered for Ratha Yātrā 2026.<br>
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
  html = html.replace(
    /href="(https:\/\/calendar\.google\.com\/[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'calendar', url)}"`
  );
  html = html.replace(
    /href="(https:\/\/www\.google\.com\/maps\/place[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'directions', url)}"`
  );
  return html;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: registrations, error } = await supabase
    .from("ratha_yatra_registrations")
    .select("id, name, email")
    .eq("reminder_sent", false);

  if (error) {
    console.error("Failed to fetch RY registrations:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch registrations" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!registrations?.length) {
    return new Response(JSON.stringify({ processed: 0, message: "No pending reminders" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: suppressed } = await supabase.from("suppressed_emails").select("email");
  const suppressedSet = new Set((suppressed || []).map((s: any) => s.email));

  const { data: unsubscribed } = await supabase
    .from("email_unsubscribe_tokens")
    .select("email")
    .not("used_at", "is", null);
  const unsubscribedSet = new Set((unsubscribed || []).map((u: any) => u.email));

  let processed = 0;
  let skipped = 0;

  for (const reg of registrations) {
    if (suppressedSet.has(reg.email) || unsubscribedSet.has(reg.email)) {
      await supabase.from("ratha_yatra_registrations").update({ reminder_sent: true }).eq("id", reg.id);
      skipped++;
      continue;
    }

    const firstName = reg.name.trim().split(/\s+/)[0];

    const { data: existingToken } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", reg.email)
      .is("used_at", null)
      .maybeSingle();

    let token = existingToken?.token;
    if (!token) {
      token = crypto.randomUUID();
      await supabase.from("email_unsubscribe_tokens").insert({ email: reg.email, token });
    }

    const unsubscribeUrl = "https://events.srikrishnamandir.org/unsubscribe?token=" + token;
    const trackBase = supabaseUrl + "/functions/v1/track-email";
    const pixelUrl = `${trackBase}?t=o&et=ry-reminder&rid=${reg.id}&e=${encodeURIComponent(reg.email)}`;
    let html = renderTemplate(REMINDER_HTML, {
      first_name: firstName,
      unsubscribe_url: unsubscribeUrl,
      tracking_pixel: `<img src="${pixelUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`,
    });
    html = addClickTracking(html, trackBase, reg.id, "ry-reminder", reg.email);
    const text = `Tomorrow, ${firstName} — Ratha Yātrā 2026\n\nSunday, 5 July 2026\n5:00 PM – 9:30 PM\nClementi Stadium, 10 West Coast Walk, Singapore 127156\n\nQuick Checklist:\n✅ Comfortable shoes\n✅ Arrive by 5 PM\n✅ Free 5-course feast\n✅ Bring family & friends\n\nGet Directions: https://maps.app.goo.gl/Clementi\n\nUnsubscribe: ${unsubscribeUrl}`;
    const messageId = "ry-reminder-" + reg.id;

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: reg.email,
        from: "Sri Krishna Mandir <noreply@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: "Tomorrow, " + firstName + " 🌺",
        html,
        text,
        purpose: "transactional",
        label: "ry-reminder",
        message_id: messageId,
        idempotency_key: "ry-reminder-" + reg.id,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "ry-reminder",
      recipient_email: reg.email,
      status: "pending",
    });

    await supabase.from("ratha_yatra_registrations").update({ reminder_sent: true }).eq("id", reg.id);
    processed++;

    if (processed < registrations.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log("RY Reminder batch complete: " + processed + " queued, " + skipped + " skipped");
  return new Response(
    JSON.stringify({ processed, skipped }),
    { headers: { "Content-Type": "application/json" } }
  );
});
