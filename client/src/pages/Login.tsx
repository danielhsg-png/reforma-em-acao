import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import { Building2, Lock, Mail, ArrowRight, BarChart3, Clock, FileCheck, ShieldCheck, Zap, AlertTriangle, Scale, Package, MessageCircleQuestion } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-sm sm:text-base">
              REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col space-y-6">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium w-fit">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                  Para Empresários, Gestores e Contadores
                </div>
                <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                  O futuro da sua empresa na <span className="text-primary">Reforma Tributária</span>
                </h1>
                <p className="text-muted-foreground md:text-lg max-w-[600px]">
                  Forneça informações básicas do seu negócio e receba um diagnóstico surpreendentemente detalhado.
                  Descubra os impactos reais e legais em suas operações e acesse um plano de ação para o curto, médio e longo prazo.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>Baseado na LC 214/2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary shrink-0" />
                    <span>Plano em minutos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>Cronograma 2026-2033</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>9 módulos + PDF</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <Card className="w-full max-w-md shadow-xl border-primary/20">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-heading">Acesse sua Conta</CardTitle>
                    <CardDescription>
                      Entre com seu e-mail e senha para acessar a plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          data-testid="input-login-email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Senha
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          data-testid="input-login-password"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-md font-medium group bg-[#F57C00] hover:bg-[#E56A00] text-white border-0"
                        disabled={loading}
                        data-testid="button-login"
                      >
                        {loading ? "Entrando..." : "Entrar na Plataforma"}
                        {!loading && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-secondary/20">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading mb-4">Tudo que você precisa em um só lugar</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Plano de ação completo com 9 módulos especializados + 3 ferramentas bônus para sua empresa.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BarChart3, title: "Simulador Financeiro", desc: "Projeção de impacto ano a ano (2026-2033) com Split Payment e créditos." },
                { icon: Scale, title: "Diagnóstico de Risco", desc: "8 indicadores de risco com pontuação dinâmica e referências legais." },
                { icon: Package, title: "Análise de Produtos", desc: "Impacto tributário detalhado em até 10 produtos/serviços da sua empresa." },
                { icon: MessageCircleQuestion, title: "Tira-Dúvidas", desc: "Respostas personalizadas para suas 5 principais preocupações." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-3 bg-background p-6 rounded-xl shadow-sm border border-border/50">
                  <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold font-heading">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-background">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-heading mb-4">Base Legal Completa</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-sm">
              Todas as análises são fundamentadas nos textos oficiais aprovados: EC 132/2023 (Emenda Constitucional),
              LC 214/2025 (Lei Complementar regulamentadora do IBS/CBS), LC 227/2026 (Split Payment e regulamentação complementar),
              NT 2025.002 v1.34 (campos NF-e) e Guia GT-08 (impactos administrativos).
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-screen-2xl px-4 md:px-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Uma ferramenta de simulação e orientação. As informações não substituem consultoria tributária e jurídica especializada.
          </p>
        </div>
      </footer>
    </div>
  );
}
