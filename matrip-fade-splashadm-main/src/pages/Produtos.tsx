import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Search, DollarSign, CheckCircle2, Clock, PlusCircle, X, MapPin, Tag } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  agencia: string;
  cidade: string;
  tipo: string;
  preco: number;
  status: "aprovado" | "pendente";
}

const CIDADES = ["Todas", "São Luís", "Barreirinhas", "Alcântara", "Carolina", "Tutóia"];
const TIPOS = ["Todos", "Passeio", "Hospedagem", "Transporte", "Pacote"];

const INITIAL: Produto[] = [
  { id: 1, nome: "Lençóis Maranhenses - 3 dias", agencia: "Horizonte Turismo", cidade: "Barreirinhas", tipo: "Pacote", preco: 1280, status: "aprovado" },
  { id: 2, nome: "City Tour São Luís", agencia: "TurExpress", cidade: "São Luís", tipo: "Passeio", preco: 180, status: "aprovado" },
  { id: 3, nome: "Pousada Vista Mar", agencia: "Sol & Mar Turismo", cidade: "São Luís", tipo: "Hospedagem", preco: 320, status: "pendente" },
  { id: 4, nome: "Travessia Alcântara", agencia: "Horizonte Turismo", cidade: "Alcântara", tipo: "Transporte", preco: 95, status: "aprovado" },
  { id: 5, nome: "Chapada das Mesas Trek", agencia: "TurExpress", cidade: "Carolina", tipo: "Passeio", preco: 450, status: "pendente" },
  { id: 6, nome: "Delta do Parnaíba", agencia: "Sol & Mar Turismo", cidade: "Tutóia", tipo: "Pacote", preco: 890, status: "aprovado" },
];

const Produtos = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [cidade, setCidade] = useState("Todas");
  const [tipo, setTipo] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", agencia: "", cidade: "São Luís", tipo: "Passeio", preco: "" });

  const total = produtos.length;
  const precoMedio = produtos.reduce((s, p) => s + p.preco, 0) / (produtos.length || 1);
  const aprovados = produtos.filter((p) => p.status === "aprovado").length;
  const pendentes = produtos.filter((p) => p.status === "pendente").length;

  const filtered = produtos.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.agencia.toLowerCase().includes(q) || p.nome.toLowerCase().includes(q);
    const matchCidade = cidade === "Todas" || p.cidade === cidade;
    const matchTipo = tipo === "Todos" || p.tipo === tipo;
    return matchSearch && matchCidade && matchTipo;
  });

  const save = () => {
    if (!form.nome || !form.agencia || !form.preco) return;
    setProdutos((prev) => [{ id: Date.now(), nome: form.nome, agencia: form.agencia, cidade: form.cidade, tipo: form.tipo, preco: Number(form.preco), status: "pendente" }, ...prev]);
    setForm({ nome: "", agencia: "", cidade: "São Luís", tipo: "Passeio", preco: "" });
    setShowForm(false);
  };

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  const KPIS = [
    { label: "Total de produtos", value: total, icon: ShoppingBag, color: "210 90% 42%", bg: "210 90% 94%" },
    { label: "Preço médio", value: fmt(precoMedio), icon: DollarSign, color: "var(--primary)", bg: "213 50% 92%" },
    { label: "Aprovados", value: aprovados, icon: CheckCircle2, color: "155 70% 32%", bg: "155 70% 90%" },
    { label: "Pendentes", value: pendentes, icon: Clock, color: "0 70% 45%", bg: "0 80% 95%" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "hsl(var(--primary))", padding: "48px 20px 28px" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <h1 style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Gerenciar Produtos</h1>
        </div>
      </div>

      <div style={{ padding: "16px 14px", marginTop: -16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {KPIS.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} style={{ background: "white", borderRadius: 16, padding: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `hsl(${k.bg})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <Icon size={18} style={{ color: `hsl(${k.color})` }} />
                </div>
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: 0, fontWeight: 600 }}>{k.label}</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: "hsl(var(--foreground))", margin: "2px 0 0" }}>{k.value}</p>
              </div>
            );
          })}
        </div>

        {/* Search + filters + create */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
            <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="text"
              placeholder="Buscar por agência ou guia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
          </div>
          <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 4, background: "hsl(var(--primary))", border: "none", borderRadius: 12, padding: "10px 14px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            <PlusCircle size={14} /> Criar
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
            <MapPin size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
            <select value={cidade} onChange={(e) => setCidade(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" style={{ color: "hsl(var(--foreground))" }}>
              {CIDADES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
            <Tag size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" style={{ color: "hsl(var(--foreground))" }}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid hsl(var(--border))", fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </div>
          {filtered.map((p, i) => {
            const ok = p.status === "aprovado";
            return (
              <div key={p.id} style={{ padding: "14px 16px", borderBottom: i < filtered.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                <div className="flex items-start gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "hsl(213 50% 92%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ShoppingBag size={18} style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0 }}>{p.nome}</p>
                    <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{p.agencia}</p>
                    <div className="flex items-center gap-2 mt-1" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {p.cidade}</span>
                      <span>•</span>
                      <span>{p.tipo}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "hsl(var(--foreground))", margin: 0 }}>{fmt(p.preco)}</p>
                    <span style={{ display: "inline-block", marginTop: 4, fontSize: 10, fontWeight: 700, color: ok ? "hsl(155 70% 32%)" : "hsl(0 70% 45%)", background: ok ? "hsl(155 70% 90%)" : "hsl(0 80% 95%)", borderRadius: 20, padding: "3px 9px" }}>
                      {ok ? "Aprovado" : "Pendente"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p style={{ textAlign: "center", padding: 24, color: "hsl(var(--muted-foreground))", fontSize: 13 }}>Nenhum produto encontrado.</p>}
        </div>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "24px 20px 32px", animation: "slideUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" }}>Criar Produto</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input placeholder="Nome do produto *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <input placeholder="Agência / Guia *" value={form.agencia} onChange={(e) => setForm({ ...form, agencia: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <select value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                {CIDADES.filter((c) => c !== "Todas").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                {TIPOS.filter((t) => t !== "Todos").map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" placeholder="Preço (R$) *" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <button onClick={save} style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 14, padding: "12px", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                Criar produto
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

export default Produtos;
