import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Search, PlusCircle, X, Compass, ChevronDown } from "lucide-react";

type Status = "ativo" | "pendente" | "bloqueado";

interface Agencia {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  status: Status;
}

const INITIAL: Agencia[] = [
  { id: 1, nome: "Aventuras MA", cnpj: "12.345.678/0001-90", email: "contato@aventuras.com", telefone: "(98) 99999-1111", status: "ativo" },
  { id: 2, nome: "Lençóis Tour", cnpj: "98.765.432/0001-10", email: "reserva@lencoistour.com", telefone: "(98) 98888-2222", status: "pendente" },
  { id: 3, nome: "SLZ Viagens", cnpj: "45.678.123/0001-55", email: "slz@viagens.com", telefone: "(98) 97777-3333", status: "bloqueado" },
];

const STATUS_STYLE: Record<Status, { bg: string; text: string; label: string; bar: string }> = {
  ativo: { bg: "145 65% 90%", text: "145 70% 25%", label: "ATIVO", bar: "145 65% 38%" },
 pendente: { bg: "213 50% 92%", text: "213 68% 25%", label: "PENDENTE", bar: "213 68% 15%" },
  bloqueado: { bg: "0 80% 94%", text: "0 70% 40%", label: "BLOQUEADO", bar: "0 70% 50%" },
};

const Agencias = () => {
  const navigate = useNavigate();
  const [agencias, setAgencias] = useState<Agencia[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | Status>("todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", cnpj: "", email: "", telefone: "", status: "pendente" as Status });

  const total = agencias.length;
  const aguardando = agencias.filter((a) => a.status === "pendente").length;
  const ativas = agencias.filter((a) => a.status === "ativo").length;

  const filtered = agencias.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.nome.toLowerCase().includes(q) || a.cnpj.replace(/\D/g, "").includes(q.replace(/\D/g, ""));
    const matchStatus = statusFilter === "todos" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const limpar = () => { setSearch(""); setStatusFilter("todos"); };

  const save = () => {
    if (!form.nome || !form.cnpj || !form.email) return;
    setAgencias((prev) => [{ id: Date.now(), ...form }, ...prev]);
    setForm({ nome: "", cnpj: "", email: "", telefone: "", status: "pendente" });
    setShowForm(false);
  };

  const KPIS = [
    { label: "Total de Agências", value: total, sub: "na base de dados", bar: "213 68% 15%" },
    { label: "Aguardando Aprovação", value: aguardando, sub: "precisam de análise", bar: "213 68% 25%" },
    { label: "Agências Ativas", value: ativas, sub: "vendendo no site", bar: "213 68% 15%" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "hsl(var(--primary))", padding: "48px 20px 28px" }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/admin")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <h1 style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Gerenciar Agências Parceiras</h1>
        </div>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: "0 0 0 44px" }}>
          Aprove novos parceiros, visualize documentos e controle o acesso à plataforma.
        </p>
      </div>

      <div style={{ padding: "16px 14px", marginTop: -16 }}>
        {/* KPIs */}
        <div className="flex flex-col gap-10" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 14 }}>
          {KPIS.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 14, padding: "14px 16px 14px 22px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderLeft: `4px solid hsl(${k.bar})` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "hsl(var(--foreground))", margin: 0 }}>{k.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: "hsl(var(--foreground))", margin: "4px 0 2px" }}>{k.value}</p>
              <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: 0 }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters card */}
        <div style={{ background: "white", borderRadius: 16, padding: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--foreground))", margin: "0 0 6px" }}>Status</p>
          <div className="relative mb-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none appearance-none"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", background: "white" }}>
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="pendente">Pendente</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))", pointerEvents: "none" }} />
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--foreground))", margin: "0 0 6px" }}>Buscar Agência</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 border" style={{ borderColor: "hsl(var(--border))" }}>
              <input type="text" placeholder="Nome Fantasia ou CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                style={{ color: "hsl(var(--foreground))" }} />
            </div>
            <button style={{ background: "hsl(220 40% 18%)", border: "none", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
              <Search size={15} color="white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={limpar} style={{ flex: 1, background: "white", border: "1px solid hsl(var(--border))", borderRadius: 12, padding: "10px", color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Limpar
            </button>
            <button onClick={() => setShowForm(true)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "hsl(var(--primary))", border: "none", borderRadius: 12, padding: "10px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <PlusCircle size={14} /> Nova Agência
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {filtered.map((a) => {
            const s = STATUS_STYLE[a.status];
            return (
              <div key={a.id} style={{ background: "white", borderRadius: 14, padding: "12px 14px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "hsl(var(--muted))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Building2 size={18} style={{ color: "hsl(var(--muted-foreground))" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0 }}>{a.nome}</p>
                    <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>CNPJ: {a.cnpj}</p>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, color: `hsl(${s.text})`, background: `hsl(${s.bg})`, borderRadius: 20, padding: "4px 10px", whiteSpace: "nowrap", letterSpacing: 0.5 }}>
                    {s.label}
                  </span>
                </div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid hsl(var(--border))", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 11, color: "hsl(var(--foreground))", margin: 0, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.email}</p>
                    <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "1px 0 0" }}>{a.telefone}</p>
                  </div>
                  <button style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: 6, cursor: "pointer", flexShrink: 0 }}>
                    <Compass size={14} style={{ color: "hsl(var(--foreground))" }} />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", padding: 24, color: "hsl(var(--muted-foreground))", fontSize: 13, background: "white", borderRadius: 14 }}>
              Nenhuma agência encontrada.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "24px 20px 32px", animation: "slideUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" }}>Nova Agência</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input placeholder="Nome Fantasia *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <input placeholder="CNPJ *" value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <input placeholder="E-mail *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <input placeholder="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                <option value="pendente">Pendente</option>
                <option value="ativo">Ativo</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
              <button onClick={save} style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 14, padding: "12px", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                Cadastrar agência
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

export default Agencias;
