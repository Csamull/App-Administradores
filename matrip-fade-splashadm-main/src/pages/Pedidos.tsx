import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ShoppingBag, Eye, X, ChevronDown } from "lucide-react";

interface Pedido {
  id: number;
  cliente: string;
  destino: string;
  dataViagem: string;
  valor: string;
  status: "pendente" | "confirmado" | "cancelado";
}

const INITIAL: Pedido[] = [
  { id: 1001, cliente: "Maria Silva", destino: "Fernando de Noronha", dataViagem: "2026-05-15", valor: "R$ 4.500", status: "confirmado" },
  { id: 1002, cliente: "João Santos", destino: "Gramado", dataViagem: "2026-06-01", valor: "R$ 2.800", status: "pendente" },
  { id: 1003, cliente: "Ana Costa", destino: "Cancún", dataViagem: "2026-07-10", valor: "R$ 8.200", status: "confirmado" },
  { id: 1004, cliente: "Pedro Lima", destino: "Maceió", dataViagem: "2026-05-20", valor: "R$ 3.100", status: "cancelado" },
  { id: 1005, cliente: "Carla Mendes", destino: "Paris", dataViagem: "2026-08-05", valor: "R$ 12.500", status: "pendente" },
  { id: 1006, cliente: "Lucas Oliveira", destino: "Salvador", dataViagem: "2026-06-18", valor: "R$ 2.200", status: "confirmado" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  pendente: { bg: "213 50% 90%", text: "213 68% 25%", label: "Pendente" },
  confirmado: { bg: "155 70% 90%", text: "155 70% 32%", label: "Confirmado" },
  cancelado: { bg: "0 70% 92%", text: "0 70% 40%", label: "Cancelado" },
};

const Pedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [detail, setDetail] = useState<Pedido | null>(null);

  const filtered = pedidos.filter((p) => {
    const matchSearch = p.cliente.toLowerCase().includes(search.toLowerCase()) || p.destino.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const changeStatus = (id: number, status: Pedido["status"]) => {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    if (detail?.id === id) setDetail({ ...detail!, status });
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--muted))", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "hsl(var(--primary))", padding: "48px 20px 28px" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <h1 style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Pedidos de Clientes</h1>
        </div>
      </div>

      <div style={{ padding: "16px 14px", marginTop: -16 }}>
        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 border" style={{ background: "white", borderColor: "hsl(var(--border))" }}>
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input type="text" placeholder="Buscar por cliente ou destino..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" style={{ color: "hsl(var(--foreground))" }} />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto" style={{ paddingBottom: 2 }}>
          {["todos", "pendente", "confirmado", "cancelado"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap",
                background: filterStatus === s ? "hsl(var(--primary))" : "white",
                color: filterStatus === s ? "white" : "hsl(var(--muted-foreground))",
                boxShadow: filterStatus === s ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
              }}>
              {s === "todos" ? "Todos" : STATUS_STYLE[s].label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          {filtered.map((p, i) => {
            const s = STATUS_STYLE[p.status];
            return (
              <div key={p.id} style={{ padding: "14px 16px", borderBottom: i < filtered.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "hsl(270 60% 94%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ShoppingBag size={18} style={{ color: "hsl(270 60% 50%)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", margin: 0 }}>{p.cliente}</p>
                    <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "2px 0 0" }}>{p.destino} · {new Date(p.dataViagem).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))" }}>{p.valor}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: `hsl(${s.text})`, background: `hsl(${s.bg})`, borderRadius: 20, padding: "2px 8px" }}>{s.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 justify-end">
                  <button onClick={() => setDetail(p)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))" }}>
                    <Eye size={12} /> Detalhes
                  </button>
                  <select value={p.status} onChange={(e) => changeStatus(p.id, e.target.value as Pedido["status"])}
                    style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 8, padding: "5px 8px", fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", cursor: "pointer" }}>
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p style={{ textAlign: "center", padding: 24, color: "hsl(var(--muted-foreground))", fontSize: 13 }}>Nenhum pedido encontrado.</p>}
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "24px 20px 32px", animation: "slideUp 0.3s ease-out" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" }}>Pedido #{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "hsl(var(--muted))", border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3" style={{ fontSize: 13 }}>
              {[
                ["Cliente", detail.cliente],
                ["Destino", detail.destino],
                ["Data da viagem", new Date(detail.dataViagem).toLocaleDateString("pt-BR")],
                ["Valor", detail.valor],
                ["Status", STATUS_STYLE[detail.status].label],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between" style={{ padding: "8px 0", borderBottom: "1px solid hsl(var(--border))" }}>
                  <span style={{ color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>{label}</span>
                  <span style={{ color: "hsl(var(--foreground))", fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
};

export default Pedidos;
