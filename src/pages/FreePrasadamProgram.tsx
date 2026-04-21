import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import "./FreePrasadamProgram.css";

const IMG = "/images/Free-Prasadam-Program";
const WA_NUMBER = "6562502280";
const PAGE_URL = "https://events.srikrishnamandir.org/free-prasadam-program";

/* ═══ DATA ═══ */
const GALLERY_ALTS = [
  "Volunteer handing Prasadam to a woman on the street",
  "Devotee distributing food in Little India",
  "Family receiving Prasadam on the street",
  "Woman distributing food to a man on a busy street",
  "Srila Prabhupada murti at ISKM Singapore temple",
  "Volunteers packing meals in the kitchen",
  "A complete Prasadam meal tray",
  "Volunteers serving food from large bowls by a van",
  "Happy man holding a plate of Prasadam",
  "Women volunteers chopping vegetables in the kitchen",
  "Volunteer cooking Prasadam in the temple kitchen",
  "Young man smiling while holding a plate of food",
  "Close-up of a freshly served plate of Prasadam",
  "Elderly woman receiving Prasadam from a volunteer",
  "Volunteer team at the distribution table",
  "Rows of packed meal containers ready for distribution",
  "Community gathering at a food distribution point",
  "Volunteers serving meals outdoors",
  "Food being ladled from a large pot into a meal tray",
];

const TESTIMONIALS = [
  { text: "I sponsored a day for my late father's remembrance and the whole experience was so personal. The coordinator sent me photos of the meals being served with my father's name on the board. My mother cried tears of joy. We've now made it an annual tradition.", name: "Rajesh M.", detail: "Sponsored for father's Shraddha · 3x sponsor", initial: "R" },
  { text: "For my daughter's first birthday, we didn't want just a party — we wanted to give back. Sponsoring 250 meals felt so much more meaningful than another cake. The best part? We went down to help serve. My daughter will grow up knowing her birthday fed hundreds.", name: "Priya & Arjun S.", detail: "Sponsored for daughter's 1st birthday", initial: "P" },
  { text: "I'm not even Hindu — I'm a Sikh. But what ISKM does resonated deeply with langar and our tradition of community feeding. $300 to feed 250 people is unbelievable value. I've sponsored three times now and I'll keep going. The WhatsApp coordination is seamless.", name: "Gurpreet K.", detail: "Sponsored 3 days · Regular donor", initial: "G" },
  { text: "My company does quarterly CSR and this was the easiest, most impactful option we've found in Singapore. We sponsored four Fridays in a row. The team visited on one of them and seeing the workers' faces as they received food — that's something no team-building exercise can replicate.", name: "Linda T.", detail: "Corporate sponsor · 4 days sponsored", initial: "L" },
];

const FAQ_DATA = [
  { q: "What exactly does my $300 / $500 cover?", a: "Everything — ingredients, cooking, packing, distribution, and cleanup for 250 full meals. 100% of your sponsorship goes directly to the kitchen. There is zero admin overhead on Prasadam sponsorships." },
  { q: "How do I pay?", a: "After you submit the form, our coordinator reaches out personally on WhatsApp with PayNow (UEN) or bank transfer details. We keep it personal — no impersonal checkout pages." },
  { q: "Can I book a date weeks or months in advance?", a: "Yes — many sponsors book ahead for birthdays, anniversaries, or remembrance days. Some have recurring annual bookings for the same date every year. Select your preferred date in the form and we'll confirm availability." },
  { q: "Will I know how my sponsorship was used?", a: "Absolutely. On your sponsored day, our team sends you photos and updates from the distribution via WhatsApp so you can see exactly where your contribution went. If you've included a dedication, it is offered as a sankalpa (prayer) before cooking begins." },
  { q: "Is my donation tax-deductible?", a: "ISKM Singapore is a registered charity (UEN on file). Tax-deductibility depends on IPC status — the coordinator will confirm whether a tax-deductible receipt can be issued when processing your sponsorship." },
  { q: "Can I visit and help serve on my sponsored day?", a: "Absolutely — you're warmly welcome to visit the Geylang kitchen, help with cooking or packing, and personally hand out meals on the street. Many sponsors say this is the most fulfilling part of the experience." },
  { q: "Who receives the food?", a: "Anyone who walks up — migrant workers on their lunch break, elderly residents in the neighbourhood, families, students, tourists. We distribute daily in the Little India and Geylang area. No questions asked, no conditions, no signup required." },
];

