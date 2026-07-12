import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import logoMatrip from "@/assets/logo_matrip.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    setError("");
    if (!name.trim()) return setError("Informe como quer ser chamado.");
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setError("E-mail inválido.");
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");

    // Store name for greeting and navigate back to login
    sessionStorage.setItem("matrip_display_name", name.trim());
    navigate("/login");
  };

  const fields = [
  {
    id: "name",
    label: "Como quer ser chamado",
    icon: <User size={18} style={{ color: "hsl(var(--matrip-accent))" }} />,
    type: "text",
    placeholder: "Seu nome ou apelido",
    value: name,
    onChange: (v: string) => setName(v),
    rightSlot: null
  },
  {
    id: "email",
    label: "E-mail",
    icon: <Mail size={18} style={{ color: "hsl(var(--matrip-accent))" }} />,
    type: "email",
    placeholder: "seu@email.com",
    value: email,
    onChange: (v: string) => setEmail(v),
    rightSlot: null
  },
  {
    id: "password",
    label: "Senha",
    icon: <Lock size={18} style={{ color: "hsl(var(--matrip-accent))" }} />,
    type: showPassword ? "text" : "password",
    placeholder: "••••••••",
    value: password,
    onChange: (v: string) => setPassword(v),
    rightSlot:
    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: "hsl(var(--muted-foreground))" }}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

  },
  {
    id: "confirm",
    label: "Confirmar senha",
    icon: <Lock size={18} style={{ color: "hsl(var(--matrip-accent))" }} />,
    type: showConfirm ? "text" : "password",
    placeholder: "••••••••",
    value: confirm,
    onChange: (v: string) => setConfirm(v),
    rightSlot:
    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ color: "hsl(var(--muted-foreground))" }}>
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

  }];


  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "hsl(var(--primary))",
        animation: "registerFadeIn 0.5s ease-out forwards"
      }}>
      
      {/* Logo area */}
      <div className="flex flex-col items-center pt-12 pb-6 px-6">
        <div className="rounded-full p-2 mb-4 bg-white shadow-lg">
          <img src={logoMatrip} alt="Matrip" className="w-40 h-40 object-contain" />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight">Matrip Corporate</h1>
        <p className="text-white/70 text-sm mt-1">Crie sua conta grátis agora</p>
      </div>

      {/* White card */}
      <div
        className="flex-1 rounded-t-3xl px-6 pt-8 pb-10"
        style={{ background: "hsl(var(--background))" }}>
        
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 text-sm font-medium mb-6"
          style={{ color: "hsl(var(--primary))" }}>
          
          <ArrowLeft size={16} />
          Voltar ao login
        </button>

        <h2 className="text-2xl font-bold mb-1" style={{ color: "hsl(var(--foreground))" }}>
          Criar conta
        </h2>
        <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          Preencha os dados abaixo para começar
        </p>

        {/* Fields */}
        {fields.map((f) =>
        <div key={f.id} className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>
              {f.label}
            </label>
            <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border"
            style={{
              borderColor: f.value ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: "hsl(var(--muted))",
              transition: "border-color 0.2s"
            }}>
            
              {f.icon}
              <input
              type={f.type}
              placeholder={f.placeholder}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }} />
            
              {f.rightSlot}
            </div>
          </div>
        )}

        {/* Error */}
        {error &&
        <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ color: "hsl(0 72% 51%)", background: "hsl(0 72% 51% / 0.08)" }}>
            {error}
          </p>
        }

        {/* Submit */}
        <button
          type="button"
          onClick={handleRegister}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold shadow-lg active:scale-95 transition-transform mt-2"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            boxShadow: "0 8px 24px -4px hsl(var(--primary) / 0.45)"
          }}>
          
          Criar minha conta
          <ArrowRight size={18} />
        </button>

        <p className="text-center text-sm mt-7" style={{ color: "hsl(var(--muted-foreground))" }}>
          Já tem uma conta?{" "}
          <button
            type="button"
            className="font-semibold"
            style={{ color: "hsl(var(--primary))" }}
            onClick={() => navigate("/login")}>
            
            Fazer login
          </button>
        </p>
      </div>

      <style>{`
        @keyframes registerFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>);

};

export default Register;