/* eslint-disable */
import { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { trackPixelEvent, genEventId, trackCapiEvent } from "@/lib/meta-pixel";
import { supabase } from "@/integrations/supabase/client";
import RathaYatraWheel from "@/components/RathaYatraWheel";
import "./RathaYatra.css";

const EVENT = {
  slug: "ratha_yatra_2026",
  title: "Ratha Yātrā 2026",
  date: "Sunday, 5 July 2026",
  time: "5:00 PM – 9:30 PM",
  venue: "Clementi Stadium",
  venueAddress: "10 West Coast Walk, Singapore 127156",
  countdownIso: "2026-07-05T17:00:00+08:00",
  url: "https://events.srikrishnamandir.org/ratha-yatra-2026",
  pixelContent: "Ratha Yatra 2026",
};

/* ═══ FLIP-CARD DIGIT — split-flap clock per digit ═══ */
function FlipDigit({ value }: { value: number }) {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (prev !== value) {
      setFlipping(true);
      const t = setTimeout(() => {
        setFlipping(false);
        setPrev(value);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  const next = String(value).padStart(2, "0").split("");
  const old = String(prev).padStart(2, "0").split("");

  return (
    <div className="flip-num">
      {next.map((digit, i) => {
        const oldDigit = old[i] ?? digit;
        const changed = digit !== oldDigit && flipping;
        return (
          <span key={i} className={`flip-card${changed ? " flipping" : ""}`}>
            <span className="flip-half flip-top">
              <span>{digit}</span>
            </span>
            <span className="flip-half flip-bottom">
              <span>{oldDigit}</span>
            </span>
            <span className="flip-flap flip-flap-top">
              <span>{oldDigit}</span>
            </span>
            <span className="flip-flap flip-flap-bottom">
              <span>{digit}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

/* ═══ MANDALA SVG DIVIDER ═══ */
function MandalaDivider() {
  const N = 12;
  return (
    <div className="mandala-divider animate-in" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <g stroke="currentColor" fill="none" strokeLinecap="round">
          <circle cx="100" cy="100" r="36" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="55" strokeWidth="0.4" strokeDasharray="2 4" />
          <circle cx="100" cy="100" r="78" strokeWidth="0.6" />
          <circle cx="100" cy="100" r="92" strokeWidth="0.3" strokeDasharray="1 3" />
          {Array.from({ length: N }).map((_, i) => {
            const a = (i * 360) / N;
            const r1 = 36,
              r2 = 78;
            const x1 = 100 + r1 * Math.cos((a * Math.PI) / 180);
            const y1 = 100 + r1 * Math.sin((a * Math.PI) / 180);
            const x2 = 100 + r2 * Math.cos((a * Math.PI) / 180);
            const y2 = 100 + r2 * Math.sin((a * Math.PI) / 180);
            const cxp = 100 + 57 * Math.cos((a * Math.PI) / 180);
            const cyp = 100 + 57 * Math.sin((a * Math.PI) / 180);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.4" />
                <circle cx={cxp} cy={cyp} r="6" strokeWidth="0.5" />
                <circle cx={cxp} cy={cyp} r="2" fill="currentColor" stroke="none" />
              </g>
            );
          })}
          <circle cx="100" cy="100" r="3" fill="currentColor" stroke="none" />
        </g>
      </svg>
    </div>
  );
}

/* ═══ HOOKS ═══ */
function useCountdown(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, done: false });
  const [prevS, setPrevS] = useState(-1);
  const [digitChange, setDigitChange] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0, done: true });
        return;
      }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      setTime({ d, h, m, s, done: false });
      if (s !== prevS) {
        setDigitChange(true);
        setPrevS(s);
        setTimeout(() => setDigitChange(false), 300);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target, prevS]);

  return { ...time, digitChange };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handler = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? window.scrollY / docH : 0);
      setScrolled(window.scrollY > 10);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return { progress, scrolled, pastHero };
}

function useAnimateOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );
    const observe = () => {
      document.querySelectorAll(".animate-in:not(.visible)").forEach((el) => observer.observe(el));
    };
    observe();
    // Re-scan periodically to catch any late-rendered nodes
    const interval = setInterval(observe, 800);
    // Safety net: after 3s, force-show anything still hidden
    const fallback = setTimeout(() => {
      document.querySelectorAll(".animate-in:not(.visible)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add("visible");
      });
    }, 3000);
    return () => {
      observer.disconnect();
      clearInterval(interval);
      clearTimeout(fallback);
    };
  }, []);
}

function useParallax() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const y = window.scrollY * 0.15;
      ref.current.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return ref;
}

/* Scroll-linked timeline draw — sets --timeline-progress 0..1 on the .timeline element
   based on how much of the timeline section has scrolled past the viewport's middle. */
