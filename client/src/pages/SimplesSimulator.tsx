import { useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import {
  ArrowRight, ArrowLeft, TrendingDown, AlertTriangle,
  Scale, Building2, Users,
  Briefcase, ShoppingCart, Settings, BarChart3,
  Zap,
  Flame,
  GanttChart,
  ShieldAlert,
  CheckCircle2,
  Info,
  ClipboardCheck,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import CurrencyInput from "@/components/core/CurrencyInput";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SIMPLES_ANEXOS = {
  anexo_i: {
    label: "Anexo I — Comércio",
    faixas: [
      { max: 180000, aliq: 0.04, deducao: 0 },
      { max: 360000, aliq: 0.073, deducao: 5940 },
      { max: 720000, aliq: 0.095, deducao: 13860 },
      { max: 1800000, aliq: 0.107, deducao: 22500 },
      { max: 3600000, aliq: 0.143, deducao: 87300 },
      { max: 4800000, aliq: 0.19, deducao: 378000 },
    ],
  },
  anexo_ii: {
    label: "Anexo II — Indústria",
    faixas: [
      { max: 180000, aliq: 0.045, deducao: 0 },
      { max: 360000, aliq: 0.078, deducao: 5940 },
      { max: 720000, aliq: 0.10, deducao: 13860 },
      { max: 1800000, aliq: 0.112, deducao: 22500 },
      { max: 3600000, aliq: 0.147, deducao: 85500 },
      { max: 4800000, aliq: 0.30, deducao: 720000 },
    ],
  },
  anexo_iii: {
    label: "Anexo III — Serviços (fator R >= 28%)",
    faixas: [
      { max: 180000, aliq: 0.06, deducao: 0 },
      { max: 360000, aliq: 0.112, deducao: 9360 },
      { max: 720000, aliq: 0.135, deducao: 17640 },
      { max: 1800000, aliq: 0.16, deducao: 35640 },
      { max: 3600000, aliq: 0.21, deducao: 125640 },
      { max: 4800000, aliq: 0.33, deducao: 648000 },
    ],
  },
  anexo_iv: {
    label: "Anexo IV — Serviços (construção, vigilância, limpeza)",
    faixas: [
      { max: 180000, aliq: 0.045, deducao: 0 },
      { max: 360000, aliq: 0.09, deducao: 8100 },
      { max: 720000, aliq: 0.102, deducao: 12420 },
      { max: 1800000, aliq: 0.14, deducao: 39780 },
      { max: 3600000, aliq: 0.22, deducao: 183780 },
      { max: 4800000, aliq: 0.33, deducao: 828000 },
    ],
  },
  anexo_v: {
    label: "Anexo V — Serviços (fator R < 28%)",
    faixas: [
      { max: 180000, aliq: 0.155, deducao: 0 },
      { max: 360000, aliq: 0.18, deducao: 4500 },
      { max: 720000, aliq: 0.195, deducao: 9900 },
      { max: 1800000, aliq: 0.205, deducao: 17100 },
      { max: 3600000, aliq: 0.23, deducao: 62100 },
      { max: 4800000, aliq: 0.305, deducao: 540000 },
    ],
  },
};

function calcSimplesRate(revenue12m: number, anexo: keyof typeof SIMPLES_ANEXOS): number {
  const faixas = SIMPLES_ANEXOS[anexo].faixas;
  for (const faixa of faixas) {
    if (revenue12m <= faixa.max) {
      return ((revenue12m * faixa.aliq - faixa.deducao) / revenue12m);
    }
  }
  return faixas[faixas.length - 1].aliq;
}

function calcSimplesIbsCbsShare(anexo: keyof typeof SIMPLES_ANEXOS): number {
  if (anexo === "anexo_i") return 0.34;
  if (anexo === "anexo_ii") return 0.325;
  if (anexo === "anexo_iii") return 0.325;
  if (anexo === "anexo_iv") return 0.225;
  if (anexo === "anexo_v") return 0.325;
  return 0.33;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const numInput = (val: number, set: (v: number) => void, placeholder: string, testId: string, label: string) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <CurrencyInput
      value={val}
      onChange={(v) => set(Number(v))}
      placeholder={placeholder}
      data-testid={testId}
    />
  </div>
);

const formatPercent = (value: number) => (value * 100).toFixed(2) + "%";

const STEPS = [
  { id: 1, title: "Perfil Corporate", icon: Building2, description: "Identificação estrutural e enquadramento de receita." },
  { id: 2, title: "Capital Humano", icon: Users, description: "Análise de folha e viabilidade de Fator R." },
  { id: 3, title: "Revenue Stream", icon: Briefcase, description: "Perfil de clientes e valorização estratégica de crédito." },
  { id: 4, title: "Supply Chain", icon: ShoppingCart, description: "Mapeamento de insumos e potencial de recuperação." },
  { id: 5, title: "Mercado", icon: BarChart3, description: "Pressão competitiva e flexibilidade contratual." },
  { id: 6, title: "Operations", icon: Settings, description: "Capacidade técnica para transição de regime." },
  { id: 7, title: "Intelligence", icon: Scale, description: "Veredito estratégico e análise preditiva." },
];

export default function SimplesSimulator() {
  const { data } = useAppStore();
  const [step, setStep] = useState(1);
  const [started, setStarted] = useState(true);

  const [revenue12m, setRevenue12m] = useState(480000);
  const [revenueMonthly, setRevenueMonthly] = useState(40000);
  const [anexo, setAnexo] = useState<keyof typeof SIMPLES_ANEXOS>("anexo_i");
  const [year, setYear] = useState("2033");

  const [payrollMonthly, setPayrollMonthly] = useState(12000);
  const [proLabore, setProLabore] = useState(5000);
  const [encargos, setEncargos] = useState(35);
  const [sazonalidadeFolha, setSazonalidadeFolha] = useState("estavel");

  const [percB2B, setPercB2B] = useState(60);
  const [percB2C, setPercB2C] = useState(40);
  const [percPJContribuinte, setPercPJContribuinte] = useState(50);
  const [percConsumidorFinal, setPercConsumidorFinal] = useState(50);
  const [sensibilidadePreco, setSensibilidadePreco] = useState("media");
  const [clienteValorizaCredito, setClienteValorizaCredito] = useState("parcialmente");

  const [suppliesMonthly, setSuppliesMonthly] = useState(15000);
  const [suppliesSimplesPercent, setSuppliesSimplesPercent] = useState(30);
  const [percComprasRegular, setPercComprasRegular] = useState(70);
  const [percDespesasCredito, setPercDespesasCredito] = useState(60);
  const [comprasConcentradas, setComprasConcentradas] = useState("nao");

  const [margemBruta, setMargemBruta] = useState(40);
  const [margemLiquida, setMargemLiquida] = useState(15);
  const [contratosLongoPrazo, setContratosLongoPrazo] = useState("nao");
  const [clausulaReajuste, setClausulaReajuste] = useState("nao");
  const [facilidadeRepasse, setFacilidadeRepasse] = useState("media");

  const [clienteComparaPreco, setClienteComparaPreco] = useState("medio");
  const [clienteExigeCredito, setClienteExigeCredito] = useState("parcialmente");
  const [diferencialCompetitivo, setDiferencialCompetitivo] = useState("qualidade");
  const [revisaoContratual, setRevisaoContratual] = useState("parcialmente");

  const [erpAtual, setErpAtual] = useState("basico");
  const [emissaoFiscal, setEmissaoFiscal] = useState("integrada");
  const [notasMensais, setNotasMensais] = useState(50);
  const [atuacaoInterestadual, setAtuacaoInterestadual] = useState("nao");
  const [multiplosEstabelecimentos, setMultiplosEstabelecimentos] = useState("nao");
  const [apoioContabil, setApoioContabil] = useState("nao");

  const valRevenue12m = revenue12m || 0;
  const valRevenueMonthly = revenueMonthly || 0;
  const valPayroll = payrollMonthly || 0;
  const valProLabore = proLabore || 0;
  const valEncargos = (encargos || 0) / 100;
  const valSupplies = suppliesMonthly || 0;
  const valSimplesPercent = (suppliesSimplesPercent || 0) / 100;
  const valPercB2B = (percB2B || 0) / 100;
  const valPercPJContribuinte = (percPJContribuinte || 0) / 100;
  const valPercComprasRegular = (percComprasRegular || 0) / 100;
  const valPercDespesasCredito = (percDespesasCredito || 0) / 100;
  const valMargemBruta = (margemBruta || 0) / 100;
  const valNotasMensais = notasMensais || 0;

  const folhaTotal = valPayroll + valProLabore * (1 + valEncargos);
  const fatorR = valRevenueMonthly > 0 ? folhaTotal / valRevenueMonthly : 0;

  const simplesRate = calcSimplesRate(valRevenue12m, anexo);
  const simplesMonthly = valRevenueMonthly * simplesRate;
  const ibsCbsShareInSimples = calcSimplesIbsCbsShare(anexo);
  const simplesIbsCbsAmount = simplesMonthly * ibsCbsShareInSimples;

  const transitionRates: Record<string, { rate: number; label: string }> = {
    "2026": { rate: 0.01, label: "Transição v.1" },
    "2027": { rate: 0.089, label: "Transição v.2" },
    "2029": { rate: 0.1234, label: "Transição v.4" },
    "2033": { rate: 0.265, label: "Full System" },
  };

  const selectedRate = transitionRates[year] || transitionRates["2033"];
  const regularIbsCbs = selectedRate.rate;
  const regularDebit = valRevenueMonthly * regularIbsCbs;

  const suppliesStandard = valSupplies * (1 - valSimplesPercent);
  const suppliesFromSimples = valSupplies * valSimplesPercent;
  const creditStandard = suppliesStandard * regularIbsCbs;
  const creditSimples = suppliesFromSimples * 0.05;
  const despesasCreditaveis = valRevenueMonthly * (1 - valMargemBruta) * valPercDespesasCredito;
  const creditDespesas = despesasCreditaveis * regularIbsCbs * 0.5;
  const totalCredit = creditStandard + creditSimples + creditDespesas;
  const regularNetTax = Math.max(0, regularDebit - totalCredit);

  const remainingSimplesWithoutIbsCbs = simplesMonthly - simplesIbsCbsAmount;
  const totalIfMigrate = regularNetTax + remainingSimplesWithoutIbsCbs;
  const difference = totalIfMigrate - simplesMonthly;
  const isMigrationBetter = difference < 0;

  const clientCreditIfSimples = simplesIbsCbsAmount;
  const clientCreditIfRegular = valRevenueMonthly * regularIbsCbs;

  const ganhoClientesMigracao = valPercB2B > 0
    ? (clientCreditIfRegular - clientCreditIfSimples) * valPercB2B * valPercPJContribuinte
    : 0;

  let scoreMigracao = 0;
  if (isMigrationBetter) scoreMigracao += 3;
  if (valPercB2B >= 0.5) scoreMigracao += 2;
  if (valPercPJContribuinte >= 0.5) scoreMigracao += 1;
  if (clienteValorizaCredito === "sim") scoreMigracao += 2;
  if (clienteValorizaCredito === "parcialmente") scoreMigracao += 1;
  if (valPercComprasRegular >= 0.6) scoreMigracao += 1;
  if (valPercDespesasCredito >= 0.5) scoreMigracao += 1;
  if (valMargemBruta < 0.3) scoreMigracao += 1;
  if (facilidadeRepasse === "alta") scoreMigracao += 1;
  if (apoioContabil === "sim") scoreMigracao += 1;
  if (emissaoFiscal === "integrada") scoreMigracao += 1;
  if (clienteComparaPreco === "alto") scoreMigracao += 2;
  if (clienteComparaPreco === "medio") scoreMigracao += 1;
  if (clienteExigeCredito === "sim") scoreMigracao += 2;
  if (clienteExigeCredito === "parcialmente") scoreMigracao += 1;
  if (diferencialCompetitivo === "preco") scoreMigracao += 1;
  if (revisaoContratual === "sim") scoreMigracao += 1;

  let scorePermanecer = 0;
  if (!isMigrationBetter) scorePermanecer += 3;
  if (valPercB2B < 0.3) scorePermanecer += 2;
  if (sensibilidadePreco === "alta") scorePermanecer += 1;
  if (clienteValorizaCredito === "nao") scorePermanecer += 2;
  if (valPercComprasRegular < 0.4) scorePermanecer += 1;
  if (emissaoFiscal === "manual") scorePermanecer += 1;
  if (apoioContabil === "nao") scorePermanecer += 1;
  if (fatorR >= 0.28 && (anexo === "anexo_iii" || anexo === "anexo_v")) scorePermanecer += 1;
  if (valNotasMensais > 200 && emissaoFiscal === "manual") scorePermanecer += 1;
  if (clienteComparaPreco === "baixo") scorePermanecer += 1;
  if (clienteExigeCredito === "nao") scorePermanecer += 1;
  if (diferencialCompetitivo === "relacionamento" || diferencialCompetitivo === "qualidade") scorePermanecer += 1;
  if (revisaoContratual === "nao") scorePermanecer += 1;

  const diffPercent = simplesMonthly > 0 ? Math.abs(difference) / simplesMonthly : 0;
  const isEquilibrado = diffPercent < 0.05;
  const scoreDiff = Math.abs(scoreMigracao - scorePermanecer);
  const isInconclusivo = isEquilibrado && scoreDiff <= 2;

  type VeredictType = "migrar" | "permanecer" | "equilibrado" | "inconclusivo";
  let veredito: VeredictType = "permanecer";
  if (isInconclusivo) {
    veredito = "inconclusivo";
  } else if (isEquilibrado) {
    veredito = "equilibrado";
  } else if (isMigrationBetter) {
    veredito = "migrar";
  }

  const vereditoConfig = {
    migrar: {
      label: "Tendência favorável a avaliar regime regular para IBS/CBS",
      color: "text-primary",
      bg: "border-primary/30 bg-primary/5",
      icon: TrendingDown,
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
    },
    permanecer: {
      label: "Tendência favorável a permanecer no Simples Nacional",
      color: "text-accent",
      bg: "border-accent/30 bg-accent/5",
      icon: Building2,
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
    },
    equilibrado: {
      label: "Cenário equilibrado — diferença tributária pouco expressiva",
      color: "text-amber-500",
      bg: "border-amber-500/30 bg-amber-500/5",
      icon: Scale,
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-500",
    },
    inconclusivo: {
      label: "Cenário inconclusivo — exige análise aprofundada",
      color: "text-muted-foreground",
      bg: "border-white/10 bg-white/5",
      icon: AlertTriangle,
      iconBg: "bg-white/10",
      iconColor: "text-muted-foreground",
    },
  };
  const vc = vereditoConfig[veredito];

  let confianca: "baixo" | "medio" | "alto" = "medio";
  let confiancaMotivos: string[] = [];

  const totalFactors = scoreMigracao + scorePermanecer;
  if (totalFactors >= 10 && scoreDiff >= 4 && !isEquilibrado) {
    confianca = "alto";
    confiancaMotivos.push("Convergência de fatores quantitativos e qualitativos");
  } else if (isInconclusivo || (isEquilibrado && scoreDiff <= 1)) {
    confianca = "baixo";
    confiancaMotivos.push("Equilíbrio técnico entre as opções");
  } else {
    confianca = "medio";
  }

  const confiancaConfig = {
    baixo: { label: "Baixo", color: "text-destructive", barColor: "bg-destructive", barWidth: "33%" },
    medio: { label: "Médio", color: "text-amber-500", barColor: "bg-amber-500", barWidth: "66%" },
    alto: { label: "Alto", color: "text-primary", barColor: "bg-primary", barWidth: "100%" },
  };
  const cc = confiancaConfig[confianca];

  const goNext = () => setStep((s) => Math.min(7, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const goToStep = (n: number) => {
    if (n <= 7) setStep(n);
  };

  const currentStep = STEPS[step - 1];

  const { complexidadeOperacional, complexidadeLabel } = useMemo(() => {
    let score = 0;
    if (erpAtual === "nenhum") score += 3;
    if (erpAtual === "basico") score += 1;
    if (emissaoFiscal === "manual") score += 2;
    if (notasMensais > 100) score += 1;
    if (atuacaoInterestadual === "sim") score += 1;
    if (multiplosEstabelecimentos === "sim") score += 2;
    
    let label = "Baixa";
    if (score >= 6) label = "Alta";
    else if (score >= 3) label = "Média";
    
    return { complexidadeOperacional: score, complexidadeLabel: label };
  }, [erpAtual, emissaoFiscal, notasMensais, atuacaoInterestadual, multiplosEstabelecimentos]);

  const fatoresInfluencia = useMemo(() => {
    const list = [];
    if (isMigrationBetter) {
      list.push({ 
        titulo: "Economia Tributária Direta", 
        impacto: "favoravel_migrar", 
        peso: "alto", 
        descricao: "A incidência líquida de IBS/CBS na migração é menor que a carga atual do Simples Nacional."
      });
    } else {
      list.push({ 
        titulo: "Simplicidade do Simples", 
        impacto: "favoravel_permanecer", 
        peso: "alto", 
        descricao: "O regime simplificado mantém uma carga tributária menor ou equivalente, com menos obrigações."
      });
    }
    if (valPercB2B >= 0.5 && valPercPJContribuinte >= 0.5) {
      list.push({ 
        titulo: "Potencial de Crédito B2B", 
        impacto: "favoravel_migrar", 
        peso: "alto", 
        descricao: "Seus clientes PJ poderão aproveitar crédito cheio de 26,5%, tornando seu preço mais competitivo."
      });
    }
    return list;
  }, [isMigrationBetter, valPercB2B, valPercPJContribuinte]);

  const pontosAtencao = useMemo(() => {
    const list = [];
    if (emissaoFiscal === "manual" && notasMensais > 50) {
      list.push({
        titulo: "Processo de Emissão",
        severidade: "media",
        descricao: "O regime regular exige integração via sistema (ERP) para suportar o volume de cálculos do IBS/CBS."
      });
    }
    if (complexidadeOperacional >= 5) {
      list.push({
        titulo: "Gesto de Custos",
        severidade: "alta",
        descricao: "A migração exigirá um controle de créditos rigoroso, exigindo nova estrutura contábil e de sistemas."
      });
    }
    return list;
  }, [emissaoFiscal, notasMensais, complexidadeOperacional]);

  const reviewItems = useMemo(() => [
    { label: "Anexo", value: SIMPLES_ANEXOS[anexo].label },
    { label: "Faturamento 12m", value: formatCurrency(valRevenue12m) },
    { label: "Faturamento Mensal", value: formatCurrency(valRevenueMonthly) },
    { label: "B2B", value: `${percB2B}%` }
  ], [anexo, valRevenue12m, valRevenueMonthly, percB2B]);

  return (
    <MainLayout>
      <div className="relative border-b border-white/5 px-6 py-12 md:py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-30%,rgba(var(--primary-rgb),0.1),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 mb-2">
            Simulador de Regimes
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground dark:text-white uppercase tracking-tighter italic flex items-center justify-center gap-4">
            <Scale className="h-10 w-10 text-primary not-italic" />
            Simulador <span className="text-primary not-italic">Simples</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest leading-relaxed max-w-2xl mx-auto opacity-70">
            Análise comparativa entre migrar o IBS/CBS ou permanecer no Simples Nacional.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto py-6 px-4 md:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium">Etapa {step} de 7</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 7) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2" data-testid="progress-bar">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
          <div className="hidden md:flex mt-3 gap-1">
            {STEPS.map((s) => {
              const StepIcon = s.icon;
              const isActive = s.id === step;
              const isComplete = s.id < step;
              return (
                <button
                  key={s.id}
                  onClick={() => goToStep(s.id)}
                  className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : isComplete
                      ? "text-primary/70 hover:bg-primary/5 cursor-pointer"
                      : "text-muted-foreground/50"
                  }`}
                  data-testid={`step-nav-${s.id}`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  ) : (
                    <StepIcon className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {step < 7 && (
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <currentStep.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg" data-testid="text-step-title">Etapa {step}: {currentStep.title}</CardTitle>
                  <CardDescription className="text-sm mt-0.5">{currentStep.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Anexo do Simples Nacional
                    </Label>
                    <Select value={anexo} onValueChange={(val) => setAnexo(val as keyof typeof SIMPLES_ANEXOS)} data-testid="select-anexo">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(SIMPLES_ANEXOS).map(([key, val]) => (
                          <SelectItem key={key} value={key}>{val.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {numInput(revenue12m, setRevenue12m, "480000", "input-revenue-12m", "Receita Bruta Últimos 12 Meses (RBT12)")}
                  {numInput(revenueMonthly, setRevenueMonthly, "40000", "input-revenue-monthly", "Faturamento Mensal Médio")}
                  <div className="space-y-2">
                    <Label>Ano de Referência da Simulação</Label>
                    <Select value={year} onValueChange={setYear} data-testid="select-year-simples">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2026">2026 — Fase de Teste (1%)</SelectItem>
                        <SelectItem value="2027">2027 — CBS Plena (8,9%)</SelectItem>
                        <SelectItem value="2029">2029 — Transição (12,3%)</SelectItem>
                        <SelectItem value="2033">2033 — Sistema Pleno (26,5%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {numInput(payrollMonthly, setPayrollMonthly, "12000", "input-payroll", "Folha de Pagamento Mensal")}
                  {numInput(proLabore, setProLabore, "5000", "input-prolabore", "Pró-labore Mensal")}
                  {numInput(encargos, setEncargos, "35", "input-encargos", "Encargos sobre Pró-labore (%)")}
                  <div className="space-y-2">
                    <Label>Sazonalidade da Folha</Label>
                    <Select value={sazonalidadeFolha} onValueChange={setSazonalidadeFolha}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estavel">Estável ao longo do ano</SelectItem>
                        <SelectItem value="variavel">Variável (sazonalidade moderada)</SelectItem>
                        <SelectItem value="muito_variavel">Muito variável (sazonalidade forte)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg text-sm space-y-1 border">
                    <p>Folha Total (com pró-labore + encargos): <strong>{formatCurrency(folhaTotal)}</strong></p>
                    <p>Percentual sobre receita: <strong>{valRevenueMonthly > 0 ? (folhaTotal / valRevenueMonthly * 100).toFixed(1) : "0"}%</strong></p>
                    <p className="flex items-center gap-2">
                      Fator R: <strong className="text-lg">{(fatorR * 100).toFixed(1)}%</strong>
                      {fatorR >= 0.28 && <Badge variant="secondary" className="text-sm">Anexo III pode ser aplicável</Badge>}
                    </p>
                    {sazonalidadeFolha !== "estavel" && (
                      <p className="text-sm text-amber-600 mt-2">Folha variável pode alterar o Fator R ao longo do ano, impactando o anexo aplicável.</p>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {numInput(percB2B, setPercB2B, "60", "input-perc-b2b", "Vendas B2B (%)")}
                    {numInput(percB2C, setPercB2C, "40", "input-perc-b2c", "Vendas B2C (%)")}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {numInput(percPJContribuinte, setPercPJContribuinte, "50", "input-perc-pj", "PJ Contribuinte (% do B2B)")}
                      <p className="text-sm text-muted-foreground">Dos clientes B2B, quais são contribuintes e tomam crédito?</p>
                    </div>
                    {numInput(percConsumidorFinal, setPercConsumidorFinal, "50", "input-perc-cf", "Consumidor Final (%)")}
                  </div>
                  <div className="space-y-2">
                    <Label>Sensibilidade do mercado a preço</Label>
                    <Select value={sensibilidadePreco} onValueChange={setSensibilidadePreco}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa — clientes priorizam qualidade/relação</SelectItem>
                        <SelectItem value="media">Média — preço é um fator relevante</SelectItem>
                        <SelectItem value="alta">Alta — preço é o fator decisivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Clientes valorizam aproveitamento de crédito tributário?</Label>
                    <Select value={clienteValorizaCredito} onValueChange={setClienteValorizaCredito}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim — é critério de negociação</SelectItem>
                        <SelectItem value="parcialmente">Parcialmente — importa para alguns</SelectItem>
                        <SelectItem value="nao">Não — não influencia a compra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  {numInput(suppliesMonthly, setSuppliesMonthly, "15000", "input-supplies", "Compras/Insumos Mensais Totais")}
                  <div className="grid grid-cols-2 gap-4">
                    {numInput(suppliesSimplesPercent, setSuppliesSimplesPercent, "30", "input-simples-percent", "Fornecedores Simples (%)")}
                    {numInput(percComprasRegular, setPercComprasRegular, "70", "input-compras-regular", "Fornecedores Regulares (%)")}
                  </div>
                  <div className="space-y-2">
                    {numInput(percDespesasCredito, setPercDespesasCredito, "60", "input-desp-credito", "Despesas com potencial de crédito (%)")}
                    <p className="text-sm text-muted-foreground">Energia, aluguel PJ, softwares, serviços B2B, frete — despesas que geram crédito de IBS/CBS.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Compras concentradas em poucos fornecedores?</Label>
                    <Select value={comprasConcentradas} onValueChange={setComprasConcentradas}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim — poucos fornecedores principais</SelectItem>
                        <SelectItem value="nao">Não — fornecedores diversificados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {numInput(margemBruta, setMargemBruta, "40", "input-margem-bruta", "Margem Bruta (%)")}
                    {numInput(margemLiquida, setMargemLiquida, "15", "input-margem-liquida", "Margem Líquida (%)")}
                  </div>
                  <div className="space-y-2">
                    <Label>Contratos de longo prazo?</Label>
                    <Select value={contratosLongoPrazo} onValueChange={setContratosLongoPrazo}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim — tenho contratos plurianuais</SelectItem>
                        <SelectItem value="nao">Não — vendas avulsas ou contratos curtos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {contratosLongoPrazo === "sim" && (
                    <div className="space-y-2">
                      <Label>Cláusula de reajuste tributário nos contratos?</Label>
                      <Select value={clausulaReajuste} onValueChange={setClausulaReajuste}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim — prevista em contrato</SelectItem>
                          <SelectItem value="nao">Não — sem previsão contratual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Facilidade de repasse de preço ao cliente</Label>
                    <Select value={facilidadeRepasse} onValueChange={setFacilidadeRepasse}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa — difícil repassar custos</SelectItem>
                        <SelectItem value="media">Média — repasse parcial possível</SelectItem>
                        <SelectItem value="alta">Alta — repasse direto ao cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-2 pt-4 border-t">
                    <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Posicionamento Competitivo
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Seu cliente costuma comparar seu preço com concorrentes?</Label>
                    <Select value={clienteComparaPreco} onValueChange={setClienteComparaPreco}>
                      <SelectTrigger data-testid="select-compara-preco"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixo">Raramente — relacionamento pesa mais</SelectItem>
                        <SelectItem value="medio">Às vezes — compara quando há renovação</SelectItem>
                        <SelectItem value="alto">Sempre — cotação com vários fornecedores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>O cliente costuma exigir aproveitamento de crédito tributário?</Label>
                    <Select value={clienteExigeCredito} onValueChange={setClienteExigeCredito}>
                      <SelectTrigger data-testid="select-exige-credito"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim — é requisito para fechar negócio</SelectItem>
                        <SelectItem value="parcialmente">Parcialmente — alguns clientes pedem</SelectItem>
                        <SelectItem value="nao">Não — nunca foi mencionado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Qual o principal diferencial da sua empresa no mercado?</Label>
                    <Select value={diferencialCompetitivo} onValueChange={setDiferencialCompetitivo}>
                      <SelectTrigger data-testid="select-diferencial"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preco">Preço — somos os mais competitivos</SelectItem>
                        <SelectItem value="qualidade">Qualidade — entregamos produto/serviço superior</SelectItem>
                        <SelectItem value="prazo">Prazo — agilidade na entrega</SelectItem>
                        <SelectItem value="relacionamento">Relacionamento — confiança e atendimento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Seus contratos permitem revisão de preço por mudança tributária?</Label>
                    <Select value={revisaoContratual} onValueChange={setRevisaoContratual}>
                      <SelectTrigger data-testid="select-revisao-contratual"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim — cláusulas preveem reajuste tributário</SelectItem>
                        <SelectItem value="parcialmente">Em parte — só alguns contratos</SelectItem>
                        <SelectItem value="nao">Não — nenhum contrato prevê isso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 6 && (
                <>
                  <div className="space-y-2">
                    <Label>ERP / Sistema de Gestão</Label>
                    <Select value={erpAtual} onValueChange={setErpAtual}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nenhum">Nenhum — controle manual</SelectItem>
                        <SelectItem value="basico">Básico — planilhas ou sistema simples</SelectItem>
                        <SelectItem value="intermediario">Intermediário — ERP com módulo fiscal</SelectItem>
                        <SelectItem value="avancado">Avançado — ERP completo e integrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Emissão fiscal</Label>
                    <Select value={emissaoFiscal} onValueChange={setEmissaoFiscal}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual — nota a nota pelo portal</SelectItem>
                        <SelectItem value="integrada">Integrada — via sistema/ERP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {numInput(notasMensais, setNotasMensais, "50", "input-notas-mensais", "Notas fiscais emitidas por mês")}
                  <div className="space-y-2">
                    <Label>Atuação interestadual?</Label>
                    <Select value={atuacaoInterestadual} onValueChange={setAtuacaoInterestadual}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim — vendas para outros estados</SelectItem>
                        <SelectItem value="nao">Não — atuação local/estadual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Múltiplos estabelecimentos (filiais)?</Label>
                    <Select value={multiplosEstabelecimentos} onValueChange={setMultiplosEstabelecimentos}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Apoio contábil especializado em reforma tributária?</Label>
                    <Select value={apoioContabil} onValueChange={setApoioContabil}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim — contador acompanha a reforma</SelectItem>
                        <SelectItem value="nao">Não — contador ainda não se aprofundou</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg text-sm border">
                    <p>Complexidade operacional estimada: <strong className={complexidadeOperacional >= 5 ? "text-red-600" : complexidadeOperacional >= 3 ? "text-amber-600" : "text-green-600"}>{complexidadeLabel}</strong></p>
                    {complexidadeOperacional >= 5 && (
                      <p className="text-sm text-amber-600 mt-1">Migrar para o regime regular exigirá investimento em sistemas e processos.</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {step === 7 && (
          <div className="space-y-6">

            <Card className={`shadow-md border-2 ${vc.bg}`} data-testid="card-verdict">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-sm uppercase tracking-wider font-medium">Conclusão Preliminar</Badge>
                </div>
                <div className="flex items-start gap-4 mt-3">
                  <div className="p-2.5 rounded-lg bg-white/60 shrink-0">
                    <vc.icon className={`h-7 w-7 ${vc.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-xl font-bold ${vc.color}`} data-testid="text-verdict">{vc.label}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Diferença mensal estimada: <strong>{formatCurrency(Math.abs(difference))}</strong> ·
                      Diferença anual estimada: <strong>{formatCurrency(Math.abs(difference) * 12)}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-muted/30 dark:bg-card/50 rounded-lg border" data-testid="confidence-index">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">Índice de Confiança</span>
                    <Badge variant="outline" className={`${cc.color} font-bold`}>{cc.label}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 mb-3">
                    <div className={`${cc.barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: cc.barWidth }} />
                  </div>
                  <div className="space-y-1">
                    {confiancaMotivos.map((m, i) => (
                      <p key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                        <Info className="h-3 w-3 mt-0.5 shrink-0" />
                        {m}
                      </p>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-4 italic">
                  Esta análise é indicativa e não constitui recomendação tributária. A decisão sobre regime deve ser validada por profissional contábil qualificado.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm" data-testid="card-fatores">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Principais Fatores que Influenciaram o Resultado
                </CardTitle>
                <CardDescription className="text-sm">Cada fator foi avaliado com base nos dados que você informou nas etapas anteriores.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fatoresInfluencia.map((f, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${
                      f.impacto === "favoravel_migrar" ? "bg-green-50/50 border-green-200 dark:bg-green-950/30 dark:border-green-900/50" :
                      f.impacto === "favoravel_permanecer" ? "bg-blue-50/50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50" :
                      "bg-muted/20 border-muted"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold">{f.titulo}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-sm ${
                            f.peso === "alto" ? "border-primary text-primary" :
                            f.peso === "medio" ? "border-muted-foreground/50" :
                            "border-muted-foreground/30 text-muted-foreground"
                          }`}>
                            Peso {f.peso}
                          </Badge>
                          <Badge className={`text-sm ${
                            f.impacto === "favoravel_migrar" ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/60" :
                            f.impacto === "favoravel_permanecer" ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/60" :
                            "bg-muted text-muted-foreground hover:bg-muted"
                          }`}>
                            {f.impacto === "favoravel_migrar" ? "Favorece migração" :
                             f.impacto === "favoravel_permanecer" ? "Favorece Simples" :
                             "Neutro"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{f.descricao}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-amber-200" data-testid="card-atencao">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Pontos de Atenção
                </CardTitle>
                <CardDescription className="text-sm">Aspectos que merecem cuidado antes de tomar qualquer decisão.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pontosAtencao.map((p, i) => (
                    <div key={i} className={`p-3 rounded-lg border flex items-start gap-3 ${
                      p.severidade === "alta" ? "bg-red-50/50 border-red-200 dark:bg-red-950/30 dark:border-red-900/50" :
                      p.severidade === "media" ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50" :
                      "bg-blue-50/50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50"
                    }`}>
                      <div className="shrink-0 mt-0.5">
                        {p.severidade === "alta" ? <ShieldAlert className="h-4 w-4 text-red-600" /> :
                         p.severidade === "media" ? <AlertTriangle className="h-4 w-4 text-amber-600" /> :
                         <Info className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{p.titulo}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{p.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="comparativo" className="space-y-4">
              <TabsList className="bg-secondary w-full justify-start">
                <TabsTrigger value="comparativo">Detalhamento Numérico</TabsTrigger>
                <TabsTrigger value="clientes">Impacto nos Clientes</TabsTrigger>
              </TabsList>

              <TabsContent value="comparativo" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-200 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Opção A: Permanecer no Simples (DAS)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Alíquota Efetiva Estimada</p>
                        <p className="text-2xl font-bold font-mono" data-testid="text-simples-rate">{formatPercent(simplesRate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Imposto Mensal Estimado (DAS)</p>
                        <p className="text-xl font-bold font-mono text-blue-700 dark:text-blue-400" data-testid="text-simples-total">{formatCurrency(simplesMonthly)}</p>
                      </div>
                      <div className="text-sm space-y-1 bg-blue-100/50 dark:bg-blue-900/40 rounded p-2">
                        <p>Parcela IBS/CBS no DAS: <strong className="dark:text-white/90">{formatCurrency(simplesIbsCbsAmount)}</strong></p>
                        <p>Outros tributos no DAS: <strong className="dark:text-white/90">{formatCurrency(remainingSimplesWithoutIbsCbs)}</strong></p>
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 rounded p-2">
                        <strong className="dark:text-white/90">Crédito estimado para seu cliente:</strong> {formatCurrency(clientCreditIfSimples)}/mês
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-2 ${isMigrationBetter ? "border-green-200 bg-green-50/30 dark:border-green-900/50 dark:bg-green-950/20" : "border-amber-200 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-950/20"}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm font-bold flex items-center gap-2 ${isMigrationBetter ? "text-green-800 dark:text-green-300" : "text-amber-800 dark:text-amber-300"}`}>
                        <Scale className="h-4 w-4" />
                        Opção B: IBS/CBS Regular (Fora do DAS)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Alíquota IBS/CBS Estimada em {year}</p>
                        <p className="text-2xl font-bold font-mono" data-testid="text-regular-rate">{formatPercent(regularIbsCbs)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Débito Estimado sobre Faturamento</p>
                        <p className="text-lg font-bold font-mono">{formatCurrency(regularDebit)}</p>
                      </div>
                      <div className="text-sm space-y-1 bg-green-100/50 dark:bg-green-900/30 rounded p-2">
                        <p>(-) Créditos Forn. Regulares: <strong className="text-green-700 dark:text-green-400">{formatCurrency(creditStandard)}</strong></p>
                        <p>(-) Créditos Forn. Simples: <strong className="text-green-700 dark:text-green-400">{formatCurrency(creditSimples)}</strong></p>
                        <p>(-) Créditos Desp. Creditáveis: <strong className="text-green-700 dark:text-green-400">{formatCurrency(creditDespesas)}</strong></p>
                        <p className="border-t dark:border-white/10 pt-1 mt-1">= IBS/CBS Líquido Estimado: <strong className="dark:text-white/90">{formatCurrency(regularNetTax)}</strong></p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">+ Demais tributos (IRPJ, CSLL, CPP) via DAS</p>
                        <p className="text-sm font-bold font-mono">{formatCurrency(remainingSimplesWithoutIbsCbs)}</p>
                      </div>
                      <div className={`text-sm font-bold p-2 rounded ${isMigrationBetter ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"}`}>
                        Total Mensal Estimado: <span className="text-lg" data-testid="text-migrate-total">{formatCurrency(totalIfMigrate)}</span>
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 rounded p-2">
                        <strong className="dark:text-white/90">Crédito estimado para seu cliente:</strong> {formatCurrency(clientCreditIfRegular)}/mês
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="clientes" className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-5 w-5 text-primary" />
                      Impacto Estimado nos Seus Clientes (B2B)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 dark:bg-card/50 rounded-lg space-y-2">
                        <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400">Você no Simples (DAS)</h4>
                        <p className="text-sm">Crédito estimado: <strong className="dark:text-white/90">{formatCurrency(clientCreditIfSimples)}/mês</strong></p>
                        <p className="text-sm text-muted-foreground">Alíquota efetiva: {formatPercent(simplesRate)}</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg space-y-2 border border-green-200 dark:border-green-900/50">
                        <h4 className="text-sm font-bold text-green-700 dark:text-green-400">Você no Regime Regular</h4>
                        <p className="text-sm">Crédito estimado: <strong className="dark:text-white/90">{formatCurrency(clientCreditIfRegular)}/mês</strong></p>
                        <p className="text-sm text-muted-foreground">Alíquota plena: {formatPercent(regularIbsCbs)}</p>
                      </div>
                    </div>

                    {valPercB2B > 0 && (
                      <div className="p-4 border dark:border-white/5 rounded-lg space-y-3">
                        <h4 className="text-sm font-bold">Análise pelo seu perfil comercial</h4>
                        <div className="grid gap-2 text-sm">
                          <p>Vendas B2B: <strong>{percB2B}%</strong> ({formatCurrency(valRevenueMonthly * valPercB2B)}/mês)</p>
                          <p>PJ contribuintes: <strong>{percPJContribuinte}%</strong> do B2B</p>
                          <p>Ganho estimado de crédito se migrar: <strong className="text-green-700 dark:text-green-400">{formatCurrency(ganhoClientesMigracao)}/mês</strong></p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="shadow-sm border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Dados Utilizados na Análise</CardTitle>
                    <CardDescription className="text-sm">Clique em qualquer etapa acima para corrigir um valor.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="review-summary">
                  {reviewItems.map((item, i) => (
                    <div key={i} className="p-2.5 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-bold mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50">
              <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-500" />
              <AlertTitle className="text-red-800 dark:text-red-400 text-sm">Lembrete: Decisão Irretratável</AlertTitle>
              <AlertDescription className="text-sm text-red-700 dark:text-red-300">
                A opção pelo recolhimento de IBS/CBS fora do DAS é irretratável para o ano-calendário inteiro (LC 214/2025).
                Esta simulação é uma ferramenta de apoio — consulte seu contador antes de formalizar qualquer opção.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t mt-6">
          {step === 1 ? (
            <Link href="/inicio">
              <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-home">
                <ArrowLeft className="h-5 w-5" />
                Voltar ao Início
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="lg" className="gap-2" onClick={goBack} data-testid="button-prev-step">
              <ArrowLeft className="h-5 w-5" />
              Etapa Anterior
            </Button>
          )}
          {step < 6 && (
            <Button size="lg" className="gap-2" onClick={goNext} data-testid="button-next-step">
              Próxima Etapa
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
          {step === 6 && (
            <Button size="lg" className="gap-2 bg-primary" onClick={goNext} data-testid="button-view-result">
              <Eye className="h-5 w-5" />
              Ver Resultado
            </Button>
          )}
          {step === 7 && (
            <Link href="/inicio">
              <Button variant="outline" size="lg" className="gap-2" data-testid="button-finish">
                Voltar ao Início
              </Button>
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
