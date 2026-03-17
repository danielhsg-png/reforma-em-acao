import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import {
  ArrowRight, ArrowLeft, Calculator, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, Info, Scale, DollarSign, Users, Percent, Building2, ShieldAlert,
  Briefcase, ShoppingCart, Settings, BarChart3, ClipboardCheck, Eye
} from "lucide-react";
import { Link } from "wouter";

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

const formatPercent = (value: number) => (value * 100).toFixed(2) + "%";

const STEPS = [
  { id: 1, title: "Perfil da Empresa", icon: Building2, description: "Identificamos o enquadramento, faturamento e o ano-base da simulação." },
  { id: 2, title: "Folha e Fator R", icon: Users, description: "Avaliamos o peso da folha de pagamento para determinar o Fator R." },
  { id: 3, title: "Perfil Comercial", icon: Briefcase, description: "Entendemos para quem você vende e como o crédito tributário impacta seus clientes." },
  { id: 4, title: "Compras e Créditos", icon: ShoppingCart, description: "Mapeamos suas compras para estimar o potencial de créditos no regime regular." },
  { id: 5, title: "Margem e Contratos", icon: BarChart3, description: "Analisamos sua margem e a flexibilidade para absorver mudanças tributárias." },
  { id: 6, title: "Capacidade Operacional", icon: Settings, description: "Verificamos se sua estrutura atual está preparada para o regime regular." },
  { id: 7, title: "Resultado Preliminar", icon: Scale, description: "Comparativo entre as duas opções, com base nos dados que você informou." },
];