function useScrollLinkedTimeline() {
  useEffect(() => {
    // If browser supports animation-timeline: view(), CSS handles it natively. Skip JS.
    if (CSS && CSS.supports && CSS.supports("animation-timeline: view()")) return;
    const update = () => {
      const el = document.querySelector(".timeline") as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when top hits viewport bottom, 1 when bottom hits viewport top — clamped
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      el.style.setProperty("--timeline-progress", String(p));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
}

/* ═══ NAVBAR ═══ */
function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav className={`sticky-nav${scrolled ? " scrolled" : ""}`}>
        <a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer" className="nav-brand">
          <img src="/images/logo.webp" alt="ISKM Singapore" width="28" height="28" />
          <span>ISKM Singapore</span>
        </a>
        <div className="nav-links">
          <a href="#about" className="desk-link">
            About
          </a>
          <a href="#schedule" className="desk-link">
            Schedule
          </a>
          <a href="#highlights" className="desk-link">
            Highlights
          </a>
          <a href="#seva" className="desk-link">
            Sevā
          </a>
          <a href="#location" className="desk-link">
            Venue
          </a>
          <a href="#register" className="nav-cta cta-glow">
            Register Free
          </a>
        </div>
      </nav>
    </>
  );
}

/* ═══ MOBILE CHIP BAR (sticky after hero) ═══ */
function ChipBar({ visible }: { visible: boolean }) {
  return (
    <div className={`chip-bar${visible ? " visible" : ""}`}>
      <a href="#schedule" className="chip">
        Schedule
      </a>
      <a href="#seva" className="chip">
        Sevā
      </a>
      <a href="#gallery" className="chip">
        Gallery
      </a>
      <a href="#faq" className="chip">
        FAQ
      </a>
    </div>
  );
}

/* ═══ HERO INLINE CHIPS (mobile, inside hero) ═══ */
function HeroChips() {
  return (
    <div className="hero-chips">
      <a href="#schedule" className="hero-chip">
        Schedule
      </a>
      <a href="#seva" className="hero-chip">
        Sevā
      </a>
      <a href="#gallery" className="hero-chip">
        Gallery
      </a>
      <a href="#faq" className="hero-chip">
        FAQ
      </a>
    </div>
  );
}

/* ═══ HERO ═══ */
function Hero() {
  const { d, h, m, s, done, digitChange } = useCountdown(EVENT.countdownIso);
  const parallaxRef = useParallax();

  return (
    <section className="hero hero-animated" id="main-content">
      {/* Ornate rotating chariot wheel background */}
      <div className="hero-wheel-layer" aria-hidden="true">
        <RathaYatraWheel className="hero-wheel-ornate" rotationSeconds={90} />
      </div>
      {/* Floating gold marigold petals */}
      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="petal" />
        ))}
      </div>
      <div className="hero-top">
        <div className="hero-content hero-centered">
          <div className="hero-eyebrow">ISKM Singapore Presents</div>
          <h1>
            Ratha Yātrā <span className="accent">2026</span>
          </h1>
          <p className="hero-tagline">
            Pull the rope. Sing the kīrtana.
            <br />
            Take home the blessing.
          </p>
          <div className="hero-meta hero-meta-stacked">
            <div className="hero-meta-item">
              <div className="icon-circle">
                <i className="fas fa-calendar"></i>
              </div>
              <span>{EVENT.date}</span>
            </div>
            <div className="hero-meta-item">
              <div className="icon-circle">
                <i className="fas fa-clock"></i>
              </div>
              <span>{EVENT.time}</span>
            </div>
            <div className="hero-meta-item">
              <div className="icon-circle">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <span>{EVENT.venue}</span>
            </div>
          </div>
          {done ? (
            <div style={{ color: "var(--gold)", fontSize: "17px", fontWeight: 600 }}>
              The festival is happening now!
            </div>
          ) : (
            <div className="countdown-row ry-countdown">
              <div className="cd-pill">
                <FlipDigit value={d} />
                <div className="lbl">Days</div>
              </div>
              <div className="cd-pill">
                <FlipDigit value={h} />
                <div className="lbl">Hours</div>
              </div>
              <div className="cd-pill">
                <FlipDigit value={m} />
                <div className="lbl">Mins</div>
              </div>
              <div className="cd-pill">
                <FlipDigit value={s} />
                <div className="lbl">Secs</div>
              </div>
            </div>
          )}
          <a href="#register" className="btn-hero-cta cta-glow">
            Register Free →
          </a>
        </div>
        {/* Framed hero painting */}
        <div className="hero-painting" ref={parallaxRef}>
          <img
            src="/images/ratha-yatra/hero.svg"
            alt="Lord Jagannāth atop the Ratha chariot"
            fetchPriority="high"
            decoding="async"
            loading="eager"
            width="680"
            height="850"
          />
        </div>
      </div>
    </section>
  );
}

