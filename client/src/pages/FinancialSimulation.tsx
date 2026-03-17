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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/50 to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link href="/home" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-xs sm:text-sm">
              REFORMA<span className="text-primary">EM</span>AÇÃO
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

              <div className="border-t pt-5">
                <Button
                  size="lg"
                  className="w-full font-bold gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={onStart}
                  data-testid="button-start-simulator"
                >
                  Iniciar Simulação
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-xs text-amber-700">
                  Este simulador apresenta comparativos quantitativos e cenários de impacto com finalidade exploratória. Os resultados não substituem análise técnica individualizada.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
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
            Simulador Financeiro (IVA Dual)
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Descubra o impacto real na sua margem. Compare o imposto atual com o novo sistema de debitos e creditos em cada ano da transicao.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Seus Custos Mensais (Base)</CardTitle>
                <CardDescription>
                  Insira valores aproximados para uma estimativa rapida.
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
                    Ano de Simulacao
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
                Simulacao simplificada para fins educacionais. Nao substitui calculo contabil exato, pois nao contabiliza IPI, ICMS-ST, variacoes de NCM ou regimes especificos.
              </AlertDescription>
            </Alert>
          </div>

          <div className="lg:col-span-7 space-y-6">

            {data.specialRegimes.length > 0 && regimeLabel && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 text-sm">Regime Especial Aplicado</AlertTitle>
                <AlertDescription className="text-xs text-green-700">
                  <strong>{regimeLabel}</strong> — Aliquota efetiva ajustada de {(baseNewTaxRate * 100).toFixed(1)}% para{" "}
                  <strong>{(newTaxRate * 100).toFixed(1)}%</strong> em {year}.
                  {seletivoExtra > 0 && " Inclui estimativa de Imposto Seletivo (IS) adicional."}
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="impacto" className="space-y-4">
              <TabsList className="bg-secondary">
                <TabsTrigger value="impacto">Impacto Tributario</TabsTrigger>
                <TabsTrigger value="split">Split Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="impacto" className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Cenario Atual ({data.regime.replace("_", " ").toUpperCase()})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-mono" data-testid="text-current-tax">{formatCurrency(currentTax)}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Imposto sobre faturamento (aprox. {(currentTaxRate * 100).toFixed(1)}%)
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`border-2 ${isWorse ? "border-destructive/50 bg-destructive/5" : "border-green-500/50 bg-green-50"}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        Novo Cenario em {year} (IBS/CBS)
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
                        Aliquota Efetiva: {valRevenue > 0 ? ((newTax / valRevenue) * 100).toFixed(1) : "0.0"}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="border-b bg-muted/20 pb-4">
                    <CardTitle className="text-lg">Como chegamos neste valor?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Debito Gerado nas Vendas ({(newTaxRate * 100).toFixed(1)}%):</span>
                      <span className="font-mono text-destructive font-medium">{formatCurrency(debit)}</span>
                    </div>
                    
                    <div className="space-y-2 border-t pt-4">
                      <span className="text-sm text-muted-foreground font-medium">Creditos Abatidos:</span>
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
                        <span>Total de Creditos Utilizados:</span>
                        <span className="font-mono text-green-600">- {formatCurrency(totalCredit)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                      <span>Imposto a Pagar ({year}):</span>
                      <span className="font-mono">{formatCurrency(newTax)}</span>
                    </div>
                  </CardContent>
                </Card>

                {isWorse ? (
                  <Alert className="border-destructive border-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <AlertTitle className="text-destructive font-bold text-lg">Atencao Estrategica!</AlertTitle>
                    <AlertDescription className="text-sm mt-2 space-y-2 text-foreground">
                      <p>Sua carga tributaria tende a <strong>aumentar em {formatCurrency(difference)} por mes</strong> ({formatCurrency(difference * 12)}/ano) em {year}.</p>
                      <p className="font-bold text-primary mt-3">Acoes para recuperar margem:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Revisar a precificacao final (repasse calculado com formula "por fora").</li>
                        <li>Auditar fornecedores: substituir Simples por Lucro Real/Presumido nos itens de maior volume.</li>
                        <li>Maximizar creditos: energia, aluguel PJ, softwares e servicos B2B geram credito integral.</li>
                        <li>Renegociar contratos de longo prazo com clausula de reequilibrio tributario.</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-500 border-2 bg-green-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-700 font-bold text-lg">Cenario Favoravel</AlertTitle>
                    <AlertDescription className="text-sm mt-2 text-foreground">
                      <p>Sua carga tributaria efetiva tende a <strong>diminuir em {formatCurrency(Math.abs(difference))} por mes</strong> em {year}.</p>
                      <p>Sua cadeia de suprimentos forte permite abater grande parte do imposto via creditos. Mantenha a organizacao dos fornecedores e a qualidade dos documentos fiscais.</p>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="split" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Impacto do Split Payment no Fluxo de Caixa
                    </CardTitle>
                    <CardDescription>
                      Com o Split Payment (LC 214/2025, arts. 50-55), o imposto e retido automaticamente na liquidacao financeira.
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
                        <h4 className="font-bold text-sm mb-3">Em {year} (com Split Payment)</h4>
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
                        Reducao no caixa imediato: {formatCurrency(splitPaymentImpact)}/mes
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Isso nao e imposto adicional - e o mesmo imposto sendo pago na hora ao inves de depois. Mas o impacto no fluxo de caixa e real. Prepare capital de giro adicional.
                      </p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Compensacao de creditos:</strong> Se voce tem creditos de IBS/CBS (compras), o Comite Gestor podera abater automaticamente antes da retencao, reduzindo o valor retido na fonte. Quanto mais creditos documentados, menos impacto no caixa.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-start pt-4">
              <Link href="/home">
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
