import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

/**
 * Sends Free Prasadam Program sponsorship confirmation email.
 * Body: {
 *   sponsorship_id: string,
 *   full_name: string,
 *   email: string,
 *   tier: string,           // "weekday-300" | "sunday-500"
 *   preferred_date: string, // ISO YYYY-MM-DD
 *   occasion?: string | null,
 *   dedication?: string | null
 * }
 *
 * SKIP RULE: if email_needs_backfill = true (queried from DB) OR email ends with
 * @needsbackfill.srikrishnamandir.org, do NOT send. Log it as "skipped — legacy
 * row, needs email backfill" and return success.
 */

const CONFIRMATION_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<title>Prasadam Sponsorship Received — ISKM Singapore</title>
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
    .hero-title { font-size: 28px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#fdf5ed;font-family:'Source Sans Pro',-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:#333333;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fdf5ed;">
  Reference {{ref_id_short}} · Your sponsorship is received. Coordinator will WhatsApp you next.
  &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp;&#847; &zwnj;
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
        <div style="display:inline-block;padding:6px 14px;background:#fdf5ed;border:1px solid #f4c96b;border-radius:999px;font-size:11px;font-weight:700;color:#1e3a6e;letter-spacing:1.5px;text-transform:uppercase;">✓ Sponsorship Received</div>
      </td></tr>

      <tr><td align="center" style="padding:16px 32px 8px;" class="p-mobile">
        <h1 class="hero-title" style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:34px;font-weight:700;color:#1e3a6e;line-height:1.2;letter-spacing:-0.5px;">
          Thank you, {{first_name}}.
        </h1>
      </td></tr>

      <tr><td align="center" style="padding:8px 32px 24px;" class="p-mobile">
        <p style="margin:0;font-size:17px;line-height:1.6;color:#555555;max-width:460px;">
          Your sponsorship for <strong style="color:#1e3a6e;">{{event_date_pretty}}</strong> is received. Our coordinator will reach out on WhatsApp within 24 hours with payment details.
        </p>
      </td></tr>

      <!-- DETAILS CARD -->
      <tr><td style="padding:0 24px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1e3a6e;border-radius:14px;">
          <tr><td style="padding:24px;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Your Sponsorship</div>
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;margin-bottom:14px;">{{tier_label}} — {{event_date_pretty}}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#ffffff;opacity:0.85;width:120px;">Reference</td>
                <td style="padding:6px 0;font-size:14px;color:#ffffff;font-family:monospace;">{{ref_id_short}}</td>
              </tr>
              {{occasion_row}}
              {{dedication_row}}
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#ffffff;opacity:0.85;">Meals provided</td>
                <td style="padding:6px 0;font-size:14px;color:#ffffff;">250 sanctified meals</td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">Hare Krishna {{first_name}},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444444;">
          Annadanam — the gift of food — is considered the highest form of giving in the Vedic tradition. On <strong style="color:#1e3a6e;">{{event_date_pretty}}</strong>, your sponsorship will feed 250 people in the Geylang and Little India area: migrant workers, elderly residents, students, families.
        </p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#444444;">
          {{dedication_paragraph}}
        </p>
      </td></tr>

      <!-- CALENDAR CTA -->
      <tr><td align="center" style="padding:8px 32px 32px;" class="p-mobile">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:999px;background:#f8a4c0;">
            <a href="{{calendar_url}}" class="btn-primary" style="display:inline-block;padding:16px 36px;font-family:'Source Sans Pro',Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;background:#f8a4c0;">Add to Calendar →</a>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:0 32px;" class="p-mobile"><div style="height:1px;background:#eee6d8;line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- WHAT HAPPENS NEXT -->
      <tr><td style="padding:32px 32px 8px;" class="p-mobile">
        <div style="font-size:12px;font-weight:700;color:#f4c96b;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">What Happens Next</div>
        <h2 style="margin:0 0 20px;font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:700;color:#1e3a6e;">3 Simple Steps</h2>
      </td></tr>

      <tr><td style="padding:0 32px 24px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:8px 0 14px;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;width:36px;">
              <div style="background:#f4c96b;color:#1e3a6e;width:28px;height:28px;border-radius:50%;text-align:center;font-weight:700;line-height:28px;font-size:14px;">1</div>
            </td>
            <td style="padding:8px 0 14px;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;line-height:1.6;">
              <strong style="color:#1e3a6e;">Coordinator WhatsApps you</strong> within 24 hours with PayNow / bank transfer details.
            </td>
          </tr>
          <tr>
            <td style="padding:14px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;">
              <div style="background:#f4c96b;color:#1e3a6e;width:28px;height:28px;border-radius:50%;text-align:center;font-weight:700;line-height:28px;font-size:14px;">2</div>
            </td>
            <td style="padding:14px 0;font-size:15px;color:#444;border-bottom:1px solid #eee6d8;vertical-align:top;line-height:1.6;">
              <strong style="color:#1e3a6e;">On your sponsored day</strong>, our team cooks the meals fresh, offers them with your dedication as sankalpa, and distributes 250 plates to the streets.
            </td>
          </tr>
          <tr>
            <td style="padding:14px 0 8px;font-size:15px;color:#444;vertical-align:top;">
              <div style="background:#f4c96b;color:#1e3a6e;width:28px;height:28px;border-radius:50%;text-align:center;font-weight:700;line-height:28px;font-size:14px;">3</div>
            </td>
            <td style="padding:14px 0 8px;font-size:15px;color:#444;vertical-align:top;line-height:1.6;">
              <strong style="color:#1e3a6e;">You receive photos</strong> on WhatsApp from the distribution so you can see exactly where your contribution went.
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- HELP -->
      <tr><td style="padding:24px 32px 8px;" class="p-mobile">
        <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#555;">
          Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/6562502280" style="color:#1e3a6e;font-weight:700;">+65 6250 2280</a>. Quote your reference <strong style="color:#1e3a6e;font-family:monospace;">{{ref_id_short}}</strong>.
        </p>
        <p style="margin:16px 0 4px;font-size:15px;color:#444;">Yours in service,</p>
        <p style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1e3a6e;">ISKM Singapore</p>
      </td></tr>

      <tr><td style="padding:24px 32px 32px;" class="p-mobile">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf5ed;border-radius:8px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#666;font-style:italic;">
              <strong style="color:#1e3a6e;font-style:normal;">P.S.</strong> You're warmly welcome to visit the kitchen on your sponsored day, help with cooking or packing, and personally hand meals to people on the street.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:0;background:#1e3a6e;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="padding:24px;color:#ffffff;font-size:13px;line-height:1.6;">
            <div style="margin-bottom:8px;font-weight:700;">ISKM Singapore</div>
            <div style="opacity:0.7;">No.9 Lorong 29 Geylang, #03-02 · Singapore 388065</div>
            <div style="margin-top:16px;font-size:12px;opacity:0.7;">
              <a href="https://events.srikrishnamandir.org/free-prasadam-program" style="color:#ffffff;opacity:0.7;">events.srikrishnamandir.org</a>
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
  html = html.replace(
    /href="(https:\/\/calendar\.google\.com\/[^"]+)"/g,
    (_, url) => `href="${trackUrl(trackBase, rid, et, email, "calendar", url)}"`,
  );
  return html;
}

