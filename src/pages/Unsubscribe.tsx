import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<Status>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
        const resp = await fetch(url, {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        });
        const result = await resp.json();
        if (result.valid) {
          setStatus("valid");
        } else if (result.already_unsubscribed) {
          setStatus("already_unsubscribed");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    setSubmitting(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ token }),
      });
      const result = await resp.json();
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf5ed", fontFamily: "'Source Sans Pro', -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ background: "white", padding: "48px 40px", borderRadius: "16px", boxShadow: "0 8px 40px rgba(30,58,110,0.08)", maxWidth: "460px", width: "100%", textAlign: "center" }}>
        <img src="/images/logo.webp" alt="ISKM Singapore Logo" width="56" height="56" style={{ borderRadius: "50%", border: "2px solid #f4c96b", marginBottom: "20px" }} />
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1e3a6e", fontSize: "24px", marginBottom: "16px" }}>
          {status === "loading" && "Checking..."}
          {status === "valid" && "Unsubscribe"}
          {status === "already_unsubscribed" && "Already Unsubscribed"}
          {status === "invalid" && "Invalid Link"}
          {status === "success" && "Unsubscribed"}
          {status === "error" && "Something Went Wrong"}
        </h1>

        {status === "loading" && (
          <p style={{ color: "#555", fontSize: "15px" }}>Validating your unsubscribe link...</p>
        )}

        {status === "valid" && (
          <>
            <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.6, marginBottom: "24px" }}>
              You'll stop receiving event emails from ISKM Singapore. You can always register again for future events.
            </p>
            <button
              onClick={handleUnsubscribe}
              disabled={submitting}
              style={{ padding: "14px 32px", background: "#1e3a6e", color: "white", border: "none", borderRadius: "999px", fontWeight: 700, fontSize: "15px", cursor: submitting ? "wait" : "pointer", opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Processing..." : "Confirm Unsubscribe"}
            </button>
          </>
        )}

        {status === "already_unsubscribed" && (
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.6 }}>
            You've already unsubscribed from event emails. No further action needed.
          </p>
        )}

        {status === "invalid" && (
          <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.6 }}>
            This unsubscribe link is invalid or has expired. If you need help, contact us at <a href="mailto:contact@srikrishnamandir.org" style={{ color: "#1e3a6e", fontWeight: 600 }}>contact@srikrishnamandir.org</a>.
          </p>
        )}

        {status === "success" && (
          <p style={{ color: "#27ae60", fontSize: "15px", lineHeight: 1.6 }}>
            You've been successfully unsubscribed. You won't receive any more event emails from us.
          </p>
        )}

        {status === "error" && (
          <p style={{ color: "#e74c3c", fontSize: "15px", lineHeight: 1.6 }}>
            Something went wrong. Please try again or contact <a href="mailto:contact@srikrishnamandir.org" style={{ color: "#1e3a6e", fontWeight: 600 }}>contact@srikrishnamandir.org</a>.
          </p>
        )}
      </div>
    </div>
  );
}
