import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";
import "./EventsHome.css";

type UpcomingEvent = {
  title: string;
  dateLabel: string;
  description: string;
  image: string;
  href: string;
  featured?: boolean;
};

type PastEvent = {
  title: string;
  dateLabel: string;
  image: string;
};

const UPCOMING: UpcomingEvent[] = [
  {
    title: "Ratha Yātrā 2026",
    dateLabel: "Sunday, 5 July 2026",
    description:
      "Lord Jagannātha, Baladeva and Subhadrā take a joyous journey through the streets in Their grand chariot. Kīrtana, prasādam and blessings for all.",
    image: "/images/ratha-yatra/hero.webp",
    href: "/ratha-yatra-2026",
    featured: true,
  },
  {
    title: "Kids Ratha Yātrā 2026",
    dateLabel: "Sunday, 5 July 2026",
    description:
      "A family-friendly evening built for the little ones — kīrtana, stalls, dance and prasādam, with the children at the centre.",
    image: "/images/kids-ratha-yatra/hero_01_kids_holding_deities.webp",
    href: "/kids-ratha-yatra-2026",
  },
  {
    title: "Weekend Love Feast",
    dateLabel: "Every Saturday & Sunday",
    description:
      "Join our weekend kīrtana followed by a delicious prasādam meal with the temple community and guests.",
    image: "/images/ratha-yatra/annadanam-seva.webp",
    href: "/weekend-love-feast",
  },
  {
    title: "Free Prasādam Program",
    dateLabel: "Ongoing seva",
    description:
      "Sanctified vegetarian meals offered daily to the community. Sponsor a meal or join the seva.",
    image: "/images/Free-Prasadam-Program/1.webp",
    href: "/free-prasadam-program",
  },
];

const PAST: PastEvent[] = [
  {
    title: "Śrī Nṛsiṁha Caturdaśī 2026",
    dateLabel: "Monday, 4 May 2026",
    image: "/images/hero-image.webp",
  },
  {
    title: "Gaura Pūrṇimā 2026",
    dateLabel: "Thursday, 5 March 2026",
    image: "/images/ratha-yatra/g3.webp",
  },
  {
    title: "Govardhana Pūjā 2025",
    dateLabel: "Thursday, 23 October 2025",
    image: "/images/ratha-yatra/g7.webp",
  },
  {
    title: "Kārttika Festival 2025",
    dateLabel: "October – November 2025",
    image: "/images/ratha-yatra/g10.webp",
  },
];

