import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const EVENT_URL = "https://events.srikrishnamandir.org/kids-ratha-yatra-2026";
const SEVA_URL = "https://events.srikrishnamandir.org/kids-ratha-yatra-2026#seva";
const MAPS_URL = "https://maps.app.goo.gl/nN1MNCH681zEcqdT6";

/* ═══════════════════════════════════════════════════════
   SHARED STYLES & STRUCTURE
   ═══════════════════════════════════════════════════════ */

const EMAIL_HEAD = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Kids Ratha Y&#x101;tr&#x101; 2026</title>
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
<body style="margin:0;padding:0;background:#fdf5ed;font-family:'Source Sans Pro',-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:#333333;">`;

const FOOTER = `
      <tr><td style="padding:16px 32px 32px;" class="p-mobile">
        <p style="margin:0 0 4px;font-size:15px;color:#444;">Yours in service,</p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1e3a6e;">ISKM Singapore</p>
      </td></tr>

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
</html>`;

/* ═══════════════════════════════════════════════════════
   T-14 TEMPLATE (21 Jun 2026)
   ═══════════════════════════════════════════════════════ */

const T14_HTML = `${EMAIL_HEAD}

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fdf5ed;">
  Programme schedule, what first-timers should know, and how to participate.
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

      <tr><td align="center" style="padding:24px 32px 8px;" class="p-mobile">
        <div style="display:inline-block;padding:6px 14px;background:#fdf5ed;border:1px solid #f4c96b;border-radius:999px;font-size:11px;font-weight:700;color:#1e3a6e;letter-spacing:1.5px;text-transform:uppercase;">&#128197; 2 Weeks Away</div>
      </td></tr>

      <tr><td align="center" style="padding:16px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:#1e3a6e;line-height:1.15;">
          Two weeks to Kids Ratha Y&#x101;tr&#x101; &#127802;
        </h1>
      </td></tr>

      <tr><td style="padding:16px 32px 24px;" class="p-mobile">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">
          {{first_name}}, two weeks until Saturday, 27 June at ISKM Singapore.
        </p>
      </td></tr>

      <!-- PROGRAMME SCHEDULE -->
      <tr><td style="padding:0 32px 8px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Programme Schedule &#127926;</div>
      </td></tr>

      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9efe2;border-radius:12px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">6:30 PM.</strong> &#256;rati in the temple hall</p>
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">7:00 PM.</strong> Deities brought down to the chariot</p>
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">7:10 PM.</strong> Speech, dance and welcome by the children</p>
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">7:25 PM.</strong> &#256;rati, k&#x12B;rtana &amp; coconut breaking</p>
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">7:40 PM.</strong> The chariot procession begins. This is the peak moment. &#10024;</p>
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">8:45 PM.</strong> Final &#x101;rati and group photos</p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">9:15 PM.</strong> Pras&#x101;dam feast begins &#127858;</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- FIRST-TIMERS NOTE -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:4px solid #f4c96b;border-radius:8px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0;font-size:15px;line-height:1.7;color:#555;">
              <strong style="color:#1e3a6e;">A short note for first-timers.</strong> Tradition holds that anyone who pulls the rope receives the blessing. Bring your family. &#128588;
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td align="center" style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:10px;background:#f8a4c0;">
            <a href="${EVENT_URL}#schedule" class="btn-primary" style="display:inline-block;padding:14px 28px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#1e3a6e;text-decoration:none;border-radius:10px;background:#f8a4c0;">View full schedule &#8594;</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="padding:0 32px;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- SEVA -->
      <tr><td style="padding:24px 32px;" class="p-mobile">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#555;">
          Want to be part of making it happen? Sponsor a sev&#x101;. From chariot construction to annad&#x101;nam (food sponsorship), every contribution helps. &#128591;
        </p>
        <a href="${SEVA_URL}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;text-decoration:none;border:2px solid #1e3a6e;border-radius:10px;">See sev&#x101; options &#8594;</a>
      </td></tr>

