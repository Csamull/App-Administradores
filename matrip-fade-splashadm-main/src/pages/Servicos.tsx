import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Search, PlusCircle, Edit2, ToggleLeft, ToggleRight, X } from "lucide-react";

interface Servico {
  id: number;
  nome: string;
  categoria: string;
  preco: string;
  status: string;
}

const INITIAL: Servico[] = [
  { id: 1, nome: "Hospedagem Premium", categoria: "Hotel", preco: "R$ 450/noite", status: "ativo" },
  { id: 2, nome: "Transfer Aeroporto", categoria: "Transporte", preco: "R$ 120", status: "ativo" },
  { id: 3, nome: "Seguro Viagem Nacional", categoria: "Seguro viagem", preco: "R$ 89", status: "ativo" },
  { id: 4, nome: "Guia Turístico Particular", categoria: "Guia turístico", preco: "R$ 300/dia", status: "inativo" },
  { id: 5, nome: "Passeio de Barco", categoria: "Passeio", preco: "R$ 180", status: "ativo" },
  { id: 6, nome: "Aluguel de Carro", categoria: "Transporte", preco: "R$ 200/dia", status: "ativo" },
];

const CATEGORIAS = ["Hotel", "Transporte", "Seguro viagem", "Guia turístico", "Passeio"];

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  ativo: { bg: "155 70% 90%", text: "155 70% 32%" },
  inativo: { bg: "0 0% 90%", text: "0 0% 42%" },
};

const Servicos = () => {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState({ nome: "", categoria: "Hotel", preco: "", status: "ativo" });

  const filtered = servicos.filter((s) => s.nome.toLowerCase().includes(search.toLowerCase()) || s.categoria.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditing(null); setForm({ nome: "", categoria: "Hotel", preco: "", status: "ativo" }); setModal(true); };
  const openEdit = (s: Servico) => { setEditing(s); setForm({ nome: s.nome, categoria: s.categoria, preco: s.preco, status: s.status }); setModal(true); };

  const save = () => {
    if (!form.nome.trim()) return;
    if (editing) {
      setServicos((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...form } : s));
    } else {
      setServicos((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setModal(false);
  };

  const toggleStatus = (id: number) => {
    setServicos((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "ativo" ? "inativo" : "ativo" } : s));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "hsl(var(--primary))", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div className="flex items-center gap-3 relative z-10">
          <button onClick={() => navigate("/parceiro")} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 12, padding: 8, cursor: "pointer" }}><ArrowLeft size={20} color="white" /></button>
          <div>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>MATRIP CORPORATE</span>
            <h1 style={{ color: "white", fontSize: 19, fontWeight: 700, lineHeight: 1.25, marginTop: 1 }}>Serviços</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 14px", marginTop: 12, paddingBottom: 24 }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input type="text" placeholder="Pesquisar serviço..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" style={{ color: "hsl(var(--foreground))" }} />
        </div>

        <div className="flex justify-end mb-3">
          <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: 4, background: "hsl(var(--primary))", border: "none", borderRadius: 10, padding: "6px 12px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            <PlusCircle size={14} /> Novo
          </button>
        </div>

        <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          {filtered.map((s, i) => {
            const st = STATUS_COLOR[s.status];
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 12, borderBottom: i < filtered.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "hsl(270 60% 94%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShoppingBag size={17} style={{ color: "hsl(270 60% 44%)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.nome}</p>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{s.categoria} · {s.preco}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: `hsl(${st.text})`, background: `hsl(${st.bg})`, borderRadius: 20, padding: "3px 9px", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleStatus(s.id)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
                    {s.status === "ativo" ? <ToggleRight size={15} style={{ color: "hsl(155 70% 42%)" }} /> : <ToggleLeft size={15} style={{ color: "hsl(var(--muted-foreground))" }} />}
                  </button>
                  <button onClick={() => openEdit(s)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}><Edit2 size={13} style={{ color: "hsl(var(--muted-foreground))" }} /></button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p style={{ textAlign: "center", padding: "24px", color: "hsl(var(--muted-foreground))", fontSize: 13 }}>Nenhum serviço encontrado.</p>}
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "20px", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" }}>{editing ? "Editar Serviço" : "Novo Serviço"}</h3>
              <button onClick={() => setModal(false)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}><X size={18} /></button>
            </div>
            {[
              { label: "Nome do serviço", key: "nome" },
              { label: "Preço base", key: "preco" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: 4 }}>{f.label}</label>
                <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: 4 }}>Categoria</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", background: "white" }}>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: 4 }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", background: "white" }}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <button onClick={save} style={{ width: "100%", padding: "12px", borderRadius: 14, background: "hsl(var(--primary))", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
              {editing ? "Salvar alterações" : "Adicionar serviço"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servicos;