export default function EventsHome() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featured = UPCOMING.find((e) => e.featured)!;
  const others = UPCOMING.filter((e) => !e.featured);

  return (
    <>
      <Helmet>
        <title>Events at International Sri Krishna Mandir — ISKM Singapore</title>
        <meta
          name="description"
          content="Discover upcoming festivals, kīrtana gatherings and temple celebrations at ISKM Singapore — and revisit sacred moments from past events."
        />
        <meta property="og:title" content="Events at International Sri Krishna Mandir — ISKM Singapore" />
        <meta
          property="og:description"
          content="Upcoming festivals, cultural programmes and temple celebrations at ISKM Singapore."
        />
        <meta property="og:image" content="https://events.srikrishnamandir.org/images/events-home-hero-jagan.jpg" />
        <meta property="og:url" content="https://events.srikrishnamandir.org/" />
        <link rel="canonical" href="https://events.srikrishnamandir.org/" />
      </Helmet>

      <div className="eh-page">
        {/* Top bar */}
        <header className="eh-nav">
          <a href="https://srikrishnamandir.org" target="_blank" rel="noopener noreferrer" className="eh-brand">
            <img src="/images/logo.webp" alt="ISKM Singapore" width={36} height={36} />
            <span>
              <strong>ISKM Singapore</strong>
              <em>International Sri Krishna Mandir</em>
            </span>
          </a>
          <nav className="eh-nav-links">
            <a href="#upcoming">Upcoming</a>
            <a href="#past">Past Events</a>
            <a
              href="https://srikrishnamandir.org"
              target="_blank"
              rel="noopener noreferrer"
              className="eh-nav-cta"
            >
              Visit the Temple
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="eh-hero">
          <div className="eh-hero-inner">
            <div className="eh-hero-copy">
              <span className="eh-hero-bar" aria-hidden="true" />
              <h1>
                Events at <br />
                International Sri Krishna Mandir
              </h1>
              <p>
                Discover upcoming festivals, cultural programmes, kīrtana gatherings and temple
                celebrations — and revisit sacred moments from past events.
              </p>
              <div className="eh-hero-ctas">
                <a href="#upcoming" className="eh-btn eh-btn-primary">
                  Explore Upcoming Events <i className="fas fa-arrow-right" />
                </a>
                <a href="#past" className="eh-btn eh-btn-ghost">
                  Browse Past Events
                </a>
              </div>
            </div>
            <div className="eh-hero-art">
              <img
                src="/images/events-home-hero-radha-main.jpg"
                alt="Ratha Yātrā chariot festival"
                className="eh-hero-art-main object-cover"
                loading="eager"
              />
              <img
                src="/images/events-home-hero-radha.jpg"
                alt="Temple deities"
                className="eh-hero-art-card eh-hero-art-card-1"
                loading="lazy"
              />
              <img
                src="/images/ratha-yatra/g5.webp"
                alt="Devotees in kīrtana"
                className="eh-hero-art-card eh-hero-art-card-2"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Value strip */}
        <section className="eh-strip" aria-label="What we offer">
          <div className="eh-strip-item">
            <i className="fas fa-calendar-check" />
            <div>
              <strong>Year-round sacred celebrations</strong>
              <span>Festivals and programmes throughout the year</span>
            </div>
          </div>
          <div className="eh-strip-item">
            <i className="fas fa-people-roof" />
            <div>
              <strong>Family-friendly &amp; open to all</strong>
              <span>Everyone is welcome to join and participate</span>
            </div>
          </div>
          <div className="eh-strip-item">
            <i className="fas fa-bowl-rice" />
            <div>
              <strong>Free prasādam at major events</strong>
              <span>Sanctified vegetarian feast for all</span>
            </div>
          </div>
          <div className="eh-strip-item">
            <i className="fas fa-place-of-worship" />
            <div>
              <strong>Hosted by ISKM Singapore</strong>
              <span>Serving the community with devotion since 1992</span>
            </div>
          </div>
        </section>

        {/* Upcoming */}
        <section className="eh-section" id="upcoming">
          <div className="eh-section-head">
            <span className="eh-kicker">UPCOMING</span>
            <h2>Join Our Next Celebrations</h2>
            <div className="eh-divider" aria-hidden="true">
              <i className="fas fa-spa" />
            </div>
            <p className="eh-section-sub">Each upcoming event links to its own dedicated event page.</p>
          </div>

          {/* Featured */}
          <Link to={featured.href} className="eh-featured-card">
            <div className="eh-featured-img">
              <img src={featured.image} alt={featured.title} loading="lazy" />
            </div>
            <div className="eh-featured-body">
              <span className="eh-featured-tag">FEATURED</span>
              <h3>{featured.title}</h3>
              <div className="eh-date">
                <i className="fas fa-calendar" /> {featured.dateLabel}
              </div>
              <p>{featured.description}</p>
              <span className="eh-btn eh-btn-primary eh-btn-sm">
                View Event <i className="fas fa-arrow-right" />
              </span>
            </div>
          </Link>

          {/* Others */}
          <div className="eh-grid">
            {others.map((e) => (
              <Link to={e.href} key={e.title} className="eh-card">
                <div className="eh-card-img">
                  <img src={e.image} alt={e.title} loading="lazy" />
                </div>
                <div className="eh-card-body">
                  <h4>{e.title}</h4>
                  <div className="eh-date">
                    <i className="fas fa-calendar" /> {e.dateLabel}
                  </div>
                  <p>{e.description}</p>
                  <span className="eh-btn eh-btn-primary eh-btn-sm">
                    View Event <i className="fas fa-arrow-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Past */}
        <section className="eh-section eh-section-archive" id="past">
          <div className="eh-section-head">
            <span className="eh-kicker">ARCHIVE</span>
            <h2>Past Events</h2>
            <div className="eh-divider" aria-hidden="true">
              <i className="fas fa-spa" />
            </div>
            <p className="eh-section-sub">A keepsake of celebrations we’ve hosted together.</p>
          </div>

          <div className="eh-past-grid">
            {PAST.map((e) => (
              <article className="eh-past-card" key={e.title}>
                <div className="eh-past-img">
                  <img src={e.image} alt={e.title} loading="lazy" />
                  <span className="eh-past-tag">Past Event</span>
                </div>
                <div className="eh-past-body">
                  <h4>{e.title}</h4>
                  <div className="eh-date">
                    <i className="fas fa-calendar" /> {e.dateLabel}
                  </div>
                  <span className="eh-past-gallery">
                    <i className="far fa-images" /> Gallery link coming soon
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="eh-final-cta">
          <h2>Don’t Miss the Next Sacred Celebration</h2>
          <p>See all upcoming events and plan your visit.</p>
          <a href="#upcoming" className="eh-btn eh-btn-primary">
            View Upcoming Events <i className="fas fa-arrow-right" />
          </a>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
