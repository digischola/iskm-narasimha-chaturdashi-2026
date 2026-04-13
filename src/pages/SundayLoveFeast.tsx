import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trackPixelEvent, genEventId, trackCapiEvent } from "@/lib/meta-pixel";
import "./SundayLoveFeast.css";

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */
function getNextSunday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = (7 - day) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + diff);
  next.setHours(17, 0, 0, 0);
  if (day === 0 && now.getHours() < 19) {
    next.setDate(now.getDate());
    next.setHours(17, 0, 0, 0);
  }
  return next;
}

function formatNextSunday(): string {
  return getNextSunday().toLocaleDateString("en-SG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

const IMG = "/images/sunday-love-feast";

const GALLERY_ROW1 = [
  { src: `${IMG}/5-individual-person-chatting.webp`, alt: "Person chatting at Love Feast" },
  { src: `${IMG}/6-ladle-pouring-sauce-closeup.webp`, alt: "Ladle pouring sauce" },
  { src: `${IMG}/6-women-merchandise-table.webp`, alt: "Women at merchandise table" },
  { src: `${IMG}/7-cupcakes-muffins-baked-closeup.webp`, alt: "Cupcakes and muffins" },
  { src: `${IMG}/7-men-clapping-chanting-engaged.webp`, alt: "Men chanting" },
  { src: `${IMG}/7-prasadam-serving-line-multiple.webp`, alt: "Prasadam serving line" },
  { src: `${IMG}/7-volunteers-posing-food-trays.webp`, alt: "Volunteers with food trays" },
];
const GALLERY_ROW2 = [
  { src: `${IMG}/8-devotee-mridanga-kirtan-group.webp`, alt: "Kirtan group" },
  { src: `${IMG}/8-father-son-matching-yellow-shirts.webp`, alt: "Father and son" },
  { src: `${IMG}/8-man-smiling-holding-prasadam-plate.webp`, alt: "Man with prasadam plate" },
  { src: `${IMG}/8-woman-smiling-flowers-vibrant.webp`, alt: "Woman with flowers" },
  { src: `${IMG}/9-congregation-seated-temple-hall-wide.webp`, alt: "Congregation in temple hall" },
  { src: `${IMG}/9-jagannath-deities-food-offerings-flowers.webp`, alt: "Jagannath deities with offerings" },
  { src: `${IMG}/9-radha-krishna-deities-flower-decoration.webp`, alt: "Radha Krishna deities" },
];

const SCHEDULE = [
  { time: "5:00 PM", title: "Bhajan", desc: "Begin the evening with melodious devotional songs that calm the mind and uplift the spirit.", img: `${IMG}/9-kirtan-leader-singing-mridanga.webp`, alt: "Bhajan session at Sunday Love Feast" },
  { time: "5:30 PM", title: "Bhagavad Gita Class", desc: "Adults explore timeless wisdom from the Gita, while children enjoy their own engaging class.", img: `${IMG}/9-bhagavad-gita-class-temple-hall.webp`, alt: "Bhagavad Gita Class at ISKM" },
  { time: "6:30 PM", title: "Arati & Kirtan", desc: "Experience the ecstasy of congregational chanting and the beautiful Arati ceremony.", img: `${IMG}/9-radha-krishna-deities-flower-decoration.webp`, alt: "Arati & Kirtan ceremony" },
  { time: "7:15 PM", title: "Prasadam Feast", desc: "Relish a delicious vegetarian feast lovingly prepared and offered to Lord Krishna.", img: `${IMG}/8-prasadam-plates-closeup-food.webp`, alt: "Prasadam feast plates" },
];

const FAQS = [
  { q: "Is it really free? Are there any hidden charges?", a: "Yes, the Sunday Love Feast is completely free — no registration fee, no entry charge, no hidden costs. The Prasadam, classes, and Kirtan are all offered as a loving service. Donations are welcome but never expected." },
  { q: "Do I need to register to attend?", a: "Registration helps us prepare enough Prasadam for everyone, but walk-ins are always welcome. Registering simply ensures we have a plate ready for you and your family." },
  { q: "Can I bring my children?", a: "Absolutely! We have a dedicated Children's Class running parallel to the adult Bhagavad Gita class. Kids learn through stories, activities, and creative engagement. All ages are welcome." },
  { q: "What should I wear?", a: "There is no dress code. Wear whatever you're comfortable in. Many devotees wear traditional Indian attire, but casual clothing is perfectly fine." },
  { q: "Is there parking available?", a: "Street parking is available along Lorong 29. The venue is also easily accessible by MRT (Aljunied or Paya Lebar station) and multiple bus routes." },
  { q: "I'm not Hindu. Can I still attend?", a: "Everyone is welcome regardless of background, religion, or nationality. The Sunday Love Feast is about sharing love, wisdom, and good food with all." },
];

/* ═══════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════ */
export default function SundayLoveFeast() {
  // Countdown
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const prevVals = useRef({ d: "", h: "", m: "", s: "" });
  const [flips, setFlips] = useState({ d: false, h: false, m: false, s: false });

  // UI state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const [regCounter, setRegCounter] = useState(0);
  const [mobileCtaVisible, setMobileCtaVisible] = useState(true);
  const [activeGalleryDot, setActiveGalleryDot] = useState(0);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAttendees, setFormAttendees] = useState("2");
  const [formFirstTime, setFormFirstTime] = useState("no");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const ribbonRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLElement>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      const target = getNextSunday();
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      const newVals = { d: String(d), h: String(h), m: String(m), s: String(s) };
      const newFlips = { d: false, h: false, m: false, s: false };
      (Object.keys(newVals) as Array<keyof typeof newVals>).forEach(k => {
        if (newVals[k] !== prevVals.current[k]) {
          newFlips[k] = true;
          prevVals.current[k] = newVals[k];
        }
      });
      setCd({ d, h, m, s });
      setFlips(newFlips);
      setTimeout(() => setFlips({ d: false, h: false, m: false, s: false }), 400);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll handler
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? scrollTop / docH : 0);
      setNavScrolled(scrollTop > 20);
      // Parallax
      if (heroVideoRef.current && scrollTop < window.innerHeight) {
        heroVideoRef.current.style.transform = `translateY(${scrollTop * 0.15}px) scale(1.05)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dynamic layout
  useEffect(() => {
    const adjust = () => {
      const rh = ribbonRef.current?.offsetHeight || 37;
      if (navRef.current) navRef.current.style.top = `${rh}px`;
      if (heroRef.current) heroRef.current.style.marginTop = `${rh + (navRef.current?.offsetHeight || 56)}px`;
    };
    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, []);

  // Particles
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    const count = window.innerWidth < 900 ? 8 : 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 6 + 3;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;bottom:${-Math.random() * 20}%;animation-duration:${Math.random() * 8 + 6}s;animation-delay:${Math.random() * 6}s;`;
      container.appendChild(p);
    }
    return () => { container.innerHTML = ""; };
  }, []);

  // Reveal on scroll (IntersectionObserver)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".slf .reveal").forEach(el => observer.observe(el));
    // Trigger for already visible
    setTimeout(() => {
      document.querySelectorAll(".slf .reveal:not(.visible)").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) { el.classList.add("visible"); observer.unobserve(el); }
      });
    }, 100);
    return () => observer.disconnect();
  }, []);

  // Fetch real registration count
  // Fire ViewContent pixel on mount
  useEffect(() => {
    trackPixelEvent("ViewContent", { content_name: "Sunday Love Feast" });
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("slf_registrations")
        .select("*", { count: "exact", head: true });
      if (count !== null) setRegCounter(count);
    };
    fetchCount();
  }, [formSuccess]);

  // Mobile sticky CTA visibility
  useEffect(() => {
    if (window.innerWidth > 600) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => setMobileCtaVisible(!e.isIntersecting)),
      { threshold: 0.1 }
    );
    if (registerRef.current) observer.observe(registerRef.current);
    return () => observer.disconnect();
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxSrc(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body when lightbox/mobile menu open
  useEffect(() => {
    document.body.style.overflow = lightboxSrc || mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxSrc, mobileMenuOpen]);

  // Gallery carousel auto-scroll + dot tracking
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    // Track scroll position for dots
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const itemWidth = el.children[0]?.clientWidth || 280;
      const gap = 14;
      const idx = Math.round(scrollLeft / (itemWidth + gap));
      setActiveGalleryDot(Math.min(idx, GALLERY_IMAGES.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    // Auto-scroll every 4s
    const autoId = setInterval(() => {
      if (!el || document.hidden) return;
      const itemWidth = el.children[0]?.clientWidth || 280;
      const gap = 14;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextScroll = el.scrollLeft + itemWidth + gap;
      el.scrollTo({ left: nextScroll > maxScroll ? 0 : nextScroll, behavior: "smooth" });
    }, 4000);
    return () => { el.removeEventListener("scroll", onScroll); clearInterval(autoId); };
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSubmitting(true);
    try {
      const res = await supabase.functions.invoke("submit-slf-registration", {
        body: {
          name: formName,
          email: formEmail,
          phone: formPhone || null,
          attendees: parseInt(formAttendees) || 2,
          first_time: formFirstTime === "yes",
        },
      });
      const data = res.data;
      if (data?.error) {
        setFormError(data.error);
      } else if (data?.success) {
        // Track Lead event
        const eid = genEventId();
        trackPixelEvent("Lead", {}, eid);
        trackCapiEvent({
          eventName: "Lead",
          eventId: eid,
          userEmail: formEmail.trim(),
          userPhone: formPhone || undefined,
        });

        setFormSuccess(true);
        if (data.count) setRegCounter(data.count);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => prev === idx ? null : idx);
  };

  useEffect(() => {
    faqRefs.current.forEach((el, i) => {
      if (!el) return;
      const answer = el.querySelector(".faq-answer") as HTMLElement;
      if (!answer) return;
      answer.style.maxHeight = openFaq === i ? `${answer.scrollHeight}px` : "0";
    });
  }, [openFaq]);

  return (
    <div className="slf">
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />

      {/* Ribbon */}
      <div className="ribbon" ref={ribbonRef}>
        <span className="urgency-dot" />
        <span className="hl">Every Sunday</span> — Join us for Bhajan, Gita Class, Kirtan &amp; Free Prasadam
        <a href="#slf-register" onClick={e => { e.preventDefault(); scrollTo("slf-register"); }}>Register Now →</a>
      </div>

      {/* Sticky Nav */}
      <nav className={`sticky-nav${navScrolled ? " scrolled" : ""}`} ref={navRef}>
        <a href="#slf-home" className="nav-brand" onClick={e => { e.preventDefault(); scrollTo("slf-home"); }}>
          <img src="/images/sunday-love-feast/logo.webp" alt="ISKM Logo" width="32" height="32" />
          ISKM Singapore
        </a>
        <div className="nav-links">
          <a href="#slf-schedule" className="desk-link" onClick={e => { e.preventDefault(); scrollTo("slf-schedule"); }}>Schedule</a>
          <a href="#slf-gallery" className="desk-link" onClick={e => { e.preventDefault(); scrollTo("slf-gallery"); }}>Gallery</a>
          <a href="#slf-sponsor" className="desk-link" onClick={e => { e.preventDefault(); scrollTo("slf-sponsor"); }}>Sponsor</a>
          <a href="#slf-venue" className="desk-link" onClick={e => { e.preventDefault(); scrollTo("slf-venue"); }}>Venue</a>
          <a href="#slf-register" className="nav-cta" onClick={e => { e.preventDefault(); scrollTo("slf-register"); }}>Register Free</a>
          <button className="mobile-toggle" aria-label="Menu" onClick={() => setMobileMenuOpen(o => !o)}>
            <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`} style={{ top: (ribbonRef.current?.offsetHeight || 37) + (navRef.current?.offsetHeight || 56) }}>
        {["schedule", "gallery", "sponsor", "venue", "faq"].map(s => (
          <a key={s} href={`#slf-${s}`} onClick={e => { e.preventDefault(); scrollTo(`slf-${s}`); }}>{s === "venue" ? "Location" : s.charAt(0).toUpperCase() + s.slice(1)}</a>
        ))}
        <a href="#slf-register" className="nav-cta" onClick={e => { e.preventDefault(); scrollTo("slf-register"); }}>Register Free</a>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="hero" id="slf-home" ref={heroRef}>
        <div className="hero-particles" ref={particlesRef} />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge"><i className="fas fa-spa" /> ISKM SINGAPORE PRESENTS</div>
            <h1>Sunday Love Feast<span>Every Week</span></h1>
            <p className="hero-subtitle">An evening of soul-stirring Bhajan, transformative Bhagavad Gita wisdom, ecstatic Kirtan, and blessed Prasadam — shared with a warm community of devotees and seekers.</p>
            <div className="hero-details">
              <div className="hero-detail"><i className="far fa-calendar" /> Every Sunday</div>
              <div className="hero-detail"><i className="far fa-clock" /> 5:00 PM – 7:30 PM</div>
              <div className="hero-detail"><i className="fas fa-map-marker-alt" /> No.9 Lorong 29 Geylang, #03-02</div>
            </div>
            <div className="countdown-row">
              {[
                { val: cd.d, lbl: "Days", flip: flips.d },
                { val: cd.h, lbl: "Hours", flip: flips.h },
                { val: cd.m, lbl: "Mins", flip: flips.m },
                { val: cd.s, lbl: "Secs", flip: flips.s },
              ].map(c => (
                <div className="countdown-box" key={c.lbl}>
                  <span className={`num${c.flip ? " flip" : ""}`}>{c.val}</span>
                  <span className="lbl">{c.lbl}</span>
                </div>
              ))}
            </div>
            <div className="hero-cta-wrap">
              <a href="#slf-register" className="hero-cta" onClick={e => { e.preventDefault(); scrollTo("slf-register"); }}>
                Register This Sunday <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>
          <div className="hero-video-wrap">
            <video autoPlay muted loop playsInline poster="/images/sunday-love-feast/9-congregation-seated-temple-hall-wide.webp" ref={heroVideoRef}>
              <source src="/images/sunday-love-feast/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-overlay">
              <span className="tag">Free for Everyone</span>
              <p>250+ devotees gather every Sunday</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-item"><div className="trust-icon"><i className="fas fa-hand-holding-heart" /></div><span><strong>100% Free</strong> — No Charges</span></div>
          <div className="trust-item"><div className="trust-icon"><i className="fas fa-users" /></div><span><strong>Family &amp; Kids</strong> Welcome</span></div>
          <div className="trust-item"><div className="trust-icon"><i className="fas fa-utensils" /></div><span>Vegetarian <strong>Prasadam Feast</strong></span></div>
        </div>
      </div>

      {/* ═══ REGISTRATION ═══ */}
      <section className="register-section section" id="slf-register" ref={registerRef}>
        <div className="container">
          <div className="form-card reveal">
            <div className="text-center">
              <div className="form-tag"><i className="fas fa-ticket-alt" /> Free Entry</div>
              <h2>Reserve Your Seat This Sunday</h2>
              <p className="form-desc">Fill in below so we can prepare enough Prasadam for everyone</p>
            </div>
            {formSuccess ? (
              <div className="text-center" style={{ padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: "var(--navy)", marginBottom: 8 }}>You're Registered!</h3>
                <p style={{ color: "var(--text-muted)", maxWidth: 360, margin: "0 auto" }}>We look forward to seeing you this Sunday. Walk in with a smile — Prasadam awaits!</p>
              </div>
            ) : (
            <form onSubmit={handleFormSubmit}>
              {formError && <p style={{ color: "var(--red, #c0392b)", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{formError}</p>}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="req">*</span></label>
                  <input type="text" placeholder="Your full name" required value={formName} onChange={e => setFormName(e.target.value)} />
                </div>
              </div>
              <div className="form-row two-col">
                <div className="form-group">
                  <label>Email <span className="req">*</span></label>
                  <input type="email" placeholder="you@email.com" required value={formEmail} onChange={e => setFormEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+65 XXXX XXXX" value={formPhone} onChange={e => setFormPhone(e.target.value)} />
                </div>
              </div>
              <div className="form-row two-col">
                <div className="form-group">
                  <label>Number of Attendees</label>
                  <select value={formAttendees} onChange={e => setFormAttendees(e.target.value)}>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6+ People</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>First time visiting?</label>
                  <select value={formFirstTime} onChange={e => setFormFirstTime(e.target.value)}>
                    <option value="no">No, I've been before</option>
                    <option value="yes">Yes, first time!</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-register" disabled={formSubmitting}>
                {formSubmitting ? "Registering..." : "Register Now — It's Free"}
              </button>
            </form>
            )}

            <div className="form-trust">
              <span className="form-trust-item"><i className="fas fa-check-circle" /> No payment required</span>
              <span className="form-trust-item"><i className="fas fa-check-circle" /> Confirmation via email</span>
              <span className="form-trust-item"><i className="fas fa-check-circle" /> Walk-ins welcome too</span>
            </div>
            <div className="social-proof">
              <i className="fas fa-fire" style={{ color: "var(--gold)", marginRight: 4 }} />
              <strong>{regCounter}</strong> people registered for this Sunday
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      <section className="schedule-section section" id="slf-schedule">
        <div className="container">
          <div className="text-center reveal">
            <div className="section-badge">What Awaits You</div>
            <h2 className="section-title">An Evening of Devotion &amp; Joy</h2>
            <p className="section-subtitle">Every Sunday, experience the beauty of Bhakti through music, wisdom, worship, and a loving feast</p>
          </div>
          <div className="schedule-grid">
            {SCHEDULE.map((s, i) => (
              <div className={`schedule-card reveal reveal-delay-${i + 1}`} key={i}>
                <img className="schedule-card-img" loading="lazy" src={s.img} alt={s.alt} />
                <div className="schedule-card-body">
                  <span className="schedule-time">{s.time}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="experience-section section">
        <div className="container experience-content">
          <div className="text-center reveal">
            <div className="section-badge" style={{ color: "var(--gold-light)" }}>What People Say</div>
            <h2 className="section-title" style={{ color: "var(--white)" }}>More Than a Sunday Gathering</h2>
            <p className="section-subtitle" style={{ color: "rgba(255,255,255,.6)" }}>Hear from devotees who make Sunday Love Feast a part of their lives</p>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card reveal reveal-delay-1">
              <div className="stars">★ ★ ★ ★ ★</div>
              <blockquote>"The Sunday Love Feast is the highlight of our family's week. The children love their class, and the Prasadam is always incredible. It feels like coming home."</blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">P</div>
                <div><div className="testimonial-name">Priya M.</div><div className="testimonial-detail">Attending since 2023</div></div>
              </div>
            </div>
            <div className="testimonial-card reveal reveal-delay-2">
              <div className="stars">★ ★ ★ ★ ★</div>
              <blockquote>"I came as a curious visitor and now I don't miss a single Sunday. The Kirtan fills you with an energy you can't explain. And it's all completely free — just pure love."</blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">R</div>
                <div><div className="testimonial-name">Rajesh K.</div><div className="testimonial-detail">Regular since 2024</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SPONSORSHIP ═══ */}
      <section className="sponsorship-section section" id="slf-sponsor">
        <div className="container">
          <div className="text-center reveal">
            <div className="section-badge">Celebrate With Us</div>
            <h2 className="section-title">Sponsor the Sunday Love Feast</h2>
            <p className="section-subtitle">Mark your special day by sponsoring Prasadam for the entire congregation</p>
          </div>
          <div className="sponsor-grid">
            {[
              { icon: "fa-birthday-cake", title: "Birthday", desc: "Celebrate your birthday with blessings from the deities and the joy of feeding devotees." },
              { icon: "fa-heart", title: "Anniversary", desc: "Mark your special milestone by sharing Krishna's mercy with the community." },
              { icon: "fa-dove", title: "In Loving Memory", desc: "Honour your loved ones through this sacred act of feeding devotees in their name." },
            ].map((s, i) => (
              <div className={`sponsor-card reveal reveal-delay-${i + 1}`} key={i}>
                <div className="sponsor-icon"><i className={`fas ${s.icon}`} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center reveal">
            <div className="sponsor-price">$501 <small>per Sunday feast sponsorship</small></div>
            <br />
            <a href="https://wa.me/6562502280?text=I%20would%20like%20to%20enquire%20about%20sponsoring%20a%20Sunday%20Love%20Feast" target="_blank" rel="noopener noreferrer" className="btn-sponsor">
              <i className="fab fa-whatsapp" /> Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section className="gallery-section section" id="slf-gallery">
        <div className="container">
          <div className="text-center reveal">
            <div className="section-badge">Past Sundays</div>
            <h2 className="section-title">Glimpses of Love Feast</h2>
            <p className="section-subtitle">Moments of devotion, joy, and togetherness from our Sunday gatherings</p>
          </div>
          <div className="gallery-grid reveal">
            {GALLERY_IMAGES.map((g, i) => (
              <div className={`gallery-item${g.tall ? " tall" : ""}`} key={i} onClick={() => { setLightboxSrc(g.src); setLightboxAlt(g.alt); }}>
                <img loading="lazy" decoding="async" src={g.src} alt={g.alt} />
              </div>
            ))}
          </div>
          {/* Mobile carousel */}
          <div className="gallery-carousel reveal" ref={carouselRef}>
            {GALLERY_IMAGES.map((g, i) => (
              <div className="gallery-carousel-item" key={i} onClick={() => { setLightboxSrc(g.src); setLightboxAlt(g.alt); }}>
                <img loading="lazy" decoding="async" src={g.src} alt={g.alt} />
              </div>
            ))}
          </div>
          <div className="gallery-dots">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`gallery-dot${activeGalleryDot === i ? " active" : ""}`}
                onClick={() => {
                  const el = carouselRef.current;
                  if (!el) return;
                  const itemWidth = el.children[0]?.clientWidth || 280;
                  el.scrollTo({ left: i * (itemWidth + 14), behavior: "smooth" });
                }}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="faq-section section" id="slf-faq">
        <div className="container">
          <div className="text-center reveal">
            <div className="section-badge">Common Questions</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know before your visit</p>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div className={`faq-item reveal${openFaq === i ? " open" : ""}`} key={i} ref={el => { faqRefs.current[i] = el; }}>
                <button className="faq-question" onClick={() => toggleFaq(i)}>
                  {f.q}
                  <i className="fas fa-chevron-down" />
                </button>
                <div className="faq-answer"><div className="faq-answer-inner">{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LOCATION ═══ */}
      <section className="location-section section" id="slf-venue">
        <div className="container">
          <div className="text-center reveal">
            <div className="section-badge">Find Us</div>
            <h2 className="section-title">How to Get Here</h2>
          </div>
          <div className="location-grid reveal">
            <div className="map-wrap">
              <iframe src="https://www.google.com/maps?q=9+Lorong+29+Geylang+Singapore+388065&output=embed" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
            </div>
            <div className="location-info">
              <h3><i className="fas fa-spa" style={{ color: "var(--gold)", marginRight: 8, fontSize: 20 }} /> International Sri Krishna Mandir</h3>
              <div className="location-detail"><i className="fas fa-map-marker-alt" /><div><strong>Address</strong>No.9 Lorong 29 Geylang, #03-02, Singapore 388062</div></div>
              <div className="location-detail"><i className="far fa-clock" /><div><strong>Every Sunday</strong>5:00 PM – 7:30 PM</div></div>
              <div className="location-detail"><i className="fas fa-phone" /><div><strong>Contact</strong>+65 8125 1260</div></div>
              <div className="directions-list">
                <h4>Getting Here</h4>
                <div className="direction-item"><i className="fas fa-train" /> <strong>MRT:</strong>&nbsp; Aljunied (EW9) or Paya Lebar (EW8/CC9) — 10 min walk</div>
                <div className="direction-item"><i className="fas fa-bus" /> <strong>Bus:</strong>&nbsp; 2, 13, 21, 26, 51, 67 along Geylang Road</div>
                <div className="direction-item"><i className="fas fa-car" /> <strong>Parking:</strong>&nbsp; Street parking available on Lorong 29</div>
              </div>
              <a href="https://maps.google.com/?q=9+Lorong+29+Geylang+%2303-02+Singapore+388065" target="_blank" rel="noopener noreferrer" className="btn-directions">
                <i className="fas fa-directions" /> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="final-cta">
        <div className="container reveal">
          <div className="gold-divider"><i className="fas fa-spa" /></div>
          <h2>See You This Sunday</h2>
          <div className="next-date">{formatNextSunday()}</div>
          <p>5:00 PM – 7:30 PM · Free Entry · Prasadam for Everyone</p>
          <a href="#slf-register" className="btn-final" onClick={e => { e.preventDefault(); scrollTo("slf-register"); }}>
            Register Now <i className="fas fa-arrow-right" />
          </a>
          <div className="share-label" style={{ marginTop: 32 }}>Invite a friend</div>
          <div className="share-row">
            <a href="https://wa.me/?text=Join%20us%20for%20Sunday%20Love%20Feast%20at%20ISKM%20Singapore!%20Free%20Prasadam%2C%20Kirtan%20%26%20Bhagavad%20Gita%20class%20every%20Sunday%205-7%3A30PM.%20Register%3A%20https%3A%2F%2Fevents.srikrishnamandir.org" target="_blank" rel="noopener noreferrer" className="share-btn wa"><i className="fab fa-whatsapp" /> Share</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fevents.srikrishnamandir.org" target="_blank" rel="noopener noreferrer" className="share-btn fb"><i className="fab fa-facebook-f" /> Share</a>
            <a href="https://t.me/share/url?url=https%3A%2F%2Fevents.srikrishnamandir.org&text=Join%20Sunday%20Love%20Feast%20at%20ISKM%20Singapore!%20Free%20Prasadam%2C%20Kirtan%20%26%20Gita%20class%20every%20Sunday%205-7%3A30PM" target="_blank" rel="noopener noreferrer" className="share-btn tg"><i className="fab fa-telegram-plane" /> Share</a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <div className={`lightbox${lightboxSrc ? " open" : ""}`} onClick={() => setLightboxSrc(null)}>
        <button className="lightbox-close" onClick={() => setLightboxSrc(null)} aria-label="Close">×</button>
        {lightboxSrc && <img src={lightboxSrc} alt={lightboxAlt} onClick={e => e.stopPropagation()} />}
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <img src="/images/sunday-love-feast/logo.jpg" alt="ISKM" width="28" height="28" />
              <span>ISKM Singapore</span>
            </div>
            <div className="footer-links">
              <a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer">srikrishnamandir.org</a>
              <a href="https://www.facebook.com/iskm.sg/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook" /> Facebook</a>
              <a href="mailto:contact@srikrishnamandir.org">contact@srikrishnamandir.org</a>
            </div>
          </div>
          <div className="footer-copy">© 2026 International Sri Krishna Mandir · <a href="https://srikrishnamandir.org">srikrishnamandir.org</a></div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="mobile-sticky-cta" style={{ transform: mobileCtaVisible ? "translateY(0)" : "translateY(100%)", transition: "transform .3s ease" }}>
        <a href="#slf-register" onClick={e => { e.preventDefault(); scrollTo("slf-register"); }}><i className="fas fa-ticket-alt" /> Register Free — This Sunday</a>
      </div>
    </div>
  );
}