const SPONSORS_TOAST = [
  { name: "Meena R.", reason: "mother's birthday", time: "2 hours ago" },
  { name: "David & Sarah L.", reason: "wedding anniversary", time: "5 hours ago" },
  { name: "Arun P.", reason: "father's remembrance", time: "Yesterday" },
  { name: "Chen Wei T.", reason: "Vesak Day", time: "Yesterday" },
  { name: "Kavitha S.", reason: "gratitude for recovery", time: "2 days ago" },
];

const OCCASIONS = [
  { icon: "fas fa-birthday-cake", title: "Birthday", desc: "Celebrate by feeding 250 people in your name or a loved one's name on their special day.", cls: "occ-pink" },
  { icon: "fas fa-om", title: "In Memory / Shraddha", desc: "Honour a departed loved one. Annadanam in their name is considered the most auspicious offering for the soul's journey.", cls: "occ-gold" },
  { icon: "fas fa-heart", title: "Wedding Anniversary", desc: "Mark the occasion with an act of generosity that brings blessings to your family and 250 others.", cls: "occ-pink" },
  { icon: "fas fa-hand-holding-medical", title: "Recovery / Gratitude", desc: "Recovering from illness, celebrating a milestone, or simply grateful — sponsor a day to give back.", cls: "occ-green" },
  { icon: "fas fa-star", title: "Festival / Holy Day", desc: "Multiply the merit of a holy day by feeding 250 people sanctified Prasadam in the Lord's name.", cls: "occ-gold" },
  { icon: "fas fa-hand-holding-heart", title: "Just Because", desc: "No occasion needed. Some sponsors simply pick a random day and let their generosity speak.", cls: "occ-blue" },
];

const IMPACT_STATS = [
  { icon: "fas fa-users", target: 2500, suffix: "+", label: "Sponsors since 2019" },
  { icon: "fas fa-calendar-alt", target: 6, suffix: "", label: "Years without missing a day" },
  { icon: "fas fa-percentage", target: 0, suffix: "%", label: "Admin overhead — every dollar feeds", isStatic: true },
  { icon: "fas fa-cloud-sun-rain", target: 365, suffix: "", label: "Days a year, rain or shine" },
];

/* ═══ PICTURE HELPER ═══ */
function Pic({ n, alt, loading = "lazy", className, width, height, eager }: { n: string; alt: string; loading?: "lazy" | "eager"; className?: string; width?: number; height?: number; eager?: boolean }) {
  return (
    <picture>
      <source srcSet={`${IMG}/${n}.webp`} type="image/webp" />
      <img
        src={`${IMG}/${n}.jpg`}
        alt={alt}
        loading={eager ? "eager" : loading}
        decoding={eager ? "async" : "async"}
        className={className}
        width={width}
        height={height}
        {...(eager ? { fetchPriority: "high" as const } : {})}
      />
    </picture>
  );
}

