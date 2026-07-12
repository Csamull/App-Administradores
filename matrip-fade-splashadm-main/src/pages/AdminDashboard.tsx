import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home as HomeIcon, FileText, Plane, Users, DollarSign, CreditCard,
  Bell, User, LogOut, ChevronRight, ArrowUpRight, Building2,
  Handshake, ShoppingBag, BarChart2, Edit2, Eye, Search,
  PlusCircle, TrendingUp, CheckCircle2, Headphones } from
"lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from
"recharts";
import logoMatrip from "@/assets/logo_matrip.png";

const DARK_BLUE = "#0c2340";
const DARK_BLUE_HSL = "213 68% 15%";
const DARK_BLUE_LIGHT_HSL = "213 50% 92%";

const CHART_DATA = [
{ month: "Out", vendas: 42 },
{ month: "Nov", vendas: 68 },
{ month: "Dez", vendas: 55 },
{ month: "Jan", vendas: 90 },
{ month: "Fev", vendas: 78 },
{ month: "Mar", vendas: 112 }];


const KPI = [
{ label: "Total de Agências", value: 42, icon: Building2, color: "210 90% 56%", bg: "210 90% 94%" },
{ label: "Usuários", value: "1.284", icon: Users, color: "270 60% 58%", bg: "270 60% 94%" },
{ label: "Produtos", value: 156, icon: ShoppingBag, color: "155 70% 42%", bg: "155 70% 92%" },
{ label: "Pendentes", value: 9, icon: FileText, color: DARK_BLUE_HSL, bg: DARK_BLUE_LIGHT_HSL }];

const FEATURED_AGENCIES = [
{ id: 1, name: "Agência Horizonte", city: "São Luís - MA", rating: "4.9" },
{ id: 2, name: "TurExpress Ltda", city: "Barreirinhas - MA", rating: "4.8" },
{ id: 3, name: "Sol & Mar Turismo", city: "Alcântara - MA", rating: "4.7" }];


const PARTNERS = [
{ id: 1, name: "Agência Horizonte", status: "ativo", sales: "R$ 320.000", contract: "Vigente" },
{ id: 2, name: "Viagens & Cia", status: "pendente", sales: "R$ 98.000", contract: "Em revisão" },
{ id: 3, name: "TurExpress Ltda", status: "ativo", sales: "R$ 215.000", contract: "Vigente" },
{ id: 4, name: "Global Trips", status: "inativo", sales: "R$ 45.000", contract: "Encerrado" },
{ id: 5, name: "Sol & Mar Turismo", status: "ativo", sales: "R$ 178.000", contract: "Vigente" }];


const STATUS_COLOR: Record<string, {bg: string;text: string;}> = {
  ativo: { bg: "155 70% 90%", text: "155 70% 32%" },
  pendente: { bg: "213 50% 90%", text: "213 68% 25%" },
  inativo: { bg: "0 0% 90%", text: "0 0% 42%" }
};

