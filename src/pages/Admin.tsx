import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import "./admin/AdminStyles.css";

// ═══ TYPES ═══
interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  attendees: number;
  is_volunteer: boolean;
  age: string | null;
  gender: string | null;
  remarks: string | null;
  volunteer_categories: string[] | null;
  created_at: string;
  confirmation_sent?: boolean;
  reminder_sent?: boolean;
}

interface RyRegistration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  attendees: number;
  is_volunteer: boolean;
  confirmation_sent: boolean;
  reminder_sent: boolean;
  created_at: string;
}

interface SlfRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string | null;
  attendees: number;
  first_time: boolean;
  created_at: string;
}

interface PrasadamSponsorship {
  id: string;
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  email_needs_backfill: boolean;
  phone_needs_verification: boolean;
  preferred_date: string;
  occasion: string | null;
  tier: string;
  dedication: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface EmailLog {
  id: string;
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface TrackingEvent {
  id: string;
  registration_id: string | null;
  email_type: string;
  event_type: string;
  link_name: string | null;
  recipient_email: string;
  created_at: string;
}

type Page = "overview" | "registrations" | "prasadam" | "emails";
type EventTab = "all" | "nrsimha" | "slf" | "prasadam" | "ratha_yatra" | "kry";
type RegEventTab = "nrsimha" | "slf" | "prasadam" | "ratha_yatra" | "kry";

interface KryRegistration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  adults: number;
  kids: number;
  attendees: number; // synthetic = adults + kids
  source: string | null;
  confirmation_sent: boolean;
  reminder_sent: boolean;
  thankyou_sent: boolean;
  created_at: string;
}

const ROWS_PER_PAGE = 10;

const TIER_PRICE: Record<string, number> = {
  full: 1500,
  half: 750,
  quarter: 350,
  blessing: 100,
};

const TIER_LABEL: Record<string, string> = {
  full: "Full Sponsor",
  half: "Half Sponsor",
  quarter: "Quarter Sponsor",
  blessing: "Blessing",
};

// ═══ MAIN COMPONENT ═══
export default function Admin() {
  const [page, setPage] = useState<Page>("overview");
  const [ncData, setNcData] = useState<Registration[]>([]);
  const [ryData, setRyData] = useState<RyRegistration[]>([]);
  const [kryData, setKryData] = useState<KryRegistration[]>([]);
  const [slfData, setSlfData] = useState<SlfRegistration[]>([]);
  const [prasadamData, setPrasadamData] = useState<PrasadamSponsorship[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [eventTab, setEventTab] = useState<EventTab>("all");
  const [regEventTab, setRegEventTab] = useState<RegEventTab>("nrsimha");
  const [regPage, setRegPage] = useState(1);
  const [emailPage, setEmailPage] = useState(1);
  const [prasadamPage, setPrasadamPage] = useState(1);
  const [prasadamFilter, setPrasadamFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "needs_backfill">("all");
  const [selectedSponsor, setSelectedSponsor] = useState<PrasadamSponsorship | null>(null);

  // Registration log filters
  const [regDateRange, setRegDateRange] = useState<"all" | "24h" | "7d" | "30d">("all");
  const [slfDayFilter, setSlfDayFilter] = useState<"all" | "sat" | "sun">("all");
  const [slfFirstTimeFilter, setSlfFirstTimeFilter] = useState<"all" | "yes" | "no">("all");
  const [slfDateFilter, setSlfDateFilter] = useState<string>("all");
  const [regConfFilter, setRegConfFilter] = useState<"all" | "sent" | "not">("all");
  const [regVolFilter, setRegVolFilter] = useState<"all" | "vol" | "att">("all");

  const resetRegFilters = () => {
    setRegDateRange("all");
    setSlfDayFilter("all");
    setSlfFirstTimeFilter("all");
    setSlfDateFilter("all");
    setRegConfFilter("all");
    setRegVolFilter("all");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session);
      if (session) fetchAll();
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
      if (session) fetchAll();
      else setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Paginated fetch — Supabase caps at 1000 rows/request, so loop with .range()
  // until exhausted or the safety cap is hit. Cap = 60k rows per table.
  const fetchAllRows = async <T,>(table: string, cap = 60000): Promise<T[]> => {
    const pageSize = 1000;
    const out: T[] = [];
    for (let from = 0; from < cap; from += pageSize) {
      const to = Math.min(from + pageSize - 1, cap - 1);
      const { data, error } = await supabase
        .from(table as any)
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error || !data || data.length === 0) break;
      out.push(...(data as T[]));
      if (data.length < pageSize) break;
    }
    return out;
  };

  const fetchAll = async () => {
    setLoading(true);
    const [ncRows, ryRows, kryRowsRaw, slfRows, prasadamRows, emailRows, trackRows] = await Promise.all([
      fetchAllRows<Registration>("registrations"),
      fetchAllRows<RyRegistration>("ratha_yatra_registrations"),
      fetchAllRows<Omit<KryRegistration, "attendees">>("kids_ratha_yatra_registrations"),
      fetchAllRows<SlfRegistration>("weekend_love_feast_registrations"),
      fetchAllRows<PrasadamSponsorship>("prasadam_sponsorships"),
      fetchAllRows<EmailLog>("email_send_log"),
      fetchAllRows<TrackingEvent>("email_tracking_events"),
    ]);
    setNcData(ncRows);
    setRyData(ryRows);
    setKryData(kryRowsRaw.map(r => ({ ...r, attendees: (r.adults || 0) + (r.kids || 0) })));
    setSlfData(slfRows);
    setPrasadamData(prasadamRows);
    setEmailLogs(emailRows);
    setTrackingEvents(trackRows);
    setLoading(false);
  };

  // ═══ LOGIN ═══
  if (!loggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <h2>Admin Panel</h2>
          <p className="admin-login-sub">ISKM Singapore Events</p>
          {authError && <p className="admin-login-error">{authError}</p>}
          <form onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" />
            </div>
            <div className="admin-form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="admin-login-btn">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">
          <div className="spinner-dot"></div>
          <span style={{ color: "#1e3a6e", fontSize: "14px", fontWeight: 600 }}>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => { await supabase.auth.signOut(); };

  // ═══ CROSS-EVENT METRICS ═══
  // Normalize email for cross-event matching (lowercase, trim).
  // Exclude legacy backfill placeholders so they don't fake-merge as the same person.
  const normEmail = (e: string | null | undefined) =>
    (e || "").trim().toLowerCase();
  const isPlaceholder = (e: string) =>
    e.endsWith("@needsbackfill.srikrishnamandir.org");

  const ncEmails = new Set(
    ncData.map(r => normEmail(r.email)).filter(e => e && !isPlaceholder(e))
  );
  const slfEmails = new Set(
    slfData.map(r => normEmail(r.email)).filter(e => e && !isPlaceholder(e))
  );
  const prasadamEmails = new Set(
    prasadamData.map(r => normEmail(r.email)).filter(e => e && !isPlaceholder(e))
  );
  const ryEmails = new Set(
    ryData.map(r => normEmail(r.email)).filter(e => e && !isPlaceholder(e))
  );
  const kryEmails = new Set(
    kryData.map(r => normEmail(r.email)).filter(e => e && !isPlaceholder(e))
  );

  const allEmailsUnion = new Set<string>([...ncEmails, ...slfEmails, ...prasadamEmails, ...ryEmails, ...kryEmails]);
  const uniquePeopleCount = allEmailsUnion.size;

  // Overlap: emails appearing in 2+ tables
  const overlapEmails = [...allEmailsUnion].filter(e => {
    let count = 0;
    if (ncEmails.has(e)) count++;
    if (slfEmails.has(e)) count++;
    if (prasadamEmails.has(e)) count++;
    if (ryEmails.has(e)) count++;
    if (kryEmails.has(e)) count++;
    return count >= 2;
  });
  const overlapCount = overlapEmails.length;

  // Triple overlap (devotees engaged across all 3+ surfaces)
  const tripleOverlap = [...allEmailsUnion].filter(e => {
    let count = 0;
    if (ncEmails.has(e)) count++;
    if (slfEmails.has(e)) count++;
    if (prasadamEmails.has(e)) count++;
    if (ryEmails.has(e)) count++;
    if (kryEmails.has(e)) count++;
    return count >= 3;
  }).length;

  const totalRegistrationsAcross = ncData.length + slfData.length + prasadamData.length + ryData.length + kryData.length;
  const totalAttendeesAcross =
    ncData.reduce((s, r) => s + r.attendees, 0) +
    slfData.reduce((s, r) => s + r.attendees, 0) +
    ryData.reduce((s, r) => s + r.attendees, 0) +
    kryData.reduce((s, r) => s + r.attendees, 0);

  const totalSponsorshipValue = prasadamData
    .filter(r => r.status === "confirmed" || r.status === "completed")
    .reduce((s, r) => s + (TIER_PRICE[r.tier] || 0), 0);

  // ═══ EVENT-SPECIFIC KPIs ═══
  // NC
  const ncTotal = ncData.length;
  const ncAttendees = ncData.reduce((s, r) => s + r.attendees, 0);
  const ncAvgGroup = ncTotal > 0 ? (ncAttendees / ncTotal).toFixed(1) : "0";
  const ncConfirmed = ncData.filter(r => r.confirmation_sent).length;
  const ncRemindersSent = ncData.filter(r => r.reminder_sent).length;
  const ncVolunteers = ncData.filter(r => r.is_volunteer).length;

  // RY (Ratha Yatra)
  const ryTotal = ryData.length;
  const ryAttendees = ryData.reduce((s, r) => s + r.attendees, 0);
  const ryAvgGroup = ryTotal > 0 ? (ryAttendees / ryTotal).toFixed(1) : "0";
  const ryConfirmed = ryData.filter(r => r.confirmation_sent).length;
  const ryRemindersSent = ryData.filter(r => r.reminder_sent).length;

  // KRY (Kids Ratha Yatra)
  const kryTotal = kryData.length;
  const kryAdults = kryData.reduce((s, r) => s + (r.adults || 0), 0);
  const kryKids = kryData.reduce((s, r) => s + (r.kids || 0), 0);
  const kryAttendees = kryAdults + kryKids;
  const kryAvgGroup = kryTotal > 0 ? (kryAttendees / kryTotal).toFixed(1) : "0";
  const kryConfirmed = kryData.filter(r => r.confirmation_sent).length;
  const kryRemindersSent = kryData.filter(r => r.reminder_sent).length;


  const slfTotal = slfData.length;
  const slfAttendees = slfData.reduce((s, r) => s + r.attendees, 0);
  const slfAvgGroup = slfTotal > 0 ? (slfAttendees / slfTotal).toFixed(1) : "0";
  const slfFirstTime = slfData.filter(r => r.first_time).length;
  const slfReturning = slfTotal - slfFirstTime;

  // Prasadam
  const prasadamTotal = prasadamData.length;
  const prasadamPending = prasadamData.filter(r => r.status === "pending").length;
  const prasadamConfirmed = prasadamData.filter(r => r.status === "confirmed").length;
  const prasadamCompleted = prasadamData.filter(r => r.status === "completed").length;
  const prasadamNeedsBackfill = prasadamData.filter(
    r => r.email_needs_backfill || r.phone_needs_verification
  );
  const prasadamConfirmedRate = prasadamTotal > 0
    ? (((prasadamConfirmed + prasadamCompleted) / prasadamTotal) * 100).toFixed(0)
    : "0";

  // Tier breakdown for prasadam (pie chart)
  const tierCounts: Record<string, number> = {};
  prasadamData.forEach(r => {
    tierCounts[r.tier] = (tierCounts[r.tier] || 0) + 1;
  });
  const tierChartData = Object.entries(tierCounts).map(([tier, count]) => ({
    name: TIER_LABEL[tier] || tier,
    value: count,
    tier,
  }));

  // ═══ EMAIL DEDUPLICATION (latest status per message_id) ═══
  const uniqueEmails = new Map<string, EmailLog>();
  emailLogs.forEach((e) => {
    const key = e.message_id || e.id;
    const existing = uniqueEmails.get(key);
    if (!existing || new Date(e.created_at) > new Date(existing.created_at)) {
      uniqueEmails.set(key, e);
    }
  });
  const uniqueEmailList = Array.from(uniqueEmails.values());
  const emailStatSent = uniqueEmailList.filter(e => e.status === "sent").length;
  const emailStatPending = uniqueEmailList.filter(e => e.status === "pending").length;
  const emailStatFailed = uniqueEmailList.filter(e => e.status === "failed" || e.status === "dlq").length;
  const emailStatSuppressed = uniqueEmailList.filter(e => e.status === "suppressed").length;

  // Tracking stats — overall (all events combined, used on the All-events overview & Emails page)
  const openEvents = trackingEvents.filter(t => t.event_type === "open");
  const clickEvents = trackingEvents.filter(t => t.event_type === "click");
  const uniqueOpens = new Set(openEvents.map(t => t.recipient_email)).size;
  const calendarClicks = clickEvents.filter(t => t.link_name === "calendar").length;
  const kavachaClicks = clickEvents.filter(t => t.link_name === "buy_kavacha").length;
  const directionsClicks = clickEvents.filter(t => t.link_name === "directions").length;
  const openRate = emailStatSent > 0 ? ((uniqueOpens / emailStatSent) * 100).toFixed(1) : "0";

  // Per-event tracking buckets — email_type prefixes:
  //   NC      → "confirmation" / "reminder"  (legacy bare names)
  //   WLF/SLF → "slf-*" or "wlf-*"
  //   Prasadam→ "prasadam-*"
  const isNcType = (et: string) => et === "confirmation" || et === "reminder" || et.startsWith("nc-") || et.startsWith("nc_");
  const isSlfType = (et: string) => et.startsWith("slf-") || et.startsWith("wlf-") || et.startsWith("slf_") || et.startsWith("wlf_");
  const isPrasadamType = (et: string) => et.startsWith("prasadam-") || et.startsWith("prasadam_");
  const isRyType = (et: string) => et.startsWith("ry-") || et.startsWith("ry_");
  const isKryType = (et: string) => et.startsWith("kry-") || et.startsWith("kry_");

  const buildEventEngagement = (predicate: (et: string) => boolean, sentCount: number) => {
    const opens = trackingEvents.filter(t => t.event_type === "open" && predicate(t.email_type || ""));
    const clicks = trackingEvents.filter(t => t.event_type === "click" && predicate(t.email_type || ""));
    const uniq = new Set(opens.map(t => t.recipient_email)).size;
    return {
      opens: opens.length,
      uniqueOpens: uniq,
      openRate: sentCount > 0 ? ((uniq / sentCount) * 100).toFixed(1) : "0",
      calendarClicks: clicks.filter(c => c.link_name === "calendar").length,
      directionsClicks: clicks.filter(c => c.link_name === "directions").length,
      kavachaClicks: clicks.filter(c => c.link_name === "buy_kavacha").length,
      shareClicks: clicks.filter(c => (c.link_name || "").startsWith("share_")).length,
    };
  };

  // Sent-counts per event are best approximated by template_name on email_send_log
  const ncSent = uniqueEmailList.filter(e => e.status === "sent" && (e.template_name || "").startsWith("nc-")).length;
  const slfSent = uniqueEmailList.filter(e => e.status === "sent" && ((e.template_name || "").includes("wlf") || (e.template_name || "").includes("slf"))).length;
  const prasadamSent = uniqueEmailList.filter(e => e.status === "sent" && (e.template_name || "").includes("prasadam")).length;
  const rySent = uniqueEmailList.filter(e => e.status === "sent" && (e.template_name || "").includes("ry-") && !(e.template_name || "").includes("kry-")).length;
  const krySent = uniqueEmailList.filter(e => e.status === "sent" && (e.template_name || "").includes("kry-")).length;

  const ncEng = buildEventEngagement(isNcType, ncSent);
  const slfEng = buildEventEngagement(isSlfType, slfSent);
  const prasadamEng = buildEventEngagement(isPrasadamType, prasadamSent);
  const ryEng = buildEventEngagement(isRyType, rySent);
  const kryEng = buildEventEngagement(isKryType, krySent);

  // ═══ CHART: Registrations over time (combined) ═══
  const buildChartData = (tab: EventTab) => {
    const dayMap: Record<string, number> = {};
    const sources: Array<{ created_at: string; count: number }> = [];
    if (tab === "all" || tab === "nrsimha")
      ncData.forEach(r => sources.push({ created_at: r.created_at, count: 1 }));
    if (tab === "all" || tab === "ratha_yatra")
      ryData.forEach(r => sources.push({ created_at: r.created_at, count: 1 }));
    if (tab === "all" || tab === "kry")
      kryData.forEach(r => sources.push({ created_at: r.created_at, count: 1 }));
    if (tab === "all" || tab === "slf")
      slfData.forEach(r => sources.push({ created_at: r.created_at, count: 1 }));
    if (tab === "all" || tab === "prasadam")
      prasadamData.forEach(r => sources.push({ created_at: r.created_at, count: 1 }));
    sources.forEach(s => {
      const day = new Date(s.created_at).toLocaleDateString("en-SG", { month: "short", day: "numeric" });
      dayMap[day] = (dayMap[day] || 0) + s.count;
    });
    return Object.entries(dayMap).reverse().map(([date, count]) => ({ date, count }));
  };
  const chartData = buildChartData(eventTab);

  // ═══ FILTERED VIEWS ═══
  const activeRegList: (Registration | SlfRegistration | PrasadamSponsorship | RyRegistration | KryRegistration)[] =
    regEventTab === "slf" ? slfData
      : regEventTab === "prasadam" ? prasadamData
      : regEventTab === "ratha_yatra" ? ryData
      : regEventTab === "kry" ? kryData
      : ncData;

  // Date range cutoff
  const dateRangeCutoff = (() => {
    if (regDateRange === "all") return 0;
    const now = Date.now();
    if (regDateRange === "24h") return now - 24 * 3600 * 1000;
    if (regDateRange === "7d") return now - 7 * 24 * 3600 * 1000;
    if (regDateRange === "30d") return now - 30 * 24 * 3600 * 1000;
    return 0;
  })();

  const filteredReg = activeRegList.filter((r: any) => {
    const name = r.name || r.full_name || "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (dateRangeCutoff > 0 && new Date(r.created_at).getTime() < dateRangeCutoff) return false;

    if (regEventTab === "slf") {
      const slfR = r as SlfRegistration & { attendance_date?: string | null };
      if (slfDayFilter !== "all" || slfDateFilter !== "all") {
        if (!slfR.attendance_date) return false;
        if (slfDateFilter !== "all" && slfR.attendance_date !== slfDateFilter) return false;
        if (slfDayFilter !== "all") {
          const dow = new Date(slfR.attendance_date + "T12:00:00+08:00").getDay();
          if (slfDayFilter === "sat" && dow !== 6) return false;
          if (slfDayFilter === "sun" && dow !== 0) return false;
        }
      }
      if (slfFirstTimeFilter === "yes" && !slfR.first_time) return false;
      if (slfFirstTimeFilter === "no" && slfR.first_time) return false;
    }

    if (regEventTab === "nrsimha" || regEventTab === "ratha_yatra") {
      if (regConfFilter === "sent" && !r.confirmation_sent) return false;
      if (regConfFilter === "not" && r.confirmation_sent) return false;
      if (regVolFilter === "vol" && !r.is_volunteer) return false;
      if (regVolFilter === "att" && r.is_volunteer) return false;
    }

    if (regEventTab === "kry") {
      if (regConfFilter === "sent" && !r.confirmation_sent) return false;
      if (regConfFilter === "not" && r.confirmation_sent) return false;
    }

    return true;
  });
  const regTotalPages = Math.max(1, Math.ceil(filteredReg.length / ROWS_PER_PAGE));
  const regSlice = filteredReg.slice((regPage - 1) * ROWS_PER_PAGE, regPage * ROWS_PER_PAGE);

  // Distinct upcoming attendance dates (for SLF date dropdown)
  const slfDateOptions = Array.from(
    new Set(slfData.map((r: any) => r.attendance_date).filter(Boolean))
  ).sort();

  // Filtered emails
  const filteredEmails = uniqueEmailList.filter(
    (e) => e.recipient_email.toLowerCase().includes(search.toLowerCase()) ||
      e.template_name.toLowerCase().includes(search.toLowerCase()) ||
      e.status.toLowerCase().includes(search.toLowerCase())
  );
  const emailTotalPages = Math.max(1, Math.ceil(filteredEmails.length / ROWS_PER_PAGE));
  const emailSlice = filteredEmails.slice((emailPage - 1) * ROWS_PER_PAGE, emailPage * ROWS_PER_PAGE);

  // Filtered prasadam (with status filter)
  const filteredPrasadam = prasadamData.filter((r) => {
    if (prasadamFilter === "needs_backfill") {
      if (!r.email_needs_backfill && !r.phone_needs_verification) return false;
    } else if (prasadamFilter !== "all") {
      if (r.status !== prasadamFilter) return false;
    }
    const q = search.toLowerCase();
    return (
      r.full_name.toLowerCase().includes(q) ||
      `${r.country_code || ""}${r.phone || ""}`.toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
      (r.occasion || "").toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q) ||
      r.tier.toLowerCase().includes(q)
    );
  });
  const prasadamTotalPages = Math.max(1, Math.ceil(filteredPrasadam.length / ROWS_PER_PAGE));
  const prasadamSlice = filteredPrasadam.slice((prasadamPage - 1) * ROWS_PER_PAGE, prasadamPage * ROWS_PER_PAGE);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
  };

  const updatePrasadamStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("prasadam_sponsorships")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      alert("Failed to update status: " + error.message);
      return;
    }
    setPrasadamData(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedSponsor?.id === id) setSelectedSponsor({ ...selectedSponsor, status: newStatus });
  };

  const handleDownloadCSV = () => {
    let csvContent: string;
    let prefix: string;
    if (page === "prasadam") {
      const headers = ["Full Name", "Email", "Country Code", "Phone", "Preferred Date", "Occasion", "Tier", "Tier Price (SGD)", "Dedication", "Status", "Email Needs Backfill", "Phone Needs Verification", "Notes", "Submitted At"];
      const rows = filteredPrasadam.map(r => [r.full_name, r.email, r.country_code, r.phone, r.preferred_date, r.occasion || "", r.tier, TIER_PRICE[r.tier] || 0, r.dedication || "", r.status, r.email_needs_backfill ? "yes" : "no", r.phone_needs_verification ? "yes" : "no", r.notes || "", new Date(r.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "prasadam_sponsorships";
    } else if (page === "emails") {
      const headers = ["Template", "Recipient", "Status", "Error", "Sent At"];
      const rows = filteredEmails.map(e => [e.template_name, e.recipient_email, e.status, e.error_message || "", new Date(e.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "email_log";
    } else if (page === "registrations" && regEventTab === "slf") {
      const headers = ["Name", "Email", "Country Code", "Phone", "Attendees", "Attendance Date", "First Time", "Registered At"];
      const rows = slfData.map(r => [r.name, r.email, r.country_code || "", r.phone || "", r.attendees, (r as any).attendance_date || "", r.first_time ? "Yes" : "No", new Date(r.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "weekend_love_feast";
    } else if (page === "registrations" && regEventTab === "prasadam") {
      const headers = ["Full Name", "Email", "Country Code", "Phone", "Tier", "Preferred Date", "Status", "Submitted At"];
      const rows = prasadamData.map(r => [r.full_name, r.email, r.country_code, r.phone, r.tier, r.preferred_date, r.status, new Date(r.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "prasadam_sponsorships";
    } else if (page === "registrations" && regEventTab === "ratha_yatra") {
      const headers = ["Name", "Email", "Phone", "Attendees", "Confirmation", "Reminder", "Registered At"];
      const rows = ryData.map(r => [r.name, r.email, r.phone || "", r.attendees, r.confirmation_sent ? "Yes" : "No", r.reminder_sent ? "Yes" : "No", new Date(r.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "ratha_yatra_registrations";
    } else if (page === "registrations" && regEventTab === "kry") {
      const headers = ["Name", "Email", "Phone", "Adults", "Kids", "Total", "Source", "Confirmation", "Reminder", "Thank You", "Registered At"];
      const rows = kryData.map(r => [r.name, r.email, r.phone || "", r.adults, r.kids, r.adults + r.kids, r.source || "", r.confirmation_sent ? "Yes" : "No", r.reminder_sent ? "Yes" : "No", r.thankyou_sent ? "Yes" : "No", new Date(r.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "kids_ratha_yatra_registrations";
    } else {
      const headers = ["Name", "Email", "Phone", "Attendees", "Volunteer", "Confirmation", "Reminder", "Registered At"];
      const rows = ncData.map(r => [r.name, r.email, r.phone || "", r.attendees, r.is_volunteer ? "Yes" : "No", r.confirmation_sent ? "Yes" : "No", r.reminder_sent ? "Yes" : "No", new Date(r.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "nc_registrations";
    }
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prefix}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { id: "overview" as Page, label: "Executive Overview", icon: "fas fa-th-large" },
    { id: "registrations" as Page, label: "Registration Logs", icon: "fas fa-users" },
    { id: "prasadam" as Page, label: "Prasadam Sponsors", icon: "fas fa-utensils" },
    { id: "emails" as Page, label: "Email Archive", icon: "fas fa-envelope" },
  ];

  const TIER_COLORS = ["#1e3a6e", "#d4a012", "#27ae60", "#e67e22"];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — ISKM Singapore Events</title>
        <meta name="description" content="Internal management console for ISKM Singapore event registrations and sponsorships." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Admin Dashboard — ISKM Singapore Events" />
        <meta property="og:description" content="Internal management console for ISKM Singapore." />
      </Helmet>
    <div className="admin-wrapper">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">ISKM Events</div>
          <div className="admin-sidebar-sub">Management Suite</div>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item${page === item.id ? " active" : ""}`}
              onClick={() => { setPage(item.id); setSearch(""); setRegPage(1); setEmailPage(1); setPrasadamPage(1); }}
            >
              <i className={item.icon}></i>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">A</div>
            <div>
              <div className="admin-user-name">Admin</div>
              <div className="admin-user-role">Super User</div>
            </div>
          </div>
          <button className="admin-btn-signout" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-breadcrumb">
              Dashboard / <span>{navItems.find(n => n.id === page)?.label}</span>
            </span>
          </div>
          <div className="admin-topbar-right">
            {page !== "overview" && (
              <div className="admin-search-wrap">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder={page === "emails" ? "Search emails..." : "Search by name, email, phone..."}
                  value={search}
                  onChange={e => { setSearch(e.target.value); setRegPage(1); setEmailPage(1); setPrasadamPage(1); }}
                />
              </div>
            )}
            {page !== "overview" && (
              <button className="admin-btn-primary" onClick={handleDownloadCSV}>
                <i className="fas fa-download"></i> Export CSV
              </button>
            )}
            <button className="admin-btn-secondary" onClick={fetchAll} title="Refresh data">
              <i className="fas fa-sync"></i>
            </button>
          </div>
        </div>

        <div className="admin-content">
          {/* ═══ OVERVIEW PAGE ═══ */}
          {page === "overview" && (
            <>
              <div className="admin-page-header">
                <h1>Executive Overview</h1>
                <p>Real-time metrics across all ISKM Singapore event surfaces</p>
              </div>

              <div className="admin-event-tabs">
                <button className={`admin-event-tab${eventTab === "all" ? " active" : ""}`} onClick={() => setEventTab("all")}>All Events</button>
                <button className={`admin-event-tab${eventTab === "nrsimha" ? " active" : ""}`} onClick={() => setEventTab("nrsimha")}>Nṛsiṁha Caturdaśī</button>
                <button className={`admin-event-tab${eventTab === "slf" ? " active" : ""}`} onClick={() => setEventTab("slf")}>Weekend Love Feast</button>
                <button className={`admin-event-tab${eventTab === "prasadam" ? " active" : ""}`} onClick={() => setEventTab("prasadam")}>Prasadam Program</button>
                <button className={`admin-event-tab${eventTab === "ratha_yatra" ? " active" : ""}`} onClick={() => setEventTab("ratha_yatra")}>Ratha Yatra</button>
                <button className={`admin-event-tab${eventTab === "kry" ? " active" : ""}`} onClick={() => setEventTab("kry")}>Kids Ratha Yātrā</button>
              </div>

              {/* ═══ ALL EVENTS ═══ */}
              {eventTab === "all" && (
                <>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Unique People</div>
                      <div className="admin-stat-value">{uniquePeopleCount}</div>
                      <div className="admin-stat-sub">Distinct emails across all 3 events</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Submissions</div>
                      <div className="admin-stat-value gold">{totalRegistrationsAcross}</div>
                      <div className="admin-stat-sub">NC: {ncTotal} · SLF: {slfTotal} · Prasadam: {prasadamTotal}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Cross-Event Overlap</div>
                      <div className="admin-stat-value green">{overlapCount}</div>
                      <div className="admin-stat-sub">Engaged on 2+ events · {tripleOverlap} on all 3</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Sponsorship Value</div>
                      <div className="admin-stat-value gold">${totalSponsorshipValue.toLocaleString()}</div>
                      <div className="admin-stat-sub">Confirmed + completed</div>
                    </div>
                  </div>

                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Emails Sent</div>
                      <div className="admin-stat-value green">{emailStatSent}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Open Rate</div>
                      <div className="admin-stat-value green">{openRate}%</div>
                      <div className="admin-stat-sub">{uniqueOpens} unique opens</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Failed / DLQ</div>
                      <div className="admin-stat-value red">{emailStatFailed}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Backfill Needed</div>
                      <div className="admin-stat-value orange">{prasadamNeedsBackfill.length}</div>
                      <div className="admin-stat-sub">Prasadam rows to verify</div>
                    </div>
                  </div>

                  {/* Cross-event matrix */}
                  <div className="admin-table-card">
                    <div className="admin-table-header">
                      <h3>Event Participation Matrix</h3>
                      <span style={{ fontSize: "12px", color: "#888" }}>Counted by unique email (legacy backfill rows excluded)</span>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Event</th>
                            <th>Unique Emails</th>
                            <th>Total Submissions</th>
                            <th>Total Attendees</th>
                            <th>Share of Audience</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="admin-name-text">Nṛsiṁha Caturdaśī</span></td>
                            <td>{ncEmails.size}</td>
                            <td>{ncTotal}</td>
                            <td>{ncAttendees}</td>
                            <td>{uniquePeopleCount > 0 ? `${((ncEmails.size / uniquePeopleCount) * 100).toFixed(0)}%` : "—"}</td>
                          </tr>
                          <tr>
                            <td><span className="admin-name-text">Weekend Love Feast</span></td>
                            <td>{slfEmails.size}</td>
                            <td>{slfTotal}</td>
                            <td>{slfAttendees}</td>
                            <td>{uniquePeopleCount > 0 ? `${((slfEmails.size / uniquePeopleCount) * 100).toFixed(0)}%` : "—"}</td>
                          </tr>
                          <tr>
                            <td><span className="admin-name-text">Prasadam Program</span></td>
                            <td>{prasadamEmails.size}</td>
                            <td>{prasadamTotal}</td>
                            <td>—</td>
                            <td>{uniquePeopleCount > 0 ? `${((prasadamEmails.size / uniquePeopleCount) * 100).toFixed(0)}%` : "—"}</td>
                          </tr>
                          <tr>
                            <td><span className="admin-name-text">Ratha Yātrā</span></td>
                            <td>{ryEmails.size}</td>
                            <td>{ryTotal}</td>
                            <td>{ryAttendees}</td>
                            <td>{uniquePeopleCount > 0 ? `${((ryEmails.size / uniquePeopleCount) * 100).toFixed(0)}%` : "—"}</td>
                          </tr>
                          <tr>
                            <td><span className="admin-name-text">Kids Ratha Yātrā</span></td>
                            <td>{kryEmails.size}</td>
                            <td>{kryTotal}</td>
                            <td>{kryAttendees}</td>
                            <td>{uniquePeopleCount > 0 ? `${((kryEmails.size / uniquePeopleCount) * 100).toFixed(0)}%` : "—"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* ═══ NC ═══ */}
              {eventTab === "nrsimha" && (
                <>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Registrations</div>
                      <div className="admin-stat-value">{ncTotal}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Attendees</div>
                      <div className="admin-stat-value gold">{ncAttendees}</div>
                      <div className="admin-stat-sub">Avg group: {ncAvgGroup}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Confirmations Sent</div>
                      <div className="admin-stat-value green">{ncConfirmed}</div>
                      <div className="admin-stat-sub">{ncTotal > 0 ? `${((ncConfirmed / ncTotal) * 100).toFixed(0)}%` : "0%"} of registrants</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Volunteers</div>
                      <div className="admin-stat-value">{ncVolunteers}</div>
                    </div>
                  </div>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Email Open Rate</div>
                      <div className="admin-stat-value green">{ncEng.openRate}%</div>
                      <div className="admin-stat-sub">{ncEng.uniqueOpens} unique opens</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Calendar Saves</div>
                      <div className="admin-stat-value">{ncEng.calendarClicks}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Kavacha Clicks</div>
                      <div className="admin-stat-value">{ncEng.kavachaClicks}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Reminders Sent</div>
                      <div className="admin-stat-value">{ncRemindersSent}</div>
                    </div>
                  </div>
                </>
              )}

              {/* ═══ SLF ═══ */}
              {eventTab === "slf" && (
                <>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Registrations</div>
                      <div className="admin-stat-value">{slfTotal}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Attendees</div>
                      <div className="admin-stat-value gold">{slfAttendees}</div>
                      <div className="admin-stat-sub">Avg group: {slfAvgGroup}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">First-Time Visitors</div>
                      <div className="admin-stat-value green">{slfFirstTime}</div>
                      <div className="admin-stat-sub">{slfTotal > 0 ? `${((slfFirstTime / slfTotal) * 100).toFixed(0)}%` : "0%"} of registrants</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Returning</div>
                      <div className="admin-stat-value">{slfReturning}</div>
                    </div>
                  </div>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Email Open Rate</div>
                      <div className="admin-stat-value green">{slfEng.openRate}%</div>
                      <div className="admin-stat-sub">{slfEng.uniqueOpens} unique opens</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Calendar Saves</div>
                      <div className="admin-stat-value">{slfEng.calendarClicks}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Directions Clicks</div>
                      <div className="admin-stat-value">{slfEng.directionsClicks}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Reminders Sent</div>
                      <div className="admin-stat-value" style={{ color: "var(--text-light)" }}>—</div>
                      <div className="admin-stat-sub">Coming soon</div>
                    </div>
                  </div>
                </>
              )}

              {/* ═══ PRASADAM ═══ */}
              {eventTab === "prasadam" && (
                <>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Submissions</div>
                      <div className="admin-stat-value">{prasadamTotal}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Pending Review</div>
                      <div className="admin-stat-value orange">{prasadamPending}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Confirmed + Completed</div>
                      <div className="admin-stat-value green">{prasadamConfirmed + prasadamCompleted}</div>
                      <div className="admin-stat-sub">{prasadamConfirmedRate}% conversion</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Sponsorship Value</div>
                      <div className="admin-stat-value gold">${totalSponsorshipValue.toLocaleString()}</div>
                      <div className="admin-stat-sub">Confirmed + completed</div>
                    </div>
                  </div>

                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Email Open Rate</div>
                      <div className="admin-stat-value green">{prasadamEng.openRate}%</div>
                      <div className="admin-stat-sub">{prasadamEng.uniqueOpens} unique opens</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Email Opens</div>
                      <div className="admin-stat-value">{prasadamEng.opens}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Link Clicks</div>
                      <div className="admin-stat-value">{prasadamEng.calendarClicks + prasadamEng.directionsClicks + prasadamEng.shareClicks}</div>
                      <div className="admin-stat-sub">Calendar / directions / share</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Reminders Sent</div>
                      <div className="admin-stat-value" style={{ color: "var(--text-light)" }}>—</div>
                      <div className="admin-stat-sub">Coming soon</div>
                    </div>
                  </div>

                  {prasadamNeedsBackfill.length > 0 && (
                    <div className="admin-nudge-banner">
                      <i className="fas fa-exclamation-triangle"></i>
                      <div>
                        <strong>{prasadamNeedsBackfill.length} sponsor{prasadamNeedsBackfill.length > 1 ? "s" : ""} need follow-up</strong>
                        <span> — missing email or unverified phone. </span>
                        <button
                          className="admin-link-btn"
                          onClick={() => { setPage("prasadam"); setPrasadamFilter("needs_backfill"); }}
                        >
                          Review now →
                        </button>
                      </div>
                    </div>
                  )}

                  {tierChartData.length > 0 && (
                    <div className="admin-chart-card">
                      <h3>Sponsorship Tier Distribution</h3>
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                          <Pie
                            data={tierChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {tierChartData.map((_, i) => (
                              <Cell key={i} fill={TIER_COLORS[i % TIER_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </>
              )}

              {/* ═══ RATHA YATRA ═══ */}
              {eventTab === "ratha_yatra" && (
                <>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Registrations</div>
                      <div className="admin-stat-value">{ryTotal}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Attendees</div>
                      <div className="admin-stat-value gold">{ryAttendees}</div>
                      <div className="admin-stat-sub">Avg group: {ryAvgGroup}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Confirmations Sent</div>
                      <div className="admin-stat-value green">{ryConfirmed}</div>
                      <div className="admin-stat-sub">{ryTotal > 0 ? `${((ryConfirmed / ryTotal) * 100).toFixed(0)}%` : "0%"} of registrants</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Reminders Sent</div>
                      <div className="admin-stat-value">{ryRemindersSent}</div>
                    </div>
                  </div>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Email Open Rate</div>
                      <div className="admin-stat-value green">{ryEng.openRate}%</div>
                      <div className="admin-stat-sub">{ryEng.uniqueOpens} unique opens</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Calendar Saves</div>
                      <div className="admin-stat-value">{ryEng.calendarClicks}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Directions Clicks</div>
                      <div className="admin-stat-value">{ryEng.directionsClicks}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Share Clicks</div>
                      <div className="admin-stat-value">{ryEng.shareClicks}</div>
                    </div>
                  </div>
                </>
              )}

              {/* ═══ KIDS RATHA YATRA ═══ */}
              {eventTab === "kry" && (
                <>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Registrations</div>
                      <div className="admin-stat-value">{kryTotal}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Total Attendees</div>
                      <div className="admin-stat-value gold">{kryAttendees}</div>
                      <div className="admin-stat-sub">Adults: {kryAdults} · Kids: {kryKids} · Avg: {kryAvgGroup}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Confirmations Sent</div>
                      <div className="admin-stat-value green">{kryConfirmed}</div>
                      <div className="admin-stat-sub">{kryTotal > 0 ? `${((kryConfirmed / kryTotal) * 100).toFixed(0)}%` : "0%"} of registrants</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Reminders Sent</div>
                      <div className="admin-stat-value">{kryRemindersSent}</div>
                    </div>
                  </div>
                  <div className="admin-stats-row">
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Email Open Rate</div>
                      <div className="admin-stat-value green">{kryEng.openRate}%</div>
                      <div className="admin-stat-sub">{kryEng.uniqueOpens} unique opens</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Calendar Saves</div>
                      <div className="admin-stat-value">{kryEng.calendarClicks}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Directions Clicks</div>
                      <div className="admin-stat-value">{kryEng.directionsClicks}</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-label">Share Clicks</div>
                      <div className="admin-stat-value">{kryEng.shareClicks}</div>
                    </div>
                  </div>
                </>
              )}

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="admin-chart-card">
                  <h3>Submissions Over Time</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d9" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1e3a6e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

          {/* ═══ REGISTRATIONS PAGE ═══ */}
          {page === "registrations" && (
            <>
              <div className="admin-page-header">
                <h1>Registration Logs</h1>
                <p>Browse all submissions across the three event surfaces</p>
              </div>

              <div className="admin-event-tabs">
                <button className={`admin-event-tab${regEventTab === "nrsimha" ? " active" : ""}`} onClick={() => { setRegEventTab("nrsimha"); setRegPage(1); resetRegFilters(); }}>Nṛsiṁha Caturdaśī ({ncTotal})</button>
                <button className={`admin-event-tab${regEventTab === "ratha_yatra" ? " active" : ""}`} onClick={() => { setRegEventTab("ratha_yatra"); setRegPage(1); resetRegFilters(); }}>Ratha Yātrā ({ryTotal})</button>
                <button className={`admin-event-tab${regEventTab === "kry" ? " active" : ""}`} onClick={() => { setRegEventTab("kry"); setRegPage(1); resetRegFilters(); }}>Kids Ratha Yātrā ({kryTotal})</button>
                <button className={`admin-event-tab${regEventTab === "slf" ? " active" : ""}`} onClick={() => { setRegEventTab("slf"); setRegPage(1); resetRegFilters(); }}>Weekend Love Feast ({slfTotal})</button>
                <button className={`admin-event-tab${regEventTab === "prasadam" ? " active" : ""}`} onClick={() => { setRegEventTab("prasadam"); setRegPage(1); resetRegFilters(); }}>Prasadam ({prasadamTotal})</button>
              </div>

              {regEventTab !== "prasadam" && (
                <div className="admin-reg-filter-row">
                  <div className="admin-filter-group">
                    <span className="admin-filter-label">Submitted</span>
                    {([["all","All"],["24h","24h"],["7d","7 days"],["30d","30 days"]] as const).map(([v,l]) => (
                      <button key={v} className={`admin-filter-tab${regDateRange === v ? " active" : ""}`} onClick={() => { setRegDateRange(v); setRegPage(1); }}>{l}</button>
                    ))}
                  </div>

                  {regEventTab === "slf" && (
                    <>
                      <div className="admin-filter-group">
                        <span className="admin-filter-label">Day</span>
                        {([["all","All"],["sat","Sat"],["sun","Sun"]] as const).map(([v,l]) => (
                          <button key={v} className={`admin-filter-tab${slfDayFilter === v ? " active" : ""}`} onClick={() => { setSlfDayFilter(v); setRegPage(1); }}>{l}</button>
                        ))}
                      </div>
                      <div className="admin-filter-group">
                        <span className="admin-filter-label">First time</span>
                        {([["all","All"],["yes","First-timers"],["no","Returning"]] as const).map(([v,l]) => (
                          <button key={v} className={`admin-filter-tab${slfFirstTimeFilter === v ? " active" : ""}`} onClick={() => { setSlfFirstTimeFilter(v); setRegPage(1); }}>{l}</button>
                        ))}
                      </div>
                      {slfDateOptions.length > 0 && (
                        <div className="admin-filter-group">
                          <span className="admin-filter-label">Date</span>
                          <select
                            className="admin-filter-select"
                            value={slfDateFilter}
                            onChange={(e) => { setSlfDateFilter(e.target.value); setRegPage(1); }}
                          >
                            <option value="all">All dates</option>
                            {slfDateOptions.map((d) => {
                              const dt = new Date(d + "T12:00:00+08:00");
                              const dow = dt.getDay();
                              const dayLabel = dow === 6 ? "Sat" : dow === 0 ? "Sun" : "";
                              return (
                                <option key={d} value={d}>
                                  {dayLabel} · {dt.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Singapore" })}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  {(regEventTab === "nrsimha" || regEventTab === "ratha_yatra") && (
                    <>
                      <div className="admin-filter-group">
                        <span className="admin-filter-label">Confirmation</span>
                        {([["all","All"],["sent","Sent"],["not","Not sent"]] as const).map(([v,l]) => (
                          <button key={v} className={`admin-filter-tab${regConfFilter === v ? " active" : ""}`} onClick={() => { setRegConfFilter(v); setRegPage(1); }}>{l}</button>
                        ))}
                      </div>
                      <div className="admin-filter-group">
                        <span className="admin-filter-label">Type</span>
                        {([["all","All"],["vol","Volunteers"],["att","Attendees"]] as const).map(([v,l]) => (
                          <button key={v} className={`admin-filter-tab${regVolFilter === v ? " active" : ""}`} onClick={() => { setRegVolFilter(v); setRegPage(1); }}>{l}</button>
                        ))}
                      </div>
                    </>
                  )}

                  {regEventTab === "kry" && (
                    <div className="admin-filter-group">
                      <span className="admin-filter-label">Confirmation</span>
                      {([["all","All"],["sent","Sent"],["not","Not sent"]] as const).map(([v,l]) => (
                        <button key={v} className={`admin-filter-tab${regConfFilter === v ? " active" : ""}`} onClick={() => { setRegConfFilter(v); setRegPage(1); }}>{l}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="admin-table-card">
                <div className="admin-table-header">
                  <h3>{regEventTab === "nrsimha" ? "Nṛsiṁha Registrations" : regEventTab === "ratha_yatra" ? "Ratha Yātrā Registrations" : regEventTab === "kry" ? "Kids Ratha Yātrā Registrations" : regEventTab === "slf" ? "Weekend Love Feast Registrations" : "Prasadam Sponsorships"}</h3>
                  <span style={{ fontSize: "13px", color: "#888" }}>
                    Showing {Math.min((regPage - 1) * ROWS_PER_PAGE + 1, filteredReg.length)}-{Math.min(regPage * ROWS_PER_PAGE, filteredReg.length)} of {filteredReg.length} entries
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        {(regEventTab === "nrsimha" || regEventTab === "ratha_yatra") && <><th>Pax</th><th>Conf</th><th>Reminder</th></>}
                        {regEventTab === "kry" && <><th>Adults</th><th>Kids</th><th>Conf</th><th>Reminder</th></>}
                        {regEventTab === "slf" && <><th>Pax</th><th>Day</th><th>First Time</th></>}
                        {regEventTab === "prasadam" && <><th>Tier</th><th>Date</th><th>Status</th></>}
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regSlice.map((r: any) => {
                        const name = r.name || r.full_name;
                        const phone = r.country_code ? `${r.country_code} ${r.phone}` : (r.phone || "—");
                        return (
                          <tr key={r.id}>
                            <td>
                              <div className="admin-name-cell">
                                <div className="admin-avatar">{getInitials(name)}</div>
                                <span className="admin-name-text">{name}</span>
                              </div>
                            </td>
                            <td style={{ color: "#666" }}>
                              {r.email_needs_backfill
                                ? <span className="admin-badge pending"><i className="fas fa-exclamation-triangle"></i> Needs email</span>
                                : r.email}
                            </td>
                            <td style={{ color: "#666" }}>
                              {phone}
                              {r.phone_needs_verification && <span className="admin-badge pending" style={{ marginLeft: 6 }}>verify</span>}
                            </td>
                            {(regEventTab === "nrsimha" || regEventTab === "ratha_yatra") && (
                              <>
                                <td><span style={{ fontWeight: 700, color: "#1e3a6e" }}>{String(r.attendees).padStart(2, "0")}</span></td>
                                <td><span className={`admin-badge-icon ${r.confirmation_sent ? "yes" : "no"}`}>{r.confirmation_sent ? "✅" : "—"}</span></td>
                                <td><span className={`admin-badge-icon ${r.reminder_sent ? "yes" : "no"}`}>{r.reminder_sent ? "🔔" : "—"}</span></td>
                              </>
                            )}
                            {regEventTab === "kry" && (
                              <>
                                <td><span style={{ fontWeight: 700, color: "#1e3a6e" }}>{String(r.adults || 0).padStart(2, "0")}</span></td>
                                <td><span style={{ fontWeight: 700, color: "#f590b3" }}>{String(r.kids || 0).padStart(2, "0")}</span></td>
                                <td><span className={`admin-badge-icon ${r.confirmation_sent ? "yes" : "no"}`}>{r.confirmation_sent ? "✅" : "—"}</span></td>
                                <td><span className={`admin-badge-icon ${r.reminder_sent ? "yes" : "no"}`}>{r.reminder_sent ? "🔔" : "—"}</span></td>
                              </>
                            )}
                            {regEventTab === "slf" && (
                              <>
                                <td><span style={{ fontWeight: 700, color: "#1e3a6e" }}>{String(r.attendees).padStart(2, "0")}</span></td>
                                <td style={{ color: "#1e3a6e", fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap" }}>
                                  {r.attendance_date
                                    ? (() => {
                                        const d = new Date(r.attendance_date + "T12:00:00+08:00");
                                        const dow = d.getDay();
                                        const dayLabel = dow === 6 ? "Sat" : dow === 0 ? "Sun" : "";
                                        const dayColor = dow === 6 ? "#f8a4c0" : "#f4c96b";
                                        return (
                                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ background: dayColor, color: "#1e3a6e", padding: "2px 6px", borderRadius: 4, fontSize: "11px", fontWeight: 700 }}>{dayLabel}</span>
                                            {d.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Singapore" })}
                                          </span>
                                        );
                                      })()
                                    : <span style={{ color: "#aaa", fontWeight: 400 }}>—</span>}
                                </td>
                                <td>{r.first_time ? <span className="admin-badge sent">Yes</span> : "No"}</td>
                              </>
                            )}
                            {regEventTab === "prasadam" && (
                              <>
                                <td><span style={{ fontWeight: 600, color: "#1e3a6e" }}>{TIER_LABEL[r.tier] || r.tier}</span></td>
                                <td style={{ color: "#666", fontSize: "12px" }}>{r.preferred_date}</td>
                                <td><StatusBadge status={r.status} /></td>
                              </>
                            )}
                            <td style={{ whiteSpace: "nowrap", color: "#888", fontSize: "12px" }}>
                              <div>{new Date(r.created_at).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}</div>
                              <div style={{ fontSize: "11px", color: "#aaa" }}>{new Date(r.created_at).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })}</div>
                            </td>
                          </tr>
                        );
                      })}
                      {regSlice.length === 0 && (
                        <tr><td colSpan={(regEventTab === "nrsimha" || regEventTab === "ratha_yatra") ? 7 : 6} className="admin-empty">No registrations found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination current={regPage} total={regTotalPages} onChange={setRegPage} count={filteredReg.length} />
              </div>
            </>
          )}

          {/* ═══ PRASADAM MANAGEMENT PAGE ═══ */}
          {page === "prasadam" && (
            <>
              <div className="admin-page-header">
                <h1>Prasadam Sponsorships</h1>
                <p>Manage incoming sponsor requests · update status · follow up on backfill needs</p>
              </div>

              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Total</div>
                  <div className="admin-stat-value">{prasadamTotal}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Pending</div>
                  <div className="admin-stat-value orange">{prasadamPending}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Confirmed</div>
                  <div className="admin-stat-value green">{prasadamConfirmed}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Completed</div>
                  <div className="admin-stat-value gold">{prasadamCompleted}</div>
                </div>
              </div>

              {prasadamNeedsBackfill.length > 0 && (
                <div className="admin-nudge-banner">
                  <i className="fas fa-exclamation-triangle"></i>
                  <div>
                    <strong>{prasadamNeedsBackfill.length} sponsor{prasadamNeedsBackfill.length > 1 ? "s" : ""} need follow-up.</strong>
                    <span> WhatsApp them to confirm email or phone, then update the row directly in the database.</span>
                  </div>
                </div>
              )}

              <div className="admin-table-card">
                <div className="admin-table-header">
                  <h3>All Sponsorships</h3>
                  <div className="admin-table-actions">
                    <div className="admin-filter-tabs">
                      <button className={`admin-filter-tab${prasadamFilter === "all" ? " active" : ""}`} onClick={() => { setPrasadamFilter("all"); setPrasadamPage(1); }}>All</button>
                      <button className={`admin-filter-tab${prasadamFilter === "pending" ? " active" : ""}`} onClick={() => { setPrasadamFilter("pending"); setPrasadamPage(1); }}>Pending</button>
                      <button className={`admin-filter-tab${prasadamFilter === "confirmed" ? " active" : ""}`} onClick={() => { setPrasadamFilter("confirmed"); setPrasadamPage(1); }}>Confirmed</button>
                      <button className={`admin-filter-tab${prasadamFilter === "completed" ? " active" : ""}`} onClick={() => { setPrasadamFilter("completed"); setPrasadamPage(1); }}>Completed</button>
                      <button className={`admin-filter-tab${prasadamFilter === "needs_backfill" ? " active" : ""}`} onClick={() => { setPrasadamFilter("needs_backfill"); setPrasadamPage(1); }}>Needs Backfill</button>
                    </div>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Sponsor</th>
                        <th>Contact</th>
                        <th>Tier</th>
                        <th>Preferred Date</th>
                        <th>Occasion</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {prasadamSlice.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <div className="admin-name-cell">
                              <div className="admin-avatar">{getInitials(r.full_name)}</div>
                              <div>
                                <div className="admin-name-text">{r.full_name}</div>
                                {(r.email_needs_backfill || r.phone_needs_verification) && (
                                  <div style={{ fontSize: 10, color: "#e67e22", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    <i className="fas fa-exclamation-triangle"></i> Needs follow-up
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: 12, color: "#666" }}>
                            <div>{r.email_needs_backfill ? <span style={{ color: "#e67e22" }}>Email pending</span> : r.email}</div>
                            <div>
                              {r.country_code} {r.phone}
                              {r.phone_needs_verification && <span style={{ color: "#e67e22", marginLeft: 4 }}>(verify)</span>}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: "#1e3a6e" }}>{TIER_LABEL[r.tier] || r.tier}</span>
                            <div style={{ fontSize: 11, color: "#888" }}>${TIER_PRICE[r.tier] || 0}</div>
                          </td>
                          <td style={{ fontSize: 12, color: "#666" }}>{r.preferred_date}</td>
                          <td style={{ fontSize: 12, color: "#666" }}>{r.occasion || "—"}</td>
                          <td><StatusBadge status={r.status} /></td>
                          <td style={{ whiteSpace: "nowrap", color: "#888", fontSize: 12 }}>
                            {new Date(r.created_at).toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
                          </td>
                          <td>
                            <button className="admin-btn-secondary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => setSelectedSponsor(r)}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {prasadamSlice.length === 0 && (
                        <tr><td colSpan={8} className="admin-empty">No sponsorships match this filter</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination current={prasadamPage} total={prasadamTotalPages} onChange={setPrasadamPage} count={filteredPrasadam.length} />
              </div>
            </>
          )}

          {page === "emails" && (
            <>
              <div className="admin-page-header">
                <h1>Email Archive</h1>
                <p>All sent emails with delivery status and engagement tracking</p>
              </div>

              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Total Emails</div>
                  <div className="admin-stat-value">{uniqueEmailList.length}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Sent</div>
                  <div className="admin-stat-value green">{emailStatSent}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Open Rate</div>
                  <div className="admin-stat-value green">{openRate}%</div>
                  <div className="admin-stat-sub">{uniqueOpens} unique opens</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Failed / DLQ</div>
                  <div className="admin-stat-value red">{emailStatFailed}</div>
                  <div className="admin-stat-sub">{emailStatSuppressed} suppressed</div>
                </div>
              </div>

              {/* Engagement breakdown */}
              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Calendar Saves</div>
                  <div className="admin-stat-value">{calendarClicks}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Kavacha Clicks</div>
                  <div className="admin-stat-value">{kavachaClicks}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Directions Clicks</div>
                  <div className="admin-stat-value">{directionsClicks}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Share Clicks</div>
                  <div className="admin-stat-value">{clickEvents.filter(t => t.link_name?.startsWith("share_")).length}</div>
                </div>
              </div>

              <div className="admin-table-card">
                <div className="admin-table-header">
                  <h3>Email Send Log</h3>
                  <span style={{ fontSize: "13px", color: "#888" }}>
                    Showing {Math.min((emailPage - 1) * ROWS_PER_PAGE + 1, filteredEmails.length)}-{Math.min(emailPage * ROWS_PER_PAGE, filteredEmails.length)} of {filteredEmails.length} entries (deduplicated by message)
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Template</th>
                        <th>Recipient</th>
                        <th>Status</th>
                        <th>Opened</th>
                        <th>Error</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailSlice.map((e) => {
                        const opened = openEvents.some(t => t.recipient_email === e.recipient_email && t.email_type === (e.template_name.includes("confirm") ? "confirmation" : "reminder"));
                        return (
                          <tr key={e.id}>
                            <td><span style={{ fontWeight: 600, color: "#1e3a6e" }}>{e.template_name}</span></td>
                            <td style={{ color: "#666" }}>{e.recipient_email}</td>
                            <td><StatusBadge status={e.status} /></td>
                            <td><span className={`admin-badge-icon ${opened ? "yes" : "no"}`}>{opened ? "👁️" : "—"}</span></td>
                            <td style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#888", fontSize: "12px" }}>{e.error_message || "—"}</td>
                            <td style={{ whiteSpace: "nowrap", color: "#888", fontSize: "12px" }}>
                              <div>{new Date(e.created_at).toLocaleDateString("en-SG", { day: "numeric", month: "short" })}</div>
                              <div style={{ fontSize: "11px", color: "#aaa" }}>{new Date(e.created_at).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })}</div>
                            </td>
                          </tr>
                        );
                      })}
                      {emailSlice.length === 0 && (
                        <tr><td colSpan={6} className="admin-empty">No email logs found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination current={emailPage} total={emailTotalPages} onChange={setEmailPage} count={filteredEmails.length} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* ═══ SPONSOR DETAIL DRAWER ═══ */}
      {selectedSponsor && (
        <div className="admin-drawer-backdrop" onClick={() => setSelectedSponsor(null)}>
          <div className="admin-drawer" onClick={e => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <h2>{selectedSponsor.full_name}</h2>
              <button className="admin-drawer-close" onClick={() => setSelectedSponsor(null)}>×</button>
            </div>
            <div className="admin-drawer-body">
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Status</span>
                <StatusBadge status={selectedSponsor.status} />
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Tier</span>
                <span><strong>{TIER_LABEL[selectedSponsor.tier] || selectedSponsor.tier}</strong> · ${TIER_PRICE[selectedSponsor.tier] || 0}</span>
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Email</span>
                <span>
                  {selectedSponsor.email_needs_backfill
                    ? <span style={{ color: "#e67e22" }}>⚠ Placeholder — needs real email</span>
                    : selectedSponsor.email}
                </span>
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Phone</span>
                <span>
                  {selectedSponsor.country_code} {selectedSponsor.phone}
                  {selectedSponsor.phone_needs_verification && <span style={{ color: "#e67e22", marginLeft: 8 }}>⚠ Verify country code</span>}
                </span>
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Preferred Date</span>
                <span>{selectedSponsor.preferred_date}</span>
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Occasion</span>
                <span>{selectedSponsor.occasion || "—"}</span>
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Dedication</span>
                <span style={{ whiteSpace: "pre-wrap" }}>{selectedSponsor.dedication || "—"}</span>
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Notes</span>
                <span style={{ whiteSpace: "pre-wrap" }}>{selectedSponsor.notes || "—"}</span>
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Submitted</span>
                <span>{new Date(selectedSponsor.created_at).toLocaleString("en-SG")}</span>
              </div>
              <div className="admin-drawer-row">
                <span className="admin-drawer-label">Reference</span>
                <span style={{ fontFamily: "monospace", fontSize: 11 }}>{selectedSponsor.id.slice(0, 8).toUpperCase()}</span>
              </div>

              <div className="admin-drawer-actions">
                <a
                  className="admin-btn-secondary"
                  href={`https://wa.me/${(selectedSponsor.country_code + selectedSponsor.phone).replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp"></i> WhatsApp Sponsor
                </a>
                {!selectedSponsor.email_needs_backfill && (
                  <a className="admin-btn-secondary" href={`mailto:${selectedSponsor.email}`}>
                    <i className="fas fa-envelope"></i> Email
                  </a>
                )}
              </div>

              <div className="admin-drawer-section">
                <div className="admin-drawer-label" style={{ marginBottom: 8 }}>Update Status</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["pending", "confirmed", "completed", "cancelled"].map(s => (
                    <button
                      key={s}
                      className={`admin-event-tab${selectedSponsor.status === s ? " active" : ""}`}
                      onClick={() => updatePrasadamStatus(selectedSponsor.id, s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

// ═══ SUBCOMPONENTS ═══
function StatusBadge({ status }: { status: string }) {
  const cls = status === "sent" || status === "confirmed" || status === "completed" ? "sent"
    : status === "pending" ? "pending"
    : status === "suppressed" ? "suppressed"
    : "failed";
  return <span className={`admin-badge ${cls}`}>{status.toUpperCase()}</span>;
}

function Pagination({ current, total, onChange, count }: { current: number; total: number; onChange: (p: number) => void; count: number }) {
  if (total <= 1) return null;

  const pages: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div className="admin-pagination">
      <span className="admin-pagination-info">
        {count} total entries · Page {current} of {total}
      </span>
      <div className="admin-pagination-controls">
        <button className="admin-page-btn" disabled={current <= 1} onClick={() => onChange(current - 1)}>‹</button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ padding: "0 4px", color: "#999" }}>…</span>
          ) : (
            <button key={p} className={`admin-page-btn${current === p ? " active" : ""}`} onClick={() => onChange(p as number)}>{p}</button>
          )
        )}
        <button className="admin-page-btn" disabled={current >= total} onClick={() => onChange(current + 1)}>›</button>
      </div>
    </div>
  );
}
