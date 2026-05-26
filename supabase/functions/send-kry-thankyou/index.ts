import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const EVENT_URL = "https://events.srikrishnamandir.org/kids-ratha-yatra-2026";
const WLF_URL = "https://events.srikrishnamandir.org/weekend-love-feast";
const SEVA_URL = "https://events.srikrishnamandir.org/kids-ratha-yatra-2026#seva";

const THANKYOU_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Thank you, Ratha Y&#x101;tr&#x101; 2026</title>
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
  Photos from the day, plus what's next at the temple.
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
        <div style="display:inline-block;padding:6px 14px;background:#fdf5ed;border:1px solid #f4c96b;border-radius:999px;font-size:11px;font-weight:700;color:#1e3a6e;letter-spacing:1.5px;text-transform:uppercase;">&#128591; Thank You</div>
      </td></tr>

      <tr><td align="center" style="padding:16px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:600;color:#1e3a6e;line-height:1.15;">
          Thank you, {{first_name}}. &#127802;
        </h1>
      </td></tr>

      <tr><td style="padding:16px 32px 24px;" class="p-mobile">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">
          {{first_name}}, thank you for being with us yesterday.
        </p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#444444;">
          Whether you pulled the rope, sang the k&#x12B;rtana, or simply received a plate of Pras&#x101;dam, you were part of something a thousand years in the making. &#10024;
        </p>
      </td></tr>

      <!-- PHOTOS CTA -->
      <tr><td align="center" style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:10px;background:#f8a4c0;">
            <a href="${EVENT_URL}" class="btn-primary" style="display:inline-block;padding:14px 28px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#1e3a6e;text-decoration:none;border-radius:10px;background:#f8a4c0;">View photos from the day &#128247; &#8594;</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="padding:0 32px;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- WLF CROSS-PROMO -->
      <tr><td style="padding:24px 32px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">What's Next &#127775;</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9efe2;border-radius:12px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:700;color:#1e3a6e;">Weekend Love Feast</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444;">
              The temple is open every weekend. Every Saturday and Sunday, 5:00 to 7:30 PM. All are welcome. Free 5-course Pras&#x101;dam Feast, k&#x12B;rtana, and G&#x12B;t&#x101; class. &#127926;
            </p>
            <a href="${WLF_URL}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;text-decoration:none;border:2px solid #1e3a6e;border-radius:10px;">Learn about Weekend Love Feast &#8594;</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- SEVA SOFT CTA -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#555;">
          If Ratha Y&#x101;tr&#x101; moved you, you can support the temple's ongoing work. &#128588;
        </p>
        <a href="${SEVA_URL}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;text-decoration:none;border:2px solid #1e3a6e;border-radius:10px;">Sponsor a sev&#x101; &#8594;</a>
      </td></tr>

      <!-- CLOSING -->
      <tr><td style="padding:0 32px 16px;" class="p-mobile">
        <p style="margin:0;font-size:16px;line-height:1.7;color:#444;font-weight:600;">
          Until next year. &#128591;
        </p>
      </td></tr>

      <!-- SIGN OFF & FOOTER -->
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
              You received this because you registered for Ratha Y&#x101;tr&#x101; 2026.<br>
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
    /href="(https:\/\/events\.srikrishnamandir\.org\/kids-ratha-yatra-2026[^"]*)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'photos', url)}"`
  );
  html = html.replace(
    /href="(https:\/\/events\.srikrishnamandir\.org\/weekend-love-feast[^"]*)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'wlf', url)}"`
  );
  html = html.replace(
    /href="(https:\/\/srikrishnamandir\.org\/product\/[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, 'seva', url)}"`
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
    .from("kids_ratha_yatra_registrations")
    .select("id, name, email")
    .eq("thankyou_sent", false);

  if (error) {
    console.error("Failed to fetch RY registrations:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch registrations" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!registrations?.length) {
    return new Response(JSON.stringify({ processed: 0, message: "No pending thank-you emails" }), {
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
      await supabase.from("kids_ratha_yatra_registrations").update({ thankyou_sent: true }).eq("id", reg.id);
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
    const pixelUrl = `${trackBase}?t=o&et=ry-thank&rid=${reg.id}&e=${encodeURIComponent(reg.email)}`;

    let html = renderTemplate(THANKYOU_HTML, {
      first_name: firstName,
      unsubscribe_url: unsubscribeUrl,
      tracking_pixel: `<img src="${pixelUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`,
    });
    html = addClickTracking(html, trackBase, reg.id, "ry-thank", reg.email);

    const messageId = "ry-thank-" + reg.id;

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: reg.email,
        from: "ISKM Singapore <noreply@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: "Thank you for joining us at Ratha Y\u0101tr\u0101 2026 \uD83D\uDE4F",
        html,
        text: `Thank you, ${firstName}. Whether you pulled the rope, sang the kirtana, or simply received a plate of Prasadam, you were part of something a thousand years in the making.\n\nWeekend Love Feast: ${WLF_URL}\nSponsor a seva: ${SEVA_URL}\n\nUnsubscribe: ${unsubscribeUrl}`,
        purpose: "transactional",
        label: "ry-thank",
        message_id: messageId,
        idempotency_key: messageId,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "ry-thank",
      recipient_email: reg.email,
      status: "pending",
    });

    await supabase.from("kids_ratha_yatra_registrations").update({ thankyou_sent: true }).eq("id", reg.id);
    processed++;

    if (processed < registrations.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log("RY Thank-you batch complete: " + processed + " queued, " + skipped + " skipped");
  return new Response(
    JSON.stringify({ processed, skipped }),
    { headers: { "Content-Type": "application/json" } }
  );
});
