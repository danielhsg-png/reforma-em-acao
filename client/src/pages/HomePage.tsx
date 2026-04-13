import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import AppLogo from "@/components/AppLogo";
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
  TrendingDown,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  {
    id: "plano",
    badge: "Estratégico",
    title: "Diagnóstico e Plano de Ação",
    subtitle: "Jornada 7 Módulos · Relatório Executivo",
    description: "Análise multidimensional de prontidão fiscal, comercial e de governança com plano de ação priorizado.",
    deliverables: [
      { icon: BarChart3, text: "Diagnóstico em 5 eixos críticos" },
      { icon: CheckSquare, text: "Plano de ação com base legal" },
      { icon: FileText, text: "Relatório executivo em PDF" },
    ],
    href: "/plano-de-acao",
    cta: "Iniciar Jornada",
    icon: ClipboardList,
    featured: true,
    colorCls: "border-primary/20",
    iconCls: "text-primary bg-primary/10",
  },
  {
    id: "simulador-financeiro",
    badge: "Quantitativo",
    title: "Simulador de Impacto Financeiro",
    subtitle: "IBS · CBS · Projeção 2033",
    description: "Projete o impacto tributário direto no faturamento e margem operacional durante a transição.",
    deliverables: [
      { icon: TrendingDown, text: "Comparação de carga ANTES x DEPOIS" },
      { icon: BarChart3, text: "Projeção progressiva de alíquotas" },
      { icon: Calculator, text: "Estimativa de impacto no caixa" },
    ],
    href: "/simulador-financeiro",
    cta: "Simular Impacto",
    icon: Calculator,
    featured: false,
    colorCls: "border-accent/20",
    iconCls: "text-accent bg-accent/10",
  },
  {
    id: "simples",
    badge: "Análise de Regime",
    title: "Simulador Simples Nacional",
    subtitle: "Permanência vs. Migração",
    description: "Avaliação técnica sobre a vantagem de permanência no Simples vs. migração para o regime padrão.",
    deliverables: [
      { icon: Scale, text: "Comparativo de regimes híbridos" },
      { icon: BarChart3, text: "Projeção por faixa de faturamento" },
      { icon: Zap, text: "Alertas de pontos críticos de decisão" },
    ],
    href: "/simulador-simples",
    cta: "Avaliar Regime",
    icon: Scale,
    featured: false,
    colorCls: "border-blue-500/20",
    iconCls: "text-blue-400 bg-blue-500/10",
  },
  {
    id: "o-que-muda",
    badge: "Base Legal",
    title: "O Que Muda?",
    subtitle: "Linguagem Direta · Base Normativa",
    description: "Conhecimento estruturado sobre as mudanças por tema, setor e cronograma oficial.",
    deliverables: [
      { icon: BookOpen, text: "Resumo das principais mudanças" },
      { icon: Users, text: "Impactos por setor de atividade" },
      { icon: ShieldCheck, text: "Cronograma e pontos de atenção" },
    ],
    href: "/o-que-muda",
    cta: "Explorar Base",
    icon: BookOpen,
    featured: false,
    colorCls: "border-emerald-500/20",
    iconCls: "text-emerald-400 bg-emerald-500/10",
  },
];

export default function HomePage() {
  const [, navigate] = useLocation();

  return (
    <MainLayout>
      <div className="flex flex-col min-h-[calc(100vh-64px)] pb-12">
        {/* Premium Hero Section */}
        <section className="relative pt-16 pb-12 border-b border-white/5 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(245,158,11,0.1),transparent_70%)] pointer-events-none" />
          
          <div className="container max-w-screen-xl mx-auto px-6 md:px-8 flex flex-col items-center text-center space-y-8 relative z-10">
            <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
              <AppLogo className="w-auto h-20 md:h-24 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]" />
            </div>
            
            <div className="space-y-4 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Plataforma Oficial de Prontidão</span>
              </div>
              <p className="text-muted-foreground text-sm uppercase tracking-widest leading-relaxed font-medium">
                Estratégia, Cálculo e Conformidade para a Reforma Tributária.
                Ferramentas integradas para guiar sua empresa na transição 2026—2033.
              </p>
            </div>
          </div>
        </section>

        {/* Command Center Grid */}
        <section className="container max-w-screen-xl mx-auto py-12 md:py-16 px-6 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool, idx) => (
              <div
                key={tool.id}
                data-testid={`card-path-${tool.id}`}
                className={cn(
                  "glass-card group p-8 border rounded-2xl relative overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-700",
                  tool.colorCls
                )}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none" />
                
                <div className="flex flex-col h-full relative z-10">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500", tool.iconCls)}>
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-border dark:border-white/10 bg-muted dark:bg-white/5 text-muted-foreground">
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-2 mb-6">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-foreground dark:text-white transition-colors group-hover:text-primary">
                      {tool.title}
                    </h2>
                    <p className="text-sm font-bold text-primary/70 uppercase tracking-widest font-mono">
                      {tool.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-foreground/70 leading-relaxed mb-8 flex-1">
                    {tool.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="grid gap-3 mb-10">
                    {tool.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{d.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(tool.href)}
                    data-testid={`button-path-${tool.id}`}
                    className={cn(
                      "w-full h-14 flex items-center justify-between px-6 rounded-xl font-black uppercase tracking-[0.2em] text-sm transition-all",
                      tool.featured 
                        ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:opacity-90"
                        : "bg-muted dark:bg-white/5 border border-border dark:border-white/10 text-foreground dark:text-white hover:bg-neutral-200 dark:hover:bg-white/10 hover:border-primary/40 dark:hover:border-primary/40"
                    )}
                  >
                    <span>{tool.cta}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Trust Section */}
        <section className="container max-w-screen-xl mx-auto px-6 md:px-8 pt-4">
          <div className="glass-card p-6 border-border dark:border-white/5 bg-background/50 dark:bg-white/[0.02] rounded-xl flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm uppercase font-bold tracking-widest text-muted-foreground leading-relaxed">
              Sistema atualizado conforme a Lei Complementar nº 214/2025 e cronograma da EC 132/2023. 
              As ferramentas oferecem orientação estratégica baseada em padrões técnicos de conformidade.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
