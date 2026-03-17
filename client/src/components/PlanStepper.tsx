import { Link, useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";

const PLAN_STEPS = [
  {
    number: 1,
    path: "/plano-de-acao/visao-executiva",
    title: "Visão Executiva",
    shortTitle: "Visão",
    description: "Panorama da reforma e impacto no seu negócio",
    reportRole: "Contexto do relatório",
  },
  {
    number: 2,
    path: "/plano-de-acao/diagnostico",
    title: "Diagnóstico de Risco",
    shortTitle: "Risco",
    description: "Identifique vulnerabilidades operacionais",
    reportRole: "Score de risco",
  },
  {
    number: 3,
    path: "/plano-de-acao/sistemas",
    title: "Sistemas e Cadastros",
    shortTitle: "Sistemas",
    description: "Prepare ERP, NF-e e padrão de dados",
    reportRole: "Prontidão tecnológica",
  },
  {
    number: 4,
    path: "/plano-de-acao/fornecedores",
    title: "Fornecedores",
    shortTitle: "Fornec.",
    description: "Audite e classifique sua cadeia de suprimentos",
    reportRole: "Mapa de créditos",
  },
  {
    number: 5,
    path: "/plano-de-acao/precificacao",
    title: "Precificação",
    shortTitle: "Preços",
    description: "Adapte preços ao novo modelo tributário",
    reportRole: "Estratégia de preços",
  },
  {
    number: 6,
    path: "/plano-de-acao/rotinas",
    title: "Rotinas Semanais",
    shortTitle: "Rotinas",
    description: "Estabeleça controles semanais de qualidade",
    reportRole: "Checklist operacional",
  },
  {
    number: 7,
    path: "/plano-de-acao/cronograma",
    title: "Cronograma",
    shortTitle: "Crono.",
    description: "Planeje a implementação em 51 dias",
    reportRole: "Roadmap executivo",
  },
  {
    number: 8,
    path: "/plano-de-acao/checklist",
    title: "Revisão Final",
    shortTitle: "Revisão",
    description: "Valide a preparação e gere o relatório",
    reportRole: "Relatório PDF",
  },
];

interface PlanStepperProps {
  currentStep: number;
}

export default function PlanStepper({ currentStep }: PlanStepperProps) {
  const [location] = useLocation();

  return (
    <div className="bg-card border-b" data-testid="plan-stepper">
      <div className="container max-w-screen-2xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Jornada do Plano de Ação
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            Etapa <span className="text-primary font-bold">{currentStep}</span> de {PLAN_STEPS.length}
          </p>
        </div>

        <div className="w-full bg-secondary rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(currentStep / PLAN_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="hidden md:grid grid-cols-8 gap-1">
          {PLAN_STEPS.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <Link key={step.number} href={step.path}>
                <div
                  className={`group flex flex-col items-center text-center p-2 rounded-lg cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-primary/10 ring-1 ring-primary/30"
                      : isCompleted
                      ? "hover:bg-muted/50"
                      : "hover:bg-muted/30 opacity-60"
                  }`}
                  data-testid={`stepper-step-${step.number}`}
                >
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold mb-1.5 transition-colors ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-[10px] leading-tight font-medium ${
                      isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.shortTitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
              {currentStep}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground truncate">
                {PLAN_STEPS[currentStep - 1]?.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {PLAN_STEPS[currentStep - 1]?.description}
              </p>
            </div>
          </div>
          <div className="flex gap-1 mt-3">
            {PLAN_STEPS.map((step) => (
              <Link key={step.number} href={step.path} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    step.number < currentStep
                      ? "bg-green-400"
                      : step.number === currentStep
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary shrink-0" />
          <p className="text-[10px] text-muted-foreground">
            <span className="font-medium">Para o relatório final:</span>{" "}
            {PLAN_STEPS[currentStep - 1]?.reportRole}
          </p>
        </div>
      </div>
    </div>
  );
}

export { PLAN_STEPS };