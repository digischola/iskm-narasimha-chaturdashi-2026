import { useEffect, useState, useCallback, useRef, lazy, Suspense } from "react";
import { trackPixelEvent, genEventId, trackCapiEvent } from "@/lib/meta-pixel";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SundayLoveFeast = lazy(() => import("@/pages/SundayLoveFeast"));
const FreePrasadamProgram = lazy(() => import("@/pages/FreePrasadamProgram"));


/* ═══ HOOKS ═══ */
function useCountdown(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, done: false });
  const [prevS, setPrevS] = useState(-1);
  const [digitChange, setDigitChange] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0, done: true }); return; }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      setTime({ d, h, m, s, done: false });
      if (s !== prevS) { setDigitChange(true); setPrevS(s); setTimeout(() => setDigitChange(false), 300); }
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

  useEffect(() => {
    const handler = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? window.scrollY / docH : 0);
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return { progress, scrolled };
}

function useAnimateOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".animate-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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

/* ═══ NAVBAR ═══ */
function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="ribbon">
        <span className="ribbon-text"><span className="hl"><span className="urgency-dot"></span><i className="fas fa-fire"></i> Limited Seats</span> — Register free for Śrī Nṛsiṁha Caturdaśī 2026</span>
        <a href="#register" className="ribbon-cta">Secure Your Spot &rarr;</a>
      </div>
      <nav className={`sticky-nav${scrolled ? " scrolled" : ""}`}>
        <a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer" className="nav-brand"><img src="/images/logo.webp" alt="ISKM" width="32" height="32" /><span>ISKM Singapore</span></a>
        <div className="nav-links">
          <a href="#expect" className="desk-link">What's On</a>
          <a href="#schedule" className="desk-link">Schedule</a>
          <a href="#about" className="desk-link">About</a>
          <a href="#location" className="desk-link">Venue</a>
          <a href="#register" className="nav-cta cta-glow">Register Free</a>
        </div>
      </nav>
    </>
  );
}

