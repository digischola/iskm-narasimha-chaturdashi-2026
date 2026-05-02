import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

const CONFIRMATION_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>You're in — Ratha Yātrā 2026</title>
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
  .btn-secondary:hover { background: #f4c96b !important; color: #1e3a6e !important; }
  @media screen and (max-width: 600px) {
    .container { width: 100% !important; max-width: 100% !important; }
    .stack { display: block !important; width: 100% !important; }
    .p-mobile { padding: 24px !important; }
    .hero-date { font-size: 28px !important; }
    .hero-title { font-size: 32px !important; }
    .h2 { font-size: 24px !important; }
    .schedule-time { font-size: 14px !important; min-width: 110px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#fdf5ed;font-family:'Source Sans Pro',-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:#333333;">

<!-- PREHEADER (hidden) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fdf5ed;">
  Sunday 5 July · 5:00 PM · Clementi Stadium. Your spot is saved. Here's what to expect.
  &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj;
</div>

<center style="width:100%;background:#fdf5ed;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;">
  <tr><td align="center" style="padding:32px 16px;">

    <!-- CONTAINER -->
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(30,58,110,0.08);">

      <!-- GOLD ACCENT BAR -->
      <tr><td style="height:4px;background:linear-gradient(90deg,#f8a4c0,#f4c96b);background-color:#f4c96b;line-height:4px;font-size:0;">&nbsp;</td></tr>

      <!-- LOGO HEADER -->
      <tr><td align="center" style="padding:32px 24px 16px;background:#ffffff;">
        <img src="https://events.srikrishnamandir.org/images/logo.webp" width="72" height="72" alt="Sri Krishna Mandir" style="display:block;border-radius:50%;border:2px solid #f4c96b;">
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:13px;font-weight:700;color:#1e3a6e;letter-spacing:2px;text-transform:uppercase;margin-top:12px;">Sri Krishna Mandir</div>
      </td></tr>

      <!-- HERO -->
      <tr><td align="center" style="padding:24px 24px 8px;" class="p-mobile">
        <div style="display:inline-block;padding:6px 14px;background:#fdf5ed;border:1px solid #f4c96b;border-radius:999px;font-size:11px;font-weight:700;color:#1e3a6e;letter-spacing:1.5px;text-transform:uppercase;">✓ Registration Confirmed</div>
      </td></tr>

      <tr><td align="center" style="padding:16px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:700;color:#1e3a6e;line-height:1.15;letter-spacing:-0.5px;">
          You're in, {{first_name}}. 🌺
        </h1>
      </td></tr>

      <tr><td align="center" style="padding:8px 32px 24px;" class="p-mobile">
        <p style="margin:0;font-size:17px;line-height:1.6;color:#555555;max-width:460px;">
          Your spot for Ratha Yātrā 2026 is saved. See you at Clementi Stadium.
        </p>
      </td></tr>

      <!-- DATE CARD (NAVY) -->
      <tr><td style="padding:0 24px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e3a6e;border-radius:14px;">
          <tr><td align="center" style="padding:28px 24px;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Save the Date</div>
            <div class="hero-date" style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;color:#ffffff;line-height:1.2;margin-bottom:6px;">Sunday, 5 July 2026</div>
            <div style="font-size:16px;color:#f8a4c0;font-weight:600;margin-bottom:20px;">5:00 PM – 9:30 PM</div>
            <div style="font-size:14px;color:#ffffff;opacity:0.85;line-height:1.5;">
              Clementi Stadium<br>
              10 West Coast Walk<br>
              Singapore 127156
            </div>
          </td></tr>
        </table>
      </td></tr>

      <!-- OPENING PARAGRAPH -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">
          Hare Krishna {{first_name}},
        </p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">
          On Sunday, 5 July 2026, Singapore's longest-running festival of chariots returns to Clementi Stadium — <strong style="color:#1e3a6e;">three hand-pulled chariots carrying Lord Jagannath, Lord Baladeva, and Goddess Subhadra Devi</strong>.
        </p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#444444;">
          Pull the rope. Sing the kirtan. Take home the blessing.
        </p>
      </td></tr>

      <!-- PRIMARY CTA -->
      <tr><td align="center" style="padding:8px 32px 32px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:999px;background:#f8a4c0;">
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ratha+Y%C4%81tr%C4%81+2026+%E2%80%93+Clementi+Stadium&dates=20260705T090000Z/20260705T133000Z&details=Three+chariots%2C+ecstatic+kirtan%2C+cultural+performances%2C+free+5-course+prasadam.%0A%0AVenue%3A+10+West+Coast+Walk%2C+Singapore+127156%0A%0AMore+info%3A+https%3A%2F%2Fevents.srikrishnamandir.org%2Fratha-yatra-2026&location=Clementi+Stadium%2C+10+West+Coast+Walk%2C+Singapore+127156" class="btn-primary" style="display:inline-block;padding:16px 36px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;background:#f8a4c0;">Add to Calendar →</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="padding:0 32px;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- SCHEDULE SECTION -->
      <tr><td style="padding:32px 32px 8px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Your Evening</div>
        <h2 class="h2" style="margin:0 0 20px;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:700;color:#1e3a6e;">Programme Schedule</h2>
      </td></tr>

      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;width:140px;">5:00 – 5:30 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Guest of Honour & Opening</strong><br>
              <span style="color:#777;font-size:14px;">Welcome and opening remarks</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">5:30 – 6:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Cultural Odissi Dance</strong><br>
              <span style="color:#777;font-size:14px;">Classical dancers welcome the deities</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">6:00 – 6:30 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Deities Ascend & Mahā Ārati</strong><br>
              <span style="color:#777;font-size:14px;">Lord Jagannath, Baladeva & Subhadra board the chariots</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">6:30 – 9:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Chariot Procession</strong> <span style="display:inline-block;padding:2px 8px;background:#f4c96b;color:#1e3a6e;font-size:11px;font-weight:700;border-radius:999px;letter-spacing:0.5px;">PEAK MOMENT</span><br>
              <span style="color:#777;font-size:14px;">Pull the rope · Live kirtan · Free 5-course feast · Spiritual Bazaar</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;vertical-align:top;">9:00 – 9:30 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;vertical-align:top;">
              <strong style="color:#1e3a6e;">Final Ārati & Departure</strong><br>
              <span style="color:#777;font-size:14px;">Concluding ceremonies</span>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- WHAT TO BRING -->
      <tr><td style="padding:8px 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;border-left:4px solid #f4c96b;border-radius:8px;">
          <tr><td style="padding:20px 24px;">
            <div style="font-size:14px;font-weight:700;color:#1e3a6e;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Good to Know</div>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
              Free entry, no tickets needed. Arrive early for priority seating. Wear comfortable shoes — you may want to pull the chariot rope! A free 5-course vegetarian feast is served to every attendee during the procession.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- GETTING HERE -->
      <tr><td style="padding:8px 32px 24px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Getting Here</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:6px 0;font-size:15px;color:#444;line-height:1.6;">
              <strong style="color:#1e3a6e;">🚇 MRT:</strong> Clementi (EW23) — 8 min walk to stadium
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:15px;color:#444;line-height:1.6;">
              <strong style="color:#1e3a6e;">🅿️ Parking:</strong> Public parking at Clementi Stadium carpark
            </td>
          </tr>
        </table>
        <div style="margin-top:16px;">
          <a href="https://www.google.com/maps/place/Clementi+Stadium/@1.3145,103.7630,17z" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;text-decoration:none;border:2px solid #1e3a6e;border-radius:999px;">Get Directions →</a>
        </div>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="padding:16px 32px 0;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- SHARE SECTION -->
      <tr><td style="padding:24px 32px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Spread the Joy</div>
        <h3 style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:700;color:#1e3a6e;">Invite someone you love</h3>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#555;">
          If you know a friend or family member who'd enjoy the festival — forward this email or share the link.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:8px;">
              <a href="https://wa.me/?text=Join%20us%20for%20Ratha%20Y%C4%81tr%C4%81%202026%20at%20Clementi%20Stadium%20on%20Sunday%205%20July%2C%205%20PM.%20Free%20entry%2C%20free%20feast%2C%20all%20welcome.%20Register%3A%20https%3A%2F%2Fevents.srikrishnamandir.org%2Fratha-yatra-2026" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#25D366;text-decoration:none;border-radius:999px;">WhatsApp</a>
            </td>
            <td style="padding-right:8px;">
              <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fevents.srikrishnamandir.org%2Fratha-yatra-2026" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#1877F2;text-decoration:none;border-radius:999px;">Facebook</a>
            </td>
            <td>
              <a href="https://t.me/share/url?url=https%3A%2F%2Fevents.srikrishnamandir.org%2Fratha-yatra-2026&text=Join%20us%20for%20Ratha%20Y%C4%81tr%C4%81%202026" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#0088cc;text-decoration:none;border-radius:999px;">Telegram</a>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- SIGN OFF -->
      <tr><td style="padding:24px 32px 8px;" class="p-mobile">
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#555;">
          Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/6562502280" style="color:#1e3a6e;font-weight:700;">+65 6250 2280</a>.
        </p>
        <p style="margin:16px 0 4px;font-size:15px;color:#444;">Yours in service,</p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1e3a6e;">Sri Krishna Mandir</p>
      </td></tr>

      <!-- PS -->
      <tr><td style="padding:24px 32px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;border-radius:8px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#666;font-style:italic;">
              <strong style="color:#1e3a6e;font-style:normal;">P.S.</strong> The chariot procession starts at 6:30 PM and goes until 9 PM. Arrive by 5 PM for the best experience — the opening ceremonies and Odissi dance are worth seeing.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="padding:0;background:#1e3a6e;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="padding:32px 24px;color:#ffffff;">
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#ffffff;margin-bottom:8px;">Sri Krishna Mandir</div>
            <div style="font-size:13px;color:#f8a4c0;margin-bottom:20px;">International Sri Krishna Mandir</div>
            <div style="font-size:13px;color:#ffffff;opacity:0.7;line-height:1.8;">
              <a href="https://srikrishnamandir.org" style="color:#f4c96b;text-decoration:none;">srikrishnamandir.org</a> &nbsp;·&nbsp;
              <a href="https://www.facebook.com/iskm.sg/" style="color:#f4c96b;text-decoration:none;">Facebook</a> &nbsp;·&nbsp;
              <a href="mailto:contact@srikrishnamandir.org" style="color:#f4c96b;text-decoration:none;">contact@srikrishnamandir.org</a>
            </div>
            <div style="font-size:12px;color:#ffffff;opacity:0.5;margin-top:20px;line-height:1.6;">
              Clementi Stadium, 10 West Coast Walk, Singapore 127156<br>
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
    <!-- END CONTAINER -->

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
  // Calendar link
  html = html.replace(
    /href="(https:\/\/calendar\.google\.com\/[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'calendar', url)}"`
  );
  // Directions / Maps link
  html = html.replace(
    /href="(https:\/\/www\.google\.com\/maps\/place[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'directions', url)}"`
  );
  // WhatsApp share
  html = html.replace(
    /href="(https:\/\/wa\.me\/\?text=[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'share_whatsapp', url)}"`
  );
  return html;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { registration_id, name, email } = await req.json();

    if (!registration_id || !name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if already sent
    const { data: reg } = await supabase
      .from("ratha_yatra_registrations")
      .select("confirmation_sent")
      .eq("id", registration_id)
      .single();

    if (reg?.confirmation_sent) {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstName = name.trim().split(/\s+/)[0];

    // Generate unsubscribe token
    const token = crypto.randomUUID();
    const unsubscribeUrl = "https://events.srikrishnamandir.org/unsubscribe?token=" + token;

    // Store unsubscribe token
    await supabase.from("email_unsubscribe_tokens").insert({
      email,
      token,
    });

    const trackBase = supabaseUrl + "/functions/v1/track-email";
    const pixelUrl = `${trackBase}?t=o&et=ry-confirmation&rid=${registration_id}&e=${encodeURIComponent(email)}`;

    let html = renderTemplate(CONFIRMATION_HTML, {
      first_name: firstName,
      unsubscribe_url: unsubscribeUrl,
      tracking_pixel: `<img src="${pixelUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`,
    });

    // Add click tracking
    html = addClickTracking(html, trackBase, registration_id, "ry-confirmation", email);

    const text = `You're in, ${firstName} — Ratha Yātrā 2026\n\nYour spot is saved.\n\nSunday, 5 July 2026\n5:00 PM – 9:30 PM\nClementi Stadium\n10 West Coast Walk, Singapore 127156\n\nSchedule:\n5:00–5:30 PM – Guest of Honour & Opening\n5:30–6:00 PM – Cultural Odissi Dance\n6:00–6:30 PM – Deities Ascend & Mahā Ārati\n6:30–9:00 PM – Chariot Procession\n9:00–9:30 PM – Final Ārati\n\nQuestions? WhatsApp +65 6250 2280\n\nSri Krishna Mandir\nhttps://events.srikrishnamandir.org/ratha-yatra-2026\n\nUnsubscribe: ${unsubscribeUrl}`;

    const messageId = "ry-confirm-" + registration_id;
    const idempotencyKey = "ry-confirm-" + registration_id;

    // Enqueue the email
    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: email,
        from: "Sri Krishna Mandir <noreply@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: "You're in, " + firstName + " — Ratha Yātrā 2026 🌺",
        html,
        text,
        purpose: "transactional",
        label: "ry-confirmation",
        message_id: messageId,
        idempotency_key: idempotencyKey,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    // Log pending
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "ry-confirmation",
      recipient_email: email,
      status: "pending",
    });

    // Mark confirmation_sent
    await supabase
      .from("ratha_yatra_registrations")
      .update({ confirmation_sent: true })
      .eq("id", registration_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending RY confirmation:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
