/* Meta Pixel helper – fires client-side pixel events & server-side CAPI events */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

const PIXEL_ID = "584081669242535";

/** Generate a unique event ID for deduplication between pixel + CAPI */
export function genEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Fire a client-side Meta Pixel event */
export function trackPixelEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string,
) {
  if (typeof window !== "undefined" && window.fbq) {
    if (eventId) {
      window.fbq("track", eventName, params || {}, { eventID: eventId });
    } else {
      window.fbq("track", eventName, params || {});
    }
  }
}

/** Fire a server-side CAPI event via the edge function */
export async function trackCapiEvent({
  eventName,
  eventId,
  userEmail,
  userPhone,
  sourceUrl,
  customData,
}: {
  eventName: string;
  eventId: string;
  userEmail?: string;
  userPhone?: string;
  sourceUrl?: string;
  customData?: Record<string, unknown>;
}) {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.functions.invoke("meta-capi", {
      body: {
        event_name: eventName,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        user_email: userEmail,
        user_phone: userPhone,
        source_url: sourceUrl || window.location.href,
        custom_data: customData,
      },
    });
  } catch (err) {
    console.warn("CAPI tracking failed:", err);
  }
}
