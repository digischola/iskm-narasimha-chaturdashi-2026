/* eslint-disable */
import { useEffect, useState, useRef, FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { trackPixelEvent, genEventId, trackCapiEvent } from "@/lib/meta-pixel";
import { supabase } from "@/integrations/supabase/client";
import "./KidsRathaYatra.css";

const EVENT = {
  slug: "kids_ratha_yatra_2026",
  title: "Kids Ratha Yātrā 2026",
  date: "Saturday, 27 June 2026",
  time: "6:00 PM – 9:00 PM (SGT)",
  venue: "ISKM Capark, Singapore",
  venueAddress: "ISKM Capark, Singapore",
  countdownIso: "2026-06-27T18:00:00+08:00",
  url: "https://events.srikrishnamandir.org/kids-ratha-yatra-2026",
  pixelContent: "Kids Ratha Yatra 2026",
};

const IMG = "/images/kids-ratha-yatra";
const VID = "/videos/kids-ratha-yatra";

function useCountdown(iso: string) {
  const target = new Date(iso).getTime();
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, done: false });
  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0, done: true });
      setT({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3),
        done: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? window.scrollY / docH : 0);
      setScrolled(window.scrollY > 10);
    };
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return { scrolled, progress };
}

function useAnimateOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            (e.target as HTMLElement).classList.add("in-view");
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".kry-page .fade-in, .kry-page .gold-divider, .kry-page .attr-card").forEach((el) => io.observe(el));
    const fallback = setTimeout(() => {
      document.querySelectorAll(".kry-page .fade-in:not(.visible), .kry-page .gold-divider:not(.visible)").forEach((el) => el.classList.add("visible"));
    }, 2500);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);
}

