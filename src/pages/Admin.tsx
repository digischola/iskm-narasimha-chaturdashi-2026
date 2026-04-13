import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

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

interface EmailLog {
  id: string;
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

type Tab = "nrsimha" | "slf" | "emails";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("nrsimha");
  const [ncData, setNcData] = useState<Registration[]>([]);
  const [slfData, setSlfData] = useState<SlfRegistration[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

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
    const [ncRes, slfRes, emailRes] = await Promise.all([
      supabase.from("registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("slf_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("email_send_log").select("*").order("created_at", { ascending: false }).limit(500),
    ]);
    setNcData((ncRes.data as Registration[]) || []);
    setSlfData((slfRes.data as SlfRegistration[]) || []);
    setEmailLogs((emailRes.data as EmailLog[]) || []);
    setLoading(false);
  };

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)", fontFamily: "'Source Sans Pro', sans-serif" }}>
        <form onSubmit={handleLogin} style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,.08)", maxWidth: "380px", width: "100%" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "20px", textAlign: "center" }}>Admin Login</h2>
          {authError && <p style={{ color: "var(--red)", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>{authError}</p>}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5ded5", borderRadius: "8px", fontSize: "14px", background: "var(--cream)" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5ded5", borderRadius: "8px", fontSize: "14px", background: "var(--cream)" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "12px", background: "var(--navy)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>Sign In</button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
        <p style={{ color: "var(--navy)", fontSize: "18px" }}>Loading...</p>
      </div>
    );
  }

  const handleLogout = async () => { await supabase.auth.signOut(); };

  // ─── Program-specific data ───
  const isSlf = tab === "slf";
  const isEmails = tab === "emails";
  const activeData = isSlf ? slfData : ncData;
  const totalRegistrations = activeData.length;
  const totalAttendees = activeData.reduce((s, r) => s + r.attendees, 0);
  const firstTimeCount = isSlf ? slfData.filter(r => r.first_time).length : 0;

  const dayMap: Record<string, number> = {};
  activeData.forEach((r) => {
    const day = new Date(r.created_at).toLocaleDateString("en-SG", { month: "short", day: "numeric" });
    dayMap[day] = (dayMap[day] || 0) + 1;
  });
  const chartData = Object.entries(dayMap).reverse().map(([date, count]) => ({ date, count }));

  const filtered = activeData.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  // Email log filtering
  const filteredEmails = emailLogs.filter(
    (e) =>
      e.recipient_email.toLowerCase().includes(search.toLowerCase()) ||
      e.template_name.toLowerCase().includes(search.toLowerCase()) ||
      e.status.toLowerCase().includes(search.toLowerCase())
  );

  // Deduplicate by message_id for stats
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

  const handleDownloadCSV = () => {
    if (isEmails) {
      const headers = ["Template", "Recipient", "Status", "Error", "Sent At"];
      const rows = emailLogs.map(e => [e.template_name, e.recipient_email, e.status, e.error_message || "", new Date(e.created_at).toLocaleString("en-SG")]);
      const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      downloadCSV(csvContent, "email_log");
    } else if (isSlf) {
      const headers = ["Name", "Email", "Phone", "Attendees", "First Time", "Registered At"];
      const rows = slfData.map(r => [r.name, r.email, r.phone || "", r.attendees, r.first_time ? "Yes" : "No", new Date(r.created_at).toLocaleString("en-SG")]);
      const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      downloadCSV(csvContent, "slf_registrations");
    } else {
      const headers = ["Name", "Email", "Phone", "Attendees", "Confirmation Sent", "Reminder Sent", "Registered At"];
      const rows = ncData.map(r => [r.name, r.email, r.phone || "", r.attendees, r.confirmation_sent ? "Yes" : "No", r.reminder_sent ? "Yes" : "No", new Date(r.created_at).toLocaleString("en-SG")]);
      const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      downloadCSV(csvContent, "registrations");
    }
  };

  const downloadCSV = (csvContent: string, prefix: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prefix}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    background: active ? "var(--navy)" : "var(--cream-warm, #f5f0e8)",
    color: active ? "white" : "var(--navy)",
    transition: "all .2s",
  });

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      sent: { bg: "#e8f5e9", color: "#2e7d32" },
      pending: { bg: "#fff3e0", color: "#e65100" },
      failed: { bg: "#fce4ec", color: "#c62828" },
      dlq: { bg: "#fce4ec", color: "#c62828" },
      rate_limited: { bg: "#fff3e0", color: "#e65100" },
      suppressed: { bg: "#f3e5f5", color: "#6a1b9a" },
    };
    const c = colors[status] || { bg: "#f5f5f5", color: "#666" };
    return (
      <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, background: c.bg, color: c.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'Source Sans Pro', sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", fontSize: "28px" }}>Registration Dashboard</h1>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleDownloadCSV} style={{ background: "var(--navy)", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>⬇ Download CSV</button>
            <button onClick={handleLogout} style={{ background: "var(--cream-warm)", border: "1px solid #e5ded5", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, color: "var(--navy)" }}>Sign Out</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button style={tabStyle(tab === "nrsimha")} onClick={() => { setTab("nrsimha"); setSearch(""); }}>Nrsimha Caturdasi</button>
          <button style={tabStyle(tab === "slf")} onClick={() => { setTab("slf"); setSearch(""); }}>Sunday Love Feast</button>
          <button style={tabStyle(tab === "emails")} onClick={() => { setTab("emails"); setSearch(""); }}>📧 Email Log</button>
        </div>

        {!isEmails && (
          <>
            {/* Stats cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <StatCard label="Total Registrations" value={totalRegistrations} color="var(--navy)" />
              <StatCard label="Total Attendees" value={totalAttendees} color="var(--gold)" />
              {isSlf && <StatCard label="First-Time Visitors" value={firstTimeCount} color="#27ae60" />}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.04)", marginBottom: "24px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "16px", fontSize: "18px" }}>Registrations Over Time</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5ded5" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1e3a6e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Registrations Table */}
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", fontSize: "18px" }}>All Registrations</h3>
                <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "8px 14px", border: "1.5px solid #e5ded5", borderRadius: "8px", fontSize: "13px", width: "260px", background: "var(--cream)" }} />
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5ded5", textAlign: "left" }}>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Attendees</Th>
                      {isSlf && <Th>First Time</Th>}
                      {!isSlf && <Th>Conf ✉</Th>}
                      {!isSlf && <Th>Reminder ✉</Th>}
                      <Th>Date</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid #f0ebe3" }}>
                        <Td>{r.name}</Td>
                        <Td>{r.email}</Td>
                        <Td>{r.phone || "—"}</Td>
                        <Td>{r.attendees}</Td>
                        {isSlf && <Td>{(r as SlfRegistration).first_time ? "✓ Yes" : "No"}</Td>}
                        {!isSlf && <Td>{(r as Registration).confirmation_sent ? "✅" : "—"}</Td>}
                        {!isSlf && <Td>{(r as Registration).reminder_sent ? "✅" : "—"}</Td>}
                        <Td style={{ whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</Td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={isSlf ? 6 : 7} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No registrations found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {isEmails && (
          <>
            {/* Email Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <StatCard label="Total Emails" value={uniqueEmailList.length} color="var(--navy)" />
              <StatCard label="Sent" value={emailStatSent} color="#2e7d32" />
              <StatCard label="Pending" value={emailStatPending} color="#e65100" />
              <StatCard label="Failed / DLQ" value={emailStatFailed} color="#c62828" />
            </div>

            {/* Email Log Table */}
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", fontSize: "18px" }}>Email Send Log</h3>
                <input type="text" placeholder="Search by email, template, status..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "8px 14px", border: "1.5px solid #e5ded5", borderRadius: "8px", fontSize: "13px", width: "300px", background: "var(--cream)" }} />
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5ded5", textAlign: "left" }}>
                      <Th>Template</Th>
                      <Th>Recipient</Th>
                      <Th>Status</Th>
                      <Th>Error</Th>
                      <Th>Timestamp</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmails.map((e) => (
                      <tr key={e.id} style={{ borderBottom: "1px solid #f0ebe3" }}>
                        <Td>{e.template_name}</Td>
                        <Td>{e.recipient_email}</Td>
                        <Td>{statusBadge(e.status)}</Td>
                        <Td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.error_message || "—"}</Td>
                        <Td style={{ whiteSpace: "nowrap" }}>{new Date(e.created_at).toLocaleDateString("en-SG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</Td>
                      </tr>
                    ))}
                    {filteredEmails.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No email logs found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "32px", fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: "10px 8px", color: "var(--navy)", fontWeight: 700 }}>{children}</th>;
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: "10px 8px", ...style }}>{children}</td>;
}