/* ═══ HERO ═══ */
function Hero({ spotsCount }: { spotsCount: number }) {
  const { d, h, m, s, done, digitChange } = useCountdown("2026-04-30T18:30:00+08:00");
  const parallaxRef = useParallax();

  return (
    <section className="hero hero-animated" id="main-content">
      
      <div className="hero-top">
        <div className="hero-content">
          <div className="hero-eyebrow">ISKM Singapore Presents</div>
          <h1>Śrī Nṛsiṁha Caturdaśī <span className="accent">2026</span></h1>
          <p className="hero-desc">Celebrate the divine appearance of Lord Nṛsiṁhadeva — an evening of grand Abhiṣeka, soul-stirring Kīrtana, cultural programme, and blessed Prasādam.</p>
          <div className="hero-meta">
            <div className="hero-meta-item"><div className="icon-circle"><i className="fas fa-calendar"></i></div><span>Thursday, 30th April 2026</span></div>
            <div className="hero-meta-item"><div className="icon-circle"><i className="fas fa-clock"></i></div><span>6:30 PM – 10:00 PM</span></div>
            <div className="hero-meta-item"><div className="icon-circle"><i className="fas fa-map-marker-alt"></i></div><span>No.9 Lorong 29 Geylang, #03-02</span></div>
          </div>
          {done ? (
            <div style={{ color: "var(--gold)", fontSize: "17px", fontWeight: 600 }}>The celebration is happening now!</div>
          ) : (
            <div className="countdown-row">
              <div className="cd-pill"><div className="num">{d}</div><div className="lbl">Days</div></div>
              <div className="cd-pill"><div className="num">{h}</div><div className="lbl">Hours</div></div>
              <div className="cd-pill"><div className="num">{m}</div><div className="lbl">Mins</div></div>
              <div className="cd-pill"><div className={`num${digitChange ? " digit-change" : ""}`}>{s}</div><div className="lbl">Secs</div></div>
            </div>
          )}
          <p className="hero-spots"><strong>100+ people</strong> already registered</p>
        </div>
        <div className="hero-painting" ref={parallaxRef}>
          <img src="/images/hero-image.webp" alt="Lord Śrī Nṛsiṁhadeva with Prahlāda Mahārāja" width="680" height="850" fetchPriority="high" decoding="async" />
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

  // Duplicate check states
  const [emailDupStatus, setEmailDupStatus] = useState<"idle" | "checking" | "ok" | "duplicate">("idle");
  const [phoneDupStatus, setPhoneDupStatus] = useState<"idle" | "checking" | "ok" | "duplicate">("idle");

  const handleNameChange = (v: string) => { setName(v); setNameValid(v.trim().length >= 2); };
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
        body: { field: "email", value: email.trim() },
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
    if (!digits) return false; // phone is mandatory
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
        body: { field: "phone", value: fullPhone },
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
    const numAtt = attendees === "5" ? 5 : parseInt(attendees);

    // Save to backend
    try {
      const { data, error: fnError } = await supabase.functions.invoke("submit-registration", {
        body: {
          name: name.trim(),
          email: email.trim(),
          phone: getFullPhone() || null,
          attendees: numAtt,
          is_volunteer: false,
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

    // Fire-and-forget sync to Wabo CRM (never blocks success)
    supabase.functions
      .invoke("sync-to-wabo", {
        body: {
          event_slug: "nrsimhachaturdasi2026",
          source: "Nrsimha Caturdasi 2026 - Landing Page",
          name: name.trim(),
          email: email.trim(),
          country_code: phoneCode,
          phone: phoneNum,
          attendees: attendees === "5" ? "5+" : attendees,
        },
      })
      .then(({ data, error }) => {
        if (error) console.error("Wabo sync error:", error);
        else if (data && data.ok === false) console.error("Wabo sync failed:", data);
      })
      .catch((e) => console.error("Wabo sync exception:", e));

    // Track Lead event
    const eid = genEventId();
    trackPixelEvent("Lead", {}, eid);
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
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Śrī Nṛsiṁha Caturdaśī 2026 – ISKM Singapore")}&dates=20260430T103000Z/20260430T140000Z&details=${encodeURIComponent("Grand Abhisheka, Kirtana, Cultural Programme & Prasādam\n\nVenue: No.9 Lorong 29 Geylang, #03-02, Singapore 388065\n\nMore info: https://events.srikrishnamandir.org/nrsimha-caturdasi-2026")}&location=${encodeURIComponent("No.9 Lorong 29 Geylang, #03-02, Singapore 388065")}`;
    return (
      <div className="reg-section" id="register">
        <div className="reg-card">
          <div className="form-success" style={{ display: "block" }}>
            <div className="confetti-container">
              {Array.from({ length: 30 }).map((_, i) => {
                const colors = ["#f4c96b", "#f8a4c0", "#ffb6c1", "#f5d78e", "#1e3a6e"];
                return (
                  <div key={i} className="confetti-piece" style={{
                    left: `${Math.random() * 100}%`, top: `${Math.random() * 40}%`,
                    background: colors[i % 5], animationDelay: `${Math.random() * 0.8}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }} />
                );
              })}
            </div>
            <div className="check-icon"><i className="fas fa-check"></i></div>
            <h3>You're Registered!</h3>
            <p>We've saved your spot for Śrī Nṛsiṁha Caturdaśī 2026.</p>
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "16px", padding: "12px 24px", background: "var(--navy)", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "14px", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}><i className="fas fa-calendar-plus"></i> Add to Google Calendar</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-section" id="register">
      <div className="reg-card">
        <div className="reg-card-header">
          <div className="reg-badge"><i className="fas fa-ticket-alt"></i> &nbsp;Free Entry</div>
          <h3>Confirm Your Attendance</h3>
          <p>Fill in below to register for the celebration</p>
        </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <div className="input-wrap">
                <input type="text" placeholder="Your full name" required value={name} onChange={(e) => handleNameChange(e.target.value)} className={nameValid ? "input-valid" : ""} />
                {nameValid && <i className="fas fa-check check-inline"></i>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <div className="input-wrap">
                  <input type="email" placeholder="you@email.com" required value={email} onChange={(e) => handleEmailChange(e.target.value)} onBlur={checkEmailDuplicate} className={emailValid && emailDupStatus !== "duplicate" ? "input-valid" : emailDupStatus === "duplicate" ? "input-error" : ""} />
                  {emailDupStatus === "checking" && <i className="fas fa-spinner fa-spin check-inline" style={{ color: "#999" }}></i>}
                  {emailDupStatus === "ok" && <i className="fas fa-check check-inline" style={{ color: "#27ae60" }}></i>}
                  {emailDupStatus === "duplicate" && <i className="fas fa-times check-inline" style={{ color: "#e74c3c" }}></i>}
                  {emailValid && emailDupStatus === "idle" && <i className="fas fa-check check-inline"></i>}
                </div>
                {emailDupStatus === "duplicate" && <span style={{ color: "#e74c3c", fontSize: "0.8rem", marginTop: "0.25rem" }}>This email is already registered</span>}
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select value={phoneCode} onChange={(e) => { setPhoneCode(e.target.value); setPhoneDupStatus("idle"); }} style={{ width: "90px", flexShrink: 0 }}>
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
                    <input type="tel" placeholder="XXXX XXXX" value={phoneNum} onChange={(e) => handlePhoneChange(e.target.value)} onBlur={checkPhoneDuplicate} className={phoneNum && !isPhoneValid() ? "input-error" : phoneDupStatus === "duplicate" ? "input-error" : phoneNum && isPhoneValid() && phoneDupStatus === "ok" ? "input-valid" : ""} />
                    {phoneDupStatus === "checking" && <i className="fas fa-spinner fa-spin check-inline" style={{ color: "#999" }}></i>}
                    {phoneDupStatus === "ok" && <i className="fas fa-check check-inline" style={{ color: "#27ae60" }}></i>}
                    {phoneDupStatus === "duplicate" && <i className="fas fa-times check-inline" style={{ color: "#e74c3c" }}></i>}
                  </div>
                </div>
                {phoneNum && !isPhoneValid() && <span style={{ color: "#e74c3c", fontSize: "0.8rem", marginTop: "0.25rem" }}>Enter 8–15 digits</span>}
                {phoneDupStatus === "duplicate" && <span style={{ color: "#e74c3c", fontSize: "0.8rem", marginTop: "0.25rem" }}>This phone number is already registered</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Number of Attendees *</label>
              <select value={attendees} onChange={(e) => setAttendees(e.target.value)} required>
                <option value="" disabled>Select number of attendees</option>
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5+ People</option>
              </select>
            </div>
            <button type="submit" className="btn-register cta-glow btn-register-navy" disabled={submitting || !nameValid || !emailValid || !attendees || !isPhoneValid() || emailDupStatus === "duplicate" || phoneDupStatus === "duplicate"}>
              {submitting ? "Submitting..." : "Register Now — It's Free"}
            </button>
            <div className="form-trust"><i className="fas fa-shield-alt"></i><span>No payment required · We'll send a confirmation email</span></div>
          </form>
      </div>
    </div>
  );
}

/* ═══ SOCIAL PROOF ═══ */
const TESTIMONIALS = [
  { text: '"The Nṛsiṁha Caturdaśī celebration was deeply moving. The Abhisheka filled the temple with such powerful energy."', author: "— Priya M., attended 2025" },
  { text: '"The prasādam was incredible and the kīrtana was soul-stirring. We come back every year."', author: "— Ravi K., attended 2024" },
  { text: '"My children loved the cultural programme. It\'s become our family tradition."', author: "— Lakshmi S., attended 2025" },
];

function SocialProof() {
  const [tIdx, setTIdx] = useState(0);
  useEffect(() => { const id = setInterval(() => setTIdx((i) => (i + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(id); }, []);

  return (
    <div className="proof-strip">
      <div className="proof-inner">
        <div className="proof-chip"><i className="fas fa-users ico-gold"></i><span><strong>500+</strong> expected this year</span></div>
        <div className="proof-chip"><i className="fas fa-utensils ico-pink"></i><span><strong>Free Prasādam</strong> for everyone</span></div>
        <div className="proof-chip"><i className="fas fa-child ico-green"></i><span><strong>Family-friendly</strong> all ages welcome</span></div>
      </div>
      <div className="testimonial-wrap">
        <div className="testimonial-item" key={tIdx}>
          <p className="quote">{TESTIMONIALS[tIdx].text}</p>
          <p className="author">{TESTIMONIALS[tIdx].author}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══ STATS ═══ */
function Stats() {
  const [animated, setAnimated] = useState(false);
  const [values, setValues] = useState([0, 0, 0, 0]);
  const targets = [50, 500, 10, 30];
  const labels = ["Years of Service", "Expected Attendees", "Cultural Programmes", "Festivals Celebrated Yearly"];

  useEffect(() => {
    if (!animated) return;
    targets.forEach((target, idx) => {
      const step = Math.ceil(target / 60);
      let cur = 0;
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        setValues((prev) => { const n = [...prev]; n[idx] = cur; return n; });
      }, 25);
    });
  }, [animated]);

  useEffect(() => {
    const el = document.querySelector(".stats-section");
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stats-section">
      <div className="stats-inner">
        {targets.map((_, i) => (
          <div key={i} className="animate-in">
            <div className="stat-number">{values[i]}+</div>
            <div className="stat-label">{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ ABOUT ═══ */
function About() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="editorial-section" id="about">
      <div className="editorial-inner">
        <div className="animate-in">
          <div className="editorial-visual">
            <img src="/images/sacred-protection.webp" alt="Lord Nrsimhadeva deity beautifully decorated" loading="lazy" decoding="async" width="800" height="500" />
          </div>
        </div>
        <div className="animate-in">
          <div className="editorial-text">
            <div className="overline" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--navy-2)", marginBottom: "12px" }}>The Significance</div>
            <h2>Who is Lord Nṛsiṁhadeva?</h2>
            <p>Śrī Nṛsiṁha Caturdaśī celebrates the divine appearance of Lord Nṛsiṁhadeva — the half-man, half-lion incarnation of the Supreme Lord Viṣṇu. He appeared from a pillar in the palace of the demon king Hiraṇyakaśipu to protect His dear devotee Prahlāda Mahārāja.</p>
            <p>Lord Nṛsiṁhadeva is worshipped as the supreme protector of devotees. His appearance demonstrates that the Lord will go to any extent to safeguard those who take shelter of Him, even manifesting in an extraordinary form never seen before.</p>
            <button className="read-more-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show less ↑" : "Read more about the festival ↓"}
            </button>
            <div className={`read-more-content${expanded ? " open" : ""}`}>
              <p>Nṛsiṁha Caturdaśī falls on the fourteenth day (caturdaśī) of the bright fortnight (Śukla Pakṣa) of the month of Vaiśākha. According to the Vedic scriptures, Lord Nṛsiṁhadeva appeared at twilight — neither day nor night — to fulfil the conditions of the boon granted to Hiraṇyakaśipu by Lord Brahmā.</p>
              <p>The story of Prahlāda Mahārāja is one of the most beloved in the Vedic tradition. Despite being the son of the greatest demon, young Prahlāda was an unwavering devotee of Lord Viṣṇu from birth. When Hiraṇyakaśipu tried every means to kill his own son, the Lord appeared in the extraordinary form of Nṛsiṁha — half-man, half-lion — to destroy the demon and embrace His devotee.</p>
              <p>Srila Prabhupada, the founder-ācārya, taught that Lord Nṛsiṁhadeva's appearance carries the supreme assurance: the Lord is always ready to protect His devotees from all dangers, material and spiritual.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mantra-block animate-in">
        <div className="mantra">ॐ उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्।<br />नृसिंहं भीषणं भद्रं मृत्यु मृत्युं नमाम्यहम्॥</div>
        <p className="mantra-meaning">I bow down to Lord Nṛsiṁha who is highly ferocious, brave, the great Lord Viṣṇu, blazing in all directions, terrifying yet auspicious — the death of death itself.</p>
      </div>
    </div>
  );
}

/* ═══ WHAT TO EXPECT ═══ */
const EXPECT_CARDS = [
  { img: "/images/sacred-abhisheka.webp", alt: "Sacred Abhiṣeka", title: "Sacred Abhiṣeka", desc: "Witness the grand bathing ceremony of the deities with milk, ghee, yogurt, and sanctified waters." },
  { img: "/images/divine-kirtana.webp", alt: "Divine Kīrtana", title: "Divine Kīrtana", desc: "Join heart-stirring congregational chanting that fills the temple with spiritual vibrations." },
  { img: "/images/cultural-programme.webp", alt: "Cultural Programme", title: "Cultural Programme", desc: "Enjoy a captivating cultural performance celebrating the glories of Lord Nṛsiṁhadeva's pastimes." },
  { img: "/images/blessed-prasadam.webp", alt: "Blessed Prasādam", title: "Blessed Prasādam", desc: "Relish sanctified vegetarian food offered to the Lord — served free to all attendees." },
  { img: "/images/arati-worship.webp", alt: "Ārati & Worship", title: "Ārati & Worship", desc: "Begin the evening with the sacred ārati ceremony and offerings to the deities in the temple." },
  { img: "/images/community-family.webp", alt: "Community & Family", title: "Community & Family", desc: "Bring the whole family for an uplifting atmosphere, book stalls, and warm community spirit." },
];

function WhatToExpect() {
  return (
    <div className="section" id="expect">
      <div className="sec-header animate-in"><div className="overline">What Awaits You</div><h2>An Evening of Devotion &amp; Joy</h2><div className="divider"></div><p>Experience the spiritual grandeur of Lord Nṛsiṁhadeva's appearance celebration</p></div>
      <div className="expect-grid">
        {EXPECT_CARDS.map((c) => (
          <div key={c.title} className="expect-card animate-in">
            <img className="expect-card-img" src={c.img} alt={c.alt} loading="lazy" decoding="async" width="400" height="190" />
            <div className="expect-card-body"><h3>{c.title}</h3><p>{c.desc}</p></div>
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
    const id = setInterval(() => setIdx((i) => (i + 1) % (total - perView + 1)), 3500);
    return () => clearInterval(id);
  }, [perView]);

  const scroll = (dir: number) => setIdx((i) => Math.max(0, Math.min(i + dir, total - perView)));

  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <div className="sec-header animate-in"><div className="overline">Past Celebrations</div><h2>Glimpses from Our Temple</h2><div className="divider"></div><p>Real moments from ISKM Singapore celebrations</p></div>
      <div className="gallery-wrap">
        <button className="gallery-btn prev" onClick={() => scroll(-1)} aria-label="Previous"><i className="fas fa-chevron-left"></i></button>
        <div className="gallery-viewport">
          <div className="gallery-track" style={{ transform: `translateX(-${idx * (100 / perView)}%)` }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="gallery-slide"><img src={`/images/${i + 1}.webp`} alt={`Gallery ${i + 1}`} loading="lazy" decoding="async" width="400" height="280" /></div>
            ))}
          </div>
        </div>
        <button className="gallery-btn next" onClick={() => scroll(1)} aria-label="Next"><i className="fas fa-chevron-right"></i></button>
      </div>
    </div>
  );
}

/* ═══ SCHEDULE ═══ */
function Schedule() {
  return (
    <div className="section" id="schedule">
      <div className="sec-header animate-in"><div className="overline">Program Schedule</div><h2>Thursday, 30 April 2026</h2><div className="divider"></div><p>6:30 PM onwards · All timings are approximate</p></div>
      <div className="timeline-section animate-in">
        <div className="timeline">
          <div className="tl-item"><div className="tl-dot"></div><div className="tl-time">6:30 – 7:00 PM</div><h4 className="tl-title">Ārati &amp; Kīrtana</h4><p className="tl-desc">Evening worship ceremony with congregational chanting to set the devotional atmosphere</p></div>
          <div className="tl-item highlight"><div className="tl-dot"></div><div className="tl-time">7:00 – 8:00 PM</div><h4 className="tl-title">Grand Abhiṣeka <span className="tl-tag">Highlight</span></h4><p className="tl-desc">The sacred bathing ceremony of the deities — the centrepiece of the evening celebration</p></div>
          <div className="tl-item highlight"><div className="tl-dot"></div><div className="tl-time">8:00 – 10:00 PM</div><h4 className="tl-title">Cultural Programme <span className="tl-tag">Special</span></h4><p className="tl-desc">A captivating cultural performance celebrating the glories of Lord Nṛsiṁhadeva</p></div>
          <div className="tl-item highlight"><div className="tl-dot"></div><div className="tl-time">8:30 PM</div><h4 className="tl-title">Prasādam is Served <span className="tl-tag">Free Prasādam</span></h4><p className="tl-desc">Sanctified vegetarian Prasādam for all attendees — come hungry, leave blessed</p></div>
        </div>
      </div>
      <div className="fasting-card animate-in"><i className="fas fa-info-circle"></i><p><strong>Fasting Guidance:</strong> Devotees traditionally observe a complete fast from sunrise to sunset on Nṛsiṁha Caturdaśī. After sunset, the fast may be broken with Ekādaśī-style prasādam. If you're new to this, simply come and enjoy — no fasting is required to attend.</p></div>
    </div>
  );
}

/* ═══ SEVA ═══ */
const SEVA_CARDS = [
  { img: "/images/patron-program.webp", alt: "Join As a Patron", title: "Join As a Patron", desc: "Become a patron and support the temple's spiritual mission with your generous contribution", link: "https://srikrishnamandir.org/join-as-a-patron/" },
  { img: "/images/annadanam-seva.webp", alt: "Annadānam Sevā", title: "Annadānam Sevā", desc: "Feed the community — sponsor the special Nṛsiṁha Caturdaśī prasādam", link: "https://srikrishnamandir.org/product/annadanam-seva/" },
  { img: "/images/Charity.webp", alt: "Charity Donation", title: "Charity Donation", desc: "Support the festival in any way that feels right for you", link: "https://srikrishnamandir.org/product/outright-donation/" },
];

function Seva() {
  return (
    <div className="section" id="donate">
      <div className="sec-header animate-in"><div className="overline">Support the Festival</div><h2>Sevā Opportunities</h2><div className="divider"></div><p>Contribute to making this celebration possible for everyone</p></div>
      <div className="seva-grid">
        {SEVA_CARDS.map((c) => (
          <div key={c.title} className="seva-card animate-in">
            <img className="seva-card-img" src={c.img} alt={c.alt} loading="lazy" decoding="async" width="400" height="180" />
            <div className="seva-card-body"><h4>{c.title}</h4><p>{c.desc}</p><a href={c.link} target="_blank" rel="noopener noreferrer" className="seva-btn">Contribute</a></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ MILK ABHIṢEKA SECTION ═══ */
function MilkAbhisekaSection() {
  return (
    <div className="kavacha-section">
      <div className="kavacha-inner animate-in">
        <div className="kavacha-image abhiseka-image">
          <img src="/images/sacred-abhisheka.webp" alt="Śrī Nṛsiṁha Caturdaśī Milk Abhiṣeka" loading="lazy" decoding="async" />
        </div>
        <div className="kavacha-content">
          <div className="overline" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--navy-2)", marginBottom: "12px" }}>Sacred Bathing Ceremony</div>
          <h2 className="text-3xl" style={{ color: "var(--navy-deep)", marginBottom: "14px" }}>Śrī Nṛsiṁha Caturdaśī Milk Abhiṣeka 2026</h2>
          <p>In celebration of the most auspicious appearance day of Lord Nṛsiṁha, we have arranged for Milk-Abhiṣeka, wherein we are going to bathe Lord Narasimha.</p>
          <p>You can come personally to perform the milk abhiṣeka, or if you are not able to come, we will do the abhiṣeka on your behalf.</p>
          <a
            href="https://srikrishnamandir.org/product/abhiseka-seva-sri-n%e1%b9%9bsi%e1%b9%81ha-caturdasi/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              padding: "14px 28px",
              background: "var(--pink)",
              color: "var(--navy-deep)",
              borderRadius: "8px",
              fontFamily: "'Source Sans Pro',sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: ".3px",
              textDecoration: "none",
              transition: "all .3s",
              boxShadow: "0 4px 14px rgba(248,164,192,.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--pink-light)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(248,164,192,.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--pink)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(248,164,192,.35)";
            }}
          >
            <i className="fas fa-hand-holding-heart"></i>
            Sponsor Abhiṣeka — $10
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══ KAVACHA SECTION ═══ */
const KAVACHA_IMAGES = ["/images/kavacha-1.webp", "/images/kavacha-2.webp", "/images/kavacha-3.webp"];

function KavachaSection() {
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setImgIdx((i) => (i + 1) % KAVACHA_IMAGES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="kavacha-section">
      <div className="kavacha-inner animate-in">
        <div className="kavacha-image kavacha-carousel">
          {KAVACHA_IMAGES.map((src, i) => (
            <img key={src} src={src} alt={`Silver Nṛsiṁha Kavacha view ${i + 1}`} loading="lazy" decoding="async" width="400" height="400" className={i === imgIdx ? "kavacha-slide active" : "kavacha-slide"} />
          ))}
        </div>
        <div className="kavacha-content">
          <div className="overline" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--navy-2)", marginBottom: "12px" }}>Sacred Protection</div>
          <h2 className="text-3xl" style={{ color: "var(--navy-deep)", marginBottom: "14px" }}>Silver Nṛsiṁha Kavacha</h2>
          <p>Protect yourself and your loved ones with the Nṛsiṁha Kavacha. Specially made in Mayapur by the Vedic priest of the Gauḍīya Vaiṣṇava Sampradāya, this Kavacha contains Nṛsiṁha Yantra which holds a mantra that is the king of all mantras.</p>
          <p>One attains by it what would be attained by anointing oneself with ashes and chanting all other mantras.</p>
          <div className="kavacha-pricing">
            <span className="kavacha-original">$351</span>
            <span className="kavacha-sale">$281.80</span>
            <span className="kavacha-badge">Śrī Nṛsiṁha Caturdaśī Special</span>
          </div>
          <a href="https://iskm-eshop.kyte.site/en/p/silver-narasimha-kavacha-kavns/1621095636824-pepAr" target="_blank" rel="noopener noreferrer" className="btn-kavacha cta-glow"><i className="fas fa-shopping-cart"></i> &nbsp;Shop Now</a>
        </div>
      </div>
    </div>
  );
}


/* ═══ FAQ ═══ */
const FAQ_DATA = [
  { q: "Is there parking available at the venue?", a: "Limited parking is available along Lorong 29 Geylang. We recommend using public transport — Aljunied MRT (EW9) and Paya Lebar MRT (CC9/EW9) are both within walking distance. Several bus services also stop nearby along Sims Avenue." },
  { q: "Is there a dress code?", a: "There is no strict dress code. We recommend modest, comfortable clothing. Traditional Indian attire is welcome but not required. Please remove shoes before entering the temple hall." },
  { q: "Will food be provided?", a: "Yes! A sumptuous vegetarian prasādam feast will be served free of charge to all attendees at 8:30 PM. The food is sanctified, freshly prepared, and absolutely delicious." },
  { q: "Can I bring my children?", a: "Absolutely! The celebration is family-friendly and suitable for all ages. Children will enjoy the cultural programme and prasādam. The atmosphere is welcoming and inclusive for families." },
  { q: "Do I need to register to attend?", a: "Registration is free and helps us plan for seating and prasādam. Walk-ins are welcome on a first-come, first-served basis, but we recommend registering in advance." },
  { q: "How long is the event?", a: "The programme runs from 6:30 PM to 10:00 PM (about 3.5 hours). You're welcome to arrive at any point and stay as long as you'd like." },
];

function FAQ() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="faq-section" id="faq">
      <div className="sec-header animate-in"><div className="overline">Have Questions?</div><h2>Frequently Asked Questions</h2><div className="divider"></div><p>Everything you need to know before attending</p></div>
      <div className="faq-list animate-in">
        {FAQ_DATA.map((item, i) => (
          <div key={i} className="faq-item">
            <button className={`faq-question${active === i ? " active" : ""}`} onClick={() => setActive(active === i ? null : i)}>
              {item.q} <i className="fas fa-chevron-down"></i>
            </button>
            <div className={`faq-answer${active === i ? " open" : ""}`}><p>{item.a}</p></div>
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
      <div className="sec-header animate-in"><div className="overline">Venue</div><h2>How to Get Here</h2><div className="divider"></div></div>
      <div className="location-wrap animate-in">
        <div className="loc-map"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7843!2d103.8807558!3d1.3146362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da183c80ceaac5%3A0x458ccd4e57b8697b!2sInternational%20Sri%20Krishna%20Mandir%20(ISKM)!5e0!3m2!1sen!2ssg!4v1" allowFullScreen loading="lazy" title="ISKM Singapore Map"></iframe></div>
        <div className="loc-info">
          <img src="/images/logo.webp" alt="ISKM" width="45" height="45" />
          <h3>International Sri Krishna Mandir</h3>
          <div className="loc-detail"><i className="fas fa-map-marker-alt"></i><span>No. 9 Lorong 29 Geylang, #03-02<br />Singapore 388065</span></div>
          <div className="loc-detail"><i className="fas fa-calendar"></i><span>Thursday, 30 April 2026</span></div>
          <div className="loc-detail"><i className="fas fa-clock"></i><span>6:30 PM – 10:00 PM</span></div>
          <div className="loc-detail"><i className="fas fa-phone"></i><span>+(65) 6250 2280</span></div>
          <div className="loc-transport"><h4>Getting Here</h4>
            <p className="loc-transport-item"><i className="fas fa-train"></i> Aljunied MRT (EW9) or Paya Lebar MRT (CC9/EW9)</p>
            <p className="loc-transport-item"><i className="fas fa-bus"></i> Bus 2, 13, 21, 26, 40, 51, 67 — Sims Ave (B10)</p>
          </div>
          <a href="https://www.google.com/maps/place/International+Sri+Krishna+Mandir+(ISKM)/@1.3146362,103.8807558,17z/data=!3m1!5s0x31da183c7fd36ed1:0x5a6dd216c71b14b1!4m6!3m5!1s0x31da183c80ceaac5:0x458ccd4e57b8697b!8m2!3d1.3146362!4d103.8856267!16s%2Fg%2F1tf33gsl" target="_blank" rel="noopener noreferrer" className="directions-btn"><i className="fas fa-directions"></i> Get Directions</a>
        </div>
      </div>
    </div>
  );
}

/* ═══ SHARE ═══ */
function Share() {
  const [copyText, setCopyText] = useState("Copy Link");
  const copyLink = () => {
    navigator.clipboard.writeText("https://events.srikrishnamandir.org/nrsimha-caturdasi-2026").then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy Link"), 2000);
    });
  };
  const openGoogleCalendar = () => {
    const url = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Śrī+Nṛsiṁha+Caturdaśī+2026+at+ISKM+Singapore&dates=20260430T103000Z/20260430T140000Z&details=Grand+celebration+with+Abhisheka,+Kirtana,+Cultural+Programme+%26+free+Prasadam.+Register:+https://events.srikrishnamandir.org/nrsimha-caturdasi-2026&location=No.9+Lorong+29+Geylang+%2303-02+Singapore+388065";
    window.open(url, "_blank");
  };

  return (
    <div className="share-section">
      <div className="sec-header animate-in" style={{ marginBottom: 0 }}><div className="overline">Spread the Word</div><h2>Invite Friends &amp; Family</h2><div className="divider"></div></div>
      <div className="share-row animate-in">
        <a href="https://wa.me/?text=Join%20me%20for%20Sri%20Nrsimha%20Caturdasi%202026%20at%20ISKM%20Singapore%20on%20April%2030!%20Free%20entry%2C%20prasadam%20%26%20more.%20Register%3A%20https%3A%2F%2Fevents.srikrishnamandir.org%2Fnrsimha-caturdasi-2026" target="_blank" rel="noopener noreferrer" className="share-pill pill-wa"><i className="fab fa-whatsapp"></i> WhatsApp</a>
        <a href="https://t.me/share/url?url=https://events.srikrishnamandir.org/nrsimha-caturdasi-2026&text=Join+Sri+Nrsimha+Caturdasi+2026+at+ISKM+Singapore!" target="_blank" rel="noopener noreferrer" className="share-pill pill-tg"><i className="fab fa-telegram"></i> Telegram</a>
        <a href="#" onClick={(e) => { e.preventDefault(); openGoogleCalendar(); }} className="share-pill pill-cal"><i className="fas fa-calendar-plus"></i> Add to Calendar</a>
        <a href="#" onClick={(e) => { e.preventDefault(); copyLink(); }} className="share-pill pill-copy"><i className="fas fa-link"></i> <span>{copyText}</span></a>
      </div>
    </div>
  );
}

/* ═══ FINAL CTA ═══ */
function FinalCTA() {
  return (
    <div className="final-cta animate-in">
      <div className="final-cta-bg"><img src="/images/the-significance.webp" alt="" loading="lazy" decoding="async" /></div>
      <h2>Don't Miss This Sacred Celebration</h2>
      <p>Thursday, 30 April 2026 · 6:30 PM · ISKM Singapore</p>
      <a href="#register" className="btn-final cta-glow">Register Now — Free</a>
    </div>
  );
}

/* ═══ FOOTER ═══ */
function Footer() {
  return (
    <footer>
      <img src="/images/logo.webp" alt="ISKM" width="38" height="38" />
      <p>&copy; 2026 International Sri Krishna Mandir &middot; <a href="https://srikrishnamandir.org">srikrishnamandir.org</a> &middot; <a href="mailto:contact@srikrishnamandir.org">contact@srikrishnamandir.org</a></p>
    </footer>
  );
}

/* ═══ MOBILE STICKY ═══ */
function MobileSticky({ progress }: { progress: number }) {
  return (
    <>
      <div className="mobile-sticky">
        <div className="mobile-progress" style={{ transform: `scaleX(${progress})` }}></div>
        <a href="#register">Register Free — Apr 30</a>
      </div>
      <div style={{ height: "70px" }} className="mobile-spacer"></div>
      <style>{`.mobile-spacer{display:none}@media(max-width:768px){.mobile-spacer{display:block}}`}</style>
    </>
  );
}

/* ═══ LANDING PAGE ═══ */
function LandingPage() {
  const { progress, scrolled } = useScrollProgress();
  const [spotsCount, setSpotsCount] = useState(84);
  useAnimateOnScroll();

  // Fire ViewContent pixel event on mount
  useEffect(() => {
    trackPixelEvent("ViewContent", { content_name: "Nrsimha Caturdasi 2026" });
  }, []);

  const handleRegister = (count: number) => {
    setSpotsCount((prev) => prev + count);
  };

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }}></div>
      <Navbar scrolled={scrolled} />
      <Hero spotsCount={spotsCount} />
      <RegistrationForm onRegister={handleRegister} />
      <SocialProof />
      <Stats />
      <About />
      <WhatToExpect />
      <Gallery />
      <Schedule />
      <Seva />
      <MilkAbhisekaSection />
      <KavachaSection />
      <FAQ />
      <Location />
      <Share />
      <FinalCTA />
      <Footer />
      <MobileSticky progress={progress} />
    </>
  );
}

/* ═══ APP WITH ROUTING ═══ */
import Admin from "@/pages/Admin";
import Unsubscribe from "@/pages/Unsubscribe";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nrsimha-caturdasi-2026" element={<LandingPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/sunday-love-feast" element={<Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>}><SundayLoveFeast /></Suspense>} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/free-prasadam-program" element={<Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading…</div>}><FreePrasadamProgram /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
}
