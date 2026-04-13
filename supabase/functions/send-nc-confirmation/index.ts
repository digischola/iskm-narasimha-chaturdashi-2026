import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.101.1/cors";

const CONFIRMATION_HTML = await Deno.readTextFile(
  new URL("../_shared/nc-email-templates/confirmation.html", import.meta.url)
);

function renderTemplate(html: string, vars: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
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
    const unsubscribeUrl = `https://events.srikrishnamandir.org/unsubscribe?token=${token}`;

    // Store unsubscribe token
    await supabase.from("email_unsubscribe_tokens").insert({
      email,
      token,
    });

    const html = renderTemplate(CONFIRMATION_HTML, {
      first_name: firstName,
      unsubscribe_url: unsubscribeUrl,
    });

    const messageId = `nc-confirm-${registration_id}`;
    const idempotencyKey = `nc-confirm-${registration_id}`;

    // Enqueue the email
    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: email,
        from: "ISKM Singapore <contact@srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: `You're in, ${firstName} — Śrī Nṛsiṁha Caturdaśī 2026 🦁`,
        html,
        purpose: "transactional",
        label: "nc-confirmation",
        message_id: messageId,
        idempotency_key: idempotencyKey,
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
