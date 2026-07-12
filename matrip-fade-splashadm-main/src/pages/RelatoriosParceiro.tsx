import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart2, TrendingUp, FileText, DollarSign, ShoppingBag } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHLY = [
  { month: "Out", vendas: 18000 },
  { month: "Nov", vendas: 30000 },
  { month: "Dez", vendas: 25000 },
  { month: "Jan", vendas: 44000 },
  { month: "Fev", vendas: 38000 },
  { month: "Mar", vendas: 57000 },
];

const MONTHLY_ANNUAL = [
  { month: "Jan", vendas: 44000 },
  { month: "Fev", vendas: 38000 },
  { month: "Mar", vendas: 57000 },
  { month: "Abr", vendas: 42000 },
  { month: "Mai", vendas: 51000 },
  { month: "Jun", vendas: 63000 },
  { month: "Jul", vendas: 72000 },
  { month: "Ago", vendas: 58000 },
  { month: "Set", vendas: 49000 },
  { month: "Out", vendas: 66000 },
  { month: "Nov", vendas: 78000 },
  { month: "Dez", vendas: 85000 },
];

const BY_SERVICE = [
  { name: "Hotel", vendas: 185000 },
  { name: "Transporte", vendas: 92000 },
  { name: "Seguro", vendas: 45000 },
  { name: "Passeio", vendas: 78000 },
  { name: "Guia", vendas: 32000 },
];

const TOP_PROMOS = [
  { nome: "Verão nos Lençóis", vendas: "R$ 98.000", qtd: 42 },
  { nome: "Páscoa em Barreirinhas", vendas: "R$ 65.000", qtd: 28 },
  { nome: "Férias em Carolina", vendas: "R$ 52.000", qtd: 19 },
];

const RelatoriosParceiro = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"mensal" | "anual">("mensal");

  const chartData = period === "mensal" ? MONTHLY : MONTHLY_ANNUAL;
  const totalVendas = period === "mensal" ? "R$ 212K" : "R$ 703K";
  const totalContratos = period === "mensal" ? 48 : 186;

  const kpis = [
    { label: "Total de vendas", value: totalVendas, icon: DollarSign, color: "155 70% 42%", bg: "155 70% 92%" },
    { label: "Contratos fechados", value: totalContratos, icon: FileText, color: "210 90% 56%", bg: "210 90% 94%" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "hsl(var(--primary))", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div className="flex items-center gap-3 relative z-10">
          <button onClick={() => navigate("/parceiro")} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 12, padding: 8, cursor: "pointer" }}><ArrowLeft size={20} color="white" /></button>
          <div>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>MATRIP CORPORATE</span>
            <h1 style={{ color: "white", fontSize: 19, fontWeight: 700, lineHeight: 1.25, marginTop: 1 }}>Relatório de Vendas</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 14px", marginTop: 12, paddingBottom: 24 }}>
        {/* Period filter */}
        <div className="flex items-center gap-2 mb-3">
          {(["mensal", "anual"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: period === p ? "hsl(var(--primary))" : "white", color: period === p ? "white" : "hsl(var(--foreground))", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} style={{ background: "white", borderRadius: 18, padding: "16px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `hsl(${k.bg})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon size={19} style={{ color: `hsl(${k.color})` }} />
                </div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--muted-foreground))", margin: 0 }}>{k.label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "hsl(var(--foreground))", margin: "4px 0 0" }}>{k.value}</p>
              </div>
            );
          })}
        </div>

        {/* Sales chart */}
        <div style={{ background: "white", borderRadius: 18, padding: "16px 8px 8px 0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "hsl(var(--foreground))", marginLeft: 16, marginBottom: 8 }}>Vendas por mês</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRelVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(213 68% 15%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(213 68% 15%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 93%)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 15% 52%)", fontSize: 10, fontWeight: 600 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(214 20% 90%)", borderRadius: 10, fontSize: 12, fontWeight: 600 }} formatter={(v: number) => [`R$ ${(v / 1000).toFixed(0)}K`, ""]} />
              <Area type="monotone" dataKey="vendas" stroke="hsl(213 68% 15%)" strokeWidth={2.5} fill="url(#colorRelVendas)" dot={false} activeDot={{ r: 5, fill: "hsl(213 68% 15%)", stroke: "white", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* By service chart */}
        <div style={{ background: "white", borderRadius: 18, padding: "16px 8px 8px 0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "hsl(var(--foreground))", marginLeft: 16, marginBottom: 8 }}>Vendas por tipo de serviço</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={BY_SERVICE}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 93%)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 15% 52%)", fontSize: 10, fontWeight: 600 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(214 20% 90%)", borderRadius: 10, fontSize: 12, fontWeight: 600 }} formatter={(v: number) => [`R$ ${(v / 1000).toFixed(0)}K`, ""]} />
              <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top promos */}
        <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "hsl(var(--foreground))", padding: "16px 16px 8px" }}>Promoções que mais venderam</h3>
          {TOP_PROMOS.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12, borderBottom: i < TOP_PROMOS.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "hsl(213 50% 92%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800, color: "hsl(38 90% 44%)" }}>
                #{i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0 }}>{p.nome}</p>
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{p.vendas} · {p.qtd} vendas</p>
              </div>
              <TrendingUp size={16} style={{ color: "hsl(155 70% 42%)", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatoriosParceiro;