function useTimelineProgress() {
  useEffect(() => {
    const tl = document.getElementById("kry-timeline");
    if (!tl) return;
    const update = () => {
      const rect = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.8;
      const passed = vh * 0.8 - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      tl.style.setProperty("--tl-progress", String(p));
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

const FILMSTRIP_A = [
  ["pulling_03_kids_pulling.jpg", "Children pulling the chariot together"],
  ["moment_01_conch_shell.jpg", "A young devotee blowing the conch shell"],
  ["dance_01_bhaktin.jpg", "A young Kṛṣṇa Bhaktin in classical dance attire"],
  ["kirtan_04_devotee.jpg", "Children singing kīrtana with mridanga and karatāls"],
  ["flowers_01_group.jpg", "A row of flower girls with petal baskets"],
  ["arati_01_lamp.jpg", "Ārati lamp offering"],
  ["pulling_01_rope.jpg", "Hands on the chariot rope"],
  ["chariot_01_balloons.jpg", "The decorated mini chariot with festive balloons"],
];
const FILMSTRIP_B = [
  ["deity_02_altar_front.jpg", "Decorated deities of Lord Jagannātha, Baladev and Subhadrā"],
  ["kirtan_02_group.jpg", "Kīrtana in full flow with the assembled devotees"],
  ["baskets_filled.jpg", "Hand-prepared flower baskets ready for the procession"],
  ["hero_02_mom_boy_chariot.jpg", "A mother holding her young child with the chariot deity"],
  ["flowers_02_group.jpg", "Flower girls preparing for the procession"],
  ["prep_chariot_kids.jpg", "Children gathered around the small chariot during preparation"],
  ["closing_01_arati.jpg", "The closing ārati of the festival"],
  ["baskets_two.jpg", "Two woven flower baskets, hand-prepared"],
];

const TESTIMONIALS = [
  { quote: "The kīrtana set the tone the moment we walked in. My son was glued to the small chariot, holding it the whole evening — we came for a festival and left with a memory the whole family talks about.", name: "Anjali R.", role: "Parent · attended 2025" },
  { quote: "Pulling the chariot was the highlight for my daughter. She still talks about the cupcakes too — the prasādam was such a warm end to the night. We're already telling our cousins about this year.", name: "Karthik S.", role: "Parent · attended 2025" },
  { quote: "What made it special was that the whole evening was built around the kids. The dance, the kīrtana, the little chariot — it felt like the festival was speaking their language. Our family will be back.", name: "Lakshmi P.", role: "Parent · attended 2025" },
];

const FAQS = [
  { q: "Do I need to register to attend?", a: "Registration is free and helps us plan seating, prasādam and goodie bags for the children. Walk-ins are welcome but we strongly recommend registering in advance so we can save a spot for your family." },
  { q: "What ages is this suitable for?", a: "All ages — but the festival is especially designed with children aged 3–13 in mind. Toddlers, teens and grandparents are all warmly welcome. The whole family can take part." },
  { q: "Is there a dress code?", a: "No strict dress code — modest, comfortable clothing is perfect. Traditional Indian attire is lovely but not required. Children participating in kīrtana or dance may wish to wear traditional dress. Please remove shoes before entering the temple hall." },
  { q: "Will food be provided?", a: "Yes! A full vegetarian prasādam feast is offered free of charge from 9:15 PM. Throughout the evening you can also enjoy fresh samosas, cupcakes, cool drinks and other treats at the festival stalls." },
  { q: "Is there parking at the venue?", a: "Limited parking is available at ISKM Capark. We recommend using public transport. We'll send detailed directions in your confirmation email." },
];

const ATTRACTIONS = [
  { img: "kirtan_04_devotee.jpg", alt: "Children singing kīrtana together — drum, karatāls and voices", tag: "Bhakti Beats Corner", h: <>Vibrant <em>kīrtana</em> led by little voices</>, p: "Experience the sweetness of the Holy Name as the children lead joyful kīrtana throughout the festival." },
  { img: "dance_01_bhaktin.jpg", alt: "A young Kṛṣṇa Bhaktin in classical Odissi dance attire with crown headdress", tag: "Little Souls Bhakti Hub", h: <>Where families step into <em>Kṛṣṇa consciousness</em></>, p: "Explore devotional books, meet our children's KC class teachers, and find out how your little soul can grow in bhakti.", cls: "img-top" },
  { img: "fruit_fiesta.jpg", alt: "A child placing fresh fruits as an offering for Lord Jagannātha", tag: "Jagannātha's Fruit Fiesta", h: "Offer fresh fruits to the Lord", p: "Every offering made with devotion brings us closer to Kṛṣṇa. Place a fruit on the altar with your child." },
  { img: "govindas_cool_corner.jpg", alt: "Cold drinks stall at Govinda's Cool Corner", tag: "Govinda's Cool Corner", h: <>The kids' <em>drinks corner</em></>, p: "Refreshing rose-milk, lemonade and devotional treats at the festival's cool corner — perfect for a Singapore evening." },
  { img: "souvenir_crafting.jpg", alt: "Handcrafted cardboard chariots and Lord Jagannātha faces on lotus and flower backdrops, made by the children", tag: "Handmade Souvenir Stall", h: "Crafted by little hands, for Kṛṣṇa", p: "Take home a handmade gift, garland or keepsake created by the children — every purchase supports their creativity." },
  { img: "prasadam_01_thali.jpg", alt: "Sanctified vegetarian prasādam thali with multiple offerings", tag: "Mahāprasādam Mercy Corner", h: "Sweet mercy for the whole family", p: "Cupcakes, sweet treats, snacks and more — taste the Lord's mercy through specially prepared prasādam." },
  { img: "samosa_seva_stop.jpg", alt: "Fresh samosas at the Samosa Seva Stop stall", tag: "Samosa Seva Stop", h: "Crispy, hot, prepared with love", p: "Fresh samosas at the festival's samosa stall — golden brown triangles, prepared with devotion." },
  { img: "pizza_stall.jpg", alt: "Freshly baked vegetarian pizza on a steel tray at the festival pizza stall", tag: "Pizza Stall", h: "Hot slices for the whole family", p: "A festival favourite — freshly baked vegetarian pizza for the little ones (and the grown-ups too)." },
  { img: "pulling_01_rope.jpg", alt: "Children holding the white rope as the chariot rolls", tag: "Pull the Chariot", h: "Every family takes a turn on the rope", p: "From 6:50 PM the chariot of Lord Jagannātha rolls — every child and grown-up is welcome to take the rope." },
];

const SCHEDULE = [
  { time: "6:00 – 6:10 PM", h: "Assembling kids and parents", d: "Families gather on the 1st floor of ISKM Capark.", icon: <i className="fas fa-users"></i> },
  { time: "6:10 – 6:20 PM", h: "Welcome speech by HG Visvambhar Prabhu", d: "A short opening address to set the spirit of the evening.", icon: <i className="fas fa-microphone"></i> },
  { time: "6:20 – 6:30 PM", h: <>Deities brought down to the chariot <span className="tl-tag">Conch Call</span></>, d: "Samarth blows the conch shell as Lord Jagannātha, Baladev and Subhadrā are placed on the chariot.", icon: <i className="fas fa-shield-alt"></i>, hl: true },
  { time: "6:30 – 6:35 PM", h: <>Dance by Kṛṣṇa Bhaktins <span className="tl-tag">Performance</span></>, d: "Young Kṛṣṇa Bhaktins offer a devotional dance.", icon: <i className="fas fa-music"></i>, hl: true },
  { time: "6:35 – 6:50 PM", h: <>Ārati, kīrtana, coconut breaking &amp; sweeping by HG Mahāprabhu</>, d: "Lamp offering, congregational chanting, breaking of the coconut and ceremonial sweeping of the chariot path.", icon: <i className="fas fa-fire"></i> },
  { time: "6:50 – 8:45 PM", h: <>Pulling of the chariot <span className="tl-tag">Peak Moment</span></>, d: "Nearly two hours of joyful chariot-pulling, kīrtana and stalls. Every family takes a turn on the rope.", icon: <i className="fas fa-truck"></i>, hl: true },
  { time: "8:45 – 8:50 PM", h: "Final ārati & group photos", d: "Closing ārati and family photographs with the chariot.", icon: <i className="fas fa-camera"></i> },
  { time: "8:50 – 9:00 PM", h: "Deities brought back up", d: "The deities return to the altar with kīrtana accompaniment.", icon: <i className="fas fa-place-of-worship"></i> },
  { time: "9:00 – 9:15 PM", h: "Cleaning & prepping for prasādam", d: "A short pause as the prasādam line is set up.", icon: <i className="fas fa-broom"></i> },
  { time: "9:15 PM onwards", h: <>Prasādam feast begins <span className="tl-tag">Free Feast</span></>, d: "Sanctified vegetarian feast for the whole family — come hungry, leave blessed.", icon: <i className="fas fa-utensils"></i>, hl: true },
];

export default function KidsRathaYatra() {
  const { scrolled, progress } = useScrollState();
  const cd = useCountdown(EVENT.countdownIso);
  useAnimateOnScroll();
  useTimelineProgress();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [testIdx, setTestIdx] = useState(0);
  const [copyText, setCopyText] = useState("Copy link");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+65");
  const [phoneNum, setPhoneNum] = useState("");
  const [adults, setAdults] = useState("");
  const [kids, setKids] = useState("");

  // ViewContent pixel
  useEffect(() => {
    trackPixelEvent("ViewContent", { content_name: EVENT.pixelContent });
  }, []);

  // Testimonial auto-cycle
  useEffect(() => {
    const id = setInterval(() => setTestIdx((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, []);

  // Hero responsive video
  useEffect(() => {
    const v = document.getElementById("kry-hero-video") as HTMLVideoElement | null;
    const s = document.getElementById("kry-hero-src") as HTMLSourceElement | null;
    if (!v || !s) return;
    if (window.matchMedia("(min-width: 768px)").matches) {
      s.src = `${VID}/hero-loop-desktop.mp4`;
      v.setAttribute("poster", `${VID}/hero-loop-desktop-poster.jpg`);
      v.load();
    }
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const adultsN = parseInt(adults);
    const kidsN = parseInt(kids);
    if (!name.trim() || !email.trim() || !phoneNum.trim() || Number.isNaN(adultsN) || Number.isNaN(kidsN)) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const fullPhone = phoneCode + phoneNum.replace(/[\s\-().]/g, "");
      const { data, error: fnErr } = await supabase.functions.invoke("submit-registration", {
        body: {
          event_slug: EVENT.slug,
          name: name.trim(),
          email: email.trim(),
          phone: fullPhone,
          adults: adultsN,
          kids: kidsN,
          source: `${EVENT.title} - Landing Page`,
        },
      });
      if (fnErr) throw fnErr;
      if (data && (data as any).success === false) {
        setError(((data as any).error as string) || "Could not register.");
        setSubmitting(false);
        return;
      }
      // Pixel + CAPI Lead
      const eid = genEventId();
      trackPixelEvent("Lead", { content_name: EVENT.pixelContent }, eid);
      trackCapiEvent({
        eventName: "Lead",
        eventId: eid,
        userEmail: email.trim(),
        userPhone: fullPhone,
        customData: { content_name: EVENT.pixelContent },
      });
      // Wabo sync (fire-and-forget)
      supabase.functions.invoke("sync-to-wabo", {
        body: {
          event_slug: EVENT.slug,
          source: `${EVENT.title} - Landing Page`,
          name: name.trim(),
          email: email.trim(),
          country_code: phoneCode,
          phone: phoneNum,
          attendees: String(adultsN + kidsN),
          extras: { kry_adults: String(adultsN), kry_kids: String(kidsN) },
        },
      }).catch((err) => console.error("Wabo sync exception:", err));
      setSubmitted(true);
    } catch (err: any) {
      console.error("submit-registration error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy link"), 2000);
    });
  };

  const calUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Kids+Ratha+Y%C4%81tr%C4%81+2026+at+ISKM+Singapore&dates=20260627T100000Z/20260627T130000Z&details=Kids+Ratha+Y%C4%81tr%C4%81+2026+at+ISKM+Capark.+Free+entry%2C+pras%C4%81dam+and+more.&location=ISKM+Capark%2C+Singapore";

  return (
    <div className="kry-page">
      <Helmet>
        <title>Kids Ratha Yātrā 2026 — ISKM Singapore</title>
        <meta name="description" content="Little Hands, Big Service for Lord Jagannātha. A joyful kids-led Ratha Yātrā celebration at ISKM Singapore — Saturday 27 June 2026, 6:00 PM – 9:00 PM. Free entry, free prasādam, all are welcome." />
        <link rel="canonical" href={EVENT.url} />
        <meta property="og:title" content="Kids Ratha Yātrā 2026 — ISKM Singapore" />
        <meta property="og:description" content="Little Hands, Big Service for Lord Jagannātha. Saturday 27 June 2026 · 6:00–9:00 PM · ISKM Capark." />
        <meta property="og:image" content={`${IMG}/hero_01_kids_holding_deities.jpg`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={EVENT.url} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <a href="#main-content" className="skip-link">Skip to content</a>

      <div className="ribbon">
        <span className="ribbon-dot"></span>
        <span><span className="ribbon-hl">Limited seats</span> — Register free for Kids Ratha Yātrā 2026</span>
        <a href="#register" className="ribbon-cta">Reserve your family's spot →</a>
      </div>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="#main-content" className="nav-brand">
          <img src={`${IMG}/logo.webp`} alt="ISKM Singapore logo" width={38} height={38} />
          <span className="nav-name">ISKM Singapore<span className="nav-sub">Kids Ratha Yātrā 2026</span></span>
        </a>
        <div className="nav-links">
          <a href="#about" className="desk-link">About</a>
          <a href="#attractions" className="desk-link">What's On</a>
          <a href="#schedule" className="desk-link">Schedule</a>
          <a href="#location" className="desk-link">Venue</a>
          <a href="#register" className="nav-cta">Register Free</a>
        </div>
      </nav>

      <div className="scroll-progress"><div className="bar" style={{ transform: `scaleX(${progress})` }} /></div>

      <section className="hero" id="main-content">
        <div className="hero-bg-media">
          <video id="kry-hero-video" autoPlay muted loop playsInline preload="metadata" poster={`${VID}/hero-loop-poster.jpg`} aria-hidden="true">
            <source id="kry-hero-src" src={`${VID}/hero-loop.mp4`} type="video/mp4" />
          </video>
        </div>
        <div className="hero-inner">
          <div className="hero-eyebrow">ISKM Singapore Presents</div>
          <h1>Kids Ratha Yātrā <em>2026</em></h1>
          <p className="hero-tagline">"Little Hands, Big Service for Lord Jagannātha"</p>
          <p className="hero-sub">A joyful kids-led celebration of the chariot festival — from kīrtana to seva, every offering made with love, every smile a step closer to Kṛṣṇa.</p>

          <div className="hero-meta">
            <div className="hero-meta-item"><span className="hero-meta-icon"><i className="fas fa-calendar"></i></span><span>Saturday, 27 June 2026</span></div>
            <div className="hero-meta-item"><span className="hero-meta-icon"><i className="fas fa-clock"></i></span><span>6:00 PM – 9:00 PM (SGT)</span></div>
            <div className="hero-meta-item"><span className="hero-meta-icon"><i className="fas fa-map-marker-alt"></i></span><span>ISKM Capark, Singapore</span></div>
          </div>

          <div className="hero-countdown">
            <span className="hc-label">The chariot rolls in</span>
            <span className="hc-event">Saturday · 27 June 2026 · 6:00 PM SGT</span>
            {cd.done ? (
              <div style={{ color: "var(--gold)", fontSize: 18, fontWeight: 600, padding: "18px 0", fontFamily: "var(--font-display)", fontStyle: "italic" }}>The celebration is happening now! 🎉</div>
            ) : (
              <div className="hc-cells">
                <div className="hc-cell"><div className="hc-num">{cd.d}</div><div className="hc-lbl">Days</div></div>
                <div className="hc-cell"><div className="hc-num">{cd.h}</div><div className="hc-lbl">Hours</div></div>
                <div className="hc-cell"><div className="hc-num">{cd.m}</div><div className="hc-lbl">Mins</div></div>
                <div className="hc-cell"><div className="hc-num">{cd.s}</div><div className="hc-lbl">Secs</div></div>
              </div>
            )}
          </div>
        </div>

        <div className="trust-strip" style={{ marginTop: 56, maxWidth: 1100, marginLeft: "auto", marginRight: "auto" }}>
          <div className="ts-item"><span className="gold-num">500+</span> attendees expected</div>
          <span className="ts-sep">·</span>
          <div className="ts-item"><i className="fas fa-utensils" style={{ color: "var(--gold)" }}></i> Free prasādam feast</div>
          <span className="ts-sep">·</span>
          <div className="ts-item"><i className="fas fa-child" style={{ color: "var(--gold)" }}></i> A festival for the children</div>
          <span className="ts-sep">·</span>
          <div className="ts-item"><i className="fas fa-heart" style={{ color: "var(--gold)" }}></i> All are welcome</div>
        </div>
      </section>

      <section className="reg-section" id="register">
        <div className="reg-card">
          <div className="reg-card-header">
            <span className="reg-badge"><i className="fas fa-ticket-alt"></i> &nbsp;Free Entry</span>
            <h2>Reserve your family's spot</h2>
            <p>Registration is free · We'll send a confirmation by email</p>
          </div>
          {!submitted ? (
            <form onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="rg-name">Full name</label>
                <input id="rg-name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="rg-email">Email</label>
                  <input id="rg-email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="rg-phone">Phone</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select aria-label="Country code" style={{ width: 88, flexShrink: 0 }} value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)}>
                      <option value="+65">+65</option>
                      <option value="+91">+91</option>
                      <option value="+60">+60</option>
                      <option value="+62">+62</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+61">+61</option>
                    </select>
                    <input id="rg-phone" type="tel" placeholder="XXXX XXXX" style={{ flex: 1 }} value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} required />
                  </div>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="rg-adults">Adults</label>
                  <select id="rg-adults" required value={adults} onChange={(e) => setAdults(e.target.value)}>
                    <option value="" disabled>How many?</option>
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                    <option value="5">5+ Adults</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="rg-kids">Children</label>
                  <select id="rg-kids" required value={kids} onChange={(e) => setKids(e.target.value)}>
                    <option value="" disabled>How many?</option>
                    <option value="0">No children</option>
                    <option value="1">1 Child</option>
                    <option value="2">2 Children</option>
                    <option value="3">3 Children</option>
                    <option value="4">4 Children</option>
                    <option value="5">5+ Children</option>
                  </select>
                </div>
              </div>
              {error && <p style={{ color: "var(--red)", fontSize: 13, margin: "0 0 10px" }}>{error}</p>}
              <button type="submit" className="form-submit" disabled={submitting}>{submitting ? "Registering…" : "Register Now — It's Free"}</button>
              <div className="form-trust"><i className="fas fa-shield-alt"></i><span>No payment required · Confirmation by email</span></div>
            </form>
          ) : (
            <div className="confirm">
              <div className="confirm-check"><i className="fas fa-check"></i></div>
              <h3>You're registered!</h3>
              <p>We've saved your family's spots for Kids Ratha Yātrā 2026. A confirmation email is on the way.</p>
              <div className="confirm-detail"><i className="fas fa-calendar"></i> Saturday, 27 June 2026</div>
              <div className="confirm-detail"><i className="fas fa-clock"></i> 6:00 PM – 9:00 PM (SGT)</div>
            </div>
          )}
        </div>
      </section>

      <section className="section" id="about">
        <div className="section-head">
          <div className="eyebrow">Why a Kids Ratha Yātrā?</div>
          <h2>A festival where children become the <em>priests of joy</em></h2>
          <div className="gold-divider"></div>
        </div>
        <div className="about">
          <div className="about-text fade-in">
            <p className="lede">Every kīrtana led, every cup of cool lemonade poured, every fruit offered — this festival is the children's gift to Lord Jagannātha.</p>
            <p>The Kids Ratha Yātrā is a special celebration where the children themselves take the lead — offering their talents, creativity and hearts to the Lord. Every stall, every dance, every cupcake offered is a small act of devotion. The grown-ups simply encourage.</p>
            <p>This festival gives children the opportunity to:</p>
            <ul className="about-list">
              <li>learn devotion through service</li>
              <li>develop confidence in Kṛṣṇa consciousness</li>
              <li>offer their talents to Lord Jagannātha</li>
              <li>experience the joy of devotional association</li>
            </ul>
            <p>Come and encourage the children as they offer their love to Lord Jagannātha with enthusiasm and devotion.</p>
          </div>
          <div className="about-visual fade-in">
            <div className="av-frame-2"></div>
            <div className="av-frame"></div>
            <div className="av-photo">
              <img src={`${IMG}/hero_02_mom_boy_chariot.jpg`} alt="A mother holding her young child with the small chariot of Lord Jagannātha" loading="lazy" />
            </div>
            <div className="av-caption">"Little Hands, Big Service for Lord Jagannātha"<span className="av-caption-sub">Kids Ratha Yātrā 2025</span></div>
          </div>
        </div>
      </section>

      <section className="section warm" id="attractions">
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">What awaits you</div>
            <h2>Joyful corners of the <em>festival</em></h2>
            <div className="gold-divider"></div>
            <p>Wander, sip, taste, sing. Every corner of the festival is something the kids have prepared with love.</p>
          </div>
          <div className="attr-grid">
            {ATTRACTIONS.map((a, i) => (
              <div key={i} className={`attr-card fade-in ${a.cls || ""}`}>
                <img className="attr-card-img" src={`${IMG}/${a.img}`} alt={a.alt} loading="lazy" />
                <div className="attr-card-body">
                  <div className="attr-tag">{a.tag}</div>
                  <h3>{a.h}</h3>
                  <p>{a.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div className="eyebrow">Glimpses from last year</div>
          <h2>Kids Ratha Yātrā <em>2025</em></h2>
          <div className="gold-divider"></div>
          <p>Moments that say what words can't — kīrtana, chariot pulls, flower offerings and the joy of devotional service.</p>
        </div>
        <div className="filmstrip">
          <div className="filmstrip-track scroll-left">
            {[...FILMSTRIP_A, ...FILMSTRIP_A].map(([src, alt], i) => (
              <div key={i} className="filmstrip-cell"><img src={`${IMG}/${src}`} alt={i < FILMSTRIP_A.length ? alt : ""} loading="lazy" /></div>
            ))}
          </div>
        </div>
        <div className="filmstrip">
          <div className="filmstrip-track scroll-right">
            {[...FILMSTRIP_B, ...FILMSTRIP_B].map(([src, alt], i) => (
              <div key={i} className="filmstrip-cell"><img src={`${IMG}/${src}`} alt={i < FILMSTRIP_B.length ? alt : ""} loading="lazy" /></div>
            ))}
          </div>
        </div>

        <div className="testimonials fade-in">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`quote-card testimonial${i === testIdx ? " active" : ""}`}>
              <blockquote>{t.quote}</blockquote>
              <div className="quote-attr">
                <div>
                  <div className="quote-name">{t.name}</div>
                  <div className="quote-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`t-dot${i === testIdx ? " active" : ""}`} onClick={() => setTestIdx(i)} aria-label={`Testimonial ${i + 1}`}></button>
            ))}
          </div>
        </div>
      </section>

      <section className="section warm" id="schedule">
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">Programme Schedule</div>
            <h2>Saturday, 27 June 2026 · <em>6:00 PM – 9:00 PM</em></h2>
            <div className="gold-divider"></div>
            <p>All timings are approximate (SGT).</p>
          </div>
          <div className="timeline-wrap">
            <div className="tl" id="kry-timeline">
              {SCHEDULE.map((s, i) => (
                <div key={i} className={`tl-it${s.hl ? " hl" : ""}`}>
                  <div className="tl-dot">{s.icon}</div>
                  <div className="tl-time">{s.time}</div>
                  <h4 className="tl-h">{s.h}</h4>
                  <p className="tl-d">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-head">
          <div className="eyebrow">Have questions?</div>
          <h2>Frequently asked questions</h2>
          <div className="gold-divider"></div>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q} <i className="fas fa-chevron-down"></i>
              </button>
              <div className="faq-a"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 32px" }} id="location">
        <div className="section-head">
          <div className="eyebrow">The venue</div>
          <h2>ISKM Capark, Singapore</h2>
          <div className="gold-divider"></div>
        </div>
        <div className="location">
          <div className="loc-info">
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-dark)", margin: "0 0 26px" }}>International Sri Krishna Mandir's community hall — a warm, welcoming space for families and children. Easy public-transport access from Aljunied and Paya Lebar MRT.</p>
            <div className="loc-detail"><span className="loc-ic"><i className="fas fa-map-marker-alt"></i></span><span><strong>ISKM Capark</strong>Singapore</span></div>
            <div className="loc-detail"><span className="loc-ic"><i className="fas fa-calendar"></i></span><span><strong>Saturday, 27 June 2026</strong>Doors open 5:45 PM</span></div>
            <div className="loc-detail"><span className="loc-ic"><i className="fas fa-clock"></i></span><span><strong>6:00 PM – 9:00 PM (SGT)</strong>Prasādam feast from 9:15 PM</span></div>
            <div className="loc-detail"><span className="loc-ic"><i className="fas fa-phone"></i></span><span><strong>+(65) 6250 2280</strong>Tap to call</span></div>
            <div className="loc-detail"><span className="loc-ic"><i className="fas fa-train"></i></span><span><strong>Nearest MRT</strong>Aljunied (EW9) · Paya Lebar (CC9/EW9)</span></div>
            <div className="loc-actions">
              <a href="https://www.google.com/maps/place/International+Sri+Krishna+Mandir+(ISKM)/" target="_blank" rel="noopener noreferrer" className="btn-secondary"><i className="fas fa-directions"></i> Get directions</a>
            </div>
          </div>
          <div className="loc-map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7843!2d103.8807558!3d1.3146362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da183c80ceaac5%3A0x458ccd4e57b8697b!2sInternational%20Sri%20Krishna%20Mandir%20(ISKM)!5e0!3m2!1sen!2ssg!4v1" loading="lazy" title="ISKM Singapore location map"></iframe>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="section-head">
          <div className="eyebrow">Spread the joy</div>
          <h2>Invite friends & family</h2>
          <div className="gold-divider"></div>
        </div>
        <div className="share-row">
          <a href="https://wa.me/?text=Join%20us%20for%20Kids%20Ratha%20Y%C4%81tr%C4%81%202026%20at%20ISKM%20Singapore%20on%20Saturday%2027%20June!%20Free%20entry%20and%20pras%C4%81dam.%20Register%3A%20https%3A%2F%2Fevents.srikrishnamandir.org%2Fkids-ratha-yatra-2026" target="_blank" rel="noopener noreferrer" className="share-pill share-wa"><i className="fab fa-whatsapp"></i> WhatsApp</a>
          <a href="https://t.me/share/url?url=https%3A%2F%2Fevents.srikrishnamandir.org%2Fkids-ratha-yatra-2026&text=Join%20us%20for%20Kids%20Ratha%20Y%C4%81tr%C4%81%202026%20at%20ISKM%20Singapore!" target="_blank" rel="noopener noreferrer" className="share-pill share-tg"><i className="fab fa-telegram"></i> Telegram</a>
          <a href={calUrl} target="_blank" rel="noopener noreferrer" className="share-pill share-cal"><i className="fas fa-calendar-plus"></i> Add to calendar</a>
          <a href="#" onClick={(e) => { e.preventDefault(); copyLink(); }} className="share-pill share-copy"><i className="fas fa-link"></i> <span>{copyText}</span></a>
        </div>
      </section>

      <section className="final-cta">
        <h2>Bring the family — encourage <em>the children</em></h2>
        <p className="final-cta-meta">Saturday, 27 June 2026&nbsp;&nbsp;·&nbsp;&nbsp;6:00 PM SGT&nbsp;&nbsp;·&nbsp;&nbsp;ISKM Capark, Singapore</p>
        <a href="#register" className="btn-primary">Register now — it's free</a>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-cols">
            <div className="fc-brand">
              <img src={`${IMG}/logo.webp`} alt="ISKM Singapore logo" />
              <h4>International Sri Krishna Mandir</h4>
              <p>A Gauḍīya Vaiṣṇava temple in Singapore. Sacred festivals, kīrtana, cultural programmes, and free prasādam — all are welcome.</p>
              <div className="fc-social">
                <a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer" aria-label="Website"><i className="fas fa-globe"></i></a>
                <a href="mailto:contact@srikrishnamandir.org" aria-label="Email"><i className="fas fa-envelope"></i></a>
              </div>
            </div>
            <div className="footer-col">
              <h5>This event</h5>
              <ul>
                <li><a href="#register">Register</a></li>
                <li><a href="#attractions">What's on</a></li>
                <li><a href="#schedule">Schedule</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Visit</h5>
              <ul>
                <li><a href="#location">Venue & map</a></li>
                <li><a href="tel:+6562502280">+(65) 6250 2280</a></li>
                <li><a href="mailto:contact@srikrishnamandir.org">contact@srikrishnamandir.org</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>More from ISKM</h5>
              <ul>
                <li><a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer">Main website</a></li>
                <li><a href="/weekend-love-feast">Weekend Love Feast</a></li>
                <li><a href="/ratha-yatra-2026">Grand Ratha Yātrā 2026</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-meta">
            <p>&copy; 2026 International Sri Krishna Mandir · Singapore</p>
            <div className="fm-links">
              <a href="https://srikrishnamandir.org">Main site</a>
              <a href="mailto:contact@srikrishnamandir.org">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="mobile-cta-bar">
        <a href="#register">Register free — 27 June</a>
      </div>
    </div>
  );
}