/* ═══ MAIN COMPONENT ═══ */
export default function FreePrasadamProgram() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [editorialExpanded, setEditorialExpanded] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastIndex, setToastIndex] = useState(0);
  const [copyText, setCopyText] = useState("Copy Link");

  // Form state
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [prefDate, setPrefDate] = useState("");
  const [occasion, setOccasion] = useState("");
  const [tier, setTier] = useState("weekday-300");
  const [dedication, setDedication] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Counter refs
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterAnimated = useRef<boolean[]>([false, false, false, false]);

  // Set page meta
  useEffect(() => {
    document.title = "Sponsor a Day of Free Prasadam | ISKM Singapore";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "$1.20 feeds one person a full sanctified meal. Sponsor a day of free Prasadam distribution — 250 meals, your name, your blessing.");
    return () => {
      document.title = "Śrī Nṛsiṁha Caturdaśī 2026 – Register Now | Srikrishnamandir";
    };
  }, []);

  // Scroll handler for nav shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const els = document.querySelectorAll(".fpp .reveal, .fpp .reveal-left, .fpp .reveal-right, .fpp .reveal-scale");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = counterRefs.current.indexOf(entry.target as HTMLDivElement);
          if (idx === -1 || counterAnimated.current[idx]) return;
          const stat = IMPACT_STATS[idx];
          if (stat.isStatic) return;
          counterAnimated.current[idx] = true;
          const el = entry.target as HTMLDivElement;
          const target = stat.target;
          const suffix = stat.suffix;
          const duration = 1800;
          const start = performance.now();
          function update(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    counterRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  // Toast cycle
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const firstTimeout = setTimeout(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 5000);
      interval = setInterval(() => {
        setToastIndex((prev) => (prev + 1) % SPONSORS_TOAST.length);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 5000);
      }, 25000);
    }, 8000);
    return () => { clearTimeout(firstTimeout); clearInterval(interval); };
  }, []);

  // Auto-tier on date change
  const handleDateChange = useCallback((val: string) => {
    setPrefDate(val);
    if (val) {
      const d = new Date(val);
      setTier(d.getDay() === 0 ? "sunday-500" : "weekday-300");
    }
  }, []);

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const tierLabel = tier === "sunday-500" ? "Sunday ($500)" : "Weekday ($300)";
    let msg = `Prasadam Sponsorship Request\n\nName: ${fullName}\nPhone: ${whatsapp}\nDate: ${prefDate}\nTier: ${tierLabel}`;
    if (occasion) msg += `\nOccasion: ${occasion}`;
    if (dedication) msg += `\nDedication: ${dedication}`;

    try {
      await supabase.from("prasadam_sponsorships").insert({
        full_name: fullName.trim(),
        whatsapp_number: whatsapp.trim(),
        preferred_date: prefDate,
        occasion: occasion || null,
        tier,
        dedication: dedication.trim() || null,
      });
    } catch (err) {
      console.error("Failed to save sponsorship:", err);
    }

    // Always open WhatsApp
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setFormSuccess(true);
    setSubmitting(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(PAGE_URL).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy Link"), 2000);
    });
  };

  const currentToast = SPONSORS_TOAST[toastIndex];

  return (
    <div className="fpp">
      {/* Skip Nav */}
      <a href="#sponsor" className="skip-nav">Skip to sponsorship form</a>

      {/* Ribbon */}
      <div className="ribbon" role="banner">
        <span className="hl"><i className="fas fa-hand-holding-heart" aria-hidden="true"></i> $1.20 per meal</span> — Feed 250 people. Sponsor a day of free Prasadam.
        <a href="#sponsor">Choose Your Day &rarr;</a>
      </div>

      {/* Nav */}
      <nav className={`sticky-nav${scrolled ? " scrolled" : ""}`} aria-label="Main navigation">
        <a href="#" className="nav-brand">
          <img src="/images/logo.webp" alt="ISKM Logo" width={32} height={32} />
          <span>ISKM Singapore</span>
        </a>
        <div className="nav-links">
          <a href="#how" className="desk-link">How It Works</a>
          <a href="#about" className="desk-link">Why Annadanam</a>
          <a href="#tiers" className="desk-link">Tiers</a>
          <a href="#faq" className="desk-link">FAQ</a>
          <a href="#sponsor" className="nav-cta">Sponsor a Day</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="top">
        <div className="hero-top">
          <div className="hero-content">
            <div className="hero-eyebrow">ISKM Singapore &middot; Daily Program</div>
            <h1>One Day. 250 Blessed Meals.<br /><span className="accent">Your Name on Every Plate.</span></h1>
            <p className="hero-desc">For just $1.20 a meal, you feed 250 people in your name — a mother on her lunch break, an elderly uncle walking home from the temple, a student who skipped breakfast. Pick any day that matters to you.</p>
            <div className="hero-meta">
              <div className="hero-meta-item"><div className="icon-circle"><i className="fas fa-coins" aria-hidden="true"></i></div><span>From <strong>$300</strong> per day (just $1.20 per meal)</span></div>
              <div className="hero-meta-item"><div className="icon-circle"><i className="fas fa-utensils" aria-hidden="true"></i></div><span><strong>250 meals</strong> cooked fresh daily in our kitchen</span></div>
              <div className="hero-meta-item"><div className="icon-circle"><i className="fas fa-calendar-check" aria-hidden="true"></i></div><span><strong>365 days a year</strong> — rain or shine, since 2019</span></div>
            </div>
            <div className="price-row">
              <div className="price-pill"><div className="num">$1.20</div><div className="lbl">Per Meal</div></div>
              <div className="price-pill"><div className="num">250</div><div className="lbl">People Fed</div></div>
              <div className="price-pill"><div className="num">365</div><div className="lbl">Days / Year</div></div>
            </div>
            <div className="hero-urgency">
              <div className="urgency-pill"><span className="pulse-dot"></span> 42 days sponsored this year</div>
            </div>
          </div>
          <div className="hero-painting">
            <Pic n="1" alt="Volunteer handing Prasadam to a woman on a Singapore street" eager />
          </div>
        </div>

        {/* Form */}
        <div className="hero-bottom" id="sponsor">
          <div className="reg-card">
            {formSuccess ? (
              <div className="form-success" role="alert">
                <div className="check-icon"><i className="fas fa-check" aria-hidden="true"></i></div>
                <h3>Request Sent!</h3>
                <p>Our Prasadam coordinator will confirm your date and share payment details via WhatsApp shortly.</p>
              </div>
            ) : (
              <>
                <div className="reg-card-header">
                  <div className="reg-badge"><i className="fas fa-hand-holding-heart" aria-hidden="true"></i> &nbsp;Sponsor Prasadam</div>
                  <h2>Choose Your Day</h2>
                  <p>Pick a date, add a dedication — we handle the rest</p>
                </div>
                <form onSubmit={handleSubmit} aria-label="Sponsorship request form">
                  <div className="form-group">
                    <label htmlFor="fpp-name">Full Name *</label>
                    <input type="text" id="fpp-name" placeholder="Your full name" required autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fpp-phone">WhatsApp Number *</label>
                      <input type="tel" id="fpp-phone" placeholder="+65 XXXX XXXX" required autoComplete="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fpp-date">Preferred Date *</label>
                      <input type="date" id="fpp-date" required value={prefDate} onChange={(e) => handleDateChange(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="fpp-occasion">Occasion</label>
                    <select id="fpp-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                      <option value="">Select an occasion (optional)</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Wedding Anniversary</option>
                      <option value="remembrance">In Memory / Shraddha</option>
                      <option value="festival">Festival / Holy Day</option>
                      <option value="recovery">Recovery / Gratitude</option>
                      <option value="general">General Sponsorship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sponsorship Tier *</label>
                    <div className="tier-group" role="radiogroup" aria-label="Sponsorship tier selection">
                      <div className="tier-radio">
                        <input type="radio" name="tier" id="tierWeekday" value="weekday-300" checked={tier === "weekday-300"} onChange={() => setTier("weekday-300")} />
                        <label htmlFor="tierWeekday" className="tier-label"><span className="amt">$300</span><span className="tier-name">Weekday</span><span className="tag">&nbsp;</span></label>
                      </div>
                      <div className="tier-radio popular">
                        <input type="radio" name="tier" id="tierSunday" value="sunday-500" checked={tier === "sunday-500"} onChange={() => setTier("sunday-500")} />
                        <label htmlFor="tierSunday" className="tier-label"><span className="amt">$500</span><span className="tier-name">Sunday</span><span className="tag">Popular</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group dedication-box">
                    <label htmlFor="fpp-dedication"><i className="fas fa-feather" style={{ color: "var(--gold)", marginRight: 4 }} aria-hidden="true"></i> Dedication (optional)</label>
                    <textarea id="fpp-dedication" placeholder="e.g. In loving memory of my grandmother, Smt. Kamala Devi" value={dedication} onChange={(e) => setDedication(e.target.value)} />
                    <div className="dedi-hint">Included in the sankalpa (prayer) offered before cooking on your sponsored day</div>
                  </div>
                  <button type="submit" className="btn-register" disabled={submitting}>
                    {submitting ? "Sending..." : <><i className="fab fa-whatsapp" aria-hidden="true"></i> &nbsp;Confirm via WhatsApp</>}
                  </button>
                  <div className="form-trust"><i className="fas fa-shield-alt" aria-hidden="true"></i><span>Payment via PayNow / bank transfer &middot; Coordinator confirms personally</span></div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <div className="proof-strip reveal">
        <div className="proof-inner">
          <div className="proof-chip"><i className="fas fa-utensils ico-gold" aria-hidden="true"></i><span><strong>250+ plates</strong> served every single day</span></div>
          <div className="proof-chip"><i className="fas fa-calendar-check ico-pink" aria-hidden="true"></i><span><strong>6 years</strong> without missing a day</span></div>
          <div className="proof-chip"><i className="fas fa-hand-holding-heart ico-green" aria-hidden="true"></i><span><strong>100%</strong> of your donation feeds people</span></div>
        </div>
      </div>

      {/* Prabhupada Quote */}
      <div className="section reveal" style={{ paddingBottom: 0 }}>
        <blockquote className="prabhupada-quote">
          <div className="quote-icon" aria-hidden="true">&ldquo;</div>
          <p>&ldquo;No one within a ten-mile radius of a temple should go hungry. I want you to immediately begin a program of free food distribution.&rdquo;</p>
          <cite>— His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, Founder-Acharya</cite>
        </blockquote>
      </div>

      {/* How It Works */}
      <section className="section" id="how">
        <div className="sec-header reveal">
          <div className="overline">How It Works</div>
          <h2>Three Simple Steps to Feed 250 People</h2>
          <div className="divider"></div>
          <p>No cooking, no logistics, no hassle — just choose a day and let devotion do the rest</p>
        </div>
        <div className="expect-grid">
          <div className="expect-card reveal stagger-1">
            <Pic n="7" alt="A complete Prasadam meal tray with rice, curry, vegetables and cucumber" className="expect-card-img" width={350} height={190} />
            <div className="expect-card-body">
              <div className="step-badge">1</div>
              <h3>Pick a Day That Matters</h3>
              <p>A birthday. A remembrance. A Tuesday you just want to make beautiful. Any day becomes sacred when you feed others in someone's name.</p>
            </div>
          </div>
          <div className="expect-card reveal stagger-2">
            <Pic n="16" alt="Rows of packed Prasadam meal containers ready for distribution" className="expect-card-img" width={350} height={190} />
            <div className="expect-card-body">
              <div className="step-badge">2</div>
              <h3>We Handle Everything</h3>
              <p>Our team confirms your date on WhatsApp, shares PayNow details, and takes care of every grain of rice. You don't lift a finger.</p>
            </div>
          </div>
          <div className="expect-card reveal stagger-3">
            <Pic n="9" alt="Happy man holding a plate of Prasadam and smiling on a Singapore street" className="expect-card-img" width={350} height={190} />
            <div className="expect-card-body">
              <div className="step-badge">3</div>
              <h3>250 People Eat Because of You</h3>
              <p>On your chosen day, 250 freshly cooked sanctified meals go out to the streets of Little India. We send you photos so you can see the impact firsthand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's in Every Meal */}
      <section className="meal-section">
        <div className="meal-card reveal-scale">
          <div className="meal-card-img">
            <Pic n="13" alt="Close-up of a freshly served plate of Prasadam — rice, dal, curry and papadum" width={450} height={320} />
          </div>
          <div className="meal-card-body">
            <div className="overline" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--navy-2)", marginBottom: 10 }}>Your $300 Provides</div>
            <h2>What's in Every Meal</h2>
            <p className="price-line">A complete plate for <strong>$1.20 per person</strong> — 250 served daily</p>
            <ul className="meal-items">
              <li><i className="fas fa-circle" aria-hidden="true"></i> Fragrant basmati rice</li>
              <li><i className="fas fa-circle" aria-hidden="true"></i> Dal (lentil preparation)</li>
              <li><i className="fas fa-circle" aria-hidden="true"></i> Two vegetable preparations (seasonal)</li>
              <li><i className="fas fa-circle" aria-hidden="true"></i> Papadum or puri</li>
              <li><i className="fas fa-circle" aria-hidden="true"></i> Sweet (halwa or kheer)</li>
              <li><i className="fas fa-circle" aria-hidden="true"></i> Fresh cucumber or salad</li>
            </ul>
            <p className="meal-card-footer">Every item is first offered to the Lord, then served as His blessed Prasadam. Fully vegetarian, prepared fresh each morning in our Geylang kitchen.</p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-strip" aria-label="Impact statistics">
        <div className="impact-inner">
          {IMPACT_STATS.map((stat, i) => (
            <div className={`impact-stat reveal stagger-${i + 1}`} key={i}>
              <i className={stat.icon} aria-hidden="true"></i>
              <div
                className="num"
                ref={(el) => { counterRefs.current[i] = el; }}
              >
                {stat.isStatic ? `0${stat.suffix}` : "0"}
              </div>
              <div className="lbl">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery — Two row marquee like SLF */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="sec-header reveal">
          <div className="overline">From the Streets of Singapore</div>
          <h2>This Happens Every Single Day</h2>
          <div className="divider"></div>
          <p>Not a festival, not a special occasion — just an ordinary day of feeding people in Little India</p>
        </div>
        <div className="gallery-marquee-wrap" role="region" aria-label="Photo gallery">
          <div className="gallery-track gallery-ltr">
            {Array.from({ length: 10 }, (_, i) => (
              <Pic key={`g1-${i}`} n={`${i + 1}`} alt={GALLERY_ALTS[i]} width={260} height={190} />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <Pic key={`g1d-${i}`} n={`${i + 1}`} alt="" width={260} height={190} />
            ))}
          </div>
          <div className="gallery-track gallery-rtl">
            {Array.from({ length: 9 }, (_, i) => (
              <Pic key={`g2-${i}`} n={`${i + 11}`} alt={GALLERY_ALTS[i + 10] || `Prasadam distribution photo ${i + 11}`} width={260} height={190} />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <Pic key={`g2d-${i}`} n={`${i + 11}`} alt="" width={260} height={190} />
            ))}
          </div>
        </div>
      </section>

      {/* About Annadanam */}
      <section className="editorial-section" id="about">
        <div className="editorial-inner">
          <div className="editorial-visual reveal-left">
            <Pic n="5" alt="Srila Prabhupada murti at ISKM Singapore temple" width={500} height={625} />
            <div className="editorial-overlay">
              <div className="decorative-text" aria-hidden="true">अन्नदानम्</div>
              <div className="mantra">अन्नदानं परं दानं</div>
              <p className="mantra-meaning">The gift of food is the greatest of all gifts — it sustains life, nourishes the soul, and earns eternal merit.</p>
            </div>
          </div>
          <div className="editorial-text reveal-right">
            <div className="overline" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--navy-2)", marginBottom: 12 }}>The Tradition</div>
            <h2>Why Annadanam?</h2>
            <p>Every morning, the ISKM kitchen in Geylang comes alive before dawn. Volunteers wash rice, chop vegetables, and stir enormous pots of dal — enough to fill 250 plates by midday. By afternoon, packed meals travel to Little India, where they're handed out free to migrant workers on their lunch break, elderly residents, families, and anyone who walks up.</p>
            <p>This isn't charity in the modern sense. In the Vedic tradition, feeding others is considered the highest form of giving — Annadanam. The food is first offered to the Lord with devotion, and what comes back is Prasadam: His mercy, in edible form. The giver earns spiritual merit. The receiver gets a warm meal. Nobody asks questions, nobody checks eligibility.</p>
            <button
              className="read-more"
              onClick={() => setEditorialExpanded(!editorialExpanded)}
              aria-expanded={editorialExpanded}
              aria-controls="editorialMore"
            >
              {editorialExpanded ? "Show less ↑" : "Read more about this tradition ↓"}
            </button>
            <div className={`editorial-expanded${editorialExpanded ? " show" : ""}`} id="editorialMore">
              <p>This daily practice began in 2019 and has not stopped for a single day — not during the pandemic, not during public holidays, not during monsoon storms. It is ISKM Singapore's direct response to their founder-acharya's instruction that no one near a temple should go hungry.</p>
              <p>When you sponsor a day, you step into that chain. Your $300 buys the rice, the dal, the vegetables, the oil, the spices, and the containers. If you choose, you can visit the kitchen, help cook, and personally hand meals to people on the street.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="sec-header reveal" style={{ maxWidth: 1100, margin: "0 auto 45px" }}>
          <div className="overline">Sponsor Stories</div>
          <h2>What Sponsors Say</h2>
          <div className="divider"></div>
          <p>Hear from people who've experienced the joy of feeding 250 people in a single day</p>
        </div>
        <div className="testimonial-marquee">
          <div className="testimonial-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div className="testimonial-card" key={i} aria-hidden={i >= TESTIMONIALS.length ? true : undefined}>
                <div className="testimonial-stars" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, j) => <i key={j} className="fas fa-star" aria-hidden="true"></i>)}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div className="testimonial-info">
                    <div className="t-name">{t.name}</div>
                    <div className="t-detail">{t.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="section">
        <div className="sec-header reveal">
          <div className="overline">Why People Sponsor</div>
          <h2>Every Sponsor Has a Reason</h2>
          <div className="divider"></div>
          <p>Choose any day for any reason — or no reason at all</p>
        </div>
        <div className="occasions-grid">
          {OCCASIONS.map((occ, i) => (
            <div className={`occasion-card reveal stagger-${(i % 3) + 1}`} key={i}>
              <div className={`occ-icon ${occ.cls}`}><i className={occ.icon} aria-hidden="true"></i></div>
              <h4>{occ.title}</h4>
              <p>{occ.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="section" id="tiers" style={{ paddingTop: 30 }}>
        <div className="sec-header reveal">
          <div className="overline">Sponsorship Options</div>
          <h2>Choose How You'd Like to Give</h2>
          <div className="divider"></div>
          <p>Every option feeds 250 people a full, freshly cooked sanctified meal</p>
        </div>
        <div className="donation-grid">
          <div className="dona-card featured reveal stagger-1">
            <div className="dona-popular-tag">Most Popular</div>
            <div className="dona-icon" style={{ background: "rgba(248,164,192,.12)" }}><i className="fas fa-sun" aria-hidden="true"></i></div>
            <h4>Sunday Feast</h4>
            <div className="dona-price">$500</div>
            <p>Sundays draw the largest crowds. Feed the full Sunday congregation with an expanded feast.</p>
            <a href="#sponsor" className="dona-btn">Sponsor a Sunday</a>
          </div>
          <div className="dona-card reveal stagger-2">
            <div className="dona-icon"><i className="fas fa-calendar-day" aria-hidden="true"></i></div>
            <h4>Weekday Sponsorship</h4>
            <div className="dona-price">$300</div>
            <p>Monday–Saturday. 250 meals prepared, cooked, and served free in your name.</p>
            <a href="#sponsor" className="dona-btn">Sponsor a Weekday</a>
          </div>
          <div className="dona-card reveal stagger-3">
            <div className="dona-icon"><i className="fas fa-heart" aria-hidden="true"></i></div>
            <h4>Donate Any Amount</h4>
            <div className="dona-price" style={{ fontSize: 20 }}>Your Choice</div>
            <p>Can't sponsor a full day? Every dollar still feeds someone. Contribute any amount.</p>
            <a href="https://srikrishnamandir.org/product/annadanam-seva/" target="_blank" rel="noopener noreferrer" className="dona-btn">Contribute</a>
          </div>
          <div className="dona-card reveal stagger-4">
            <div className="dona-icon"><i className="fas fa-carrot" aria-hidden="true"></i></div>
            <h4>Donate Groceries</h4>
            <div className="dona-price" style={{ fontSize: 20 }}>In Kind</div>
            <p>Rice, dal, ghee, vegetables, spices — donate ingredients directly to the kitchen.</p>
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("I'd like to donate groceries to the Prasadam kitchen. Please share the list of items needed and pickup details.")}`} target="_blank" rel="noopener noreferrer" className="dona-btn">Arrange via WhatsApp</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="sec-header reveal">
          <div className="overline">Common Questions</div>
          <h2>Frequently Asked Questions</h2>
          <div className="divider"></div>
        </div>
        <div className="faq-list" role="list">
          {FAQ_DATA.map((item, i) => (
            <div className={`faq-item${openFaq === i ? " open" : ""}`} role="listitem" key={i}>
              <button
                className="faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{item.q}</span>
                <i className="fas fa-chevron-down" aria-hidden="true"></i>
              </button>
              <div className="faq-a" role="region">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer */}
      <div className="volunteer-banner reveal-scale" style={{ paddingBottom: 70 }}>
        <div className="volunteer-inner">
          <div className="volunteer-img">
            <Pic n="15" alt="Volunteer team at the Prasadam distribution table in Singapore" width={550} height={340} />
          </div>
          <div className="volunteer-text">
            <h2>Serve With Your Hands</h2>
            <p>Join our kitchen team — cook, pack, and hand out Prasadam to those who need it. No experience required, just a willing heart. Volunteers serve daily from 9 AM at our Geylang kitchen.</p>
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("I'd like to volunteer for Prasadam distribution")}`} target="_blank" rel="noopener noreferrer" className="btn-volunteer">
              <i className="fas fa-hands-helping" aria-hidden="true"></i> &nbsp;Volunteer via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Share */}
      <section className="share-section reveal">
        <div className="sec-header" style={{ marginBottom: 0 }}>
          <div className="overline">Spread the Word</div>
          <h2>Know Someone Who'd Like to Sponsor?</h2>
          <div className="divider"></div>
        </div>
        <div className="share-row">
          <a href={`https://wa.me/?text=${encodeURIComponent(`Sponsor a day of free Prasadam for 250 people at ISKM Singapore — just $1.20 per meal. Choose your date: ${PAGE_URL}`)}`} target="_blank" rel="noopener noreferrer" className="share-pill pill-wa"><i className="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(PAGE_URL)}&text=${encodeURIComponent("Feed 250 people for just $1.20 per meal. Sponsor a day of free Prasadam at ISKM Singapore!")}`} target="_blank" rel="noopener noreferrer" className="share-pill pill-tg"><i className="fab fa-telegram" aria-hidden="true"></i> Telegram</a>
          <button onClick={handleCopyLink} className="share-pill pill-copy" style={{ border: "1px solid #e5ded5", cursor: "pointer" }}><i className="fas fa-link" aria-hidden="true"></i> <span>{copyText}</span></button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="final-cta-bg">
          <Pic n="18" alt="" />
        </div>
        <h2 className="reveal">Tomorrow, 250 People Will Line Up for a Meal</h2>
        <p className="reveal">$1.20 per plate &middot; Your name &middot; Your blessing &middot; Their nourishment</p>
        <a href="#sponsor" className="btn-final reveal"><i className="fas fa-hand-holding-heart" aria-hidden="true"></i> &nbsp;Sponsor a Day Now</a>
      </section>

      {/* Footer */}
      <footer>
        <img src="/images/logo.webp" alt="ISKM" width={38} height={38} />
        <p>&copy; 2026 International Sri Krishna Mandir &middot; <a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer">srikrishnamandir.org</a> &middot; <a href="mailto:contact@srikrishnamandir.org">contact@srikrishnamandir.org</a></p>
      </footer>

      {/* Mobile Sticky */}
      <div className="mobile-sticky">
        <a href="#sponsor"><i className="fas fa-hand-holding-heart" aria-hidden="true"></i> &nbsp;Sponsor a Day — From $300</a>
      </div>

      {/* Toast */}
      <div className={`sponsor-toast${toastVisible ? " show" : ""}`} role="status" aria-live="polite">
        <div className="toast-icon"><i className="fas fa-hand-holding-heart" aria-hidden="true"></i></div>
        <div className="toast-text">
          <strong>{currentToast.name}</strong> sponsored a day for <em>{currentToast.reason}</em>
          <span className="toast-time">{currentToast.time}</span>
        </div>
        <button className="toast-close" onClick={() => setToastVisible(false)} aria-label="Dismiss notification">&times;</button>
      </div>
    </div>
  );
}
