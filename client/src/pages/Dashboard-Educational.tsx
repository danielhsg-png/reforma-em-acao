import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowRight, CheckCircle2, DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function DashboardEducational() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight">
            O que Muda com a Reforma
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Entenda os pilares da transformação tributária brasileira e como ela afeta sua operação.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        {/* Resumo Executivo */}
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Resumo Executivo</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-l-4 border-l-destructive shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sistema Antigo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">PIS / COFINS (Federal)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">IPI (Federal)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">ICMS (Estadual)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">ISS (Municipal)</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Período de Transição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm font-medium text-accent flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  2026 a 2033
                </div>
                <p className="text-xs text-muted-foreground">
                  Ambos os sistemas funcionarão simultaneamente, com alíquotas se reduzindo gradualmente.
                </p>
                <div className="text-xs font-mono bg-muted p-2 rounded mt-2">
                  Convivência de dois sistemas
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sistema Novo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">CBS (Contribuição Social - Federal)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">IBS (Imposto sobre Bens e Serviços - Estadual/Municipal)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">IS (Imposto Seletivo - para itens específicos)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Nova Lógica */}
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Nova Lógica Tributária</h2>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Débito na Venda × Crédito na Compra
              </CardTitle>
              <CardDescription>
                O modelo passa a ser não-cumulativo. Você toma crédito sobre praticamente tudo que compra.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold text-destructive mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Débito Tributário
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Quando você <strong>vende</strong>, o IBS/CBS é lançado como débito. Você fica devendo este imposto ao governo.
                  </p>
                  <div className="mt-3 p-2 bg-background rounded text-xs font-mono">
                    Venda de R$ 100 + IBS 15% = R$ 15 de débito
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold text-green-600 mb-3 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Crédito Tributário
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Quando você <strong>compra</strong> de outra empresa que cobrou o imposto, você toma crédito e reduz o débito.
                  </p>
                  <div className="mt-3 p-2 bg-background rounded text-xs font-mono">
                    Compra de R$ 50 + IBS 15% = R$ 7,50 de crédito
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h5 className="font-bold text-primary mb-2">Resultado Final</h5>
                <p className="text-sm">
                  Débito (R$ 15) - Crédito (R$ 7,50) = <strong>Imposto a Recolher: R$ 7,50</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Mas se suas compras não forem documentadas corretamente, você perde o crédito e recolhe R$ 15 inteiros.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Vantagem Competitiva */}
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Competitividade: Quem se Organiza Ganha</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  Empresas Organizadas em 2026
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                    <span><strong>Margens protegidas:</strong> Conhecem o custo real e ajustam preços sem sustos.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                    <span><strong>Menos erros:</strong> Cadastros padronizados = menos notas rejeitadas.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                    <span><strong>Crédito otimizado:</strong> Sabem exatamente onde estão os créditos.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                    <span><strong>Negociação forte:</strong> Clientes B2B preferem fornecedores organizados.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Empresas Desorganizadas em 2026
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                    <span><strong>Operando no escuro:</strong> Não sabem o custo real até o fechamento.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                    <span><strong>Muitos erros:</strong> Notas devolvidas, retrabalho, penalidades.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                    <span><strong>Crédito perdido:</strong> Compras não-documentadas = sem crédito.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                    <span><strong>Descoberta tardia:</strong> Só percebem o problema quando a margem já foi.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Penalidade Automática */}
        <section>
          <Alert className="border-2 border-destructive bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-lg text-destructive font-bold">Penalidade Automática: 1% sem defesa</AlertTitle>
            <AlertDescription className="text-sm mt-2">
              Se a nota fiscal <strong>não tiver o IBS/CBS preenchido corretamente</strong>, a RFB aplica automaticamente uma penalidade de 1% sobre o valor da operação, sem aviso prévio e sem direito a defesa prévia.
              <br />
              <strong className="block mt-2">Isso não é crédito. É perda financeira direta.</strong>
            </AlertDescription>
          </Alert>
        </section>

        <div className="flex justify-end pt-6 border-t">
          <Link href="/risk-assessment">
            <Button size="lg" className="gap-2">
              Próximo: Diagnóstico de Risco
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
