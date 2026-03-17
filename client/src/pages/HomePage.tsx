import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import {
  Building2,
  ClipboardList,
  Calculator,
  Scale,
  BookOpen,
  ArrowRight,
  LogOut,
} from "lucide-react";

const mainPaths = [
  {
    id: "plano",
    title: "Plano de Ação",
    description:
      "Diagnóstico completo do seu negócio com plano personalizado de adequação à Reforma Tributária. Inclui cronograma, checklist, gestão de fornecedores e precificação.",
    icon: ClipboardList,
    href: "/plano-de-acao",
    cta: "Acessar Meus Planos",
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
    borderColor: "border-l-blue-500",
  },
  {
    id: "simulador-financeiro",
    title: "Simulador Financeiro",
    description:
      "Projeção detalhada do impacto tributário ano a ano (2026–2033), com alíquotas de transição, Split Payment e créditos por categoria de despesa.",
    icon: Calculator,
    href: "/simulador-financeiro",
    cta: "Abrir Simulador",
    color: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600",
    borderColor: "border-l-emerald-500",
  },
  {
    id: "simples",
    title: "Simulador Simples Nacional",
    description:
      "Compare o recolhimento pelo DAS com o regime regular de IBS/CBS. Descubra qual opção é mais vantajosa para o seu negócio e seus clientes B2B.",
    icon: Scale,
    href: "/simulador-simples",
    cta: "Abrir Simulador",
    color: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-600",
    borderColor: "border-l-amber-500",
  },
  {
    id: "o-que-muda",
    title: "O Que Muda?",
    description:
      "Entenda as principais mudanças da Reforma Tributária: Split Payment, novos campos da NF-e, Cashback, Princípio do Destino e cronograma de transição.",
    icon: BookOpen,
    href: "/o-que-muda",
    cta: "Explorar Conteúdo",
    color: "from-violet-500/10 to-violet-600/5",
    iconColor: "text-violet-600",
    borderColor: "border-l-violet-500",
  },
];

export default function HomePage() {
  const { user, logout } = useAppStore();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-sm sm:text-base">
              REFORMA<span className="text-primary">EM</span>AÇÃO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background border-b">
          <div className="container max-w-screen-xl mx-auto py-10 md:py-14 px-4 md:px-8 text-center">
            <h1
              className="text-3xl md:text-4xl font-bold font-heading text-foreground uppercase tracking-tight"
              data-testid="text-home-title"
            >
              Bem-vindo ao REFORMA
              <span className="text-primary">EM</span>AÇÃO
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-base md:text-lg">
              Escolha por onde deseja começar. Cada ferramenta funciona de forma
              independente para ajudar sua empresa na transição tributária.
            </p>
          </div>
        </div>

        <div className="container max-w-screen-xl mx-auto py-8 md:py-12 px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {mainPaths.map((path) => (
              <Card
                key={path.id}
                className={`group cursor-pointer border-l-4 ${path.borderColor} shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden`}
                onClick={() => navigate(path.href)}
                data-testid={`card-path-${path.id}`}
              >
                <CardContent className={`p-0`}>
                  <div
                    className={`bg-gradient-to-r ${path.color} p-6 md:p-8 h-full flex flex-col`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`p-3 rounded-xl bg-white/80 shadow-sm shrink-0`}
                      >
                        <path.icon className={`h-7 w-7 ${path.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground tracking-tight">
                          {path.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 flex-1">
                      {path.description}
                    </p>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        className="gap-2 font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                        data-testid={`button-path-${path.id}`}
                      >
                        {path.cta}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-screen-2xl px-4 md:px-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Uma ferramenta de simulação e orientação. As informações não
            substituem consultoria tributária e jurídica especializada.
          </p>
        </div>
      </footer>
    </div>
  );
}
