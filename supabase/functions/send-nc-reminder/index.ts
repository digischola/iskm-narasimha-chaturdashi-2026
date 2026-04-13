import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const REMINDER_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Tomorrow — Śrī Nṛsiṁha Caturdaśī 2026</title>
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
    .stack { display: block !important; width: 100% !important; }
    .p-mobile { padding: 24px !important; }
    .hero-title { font-size: 36px !important; }
    .hero-sub { font-size: 16px !important; }
    .h2 { font-size: 24px !important; }
    .schedule-time { font-size: 14px !important; min-width: 110px !important; }
    .boon-narrative { padding: 20px !important; font-size: 15px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#fdf5ed;font-family:'Source Sans Pro',-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:#333333;">

<!-- PREHEADER -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fdf5ed;">
  Nṛsiṁhadeva appears tomorrow evening. Your final checklist inside.
  &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj;
</div>

<center style="width:100%;background:#fdf5ed;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;">
  <tr><td align="center" style="padding:32px 16px;">

    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(30,58,110,0.08);">

      <!-- GOLD ACCENT BAR -->
      <tr><td style="height:4px;background:linear-gradient(90deg,#f4c96b,#f8a4c0);background-color:#f4c96b;line-height:4px;font-size:0;">&nbsp;</td></tr>

      <!-- NAVY HERO (URGENCY) -->
      <tr><td style="background:#1e3a6e;padding:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="padding:48px 32px 40px;color:#ffffff;" class="p-mobile">
            <div style="display:inline-block;padding:6px 14px;background:rgba(248,164,192,0.2);border:1px solid #f8a4c0;border-radius:999px;font-size:11px;font-weight:700;color:#f8a4c0;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px;">
              <span style="display:inline-block;width:6px;height:6px;background:#f4c96b;border-radius:50%;margin-right:6px;"></span>
              24 Hours To Go
            </div>
            <h1 class="hero-title" style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:48px;font-weight:700;color:#ffffff;line-height:1.1;letter-spacing:-1px;">
              Tomorrow,<br>{{first_name}}. 🦁
            </h1>
            <p class="hero-sub" style="margin:0;font-size:17px;color:#f8a4c0;line-height:1.5;max-width:420px;margin:0 auto;">
              He appears at twilight. You'll be there.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- OPENING -->
      <tr><td style="padding:32px 32px 24px;" class="p-mobile">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">
          Hare Krishna {{first_name}},
        </p>
        <p style="margin:0 0 16px;font-size:17px;line-height:1.7;color:#444444;">
          Tomorrow evening, <strong style="color:#1e3a6e;">He appears</strong>.
        </p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#555;">
          Not metaphorically. At twilight on Thursday 30 April, at the precise junction between day and night — neither fully one nor the other, exactly as the boon required — Lord Nṛsiṁhadeva manifests again, as He has for thousands of years, in the hearts of those who gather.
        </p>
        <p style="margin:16px 0 0;font-size:17px;line-height:1.7;color:#1e3a6e;font-weight:700;">
          You'll be one of them.
        </p>
      </td></tr>

      <!-- DATE CARD -->
      <tr><td style="padding:0 32px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;border:2px solid #f4c96b;border-radius:14px;">
          <tr><td align="center" style="padding:24px 20px;">
            <div style="font-size:12px;font-weight:700;color:#1e3a6e;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Tomorrow</div>
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:700;color:#1e3a6e;line-height:1.2;margin-bottom:4px;">Thursday, 30 April 2026</div>
            <div style="font-size:15px;color:#666;font-weight:600;">6:30 PM – 10:00 PM</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- SCHEDULE -->
      <tr><td style="padding:0 32px 8px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Tomorrow's Flow</div>
        <h2 class="h2" style="margin:0 0 20px;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:700;color:#1e3a6e;">Keep this close.</h2>
      </td></tr>

      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;width:140px;">6:30 – 7:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Ārati & Kīrtana</strong><br>
              <span style="color:#c9536f;font-size:13px;font-weight:600;">Arrive by 6:20 for a good seat</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">7:00 – 8:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Grand Abhiṣeka</strong><br>
              <span style="color:#777;font-size:14px;">The evening's peak</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">8:00 – 10:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Cultural Programme</strong>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;vertical-align:top;">8:30 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;vertical-align:top;">
              <strong style="color:#1e3a6e;">Prasādam Served</strong>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- CHECKLIST -->
      <tr><td style="padding:8px 32px 24px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Before You Leave Home</div>
        <h3 class="h2" style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:700;color:#1e3a6e;">Your checklist</h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">
            <span style="color:#f4c96b;font-weight:700;margin-right:8px;">☐</span> Light fruit/milk through the day if fasting (or eat normally — your call)
          </td></tr>
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">
            <span style="color:#f4c96b;font-weight:700;margin-right:8px;">☐</span> Leave home by <strong>5:45 PM</strong> if taking MRT, <strong>6:00 PM</strong> if driving
          </td></tr>
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">
            <span style="color:#f4c96b;font-weight:700;margin-right:8px;">☐</span> Phone charged — you'll want photos of the Abhiṣeka
          </td></tr>
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">
            <span style="color:#f4c96b;font-weight:700;margin-right:8px;">☐</span> Modest, comfortable clothing — you'll be sitting on the floor
          </td></tr>
          <tr><td style="padding:8px 0;font-size:15px;color:#444;line-height:1.6;">
            <span style="color:#f4c96b;font-weight:700;margin-right:8px;">☐</span> Remove shoes before entering the temple hall
          </td></tr>
        </table>
      </td></tr>

      <!-- DIRECTIONS -->
      <tr><td style="padding:8px 32px 24px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Getting There</div>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#444;">
          <strong style="color:#1e3a6e;">MRT:</strong> Aljunied (EW9) or Paya Lebar (CC9/EW9)
        </p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#444;">
          <strong style="color:#1e3a6e;">Bus:</strong> 2, 13, 21, 26, 40, 51, 67 — Sims Ave (B10)
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444;">
          <strong style="color:#1e3a6e;">Parking:</strong> Limited on Lorong 29 — public transport is faster
        </p>
        <a href="https://www.google.com/maps/place/International+Sri+Krishna+Mandir+(ISKM)/@1.3146362,103.8807558,17z/data=!3m1!5s0x31da183c7fd36ed1:0x5a6dd216c71b14b1!4m6!3m5!1s0x31da183c80ceaac5:0x458ccd4e57b8697b!8m2!3d1.3146362!4d103.8856267!16s%2Fg%2F1tf33gsl" class="btn-primary" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#ffffff;background:#f8a4c0;text-decoration:none;border-radius:999px;">Open in Google Maps →</a>
      </td></tr>

      <!-- BOON NARRATIVE (THE EMOTIONAL PEAK) -->
      <tr><td style="padding:8px 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e3a6e;border-radius:14px;">
          <tr><td class="boon-narrative" style="padding:32px 28px;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Why Tomorrow Matters</div>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#ffffff;opacity:0.95;">
              Hiraṇyakaśipu had a boon: he could not be killed by man or beast, inside or outside, during day or night, on earth or in the sky, by any weapon.
            </p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#ffffff;opacity:0.95;">
              The boon was airtight.
            </p>
            <p style="margin:0 0 16px;font-size:17px;line-height:1.7;color:#f4c96b;font-weight:600;">
              The Lord found the seam.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="padding:4px 0;font-size:15px;line-height:1.7;color:#ffffff;opacity:0.9;">He came as <strong style="color:#f8a4c0;">half-man, half-lion</strong>.</td></tr>
              <tr><td style="padding:4px 0;font-size:15px;line-height:1.7;color:#ffffff;opacity:0.9;">At <strong style="color:#f8a4c0;">twilight</strong> — not day, not night.</td></tr>
              <tr><td style="padding:4px 0;font-size:15px;line-height:1.7;color:#ffffff;opacity:0.9;">On a <strong style="color:#f8a4c0;">threshold</strong> — not inside, not outside.</td></tr>
              <tr><td style="padding:4px 0;font-size:15px;line-height:1.7;color:#ffffff;opacity:0.9;">On <strong style="color:#f8a4c0;">His lap</strong> — not on earth, not in the sky.</td></tr>
              <tr><td style="padding:4px 0;font-size:15px;line-height:1.7;color:#ffffff;opacity:0.9;">With <strong style="color:#f8a4c0;">His nails</strong> — not a weapon.</td></tr>
            </table>
            <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#ffffff;opacity:0.95;">
              Every condition preserved. Every devotee protected.
            </p>
            <p style="margin:16px 0 0;font-size:16px;line-height:1.7;color:#f4c96b;font-weight:600;">
              This is the Lord you will stand before tomorrow. There is no situation in your life He cannot find a way through.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- CANT MAKE IT -->
      <tr><td style="padding:8px 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;border-left:4px solid #f8a4c0;border-radius:8px;">
          <tr><td style="padding:20px 24px;">
            <div style="font-size:13px;font-weight:700;color:#1e3a6e;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Running Late or Can't Make It?</div>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
              Please let us know so we can adjust the feast prep.<br>
              <a href="https://wa.me/6562502280" style="color:#1e3a6e;font-weight:700;">WhatsApp +65 6250 2280 →</a>
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- FINAL SHARE -->
      <tr><td style="padding:16px 32px 24px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">One Last Ask</div>
        <h3 class="h2" style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:700;color:#1e3a6e;">Bring someone with you.</h3>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#555;">
          Know someone who needs protection in their life right now? A parent battling illness, a friend going through something hard, a child starting out? Forward them this email. Let them stand before the Lord of Protection tomorrow.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:8px;">
              <a href="https://wa.me/?text=Join%20me%20at%20%C5%9Ar%C4%AB%20N%E1%B9%9Bsi%E1%B9%81ha%20Caturda%C5%9B%C4%AB%202026%20tomorrow%20at%20ISKM%20Singapore%2C%206%3A30%20PM.%20Free%20entry.%20https%3A%2F%2Fevents.srikrishnamandir.org%2Fnrsimha-caturdasi-2026" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#25D366;text-decoration:none;border-radius:999px;">WhatsApp</a>
            </td>
            <td style="padding-right:8px;">
              <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fevents.srikrishnamandir.org%2Fnrsimha-caturdasi-2026" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#1877F2;text-decoration:none;border-radius:999px;">Facebook</a>
            </td>
            <td>
              <a href="https://t.me/share/url?url=https%3A%2F%2Fevents.srikrishnamandir.org%2Fnrsimha-caturdasi-2026&text=Join%20me%20at%20%C5%9Ar%C4%AB%20N%E1%B9%9Bsi%E1%B9%81ha%20Caturda%C5%9B%C4%AB%202026%20tomorrow" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#0088cc;text-decoration:none;border-radius:999px;">Telegram</a>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- SIGN OFF -->
      <tr><td style="padding:16px 32px 8px;" class="p-mobile">
        <p style="margin:0 0 4px;font-size:17px;font-weight:600;color:#1e3a6e;">See you tomorrow evening.</p>
        <p style="margin:16px 0 4px;font-size:15px;color:#444;">Yours in service,</p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1e3a6e;">ISKM Singapore</p>
      </td></tr>

      <!-- PS -->
      <tr><td style="padding:24px 32px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;border-radius:8px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#666;font-style:italic;">
              <strong style="color:#1e3a6e;font-style:normal;">P.S.</strong> If you've booked the Silver Nṛsiṁha Kavacha, collect it at the front desk after the Abhiṣeka. Only a limited number remain.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="padding:0;background:#1e3a6e;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="padding:32px 24px;color:#ffffff;">
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#ffffff;margin-bottom:8px;">ISKM Singapore</div>
            <div style="font-size:13px;color:#f8a4c0;margin-bottom:20px;">International Sri Krishna Mandir</div>
            <div style="font-size:13px;color:#ffffff;opacity:0.7;line-height:1.8;">
              <a href="https://srikrishnamandir.org" style="color:#f4c96b;text-decoration:none;">srikrishnamandir.org</a> &nbsp;·&nbsp;
              <a href="https://www.facebook.com/iskm.sg/" style="color:#f4c96b;text-decoration:none;">Facebook</a> &nbsp;·&nbsp;
              <a href="mailto:contact@srikrishnamandir.org" style="color:#f4c96b;text-decoration:none;">contact@srikrishnamandir.org</a>
            </div>
            <div style="font-size:12px;color:#ffffff;opacity:0.5;margin-top:20px;line-height:1.6;">
              No.9 Lorong 29 Geylang, #03-02, Singapore 388065<br>
              © 2026 International Sri Krishna Mandir
            </div>
            <div style="font-size:11px;color:#ffffff;opacity:0.4;margin-top:16px;">
              You received this because you registered for Śrī Nṛsiṁha Caturdaśī 2026.<br>
              <a href="{{unsubscribe_url}}" style="color:#ffffff;opacity:0.7;">Unsubscribe</a>
            </div>
          </td></tr>
        </table>
      </td></tr>

    </table>

  </td></tr>
</table>
</center>

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // TEST MODE: send a single test reminder to a specified email
  let testMode = false;
  let testEmail = "";
  let testName = "Test User";
  try {
    const body = await req.clone().json();
    if (body?.test_email) {
      testMode = true;
      testEmail = body.test_email;
      testName = body.test_name || "Test User";
    }
  } catch { /* no body = normal cron mode */ }

  if (!testMode) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (testMode) {
    // Send single test reminder
    const firstName = testName.trim().split(/\s+/)[0];
    const token = crypto.randomUUID();
    const unsubscribeUrl = "https://events.srikrishnamandir.org/unsubscribe?token=" + token;
    await supabase.from("email_unsubscribe_tokens").insert({ email: testEmail, token });
    const html = renderTemplate(REMINDER_HTML, { first_name: firstName, unsubscribe_url: unsubscribeUrl });
    const text = `Tomorrow, ${firstName} — Śrī Nṛsiṁha Caturdaśī 2026\n\nThursday, 30 April 2026\n6:30 PM – 10:00 PM\nInternational Sri Krishna Mandir\nNo.9 Lorong 29 Geylang, #03-02, Singapore 388065\n\nUnsubscribe: ${unsubscribeUrl}`;
    const messageId = "nc-reminder-test-" + crypto.randomUUID().slice(0, 8);
    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: testEmail,
        from: "ISKM Singapore <contact@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: "Tomorrow, " + firstName + " 🦁",
        html,
        text,
        purpose: "transactional",
        label: "nc-reminder",
        message_id: messageId,
        idempotency_key: messageId,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "nc-reminder",
      recipient_email: testEmail,
      status: "pending",
    });
    return new Response(JSON.stringify({ success: true, test: true, message_id: messageId }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("id, name, email")
    .eq("reminder_sent", false);

  if (error) {
    console.error("Failed to fetch registrations:", error);
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
      await supabase.from("registrations").update({ reminder_sent: true }).eq("id", reg.id);
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
    const html = renderTemplate(REMINDER_HTML, { first_name: firstName, unsubscribe_url: unsubscribeUrl });
    const text = `Tomorrow, ${firstName} — Śrī Nṛsiṁha Caturdaśī 2026\n\nThursday, 30 April 2026\n6:30 PM – 10:00 PM\nInternational Sri Krishna Mandir\nNo.9 Lorong 29 Geylang, #03-02, Singapore 388065\n\nSchedule:\n6:30–7:00 PM – Ārati & Kīrtana\n7:00–8:00 PM – Grand Abhiṣeka\n8:00–10:00 PM – Cultural Programme\n8:30 PM – Prasādam Served\n\nGet Directions: https://maps.app.goo.gl/ISKM\n\nUnsubscribe: ${unsubscribeUrl}`;
    const messageId = "nc-reminder-" + reg.id;

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: reg.email,
        from: "ISKM Singapore <contact@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: "Tomorrow, " + firstName + " 🦁",
        html,
        text,
        purpose: "transactional",
        label: "nc-reminder",
        message_id: messageId,
        idempotency_key: "nc-reminder-" + reg.id,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "nc-reminder",
      recipient_email: reg.email,
      status: "pending",
    });

    await supabase.from("registrations").update({ reminder_sent: true }).eq("id", reg.id);
    processed++;

    if (processed < registrations.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log("Reminder batch complete: " + processed + " queued, " + skipped + " skipped");
  return new Response(
    JSON.stringify({ processed, skipped }),
    { headers: { "Content-Type": "application/json" } }
  );
});
