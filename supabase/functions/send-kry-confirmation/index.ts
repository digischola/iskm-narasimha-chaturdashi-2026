import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

const EVENT_URL = "https://events.srikrishnamandir.org/kids-ratha-yatra-2026";
const CALENDAR_URL = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Kids+Ratha+Y%C4%81tr%C4%81+2026&dates=20260627T100000Z/20260627T130000Z&details=Children-led+k%C4%ABrtana%2C+joyful+stalls%2C+the+chariot+procession+and+free+pras%C4%81dam+for+the+whole+family.%0A%0AVenue%3A+Singapore%0A%0AMore+info%3A+https%3A%2F%2Fevents.srikrishnamandir.org%2Fkids-ratha-yatra-2026&location=ISKM+Capark%2C+Singapore";
const WA_SHARE = "https://wa.me/?text=Join%20us%20for%20Kids%20Ratha%20Y%C4%81tr%C4%81%202026%20at%20Clementi%20Stadium%20on%20Saturday%2027%20June%2C%206%20PM.%20Free%20entry%2C%20free%20Pras%C4%81dam%20Feast%2C%20all%20welcome.%20Register%3A%20https%3A%2F%2Fevents.srikrishnamandir.org%2Fkids-ratha-yatra-2026";
const TG_SHARE = "https://t.me/share/url?url=https%3A%2F%2Fevents.srikrishnamandir.org%2Fkids-ratha-yatra-2026&text=Join%20us%20for%20Kids%20Ratha%20Y%C4%81tr%C4%81%202026";

