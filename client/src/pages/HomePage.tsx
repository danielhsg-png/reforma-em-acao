import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import AppLogo from "@/components/AppLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  UserCircle,
} from "lucide-react";

function getInitials(name: string | null, email: string): string {
  if (name && name.trim()) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

const tools = [
  {
    id: "plano",
    badge: "Ferramenta Principal",
    title: "Diagnóstico e Plano de Ação",
    subtitle: "Jornada completa · 7 módulos · Relatório PDF",
    description: "Responda perguntas estruturadas sobre o seu negócio e receba um diagnóstico personalizado por eixo de prontidão, com plano de ação priorizado e relatório final para exportação.",
    deliverables: [
      { icon: BarChart3, text: "Diagnóstico em 5 eixos: Fiscal, Compras, Comercial, Financeiro e Governança" },
      { icon: CheckSquare, text: "Plano de ação com fontes e grau de confiabilidade por item" },
      { icon: FileText, text: "Relatório completo com grau de precisão e exportação em PDF" },
    ],
    href: "/plano-de-acao",
    cta: "ABRIR",
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
    cta: "ABRIR",
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
    cta: "ABRIR",
    icon: Scale,
    featured: false,
    disabled: false,
  },
  {
    id: "o-que-muda",
    badge: "Disponível",
    title: "O Que Muda?",
    subtitle: "EC 132/2023 · LC 214/2025 · LC 227/2026",
    description: "Base de conhecimento da Reforma Tributária — busque por tema, setor ou produto",
    deliverables: [
      { icon: BookOpen, text: "Resumo das principais mudanças por tipo de tributo" },
      { icon: Users, text: "Impactos por setor e regime tributário" },
      { icon: CheckSquare, text: "Cronograma de implantação e pontos de atenção" },
    ],
    href: "/o-que-muda",
    cta: "ABRIR",
    icon: BookOpen,
    featured: false,
    disabled: false,
  },
];

export default function HomePage() {
  const { user, logout } = useAppStore();
  const [, navigate] = useLocation();
  const initials = getInitials(user?.name ?? null, user?.email ?? "");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[hsl(218,74%,16%)]/95 backdrop-blur text-white">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-[#F57C00]" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-sm text-white">
              REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
            </span>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-8 w-8 rounded-full bg-[#F57C00] flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#F57C00]/50"
                  data-testid="button-avatar"
                  aria-label="Menu do usuário"
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="pb-1">
                  {user?.name && (
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  )}
                  <p className={`text-xs text-muted-foreground truncate ${user?.name ? "" : "font-semibold text-foreground"}`}>
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/perfil")}
                  className="gap-2 cursor-pointer"
                  data-testid="menu-item-profile"
                >
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="gap-2 cursor-pointer text-muted-foreground"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="border-b border-border/50">
          <div className="container max-w-screen-xl mx-auto py-10 md:py-14 px-4 md:px-8 flex justify-center">
            <div data-testid="text-home-title">
              <AppLogo className="w-auto h-12 md:h-16" />
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
                    : "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 border-[#F57C00]/40 bg-card ring-1 ring-[#F57C00]/20"
                }`}
                onClick={() => !tool.disabled && navigate(tool.href)}
                data-testid={`card-path-${tool.id}`}
              >
                <div className="p-5 md:p-6 flex flex-col h-full">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-2.5 rounded-xl shrink-0 bg-[#F57C00]/20">
                      <tool.icon className="h-5 w-5 text-[#F57C00]" />
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold shrink-0 mt-1 px-2 py-0.5 rounded-md border ${
                      tool.disabled
                        ? "text-muted-foreground border-border/30"
                        : "text-[#F57C00] border-[#F57C00]/30 bg-[#F57C00]/10"
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
                        <d.icon className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#F57C00]/70" />
                        <span className="text-xs text-muted-foreground leading-snug">{d.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex justify-end">
                    <button
                      disabled={tool.disabled}
                      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                        tool.disabled
                          ? "text-muted-foreground border border-border/30 cursor-default"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      data-testid={`button-path-${tool.id}`}
                    >
                      {tool.cta}
                      {!tool.disabled && <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
                    </button>
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
