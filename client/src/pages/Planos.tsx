import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

const benefits = [
  "Diagnósticos ilimitados para seus clientes",
  "Plano de ação completo personalizado",
  "PDF com sua marca (white-label)",
  "Exportação ilimitada",
  'Acesso completo à base "O Que Muda?"',
  "Suporte por e-mail",
  "Cancele quando quiser",
];

export default function Planos() {
  const { user } = useAppStore();
  const isAnnual = user?.plan === "annual";
  const isMonthlyActive = user?.plan === "monthly" && user?.subscriptionStatus === "active";
  const hasActiveSubscription = isAnnual || isMonthlyActive;

  const [, setLocation] = useLocation();
  const handleSubscribe = (planType: "monthly" | "annual") => {
    setLocation(`/checkout?plan=${planType}`);
  };

  return (
    <MainLayout>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">

        {/* Bloco 1 — Cabeçalho */}
        <div className="text-center mb-10">
          <h1
            className="font-bold font-heading text-3xl md:text-4xl tracking-tight"
            data-testid="text-planos-title"
          >
            Escolha seu plano
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-3">
            Diagnósticos ilimitados para todos os seus clientes da contabilidade
          </p>
        </div>

        {/* Bloco 2 — Banner legado */}
        {hasActiveSubscription && (
          <Card
            className="bg-green-50 border-2 border-green-200 mb-8 max-w-4xl mx-auto"
            data-testid="banner-legacy-annual"
          >
            <CardContent className="p-6 md:p-8 flex items-start gap-4">
              <Sparkles className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-green-900 text-lg">
                  {isAnnual ? "Você já tem acesso ilimitado vitalício à plataforma" : "Você já tem uma assinatura ativa"}
                </p>
                <p className="text-green-700 text-sm mt-1">
                  {isAnnual
                    ? "Obrigado por confiar no Reforma em Ação desde o início. Você não precisa assinar — todas as funcionalidades estão liberadas para sua conta."
                    : "Sua assinatura mensal está ativa e todas as funcionalidades estão liberadas para sua conta."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bloco 3 — Grid de planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* Card 1 — Mensal */}
          <Card className="flex flex-col" data-testid="card-plan-monthly">
            <CardContent className="p-6 flex flex-col h-full gap-6">
              <div>
                <p className="uppercase tracking-wider text-sm font-bold text-muted-foreground mb-3">
                  Mensal
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">R$</span>
                  <span className="text-5xl font-bold leading-none">147</span>
                  <span className="text-base text-muted-foreground mb-1">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Cobrança recorrente no cartão de crédito
                </p>
              </div>

              <div className="h-px bg-border" />

              <ul className="space-y-3 flex-1">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{b}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={hasActiveSubscription ? undefined : () => handleSubscribe("monthly")}
                disabled={hasActiveSubscription}
                data-testid="button-subscribe-monthly"
                className={`w-full h-12 font-bold uppercase tracking-wider rounded-lg transition-colors text-sm ${
                  hasActiveSubscription
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-[#F57C00] hover:bg-[#E67100] text-white"
                }`}
              >
                {hasActiveSubscription ? (isAnnual ? "Você já tem acesso" : "Assinatura ativa") : "Assinar mensal"}
              </button>
            </CardContent>
          </Card>

          {/* Card 2 — Anual (destacado) */}
          <div className="relative" data-testid="card-plan-annual">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-[#F57C00] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                Mais escolhido
              </span>
            </div>
            <Card className="border-2 border-[#F57C00] flex flex-col h-full">
              <CardContent className="p-6 flex flex-col h-full gap-6">
                <div>
                  <p className="uppercase tracking-wider text-sm font-bold text-muted-foreground mb-3">
                    Anual
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold">R$</span>
                    <span className="text-5xl font-bold leading-none">97</span>
                    <span className="text-base text-muted-foreground mb-1">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">ou R$ 1.164 à vista</p>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded px-2 py-1 mt-2">
                    Economia de R$ 600/ano
                  </span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pague em até 12x sem juros no cartão de crédito
                  </p>
                </div>

                <div className="h-px bg-border" />

                <ul className="space-y-3 flex-1">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={hasActiveSubscription ? undefined : () => handleSubscribe("annual")}
                  disabled={hasActiveSubscription}
                  data-testid="button-subscribe-annual"
                  className={`w-full h-12 font-bold uppercase tracking-wider rounded-lg transition-colors text-sm ${
                    hasActiveSubscription
                      ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                      : "bg-[#F57C00] hover:bg-[#E67100] text-white"
                  }`}
                >
                  {hasActiveSubscription ? (isAnnual ? "Você já tem acesso" : "Assinatura ativa") : "Assinar anual"}
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bloco 4 — Rodapé */}
        <div className="mt-12 text-center text-sm text-muted-foreground max-w-3xl mx-auto space-y-2">
          <p>
            Ao assinar, você concorda com os{" "}
            <a href="#" className="underline cursor-pointer hover:text-foreground transition-colors">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="underline cursor-pointer hover:text-foreground transition-colors">
              Política de Privacidade
            </a>
            .
          </p>
          <p className="text-xs italic">
            Ferramenta de orientação e simulação. Não substitui consultoria tributária especializada.
          </p>
        </div>

      </div>
    </MainLayout>
  );
}