type Tab = "home" | "partners" | "reports" | "profile";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const filteredPartners = PARTNERS.filter(
    (p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "hsl(var(--muted))",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out"
      }}>
      
      {/* ── HEADER ── */}
      <div
        style={{
          background: DARK_BLUE,
          padding: "48px 20px 52px",
          position: "relative",
          overflow: "hidden"
        }}>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <img src={logoMatrip} alt="Matrip" className="w-20 h-20 rounded-full bg-white p-1.5 shadow-md object-contain" />
            <div>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>MATRIP CORPORATE ADMIN

              </span>
              <h1 style={{ color: "white", fontSize: 19, fontWeight: 700, lineHeight: 1.25, marginTop: 1 }}>
                Olá, Lucas!
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              style={{ background: "rgba(255,255,255,0.14)", border: "none", borderRadius: 12, padding: 8, cursor: "pointer", position: "relative" }}>
              
              <Bell size={19} color="white" />
              <span style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: `2px solid ${DARK_BLUE}` }} />
            </button>
            <button
              onClick={() => navigate("/profile")}
              style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.35)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              
              <User size={18} color="white" />
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.35)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              
              <LogOut size={16} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 88, marginTop: -28 }}>

        {/* KPI CARDS */}
        <div style={{ padding: "0 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {KPI.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                style={{
                  background: "white", borderRadius: 18, padding: "16px 14px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateY(0)" : "translateY(18px)",
                  transition: `opacity 0.45s ease-out ${i * 0.07 + 0.1}s, transform 0.45s ease-out ${i * 0.07 + 0.1}s`
                }}>
                
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `hsl(${kpi.bg})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon size={19} style={{ color: kpi.color.startsWith("var") ? `hsl(${kpi.color})` : `hsl(${kpi.color})` }} />
                </div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--muted-foreground))", margin: 0, lineHeight: 1.3 }}>{kpi.label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "hsl(var(--foreground))", margin: "4px 0 0", lineHeight: 1.1 }}>{kpi.value}</p>
              </div>);

          })}
        </div>

        {/* AGÊNCIAS EM DESTAQUE */}
        <div style={{ padding: "20px 14px 0" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "hsl(var(--foreground))" }}>Agências em destaque</h2>
            <button
              onClick={() => navigate("/agencias")}
              style={{ fontSize: 11, fontWeight: 700, color: DARK_BLUE, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
              Ver todas <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            {FEATURED_AGENCIES.map((a, i) =>
            <div
              key={a.id}
              style={{
                display: "flex", alignItems: "center", padding: "13px 16px", gap: 12,
                borderBottom: i < FEATURED_AGENCIES.length - 1 ? "1px solid hsl(var(--border))" : "none"
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `hsl(${DARK_BLUE_LIGHT_HSL})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Building2 size={17} style={{ color: DARK_BLUE }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0 }}>{a.name}</p>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{a.city}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: DARK_BLUE }}>★ {a.rating}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "20px 14px 0" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: 10 }}>Ações rápidas</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
            { icon: Users, label: "Gerenciar Usuários", color: "210 90% 56%", bg: "210 90% 94%", route: "/usuarios" },
            { icon: ShoppingBag, label: "Gerenciar Produtos", color: "155 70% 42%", bg: "155 70% 92%", route: "/produtos" },
            { icon: Building2, label: "Gerenciar Agências", color: "270 60% 58%", bg: "270 60% 94%", route: "/agencias" },
            { icon: FileText, label: "Cadastros", color: DARK_BLUE_HSL, bg: DARK_BLUE_LIGHT_HSL, route: "/cadastros" },
            { icon: DollarSign, label: "Financeiro", color: "155 70% 42%", bg: "155 70% 92%", route: "/financeiro" },
            { icon: Headphones, label: "Suporte", color: "210 90% 56%", bg: "210 90% 94%", route: "/suporte" }].
            map((a, i) => {
              const Icon = a.icon;
              return (
                <button
                  key={i}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    gap: 8, padding: "14px", borderRadius: 16,
                    background: "white", border: "1px solid hsl(var(--border))",
                    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "transform 0.15s"
                  }}
                  onClick={() => navigate(a.route)}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}>
                  
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `hsl(${a.bg})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} style={{ color: `hsl(${a.color})` }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "hsl(var(--foreground))", textAlign: "left", lineHeight: 1.3 }}>{a.label}</span>
                </button>);

            })}
          </div>
        </div>

        {/* CHART */}
        <div style={{ padding: "20px 14px 0" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "hsl(var(--foreground))" }}>Crescimento de vendas</h2>
            <span style={{ fontSize: 11, fontWeight: 700, color: "hsl(155 70% 42%)", background: "hsl(155 70% 93%)", borderRadius: 8, padding: "2px 8px", display: "flex", alignItems: "center", gap: 3 }}>
              <ArrowUpRight size={12} /> +47%
            </span>
          </div>
          <div style={{ background: "white", borderRadius: 18, padding: "16px 8px 8px 0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={DARK_BLUE} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={DARK_BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 93%)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 15% 52%)", fontSize: 11, fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid hsl(214 20% 90%)", borderRadius: 10, fontSize: 12, fontWeight: 600 }}
                  formatter={(v: number) => [`R$ ${v}K`, ""]}
                  labelFormatter={(l: string) => `Mês: ${l}`} />
                
                <Area type="monotone" dataKey="vendas" stroke={DARK_BLUE} strokeWidth={2.5} fill="url(#colorVendas)" dot={false} activeDot={{ r: 5, fill: DARK_BLUE, stroke: "white", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PARTNERS TABLE */}
        <div style={{ padding: "20px 14px 0" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "hsl(var(--foreground))" }}>Parceiros</h2>
            <button
              style={{ display: "flex", alignItems: "center", gap: 4, background: DARK_BLUE, border: "none", borderRadius: 10, padding: "6px 12px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              
              <PlusCircle size={14} /> Novo
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
            <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="text"
              placeholder="Pesquisar parceiro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }} />
            
          </div>

          <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            {filteredPartners.map((p, i) => {
              const s = STATUS_COLOR[p.status];
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex", alignItems: "center", padding: "13px 16px", gap: 12,
                    borderBottom: i < filteredPartners.length - 1 ? "1px solid hsl(var(--border))" : "none"
                  }}>
                  
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "hsl(210 90% 94%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Building2 size={17} style={{ color: "hsl(210 90% 42%)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{p.sales} · {p.contract}</p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: `hsl(${s.text})`, background: `hsl(${s.bg})`, borderRadius: 20, padding: "3px 9px", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    <button style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
                      <Edit2 size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
                    </button>
                    <button style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
                      <Eye size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
                    </button>
                  </div>
                </div>);

            })}
            {filteredPartners.length === 0 &&
            <p style={{ textAlign: "center", padding: "24px", color: "hsl(var(--muted-foreground))", fontSize: 13 }}>Nenhum parceiro encontrado.</p>
            }
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>

      {/* BOTTOM NAV */}
      <div
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480, background: "white",
          borderTop: "1px solid hsl(var(--border))",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          padding: "8px 0 18px", zIndex: 50,
          boxShadow: "0 -4px 24px rgba(0,0,0,0.06)"
        }}>
        
        {([
        { id: "home", icon: HomeIcon, label: "Home" },
        { id: "partners", icon: Handshake, label: "Parceiros" },
        { id: "reports", icon: BarChart2, label: "Relatórios" },
        { id: "profile", icon: User, label: "Perfil" }] as
        {id: Tab;icon: typeof HomeIcon;label: string;}[]).map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 14px", background: "none", border: "none", cursor: "pointer" }}>
              
              <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? `hsl(${DARK_BLUE_LIGHT_HSL})` : "transparent", transition: "background 0.2s" }}>
                <Icon size={20} style={{ color: isActive ? DARK_BLUE : "hsl(var(--muted-foreground))", transition: "color 0.2s" }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? DARK_BLUE : "hsl(var(--muted-foreground))", transition: "color 0.2s" }}>
                {item.label}
              </span>
            </button>);

        })}
      </div>
    </div>);

};

export default AdminDashboard;