function tierLabel(tier: string): string {
  if (tier === "sunday-500") return "Sunday Sponsorship ($500)";
  if (tier === "weekday-300") return "Weekday Sponsorship ($300)";
  return tier;
}

function buildCalendarUrl(eventDateIso: string, refId: string): string {
  const ymd = eventDateIso.replace(/-/g, "");
  return `https://www.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent("My Prasadam Sponsorship Day — ISKM Singapore")}` +
    `&dates=${ymd}/${ymd}` +
    `&details=${encodeURIComponent(`On this day your sponsorship will feed 250 people through ISKM Singapore's Free Prasadam Program.\n\nReference: ${refId}\n\nVenue: No.9 Lorong 29 Geylang, #03-02, Singapore 388065\n\nMore info: https://events.srikrishnamandir.org/free-prasadam-program`)}` +
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
    const { sponsorship_id, full_name, email, tier, preferred_date, occasion, dedication } = await req.json();

    if (!sponsorship_id || !full_name || !email || !tier || !preferred_date) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // SKIP RULE — legacy / placeholder rows
    const isPlaceholderEmail = String(email).endsWith("@needsbackfill.srikrishnamandir.org");
    let needsBackfill = isPlaceholderEmail;
    if (!needsBackfill) {
      const { data: row } = await supabase
        .from("prasadam_sponsorships")
        .select("email_needs_backfill")
        .eq("id", sponsorship_id)
        .maybeSingle();
      if (row?.email_needs_backfill) needsBackfill = true;
    }

    if (needsBackfill) {
      console.log(`send-prasadam-confirmation: skipped — legacy row, needs email backfill (id=${sponsorship_id})`);
      await supabase.from("email_send_log").insert({
        message_id: "prasadam-confirm-" + sponsorship_id,
        template_name: "prasadam-confirmation",
        recipient_email: String(email),
        status: "suppressed",
        error_message: "skipped — legacy row, needs email backfill",
      });
      return new Response(JSON.stringify({ success: true, skipped: true, reason: "needs_backfill" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messageId = "prasadam-confirm-" + sponsorship_id;

    // Idempotency: skip if already in email_send_log
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

    const firstName = String(full_name).trim().split(/\s+/)[0];
    const refIdShort = String(sponsorship_id).split("-")[0].toUpperCase();

    const token = crypto.randomUUID();
    const unsubscribeUrl = "https://events.srikrishnamandir.org/unsubscribe?token=" + token;
    await supabase.from("email_unsubscribe_tokens").insert({ email, token });

    const trackBase = supabaseUrl + "/functions/v1/track-email";
    const pixelUrl = `${trackBase}?t=o&et=prasadam-confirmation&rid=${sponsorship_id}&e=${encodeURIComponent(email)}`;

    const occasionRow = occasion
      ? `<tr><td style="padding:6px 0;font-size:14px;color:#ffffff;opacity:0.85;">Occasion</td><td style="padding:6px 0;font-size:14px;color:#ffffff;text-transform:capitalize;">${String(occasion)}</td></tr>`
      : "";
    const dedicationRow = dedication
      ? `<tr><td style="padding:6px 0;font-size:14px;color:#ffffff;opacity:0.85;vertical-align:top;">Dedication</td><td style="padding:6px 0;font-size:14px;color:#ffffff;font-style:italic;">"${String(dedication).replace(/"/g, "&quot;")}"</td></tr>`
      : "";
    const dedicationParagraph = dedication
      ? `Your dedication — "${String(dedication)}" — will be offered as a sankalpa (prayer) before cooking begins on your sponsored day.`
      : `If you'd like to add a dedication later, just reply to this email or send it via WhatsApp.`;

    let html = renderTemplate(CONFIRMATION_HTML, {
      first_name: firstName,
      ref_id_short: refIdShort,
      tier_label: tierLabel(tier),
      event_date_pretty: formatDatePretty(preferred_date),
      occasion_row: occasionRow,
      dedication_row: dedicationRow,
      dedication_paragraph: dedicationParagraph,
      calendar_url: buildCalendarUrl(preferred_date, refIdShort),
      unsubscribe_url: unsubscribeUrl,
      tracking_pixel: `<img src="${pixelUrl}" width="1" height="1" style="display:none;width:1px;height:1px;" alt="" />`,
    });

    html = addClickTracking(html, trackBase, sponsorship_id, "prasadam-confirmation", email);

    const text = `Thank you, ${firstName} — Prasadam Sponsorship Received\n\nReference: ${refIdShort}\n${tierLabel(tier)} — ${formatDatePretty(preferred_date)}\n${occasion ? `Occasion: ${occasion}\n` : ""}${dedication ? `Dedication: "${dedication}"\n` : ""}\nOur coordinator will WhatsApp you within 24 hours with payment details.\n\nQuestions? WhatsApp +65 6250 2280 (quote ${refIdShort}).\n\nISKM Singapore\nhttps://events.srikrishnamandir.org/free-prasadam-program\n\nUnsubscribe: ${unsubscribeUrl}`;

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: email,
        from: "ISKM Singapore <noreply@notify.events.srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: `Thank you, ${firstName} — Prasadam Sponsorship Received (Ref ${refIdShort}) 🙏`,
        html,
        text,
        purpose: "transactional",
        label: "prasadam-confirmation",
        message_id: messageId,
        idempotency_key: messageId,
        unsubscribe_token: token,
        queued_at: new Date().toISOString(),
      },
    });

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "prasadam-confirmation",
      recipient_email: email,
      status: "pending",
    });

    return new Response(JSON.stringify({ success: true, ref: refIdShort }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-prasadam-confirmation error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
