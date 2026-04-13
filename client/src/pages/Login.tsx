import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import { ArrowRight, AlertTriangle, Loader2, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "reforma_remembered";

export default function Login() {
  const { login } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { email: savedEmail } = JSON.parse(saved);
        if (savedEmail) setEmail(savedEmail);
        setRemember(true);
      }
    } catch {
      // ignora erros de parse
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background selection:bg-primary/30 px-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo OLED */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[160px] pointer-events-none animate-pulse-slow-reverse" />

      <div className="w-full max-w-[440px] z-10 space-y-8">
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/10">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm uppercase font-black tracking-[0.3em] text-primary italic">
              Enterprise Secure Node
            </span>
          </div>
          
          <div className="flex justify-center w-full">
            <img 
              src="/logo-png-branca.png" 
              alt="Reforma em Ação" 
              className="h-16 md:h-20 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            />
          </div>
          
          <p className="text-sm font-bold text-muted-foreground/80 leading-relaxed max-w-[340px] uppercase tracking-wider">
            A infraestrutura técnica para a <span className="text-white">transição tributária definitiva</span>.
          </p>
        </div>

        <div className="glass-card p-10 rounded-[32px] border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group animate-in zoom-in-95 duration-700 delay-200">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive py-4 rounded-2xl animate-in shake duration-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm font-black uppercase tracking-widest">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em] px-2 italic">
                  ID de Acesso / Corporativo
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="empresa@dominio.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-14 bg-white/[0.03] border-white/10 text-white font-bold placeholder:text-white/10 px-6 rounded-2xl focus:border-primary/50 focus:bg-white/[0.07] focus:ring-0 transition-all duration-300"
                    data-testid="input-login-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <Label htmlFor="password" className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em] italic">
                    Chave de Segurança
                  </Label>
                  <button type="button" className="text-sm text-primary/60 hover:text-primary transition-colors font-black uppercase tracking-widest">
                    Recovery
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-14 bg-white/[0.03] border-white/10 text-white font-bold placeholder:text-white/10 px-6 rounded-2xl focus:border-primary/50 focus:bg-white/[0.07] focus:ring-0 transition-all duration-300"
                    data-testid="input-login-password"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group" data-testid="label-remember-me">
                <div className={cn(
                  "w-5 h-5 rounded-lg border-2 border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-primary/50",
                  remember ? "bg-primary border-primary shadow-lg shadow-primary/20" : "bg-white/5"
                )}>
                  {remember && <CheckIcon className="w-3 h-3 text-background font-black" />}
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="sr-only"
                    data-testid="checkbox-remember-me"
                  />
                </div>
                <span className="text-sm font-black text-muted-foreground group-hover:text-white transition-colors uppercase tracking-widest">Manter Conectado</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="button-login"
              className={cn(
                "group relative w-full h-16 flex items-center justify-center gap-3 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden",
                loading 
                  ? "bg-white/5 text-white/20 cursor-not-allowed" 
                  : "bg-white text-background hover:bg-primary shadow-[0_20px_40px_-12px_rgba(255,255,255,0.2)] hover:shadow-primary/40 active:scale-[0.98]"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  Acessar Hub <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div className="flex items-center gap-6 opacity-20">
            <div className="w-12 h-px bg-white" />
            <Lock className="w-4 h-4 text-white" />
            <div className="w-12 h-px bg-white" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground font-black leading-relaxed tracking-[0.3em] uppercase">
              Plataforma Homologada 2026 &copy; Reforma em Ação Hub
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-black text-primary/40 uppercase tracking-[0.5em] italic">
              <span>Security Node: Verified</span>
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              <span>v2.4.0-Enterprise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg 
      {...props}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={4}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
