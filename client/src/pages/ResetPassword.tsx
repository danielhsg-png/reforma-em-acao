import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, AlertTriangle, Loader2, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t && t.trim() ? t.trim() : null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Não foi possível redefinir a senha.");
      setDone(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: "hsl(222, 47%, 6%)", fontFamily: "'Inter', sans-serif" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full opacity-[0.18] blur-[120px]"
        style={{ backgroundColor: "hsl(25, 95%, 53%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-[-10%] w-[480px] h-[480px] rounded-full opacity-[0.10] blur-[140px]"
        style={{ backgroundColor: "hsl(152, 76%, 46%)" }}
      />

      <div className="w-full max-w-sm flex flex-col items-center gap-10 relative z-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <img
            src="/logo-png-branca.png"
            alt="Reforma em Ação"
            className="h-16 w-auto select-none"
            draggable={false}
          />
          <p
            className="text-[11px] uppercase tracking-[0.28em] text-white/50 font-medium"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            Criar nova senha
          </p>
          <h1
            className="text-2xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            Defina sua nova senha
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-[320px]">
            Escolha uma senha forte, com pelo menos 8 caracteres. Depois de salvar, você será levado ao login.
          </p>
        </div>

        {!token ? (
          <div className="w-full flex flex-col gap-4 items-center text-center">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full border"
              style={{
                backgroundColor: "rgba(239,68,68,0.10)",
                borderColor: "rgba(239,68,68,0.35)",
              }}
            >
              <AlertTriangle className="h-7 w-7 text-red-400" />
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Link inválido ou incompleto.
              <br />
              Solicite um novo link de redefinição.
            </p>
            <Link
              href="/esqueci-senha"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: "hsl(25, 95%, 53%)" }}
            >
              <KeyRound className="h-4 w-4" />
              Solicitar novo link
            </Link>
          </div>
        ) : done ? (
          <div className="w-full flex flex-col gap-4 items-center text-center">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full border"
              style={{
                backgroundColor: "hsla(152, 76%, 46%, 0.10)",
                borderColor: "hsla(152, 76%, 46%, 0.35)",
              }}
            >
              <CheckCircle2 className="h-7 w-7" style={{ color: "hsl(152, 76%, 46%)" }} />
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Senha redefinida com sucesso.
              <br />
              Redirecionando para o login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {error && (
              <Alert variant="destructive" className="py-2 bg-red-500/10 border-red-500/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-[11px] text-white/60 uppercase tracking-[0.18em] font-medium">
                Nova senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-11 text-sm text-white placeholder:text-white/30 border-white/10 focus-visible:ring-2 focus-visible:ring-offset-0"
                style={{ backgroundColor: "hsl(222, 44%, 10%)", borderColor: "hsl(222, 30%, 18%)" }}
                data-testid="input-reset-password"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm" className="text-[11px] text-white/60 uppercase tracking-[0.18em] font-medium">
                Confirmar nova senha
              </Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-11 text-sm text-white placeholder:text-white/30 border-white/10 focus-visible:ring-2 focus-visible:ring-offset-0"
                style={{ backgroundColor: "hsl(222, 44%, 10%)", borderColor: "hsl(222, 30%, 18%)" }}
                data-testid="input-reset-confirm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="button-reset-submit"
              className="w-full h-12 mt-2 flex items-center justify-center gap-2 rounded-[0.75rem]
                         text-white font-semibold text-sm uppercase tracking-[0.12em]
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-[0_6px_24px_-4px_rgba(249,115,22,0.45)] hover:shadow-[0_10px_32px_-4px_rgba(249,115,22,0.60)]
                         hover:-translate-y-px active:translate-y-0"
              style={{
                backgroundColor: loading ? "hsl(25, 95%, 45%)" : "hsl(25, 95%, 53%)",
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "hsl(25, 95%, 48%)";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "hsl(25, 95%, 53%)";
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  Salvar nova senha
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <Link
              href="/"
              className="mt-2 inline-flex items-center justify-center gap-2 text-xs text-white/60 hover:text-white/90 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
