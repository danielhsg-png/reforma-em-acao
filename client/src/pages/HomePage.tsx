import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import {
  Building2,
  ClipboardList,
  Calculator,
  Scale,
  BookOpen,
  ArrowRight,
  LogOut,
  FileText,
  BarChart3,
  CheckSquare,
  AlertTriangle,
  TrendingDown,
  Users,
} from "lucide-react";

const tools = [
  {
    id: "plano",
    badge: "Ferramenta Principal",
    title: "Diagnóstico e Plano de Ação",
    subtitle: "Jornada completa · 7 módulos · Relatório PDF",
    description: "Responda perguntas estruturadas sobre o seu negócio e receba um diagnóstico personalizado por eixo de risco, com plano de ação priorizado e relatório final para exportação.",
    deliverables: [
      { icon: BarChart3, text: "Diagnóstico em 5 eixos: Fiscal, Compras, Comercial, Financeiro e Governança" },
      { icon: CheckSquare, text: "Plano de ação com fontes e grau de confiabilidade por item" },
      { icon: FileText, text: "Relatório completo com grau de precisão e exportação em PDF" },
    ],
    href: "/plano-de-acao",
    cta: "Iniciar Diagnóstico",
    icon: ClipboardList,
    featured: true,
    disabled: false,
  },
  {
    id: "simulador-financeiro",
    badge: "Simulação Quantitativa",
    title: "Simulador de Impacto Financeiro",
    subtitle: "IBS · CBS · Transição 2026–2033",
    description: "Projete o impacto do IBS e da CBS no faturamento da sua empresa com base nas alíquotas de transição previstas para o período de 2026 a 2033.",
    deliverables: [
      { icon: TrendingDown, text: "Comparação da carga tributária antes e depois da reforma" },
      { icon: BarChart3, text: "Projeção por ano de transição com alíquotas progressivas" },
      { icon: Calculator, text: "Estimativa de impacto no fluxo de caixa e margem operacional" },
    ],
    href: "/simulador-financeiro",
    cta: "Simular Impacto",
    icon: Calculator,
    featured: false,
    disabled: false,
  },
  {
    id: "simples",
    badge: "Análise de Regime",
    title: "Simulador Simples Nacional",
    subtitle: "Permanência vs. migração de regime",
    description: "Compare a tributação pelo Simples Nacional com o regime IBS/CBS durante o período de transição e estime qual caminho tende a ser mais vantajoso para o seu perfil.",
    deliverables: [
      { icon: Scale, text: "Comparação entre Simples Nacional e regime padrão IBS/CBS" },
      { icon: BarChart3, text: "Projeção de carga por faixa de faturamento e atividade" },
      { icon: AlertTriangle, text: "Alerta sobre pontos críticos na decisão de migração" },
    ],
    href: "/simulador-simples",
    cta: "Comparar Regimes",
    icon: Scale,
    featured: false,
    disabled: false,
  },
  {
    id: "o-que-muda",
    badge: "Em preparação",
    title: "O Que Muda?",
    subtitle: "EC 132/2023 · LC 214/2025 · LC 227/2026",
    description: "Painel educativo com os principais pontos da reforma tributária: IBS, CBS, IS, Split Payment e cronograma de transição — para diferentes perfis e setores.",
    deliverables: [
      { icon: BookOpen, text: "Resumo das principais mudanças por tipo de tributo" },
      { icon: Users, text: "Impactos por setor e regime tributário" },
      { icon: CheckSquare, text: "Cronograma de implantação e pontos de atenção" },
    ],
    href: "/o-que-muda",
    cta: "Em breve",
    icon: BookOpen,
    featured: false,
    disabled: true,
  },
];

export default function HomePage() {
  const { user, logout } = useAppStore();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/20 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-sm text-foreground">
              REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="gap-1.5 text-muted-foreground h-8 text-xs hover:text-foreground"
              data-testid="button-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="border-b border-border/50">
          <div className="container max-w-screen-xl mx-auto py-12 md:py-16 px-4 md:px-8 text-center">
            <h1
              className="text-3xl md:text-4xl font-bold font-heading uppercase tracking-tight mb-3"
              data-testid="text-home-title"
            >
              REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-base md:text-lg">
              A plataforma para preparar sua empresa para o IBS, CBS e IS.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {["EC 132/2023", "LC 214/2025", "LC 227/2026"].map((law) => (
                <span
                  key={law}
                  className="text-[11px] font-mono text-muted-foreground border border-border rounded-md px-2.5 py-1"
                >
                  {law}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="container max-w-screen-xl mx-auto py-8 md:py-10 px-4 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`group rounded-xl border transition-all duration-200 ${
                  tool.disabled
                    ? "opacity-40 cursor-default border-border/30 bg-card"
                    : tool.featured
                    ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 border-[#F57C00]/40 bg-card ring-1 ring-[#F57C00]/20"
                    : "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 border-border bg-card hover:border-border/80"
                }`}
                onClick={() => !tool.disabled && navigate(tool.href)}
                data-testid={`card-path-${tool.id}`}
              >
                <div className="p-5 md:p-6 flex flex-col h-full">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${tool.featured ? "bg-[#F57C00]/20" : "bg-primary/10"}`}>
                      <tool.icon className={`h-5 w-5 ${tool.featured ? "text-[#F57C00]" : "text-primary"}`} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold shrink-0 mt-1 px-2 py-0.5 rounded-md border ${
                      tool.disabled
                        ? "text-muted-foreground border-border/30"
                        : tool.featured
                        ? "text-[#F57C00] border-[#F57C00]/30 bg-[#F57C00]/10"
                        : "text-muted-foreground border-border"
                    }`}>
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title + Subtitle */}
                  <h2 className="text-lg md:text-xl font-bold font-heading tracking-tight leading-snug mb-0.5 text-foreground">
                    {tool.title}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-mono mb-3">{tool.subtitle}</p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Deliverables */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {tool.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <d.icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${tool.featured ? "text-[#F57C00]/70" : "text-primary/60"}`} />
                        <span className="text-xs text-muted-foreground leading-snug">{d.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex justify-end">
                    {tool.featured && !tool.disabled ? (
                      <button
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-[#F57C00] text-white hover:bg-[#E56A00] transition-colors"
                        data-testid={`button-path-${tool.id}`}
                      >
                        {tool.cta}
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ) : (
                      <button
                        disabled={tool.disabled}
                        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-colors ${
                          tool.disabled
                            ? "text-muted-foreground border-border/30 cursor-default"
                            : "text-foreground border-border hover:bg-[#F57C00] hover:text-white hover:border-[#F57C00]"
                        }`}
                        data-testid={`button-path-${tool.id}`}
                      >
                        {tool.cta}
                        {!tool.disabled && <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-5">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center md:text-left max-w-lg">
            Ferramenta de orientação e simulação. As informações não substituem consultoria tributária e jurídica especializada. Base normativa: EC 132/2023, LC 214/2025 e LC 227/2026.
          </p>
          <span className="text-xs text-muted-foreground font-mono shrink-0">REFORMA EM AÇÃO</span>
        </div>
      </footer>
    </div>
  );
}
