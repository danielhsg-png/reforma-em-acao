import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import {
  ClipboardList,
  Calculator,
  Scale,
  BookOpen,
  ArrowRight,
  FileText,
  BarChart3,
  CheckSquare,
  AlertTriangle,
  TrendingDown,
  Users,
  Lock,
} from "lucide-react";

const tools = [
  {
    id: "plano",
    badge: "Ferramenta Principal",
    title: "Diagnóstico e Plano de Ação",
    subtitle: "Jornada completa · 7 módulos · Relatório PDF",
    description:
      "Responda perguntas estruturadas sobre o seu negócio e receba um diagnóstico personalizado por eixo de prontidão, com plano de ação priorizado e relatório final para exportação.",
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
    description:
      "Projete o impacto do IBS e da CBS no faturamento da sua empresa com base nas alíquotas de transição previstas para o período de 2026 a 2033.",
    deliverables: [
      { icon: TrendingDown, text: "Comparação da carga tributária antes e depois da reforma" },
      { icon: BarChart3, text: "Projeção por ano de transição com alíquotas progressivas" },
      { icon: Calculator, text: "Estimativa de impacto no fluxo de caixa e margem operacional" },
    ],
    href: "/simulador-financeiro",
    cta: "EM BREVE",
    icon: Calculator,
    featured: false,
    disabled: true,
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
    cta: "EM BREVE",
    icon: Scale,
    featured: false,
    disabled: true,
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
  const [, navigate] = useLocation();

  return (
    <MainLayout>
      {/* Hero */}
      <div className="border-b border-border/50">
        <div className="container mx-auto max-w-screen-xl py-10 md:py-14 px-4 md:px-8 flex justify-center">
          <div data-testid="text-home-title">
            <img
              src="/logo-png-color.png"
              alt="Reforma em Ação"
              className="w-auto h-14 md:h-20 block dark:hidden select-none"
              draggable={false}
            />
            <img
              src="/logo-png-branca.png"
              alt="Reforma em Ação"
              className="w-auto h-14 md:h-20 hidden dark:block select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="container max-w-screen-xl mx-auto py-8 md:py-10 px-4 md:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group rounded-xl border border-[#F57C00]/40 bg-card ring-1 ring-[#F57C00]/20 transition-all duration-200"
              data-testid={`card-path-${tool.id}`}
            >
              <div className="p-5 md:p-6 flex flex-col h-full">
                {/* Icon + Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-2.5 rounded-xl shrink-0 bg-[#F57C00]/20">
                    <tool.icon className="h-5 w-5 text-[#F57C00]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold shrink-0 mt-1 px-2 py-0.5 rounded-md border text-[#F57C00] border-[#F57C00]/30 bg-[#F57C00]/10">
                    {tool.badge}
                  </span>
                </div>

                {/* Title + Subtitle */}
                <h2 className="text-lg md:text-xl font-bold font-heading tracking-tight leading-snug mb-0.5 text-foreground">
                  {tool.title}
                </h2>
                <p className="text-[11px] text-muted-foreground font-mono mb-3">{tool.subtitle}</p>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>

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
                    onClick={() => !tool.disabled && navigate(tool.href)}
                    className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                      tool.disabled
                        ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    data-testid={`button-path-${tool.id}`}
                    aria-disabled={tool.disabled}
                    title={tool.disabled ? "Disponível em breve" : undefined}
                  >
                    {tool.disabled && <Lock className="h-3.5 w-3.5" />}
                    {tool.cta}
                    {!tool.disabled && (
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
