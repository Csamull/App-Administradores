import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Search, Download, UserCheck, UserX, UserPlus, Mail, PlusCircle, X } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  status: "ativo" | "bloqueado";
  criadoEm: string;
}

const INITIAL: Usuario[] = [
  { id: 1, nome: "Ana Silva", email: "ana.silva@email.com", cpf: "123.456.789-01", status: "ativo", criadoEm: "2026-04-12" },
  { id: 2, nome: "Bruno Costa", email: "bruno.costa@email.com", cpf: "234.567.890-12", status: "ativo", criadoEm: "2026-05-02" },
  { id: 3, nome: "Carla Mendes", email: "carla.mendes@email.com", cpf: "345.678.901-23", status: "bloqueado", criadoEm: "2026-03-18" },
  { id: 4, nome: "Diego Rocha", email: "diego.rocha@email.com", cpf: "456.789.012-34", status: "ativo", criadoEm: "2026-05-05" },
  { id: 5, nome: "Eduarda Lima", email: "eduarda.lima@email.com", cpf: "567.890.123-45", status: "ativo", criadoEm: "2026-04-28" },
  { id: 6, nome: "Felipe Souza", email: "felipe.souza@email.com", cpf: "678.901.234-56", status: "bloqueado", criadoEm: "2026-02-10" },
  { id: 7, nome: "Gabriela Reis", email: "gabriela.reis@email.com", cpf: "789.012.345-67", status: "ativo", criadoEm: "2026-05-08" },
];

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", cpf: "", status: "ativo" as Usuario["status"] });

  const save = () => {
    if (!form.nome || !form.email || !form.cpf) return;
    const today = new Date().toISOString().slice(0, 10);
    setUsuarios((prev) => [{ id: Date.now(), ...form, criadoEm: today }, ...prev]);
    setForm({ nome: "", email: "", cpf: "", status: "ativo" });
    setShowForm(false);
  };

  const now = new Date();
  const novosMes = usuarios.filter((u) => {
    const d = new Date(u.criadoEm);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const ativos = usuarios.filter((u) => u.status === "ativo").length;
  const bloqueados = usuarios.filter((u) => u.status === "bloqueado").length;

  const filtered = usuarios.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.nome.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.cpf.replace(/\D/g, "").includes(q.replace(/\D/g, ""))
    );
  });

  const exportar = () => {
    const header = "Nome,E-mail,CPF,Status,Criado em\n";
    const rows = usuarios
      .map((u) => `"${u.nome}","${u.email}","${u.cpf}","${u.status}","${u.criadoEm}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usuarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const KPIS = [
    { label: "Total", value: usuarios.length, icon: Users, color: "210 90% 42%", bg: "210 90% 94%" },
    { label: "Novos no mês", value: novosMes, icon: UserPlus, color: "var(--primary)", bg: "213 50% 92%", isVar: true },
    { label: "Ativos", value: ativos, icon: UserCheck, color: "155 70% 32%", bg: "155 70% 90%" },
    { label: "Bloqueados", value: bloqueados, icon: UserX, color: "0 70% 45%", bg: "0 80% 95%" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "hsl(var(--primary))", padding: "48px 20px 28px" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <h1 style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Gerenciar Usuários</h1>
        </div>
      </div>

      <div style={{ padding: "16px 14px", marginTop: -16 }}>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {KPIS.map((k) => {
            const Icon = k.icon;
            const colorVal = k.isVar ? `hsl(${k.color})` : `hsl(${k.color})`;
            return (
              <div key={k.label} style={{ background: "white", borderRadius: 16, padding: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `hsl(${k.bg})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <Icon size={18} style={{ color: colorVal }} />
                </div>
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: 0, fontWeight: 600 }}>{k.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "hsl(var(--foreground))", margin: "2px 0 0" }}>{k.value}</p>
              </div>
            );
          })}
        </div>

        {/* Search + Export */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
            <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
          </div>
          <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 4, background: "hsl(var(--primary))", border: "none", borderRadius: 12, padding: "10px 14px", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            <PlusCircle size={14} /> Cadastrar
          </button>
          <button onClick={exportar} style={{ display: "flex", alignItems: "center", gap: 4, background: "white", border: "1px solid hsl(var(--border))", borderRadius: 12, padding: "10px 14px", color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            <Download size={14} /> Exportar
          </button>
        </div>

        {/* Results */}
        <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid hsl(var(--border))", fontSize: 11, fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </div>
          {filtered.map((u, i) => {
            const isAtivo = u.status === "ativo";
            return (
              <div key={u.id} style={{ padding: "14px 16px", borderBottom: i < filtered.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "hsl(var(--muted))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))" }}>
                    {u.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0 }}>{u.nome}</p>
                    <div className="flex items-center gap-1 mt-1" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                      <Mail size={11} /> {u.email}
                    </div>
                    <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>CPF: {u.cpf}</p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: isAtivo ? "hsl(155 70% 32%)" : "hsl(0 70% 45%)", background: isAtivo ? "hsl(155 70% 90%)" : "hsl(0 80% 95%)", borderRadius: 20, padding: "3px 9px", whiteSpace: "nowrap" }}>
                    {isAtivo ? "Ativo" : "Bloqueado"}
                  </span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p style={{ textAlign: "center", padding: 24, color: "hsl(var(--muted-foreground))", fontSize: 13 }}>Nenhum usuário encontrado.</p>}
        </div>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "24px 20px 32px", animation: "slideUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" }}>Cadastrar Usuário</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input placeholder="Nome completo *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <input placeholder="E-mail *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <input placeholder="CPF *" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Usuario["status"] })} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                <option value="ativo">Ativo</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
              <button onClick={save} style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 14, padding: "12px", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                Cadastrar usuário
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

export default Usuarios;
