import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { AlertTriangle, Calculator, DollarSign, TrendingDown, TrendingUp, Info, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function FinancialSimulation() {
  const { data } = useAppStore();
  
  const [revenue, setRevenue] = useState("100000");
  const [payroll, setPayroll] = useState("30000");
  const [suppliesStandard, setSuppliesStandard] = useState("20000");
  const [suppliesSimples, setSuppliesSimples] = useState("10000");

  const valRevenue = parseFloat(revenue) || 0;
  const valPayroll = parseFloat(payroll) || 0;
  const valStandard = parseFloat(suppliesStandard) || 0;
  const valSimples = parseFloat(suppliesSimples) || 0;

  // Cálculos baseados no Regime Atual (Valores aproximados para fins de simulação/mockup)
  let currentTaxRate = 0.15; // default Presumido
  if (data.regime === "simples") currentTaxRate = 0.08;
  if (data.regime === "lucro_real") currentTaxRate = 0.18;

  const currentTax = valRevenue * currentTaxRate;

  // Cálculos do Novo Sistema (IVA Dual - IBS/CBS)
  const newTaxRate = 0.265; // Alíquota de referência 26,5%
  const debit = valRevenue * newTaxRate;

  // Créditos (Folha de pagamento NÃO gera crédito)
  const creditStandard = valStandard * newTaxRate; // Crédito cheio
  const creditSimples = valSimples * 0.05; // Crédito restrito (aproximadamente 5%)
  const totalCredit = creditStandard + creditSimples;

  const newTax = Math.max(0, debit - totalCredit);
  const difference = newTax - currentTax;
  const isWorse = difference > 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight flex items-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            Simulador Financeiro (IVA Dual)
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Descubra o impacto real na sua margem. Compare o imposto atual com o novo sistema de débitos e créditos.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Formulário de Input */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Seus Custos Mensais (Base)</CardTitle>
                <CardDescription>
                  Insira valores aproximados para uma estimativa rápida.
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
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payroll" className="font-bold flex items-center gap-2">
                    Folha de Pagamento & Encargos
                    <Info className="h-4 w-4 text-destructive" />
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1">Não gera crédito de IBS/CBS.</p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="payroll" 
                      type="number" 
                      className="pl-9"
                      value={payroll}
                      onChange={(e) => setPayroll(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplies-std" className="font-bold flex items-center gap-2">
                    Compras (Fornecedores Lucro Real/Presumido)
                    <Info className="h-4 w-4 text-green-500" />
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1">Gera crédito CHEIO (26,5%). Insumos, energia, serviços B2B.</p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="supplies-std" 
                      type="number" 
                      className="pl-9"
                      value={suppliesStandard}
                      onChange={(e) => setSuppliesStandard(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplies-simples" className="font-bold flex items-center gap-2">
                    Compras (Fornecedores Simples Nacional)
                    <Info className="h-4 w-4 text-accent" />
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1">Gera crédito RESTRITO (apenas o que foi pago na guia).</p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="supplies-simples" 
                      type="number" 
                      className="pl-9"
                      value={suppliesSimples}
                      onChange={(e) => setSuppliesSimples(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-muted">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                * Simulação simplificada para fins educacionais. Não substitui cálculo contábil exato, pois não contabiliza IPI, ICMS-ST, variações de NCM ou redutores específicos de alíquota.
              </AlertDescription>
            </Alert>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold font-heading mb-4">Análise de Impacto Tributário</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cenário Atual ({data.regime.replace("_", " ").toUpperCase()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono">{formatCurrency(currentTax)}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Imposto sobre faturamento (aprox. {(currentTaxRate * 100).toFixed(1)}%)
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-2 ${isWorse ? "border-destructive/50 bg-destructive/5" : "border-green-500/50 bg-green-50"}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    Novo Cenário (IBS/CBS)
                    {isWorse ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold font-mono ${isWorse ? "text-destructive" : "text-green-700"}`}>
                    {formatCurrency(newTax)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    Alíquota Efetiva: {((newTax / valRevenue) * 100).toFixed(1)}%
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
                  <span className="text-muted-foreground">Débito Gerado nas Vendas (26,5%):</span>
                  <span className="font-mono text-destructive font-medium">{formatCurrency(debit)}</span>
                </div>
                
                <div className="space-y-2 border-t pt-4">
                  <span className="text-sm text-muted-foreground font-medium">Créditos Abatidos:</span>
                  <div className="flex justify-between items-center text-sm pl-4">
                    <span className="text-muted-foreground">De Fornecedores Gerais (26,5%):</span>
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
                    <span>Total de Créditos Utilizados:</span>
                    <span className="font-mono text-green-600">- {formatCurrency(totalCredit)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                  <span>Imposto a Pagar:</span>
                  <span className="font-mono">{formatCurrency(newTax)}</span>
                </div>
              </CardContent>
            </Card>

            {isWorse ? (
              <Alert className="border-destructive border-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertTitle className="text-destructive font-bold text-lg">Atenção Estratégica!</AlertTitle>
                <AlertDescription className="text-sm mt-2 space-y-2 text-foreground">
                  <p>Sua carga tributária tende a <strong>aumentar em {formatCurrency(difference)} por mês</strong> ({formatCurrency(difference * 12)}/ano).</p>
                  <p><strong>Por que isso aconteceu?</strong> A soma da sua folha de pagamento e compras do Simples Nacional representa uma grande fatia dos seus custos, e eles geram zero ou muito pouco crédito tributário.</p>
                  <p className="font-bold text-primary mt-3">Plano de Ação para recuperar margem:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Revisar a precificação final dos seus produtos (repasse).</li>
                    <li>Auditar fornecedores do Simples: vale a pena trocar para empresas de Lucro Presumido/Real?</li>
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-500 border-2 bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-700 font-bold text-lg">Cenário Favorável</AlertTitle>
                <AlertDescription className="text-sm mt-2 text-foreground">
                  <p>Sua carga tributária efetiva tende a <strong>diminuir em {formatCurrency(Math.abs(difference))} por mês</strong>.</p>
                  <p><strong>Por que isso aconteceu?</strong> Você possui uma cadeia de suprimentos forte em regimes não-cumulativos, permitindo abater grande parte do imposto devido através de créditos das suas compras.</p>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end pt-4">
              <Link href="/pricing-strategy">
                <Button variant="outline" className="mr-3">
                  Revisar Precificação
                </Button>
              </Link>
              <Link href="/final-checklist">
                <Button>
                  Ir para Checklist Final
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
