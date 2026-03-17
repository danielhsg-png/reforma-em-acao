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
  ChevronDown, ChevronUp, Briefcase, ShoppingCart, FileText, Settings, BarChart3
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

function CollapsibleBlock({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
  testId,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  testId: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden" data-testid={testId}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
        data-testid={`${testId}-toggle`}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold">{title}</span>
          {badge && <Badge variant="secondary" className="text-[10px]">{badge}</Badge>}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 space-y-4 border-t">{children}</div>}
    </div>
  );
}

export default function SimplesSimulator() {
  const { data } = useAppStore();

  const [revenue12m, setRevenue12m] = useState("480000");
  const [revenueMonthly, setRevenueMonthly] = useState("40000");
  const [anexo, setAnexo] = useState<keyof typeof SIMPLES_ANEXOS>("anexo_i");
  const [payrollMonthly, setPayrollMonthly] = useState("12000");
  const [suppliesMonthly, setSuppliesMonthly] = useState("15000");
  const [suppliesSimplesPercent, setSuppliesSimplesPercent] = useState("30");
  const [year, setYear] = useState("2033");

  const [proLabore, setProLabore] = useState("5000");
  const [encargos, setEncargos] = useState("35");
  const [sazonalidadeFolha, setSazonalidadeFolha] = useState("estavel");

  const [percB2B, setPercB2B] = useState("60");
  const [percB2C, setPercB2C] = useState("40");
  const [percPJContribuinte, setPercPJContribuinte] = useState("50");
  const [percConsumidorFinal, setPercConsumidorFinal] = useState("50");
  const [sensibilidadePreco, setSensibilidadePreco] = useState("media");
  const [clienteValorizaCredito, setClienteValorizaCredito] = useState("parcialmente");

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

  const vendasB2BContribuinte = valRevenueMonthly * valPercB2B * valPercPJContribuinte;
  const ganhoClientesMigracao = vendasB2BContribuinte > 0
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

  const numInput = (val: string, set: (v: string) => void, ph: string, tid: string) => (
    <Input value={val} onChange={(e) => set(e.target.value.replace(/[^0-9.]/g, ""))} placeholder={ph} data-testid={tid} />
  );

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight flex items-center gap-3" data-testid="text-simples-title">
            <Scale className="h-8 w-8 text-primary" />
            Simulador Simples Nacional
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Análise comparativa entre permanecer no Simples (DAS) ou migrar o IBS/CBS para o regime regular.
            Preencha os dados para uma projeção mais precisa.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1 max-w-3xl">
            Os resultados são indicativos e servem como apoio à decisão. Consulte seu contador antes de optar.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">

            <CollapsibleBlock title="Dados Básicos" icon={Calculator} defaultOpen={true} testId="block-basicos">
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
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Receita Bruta Últimos 12 Meses (RBT12)
                </Label>
                {numInput(revenue12m, setRevenue12m, "480000", "input-revenue-12m")}
              </div>
              <div className="space-y-2">
                <Label>Faturamento Mensal Médio</Label>
                {numInput(revenueMonthly, setRevenueMonthly, "40000", "input-revenue-monthly")}
              </div>
              <div className="space-y-2">
                <Label>Ano de Referência</Label>
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
            </CollapsibleBlock>

            <CollapsibleBlock title="Folha e Pró-labore" icon={Users} defaultOpen={false} badge="Fator R" testId="block-folha">
              <div className="space-y-2">
                <Label>Folha de Pagamento Mensal</Label>
                {numInput(payrollMonthly, setPayrollMonthly, "12000", "input-payroll")}
              </div>
              <div className="space-y-2">
                <Label>Pró-labore Mensal</Label>
                {numInput(proLabore, setProLabore, "5000", "input-prolabore")}
              </div>
              <div className="space-y-2">
                <Label>Encargos sobre Pró-labore (%)</Label>
                {numInput(encargos, setEncargos, "35", "input-encargos")}
              </div>
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
              <div className="p-3 bg-muted/30 rounded-lg text-xs space-y-1">
                <p>Folha Total (com pró-labore + encargos): <strong>{formatCurrency(folhaTotal)}</strong></p>
                <p>Percentual sobre receita: <strong>{valRevenueMonthly > 0 ? (folhaTotal / valRevenueMonthly * 100).toFixed(1) : "0"}%</strong></p>
                <p>Fator R: <strong>{(fatorR * 100).toFixed(1)}%</strong>
                  {fatorR >= 0.28 && <Badge className="ml-2 text-[9px]" variant="secondary">Anexo III pode ser aplicável</Badge>}
                </p>
                {sazonalidadeFolha !== "estavel" && (
                  <p className="text-amber-600">Atenção: folha variável pode alterar o Fator R ao longo do ano, impactando o anexo aplicável.</p>
                )}
              </div>
            </CollapsibleBlock>

            <CollapsibleBlock title="Perfil Comercial" icon={Briefcase} defaultOpen={false} badge="B2B/B2C" testId="block-comercial">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Vendas B2B (%)</Label>
                  {numInput(percB2B, setPercB2B, "60", "input-perc-b2b")}
                </div>
                <div className="space-y-2">
                  <Label>Vendas B2C (%)</Label>
                  {numInput(percB2C, setPercB2C, "40", "input-perc-b2c")}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>PJ Contribuinte (%)</Label>
                  {numInput(percPJContribuinte, setPercPJContribuinte, "50", "input-perc-pj")}
                  <p className="text-[10px] text-muted-foreground">Do B2B, quais são contribuintes (tomam crédito)?</p>
                </div>
                <div className="space-y-2">
                  <Label>Consumidor Final (%)</Label>
                  {numInput(percConsumidorFinal, setPercConsumidorFinal, "50", "input-perc-cf")}
                </div>
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
            </CollapsibleBlock>

            <CollapsibleBlock title="Compras e Créditos" icon={ShoppingCart} defaultOpen={false} testId="block-compras">
              <div className="space-y-2">
                <Label>Compras/Insumos Mensais Totais</Label>
                {numInput(suppliesMonthly, setSuppliesMonthly, "15000", "input-supplies")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Fornecedores Simples (%)</Label>
                  {numInput(suppliesSimplesPercent, setSuppliesSimplesPercent, "30", "input-simples-percent")}
                </div>
                <div className="space-y-2">
                  <Label>Fornecedores Regulares (%)</Label>
                  {numInput(percComprasRegular, setPercComprasRegular, "70", "input-compras-regular")}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Despesas com potencial de crédito (%)</Label>
                {numInput(percDespesasCredito, setPercDespesasCredito, "60", "input-desp-credito")}
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
            </CollapsibleBlock>

            <CollapsibleBlock title="Margem e Contratos" icon={BarChart3} defaultOpen={false} testId="block-margem">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Margem Bruta (%)</Label>
                  {numInput(margemBruta, setMargemBruta, "40", "input-margem-bruta")}
                </div>
                <div className="space-y-2">
                  <Label>Margem Líquida (%)</Label>
                  {numInput(margemLiquida, setMargemLiquida, "15", "input-margem-liquida")}
                </div>
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
            </CollapsibleBlock>

            <CollapsibleBlock title="Complexidade Operacional" icon={Settings} defaultOpen={false} testId="block-complexidade">
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
              <div className="space-y-2">
                <Label>Notas fiscais emitidas por mês</Label>
                {numInput(notasMensais, setNotasMensais, "50", "input-notas-mensais")}
              </div>
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
              <div className="p-3 bg-muted/30 rounded-lg text-xs">
                <p>Complexidade operacional estimada: <strong className={complexidadeOperacional >= 5 ? "text-red-600" : complexidadeOperacional >= 3 ? "text-amber-600" : "text-green-600"}>{complexidadeLabel}</strong></p>
                {complexidadeOperacional >= 5 && (
                  <p className="text-amber-600 mt-1">Migrar para o regime regular exigirá investimento em sistemas e processos.</p>
                )}
              </div>
            </CollapsibleBlock>

            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-700">
                <strong>Importante:</strong> A opção de recolher IBS/CBS fora do DAS é irretratável para o ano-calendário.
                Ou seja, se optar pelo regime regular, não poderá voltar ao DAS para IBS/CBS naquele ano (LC 214/2025).
              </AlertDescription>
            </Alert>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <Tabs defaultValue="comparativo" className="space-y-4">
              <TabsList className="bg-secondary">
                <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
                <TabsTrigger value="clientes">Impacto nos Clientes</TabsTrigger>
                <TabsTrigger value="decisao">Análise de Cenário</TabsTrigger>
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
                        <p className="text-[10px] text-muted-foreground">Alíquota Efetiva Estimada do Simples</p>
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
                        <p className="text-[10px] mt-1">(proporcional à alíquota efetiva, não à plena)</p>
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
                        <p className="text-[10px] mt-1">(crédito integral pela alíquota plena)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className={`border-2 ${isMigrationBetter ? "border-green-500 bg-green-50" : "border-blue-500 bg-blue-50"}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {isMigrationBetter ? (
                        <TrendingDown className="h-8 w-8 text-green-600" />
                      ) : (
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      )}
                      <div>
                        <h3 className="text-lg font-bold" data-testid="text-verdict">
                          {isMigrationBetter
                            ? `Cenário indica possível economia de ${formatCurrency(Math.abs(difference))}/mês ao migrar`
                            : `Cenário indica vantagem de ${formatCurrency(Math.abs(difference))}/mês ao permanecer no Simples`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Diferença anual estimada: <strong>{formatCurrency(Math.abs(difference) * 12)}</strong>
                        </p>
                      </div>
                    </div>
                    {Math.abs(difference) < simplesMonthly * 0.05 && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-700">
                          A diferença é inferior a 5% do imposto total. Neste cenário, fatores não-tributários
                          (simplicidade, obrigações acessórias, custo de contabilidade) podem pesar mais na decisão.
                        </AlertDescription>
                      </Alert>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-3">
                      Este comparativo é indicativo. Os valores reais dependem de enquadramento fiscal específico e podem variar.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="clientes" className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Impacto Estimado nos Seus Clientes (B2B)
                    </CardTitle>
                    <CardDescription>
                      No Simples, seus clientes B2B tomam crédito limitado. No regime regular, crédito integral.
                      Isso pode afetar sua competitividade.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <h4 className="text-sm font-bold text-blue-700">Você no Simples (DAS)</h4>
                        <p className="text-xs">Crédito estimado para o cliente: <strong>{formatCurrency(clientCreditIfSimples)}/mês</strong></p>
                        <p className="text-xs text-muted-foreground">Alíquota efetiva do Simples: {formatPercent(simplesRate)}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg space-y-2 border border-green-200">
                        <h4 className="text-sm font-bold text-green-700">Você no Regime Regular</h4>
                        <p className="text-xs">Crédito estimado para o cliente: <strong>{formatCurrency(clientCreditIfRegular)}/mês</strong></p>
                        <p className="text-xs text-muted-foreground">Alíquota plena IBS/CBS: {formatPercent(regularIbsCbs)}</p>
                      </div>
                    </div>

                    {valPercB2B > 0 && (
                      <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="text-sm font-bold">Análise pelo seu perfil comercial</h4>
                        <div className="grid gap-2 text-xs">
                          <p>Suas vendas B2B: <strong>{percB2B}%</strong> do faturamento ({formatCurrency(valRevenueMonthly * valPercB2B)}/mês)</p>
                          <p>Clientes PJ contribuintes (tomam crédito): <strong>{percPJContribuinte}%</strong> do B2B</p>
                          <p>Ganho estimado de crédito para clientes se migrar: <strong className="text-green-700">{formatCurrency(ganhoClientesMigracao)}/mês</strong></p>
                          {clienteValorizaCredito === "sim" && (
                            <p className="text-green-700 font-medium">Seus clientes valorizam crédito — migrar pode aumentar sua competitividade.</p>
                          )}
                          {clienteValorizaCredito === "nao" && (
                            <p className="text-muted-foreground">Seus clientes não priorizam crédito — esse fator tem peso menor na decisão.</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Alert className={clientCreditDifference > 0 ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
                      <Info className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800 text-sm">Diferença Estimada de Crédito para o Cliente</AlertTitle>
                      <AlertDescription className="text-xs text-green-700">
                        Se migrar para o regime regular, seus clientes B2B ganhariam estimativamente{" "}
                        <strong>{formatCurrency(clientCreditDifference)}/mês a mais</strong> em créditos tributários.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="decisao" className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Análise de Cenário: Ficar ou Migrar?</CardTitle>
                    <CardDescription>
                      Avaliação indicativa com base nos dados informados. Não substitui análise técnica individualizada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${scoreMigracao > scorePermanecer ? "border-green-500 bg-green-50" : "border-muted bg-muted/20"}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Scale className="h-5 w-5 text-green-600" />
                          <h4 className="text-sm font-bold">Migrar para Regular</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 bg-muted rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, scoreMigracao * 7)}%` }} />
                          </div>
                          <span className="text-sm font-bold text-green-700">{scoreMigracao} pts</span>
                        </div>
                        <div className="text-xs space-y-1 text-muted-foreground">
                          {isMigrationBetter && <p className="text-green-700">+ Economia tributária direta</p>}
                          {valPercB2B >= 0.5 && <p className="text-green-700">+ Maioria das vendas é B2B</p>}
                          {clienteValorizaCredito !== "nao" && <p className="text-green-700">+ Clientes valorizam crédito</p>}
                          {valPercComprasRegular >= 0.6 && <p className="text-green-700">+ Bom volume de compras creditáveis</p>}
                          {apoioContabil === "sim" && <p className="text-green-700">+ Contador preparado</p>}
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border-2 ${scorePermanecer > scoreMigracao ? "border-blue-500 bg-blue-50" : "border-muted bg-muted/20"}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <h4 className="text-sm font-bold">Permanecer no Simples</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 bg-muted rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, scorePermanecer * 7)}%` }} />
                          </div>
                          <span className="text-sm font-bold text-blue-700">{scorePermanecer} pts</span>
                        </div>
                        <div className="text-xs space-y-1 text-muted-foreground">
                          {!isMigrationBetter && <p className="text-blue-700">+ Vantagem tributária direta</p>}
                          {valPercB2B < 0.3 && <p className="text-blue-700">+ Maioria das vendas é B2C</p>}
                          {clienteValorizaCredito === "nao" && <p className="text-blue-700">+ Clientes não priorizam crédito</p>}
                          {emissaoFiscal === "manual" && <p className="text-blue-700">+ Simplicidade operacional</p>}
                          {apoioContabil === "nao" && <p className="text-blue-700">+ Menor exigência contábil</p>}
                        </div>
                      </div>
                    </div>

                    {complexidadeOperacional >= 3 && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <Settings className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800 text-sm">Complexidade Operacional: {complexidadeLabel}</AlertTitle>
                        <AlertDescription className="text-xs text-amber-700 space-y-1">
                          <p>A migração para o regime regular exige adequação de sistemas e processos.</p>
                          {emissaoFiscal === "manual" && <p>- Emissão fiscal manual pode ser inviável no regime regular com volume alto.</p>}
                          {apoioContabil === "nao" && <p>- Recomenda-se buscar apoio contábil especializado antes de migrar.</p>}
                          {atuacaoInterestadual === "sim" && <p>- Atuação interestadual adiciona complexidade na apuração de IBS.</p>}
                        </AlertDescription>
                      </Alert>
                    )}

                    {contratosLongoPrazo === "sim" && clausulaReajuste === "nao" && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-xs text-red-700">
                          <strong>Atenção:</strong> Você tem contratos de longo prazo sem cláusula de reajuste tributário.
                          A mudança de regime pode impactar margens em contratos vigentes sem possibilidade de repasse.
                        </AlertDescription>
                      </Alert>
                    )}

                    {facilidadeRepasse === "baixa" && isMigrationBetter && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <Info className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-700">
                          Embora o cenário tributário indique vantagem na migração, a baixa facilidade de repasse de preço
                          pode limitar os benefícios na prática. Avalie com cautela.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Alert className="bg-red-50 border-red-200">
                      <ShieldAlert className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800 text-sm">Decisão Irretratável</AlertTitle>
                      <AlertDescription className="text-xs text-red-700">
                        A opção pelo recolhimento de IBS/CBS fora do DAS será irretratável para o ano-calendário inteiro.
                        Faça a simulação com cuidado e consulte seu contador antes de decidir.
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <h4 className="text-sm font-bold">Resumo do Perfil Analisado</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Fator R: <strong>{(fatorR * 100).toFixed(1)}%</strong></span>
                        <span>Vendas B2B: <strong>{percB2B}%</strong></span>
                        <span>Forn. Regulares: <strong>{percComprasRegular}%</strong></span>
                        <span>Margem Bruta: <strong>{margemBruta}%</strong></span>
                        <span>Complexidade: <strong>{complexidadeLabel}</strong></span>
                        <span>Crédito valorizado: <strong>{clienteValorizaCredito === "sim" ? "Sim" : clienteValorizaCredito === "parcialmente" ? "Parcial" : "Não"}</strong></span>
                        <span>Repasse: <strong>{facilidadeRepasse === "alta" ? "Fácil" : facilidadeRepasse === "media" ? "Médio" : "Difícil"}</strong></span>
                        <span>Apoio contábil: <strong>{apoioContabil === "sim" ? "Sim" : "Não"}</strong></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-start pt-8 border-t mt-8">
          <Link href="/inicio">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
