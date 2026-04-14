import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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

interface SlfRegistration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  attendees: number;
  first_time: boolean;
  created_at: string;
}

interface PrasadamSponsorship {
  id: string;
  full_name: string;
  whatsapp_number: string;
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

type Page = "overview" | "registrations" | "emails" | "prasadam";

const ROWS_PER_PAGE = 10;

// ═══ MAIN COMPONENT ═══
export default function Admin() {
  const [page, setPage] = useState<Page>("overview");
  const [ncData, setNcData] = useState<Registration[]>([]);
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
  const [eventTab, setEventTab] = useState<"nrsimha" | "slf">("nrsimha");
  const [regPage, setRegPage] = useState(1);
  const [emailPage, setEmailPage] = useState(1);
  const [prasadamPage, setPrasadamPage] = useState(1);

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

  const fetchAll = async () => {
    setLoading(true);
    const [ncRes, slfRes, emailRes, trackRes] = await Promise.all([
      supabase.from("registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("slf_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("email_send_log").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("email_tracking_events").select("*").order("created_at", { ascending: false }).limit(1000),
    ]);
    setNcData((ncRes.data as Registration[]) || []);
    setSlfData((slfRes.data as SlfRegistration[]) || []);
    setEmailLogs((emailRes.data as EmailLog[]) || []);
    setTrackingEvents((trackRes.data as TrackingEvent[]) || []);
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

  // ═══ COMPUTED DATA ═══
  const activeRegData = eventTab === "slf" ? slfData : ncData;
  const totalRegistrations = activeRegData.length;
  const totalAttendees = activeRegData.reduce((s, r) => s + r.attendees, 0);
  const avgGroupSize = totalRegistrations > 0 ? (totalAttendees / totalRegistrations).toFixed(1) : "0";

  // Deduplicated emails
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

  // Tracking stats
  const openEvents = trackingEvents.filter(t => t.event_type === "open");
  const clickEvents = trackingEvents.filter(t => t.event_type === "click");
  const uniqueOpens = new Set(openEvents.map(t => t.recipient_email)).size;
  const calendarClicks = clickEvents.filter(t => t.link_name === "calendar").length;
  const kavachaClicks = clickEvents.filter(t => t.link_name === "buy_kavacha").length;
  const directionsClicks = clickEvents.filter(t => t.link_name === "directions").length;
  const openRate = emailStatSent > 0 ? ((uniqueOpens / emailStatSent) * 100).toFixed(1) : "0";

  // Chart data
  const dayMap: Record<string, number> = {};
  activeRegData.forEach((r) => {
    const day = new Date(r.created_at).toLocaleDateString("en-SG", { month: "short", day: "numeric" });
    dayMap[day] = (dayMap[day] || 0) + 1;
  });
  const chartData = Object.entries(dayMap).reverse().map(([date, count]) => ({ date, count }));

  // Filtered & paginated registrations
  const filteredReg = activeRegData.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
  );
  const regTotalPages = Math.max(1, Math.ceil(filteredReg.length / ROWS_PER_PAGE));
  const regSlice = filteredReg.slice((regPage - 1) * ROWS_PER_PAGE, regPage * ROWS_PER_PAGE);

  // Filtered & paginated emails
  const filteredEmails = uniqueEmailList.filter(
    (e) => e.recipient_email.toLowerCase().includes(search.toLowerCase()) ||
      e.template_name.toLowerCase().includes(search.toLowerCase()) ||
      e.status.toLowerCase().includes(search.toLowerCase())
  );
  const emailTotalPages = Math.max(1, Math.ceil(filteredEmails.length / ROWS_PER_PAGE));
  const emailSlice = filteredEmails.slice((emailPage - 1) * ROWS_PER_PAGE, emailPage * ROWS_PER_PAGE);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
  };

  const handleDownloadCSV = () => {
    let csvContent: string;
    let prefix: string;
    if (page === "emails") {
      const headers = ["Template", "Recipient", "Status", "Error", "Sent At"];
      const rows = filteredEmails.map(e => [e.template_name, e.recipient_email, e.status, e.error_message || "", new Date(e.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "email_log";
    } else if (eventTab === "slf") {
      const headers = ["Name", "Email", "Phone", "Attendees", "First Time", "Registered At"];
      const rows = slfData.map(r => [r.name, r.email, r.phone || "", r.attendees, r.first_time ? "Yes" : "No", new Date(r.created_at).toLocaleString("en-SG")]);
      csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      prefix = "slf_registrations";
    } else {
      const headers = ["Name", "Email", "Phone", "Attendees", "Confirmation", "Reminder", "Registered At"];
      const rows = ncData.map(r => [r.name, r.email, r.phone || "", r.attendees, r.confirmation_sent ? "Yes" : "No", r.reminder_sent ? "Yes" : "No", new Date(r.created_at).toLocaleString("en-SG")]);
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
    { id: "emails" as Page, label: "Email Archive", icon: "fas fa-envelope" },
  ];

  return (
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
              onClick={() => { setPage(item.id); setSearch(""); setRegPage(1); setEmailPage(1); }}
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
                  placeholder={page === "emails" ? "Search emails..." : "Search registrations..."}
                  value={search}
                  onChange={e => { setSearch(e.target.value); setRegPage(1); setEmailPage(1); }}
                />
              </div>
            )}
            <button className="admin-btn-primary" onClick={handleDownloadCSV}>
              <i className="fas fa-download"></i> Export CSV
            </button>
          </div>
        </div>

        <div className="admin-content">
          {/* ═══ OVERVIEW PAGE ═══ */}
          {page === "overview" && (
            <>
              <div className="admin-page-header">
                <h1>Executive Summary</h1>
                <p>Real-time overview of registrations and email engagement</p>
              </div>

              <div className="admin-event-tabs">
                <button className={`admin-event-tab${eventTab === "nrsimha" ? " active" : ""}`} onClick={() => setEventTab("nrsimha")}>Nṛsiṁha Caturdaśī</button>
                <button className={`admin-event-tab${eventTab === "slf" ? " active" : ""}`} onClick={() => setEventTab("slf")}>Sunday Love Feast</button>
              </div>

              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Total Registrations</div>
                  <div className="admin-stat-value">{totalRegistrations}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Total Attendees</div>
                  <div className="admin-stat-value gold">{totalAttendees}</div>
                  <div className="admin-stat-sub">Avg group: {avgGroupSize}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Email Open Rate</div>
                  <div className="admin-stat-value green">{openRate}%</div>
                  <div className="admin-stat-sub">{uniqueOpens} unique opens</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Calendar Saves</div>
                  <div className="admin-stat-value">{calendarClicks}</div>
                  <div className="admin-stat-sub">Add to Calendar clicks</div>
                </div>
              </div>

              {/* Engagement stats row */}
              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Emails Sent</div>
                  <div className="admin-stat-value green">{emailStatSent}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Pending</div>
                  <div className="admin-stat-value orange">{emailStatPending}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Failed / DLQ</div>
                  <div className="admin-stat-value red">{emailStatFailed}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Link Clicks</div>
                  <div className="admin-stat-value">{clickEvents.length}</div>
                  <div className="admin-stat-sub">Kavacha: {kavachaClicks} · Directions: {directionsClicks}</div>
                </div>
              </div>

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="admin-chart-card">
                  <h3>Registrations Over Time</h3>
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

              {/* Recent Registrations */}
              <div className="admin-table-card">
                <div className="admin-table-header">
                  <h3>Recent Registrations</h3>
                  <button className="admin-btn-secondary" onClick={() => setPage("registrations")}>View Full Log →</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Registrant</th>
                        <th>Email</th>
                        <th>Attendees</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRegData.slice(0, 5).map((r) => (
                        <tr key={r.id}>
                          <td>
                            <div className="admin-name-cell">
                              <div className="admin-avatar">{getInitials(r.name)}</div>
                              <span className="admin-name-text">{r.name}</span>
                            </div>
                          </td>
                          <td style={{ color: "#666" }}>{r.email}</td>
                          <td><span style={{ fontWeight: 700, color: "#1e3a6e" }}>{String(r.attendees).padStart(2, "0")}</span></td>
                          <td>
                            {eventTab === "nrsimha" ? (
                              <span className="admin-badge-icon yes">
                                {(r as Registration).confirmation_sent ? "✅" : "⏳"}
                              </span>
                            ) : (
                              <span>{(r as SlfRegistration).first_time ? "🆕 First time" : "Returning"}</span>
                            )}
                          </td>
                          <td style={{ whiteSpace: "nowrap", color: "#888", fontSize: "12px" }}>
                            {new Date(r.created_at).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ═══ REGISTRATIONS PAGE ═══ */}
          {page === "registrations" && (
            <>
              <div className="admin-page-header">
                <h1>Registration Logs</h1>
                <p>All registrations with confirmation and reminder status</p>
              </div>

              <div className="admin-event-tabs">
                <button className={`admin-event-tab${eventTab === "nrsimha" ? " active" : ""}`} onClick={() => { setEventTab("nrsimha"); setRegPage(1); }}>Nṛsiṁha Caturdaśī</button>
                <button className={`admin-event-tab${eventTab === "slf" ? " active" : ""}`} onClick={() => { setEventTab("slf"); setRegPage(1); }}>Sunday Love Feast</button>
              </div>

              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Total Registrations</div>
                  <div className="admin-stat-value">{totalRegistrations}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Total Attendees</div>
                  <div className="admin-stat-value gold">{totalAttendees}</div>
                </div>
                {eventTab === "slf" && (
                  <div className="admin-stat-card">
                    <div className="admin-stat-label">First-Time Visitors</div>
                    <div className="admin-stat-value green">{slfData.filter(r => r.first_time).length}</div>
                  </div>
                )}
                {eventTab === "nrsimha" && (
                  <div className="admin-stat-card">
                    <div className="admin-stat-label">Confirmations Sent</div>
                    <div className="admin-stat-value green">{ncData.filter(r => r.confirmation_sent).length}</div>
                  </div>
                )}
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Avg Group Size</div>
                  <div className="admin-stat-value">{avgGroupSize}</div>
                </div>
              </div>

              <div className="admin-table-card">
                <div className="admin-table-header">
                  <h3>All Registrations</h3>
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
                        <th>Attendees</th>
                        {eventTab === "nrsimha" && <th>Conf</th>}
                        {eventTab === "nrsimha" && <th>Reminder</th>}
                        {eventTab === "slf" && <th>First Time</th>}
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regSlice.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <div className="admin-name-cell">
                              <div className="admin-avatar">{getInitials(r.name)}</div>
                              <span className="admin-name-text">{r.name}</span>
                            </div>
                          </td>
                          <td style={{ color: "#666" }}>{r.email}</td>
                          <td style={{ color: "#666" }}>{r.phone || "—"}</td>
                          <td><span style={{ fontWeight: 700, color: "#1e3a6e" }}>{String(r.attendees).padStart(2, "0")}</span></td>
                          {eventTab === "nrsimha" && (
                            <>
                              <td><span className={`admin-badge-icon ${(r as Registration).confirmation_sent ? "yes" : "no"}`}>{(r as Registration).confirmation_sent ? "✅" : "—"}</span></td>
                              <td><span className={`admin-badge-icon ${(r as Registration).reminder_sent ? "yes" : "no"}`}>{(r as Registration).reminder_sent ? "🔔" : "—"}</span></td>
                            </>
                          )}
                          {eventTab === "slf" && (
                            <td>{(r as SlfRegistration).first_time ? <span className="admin-badge sent">Yes</span> : "No"}</td>
                          )}
                          <td style={{ whiteSpace: "nowrap", color: "#888", fontSize: "12px" }}>
                            <div>{new Date(r.created_at).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}</div>
                            <div style={{ fontSize: "11px", color: "#aaa" }}>{new Date(r.created_at).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })}</div>
                          </td>
                        </tr>
                      ))}
                      {regSlice.length === 0 && (
                        <tr><td colSpan={eventTab === "nrsimha" ? 7 : 6} className="admin-empty">No registrations found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination current={regPage} total={regTotalPages} onChange={setRegPage} count={filteredReg.length} />
              </div>
            </>
          )}

          {/* ═══ EMAIL ARCHIVE PAGE ═══ */}
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
                    Showing {Math.min((emailPage - 1) * ROWS_PER_PAGE + 1, filteredEmails.length)}-{Math.min(emailPage * ROWS_PER_PAGE, filteredEmails.length)} of {filteredEmails.length} entries
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
    </div>
  );
}

// ═══ SUBCOMPONENTS ═══
function StatusBadge({ status }: { status: string }) {
  const cls = status === "sent" ? "sent" : status === "pending" ? "pending" : status === "suppressed" ? "suppressed" : "failed";
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