export default function SimplesSimulator() {
  const { data } = useAppStore();
  const [step, setStep] = useState(1);

  const [revenue12m, setRevenue12m] = useState("480000");
  const [revenueMonthly, setRevenueMonthly] = useState("40000");
  const [anexo, setAnexo] = useState<keyof typeof SIMPLES_ANEXOS>("anexo_i");
  const [year, setYear] = useState("2033");

  const [payrollMonthly, setPayrollMonthly] = useState("12000");
  const [proLabore, setProLabore] = useState("5000");
  const [encargos, setEncargos] = useState("35");
  const [sazonalidadeFolha, setSazonalidadeFolha] = useState("estavel");

  const [percB2B, setPercB2B] = useState("60");
  const [percB2C, setPercB2C] = useState("40");
  const [percPJContribuinte, setPercPJContribuinte] = useState("50");
  const [percConsumidorFinal, setPercConsumidorFinal] = useState("50");
  const [sensibilidadePreco, setSensibilidadePreco] = useState("media");
  const [clienteValorizaCredito, setClienteValorizaCredito] = useState("parcialmente");

  const [suppliesMonthly, setSuppliesMonthly] = useState("15000");
  const [suppliesSimplesPercent, setSuppliesSimplesPercent] = useState("30");
  const [percComprasRegular, setPercComprasRegular] = useState("70");
  const [percDespesasCredito, setPercDespesasCredito] = useState("60");
  const [comprasConcentradas, setComprasConcentradas] = useState("nao");

  const [margemBruta, setMargemBruta] = useState("40");
  const [margemLiquida, setMargemLiquida] = useState("15");
  const [contratosLongoPrazo, setContratosLongoPrazo] = useState("nao");
  const [clausulaReajuste, setClausulaReajuste] = useState("nao");
  const [facilidadeRepasse, setFacilidadeRepasse] = useState("media");

  const [erpAtual, setErpAtual] = useState("basico");
  const [emissaoFiscal, setEmissaoFiscal] = useState("integrada");
  const [notasMensais, setNotasMensais] = useState("50");
  const [atuacaoInterestadual, setAtuacaoInterestadual] = useState("nao");
  const [multiplosEstabelecimentos, setMultiplosEstabelecimentos] = useState("nao");
  const [apoioContabil, setApoioContabil] = useState("nao");

  const valRevenue12m = parseFloat(revenue12m) || 0;
  const valRevenueMonthly = parseFloat(revenueMonthly) || 0;
  const valPayroll = parseFloat(payrollMonthly) || 0;
  const valProLabore = parseFloat(proLabore) || 0;
  const valEncargos = (parseFloat(encargos) || 0) / 100;
  const valSupplies = parseFloat(suppliesMonthly) || 0;
  const valSimplesPercent = (parseFloat(suppliesSimplesPercent) || 0) / 100;
  const valPercB2B = (parseFloat(percB2B) || 0) / 100;
  const valPercPJContribuinte = (parseFloat(percPJContribuinte) || 0) / 100;
  const valPercComprasRegular = (parseFloat(percComprasRegular) || 0) / 100;
  const valPercDespesasCredito = (parseFloat(percDespesasCredito) || 0) / 100;
  const valMargemBruta = (parseFloat(margemBruta) || 0) / 100;
  const valMargemLiquida = (parseFloat(margemLiquida) || 0) / 100;
  const valNotasMensais = parseFloat(notasMensais) || 0;

  const folhaTotal = valPayroll + valProLabore * (1 + valEncargos);
  const fatorR = valRevenueMonthly > 0 ? folhaTotal / valRevenueMonthly : 0;

  const simplesRate = calcSimplesRate(valRevenue12m, anexo);
  const simplesMonthly = valRevenueMonthly * simplesRate;
  const ibsCbsShareInSimples = calcSimplesIbsCbsShare(anexo);
  const simplesIbsCbsAmount = simplesMonthly * ibsCbsShareInSimples;

  const transitionRates: Record<string, { rate: number; label: string }> = {
    "2026": { rate: 0.01, label: "Fase de Teste (CBS 0,9% + IBS 0,1%)" },
    "2027": { rate: 0.089, label: "CBS Plena + IBS 0,1%" },
    "2029": { rate: 0.1234, label: "IBS em transição" },
    "2033": { rate: 0.265, label: "Sistema Pleno (CBS 8,8% + IBS 17,7%)" },
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
  const clientCreditDifference = clientCreditIfRegular - clientCreditIfSimples;

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

  const complexidadeOperacional = (
    (emissaoFiscal === "manual" ? 2 : 0) +
    (atuacaoInterestadual === "sim" ? 1 : 0) +
    (multiplosEstabelecimentos === "sim" ? 1 : 0) +
    (apoioContabil === "nao" ? 2 : 0) +
    (erpAtual === "nenhum" ? 2 : erpAtual === "basico" ? 1 : 0) +
    (valNotasMensais > 200 ? 1 : 0)
  );
  const complexidadeLabel = complexidadeOperacional >= 5 ? "Alta" : complexidadeOperacional >= 3 ? "Média" : "Baixa";

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
      color: "text-green-800",
      bg: "bg-green-50 border-green-300",
      icon: TrendingDown,
      iconColor: "text-green-600",
    },
    permanecer: {
      label: "Tendência favorável a permanecer no Simples Nacional",
      color: "text-blue-800",
      bg: "bg-blue-50 border-blue-300",
      icon: Building2,
      iconColor: "text-blue-600",
    },
    equilibrado: {
      label: "Cenário equilibrado — diferença tributária pouco expressiva",
      color: "text-amber-800",
      bg: "bg-amber-50 border-amber-300",
      icon: Scale,
      iconColor: "text-amber-600",
    },
    inconclusivo: {
      label: "Cenário inconclusivo — exige análise aprofundada",
      color: "text-gray-800",
      bg: "bg-gray-50 border-gray-300",
      icon: AlertTriangle,
      iconColor: "text-gray-600",
    },
  };
  const vc = vereditoConfig[veredito];

  let confianca: "baixo" | "medio" | "alto" = "medio";
  let confiancaMotivos: string[] = [];

  const totalFactors = scoreMigracao + scorePermanecer;
  if (totalFactors >= 10 && scoreDiff >= 4 && !isEquilibrado) {
    confianca = "alto";
    confiancaMotivos.push("Vários fatores convergem na mesma direção");
    if (!isEquilibrado) confiancaMotivos.push("Diferença tributária expressiva");
  } else if (isInconclusivo || (isEquilibrado && scoreDiff <= 1)) {
    confianca = "baixo";
    confiancaMotivos.push("Diferença tributária pouco significativa");
    if (scoreDiff <= 2) confiancaMotivos.push("Fatores qualitativos divididos");
  } else {
    confianca = "medio";
    if (isEquilibrado) confiancaMotivos.push("Economia tributária marginal");
    if (scoreDiff <= 3) confiancaMotivos.push("Fatores qualitativos sem tendência forte");
  }

  if (sazonalidadeFolha !== "estavel") confiancaMotivos.push("Folha sazonal pode alterar o Fator R");
  if (year !== "2033") confiancaMotivos.push("Alíquotas de transição ainda sujeitas a regulamentação");

  const confiancaConfig = {
    baixo: { label: "Baixo", color: "text-red-700", bg: "bg-red-50", barColor: "bg-red-400", barWidth: "33%" },
    medio: { label: "Médio", color: "text-amber-700", bg: "bg-amber-50", barColor: "bg-amber-400", barWidth: "66%" },
    alto: { label: "Alto", color: "text-green-700", bg: "bg-green-50", barColor: "bg-green-500", barWidth: "100%" },
  };
  const cc = confiancaConfig[confianca];

  type Fator = { titulo: string; descricao: string; impacto: "favoravel_migrar" | "favoravel_permanecer" | "neutro"; peso: "alto" | "medio" | "baixo" };
  const fatoresInfluencia: Fator[] = [];

  if (fatorR >= 0.28) {
    fatoresInfluencia.push({ titulo: "Folha e Fator R", descricao: `Fator R de ${(fatorR * 100).toFixed(1)}% (≥ 28%) — possibilita enquadramento no Anexo III, com alíquota mais baixa no Simples.`, impacto: "favoravel_permanecer", peso: "alto" });
  } else if (fatorR < 0.15) {
    fatoresInfluencia.push({ titulo: "Folha e Fator R", descricao: `Fator R de ${(fatorR * 100).toFixed(1)}% — folha baixa reduz o benefício do Simples para serviços (Anexo V).`, impacto: "favoravel_migrar", peso: "medio" });
  } else {
    fatoresInfluencia.push({ titulo: "Folha e Fator R", descricao: `Fator R de ${(fatorR * 100).toFixed(1)}% — impacto moderado no enquadramento.`, impacto: "neutro", peso: "baixo" });
  }

  if (valPercB2B >= 0.6 && clienteValorizaCredito !== "nao") {
    fatoresInfluencia.push({ titulo: "Perfil B2B e Crédito", descricao: `${percB2B}% das vendas são B2B e seus clientes valorizam crédito tributário. No regime regular, o crédito para o cliente seria integral.`, impacto: "favoravel_migrar", peso: "alto" });
  } else if (valPercB2B < 0.3) {
    fatoresInfluencia.push({ titulo: "Perfil B2C dominante", descricao: `${percB2C}% das vendas são para consumidor final. Crédito tributário não é fator relevante para esses clientes.`, impacto: "favoravel_permanecer", peso: "alto" });
  } else {
    fatoresInfluencia.push({ titulo: "Perfil Comercial Misto", descricao: `Mix de ${percB2B}% B2B e ${percB2C}% B2C. O impacto do crédito é parcial.`, impacto: "neutro", peso: "medio" });
  }

  if (valPercComprasRegular >= 0.6 && valPercDespesasCredito >= 0.5) {
    fatoresInfluencia.push({ titulo: "Potencial de Crédito", descricao: `${percComprasRegular}% das compras são de fornecedores regulares e ${percDespesasCredito}% das despesas têm potencial de crédito. Base de créditos favorável à migração.`, impacto: "favoravel_migrar", peso: "alto" });
  } else if (valPercComprasRegular < 0.4) {
    fatoresInfluencia.push({ titulo: "Potencial de Crédito Limitado", descricao: `Apenas ${percComprasRegular}% das compras vêm de fornecedores regulares. Créditos no regime regular seriam reduzidos.`, impacto: "favoravel_permanecer", peso: "medio" });
  } else {
    fatoresInfluencia.push({ titulo: "Potencial de Crédito Moderado", descricao: `Base de créditos com potencial parcial (${percComprasRegular}% forn. regulares, ${percDespesasCredito}% desp. creditáveis).`, impacto: "neutro", peso: "baixo" });
  }

  if (sensibilidadePreco === "alta" && clienteValorizaCredito === "sim") {
    fatoresInfluencia.push({ titulo: "Pressão Competitiva", descricao: "Mercado sensível a preço e clientes que valorizam crédito — migrar pode ser um diferencial competitivo.", impacto: "favoravel_migrar", peso: "alto" });
  } else if (sensibilidadePreco === "baixa") {
    fatoresInfluencia.push({ titulo: "Pressão Competitiva", descricao: "Mercado menos sensível a preço — simplicidade do Simples pode valer mais que a economia tributária.", impacto: "favoravel_permanecer", peso: "baixo" });
  } else {
    fatoresInfluencia.push({ titulo: "Pressão Competitiva", descricao: "Sensibilidade moderada do mercado — fator de peso intermediário.", impacto: "neutro", peso: "baixo" });
  }

  if (valMargemBruta < 0.25) {
    fatoresInfluencia.push({ titulo: "Margem", descricao: `Margem bruta de ${margemBruta}% — margens estreitas tornam qualquer variação tributária mais impactante.`, impacto: "favoravel_migrar", peso: "medio" });
  } else if (valMargemBruta > 0.5) {
    fatoresInfluencia.push({ titulo: "Margem", descricao: `Margem bruta de ${margemBruta}% — margem confortável absorve bem a carga tributária do Simples.`, impacto: "favoravel_permanecer", peso: "baixo" });
  } else {
    fatoresInfluencia.push({ titulo: "Margem", descricao: `Margem bruta de ${margemBruta}% — nível intermediário, sem peso forte para nenhuma direção.`, impacto: "neutro", peso: "baixo" });
  }

  if (complexidadeOperacional >= 5) {
    fatoresInfluencia.push({ titulo: "Estrutura Operacional", descricao: "Complexidade operacional alta. Migrar exigiria investimento significativo em sistemas, processos e apoio contábil.", impacto: "favoravel_permanecer", peso: "alto" });
  } else if (complexidadeOperacional <= 2 && apoioContabil === "sim") {
    fatoresInfluencia.push({ titulo: "Estrutura Operacional", descricao: "Estrutura operacional preparada e apoio contábil especializado disponível. Transição seria viável.", impacto: "favoravel_migrar", peso: "medio" });
  } else {
    fatoresInfluencia.push({ titulo: "Estrutura Operacional", descricao: `Complexidade ${complexidadeLabel.toLowerCase()}. Transição possível com ajustes pontuais.`, impacto: "neutro", peso: "baixo" });
  }

  type PontoAtencao = { titulo: string; descricao: string; severidade: "alta" | "media" | "info" };
  const pontosAtencao: PontoAtencao[] = [];

  pontosAtencao.push({ titulo: "Validação com contador", descricao: "Esta simulação é indicativa. A decisão sobre o regime tributário deve ser validada por um profissional contábil que conheça as particularidades da sua empresa.", severidade: "alta" });

  if (contratosLongoPrazo === "sim" && clausulaReajuste === "nao") {
    pontosAtencao.push({ titulo: "Contratos sem cláusula de reajuste", descricao: "Você possui contratos de longo prazo sem previsão de reajuste tributário. Uma mudança de regime pode comprometer margens em contratos vigentes.", severidade: "alta" });
  }

  if (comprasConcentradas === "sim") {
    pontosAtencao.push({ titulo: "Fornecedores concentrados", descricao: "Compras concentradas em poucos fornecedores. Mudança de regime deles pode afetar significativamente seus créditos.", severidade: "media" });
  }

  if (facilidadeRepasse === "baixa") {
    pontosAtencao.push({ titulo: "Dificuldade de repasse", descricao: "Baixa capacidade de repassar custos ao cliente. Qualquer aumento na carga tributária impacta diretamente a margem.", severidade: "media" });
  }

  if (valPercB2B >= 0.5 && clienteValorizaCredito === "sim" && !isMigrationBetter) {
    pontosAtencao.push({ titulo: "Risco comercial", descricao: "Seus clientes B2B valorizam crédito tributário, mas o cenário numérico favorece permanecer no Simples. Avalie se o diferencial de crédito pode afetar contratos futuros.", severidade: "media" });
  }

  if (atuacaoInterestadual === "sim") {
    pontosAtencao.push({ titulo: "Operação interestadual", descricao: "Vendas interestaduais adicionam complexidade na apuração do IBS. Considere o custo operacional adicional.", severidade: "info" });
  }

  if (apoioContabil === "nao" && veredito === "migrar") {
    pontosAtencao.push({ titulo: "Apoio contábil insuficiente", descricao: "A tendência indica vantagem em migrar, mas seu contador ainda não se aprofundou na reforma. Busque especialização antes de decidir.", severidade: "alta" });
  }

  const numInput = (val: string, set: (v: string) => void, ph: string, tid: string, label?: string) => (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Input value={val} onChange={(e) => set(e.target.value.replace(/[^0-9.]/g, ""))} placeholder={ph} data-testid={tid} />
    </div>
  );

  const currentStep = STEPS[step - 1];

  const goNext = () => setStep((s) => Math.min(7, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const goToStep = (n: number) => {
    if (n <= step || n <= 7) setStep(n);
  };

  const reviewItems = [
    { label: "Anexo", value: SIMPLES_ANEXOS[anexo].label },
    { label: "RBT12", value: formatCurrency(valRevenue12m) },
    { label: "Faturamento Mensal", value: formatCurrency(valRevenueMonthly) },
    { label: "Ano de Referência", value: year },
    { label: "Folha Total (c/ encargos)", value: formatCurrency(folhaTotal) },
    { label: "Fator R", value: (fatorR * 100).toFixed(1) + "%" },
    { label: "Vendas B2B", value: percB2B + "%" },
    { label: "PJ Contribuinte", value: percPJContribuinte + "% do B2B" },
    { label: "Crédito valorizado", value: clienteValorizaCredito === "sim" ? "Sim" : clienteValorizaCredito === "parcialmente" ? "Parcialmente" : "Não" },
    { label: "Compras Mensais", value: formatCurrency(valSupplies) },
    { label: "Forn. Regulares", value: percComprasRegular + "%" },
    { label: "Desp. Creditáveis", value: percDespesasCredito + "%" },
    { label: "Margem Bruta", value: margemBruta + "%" },
    { label: "Repasse de preço", value: facilidadeRepasse === "alta" ? "Fácil" : facilidadeRepasse === "media" ? "Médio" : "Difícil" },
    { label: "Complexidade", value: complexidadeLabel },
    { label: "Apoio Contábil", value: apoioContabil === "sim" ? "Sim" : "Não" },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-xl mx-auto py-6 px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-2 uppercase tracking-tight flex items-center gap-3" data-testid="text-simples-title">
            <Scale className="h-7 w-7 text-primary" />
            Simulador Simples Nacional
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Análise comparativa entre permanecer no Simples (DAS) ou migrar o IBS/CBS para o regime regular.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto py-6 px-4 md:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Etapa {step} de 7</span>
            <span className="text-xs text-muted-foreground">{Math.round((step / 7) * 100)}%</span>
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
                  className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded text-[11px] transition-colors ${
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
                      {fatorR >= 0.28 && <Badge variant="secondary" className="text-[10px]">Anexo III pode ser aplicável</Badge>}
                    </p>
                    {sazonalidadeFolha !== "estavel" && (
                      <p className="text-xs text-amber-600 mt-2">Folha variável pode alterar o Fator R ao longo do ano, impactando o anexo aplicável.</p>
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
                      <p className="text-[10px] text-muted-foreground">Dos clientes B2B, quais são contribuintes e tomam crédito?</p>
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
                    <p className="text-[10px] text-muted-foreground">Energia, aluguel PJ, softwares, serviços B2B, frete — despesas que geram crédito de IBS/CBS.</p>
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
                      <p className="text-xs text-amber-600 mt-1">Migrar para o regime regular exigirá investimento em sistemas e processos.</p>
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
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium">Conclusão Preliminar</Badge>
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

                <div className="mt-5 p-4 bg-white/50 rounded-lg border" data-testid="confidence-index">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">Índice de Confiança</span>
                    <Badge variant="outline" className={`${cc.color} font-bold`}>{cc.label}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 mb-3">
                    <div className={`${cc.barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: cc.barWidth }} />
                  </div>
                  <div className="space-y-1">
                    {confiancaMotivos.map((m, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <Info className="h-3 w-3 mt-0.5 shrink-0" />
                        {m}
                      </p>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground mt-4 italic">
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
                <CardDescription className="text-xs">Cada fator foi avaliado com base nos dados que você informou nas etapas anteriores.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fatoresInfluencia.map((f, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${
                      f.impacto === "favoravel_migrar" ? "bg-green-50/50 border-green-200" :
                      f.impacto === "favoravel_permanecer" ? "bg-blue-50/50 border-blue-200" :
                      "bg-muted/20 border-muted"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold">{f.titulo}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[9px] ${
                            f.peso === "alto" ? "border-primary text-primary" :
                            f.peso === "medio" ? "border-muted-foreground/50" :
                            "border-muted-foreground/30 text-muted-foreground"
                          }`}>
                            Peso {f.peso}
                          </Badge>
                          <Badge className={`text-[9px] ${
                            f.impacto === "favoravel_migrar" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                            f.impacto === "favoravel_permanecer" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                            "bg-muted text-muted-foreground hover:bg-muted"
                          }`}>
                            {f.impacto === "favoravel_migrar" ? "Favorece migração" :
                             f.impacto === "favoravel_permanecer" ? "Favorece Simples" :
                             "Neutro"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{f.descricao}</p>
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
                <CardDescription className="text-xs">Aspectos que merecem cuidado antes de tomar qualquer decisão.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pontosAtencao.map((p, i) => (
                    <div key={i} className={`p-3 rounded-lg border flex items-start gap-3 ${
                      p.severidade === "alta" ? "bg-red-50/50 border-red-200" :
                      p.severidade === "media" ? "bg-amber-50/50 border-amber-200" :
                      "bg-blue-50/50 border-blue-200"
                    }`}>
                      <div className="shrink-0 mt-0.5">
                        {p.severidade === "alta" ? <ShieldAlert className="h-4 w-4 text-red-600" /> :
                         p.severidade === "media" ? <AlertTriangle className="h-4 w-4 text-amber-600" /> :
                         <Info className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{p.titulo}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.descricao}</p>
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
                  <Card className="border-2 border-blue-200 bg-blue-50/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Opção A: Permanecer no Simples (DAS)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Alíquota Efetiva Estimada</p>
                        <p className="text-2xl font-bold font-mono" data-testid="text-simples-rate">{formatPercent(simplesRate)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Imposto Mensal Estimado (DAS)</p>
                        <p className="text-xl font-bold font-mono text-blue-700" data-testid="text-simples-total">{formatCurrency(simplesMonthly)}</p>
                      </div>
                      <div className="text-xs space-y-1 bg-blue-100/50 rounded p-2">
                        <p>Parcela IBS/CBS no DAS: <strong>{formatCurrency(simplesIbsCbsAmount)}</strong></p>
                        <p>Outros tributos no DAS: <strong>{formatCurrency(remainingSimplesWithoutIbsCbs)}</strong></p>
                      </div>
                      <div className="text-xs text-blue-700 bg-blue-100 rounded p-2">
                        <strong>Crédito estimado para seu cliente:</strong> {formatCurrency(clientCreditIfSimples)}/mês
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-2 ${isMigrationBetter ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm font-bold flex items-center gap-2 ${isMigrationBetter ? "text-green-800" : "text-amber-800"}`}>
                        <Scale className="h-4 w-4" />
                        Opção B: IBS/CBS Regular (Fora do DAS)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Alíquota IBS/CBS Estimada em {year}</p>
                        <p className="text-2xl font-bold font-mono" data-testid="text-regular-rate">{formatPercent(regularIbsCbs)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Débito Estimado sobre Faturamento</p>
                        <p className="text-lg font-bold font-mono">{formatCurrency(regularDebit)}</p>
                      </div>
                      <div className="text-xs space-y-1 bg-green-100/50 rounded p-2">
                        <p>(-) Créditos Forn. Regulares: <strong className="text-green-700">{formatCurrency(creditStandard)}</strong></p>
                        <p>(-) Créditos Forn. Simples: <strong className="text-green-700">{formatCurrency(creditSimples)}</strong></p>
                        <p>(-) Créditos Desp. Creditáveis: <strong className="text-green-700">{formatCurrency(creditDespesas)}</strong></p>
                        <p className="border-t pt-1 mt-1">= IBS/CBS Líquido Estimado: <strong>{formatCurrency(regularNetTax)}</strong></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">+ Demais tributos (IRPJ, CSLL, CPP) via DAS</p>
                        <p className="text-sm font-bold font-mono">{formatCurrency(remainingSimplesWithoutIbsCbs)}</p>
                      </div>
                      <div className={`text-sm font-bold p-2 rounded ${isMigrationBetter ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        Total Mensal Estimado: <span className="text-lg" data-testid="text-migrate-total">{formatCurrency(totalIfMigrate)}</span>
                      </div>
                      <div className="text-xs text-green-700 bg-green-100 rounded p-2">
                        <strong>Crédito estimado para seu cliente:</strong> {formatCurrency(clientCreditIfRegular)}/mês
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
                      <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <h4 className="text-sm font-bold text-blue-700">Você no Simples (DAS)</h4>
                        <p className="text-xs">Crédito estimado: <strong>{formatCurrency(clientCreditIfSimples)}/mês</strong></p>
                        <p className="text-xs text-muted-foreground">Alíquota efetiva: {formatPercent(simplesRate)}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg space-y-2 border border-green-200">
                        <h4 className="text-sm font-bold text-green-700">Você no Regime Regular</h4>
                        <p className="text-xs">Crédito estimado: <strong>{formatCurrency(clientCreditIfRegular)}/mês</strong></p>
                        <p className="text-xs text-muted-foreground">Alíquota plena: {formatPercent(regularIbsCbs)}</p>
                      </div>
                    </div>

                    {valPercB2B > 0 && (
                      <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="text-sm font-bold">Análise pelo seu perfil comercial</h4>
                        <div className="grid gap-2 text-xs">
                          <p>Vendas B2B: <strong>{percB2B}%</strong> ({formatCurrency(valRevenueMonthly * valPercB2B)}/mês)</p>
                          <p>PJ contribuintes: <strong>{percPJContribuinte}%</strong> do B2B</p>
                          <p>Ganho estimado de crédito se migrar: <strong className="text-green-700">{formatCurrency(ganhoClientesMigracao)}/mês</strong></p>
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
                    <CardDescription className="text-xs">Clique em qualquer etapa acima para corrigir um valor.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="review-summary">
                  {reviewItems.map((item, i) => (
                    <div key={i} className="p-2.5 bg-muted/30 rounded-lg">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-bold mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-red-50 border-red-200">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 text-sm">Lembrete: Decisão Irretratável</AlertTitle>
              <AlertDescription className="text-xs text-red-700">
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
