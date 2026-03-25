import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    badgeVariant: "default" as const,
    title: "Diagnóstico e Plano de Ação",
    subtitle: "Jornada completa · 7 módulos · Relatório PDF",
    description:
      "Responda perguntas estruturadas sobre o seu negócio e receba um diagnóstico personalizado por eixo de risco, com plano de ação priorizado e relatório final para exportação.",
    deliverables: [
      { icon: BarChart3, text: "Diagnóstico em 5 eixos: Fiscal, Compras, Comercial, Financeiro e Governança" },
      { icon: CheckSquare, text: "Plano de ação com fontes e grau de confiabilidade por item" },
      { icon: FileText, text: "Relatório completo com grau de precisão e exportação em PDF" },
    ],
    href: "/plano-de-acao",
    cta: "Iniciar Diagnóstico",
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    borderColor: "border-l-blue-500",
    icon: ClipboardList,
    featured: true,
  },
  {
    id: "simulador-financeiro",
    badge: "Simulação Quantitativa",
    badgeVariant: "secondary" as const,
    title: "Simulador de Impacto Financeiro",
    subtitle: "IBS · CBS · Transição 2026–2033",
    description:
      "Projete o impacto do IBS e da CBS no faturamento da sua empresa com base nas alíquotas de transição previstas para o período de 2026 a 2033.",
    deliverables: [
      { icon: TrendingDown, text: "Comparação da carga tributária antes e depois da reforma" },
      { icon: BarChart3, text: "Projeção por ano de transição com alíquotas progressivas" },
      { icon: Calculator, text: "Estimativa de impacto no fluxo de caixa e margem operacional" },
    ],
    href: "/simulador-financeiro",
    cta: "Simular Impacto",
    color: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    borderColor: "border-l-emerald-500",
    icon: Calculator,
    featured: false,
  },
  {
    id: "simples",
    badge: "Análise de Regime",
    badgeVariant: "secondary" as const,
    title: "Simulador Simples Nacional",
    subtitle: "Permanência vs. migração de regime",
    description:
      "Compare a tributação pelo Simples Nacional com o regime IBS/CBS durante o período de transição e estime qual caminho tende a ser mais vantajoso para o seu perfil.",
    deliverables: [
      { icon: Scale, text: "Comparação entre Simples Nacional e regime padrão IBS/CBS" },
      { icon: BarChart3, text: "Projeção de carga por faixa de faturamento e atividade" },
      { icon: AlertTriangle, text: "Alerta sobre pontos críticos na decisão de migração" },
    ],
    href: "/simulador-simples",
    cta: "Comparar Regimes",
    color: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    borderColor: "border-l-amber-500",
    icon: Scale,
    featured: false,
  },
  {
    id: "o-que-muda",
    badge: "Em preparação",
    badgeVariant: "outline" as const,
    title: "O Que Muda?",
    subtitle: "EC 132/2023 · LC 214/2025 · LC 227/2026",
    description:
      "Painel educativo com os principais pontos da reforma tributária: IBS, CBS, IS, Split Payment e cronograma de transição — para diferentes perfis e setores.",
    deliverables: [
      { icon: BookOpen, text: "Resumo das principais mudanças por tipo de tributo" },
      { icon: Users, text: "Impactos por setor e regime tributário" },
      { icon: CheckSquare, text: "Cronograma de implantação e pontos de atenção" },
    ],
    href: "/o-que-muda",
    cta: "Em breve",
    color: "from-violet-500/10 to-violet-600/5",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-50",
    borderColor: "border-l-violet-300",
    icon: BookOpen,
    featured: false,
    disabled: true,
  },
];

export default function HomePage() {
  const { user, logout } = useAppStore();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-sm">
              REFORMA<span className="text-primary">EM</span>AÇÃO
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="gap-1.5 text-muted-foreground h-8 text-xs"
              data-testid="button-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background border-b">
          <div className="container max-w-screen-xl mx-auto py-10 md:py-14 px-4 md:px-8 text-center">
            <h1
              className="text-3xl md:text-4xl font-bold font-heading text-foreground uppercase tracking-tight mb-2"
              data-testid="text-home-title"
            >
              REFORMA<span className="text-primary">EM</span>AÇÃO
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-base md:text-lg">
              A plataforma para preparar sua empresa para o IBS, CBS e IS.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground">EC 132/2023</Badge>
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground">LC 214/2025</Badge>
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground">LC 227/2026</Badge>
            </div>
          </div>
        </div>

        <div className="container max-w-screen-xl mx-auto py-8 md:py-10 px-4 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`group rounded-xl border-l-4 ${tool.borderColor} border border-border bg-gradient-to-br ${tool.color} shadow-sm transition-all duration-200 ${
                  tool.disabled
                    ? "opacity-60 cursor-default"
                    : "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                } ${tool.featured ? "ring-1 ring-blue-500/20" : ""}`}
                onClick={() => !tool.disabled && navigate(tool.href)}
                data-testid={`card-path-${tool.id}`}
              >
                <div className="p-5 md:p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl ${tool.iconBg} shadow-sm shrink-0`}>
                      <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                    </div>
                    <Badge
                      variant={tool.badgeVariant}
                      className="text-[10px] uppercase tracking-wider shrink-0 mt-1"
                    >
                      {tool.badge}
                    </Badge>
                  </div>

                  <h2 className="text-lg md:text-xl font-bold font-heading text-foreground tracking-tight leading-snug mb-0.5">
                    {tool.title}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-mono mb-3">{tool.subtitle}</p>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  <ul className="space-y-2 mb-5 flex-1">
                    {tool.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <d.icon className={`h-3.5 w-3.5 ${tool.iconColor} shrink-0 mt-0.5`} />
                        <span className="text-xs text-foreground/70 leading-snug">{d.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant={tool.featured ? "default" : "outline"}
                      disabled={tool.disabled}
                      className={`gap-2 text-sm font-semibold ${
                        !tool.featured && !tool.disabled
                          ? "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                          : ""
                      }`}
                      data-testid={`button-path-${tool.id}`}
                    >
                      {tool.cta}
                      {!tool.disabled && <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t py-5">
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
