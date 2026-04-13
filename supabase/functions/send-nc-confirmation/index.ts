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
<title>You're in — Śrī Nṛsiṁha Caturdaśī 2026</title>
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
  Thursday 30 April · 6:30 PM. Your seat is saved. A few things to know before you come.
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
        <img src="https://events.srikrishnamandir.org/images/logo.webp" width="72" height="72" alt="ISKM Singapore" style="display:block;border-radius:50%;border:2px solid #f4c96b;">
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:13px;font-weight:700;color:#1e3a6e;letter-spacing:2px;text-transform:uppercase;margin-top:12px;">ISKM Singapore</div>
      </td></tr>

      <!-- HERO -->
      <tr><td align="center" style="padding:24px 24px 8px;" class="p-mobile">
        <div style="display:inline-block;padding:6px 14px;background:#fdf5ed;border:1px solid #f4c96b;border-radius:999px;font-size:11px;font-weight:700;color:#1e3a6e;letter-spacing:1.5px;text-transform:uppercase;">✓ Registration Confirmed</div>
      </td></tr>

      <tr><td align="center" style="padding:16px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:700;color:#1e3a6e;line-height:1.15;letter-spacing:-0.5px;">
          You're in, {{first_name}}.
        </h1>
      </td></tr>

      <tr><td align="center" style="padding:8px 32px 24px;" class="p-mobile">
        <p style="margin:0;font-size:17px;line-height:1.6;color:#555555;max-width:460px;">
          Your seat for Śrī Nṛsiṁha Caturdaśī 2026 is saved.
        </p>
      </td></tr>

      <!-- DATE CARD (NAVY) -->
      <tr><td style="padding:0 24px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e3a6e;border-radius:14px;">
          <tr><td align="center" style="padding:28px 24px;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Save the Date</div>
            <div class="hero-date" style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;color:#ffffff;line-height:1.2;margin-bottom:6px;">Thursday, 30 April 2026</div>
            <div style="font-size:16px;color:#f8a4c0;font-weight:600;margin-bottom:20px;">6:30 PM – 10:00 PM</div>
            <div style="font-size:14px;color:#ffffff;opacity:0.85;line-height:1.5;">
              International Sri Krishna Mandir<br>
              No.9 Lorong 29 Geylang, #03-02<br>
              Singapore 388065
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
          On Thursday, 30 April 2026, we gather at the temple for one of the most powerful evenings in the Vaiṣṇava calendar — the appearance of <strong style="color:#1e3a6e;">Lord Nṛsiṁhadeva, the Supreme Protector</strong>.
        </p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#444444;">
          He is the Lord who came from a pillar to defend Prahlāda. He is the form who protects those who simply take shelter. Showing up on this day is not a small thing. It is seen.
        </p>
      </td></tr>

      <!-- PRIMARY CTA -->
      <tr><td align="center" style="padding:8px 32px 32px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:999px;background:#f8a4c0;">
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=%C5%9Ar%C4%AB+N%E1%B9%9Bsi%E1%B9%81ha+Caturda%C5%9B%C4%AB+2026&dates=20260430T103000Z/20260430T140000Z&details=ISKM+Singapore+%E2%80%94+https%3A%2F%2Fevents.srikrishnamandir.org%2Fnrsimha-caturdasi-2026&location=No.9+Lorong+29+Geylang+%2303-02+Singapore+388065" class="btn-primary" style="display:inline-block;padding:16px 36px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;background:#f8a4c0;">Add to Calendar →</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="padding:0 32px;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- SCHEDULE SECTION -->
      <tr><td style="padding:32px 32px 8px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Your Evening</div>
        <h2 class="h2" style="margin:0 0 20px;font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:700;color:#1e3a6e;">Hour by Hour</h2>
      </td></tr>

      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;width:140px;">6:30 – 7:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Ārati & Kīrtana</strong><br>
              <span style="color:#777;font-size:14px;">Evening worship to open the night</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">7:00 – 8:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Grand Abhiṣeka</strong> <span style="display:inline-block;padding:2px 8px;background:#f4c96b;color:#1e3a6e;font-size:11px;font-weight:700;border-radius:999px;letter-spacing:0.5px;">HIGHLIGHT</span><br>
              <span style="color:#777;font-size:14px;">The centrepiece — don't miss this</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;border-bottom:1px solid #eee6d8;vertical-align:top;">8:00 – 10:00 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <strong style="color:#1e3a6e;">Cultural Programme</strong><br>
              <span style="color:#777;font-size:14px;">Celebrating the Lord's pastimes</span>
            </td>
          </tr>
          <tr>
            <td class="schedule-time" style="padding:12px 0;font-size:15px;font-weight:700;color:#1e3a6e;vertical-align:top;">8:30 PM</td>
            <td style="padding:12px 0;font-size:15px;color:#444;vertical-align:top;">
              <strong style="color:#1e3a6e;">Prasādam Served</strong><br>
              <span style="color:#777;font-size:14px;">Sanctified vegetarian feast — free for all</span>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- FASTING BOX -->
      <tr><td style="padding:8px 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;border-left:4px solid #f4c96b;border-radius:8px;">
          <tr><td style="padding:20px 24px;">
            <div style="font-size:14px;font-weight:700;color:#1e3a6e;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">About Fasting</div>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
              Devotees traditionally fast from sunrise to sunset on this day, breaking it with Ekādaśī-style prasādam after the Lord's appearance at twilight.
            </p>
            <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#555;">
              <strong style="color:#1e3a6e;">New to fasting? Don't let it stop you.</strong> No fasting is required to attend. Come as you are. The Lord does not measure devotion by dietary rules — He measures it by who shows up.
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
              <strong style="color:#1e3a6e;">🚇 MRT:</strong> Aljunied (EW9) or Paya Lebar (CC9/EW9) — walking distance
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:15px;color:#444;line-height:1.6;">
              <strong style="color:#1e3a6e;">🚌 Bus:</strong> 2, 13, 21, 26, 40, 51, 67 — alight at Sims Ave (B10)
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:15px;color:#444;line-height:1.6;">
              <strong style="color:#1e3a6e;">🅿️ Parking:</strong> Limited on Lorong 29 — public transport is easier
            </td>
          </tr>
        </table>
        <div style="margin-top:16px;">
          <a href="https://www.google.com/maps/place/International+Sri+Krishna+Mandir+(ISKM)/@1.3146362,103.8807558,17z/data=!3m1!5s0x31da183c7fd36ed1:0x5a6dd216c71b14b1!4m6!3m5!1s0x31da183c80ceaac5:0x458ccd4e57b8697b!8m2!3d1.3146362!4d103.8856267!16s%2Fg%2F1tf33gsl" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;text-decoration:none;border:2px solid #1e3a6e;border-radius:999px;">Get Directions →</a>
        </div>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="padding:16px 32px 0;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- KAVACHA UPSELL -->
      <tr><td style="padding:32px 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1e3a6e,#2d4a7c);background-color:#1e3a6e;border-radius:14px;">
          <tr><td style="padding:28px 24px;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">A Gift From the Temple</div>
            <h3 style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:700;color:#ffffff;">Silver Nṛsiṁha Kavacha</h3>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#ffffff;opacity:0.9;">
              Specially made in Mayapur by a Gauḍīya Vaiṣṇava priest, blessed with the Nṛsiṁha Yantra. Traditionally worn for protection against obstacles.
            </p>
            <div style="margin-bottom:16px;">
              <span style="font-size:14px;color:#ffffff;opacity:0.6;text-decoration:line-through;">$351</span>
              <span style="font-size:22px;font-weight:700;color:#f4c96b;margin-left:8px;">$281.80</span>
              <span style="display:inline-block;margin-left:8px;padding:2px 8px;background:#f8a4c0;color:#1e3a6e;font-size:10px;font-weight:700;border-radius:999px;letter-spacing:0.5px;">FESTIVAL SPECIAL</span>
            </div>
            <a href="https://events.srikrishnamandir.org/nrsimha-caturdasi-2026#kavacha" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#1e3a6e;background:#f4c96b;text-decoration:none;border-radius:999px;">Reserve Yours →</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- SHARE SECTION -->
      <tr><td style="padding:24px 32px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Share the Mercy</div>
        <h3 style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:700;color:#1e3a6e;">Invite someone you love</h3>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#555;">
          If you know a friend, parent, or child who could use the Lord's protection right now — forward them this email. One of the few days in the year when invitation feels less like marketing and more like service.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:8px;">
              <a href="https://wa.me/?text=Join%20us%20for%20%C5%9Ar%C4%AB%20N%E1%B9%9Bsi%E1%B9%81ha%20Caturda%C5%9B%C4%AB%202026%20at%20ISKM%20Singapore%20on%20Thursday%2030%20April%2C%206%3A30%20PM.%20Free%20entry%2C%20all%20welcome.%20Register%3A%20https%3A%2F%2Fevents.srikrishnamandir.org%2Fnrsimha-caturdasi-2026" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#25D366;text-decoration:none;border-radius:999px;">WhatsApp</a>
            </td>
            <td style="padding-right:8px;">
              <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fevents.srikrishnamandir.org%2Fnrsimha-caturdasi-2026" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#1877F2;text-decoration:none;border-radius:999px;">Facebook</a>
            </td>
            <td>
              <a href="https://t.me/share/url?url=https%3A%2F%2Fevents.srikrishnamandir.org%2Fnrsimha-caturdasi-2026&text=Join%20us%20for%20%C5%9Ar%C4%AB%20N%E1%B9%9Bsi%E1%B9%81ha%20Caturda%C5%9B%C4%AB%202026" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;background:#0088cc;text-decoration:none;border-radius:999px;">Telegram</a>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- SIGN OFF -->
      <tr><td style="padding:24px 32px 8px;" class="p-mobile">
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#555;">
          Questions before Thursday? Reply to this email or WhatsApp us at <a href="https://wa.me/6562502280" style="color:#1e3a6e;font-weight:700;">+65 6250 2280</a>.
        </p>
        <p style="margin:16px 0 4px;font-size:15px;color:#444;">Yours in service,</p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1e3a6e;">ISKM Singapore</p>
      </td></tr>

      <!-- PS -->
      <tr><td style="padding:24px 32px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;border-radius:8px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#666;font-style:italic;">
              <strong style="color:#1e3a6e;font-style:normal;">P.S.</strong> The Grand Abhiṣeka at 7:00 PM is something most people experience once and never forget. Arrive by 6:45 PM if you want a good spot to see.
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
    <!-- END CONTAINER -->

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
      .from("registrations")
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

    const html = renderTemplate(CONFIRMATION_HTML, {
      first_name: firstName,
      unsubscribe_url: unsubscribeUrl,
    });

    const text = `You're in, ${firstName} — Śrī Nṛsiṁha Caturdaśī 2026\n\nYour seat is saved.\n\nThursday, 30 April 2026\n6:30 PM – 10:00 PM\nInternational Sri Krishna Mandir\nNo.9 Lorong 29 Geylang, #03-02, Singapore 388065\n\nSchedule:\n6:30–7:00 PM – Ārati & Kīrtana\n7:00–8:00 PM – Grand Abhiṣeka\n8:00–10:00 PM – Cultural Programme\n8:30 PM – Prasādam Served\n\nQuestions? WhatsApp +65 6250 2280\n\nISKM Singapore\nhttps://events.srikrishnamandir.org/nrsimha-caturdasi-2026\n\nUnsubscribe: ${unsubscribeUrl}`;

    const messageId = "nc-confirm-" + registration_id;
    const idempotencyKey = "nc-confirm-" + registration_id;

    // Enqueue the email
    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: email,
        from: "ISKM Singapore <contact@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: "You're in, " + firstName + " — Śrī Nṛsiṁha Caturdaśī 2026 🦁",
        html,
        text,
        purpose: "transactional",
        label: "nc-confirmation",
        message_id: messageId,
        idempotency_key: idempotencyKey,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    // Log pending
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "nc-confirmation",
      recipient_email: email,
      status: "pending",
    });

    // Mark confirmation_sent
    await supabase
      .from("registrations")
      .update({ confirmation_sent: true })
      .eq("id", registration_id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending confirmation:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