${FOOTER}`;

/* ═══════════════════════════════════════════════════════
   T-1 TEMPLATE (4 Jul 2026, 6 PM)
   ═══════════════════════════════════════════════════════ */

const T1_HTML = `${EMAIL_HEAD}

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fdf5ed;">
  Logistics, transport, what to bring.
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

      <tr><td align="center" style="padding:24px 32px 8px;" class="p-mobile">
        <div style="display:inline-block;padding:6px 14px;background:#fdf5ed;border:1px solid #f4c96b;border-radius:999px;font-size:11px;font-weight:700;color:#1e3a6e;letter-spacing:1.5px;text-transform:uppercase;">&#9200; Tomorrow</div>
      </td></tr>

      <tr><td align="center" style="padding:16px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:#1e3a6e;line-height:1.15;">
          Tomorrow at 6:30 PM &#127802;
        </h1>
      </td></tr>

      <tr><td style="padding:16px 32px 24px;" class="p-mobile">
        <p style="margin:0 0 8px;font-size:16px;line-height:1.7;color:#444444;">
          {{first_name}}, tomorrow is the day.
        </p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#444444;">
          Saturday, 27 June, doors 6:15 PM. &#256;rati at 6:30 PM, chariots roll at 7:40 PM.<br>
          ISKM Singapore, 9 Lorong 29 Geylang, Singapore 388062
        </p>
      </td></tr>

      <!-- TRANSPORT -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Quick Checklist &#128203;</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9efe2;border-radius:12px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; Take public transport. 14,000+ expected.</p>
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">Venue:</strong> ISKM Singapore, 9 Lorong 29 Geylang &mdash; directions on the event page &#128646;</p>
            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#444;">&#183; <strong style="color:#1e3a6e;">Buses</strong> 96, 175, 184, 282, 285 stop nearby &#128652;</p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#444;">&#183; On-site carpark fills early. Public transport is faster.</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- WHAT TO BRING -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">What to Bring &#127890;</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:4px solid #f4c96b;border-radius:8px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#555;">&#183; A water bottle &#128167;</p>
            <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#555;">&#183; Comfortable shoes for standing and walking &#128095;</p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#555;">&#183; Modest dress, especially if you're joining the procession</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- LATE NOTE -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <p style="margin:0;font-size:15px;line-height:1.7;color:#555;">
          If you're running late, the festival runs until 9:15 PM and pras&#x101;dam is served from 9:15 PM onwards. The free pras&#x101;dam feast is for the whole family. &#127858;
        </p>
      </td></tr>

      <!-- CTA -->
      <tr><td align="center" style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:10px;background:#f8a4c0;">
            <a href="${MAPS_URL}" class="btn-primary" style="display:inline-block;padding:14px 28px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#1e3a6e;text-decoration:none;border-radius:10px;background:#f8a4c0;">Get directions &#8594;</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- SEE YOU -->
      <tr><td style="padding:0 32px 16px;" class="p-mobile">
        <p style="margin:0;font-size:16px;line-height:1.7;color:#444;font-weight:600;">
          See you tomorrow. &#128591;
        </p>
      </td></tr>

${FOOTER}`;

const TEMPLATES: Record<string, { html: string; subject: (name: string) => string; trackPrefix: string; sentColumn: string; label: string }> = {
  "t-14": {
    html: T14_HTML,
    subject: (_name: string) => "Two weeks to Kids Ratha Y\u0101tr\u0101 2026 \uD83D\uDCC5",
    trackPrefix: "kkry-t14-",
    sentColumn: "t14_reminder_sent",
    label: "kkry-t14",
  },
  "t-1": {
    html: T1_HTML,
    subject: (_name: string) => "Tomorrow at 7 PM, Kids Ratha Y\u0101tr\u0101 2026 at ISKM Singapore \u23F0",
    trackPrefix: "kry-t1-",
    sentColumn: "t1_reminder_sent",
    label: "kry-t1",
  },
};

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
    /href="(https:\/\/events\.srikrishnamandir\.org\/kids-ratha-yatra-2026[^"]*)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'event_page', url)}"`
  );
  html = html.replace(
    /href="(https:\/\/srikrishnamandir\.org\/product\/[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'seva', url)}"`
  );
  html = html.replace(
    /href="(https:\/\/maps\.app\.goo\.gl[^"]+)"/g,
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

  let stage = "t-1";
  try {
    const body = await req.json();
    if (body?.stage && typeof body.stage === "string") {
      stage = body.stage;
    }
  } catch {
    // use default
  }

  const config = TEMPLATES[stage];
  if (!config) {
    return new Response(JSON.stringify({ error: "Invalid stage. Use 't-14' or 't-1'." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: registrations, error } = await supabase
    .from("kids_ratha_yatra_registrations")
    .select("id, name, email")
    .eq(config.sentColumn, false);

  if (error) {
    console.error("Failed to fetch RY registrations:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch registrations" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!registrations?.length) {
    return new Response(JSON.stringify({ processed: 0, message: "No pending " + stage + " reminders" }), {
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
      await supabase.from("kids_ratha_yatra_registrations").update({ [config.sentColumn]: true }).eq("id", reg.id);
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
    const pixelUrl = `${trackBase}?t=o&et=${config.label}&rid=${reg.id}&e=${encodeURIComponent(reg.email)}`;

    let html = renderTemplate(config.html, {
      first_name: firstName,
      unsubscribe_url: unsubscribeUrl,
      tracking_pixel: `<img src="${pixelUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`,
    });
    html = addClickTracking(html, trackBase, reg.id, config.label, reg.email);

    const subject = config.subject(firstName);
    const messageId = config.trackPrefix + reg.id;

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: reg.email,
        from: "ISKM Singapore <noreply@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject,
        html,
        text: subject + "\n\nView event: " + EVENT_URL + "\n\nUnsubscribe: " + unsubscribeUrl,
        purpose: "transactional",
        label: config.label,
        message_id: messageId,
        idempotency_key: messageId,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: config.label,
      recipient_email: reg.email,
      status: "pending",
    });

    await supabase.from("kids_ratha_yatra_registrations").update({ [config.sentColumn]: true }).eq("id", reg.id);
    processed++;

    if (processed < registrations.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log(`RY ${stage} batch complete: ${processed} queued, ${skipped} skipped`);
  return new Response(
    JSON.stringify({ processed, skipped, stage }),
    { headers: { "Content-Type": "application/json" } }
  );
});
