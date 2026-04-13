import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const REMINDER_HTML = await Deno.readTextFile(
  new URL("../_shared/nc-email-templates/reminder.html", import.meta.url)
);

function renderTemplate(html: string, vars: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

Deno.serve(async (req) => {
  // Verify this is called by service_role (cron job)
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

  // Get all registrations that haven't received reminder
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

  // Get suppressed emails to skip
  const { data: suppressed } = await supabase
    .from("suppressed_emails")
    .select("email");
  const suppressedSet = new Set((suppressed || []).map((s) => s.email));

  // Get unsubscribed emails
  const { data: unsubscribed } = await supabase
    .from("email_unsubscribe_tokens")
    .select("email")
    .not("used_at", "is", null);
  const unsubscribedSet = new Set((unsubscribed || []).map((u) => u.email));

  let processed = 0;
  let skipped = 0;

  for (const reg of registrations) {
    // Skip suppressed/unsubscribed
    if (suppressedSet.has(reg.email) || unsubscribedSet.has(reg.email)) {
      // Mark as sent to avoid retrying
      await supabase
        .from("registrations")
        .update({ reminder_sent: true })
        .eq("id", reg.id);
      skipped++;
      continue;
    }

    const firstName = reg.name.trim().split(/\s+/)[0];

    // Get or create unsubscribe token
    const { data: existingToken } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", reg.email)
      .is("used_at", null)
      .maybeSingle();

    let token = existingToken?.token;
    if (!token) {
      token = crypto.randomUUID();
      await supabase.from("email_unsubscribe_tokens").insert({
        email: reg.email,
        token,
      });
    }

    const unsubscribeUrl = `https://events.srikrishnamandir.org/unsubscribe?token=${token}`;

    const html = renderTemplate(REMINDER_HTML, {
      first_name: firstName,
      unsubscribe_url: unsubscribeUrl,
    });

    const messageId = `nc-reminder-${reg.id}`;

    // Enqueue
    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: reg.email,
        from: "ISKM Singapore <contact@srikrishnamandir.org>",
        sender_domain: "notify.events.srikrishnamandir.org",
        subject: `Tomorrow, ${firstName} 🦁`,
        html,
        purpose: "transactional",
        label: "nc-reminder",
        message_id: messageId,
        idempotency_key: `nc-reminder-${reg.id}`,
        queued_at: new Date().toISOString(),
      },
    });

    // Log pending
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "nc-reminder",
      recipient_email: reg.email,
      status: "pending",
    });

    // Mark reminder_sent
    await supabase
      .from("registrations")
      .update({ reminder_sent: true })
      .eq("id", reg.id);

    processed++;

    // Small delay between enqueues
    if (processed < registrations.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log(`Reminder batch complete: ${processed} queued, ${skipped} skipped`);
  return new Response(
    JSON.stringify({ processed, skipped }),
    { headers: { "Content-Type": "application/json" } }
  );
});
