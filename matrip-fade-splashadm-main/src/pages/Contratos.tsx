import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileCheck2, Search, PlusCircle, Edit2, Trash2, X } from "lucide-react";

interface Contrato {
  id: number;
  cliente: string;
  tipo: string;
  inicio: string;
  termino: string;
  status: string;
  valor: string;
}

const INITIAL: Contrato[] = [
  { id: 1, cliente: "Hotel Lençóis Premium", tipo: "Parceria", inicio: "01/01/2025", termino: "31/12/2025", status: "ativo", valor: "R$ 120.000" },
  { id: 2, cliente: "Maria Silva", tipo: "Pacote de viagem", inicio: "15/03/2025", termino: "22/03/2025", status: "ativo", valor: "R$ 8.400" },
  { id: 3, cliente: "TransTur Ltda", tipo: "Serviço", inicio: "01/06/2024", termino: "01/06/2025", status: "vencido", valor: "R$ 36.000" },
  { id: 4, cliente: "João Pereira", tipo: "Pacote de viagem", inicio: "10/02/2025", termino: "17/02/2025", status: "cancelado", valor: "R$ 5.200" },
  { id: 5, cliente: "Agência Sol Nascente", tipo: "Parceria", inicio: "01/04/2025", termino: "01/04/2026", status: "ativo", valor: "R$ 85.000" },
];

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  ativo: { bg: "155 70% 90%", text: "155 70% 32%" },
  vencido: { bg: "213 50% 90%", text: "213 68% 25%" },
  cancelado: { bg: "0 84% 93%", text: "0 70% 44%" },
};

const TIPOS = ["Pacote de viagem", "Parceria", "Serviço"];

const Contratos = () => {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState<Contrato[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Contrato | null>(null);
  const [form, setForm] = useState({ cliente: "", tipo: "Pacote de viagem", inicio: "", termino: "", status: "ativo", valor: "" });

  const filtered = contratos.filter((c) => {
    const matchSearch = c.cliente.toLowerCase().includes(search.toLowerCase()) || c.tipo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openNew = () => { setEditing(null); setForm({ cliente: "", tipo: "Pacote de viagem", inicio: "", termino: "", status: "ativo", valor: "" }); setModal(true); };
  const openEdit = (c: Contrato) => { setEditing(c); setForm({ cliente: c.cliente, tipo: c.tipo, inicio: c.inicio, termino: c.termino, status: c.status, valor: c.valor }); setModal(true); };

  const save = () => {
    if (!form.cliente.trim()) return;
    if (editing) {
      setContratos((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      setContratos((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setModal(false);
  };

  const remove = (id: number) => setContratos((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      {/* HEADER */}
      <div style={{ background: "hsl(var(--primary))", padding: "56px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div className="flex items-center gap-3 relative z-10">
          <button onClick={() => navigate("/parceiro")} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 12, padding: 8, cursor: "pointer" }}>
            <ArrowLeft size={20} color="white" />
          </button>
          <div>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>MATRIP CORPORATE</span>
            <h1 style={{ color: "white", fontSize: 19, fontWeight: 700, lineHeight: 1.25, marginTop: 1 }}>Gerenciar Contratos</h1>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 14px", marginTop: 12, paddingBottom: 24 }}>
        {/* Search + Filter */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input type="text" placeholder="Pesquisar contrato..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" style={{ color: "hsl(var(--foreground))" }} />
        </div>

        <div className="flex items-center gap-2 mb-3" style={{ overflowX: "auto" }}>
          {["todos", "ativo", "vencido", "cancelado"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: statusFilter === s ? "hsl(var(--primary))" : "white", color: statusFilter === s ? "white" : "hsl(var(--foreground))", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <button onClick={openNew} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, background: "hsl(var(--primary))", border: "none", borderRadius: 10, padding: "6px 12px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            <PlusCircle size={14} /> Novo
          </button>
        </div>

        {/* List */}
        <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          {filtered.map((c, i) => {
            const st = STATUS_COLOR[c.status] || STATUS_COLOR.ativo;
            return (
              <div key={c.id} style={{ padding: "14px 16px", borderBottom: i < filtered.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                <div className="flex items-center justify-between">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.cliente}</p>
                    <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{c.tipo} · {c.valor}</p>
                    <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{c.inicio} → {c.termino}</p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: `hsl(${st.text})`, background: `hsl(${st.bg})`, borderRadius: 20, padding: "3px 9px", whiteSpace: "nowrap", flexShrink: 0, marginLeft: 8 }}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 justify-end">
                  <button onClick={() => openEdit(c)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}><Edit2 size={13} style={{ color: "hsl(var(--muted-foreground))" }} /></button>
                  <button onClick={() => remove(c.id)} style={{ background: "hsl(0 84% 95%)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}><Trash2 size={13} style={{ color: "hsl(0 70% 50%)" }} /></button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p style={{ textAlign: "center", padding: "24px", color: "hsl(var(--muted-foreground))", fontSize: 13 }}>Nenhum contrato encontrado.</p>}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "20px", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" }}>{editing ? "Editar Contrato" : "Novo Contrato"}</h3>
              <button onClick={() => setModal(false)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}><X size={18} /></button>
            </div>
            {[
              { label: "Cliente/Empresa", key: "cliente", type: "text" },
              { label: "Valor", key: "valor", type: "text" },
              { label: "Data início", key: "inicio", type: "text" },
              { label: "Data término", key: "termino", type: "text" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: 4 }}>{f.label}</label>
                <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} type={f.type} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: 4 }}>Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", background: "white" }}>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: 4 }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", background: "white" }}>
                {["ativo", "vencido", "cancelado"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <button onClick={save} style={{ width: "100%", padding: "12px", borderRadius: 14, background: "hsl(var(--primary))", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
              {editing ? "Salvar alterações" : "Adicionar contrato"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contratos;