/* ═══ REGISTRATION FORM ═══ */
function RegistrationForm({ onRegister }: { onRegister: (count: number) => void }) {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+65");
  const [phoneNum, setPhoneNum] = useState("");
  const [attendees, setAttendees] = useState("");
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const [emailDupStatus, setEmailDupStatus] = useState<"idle" | "checking" | "ok" | "duplicate">("idle");
  const [phoneDupStatus, setPhoneDupStatus] = useState<"idle" | "checking" | "ok" | "duplicate">("idle");

  const handleNameChange = (v: string) => {
    setName(v);
    setNameValid(v.trim().length >= 2);
  };
  const handleEmailChange = (v: string) => {
    setEmail(v);
    const valid = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(v);
    setEmailValid(valid);
    if (!valid) setEmailDupStatus("idle");
  };

  const checkEmailDuplicate = async () => {
    if (!emailValid) return;
    setEmailDupStatus("checking");
    try {
      const { data } = await supabase.functions.invoke("check-duplicate", {
        body: { field: "email", value: email.trim(), event_slug: EVENT.slug },
      });
      setEmailDupStatus(data?.exists ? "duplicate" : "ok");
    } catch {
      setEmailDupStatus("idle");
    }
  };

  const stripPhoneFormatting = (v: string) => v.replace(/[\s\-().]/g, "");
  const getFullPhone = () => {
    const digits = stripPhoneFormatting(phoneNum);
    return digits ? `${phoneCode}${digits}` : "";
  };
  const isPhoneValid = () => {
    const digits = stripPhoneFormatting(phoneNum);
    if (!digits) return false;
    const total = stripPhoneFormatting(phoneCode).replace("+", "").length + digits.length;
    return /^\d+$/.test(digits) && total >= 8 && total <= 15;
  };

  const checkPhoneDuplicate = async () => {
    const digits = stripPhoneFormatting(phoneNum);
    if (!digits || !isPhoneValid()) return;
    setPhoneDupStatus("checking");
    try {
      const fullPhone = getFullPhone();
      const { data } = await supabase.functions.invoke("check-duplicate", {
        body: { field: "phone", value: fullPhone, event_slug: EVENT.slug },
      });
      setPhoneDupStatus(data?.exists ? "duplicate" : "ok");
    } catch {
      setPhoneDupStatus("idle");
    }
  };

  const handlePhoneChange = (v: string) => {
    setPhoneNum(v);
    setPhoneDupStatus("idle");
  };

  const completeRegistration = async () => {
    if (emailDupStatus === "duplicate") {
      alert("This email is already registered. Please use a different email.");
      return;
    }
    if (phoneDupStatus === "duplicate") {
      alert("This phone number is already registered. Please use a different number.");
      return;
    }
    if (!isPhoneValid()) {
      alert("Please enter a valid phone number (8–15 digits).");
      return;
    }
    setSubmitting(true);
    const numAtt = attendees === "9" ? 9 : parseInt(attendees);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("submit-registration", {
        body: {
          name: name.trim(),
          email: email.trim(),
          phone: getFullPhone(),
          attendees: numAtt,
          is_volunteer: false,
          event_slug: EVENT.slug,
        },
      });

      if (fnError) {
        alert("Registration failed. Please try again.");
        setSubmitting(false);
        return;
      }
      if (data && data.error) {
        alert(data.error);
        setSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Registration save error:", err);
      alert("Registration failed. Please try again.");
      setSubmitting(false);
      return;
    }

    supabase.functions
      .invoke("sync-to-wabo", {
        body: {
          event_slug: EVENT.slug,
          source: `${EVENT.title} - Landing Page`,
          name: name.trim(),
          email: email.trim(),
          country_code: phoneCode,
          phone: phoneNum,
          attendees: attendees === "9" ? "8+" : attendees,
        },
      })
      .then(({ data, error }) => {
        if (error) console.error("Wabo sync error:", error);
        else if (data && data.ok === false) console.error("Wabo sync failed:", data);
      })
      .catch((e) => console.error("Wabo sync exception:", e));

    const eid = genEventId();
    trackPixelEvent("Lead", { content_name: EVENT.pixelContent }, eid);
    trackCapiEvent({
      eventName: "Lead",
      eventId: eid,
      userEmail: email.trim(),
      userPhone: getFullPhone() || undefined,
    });

    onRegister(numAtt);
    setSuccess(true);
    setSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeRegistration();
  };

  if (success) {
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT.title + " – " + EVENT.venue)}&dates=20260705T090000Z/20260705T133000Z&details=${encodeURIComponent("Three chariots, ecstatic kirtan, cultural performances, free 5-course prasadam.\n\nVenue: " + EVENT.venueAddress + "\n\nMore info: " + EVENT.url)}&location=${encodeURIComponent(EVENT.venueAddress)}`;
    return (
      <div className="reg-section" id="register">
        <div className="reg-card">
          <div className="form-success" style={{ display: "block" }}>
            <div className="confetti-container">
              {Array.from({ length: 30 }).map((_, i) => {
                const colors = ["#f4c96b", "#f8a4c0", "#ffb6c1", "#f5d78e", "#1e3a6e"];
                return (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 40}%`,
                      background: colors[i % 5],
                      animationDelay: `${Math.random() * 0.8}s`,
                      animationDuration: `${1 + Math.random()}s`,
                    }}
                  />
                );
              })}
            </div>
            <div className="check-icon">
              <i className="fas fa-check"></i>
            </div>
            <h3>You're in! 🌺</h3>
            <p>We've saved your spot for {EVENT.title}. Confirmation email coming up.</p>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "16px",
                padding: "12px 24px",
                background: "var(--navy)",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <i className="fas fa-calendar-plus"></i> Add to Google Calendar
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-section" id="register">
      <div className="reg-card">
        <div className="reg-card-header">
          <div className="reg-badge">
            <i className="fas fa-ticket-alt"></i> &nbsp;Free Entry
          </div>
          <h2>Register here</h2>
          <p>Free entry · Free 5-course feast · Whole family welcome</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ry-name">Full Name *</label>
            <div className="input-wrap">
              <input
                id="ry-name"
                type="text"
                placeholder="Your full name"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={nameValid ? "input-valid" : ""}
              />
              {nameValid && <i className="fas fa-check check-inline"></i>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ry-email">Email *</label>
              <div className="input-wrap">
                <input
                  id="ry-email"
                  type="email"
                  placeholder="you@email.com"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={checkEmailDuplicate}
                  className={
                    emailValid && emailDupStatus !== "duplicate"
                      ? "input-valid"
                      : emailDupStatus === "duplicate"
                        ? "input-error"
                        : ""
                  }
                />
                {emailDupStatus === "checking" && (
                  <i className="fas fa-spinner fa-spin check-inline" style={{ color: "#999" }}></i>
                )}
                {emailDupStatus === "ok" && <i className="fas fa-check check-inline" style={{ color: "#27ae60" }}></i>}
                {emailDupStatus === "duplicate" && (
                  <i className="fas fa-times check-inline" style={{ color: "#e74c3c" }}></i>
                )}
                {emailValid && emailDupStatus === "idle" && <i className="fas fa-check check-inline"></i>}
              </div>
              {emailDupStatus === "duplicate" && (
                <span style={{ color: "#e74c3c", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  This email is already registered
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="ry-phone">Phone *</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  aria-label="Country code"
                  value={phoneCode}
                  onChange={(e) => {
                    setPhoneCode(e.target.value);
                    setPhoneDupStatus("idle");
                  }}
                  style={{ width: "90px", flexShrink: 0 }}
                >
                  <option value="+65">+65</option>
                  <option value="+91">+91</option>
                  <option value="+60">+60</option>
                  <option value="+62">+62</option>
                  <option value="+63">+63</option>
                  <option value="+66">+66</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                  <option value="+82">+82</option>
                  <option value="+86">+86</option>
                </select>
                <div className="input-wrap" style={{ flex: 1 }}>
                  <input
                    id="ry-phone"
                    type="tel"
                    placeholder="XXXX XXXX"
                    value={phoneNum}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={checkPhoneDuplicate}
                    className={
                      phoneNum && !isPhoneValid()
                        ? "input-error"
                        : phoneDupStatus === "duplicate"
                          ? "input-error"
                          : phoneNum && isPhoneValid() && phoneDupStatus === "ok"
                            ? "input-valid"
                            : ""
                    }
                  />
                  {phoneDupStatus === "checking" && (
                    <i className="fas fa-spinner fa-spin check-inline" style={{ color: "#999" }}></i>
                  )}
                  {phoneDupStatus === "ok" && (
                    <i className="fas fa-check check-inline" style={{ color: "#27ae60" }}></i>
                  )}
                  {phoneDupStatus === "duplicate" && (
                    <i className="fas fa-times check-inline" style={{ color: "#e74c3c" }}></i>
                  )}
                </div>
              </div>
              {phoneNum && !isPhoneValid() && (
                <span style={{ color: "#e74c3c", fontSize: "0.8rem", marginTop: "0.25rem" }}>Enter 8–15 digits</span>
              )}
              {phoneDupStatus === "duplicate" && (
                <span style={{ color: "#e74c3c", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  This phone number is already registered
                </span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ry-attendees">Number of Attendees *</label>
            <select id="ry-attendees" aria-label="Number of attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)} required>
              <option value="" disabled>
                Select number of attendees
              </option>
              <option value="1">1 Person</option>
              <option value="2">2 People</option>
              <option value="3">3 People</option>
              <option value="4">4 People</option>
              <option value="5">5 People</option>
              <option value="6">6 People</option>
              <option value="7">7 People</option>
              <option value="8">8 People</option>
              <option value="9">8+ People</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn-register cta-glow btn-register-navy"
            disabled={
              submitting ||
              !nameValid ||
              !emailValid ||
              !attendees ||
              !isPhoneValid() ||
              emailDupStatus === "duplicate" ||
              phoneDupStatus === "duplicate"
            }
          >
            {submitting ? "Submitting..." : "Register Free →"}
          </button>
          <div className="form-trust">
            <span>⭐ 4.6/5 on Google · 14,000+ joined in 2025 · 25+ years of seva</span>
          </div>
          <div className="form-walkin">
            <i className="fas fa-info-circle"></i>
            <span>Free entry · Confirmation email sent upon registration</span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══ STATS STRIP ═══ */
function Stats() {
  const [animated, setAnimated] = useState(false);
  const [values, setValues] = useState([0, 0, 0, 0]);
  const targets = [14000, 25, 3, 0];
  const labels = ["Attended in 2025", "Years in Singapore", "Grand Chariots", "Cost · Free 5-course feast"];
  const suffixes = ["+", "+", "", ""];
  const displays = ["count", "count", "count", "free"];

  useEffect(() => {
    if (!animated) return;
    targets.forEach((target, idx) => {
      if (target === 0) return;
      const step = Math.ceil(target / 60);
      let cur = 0;
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) {
          cur = target;
          clearInterval(timer);
        }
        setValues((prev) => {
          const n = [...prev];
          n[idx] = cur;
          return n;
        });
      }, 25);
    });
  }, [animated]);

  useEffect(() => {
    const el = document.querySelector(".stats-section");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stats-section">
      <div className="stats-inner">
        {targets.map((_, i) => (
          <div key={i} className="animate-in stat-tile">
            <div className="stat-number">
              {displays[i] === "free" ? "Free" : values[i].toLocaleString() + suffixes[i]}
            </div>
            <div className="stat-label">{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ ABOUT ═══ */
function About() {
  const [readMore, setReadMore] = useState(false);
  return (
    <div className="editorial-section" id="about">
      <div className="editorial-inner">
        <div className="animate-in">
          <div className="editorial-visual">
            <img
              src="/images/ratha-yatra/about.webp"
              alt="Ratha Yatra chariot procession with thousands of devotees"
              loading="lazy"
              decoding="async"
              width="800"
              height="500"
            />
          </div>
        </div>
        <div className="animate-in">
          <div className="editorial-text">
            <div
              className="overline"
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--navy-2)",
                marginBottom: "12px",
              }}
            >
              About the festival
            </div>
            <h2>Singapore's longest-running festival of chariots.</h2>
            <p>
              Ratha Yātrā is one of India's oldest continuously celebrated festivals. Originating in Puri, Odisha —
              where it has been celebrated for over a thousand years — it marks the annual journey of Lord Jagannath,
              his brother Lord Baladeva, and sister Goddess Subhadra Devi from their temple to visit the streets and
              bless their devotees.
            </p>
            <p>
              Traditionally held on the second day of the waxing moon in the month of Āṣāḍha (late June or early July),
              it has become one of the most famous Hindu festivals in India and around the world.
            </p>
            <button onClick={() => setReadMore(!readMore)} className="read-more-btn">
              {readMore ? "Show less ↑" : "Read more about the festival ↓"}
            </button>
            <div className={`read-more-content ${readMore ? "open" : ""}`}>
              <p>
                In Singapore, Sri Krishna Mandir has carried this tradition for over 25 years. In 2025, three new
                hand-pulled chariots were built — replacing units that had served devotees for decades. Each year,
                between 10,000 and 15,000 attendees gather at Clementi Stadium for an evening of chariots, cultural
                performances, ecstatic kirtan, and a free 5-course vegetarian feast.
              </p>
              <p>
                Unlike most temple festivals, Ratha Yātrā is open to everyone. There are no barriers. The Lord himself
                comes out to bless the streets — and tradition holds that anyone who pulls the rope receives that
                blessing.
              </p>
              <p>
                <strong>Whether you've come every year or it's your first time, you are welcome here.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ SCHEDULE ═══ */
const ChariotIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3 L13 6 L18 6 L17 9 L19 12 L18 14 L6 14 L5 12 L7 9 L6 6 L11 6 Z" />
    <circle cx="8" cy="18" r="2.4" />
    <circle cx="16" cy="18" r="2.4" />
    <line x1="8" y1="14" x2="8" y2="16" />
    <line x1="16" y1="14" x2="16" y2="16" />
  </svg>
);

const SCHEDULE_ITEMS = [
  {
    time: "5:00 – 5:30 PM",
    title: "Guest of Honour & Temple President's Address",
    desc: "Welcome and opening remarks before the divine procession.",
    icon: <i className="fas fa-microphone-lines"></i>,
    highlight: false,
  },
  {
    time: "5:30 – 6:00 PM",
    title: "Cultural Odissi Dance · Deities Ascend Chariots & Mahā Ārati",
    desc: "Classical Odissi dancers welcome the arrival of the deities. Lord Jagannath, Lord Baladeva, and Goddess Subhadra take their place atop the three chariots, blessed by temple priests.",
    icon: <i className="fas fa-music"></i>,
    highlight: false,
  },
  {
    time: "6:00 – 9:00 PM",
    title: "Inauguration of Chariot Procession",
    desc: "Three hand-pulled chariots roll. Pull the rope yourself. Live ecstatic kirtan, free 5-course prasadam, and the Vaikuntha Spiritual Bazaar — the festival in full force.",
    icon: <ChariotIcon />,
    highlight: true,
    tag: "Peak Moment",
  },
  {
    time: "9:00 – 9:30 PM",
    title: "Final Ārati & Deities depart stadium",
    desc: "The chariots return, the final Ārati is offered, and the Lordships depart the festival ground.",
    icon: <i className="fas fa-fire"></i>,
    highlight: false,
  },
];

function Schedule() {
  return (
    <div className="section" id="schedule">
      <div className="sec-header animate-in">
        <div className="overline">Programme schedule</div>
        <h2>{EVENT.date}</h2>
        <div className="divider"></div>
        <p>5:00 PM – 9:30 PM · Clementi Stadium</p>
      </div>
      <div className="timeline-section animate-in">
        <div className="timeline">
          {SCHEDULE_ITEMS.map((item, i) => (
            <div key={i} className={`tl-item${item.highlight ? " highlight" : ""}`}>
              <div className="tl-dot">
                <span className="tl-icon">{item.icon}</span>
              </div>
              <div className="tl-time">{item.time}</div>
              <h4 className="tl-title">
                {item.title}
                {item.tag && <span className="tl-tag">{item.tag}</span>}
              </h4>
              {item.desc && <p className="tl-desc">{item.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ CHARIOT STICKY STORY ═══ */
const STORY_STAGES = [
  {
    num: "STAGE 01",
    title: "The deities ascend",
    body: "At 6 PM, Lord Jagannath, Lord Baladeva, and Goddess Subhadra Devi take their place atop the three chariots. The Mahā Ārati begins.",
    img: "/images/ratha-yatra/story-1.webp",
  },
  {
    num: "STAGE 02",
    title: "The ropes are lifted",
    body: "At 6:30, the procession begins. Hundreds reach for the rope. Strangers become brothers. The chariots roll forward together.",
    img: "/images/ratha-yatra/story-2.webp",
  },
  {
    num: "STAGE 03",
    title: "The blessing is yours",
    body: "For two and a half hours, the chariots circle the stadium with kirtana, flowers, and joy. The Lord smiles. Whoever pulls the rope receives the blessing.",
    img: "/images/ratha-yatra/story-3.webp",
  },
];

function ChariotStickyStory() {
  return (
    <section className="story-cards" id="story" aria-label="The festival journey">
      <div className="sec-header animate-in">
        <div className="overline">A three-act journey</div>
        <h2>How the festival unfolds</h2>
        <div className="divider"></div>
        <p>From the Mahā Ārati to the final blessing</p>
      </div>
      <div className="story-cards-stack">
        {STORY_STAGES.map((s, i) => (
          <article key={i} className={`story-card animate-in${i % 2 ? " story-card-reverse" : ""}`}>
            <div className="story-card-photo">
              <img src={s.img} alt={s.title} loading="lazy" decoding="async" width="600" height="400" />
            </div>
            <div className="story-card-text">
              <div className="story-card-label">{String(i + 1).padStart(2, "0")}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ═══ LAZY IFRAME — loads only when visible ═══ */
function LazyIframe({
  src,
  title,
  className,
  allow,
  allowFullScreen,
  rootMargin = "300px",
}: {
  src: string;
  title: string;
  className?: string;
  allow?: string;
  allowFullScreen?: boolean;
  rootMargin?: string;
}) {
  const [load, setLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return (
    <div ref={ref} style={{ minHeight: load ? undefined : "200px" }}>
      {load ? (
        <iframe
          src={src}
          title={title}
          className={className}
          frameBorder="0"
          allow={allow}
          allowFullScreen={allowFullScreen}
          loading="lazy"
        />
      ) : (
        <div
          style={{
            background: "#1a1a2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            borderRadius: "12px",
            color: "#ccc",
            fontSize: "14px",
          }}
        >
          Loading…
        </div>
      )}
    </div>
  );
}

/* ═══ VIDEO SECTION ═══ */
function VideoSection() {
  return (
    <div className="section video-section" id="video">
      <div className="sec-header animate-in">
        <div className="overline">Watch the 2026 promo</div>
        <h2>What awaits you on 5 July</h2>
        <div className="divider"></div>
      </div>
      <div className="video-wrap animate-in">
        <div className="yt-responsive">
          <LazyIframe
            src="https://www.youtube.com/embed/mYkgIK1HxFc?autoplay=1&mute=1&loop=1&playlist=mYkgIK1HxFc&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            title="Ratha Yātrā 2026 Promo"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

/* ═══ HIGHLIGHTS (What to Expect) ═══ */
const HIGHLIGHTS = [
  {
    img: "/images/ratha-yatra/h1-chariot.webp",
    title: "Divine Chariot Procession",
    desc: "Three newly-built hand-pulled chariots carry Lord Jagannath, Baladeva, and Subhadra Devi around the stadium.",
  },
  {
    img: "/images/ratha-yatra/h2-balloons.webp",
    title: "20ft Balloons",
    desc: "Towering 20-foot inflatable figures of the Lordships welcome devotees as they arrive.",
  },
  {
    img: "/images/ratha-yatra/h3-dance.webp",
    title: "Cultural Odissi Dance",
    desc: "Singapore's classical Odissi dancers perform welcoming ceremonies as the deities arrive.",
  },
  {
    img: "/images/ratha-yatra/h4-bazaar.webp",
    title: "Vaikuntha Spiritual Bazaar",
    desc: "A festival marketplace of unique products, handmade crafts, devotional items, and street food.",
  },
  {
    img: "/images/ratha-yatra/h5-kirtan.webp",
    title: "Ecstatic Kirtan",
    desc: "Live mantra chanting with mridanga drums, harmonium, and thousands of voices in joyful rhythm.",
  },
  {
    img: "/images/ratha-yatra/h6-prasadam.webp",
    title: "Free 5-Course Prasādam",
    desc: "A complete vegetarian feast — sanctified, prepared in our temple kitchen, served free to every attendee.",
  },
];

function Highlights() {
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };
  return (
    <div className="section" id="highlights">
      <div className="sec-header animate-in">
        <div className="overline">What to expect</div>
        <h2>Six festival highlights</h2>
        <div className="divider"></div>
        <p>Every reason to be there on 5 July</p>
      </div>
      <div className="expect-grid">
        {HIGHLIGHTS.map((c) => (
          <div key={c.title} className="expect-card animate-in" onMouseMove={handleMove}>
            <img
              className="expect-card-img"
              src={c.img}
              alt={c.title}
              loading="lazy"
              decoding="async"
              width="400"
              height="220"
            />
            <div className="expect-card-body">
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ GALLERY ═══ */
function Gallery() {
  const [idx, setIdx] = useState(0);
  const total = 12;

  const getPerView = useCallback(() => (window.innerWidth <= 768 ? 1 : 3), []);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const handler = () => setPerView(getPerView());
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [getPerView]);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % (total - perView + 1)), 4000);
    return () => clearInterval(id);
  }, [perView]);

  const scroll = (dir: number) => setIdx((i) => Math.max(0, Math.min(i + dir, total - perView)));

  return (
    <div className="section" id="gallery" style={{ paddingTop: 0 }}>
      <div className="sec-header animate-in">
        <div className="overline">Past celebrations</div>
        <h2>Relive the festival</h2>
        <div className="divider"></div>
        <p>Real moments from our recent Ratha Yātrā festivals at Clementi Stadium</p>
      </div>
      <div className="gallery-wrap">
        <button className="gallery-btn prev" onClick={() => scroll(-1)} aria-label="Previous">
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="gallery-viewport">
          <div className="gallery-track" style={{ transform: `translateX(-${idx * (100 / perView)}%)` }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="gallery-slide">
                <img
                  src={`/images/ratha-yatra/g${i + 1}.webp`}
                  alt={`Ratha Yātrā gallery ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="280"
                />
              </div>
            ))}
          </div>
        </div>
        <button className="gallery-btn next" onClick={() => scroll(1)} aria-label="Next">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

/* ═══ SEVA + FUNDRAISING ═══ */
const SEVA_CARDS = [
  {
    title: "Chariots Construction",
    desc: "Help complete the construction of Lord Jagannath's three new hand-pulled chariots.",
    link: "https://srikrishnamandir.org/product/chariot-construction-seva-2026/",
    img: "/images/ratha-yatra/chariot-seva.webp",
  },
  {
    title: "Annadānam Sevā",
    desc: "Sponsor sanctified prasādam (food) for thousands of devotees attending the festival.",
    link: "https://srikrishnamandir.org/product/ratha-yatra-annadanam-sevam-2026/",
    img: "/images/ratha-yatra/annadanam-seva.webp",
  },
  {
    title: "Sri Jagannātha Sevā",
    desc: "Make a special offering directly to Lord Jagannath, Baladeva, and Subhadra Devi.",
    link: "https://srikrishnamandir.org/product/ratha-yatra-sri-jagannatha-seva-2026/",
    img: "/images/ratha-yatra/sri-jagannatha-seva.webp",
  },
  {
    title: "Sri Sringāra Sevā",
    desc: "Sponsor handmade ornaments and dresses for the Lordships' festival appearance.",
    link: "https://srikrishnamandir.org/product/ratha-yatra-sri-sringara-seva/",
    img: "/images/ratha-yatra/sri-sringara-seva.webp",
  },
  {
    title: "Puṣpa-Alaṅkāra Sevā",
    desc: "Sponsor the flowers and decorations that adorn Lord Jagannath's chariots.",
    link: "https://srikrishnamandir.org/product/ratha-yatra-pu%E1%B9%A3pa-ala%E1%B9%85kara-seva-2026/",
    img: "/images/ratha-yatra/pushpa-alankara-seva.webp",
  },
  {
    title: "Outright Contribution",
    desc: "Offer general support for the festival and receive Lord Jagannath's blessings.",
    link: "https://srikrishnamandir.org/product/ratha-yatra-outright-contribution-2026/",
    cta: "Donate · any amount →",
    img: "/images/ratha-yatra/outright-contribution.webp",
  },
];

function FundraisingBar() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fundraising-card animate-in" ref={ref}>
      <div className="fundraising-text">
        <div className="overline">Chariot Fundraising</div>
        <h3>$100,000 raised. $50,000 to go.</h3>
        <p>
          Help us complete the construction of Lord Jagannath's three new chariots — built in 2025 to replace those that
          served devotees for decades.
        </p>
      </div>
      <div className="fundraising-progress">
        <div className="fp-track">
          <div className="fp-fill" style={{ width: animated ? "66.6%" : "0%" }}></div>
        </div>
        <div className="fp-labels">
          <span className="fp-raised">$100,000 raised</span>
          <span className="fp-goal">$150,000 goal</span>
        </div>
        <a
          href="https://srikrishnamandir.org/product/chariot-construction-seva-2026/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fundraising cta-glow"
        >
          Sponsor Chariots Construction · from $10 →
        </a>
      </div>
    </div>
  );
}

function Seva() {
  return (
    <div className="section" id="seva">
      <div className="sec-header animate-in">
        <div className="overline">How you can serve</div>
        <h2>Be part of Lord Jagannath's festival</h2>
        <div className="divider"></div>
        <p>Six ways to participate beyond attending — every contribution helps make the festival possible</p>
      </div>
      <FundraisingBar />
      <div className="seva-grid">
        {SEVA_CARDS.map((c) => (
          <div key={c.title} className="seva-card animate-in">
            <div className="seva-card-img">
              <img src={c.img} alt={c.title} loading="lazy" decoding="async" width="400" height="250" />
            </div>
            <div className="seva-card-body">
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
              <a href={c.link} target="_blank" rel="noopener noreferrer" className="seva-btn">
                {c.cta || "Sponsor · from $10 →"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ FAQ ═══ */
const FAQ_DATA = [
  {
    q: "Do I need to register to attend?",
    a: "Yes — please pre-register so we can plan seating, food, and parking properly. Registration is free and takes 30 seconds. Registered attendees receive a confirmation reminder and an exclusive WhatsApp update on event day.",
  },
  {
    q: "Is the event free?",
    a: "Yes — entry and the 5-course feast are completely free for all attendees. Sevā donations are welcomed but never required.",
  },
  {
    q: "Are children welcome?",
    a: "Yes, families with children are warmly welcomed. The festival is family-friendly with cultural performances, free food, and the chariot procession that everyone can enjoy.",
  },
  {
    q: "How do I get there? Is there parking?",
    a: "Clementi Stadium is at 10 West Coast Walk, Singapore 127156. Closest MRT is Clementi (EW23, East-West Line), about a 15-minute walk. Bus services 96, 175, 184, 282, and 285 stop nearby. There is an on-site stadium carpark (paid, hourly rate) but with 14,000+ expected attendees, public transport is strongly recommended.",
  },
  {
    q: "What should I wear?",
    a: "Smart casual or traditional Indian attire is welcome. The event is outdoors, so wear comfortable shoes for standing and walking, and bring a water bottle. Modest dress is appreciated for those who would like to participate in the chariot procession.",
  },
  {
    q: "Will there be vegetarian food?",
    a: "Yes — all food served is vegetarian. The 5-course prasādam is sanctified and prepared in our temple kitchen.",
  },
  {
    q: "Will there be seating for elderly attendees?",
    a: "Yes, we have reserved seating for elderly attendees and pregnant guests. Please WhatsApp us at +65 6250 2280 to arrange priority access.",
  },
  {
    q: "Can my company sponsor or volunteer?",
    a: "Yes — corporate sponsorship opportunities and volunteer roles (kitchen, setup, media documentation) are available. Email contact@srikrishnamandir.org or WhatsApp +65 6250 2280 to enquire.",
  },
];

function FAQ() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="faq-section" id="faq">
      <div className="sec-header animate-in">
        <div className="overline">Have questions?</div>
        <h2>Frequently asked questions</h2>
        <div className="divider"></div>
        <p>Everything you need to know before 5 July</p>
      </div>
      <div className="faq-list animate-in">
        {FAQ_DATA.map((item, i) => (
          <div key={i} className="faq-item">
            <button
              className={`faq-question${active === i ? " active" : ""}`}
              onClick={() => setActive(active === i ? null : i)}
            >
              {item.q} <i className="fas fa-chevron-down"></i>
            </button>
            <div className={`faq-answer${active === i ? " open" : ""}`}>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ LOCATION ═══ */
function Location() {
  return (
    <div className="section" id="location">
      <div className="sec-header animate-in">
        <div className="overline">Venue</div>
        <h2>Getting there</h2>
        <div className="divider"></div>
      </div>
      <div className="location-wrap animate-in">
        <div className="loc-map">
          <LazyIframe
            src="https://www.google.com/maps?q=Clementi+Stadium,+10+West+Coast+Walk,+Singapore+127156&output=embed"
            allowFullScreen
            title="Clementi Stadium Map"
          />
        </div>
        <div className="loc-info">
          <h3>Clementi Stadium</h3>
          <div className="loc-detail">
            <i className="fas fa-map-marker-alt"></i>
            <span>
              10 West Coast Walk
              <br />
              Singapore 127156
            </span>
          </div>
          <div className="loc-detail">
            <i className="fas fa-calendar"></i>
            <span>{EVENT.date}</span>
          </div>
          <div className="loc-detail">
            <i className="fas fa-clock"></i>
            <span>{EVENT.time}</span>
          </div>
          <div className="loc-detail">
            <i className="fas fa-phone"></i>
            <span>+(65) 6250 2280</span>
          </div>
          <div className="loc-transport">
            <h4>Getting here</h4>
            <p className="loc-transport-item">
              <i className="fas fa-train"></i> Clementi MRT (EW23) — ~15-min walk via West Coast Walk
            </p>
            <p className="loc-transport-item">
              <i className="fas fa-bus"></i> Bus routes 96 · 175 · 184 · 282 · 285 stop nearby
            </p>
            <p className="loc-transport-item">
              <i className="fas fa-parking"></i> On-site stadium carpark (paid, hourly). Public transport strongly
              recommended on event day.
            </p>
            <p className="loc-transport-item">
              <i className="fas fa-wheelchair"></i> Wheelchair accessible · Family-friendly · All welcome
            </p>
          </div>
          <a
            href="https://maps.app.goo.gl/nN1MNCH681zEcqdT6"
            target="_blank"
            rel="noopener noreferrer"
            className="directions-btn"
          >
            <i className="fas fa-directions"></i> Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══ SHARE ═══ */
function Share() {
  const [copyText, setCopyText] = useState("Copy Link");
  const copyLink = () => {
    navigator.clipboard.writeText(EVENT.url).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy Link"), 2000);
    });
  };
  const openGoogleCalendar = () => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT.title + " at " + EVENT.venue)}&dates=20260705T090000Z/20260705T133000Z&details=${encodeURIComponent("Three chariots, ecstatic kirtan, cultural performances, free 5-course prasadam. Register: " + EVENT.url)}&location=${encodeURIComponent(EVENT.venueAddress)}`;
    window.open(url, "_blank");
  };

  const waText = encodeURIComponent(`I'm going to ${EVENT.title} at ${EVENT.venue}! Join me → ${EVENT.url}`);
  const tgText = encodeURIComponent(`Join me at ${EVENT.title} — ${EVENT.venue}, ${EVENT.date}`);

  return (
    <div className="share-section">
      <div className="sec-header animate-in" style={{ marginBottom: 0 }}>
        <div className="overline">Tell a friend</div>
        <h2>Bring your family &amp; community</h2>
        <div className="divider"></div>
      </div>
      <div className="share-row animate-in">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-pill pill-wa"
        >
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(EVENT.url)}&text=${tgText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-pill pill-tg"
        >
          <i className="fab fa-telegram"></i> Telegram
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openGoogleCalendar();
          }}
          className="share-pill pill-cal"
        >
          <i className="fas fa-calendar-plus"></i> Add to Calendar
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            copyLink();
          }}
          className="share-pill pill-copy"
        >
          <i className="fas fa-link"></i> <span>{copyText}</span>
        </a>
      </div>
    </div>
  );
}

/* ═══ FINAL CTA ═══ */
function FinalCTA() {
  return (
    <div className="final-cta animate-in">
      <div className="final-cta-bg">
        <img src="/images/ratha-yatra/final-cta.webp" alt="" loading="lazy" decoding="async" width="1200" height="600" />
      </div>
      <div className="final-cta-overlay"></div>
      <div className="final-cta-content">
        <h2>A 1,000-year tradition comes to Clementi Stadium.</h2>
        <p>
          {EVENT.date} · 5:00 PM · {EVENT.venue}
        </p>
        <a href="#register" className="btn-final cta-glow">
          Register Free →
        </a>
      </div>
    </div>
  );
}

/* ═══ FOOTER ═══ */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner footer-inner-2col">
        <div className="footer-col">
          <img src="/images/logo.webp" alt="ISKM Singapore" width="52" height="52" />
          <p className="footer-brand">ISKM Singapore</p>
          <a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer">
            srikrishnamandir.org
          </a>
          <div className="footer-social" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <a href="https://www.facebook.com/iskm.sg" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook" /></a>
            <a href="https://www.youtube.com/@iskmtv" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube" /></a>
            <a href="https://www.instagram.com/iskm.sg/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram" /></a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <p>
            No.9 Lorong 29 Geylang
            <br />
            #03-02, Singapore 388065
          </p>
          <a href="mailto:contact@srikrishnamandir.org">contact@srikrishnamandir.org</a>
          <a href="https://wa.me/6562502280" target="_blank" rel="noopener noreferrer">
            WhatsApp us →
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 ISKM Singapore. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ═══ MOBILE BOTTOM NAV ═══ */
function MobileSticky({ pastHero }: { pastHero: boolean }) {
  return (
    <>
      {/* Sticky Register button — visible while in hero */}
      <div className={`mobile-register-sticky${pastHero ? " hidden" : ""}`}>
        <a href="#register" className="btn-mobile-register cta-glow">
          Register Now — Free
        </a>
      </div>
      {/* Nav bar — slides up after scrolling past hero */}
      <nav className={`mobile-bottom-nav${pastHero ? " visible" : ""}`} aria-label="Quick navigation">
        <a href="#schedule" className="mb-item">
          <i className="fas fa-calendar-day"></i>
          <span>Schedule</span>
        </a>
        <a href="#highlights" className="mb-item">
          <i className="fas fa-star"></i>
          <span>Highlights</span>
        </a>
        <a href="#seva" className="mb-item">
          <i className="fas fa-hand-holding-heart"></i>
          <span>Sevā</span>
        </a>
        <a href="#register" className="mb-item mb-item-cta">
          <i className="fas fa-ticket"></i>
          <span>Register</span>
        </a>
      </nav>
      <div style={{ height: "76px" }} className="mobile-spacer"></div>
      <style>{`.mobile-spacer{display:none}@media(max-width:768px){.mobile-spacer{display:block}}`}</style>
    </>
  );
}

/* ═══ LANDING PAGE ═══ */
function LandingPage() {
  const { progress, scrolled, pastHero } = useScrollProgress();
  const [, setSpotsCount] = useState(14000);
  useAnimateOnScroll();
  useScrollLinkedTimeline();

  useEffect(() => {
    trackPixelEvent("ViewContent", { content_name: EVENT.pixelContent });
  }, []);

  const handleRegister = (count: number) => {
    setSpotsCount((prev) => prev + count);
  };

  return (
    <>
      <Helmet>
        <title>Ratha Yātrā 2026 — Sri Krishna Mandir Singapore</title>
        <meta
          name="description"
          content="Register free for Ratha Yātrā 2026 at Clementi Stadium, Singapore. Three grand chariots, ecstatic kirtan, cultural performances & free 5-course prasādam. 5 July 2026."
        />
        <meta property="og:title" content="Ratha Yātrā 2026 — Sri Krishna Mandir Singapore" />
        <meta
          property="og:description"
          content="Pull the rope. Sing the kirtan. Take home the blessing. Free entry, 5 July 2026, Clementi Stadium."
        />
        <meta property="og:image" content="https://events.srikrishnamandir.org/images/ratha-yatra/hero.svg" />
        <meta property="og:url" content="https://events.srikrishnamandir.org/ratha-yatra-2026" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ratha Yātrā 2026 — Sri Krishna Mandir Singapore" />
        <meta name="twitter:image" content="https://events.srikrishnamandir.org/images/ratha-yatra/hero.svg" />
        <link rel="preload" as="image" href="/images/ratha-yatra/hero.svg" />
        <link rel="canonical" href="https://events.srikrishnamandir.org/ratha-yatra-2026" />
      </Helmet>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }}></div>
      <Navbar scrolled={scrolled} />
      <ChipBar visible={true} />
      <Hero />
      <Stats />
      <RegistrationForm onRegister={handleRegister} />
      <About />
      <Schedule />
      <ChariotStickyStory />
      <VideoSection />
      <Highlights />
      <Gallery />
      <Seva />
      <Location />
      <FAQ />
      <Share />
      <FinalCTA />
      <Footer />
      <MobileSticky pastHero={pastHero} />
      
    </>
  );
}

export default LandingPage;
