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
import { ArrowRight, ArrowLeft, Calculator, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info, Scale, DollarSign, Users, Percent, Building2, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

const SIMPLES_ANEXOS = {
  anexo_i: {
    label: "Anexo I — Comercio",
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
    label: "Anexo II — Industria",
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
    label: "Anexo III — Servicos (fator R >= 28%)",
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
    label: "Anexo IV — Servicos (construcao, vigilancia, limpeza)",
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
    label: "Anexo V — Servicos (fator R < 28%)",
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

export default function SimplesSimulator() {
  const { data } = useAppStore();

  const [revenue12m, setRevenue12m] = useState("480000");
  const [revenueMonthly, setRevenueMonthly] = useState("40000");
  const [anexo, setAnexo] = useState<keyof typeof SIMPLES_ANEXOS>("anexo_i");
  const [payrollMonthly, setPayrollMonthly] = useState("12000");
  const [suppliesMonthly, setSuppliesMonthly] = useState("15000");
  const [suppliesSimplesPercent, setSuppliesSimplesPercent] = useState("30");
  const [year, setYear] = useState("2033");

  const valRevenue12m = parseFloat(revenue12m) || 0;
  const valRevenueMonthly = parseFloat(revenueMonthly) || 0;
  const valPayroll = parseFloat(payrollMonthly) || 0;
  const valSupplies = parseFloat(suppliesMonthly) || 0;
  const valSimplesPercent = (parseFloat(suppliesSimplesPercent) || 0) / 100;

  const simplesRate = calcSimplesRate(valRevenue12m, anexo);
  const simplesMonthly = valRevenueMonthly * simplesRate;

  const ibsCbsShareInSimples = calcSimplesIbsCbsShare(anexo);
  const simplesIbsCbsAmount = simplesMonthly * ibsCbsShareInSimples;

  const transitionRates: Record<string, { rate: number; label: string }> = {
    "2026": { rate: 0.01, label: "Fase de Teste (CBS 0,9% + IBS 0,1%)" },
    "2027": { rate: 0.089, label: "CBS Plena + IBS 0,1%" },
    "2029": { rate: 0.1234, label: "IBS em transicao" },
    "2033": { rate: 0.265, label: "Sistema Pleno (CBS 8,8% + IBS 17,7%)" },
  };

  const selectedRate = transitionRates[year] || transitionRates["2033"];
  const regularIbsCbs = selectedRate.rate;

  const regularDebit = valRevenueMonthly * regularIbsCbs;

  const suppliesStandard = valSupplies * (1 - valSimplesPercent);
  const suppliesFromSimples = valSupplies * valSimplesPercent;
  const creditStandard = suppliesStandard * regularIbsCbs;
  const creditSimples = suppliesFromSimples * 0.05;
  const totalCredit = creditStandard + creditSimples;
  const regularNetTax = Math.max(0, regularDebit - totalCredit);

  const remainingSimplesWithoutIbsCbs = simplesMonthly - simplesIbsCbsAmount;
  const totalIfMigrate = regularNetTax + remainingSimplesWithoutIbsCbs;

  const difference = totalIfMigrate - simplesMonthly;
  const isMigrationBetter = difference < 0;

  const clientCreditIfSimples = simplesIbsCbsAmount;
  const clientCreditIfRegular = valRevenueMonthly * regularIbsCbs;
  const clientCreditDifference = clientCreditIfRegular - clientCreditIfSimples;

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight flex items-center gap-3" data-testid="text-simples-title">
            <Scale className="h-8 w-8 text-primary" />
            Simulador: Simples Nacional vs IBS/CBS Regular
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            A LC 214/2025 permite que empresas do Simples Nacional optem por recolher IBS e CBS fora do DAS, 
            no regime regular com creditos amplos. Descubra qual opcao e mais vantajosa para o seu negocio.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Parametros da Simulacao
                </CardTitle>
                <CardDescription>
                  Preencha com os dados reais da sua empresa para uma simulacao precisa.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Anexo do Simples Nacional
                  </Label>
                  <Select value={anexo} onValueChange={(val) => setAnexo(val as keyof typeof SIMPLES_ANEXOS)} data-testid="select-anexo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                    Receita Bruta Ultimos 12 Meses (RBT12)
                  </Label>
                  <Input
                    value={revenue12m}
                    onChange={(e) => setRevenue12m(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="480000"
                    data-testid="input-revenue-12m"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Faturamento Mensal Medio</Label>
                  <Input
                    value={revenueMonthly}
                    onChange={(e) => setRevenueMonthly(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="40000"
                    data-testid="input-revenue-monthly"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Folha de Pagamento Mensal
                  </Label>
                  <Input
                    value={payrollMonthly}
                    onChange={(e) => setPayrollMonthly(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="12000"
                    data-testid="input-payroll"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Fator R = {valRevenueMonthly > 0 ? ((valPayroll / valRevenueMonthly) * 100).toFixed(1) : "0"}% 
                    {valRevenueMonthly > 0 && valPayroll / valRevenueMonthly >= 0.28 && " (>= 28% — Anexo III pode ser aplicavel)"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Compras/Insumos Mensais Totais</Label>
                  <Input
                    value={suppliesMonthly}
                    onChange={(e) => setSuppliesMonthly(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="15000"
                    data-testid="input-supplies"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    % das Compras de Fornecedores do Simples
                  </Label>
                  <Input
                    value={suppliesSimplesPercent}
                    onChange={(e) => setSuppliesSimplesPercent(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="30"
                    data-testid="input-simples-percent"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ano de Referencia da Simulacao</Label>
                  <Select value={year} onValueChange={setYear} data-testid="select-year-simples">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">2026 — Fase de Teste (1%)</SelectItem>
                      <SelectItem value="2027">2027 — CBS Plena (8,9%)</SelectItem>
                      <SelectItem value="2029">2029 — Transicao (12,3%)</SelectItem>
                      <SelectItem value="2033">2033 — Sistema Pleno (26,5%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-700">
                <strong>Importante:</strong> A opcao de recolher IBS/CBS fora do DAS e irretratavel para o ano-calendario. 
                Ou seja, se optar pelo regime regular, nao podera voltar ao DAS para IBS/CBS naquele ano (LC 214/2025).
              </AlertDescription>
            </Alert>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <Tabs defaultValue="comparativo" className="space-y-4">
              <TabsList className="bg-secondary">
                <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
                <TabsTrigger value="clientes">Impacto nos Clientes</TabsTrigger>
                <TabsTrigger value="decisao">Guia de Decisao</TabsTrigger>
              </TabsList>

              <TabsContent value="comparativo" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-200 bg-blue-50/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Opcao A: Permanecer no Simples (DAS)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Aliquota Efetiva do Simples</p>
                        <p className="text-2xl font-bold font-mono" data-testid="text-simples-rate">{formatPercent(simplesRate)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Imposto Mensal Total (DAS)</p>
                        <p className="text-xl font-bold font-mono text-blue-700" data-testid="text-simples-total">{formatCurrency(simplesMonthly)}</p>
                      </div>
                      <div className="text-xs space-y-1 bg-blue-100/50 rounded p-2">
                        <p>Parcela IBS/CBS no DAS: <strong>{formatCurrency(simplesIbsCbsAmount)}</strong></p>
                        <p>Outros tributos no DAS: <strong>{formatCurrency(remainingSimplesWithoutIbsCbs)}</strong></p>
                      </div>
                      <div className="text-xs text-blue-700 bg-blue-100 rounded p-2">
                        <strong>Credito que seu cliente toma:</strong> {formatCurrency(clientCreditIfSimples)}/mes
                        <p className="text-[10px] mt-1">(proporcional a sua aliquota efetiva, nao a plena)</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-2 ${isMigrationBetter ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm font-bold flex items-center gap-2 ${isMigrationBetter ? "text-green-800" : "text-amber-800"}`}>
                        <Scale className="h-4 w-4" />
                        Opcao B: IBS/CBS Regular (Fora do DAS)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Aliquota IBS/CBS em {year}</p>
                        <p className="text-2xl font-bold font-mono" data-testid="text-regular-rate">{formatPercent(regularIbsCbs)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Debito IBS/CBS sobre Faturamento</p>
                        <p className="text-lg font-bold font-mono">{formatCurrency(regularDebit)}</p>
                      </div>
                      <div className="text-xs space-y-1 bg-green-100/50 rounded p-2">
                        <p>(-) Creditos Fornecedores Regulares: <strong className="text-green-700">{formatCurrency(creditStandard)}</strong></p>
                        <p>(-) Creditos Fornecedores Simples: <strong className="text-green-700">{formatCurrency(creditSimples)}</strong></p>
                        <p className="border-t pt-1 mt-1">= IBS/CBS Liquido: <strong>{formatCurrency(regularNetTax)}</strong></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">+ Demais tributos (IRPJ, CSLL, CPP) via DAS</p>
                        <p className="text-sm font-bold font-mono">{formatCurrency(remainingSimplesWithoutIbsCbs)}</p>
                      </div>
                      <div className={`text-sm font-bold p-2 rounded ${isMigrationBetter ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        Total Mensal: <span className="text-lg" data-testid="text-migrate-total">{formatCurrency(totalIfMigrate)}</span>
                      </div>
                      <div className="text-xs text-green-700 bg-green-100 rounded p-2">
                        <strong>Credito que seu cliente toma:</strong> {formatCurrency(clientCreditIfRegular)}/mes
                        <p className="text-[10px] mt-1">(credito integral pela aliquota plena)</p>
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
                            ? `Migrar para IBS/CBS Regular pode economizar ${formatCurrency(Math.abs(difference))}/mes`
                            : `Permanecer no Simples e mais vantajoso em ${formatCurrency(Math.abs(difference))}/mes`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Diferenca anual estimada: <strong>{formatCurrency(Math.abs(difference) * 12)}</strong>
                        </p>
                      </div>
                    </div>
                    {Math.abs(difference) < simplesMonthly * 0.05 && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-700">
                          A diferenca e inferior a 5% do imposto total. Neste cenario, fatores nao-tributarios 
                          (simplicidade, obrigacoes acessorias, custo de contabilidade) podem pesar mais na decisao.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="clientes" className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Impacto nos Seus Clientes (B2B)
                    </CardTitle>
                    <CardDescription>
                      Quando voce esta no Simples, seus clientes tomam credito limitado. 
                      No regime regular, eles tomam credito integral. Isso afeta a competitividade.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <h4 className="text-sm font-bold text-blue-700">Voce no Simples (DAS)</h4>
                        <p className="text-xs">Credito para o cliente: <strong>{formatCurrency(clientCreditIfSimples)}/mes</strong></p>
                        <p className="text-xs text-muted-foreground">Aliquota efetiva do Simples: {formatPercent(simplesRate)}</p>
                        <p className="text-[10px] text-muted-foreground">O cliente toma credito proporcional a aliquota efetiva do Simples, nao a aliquota plena.</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg space-y-2 border border-green-200">
                        <h4 className="text-sm font-bold text-green-700">Voce no Regime Regular</h4>
                        <p className="text-xs">Credito para o cliente: <strong>{formatCurrency(clientCreditIfRegular)}/mes</strong></p>
                        <p className="text-xs text-muted-foreground">Aliquota plena IBS/CBS: {formatPercent(regularIbsCbs)}</p>
                        <p className="text-[10px] text-muted-foreground">O cliente toma credito pela aliquota plena, independente da sua carga efetiva.</p>
                      </div>
                    </div>

                    <Alert className={clientCreditDifference > 0 ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
                      <Info className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800 text-sm">Diferenca de Credito para o Cliente</AlertTitle>
                      <AlertDescription className="text-xs text-green-700">
                        Se voce migrar para o regime regular, seus clientes B2B ganham{" "}
                        <strong>{formatCurrency(clientCreditDifference)}/mes a mais</strong> em creditos tributarios.
                        Isso torna seus precos mais competitivos, pois o custo liquido para o cliente e menor.
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 border rounded-lg space-y-2">
                      <h4 className="text-sm font-bold">Quando isso importa mais?</h4>
                      <div className="grid gap-2 text-xs">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600 shrink-0" />
                          <span><strong>Clientes grandes (Lucro Real/Presumido):</strong> Eles tomam credito integral. A diferenca e significativa.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600 shrink-0" />
                          <span><strong>Licitacoes publicas:</strong> O preco com credito integral pode ser decisivo para ganhar a concorrencia.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 mt-0.5 text-amber-600 shrink-0" />
                          <span><strong>Clientes PF ou Simples:</strong> Eles nao tomam credito. A diferenca nao importa nesse caso.</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="decisao" className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Guia de Decisao: Ficar ou Migrar?</CardTitle>
                    <CardDescription>
                      Criterios objetivos para avaliar a opcao mais vantajosa para o seu perfil.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-green-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Migrar para IBS/CBS Regular VALE A PENA quando:
                      </h4>
                      <div className="grid gap-2 text-xs">
                        {[
                          "Seus clientes sao majoritariamente B2B (empresas do Lucro Real ou Presumido)",
                          "Voce tem volume significativo de compras de fornecedores do regime regular (nao Simples)",
                          "Sua margem de lucro e alta e o imposto total e expressivo",
                          "Voce participa de licitacoes publicas onde o preco liquido (com credito) e decisivo",
                          "Seu faturamento esta proximo do teto do Simples (R$ 4,8 milhoes) e a aliquota efetiva ja e alta",
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-2 bg-green-50 rounded p-2">
                            <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Permanecer no Simples (DAS) VALE A PENA quando:
                      </h4>
                      <div className="grid gap-2 text-xs">
                        {[
                          "Seus clientes sao majoritariamente consumidores finais (B2C) ou empresas do Simples",
                          "Voce tem poucos insumos com credito (empresa de servicos com custo principal em folha)",
                          "Seu faturamento e baixo e a aliquota efetiva do Simples e inferior a 10%",
                          "A simplicidade do recolhimento unico (DAS) e mais importante que a economia tributaria",
                          "O custo de contabilidade para apurar IBS/CBS no regime regular seria alto demais",
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-2 bg-blue-50 rounded p-2">
                            <Building2 className="h-3 w-3 mt-0.5 text-blue-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Alert className="bg-red-50 border-red-200">
                      <ShieldAlert className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800 text-sm">Atencao: Decisao Irretratavel</AlertTitle>
                      <AlertDescription className="text-xs text-red-700">
                        A opcao pelo recolhimento de IBS/CBS fora do DAS sera irretratavel para o ano-calendario inteiro. 
                        Isso significa que voce nao pode alternar entre os regimes durante o ano. 
                        Faca a simulacao com cuidado e consulte seu contador antes de decidir.
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <h4 className="text-sm font-bold">Obrigacoes Adicionais no Regime Regular:</h4>
                      <div className="grid gap-1 text-xs text-muted-foreground">
                        <span>- Escrituracao detalhada de debitos e creditos de IBS/CBS</span>
                        <span>- Emissao de NF-e com campos especificos (cClassTrib, grupo IBS/CBS)</span>
                        <span>- Conciliacao mensal de creditos com fornecedores</span>
                        <span>- Apuracao separada de IBS (estadual) e CBS (federal)</span>
                        <span>- Split Payment aplicavel nas vendas por cartao/PIX</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-between pt-8 border-t mt-8">
          <Link href="/plano-de-acao/analise-produtos">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-products">
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </Button>
          </Link>
          <Link href="/plano-de-acao/preocupacoes">
            <Button size="lg" className="gap-2" data-testid="button-next-concerns">
              Proximo: Minhas Duvidas
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
