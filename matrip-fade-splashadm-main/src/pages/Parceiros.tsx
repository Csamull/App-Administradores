import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, PlusCircle, Edit2, Trash2, X, Handshake } from "lucide-react";

interface Parceiro {
  id: number;
  nome: string;
  categoria: string;
  status: "ativo" | "pendente" | "inativo";
}

const CATEGORIAS = ["Hotel", "Companhia Aérea", "Seguro Viagem", "Transporte", "Restaurante", "Passeio"];

const INITIAL: Parceiro[] = [
  { id: 1, nome: "Hotel Maravilha", categoria: "Hotel", status: "ativo" },
  { id: 2, nome: "Latam Airlines", categoria: "Companhia Aérea", status: "ativo" },
  { id: 3, nome: "Seguro Plus", categoria: "Seguro Viagem", status: "pendente" },
  { id: 4, nome: "TransTur Express", categoria: "Transporte", status: "ativo" },
  { id: 5, nome: "Restaurante Sabor Local", categoria: "Restaurante", status: "inativo" },
  { id: 6, nome: "Aventura & Trilhas", categoria: "Passeio", status: "ativo" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  ativo: { bg: "155 70% 90%", text: "155 70% 32%" },
  pendente: { bg: "213 50% 90%", text: "213 68% 25%" },
  inativo: { bg: "0 0% 90%", text: "0 0% 42%" },
};

const CAT_COLORS: Record<string, string> = {
  Hotel: "210 90% 94%", "Companhia Aérea": "270 60% 94%", "Seguro Viagem": "155 70% 92%",
  Transporte: "30 90% 93%", Restaurante: "0 70% 94%", Passeio: "180 60% 92%",
};

const Parceiros = () => {
  const navigate = useNavigate();
  const [parceiros, setParceiros] = useState<Parceiro[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Parceiro | null>(null);
  const [form, setForm] = useState({ nome: "", categoria: "Hotel", status: "ativo" as Parceiro["status"] });

  const filtered = parceiros.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()) || p.categoria.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setForm({ nome: "", categoria: "Hotel", status: "ativo" }); setEditing(null); setShowForm(true); };
  const openEdit = (p: Parceiro) => { setForm({ nome: p.nome, categoria: p.categoria, status: p.status }); setEditing(p); setShowForm(true); };

  const save = () => {
    if (!form.nome) return;
    if (editing) setParceiros((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
    else setParceiros((prev) => [...prev, { id: Date.now(), ...form }]);
    setShowForm(false);
  };

  const remove = (id: number) => setParceiros((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "hsl(var(--primary))", padding: "48px 20px 28px" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <h1 style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Parceiros</h1>
        </div>
      </div>

      <div style={{ padding: "16px 14px", marginTop: -16 }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
            <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            <input type="text" placeholder="Buscar parceiro..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" style={{ color: "hsl(var(--foreground))" }} />
          </div>
          <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: 4, background: "hsl(var(--primary))", border: "none", borderRadius: 12, padding: "10px 14px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            <PlusCircle size={14} /> Novo
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map((p) => {
            const s = STATUS_STYLE[p.status];
            return (
              <div key={p.id} style={{ background: "white", borderRadius: 18, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `hsl(${CAT_COLORS[p.categoria] || "210 90% 94%"})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Handshake size={18} style={{ color: "hsl(var(--foreground))" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0, lineHeight: 1.3 }}>{p.nome}</p>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "4px 0" }}>{p.categoria}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: `hsl(${s.text})`, background: `hsl(${s.bg})`, borderRadius: 20, padding: "3px 9px", alignSelf: "flex-start" }}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
                <div className="flex items-center gap-2 mt-auto">
                  <button onClick={() => openEdit(p)} style={{ flex: 1, background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: "5px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))" }}>
                    <Edit2 size={11} /> Editar
                  </button>
                  <button onClick={() => remove(p.id)} style={{ background: "hsl(0 80% 95%)", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={12} style={{ color: "hsl(0 70% 45%)" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: 24, color: "hsl(var(--muted-foreground))", fontSize: 13 }}>Nenhum parceiro encontrado.</p>}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "24px 20px 32px", animation: "slideUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" }}>{editing ? "Editar Parceiro" : "Novo Parceiro"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input placeholder="Nome do parceiro *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Parceiro["status"] })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="inativo">Inativo</option>
              </select>
              <button onClick={save} style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 14, padding: "12px", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                {editing ? "Salvar alterações" : "Cadastrar parceiro"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

export default Parceiros;
