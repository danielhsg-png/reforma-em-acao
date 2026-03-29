import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import { ArrowRight, AlertTriangle, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(218,74%,16%)] px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium">
            EC 132/2023 · LC 214/2025
          </p>
          <h1 className="font-heading font-black uppercase tracking-widest text-4xl sm:text-5xl leading-none text-white">
            REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#F57C00] uppercase tracking-wide leading-snug max-w-[280px]">
            A ação de agora vai garantir o futuro da sua empresa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-xs text-white/60 uppercase tracking-wide">
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
              className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/30 text-sm"
              data-testid="input-login-email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-xs text-white/60 uppercase tracking-wide">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/30 text-sm"
              data-testid="input-login-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="button-login"
            className="w-full h-12 mt-1 flex items-center justify-center gap-2 rounded-md
                       bg-[#F57C00] hover:bg-[#E56A00] active:bg-[#D45F00]
                       text-white font-semibold text-sm uppercase tracking-wider
                       transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-white/30 text-center leading-relaxed max-w-xs">
          Ferramenta de orientação e simulação. Não substitui consultoria tributária especializada.
        </p>
      </div>
    </div>
  );
}
