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
    icon: ClipboardList,
    featured: true,
    disabled: false,
  },
  {
    id: "simulador-financeiro",
    badge: "Simulação Quantitativa",
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
    icon: Calculator,
    featured: false,
    disabled: false,
  },
  {
    id: "simples",
    badge: "Análise de Regime",
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
    icon: Scale,
    featured: false,
    disabled: false,
  },
  {
    id: "o-que-muda",
    badge: "Em preparação",
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
    icon: BookOpen,
    featured: false,
    disabled: true,
  },
];

export default function HomePage() {
  const { user, logout } = useAppStore();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <div className="bg-[#0B2149]/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-[#0B2149]" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-sm text-[#0B2149]">
              REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#4B5563] hidden sm:inline">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="gap-1.5 text-[#4B5563] h-8 text-xs hover:text-[#0B2149]"
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
        <div className="bg-gradient-to-b from-[#0B2149]/5 to-white border-b border-[#E5E7EB]">
          <div className="container max-w-screen-xl mx-auto py-10 md:py-14 px-4 md:px-8 text-center">
            <h1
              className="text-3xl md:text-4xl font-bold font-heading text-[#0B2149] uppercase tracking-tight mb-2"
              data-testid="text-home-title"
            >
              REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
            </h1>
            <p className="text-[#4B5563] mt-2 max-w-xl mx-auto text-base md:text-lg">
              A plataforma para preparar sua empresa para o IBS, CBS e IS.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {["EC 132/2023", "LC 214/2025", "LC 227/2026"].map((law) => (
                <span
                  key={law}
                  className="text-[11px] font-mono text-[#4B5563] border border-[#E5E7EB] rounded-md px-2.5 py-1"
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
                className={`group rounded-xl border border-[#E5E7EB] border-l-4 shadow-sm transition-all duration-200 ${
                  tool.disabled
                    ? "opacity-50 cursor-default border-l-[#E5E7EB] bg-[#F9FAFB]"
                    : tool.featured
                    ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 border-l-[#0B2149] bg-gradient-to-br from-[#0B2149]/[0.04] to-white ring-1 ring-[#0B2149]/10"
                    : "cursor-pointer hover:shadow-md hover:-translate-y-0.5 border-l-[#0B2149]/40 bg-white"
                }`}
                onClick={() => !tool.disabled && navigate(tool.href)}
                data-testid={`card-path-${tool.id}`}
              >
                <div className="p-5 md:p-6 flex flex-col h-full">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`p-2.5 rounded-xl shadow-sm shrink-0 ${
                        tool.disabled
                          ? "bg-[#F3F4F6]"
                          : tool.featured
                          ? "bg-[#0B2149]/10"
                          : "bg-[#0B2149]/5"
                      }`}
                    >
                      <tool.icon
                        className={`h-5 w-5 ${
                          tool.disabled ? "text-[#9CA3AF]" : "text-[#0B2149]"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold shrink-0 mt-1 px-2 py-0.5 rounded-md border ${
                        tool.disabled
                          ? "text-[#9CA3AF] border-[#E5E7EB] bg-transparent"
                          : tool.featured
                          ? "text-white bg-[#0B2149] border-[#0B2149]"
                          : "text-[#0B2149] border-[#0B2149]/20 bg-[#0B2149]/5"
                      }`}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title + Subtitle */}
                  <h2 className={`text-lg md:text-xl font-bold font-heading tracking-tight leading-snug mb-0.5 ${tool.disabled ? "text-[#9CA3AF]" : "text-[#0B2149]"}`}>
                    {tool.title}
                  </h2>
                  <p className="text-[11px] text-[#4B5563] font-mono mb-3">{tool.subtitle}</p>

                  {/* Description */}
                  <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Deliverables */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {tool.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <d.icon
                          className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                            tool.disabled ? "text-[#D1D5DB]" : "text-[#0B2149]/50"
                          }`}
                        />
                        <span className="text-xs text-[#4B5563] leading-snug">{d.text}</span>
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
                            ? "text-[#D1D5DB] border-[#E5E7EB] cursor-default"
                            : "text-[#0B2149] border-[#0B2149]/30 hover:bg-[#0B2149] hover:text-white hover:border-[#0B2149]"
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
      <footer className="border-t border-[#E5E7EB] py-5">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#4B5563] text-center md:text-left max-w-lg">
            Ferramenta de orientação e simulação. As informações não substituem consultoria tributária e jurídica especializada. Base normativa: EC 132/2023, LC 214/2025 e LC 227/2026.
          </p>
          <span className="text-xs text-[#0B2149]/40 font-mono shrink-0">REFORMA EM AÇÃO</span>
        </div>
      </footer>
    </div>
  );
}