const CONFIRMATION_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>You're in, Kids Ratha Y&#x101;tr&#x101; 2026</title>
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
    .hero-title { font-size: 32px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#fdf5ed;font-family:'Source Sans Pro',-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:#333333;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fdf5ed;">
  Saturday, 27 June at ISKM Capark. Free entry, free pras&#x101;dam for the whole family.
  &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj;
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
        <div style="display:inline-block;padding:6px 14px;background:#fdf5ed;border:1px solid #f4c96b;border-radius:999px;font-size:11px;font-weight:700;color:#1e3a6e;letter-spacing:1.5px;text-transform:uppercase;">&#10003; Registration Confirmed</div>
      </td></tr>

      <tr><td align="center" style="padding:16px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:#1e3a6e;line-height:1.15;">
          Thank you, {{first_name}}. &#127802;
        </h1>
      </td></tr>

      <tr><td align="center" style="padding:8px 32px 24px;" class="p-mobile">
        <p style="margin:0;font-size:17px;line-height:1.6;color:#555555;max-width:460px;">
          Your seat is reserved for Kids Ratha Y&#x101;tr&#x101; 2026.
        </p>
      </td></tr>

      <!-- DATE CARD -->
      <tr><td style="padding:0 24px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e3a6e;border-radius:14px;">
          <tr><td align="center" style="padding:28px 24px;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Save the Date</div>
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;color:#ffffff;line-height:1.2;margin-bottom:6px;">Saturday, 27 June 2026</div>
            <div style="font-size:16px;color:#f8a4c0;font-weight:600;margin-bottom:20px;">6:00 PM to 9:00 PM</div>
            <div style="font-size:14px;color:#ffffff;opacity:0.85;line-height:1.5;">
              ISKM Capark<br>
              Singapore
            </div>
          </td></tr>
        </table>
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">
          Children-led k&#x12B;rtana, joyful stalls, the chariot procession, and free pras&#x101;dam for the whole family.
        </p>
      </td></tr>

      <!-- PRIMARY CTA -->
      <tr><td align="center" style="padding:0 32px 16px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:10px;background:#f8a4c0;">
            <a href="${CALENDAR_URL}" class="btn-primary" style="display:inline-block;padding:14px 28px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#1e3a6e;text-decoration:none;border-radius:10px;background:#f8a4c0;">Add to Google Calendar &#8594;</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- SECONDARY CTA -->
      <tr><td align="center" style="padding:0 32px 24px;" class="p-mobile">
        <a href="${EVENT_URL}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;text-decoration:none;border:2px solid #1e3a6e;border-radius:10px;">View event page &#8594;</a>
      </td></tr>

      <!-- REMINDER NOTE -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <p style="margin:0;font-size:15px;line-height:1.7;color:#555555;">
          We'll send you two short reminders as the date gets closer. If anything changes, we'll let you know.
        </p>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="padding:0 32px;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- SHARE -->
      <tr><td style="padding:24px 32px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Spread the Joy &#127881;</div>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#555;">
          Tell your family and friends. Entry is free, all are welcome.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:8px;">
              <a href="${WA_SHARE}" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#25D366;text-decoration:none;border-radius:999px;">WhatsApp this event &#8594;</a>
            </td>
            <td>
              <a href="${TG_SHARE}" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#0088cc;text-decoration:none;border-radius:999px;">Telegram &#8594;</a>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- SIGN OFF -->
      <tr><td style="padding:16px 32px 32px;" class="p-mobile">
        <p style="margin:0 0 4px;font-size:15px;color:#444;">Yours in service,</p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1e3a6e;">ISKM Singapore</p>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="padding:0;background:#1e3a6e;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="padding:32px 24px;color:#ffffff;">
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#ffffff;margin-bottom:8px;">ISKM Singapore</div>
            <div style="font-size:13px;color:#f8a4c0;margin-bottom:16px;">International Sri Krishna Mandir</div>
            <div style="font-size:13px;color:#ffffff;opacity:0.7;line-height:1.8;">
              <a href="https://srikrishnamandir.org" style="color:#f4c96b;text-decoration:none;">srikrishnamandir.org</a> &nbsp;&#183;&nbsp;
              <a href="https://www.facebook.com/iskm.sg/" style="color:#f4c96b;text-decoration:none;">Facebook</a> &nbsp;&#183;&nbsp;
              <a href="mailto:contact@srikrishnamandir.org" style="color:#f4c96b;text-decoration:none;">contact@srikrishnamandir.org</a>
            </div>
            <div style="font-size:12px;color:#ffffff;opacity:0.5;margin-top:16px;line-height:1.6;">
              No. 9 Lorong 29 Geylang, Singapore 388062<br>
              +65 6250 2280<br>
              &#169; 2026 International Sri Krishna Mandir
            </div>
            <div style="font-size:11px;color:#ffffff;opacity:0.4;margin-top:16px;">
              You received this because you registered for Kids Ratha Y&#x101;tr&#x101; 2026.<br>
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
    /href="(https:\/\/events\.srikrishnamandir\.org\/kids-ratha-yatra-2026[^"]*)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'event_page', url)}"`
  );
  html = html.replace(
    /href="(https:\/\/wa\.me\/\?text=[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'share_whatsapp', url)}"`
  );
  html = html.replace(
    /href="(https:\/\/t\.me\/share[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'share_telegram', url)}"`
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

    const { data: reg } = await supabase
      .from("kids_ratha_yatra_registrations")
      .select("confirmation_sent")
      .eq("id", registration_id)
      .single();

    if (reg?.confirmation_sent) {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstName = name.trim().split(/\s+/)[0];

    const { data: existingToken } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", email)
      .is("used_at", null)
      .maybeSingle();

    let token = existingToken?.token;
    if (!token) {
      token = crypto.randomUUID();
      await supabase.from("email_unsubscribe_tokens").insert({ email, token });
    }

    const unsubscribeUrl = "https://events.srikrishnamandir.org/unsubscribe?token=" + token;
    const trackBase = supabaseUrl + "/functions/v1/track-email";
    const pixelUrl = `${trackBase}?t=o&et=kry-confirm&rid=${registration_id}&e=${encodeURIComponent(email)}`;

    let html = renderTemplate(CONFIRMATION_HTML, {
      first_name: firstName,
      unsubscribe_url: unsubscribeUrl,
      tracking_pixel: `<img src="${pixelUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`,
    });

    html = addClickTracking(html, trackBase, registration_id, "kry-confirm", email);

    const text = `Thank you, ${firstName}. Your seat is reserved for Kids Ratha Yatra 2026.\n\nSaturday, 27 June 2026\n6:00 PM to 9:00 PM\nISKM Capark, Singapore\n\nChildren-led kirtana, joyful stalls, the chariot procession, and free prasadam for the whole family.\n\nWe'll send you two short reminders as the date gets closer.\n\nTell your family and friends. Entry is free, all are welcome.\n\nView event page: ${EVENT_URL}\n\nUnsubscribe: ${unsubscribeUrl}`;

    const messageId = "kry-confirm-" + registration_id;

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: email,
        from: "ISKM Singapore <noreply@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: "You're in, " + firstName + ". Kids Ratha Y\u0101tr\u0101 2026 is locked in. \uD83C\uDF3A",
        html,
        text,
        purpose: "transactional",
        label: "kkry-confirmation",
        message_id: messageId,
        idempotency_key: "kry-confirm-" + registration_id,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "kkry-confirmation",
      recipient_email: email,
      status: "pending",
    });

    await supabase
      .from("kids_ratha_yatra_registrations")
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
