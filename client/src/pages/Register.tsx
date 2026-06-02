import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import { ArrowRight, AlertTriangle, Loader2 } from "lucide-react";

export default function Register() {
  const { register } = useAppStore();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | string[]>("");
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Informe um e-mail válido.";
    if (password.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
      return "A senha deve conter pelo menos 1 letra e 1 número.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name.trim() || undefined);
      setLocation("/inicio");
    } catch (err: any) {
      if (Array.isArray(err.errors)) {
        setError(err.errors);
      } else {
        setError(err.message || "Erro ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundColor: "hsl(222, 47%, 6%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Glow decorativo laranja no topo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full opacity-[0.18] blur-[120px]"
        style={{ backgroundColor: "hsl(25, 95%, 53%)" }}
      />
      {/* Glow decorativo verde embaixo */}
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
            Reforma Tributária Brasileira
          </p>
          <p
            className="text-sm font-semibold uppercase tracking-wide leading-snug max-w-[280px]"
            style={{
              color: "hsl(25, 95%, 53%)",
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            }}
          >
            Diagnóstico completo e plano de ação para realidade de cada empresa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {error && (
            <Alert variant="destructive" className="py-2 bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {Array.isArray(error) ? (
                  <ul className="list-disc list-inside space-y-0.5">
                    {(error as string[]).map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                ) : (
                  error
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-[11px] text-white/60 uppercase tracking-[0.18em] font-medium">
              Nome (opcional)
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Como podemos te chamar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="h-11 text-sm text-white placeholder:text-white/30 border-white/10 focus-visible:ring-2 focus-visible:ring-offset-0"
              style={{
                backgroundColor: "hsl(222, 44%, 10%)",
                borderColor: "hsl(222, 30%, 18%)",
              }}
              data-testid="input-register-name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-[11px] text-white/60 uppercase tracking-[0.18em] font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-11 text-sm text-white placeholder:text-white/30 border-white/10 focus-visible:ring-2 focus-visible:ring-offset-0"
              style={{
                backgroundColor: "hsl(222, 44%, 10%)",
                borderColor: "hsl(222, 30%, 18%)",
              }}
              data-testid="input-register-email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-[11px] text-white/60 uppercase tracking-[0.18em] font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="h-11 text-sm text-white placeholder:text-white/30 border-white/10 focus-visible:ring-2 focus-visible:ring-offset-0"
              style={{
                backgroundColor: "hsl(222, 44%, 10%)",
                borderColor: "hsl(222, 30%, 18%)",
              }}
              data-testid="input-register-password"
            />
            <p className="text-[10px] text-white/40 mt-0.5">
              Mínimo 8 caracteres, com pelo menos 1 letra e 1 número.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="button-register"
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
                Criando conta...
              </>
            ) : (
              <>
                Criar conta gratuita
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-white/50 text-center">
          Já tem conta?{" "}
          <Link
            href="/"
            className="font-semibold hover:underline underline-offset-4 transition-colors"
            style={{ color: "hsl(25, 95%, 53%)" }}
            data-testid="link-go-to-login"
          >
            Entrar
          </Link>
        </p>

        <p className="text-[10px] text-white/30 text-center leading-relaxed max-w-xs">
          Ferramenta de orientação e simulação. Não substitui consultoria tributária especializada.
        </p>
      </div>
    </div>
  );
}
