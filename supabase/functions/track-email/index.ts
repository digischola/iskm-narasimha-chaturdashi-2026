import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

// 1x1 transparent GIF
const PIXEL = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
  0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21,
  0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00,
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44,
  0x01, 0x00, 0x3b,
]);

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const type = url.searchParams.get("t"); // "o" = open, "c" = click
  const emailType = url.searchParams.get("et"); // confirmation / reminder
  const rid = url.searchParams.get("rid");
  const link = url.searchParams.get("l"); // link name for clicks
  const redirect = url.searchParams.get("r"); // redirect URL for clicks
  const recipientEmail = url.searchParams.get("e") || "";

  // Log tracking event asynchronously
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("email_tracking_events").insert({
      registration_id: rid || null,
      email_type: emailType || "unknown",
      event_type: type === "o" ? "open" : "click",
      link_name: link || null,
      recipient_email: decodeURIComponent(recipientEmail),
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || null,
      user_agent: req.headers.get("user-agent") || null,
    });
  } catch (e) {
    console.error("Tracking insert error:", e);
  }

  // Click → redirect
  if (type === "c" && redirect) {
    // Re-encode any non-ASCII chars so the Location header stays ByteString-safe
    const target = encodeURI(decodeURIComponent(redirect));
    return new Response(null, {
      status: 302,
      headers: { Location: target },
    });
  }

  // Open → pixel
  return new Response(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
});
