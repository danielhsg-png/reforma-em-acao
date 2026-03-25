import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { AlertTriangle, Calculator, DollarSign, TrendingDown, TrendingUp, Info, CheckCircle2, ArrowRight, ArrowLeft, CreditCard, BarChart3, Calendar, Building2, LogOut, ShieldAlert, Target, BarChart, Layers } from "lucide-react";
import { Link } from "wouter";

function SimulatorIntro({ onStart }: { onStart: () => void }) {
  const { user, logout } = useAppStore();
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/50 to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link href="/inicio" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-xs sm:text-sm">
              REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => logout()} className="gap-1 text-muted-foreground h-8 text-xs">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-screen-sm w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-emerald-100 mb-5">
              <Calculator className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight" data-testid="text-simulator-title">
              Simulador Financeiro
            </h1>
            <p className="text-muted-foreground mt-3 text-base md:text-lg max-w-md mx-auto">
              Projete o impacto do IBS/CBS no seu negócio com base nas alíquotas de transição de 2026 a 2033.
            </p>
          </div>

          <Card className="shadow-sm border-emerald-200/50">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 shrink-0 mt-0.5">
                    <BarChart className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Projeção ano a ano</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Veja como as alíquotas de transição impactam seus números de 2026 até a vigência plena em 2033.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 shrink-0 mt-0.5">
                    <Layers className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Créditos detalhados</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Calcule créditos por categoria de despesa: insumos, fornecedores do Simples, folha de pagamento e mais.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 shrink-0 mt-0.5">
                    <Target className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Split Payment</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Entenda quanto do faturamento será retido na fonte e o impacto no fluxo de caixa.</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-5 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      Atenção: este simulador tem caráter provisório e comparativo. Os resultados apresentados servem como apoio para análise inicial e não representam conclusão definitiva, parecer técnico ou garantia de enquadramento final.
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group" data-testid="label-acknowledge">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      data-testid="checkbox-acknowledge"
                    />
                    <span className="text-xs text-amber-700 font-medium group-hover:text-amber-800 transition-colors">
                      Li e compreendo que os resultados são estimativas comparativas e não substituem análise técnica individualizada.
                    </span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/inicio" className="sm:order-1">
                    <Button variant="outline" size="lg" className="w-full gap-2" data-testid="button-back-home">
                      <ArrowLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    className="w-full font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 sm:order-2 flex-1"
                    onClick={onStart}
                    disabled={!acknowledged}
                    data-testid="button-start-simulator"
                  >
                    Li e Estou Ciente
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function FinancialSimulation() {
  const { data } = useAppStore();
  const [started, setStarted] = useState(false);

  const [revenue, setRevenue] = useState("100000");
  const [payroll, setPayroll] = useState("30000");
  const [suppliesStandard, setSuppliesStandard] = useState("20000");
  const [suppliesSimples, setSuppliesSimples] = useState("10000");
  const [year, setYear] = useState("2033");

  const valRevenue = parseFloat(revenue) || 0;
  const valPayroll = parseFloat(payroll) || 0;
  const valStandard = parseFloat(suppliesStandard) || 0;
  const valSimples = parseFloat(suppliesSimples) || 0;

  let currentTaxRate = 0.15;
  if (data.regime === "simples") currentTaxRate = 0.08;
  if (data.regime === "lucro_real") currentTaxRate = 0.18;

  const currentTax = valRevenue * currentTaxRate;

  const transitionRates: Record<string, { cbs: number; ibs: number; label: string }> = {
    "2026": { cbs: 0.009, ibs: 0.001, label: "Fase de Teste" },
    "2027": { cbs: 0.088, ibs: 0.001, label: "CBS Plena, IBS 0,1%" },
    "2029": { cbs: 0.088, ibs: 0.0354, label: "IBS +10% (ICMS/ISS a 90%)" },
    "2030": { cbs: 0.088, ibs: 0.0708, label: "IBS +20% (ICMS/ISS a 80%)" },
    "2031": { cbs: 0.088, ibs: 0.1062, label: "IBS +30% (ICMS/ISS a 70%)" },
    "2032": { cbs: 0.088, ibs: 0.1416, label: "IBS +40% (ICMS/ISS a 60%)" },
    "2033": { cbs: 0.088, ibs: 0.177, label: "Sistema Pleno" },
  };

  const selectedRates = transitionRates[year] || transitionRates["2033"];
  const baseNewTaxRate = selectedRates.cbs + selectedRates.ibs;

  const regimes60 = ["saude_servicos", "saude_dispositivos", "saude_medicamentos", "educacao", "alimentos_reduzidos", "agro_insumos", "transporte_coletivo", "hotelaria_turismo", "higiene_limpeza", "cultura"];
  const regimes30 = ["profissional_liberal"];
  const regimesZero = ["cesta_basica"];
  const regimesSpecific = ["combustiveis", "financeiro", "imobiliario", "cooperativa", "zfm"];
  const regimesSeletivo = ["seletivo_bebidas", "seletivo_tabaco", "seletivo_veiculos", "seletivo_minerio"];

  let regimeReduction = 0;
  let seletivoExtra = 0;
  let regimeLabel = "";
  if (data.specialRegimes.some((r) => regimesZero.includes(r))) {
    regimeReduction = 1.0;
    regimeLabel = "Aliquota Zero (Cesta Basica)";
  } else if (data.specialRegimes.some((r) => regimes60.includes(r))) {
    regimeReduction = 0.6;
    regimeLabel = "Reducao de 60% (Regime Favorecido)";
  } else if (data.specialRegimes.some((r) => regimes30.includes(r))) {
    regimeReduction = 0.3;
    regimeLabel = "Reducao de 30% (Profissional Liberal)";
  } else if (data.specialRegimes.some((r) => regimesSpecific.includes(r))) {
    regimeReduction = 0.2;
    regimeLabel = "Regime Especifico (estimativa)";
  }
  if (data.specialRegimes.some((r) => regimesSeletivo.includes(r))) {
    seletivoExtra = 0.01;
    regimeLabel = regimeLabel ? regimeLabel + " + IS" : "Imposto Seletivo Adicional";
  }

  const newTaxRate = baseNewTaxRate * (1 - regimeReduction) + seletivoExtra;
  const debit = valRevenue * newTaxRate;

  const creditStandard = valStandard * newTaxRate;
  const creditSimples = valSimples * 0.05;
  const totalCredit = creditStandard + creditSimples;

  const newTax = Math.max(0, debit - totalCredit);
  const difference = newTax - currentTax;
  const isWorse = difference > 0;

  const splitPaymentImpact = valRevenue * newTaxRate;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!started) {
    return <SimulatorIntro onStart={() => setStarted(true)} />;
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight flex items-center gap-3" data-testid="text-simulation-title">
            <Calculator className="h-8 w-8 text-primary" />
            Simulador Financeiro — Comparativo Exploratório
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Projete cenários estimados de impacto na sua margem. Compare indicativamente o regime atual com o novo sistema de débitos e créditos em cada ano da transição.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1 max-w-3xl">
            Os valores apresentados são aproximações para apoio à decisão e não substituem análise técnica individualizada.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Dados de Referência (Base Mensal)</CardTitle>
                <CardDescription>
                  Insira valores aproximados para uma análise preliminar. Os resultados são indicativos e não constituem parecer técnico.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="revenue" className="font-bold">Faturamento Bruto Mensal</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="revenue" 
                      type="number" 
                      className="pl-9 text-lg font-medium"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      data-testid="input-sim-revenue"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payroll" className="font-bold flex items-center gap-2">
                    Folha de Pagamento & Encargos
                    <Badge variant="destructive" className="text-[10px]">Sem credito</Badge>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1">Salarios, FGTS, INSS nao geram credito de IBS/CBS (LC 214/2025, art. 36).</p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="payroll" 
                      type="number" 
                      className="pl-9"
                      value={payroll}
                      onChange={(e) => setPayroll(e.target.value)}
                      data-testid="input-sim-payroll"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplies-std" className="font-bold flex items-center gap-2">
                    Compras (Forn. Lucro Real/Presumido)
                    <Badge className="text-[10px]">Credito cheio</Badge>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1">Insumos, energia, aluguel PJ, frete, SaaS, servicos B2B.</p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="supplies-std" 
                      type="number" 
                      className="pl-9"
                      value={suppliesStandard}
                      onChange={(e) => setSuppliesStandard(e.target.value)}
                      data-testid="input-sim-standard"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplies-simples" className="font-bold flex items-center gap-2">
                    Compras (Forn. Simples Nacional)
                    <Badge variant="secondary" className="text-[10px]">Credito restrito</Badge>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1">Credito limitado a aliquota efetiva do fornecedor (~5%).</p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="supplies-simples" 
                      type="number" 
                      className="pl-9"
                      value={suppliesSimples}
                      onChange={(e) => setSuppliesSimples(e.target.value)}
                      data-testid="input-sim-simples"
                    />
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label className="font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Ano de Projeção (Cenário Estimado)
                  </Label>
                  <Select value={year} onValueChange={setYear} data-testid="select-sim-year">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">2026 - Fase de Teste (1,0%)</SelectItem>
                      <SelectItem value="2027">2027 - CBS Plena (8,9%)</SelectItem>
                      <SelectItem value="2029">2029 - ICMS/ISS a 90% (12,3%)</SelectItem>
                      <SelectItem value="2030">2030 - ICMS/ISS a 80% (15,9%)</SelectItem>
                      <SelectItem value="2031">2031 - ICMS/ISS a 70% (19,4%)</SelectItem>
                      <SelectItem value="2032">2032 - ICMS/ISS a 60% (23,0%)</SelectItem>
                      <SelectItem value="2033">2033 - Sistema Pleno (26,5%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {selectedRates.label}: CBS {(selectedRates.cbs * 100).toFixed(1)}% + IBS {(selectedRates.ibs * 100).toFixed(1)}% = {(newTaxRate * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-muted">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Projeção simplificada com finalidade exploratória. Não constitui cálculo contábil exato — não contabiliza IPI, ICMS-ST, variações de NCM ou regimes específicos. Uma análise aprofundada com profissional habilitado é recomendada antes de qualquer decisão.
              </AlertDescription>
            </Alert>
          </div>

          <div className="lg:col-span-7 space-y-6">

            {data.specialRegimes.length > 0 && regimeLabel && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 text-sm">Regime Especial Considerado (Estimativa)</AlertTitle>
                <AlertDescription className="text-xs text-green-700">
                  <strong>{regimeLabel}</strong> — Alíquota indicativa ajustada de {(baseNewTaxRate * 100).toFixed(1)}% para{" "}
                  <strong>{(newTaxRate * 100).toFixed(1)}%</strong> no cenário de {year}. A aplicação real depende de enquadramento técnico específico.
                  {seletivoExtra > 0 && " Inclui estimativa de Imposto Seletivo (IS) adicional."}
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="impacto" className="space-y-4">
              <TabsList className="bg-secondary">
                <TabsTrigger value="impacto">Cenário Tributário Estimado</TabsTrigger>
                <TabsTrigger value="split">Split Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="impacto" className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Referência Atual ({data.regime.replace("_", " ").toUpperCase()})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-mono" data-testid="text-current-tax">{formatCurrency(currentTax)}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Estimativa de imposto sobre faturamento (aprox. {(currentTaxRate * 100).toFixed(1)}%)
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`border-2 ${isWorse ? "border-destructive/50 bg-destructive/5" : "border-green-500/50 bg-green-50"}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        Cenário Projetado em {year} (IBS/CBS)
                        {isWorse ? (
                          <TrendingUp className="h-4 w-4 text-destructive" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold font-mono ${isWorse ? "text-destructive" : "text-green-700"}`} data-testid="text-new-tax">
                        {formatCurrency(newTax)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        Alíquota Efetiva Estimada: {valRevenue > 0 ? ((newTax / valRevenue) * 100).toFixed(1) : "0.0"}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="border-b bg-muted/20 pb-4">
                    <CardTitle className="text-lg">Composição do Cenário Estimado</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Débito Estimado nas Vendas ({(newTaxRate * 100).toFixed(1)}%):</span>
                      <span className="font-mono text-destructive font-medium">{formatCurrency(debit)}</span>
                    </div>
                    
                    <div className="space-y-2 border-t pt-4">
                      <span className="text-sm text-muted-foreground font-medium">Créditos Estimados:</span>
                      <div className="flex justify-between items-center text-sm pl-4">
                        <span className="text-muted-foreground">De Fornecedores Gerais ({(newTaxRate * 100).toFixed(1)}%):</span>
                        <span className="font-mono text-green-600">{formatCurrency(creditStandard)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pl-4">
                        <span className="text-muted-foreground">De Fornecedores Simples (~5%):</span>
                        <span className="font-mono text-green-600">{formatCurrency(creditSimples)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pl-4">
                        <span className="text-muted-foreground">Da Folha de Pagamento:</span>
                        <span className="font-mono text-muted-foreground">R$ 0,00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pl-4 font-bold pt-2 border-t border-dashed">
                        <span>Total Estimado de Créditos:</span>
                        <span className="font-mono text-green-600">- {formatCurrency(totalCredit)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                      <span>Projeção Indicativa ({year}):</span>
                      <span className="font-mono">{formatCurrency(newTax)}</span>
                    </div>
                  </CardContent>
                </Card>

                {isWorse ? (
                  <Alert className="border-destructive border-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <AlertTitle className="text-destructive font-bold text-lg">Indicativo de Atenção</AlertTitle>
                    <AlertDescription className="text-sm mt-2 space-y-2 text-foreground">
                      <p>Neste cenário estimado, a carga tributária tenderia a <strong>aumentar em aproximadamente {formatCurrency(difference)} por mês</strong> ({formatCurrency(difference * 12)}/ano) em {year}.</p>
                      <p className="font-bold text-primary mt-3">Pontos a explorar com seu contador ou consultor:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Avaliar a precificação final (repasse calculado com fórmula "por fora").</li>
                        <li>Analisar fornecedores: comparar Simples vs. Lucro Real/Presumido nos itens de maior volume.</li>
                        <li>Mapear oportunidades de crédito: energia, aluguel PJ, softwares e serviços B2B.</li>
                        <li>Verificar contratos de longo prazo quanto a cláusulas de reequilíbrio tributário.</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-3">Este resultado é indicativo e requer análise aprofundada para tomada de decisão.</p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-500 border-2 bg-green-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-700 font-bold text-lg">Cenário Preliminarmente Favorável</AlertTitle>
                    <AlertDescription className="text-sm mt-2 text-foreground space-y-2">
                      <p>Neste cenário estimado, a carga tributária efetiva tenderia a <strong>diminuir em aproximadamente {formatCurrency(Math.abs(difference))} por mês</strong> em {year}.</p>
                      <p>A projeção indica que sua cadeia de suprimentos pode permitir abater parte significativa do imposto via créditos. Mantenha a organização dos fornecedores e a qualidade dos documentos fiscais.</p>
                      <p className="text-xs text-muted-foreground">Este resultado é indicativo e requer validação por profissional habilitado.</p>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="split" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Projeção do Split Payment no Fluxo de Caixa
                    </CardTitle>
                    <CardDescription>
                      Cenário estimado: com o Split Payment (LC 214/2025, arts. 50-55), o imposto seria retido automaticamente na liquidação financeira. Os valores abaixo são aproximações para apoio à análise.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-bold text-sm mb-3">Hoje (sem Split Payment)</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Faturamento mensal</span>
                            <span className="font-mono">{formatCurrency(valRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Voce recebe</span>
                            <span className="font-mono font-bold text-green-700">{formatCurrency(valRevenue * 0.98)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Imposto pago depois (guia)</span>
                            <span>prazo</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-primary/5">
                        <h4 className="font-bold text-sm mb-3">Projeção {year} (com Split Payment)</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Faturamento mensal</span>
                            <span className="font-mono">{formatCurrency(valRevenue)}</span>
                          </div>
                          <div className="flex justify-between text-destructive">
                            <span>IBS/CBS retido ({(newTaxRate * 100).toFixed(1)}%)</span>
                            <span className="font-mono">- {formatCurrency(splitPaymentImpact)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Voce recebe</span>
                            <span className="font-mono text-accent">{formatCurrency(valRevenue - splitPaymentImpact)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm font-bold text-destructive mb-1">
                        Redução estimada no caixa imediato: {formatCurrency(splitPaymentImpact)}/mês
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Isso não representa imposto adicional — é o mesmo tributo sendo antecipado na liquidação. Porém, o impacto estimado no fluxo de caixa é relevante. Avalie com seu contador a necessidade de capital de giro adicional.
                      </p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Compensação de créditos (cenário indicativo):</strong> Se você tiver créditos de IBS/CBS (compras), o Comitê Gestor poderá abater automaticamente antes da retenção, reduzindo o valor retido na fonte. Quanto mais créditos documentados, menor tende a ser o impacto no caixa. Consulte seu contador para uma avaliação precisa.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-start pt-4">
              <Link href="/inicio">
                <Button variant="outline" className="gap-2" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
