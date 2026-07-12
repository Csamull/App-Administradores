import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import logoMatrip from "@/assets/logo_matrip.png";

const ForgotPassword = () => {
  const DARK_BLUE = "#0c2340";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = () => {
    setError("");
    if (!email.trim()) {
      setError("Informe seu e-mail cadastrado.");
      return;
    }
    if (!validateEmail(email)) {
      setError("E-mail inválido. Verifique e tente novamente.");
      return;
    }
    setSent(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: DARK_BLUE,
        animation: "fadeSlideIn 0.5s ease-out forwards",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center pt-14 pb-8 px-6" style={{ background: DARK_BLUE }}>
        <div className="rounded-full p-2 mb-4 bg-white shadow-lg">
          <img src={logoMatrip} alt="Matrip" className="w-40 h-40 object-contain" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#fff" }}>
          Recuperar Senha
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
          Enviaremos um link para redefinir sua senha
        </p>
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-t-3xl px-6 pt-8 pb-10 flex flex-col"
        style={{ background: "hsl(var(--background))" }}
      >
        {!sent ? (
          <>
            <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Digite o e-mail vinculado à sua conta. Você receberá um link para criar uma nova senha.
            </p>

            {/* Email input */}
            <div className="mb-2">
              <label
                className="text-xs font-semibold mb-1.5 block"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                E-mail cadastrado
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors"
                style={{
                  borderColor: error
                    ? "hsl(var(--destructive))"
                    : email
                    ? DARK_BLUE
                    : "hsl(var(--border))",
                  background: "hsl(var(--muted))",
                }}
              >
                <Mail size={18} style={{ color: DARK_BLUE }} />
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  style={{ color: "hsl(var(--foreground))" }}
                />
              </div>
              {error && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: "hsl(var(--destructive))" }}>
                  {error}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold shadow-lg active:scale-95 transition-transform mt-8"
              style={{
                background: DARK_BLUE,
                color: "#fff",
                boxShadow: "0 8px 24px -4px rgba(12,35,64,0.45)",
              }}
            >
              <Send size={18} />
              Enviar link de recuperação
            </button>

            {/* Back */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 mt-6 text-sm font-medium mx-auto"
              style={{ color: DARK_BLUE }}
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </button>
          </>
        ) : (
          /* Success state */
          <div
            className="flex-1 flex flex-col items-center justify-center text-center px-4"
            style={{ animation: "fadeSlideIn 0.5s ease-out forwards" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: "rgba(12,35,64,0.12)" }}
            >
              <CheckCircle2 size={40} style={{ color: DARK_BLUE }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "hsl(var(--foreground))" }}>
              E-mail enviado!
            </h2>
            <p className="text-sm mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Enviamos um link de recuperação para:
            </p>
            <p className="text-sm font-semibold mb-6" style={{ color: DARK_BLUE }}>
              {email}
            </p>
            <p className="text-xs mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              Verifique sua caixa de entrada e a pasta de spam. O link expira em 30 minutos.
            </p>

            <button
              type="button"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 border text-sm font-medium active:scale-95 transition-transform mb-4"
              style={{
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
                background: "hsl(var(--background))",
              }}
            >
              Reenviar e-mail
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 text-sm font-medium mx-auto"
              style={{ color: DARK_BLUE }}
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
