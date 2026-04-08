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
}

export default function Admin() {
  const [data, setData] = useState<Registration[]>([]);
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
    if (error) {
      setAuthError(error.message);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session);
      if (session) fetchData();
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
      if (session) fetchData();
      else setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    setData((rows as Registration[]) || []);
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

  const totalRegistrations = data.length;
  const totalAttendees = data.reduce((s, r) => s + r.attendees, 0);
  const volunteerCount = data.filter((r) => r.is_volunteer).length;

  // Chart data: registrations per day
  const dayMap: Record<string, number> = {};
  data.forEach((r) => {
    const day = new Date(r.created_at).toLocaleDateString("en-SG", { month: "short", day: "numeric" });
    dayMap[day] = (dayMap[day] || 0) + 1;
  });
  const chartData = Object.entries(dayMap).reverse().map(([date, count]) => ({ date, count }));

  const filtered = data.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDownloadCSV = () => {
    const headers = ["Name", "Email", "Phone", "Attendees", "Age", "Gender", "Volunteer", "Volunteer Categories", "Remarks", "Registered At"];
    const rows = data.map(r => [
      r.name,
      r.email,
      r.phone || "",
      r.attendees,
      r.age || "",
      r.gender || "",
      r.is_volunteer ? "Yes" : "No",
      r.volunteer_categories?.join("; ") || "",
      r.remarks || "",
      new Date(r.created_at).toLocaleString("en-SG"),
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'Source Sans Pro', sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", fontSize: "28px" }}>Registration Dashboard</h1>
          <button onClick={handleLogout} style={{ background: "var(--cream-warm)", border: "1px solid #e5ded5", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, color: "var(--navy)" }}>Sign Out</button>
        </div>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Registrations", value: totalRegistrations, color: "var(--navy)" },
            { label: "Total Attendees", value: totalAttendees, color: "var(--gold)" },
            { label: "Volunteers", value: volunteerCount, color: "var(--pink)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>{s.label}</p>
              <p style={{ fontSize: "32px", fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
            </div>
          ))}
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

        {/* Search + Table */}
        <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", fontSize: "18px" }}>All Registrations</h3>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "8px 14px", border: "1.5px solid #e5ded5", borderRadius: "8px", fontSize: "13px", width: "260px", background: "var(--cream)" }}
            />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5ded5", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px", color: "var(--navy)", fontWeight: 700 }}>Name</th>
                  <th style={{ padding: "10px 8px", color: "var(--navy)", fontWeight: 700 }}>Email</th>
                  <th style={{ padding: "10px 8px", color: "var(--navy)", fontWeight: 700 }}>Phone</th>
                  <th style={{ padding: "10px 8px", color: "var(--navy)", fontWeight: 700 }}>Attendees</th>
                  <th style={{ padding: "10px 8px", color: "var(--navy)", fontWeight: 700 }}>Volunteer</th>
                  <th style={{ padding: "10px 8px", color: "var(--navy)", fontWeight: 700 }}>Categories</th>
                  <th style={{ padding: "10px 8px", color: "var(--navy)", fontWeight: 700 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f0ebe3" }}>
                    <td style={{ padding: "10px 8px" }}>{r.name}</td>
                    <td style={{ padding: "10px 8px" }}>{r.email}</td>
                    <td style={{ padding: "10px 8px" }}>{r.phone || "—"}</td>
                    <td style={{ padding: "10px 8px" }}>{r.attendees}</td>
                    <td style={{ padding: "10px 8px" }}>{r.is_volunteer ? "✅" : "—"}</td>
                    <td style={{ padding: "10px 8px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>{r.volunteer_categories?.join(", ") || "—"}</td>
                    <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No registrations found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
