import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, Search, PlusCircle, Edit2, Trash2, X, Percent, MapPin, Calendar } from "lucide-react";

interface Promocao {
  id: number;
  nome: string;
  destino: string;
  desconto: number;
  validade: string;
  status: string;
}

const INITIAL: Promocao[] = [
  { id: 1, nome: "Verão nos Lençóis", destino: "Lençóis Maranhenses", desconto: 25, validade: "30/06/2025", status: "ativa" },
  { id: 2, nome: "Carnaval São Luís", destino: "São Luís", desconto: 15, validade: "05/03/2025", status: "expirada" },
  { id: 3, nome: "Páscoa em Barreirinhas", destino: "Barreirinhas", desconto: 20, validade: "20/04/2025", status: "ativa" },
  { id: 4, nome: "Férias em Carolina", destino: "Carolina", desconto: 30, validade: "31/07/2025", status: "ativa" },
  { id: 5, nome: "Réveillon Raposa", destino: "Raposa", desconto: 10, validade: "01/01/2025", status: "expirada" },
];

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  ativa: { bg: "155 70% 90%", text: "155 70% 32%" },
  expirada: { bg: "0 0% 90%", text: "0 0% 42%" },
};

const Promocoes = () => {
  const navigate = useNavigate();
  const [promos, setPromos] = useState<Promocao[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Promocao | null>(null);
  const [form, setForm] = useState({ nome: "", destino: "", desconto: "", validade: "", status: "ativa" });

  const filtered = promos.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.destino.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterActive || p.status === "ativa";
    return matchSearch && matchFilter;
  });

  const openNew = () => { setEditing(null); setForm({ nome: "", destino: "", desconto: "", validade: "", status: "ativa" }); setModal(true); };
  const openEdit = (p: Promocao) => { setEditing(p); setForm({ nome: p.nome, destino: p.destino, desconto: String(p.desconto), validade: p.validade, status: p.status }); setModal(true); };

  const save = () => {
    if (!form.nome.trim()) return;
    if (editing) {
      setPromos((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form, desconto: Number(form.desconto) } : p));
    } else {
      setPromos((prev) => [...prev, { id: Date.now(), ...form, desconto: Number(form.desconto) }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setPromos((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "hsl(var(--primary))", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div className="flex items-center gap-3 relative z-10">
          <button onClick={() => navigate("/parceiro")} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 12, padding: 8, cursor: "pointer" }}><ArrowLeft size={20} color="white" /></button>
          <div>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>MATRIP CORPORATE</span>
            <h1 style={{ color: "white", fontSize: 19, fontWeight: 700, lineHeight: 1.25, marginTop: 1 }}>Promoções</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 14px", marginTop: 12, paddingBottom: 24 }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input type="text" placeholder="Pesquisar promoção..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" style={{ color: "hsl(var(--foreground))" }} />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setFilterActive(!filterActive)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: filterActive ? "hsl(var(--primary))" : "white", color: filterActive ? "white" : "hsl(var(--foreground))", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            Apenas ativas
          </button>
          <button onClick={openNew} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, background: "hsl(var(--primary))", border: "none", borderRadius: 10, padding: "6px 12px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            <PlusCircle size={14} /> Nova
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((p) => {
            const st = STATUS_COLOR[p.status] || STATUS_COLOR.ativa;
            return (
              <div key={p.id} style={{ background: "white", borderRadius: 18, padding: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "hsl(var(--foreground))", margin: 0 }}>{p.nome}</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, color: `hsl(${st.text})`, background: `hsl(${st.bg})`, borderRadius: 20, padding: "3px 9px", flexShrink: 0 }}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-3" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {p.destino}</span>
                  <span className="flex items-center gap-1"><Percent size={12} /> {p.desconto}% off</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {p.validade}</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <button onClick={() => openEdit(p)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}><Edit2 size={13} style={{ color: "hsl(var(--muted-foreground))" }} /></button>
                  <button onClick={() => remove(p.id)} style={{ background: "hsl(0 84% 95%)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}><Trash2 size={13} style={{ color: "hsl(0 70% 50%)" }} /></button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p style={{ textAlign: "center", padding: "24px", color: "hsl(var(--muted-foreground))", fontSize: 13 }}>Nenhuma promoção encontrada.</p>}
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "20px", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" }}>{editing ? "Editar Promoção" : "Nova Promoção"}</h3>
              <button onClick={() => setModal(false)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}><X size={18} /></button>
            </div>
            {[
              { label: "Nome da promoção", key: "nome" },
              { label: "Destino/Pacote", key: "destino" },
              { label: "Desconto (%)", key: "desconto" },
              { label: "Validade (dd/mm/aaaa)", key: "validade" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: 4 }}>{f.label}</label>
                <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: 4 }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", background: "white" }}>
                <option value="ativa">Ativa</option>
                <option value="expirada">Expirada</option>
              </select>
            </div>
            <button onClick={save} style={{ width: "100%", padding: "12px", borderRadius: 14, background: "hsl(var(--primary))", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
              {editing ? "Salvar alterações" : "Adicionar promoção"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promocoes;
