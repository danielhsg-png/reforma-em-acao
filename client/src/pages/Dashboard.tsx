import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowDownRight, ArrowUpRight, CheckCircle2, ChevronRight, FileText, Info, Scale, Settings, Truck } from "lucide-react";

export default function Dashboard() {
  const [businessMode, setBusinessMode] = useState(true); // true = business language, false = technical

  return (
    <MainLayout>
      <div className="bg-secondary/30 border-b border-border">
        <div className="container max-w-screen-2xl mx-auto py-6 px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-heading text-foreground">Relatório de Impacto: Reforma Tributária</h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Badge variant="outline" className="bg-background">Empresa de Serviços</Badge>
                <Badge variant="outline" className="bg-background">Lucro Presumido</Badge>
                <Badge variant="outline" className="bg-background">B2B Misto</Badge>
              </p>
            </div>
            
            <div className="flex items-center space-x-3 bg-background p-2 rounded-lg border shadow-sm">
              <Label htmlFor="language-mode" className="text-sm font-medium cursor-pointer">Modo Técnico</Label>
              <Switch 
                id="language-mode" 
                checked={businessMode}
                onCheckedChange={setBusinessMode}
              />
              <Label htmlFor="language-mode" className="text-sm font-medium text-primary cursor-pointer">Modo Negócios</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
        
        {/* Executive Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                Carga Tributária (Estimativa)
                <Scale className="h-4 w-4 text-destructive" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Aumento Potencial</div>
              <p className="text-sm text-muted-foreground mt-1 flex items-center">
                <ArrowUpRight className="h-4 w-4 text-destructive mr-1" />
                Devido à não-cumulatividade plena
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                Créditos Tributários
                <FileText className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Aumento de Geração</div>
              <p className="text-sm text-muted-foreground mt-1 flex items-center">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                Mais insumos darão direito a crédito
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                Complexidade de Transição
                <Settings className="h-4 w-4 text-accent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Alta</div>
              <p className="text-sm text-muted-foreground mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 text-accent mr-1" />
                Atenção a sistemas e contratos
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="precificacao" className="space-y-6">
          <TabsList className="bg-secondary p-1 h-auto flex flex-wrap gap-1 justify-start">
            <TabsTrigger value="precificacao" className="py-2">Precificação & Vendas</TabsTrigger>
            <TabsTrigger value="suprimentos" className="py-2">Fornecedores & Compras</TabsTrigger>
            <TabsTrigger value="sistemas" className="py-2">Sistemas & Processos</TabsTrigger>
          </TabsList>

          <TabsContent value="precificacao" className="space-y-6 animate-in fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-accent" />
                    {businessMode ? "Repasse de Preços nos Serviços" : "Impacto na Alíquota (CBS/IBS) vs ISS/PIS/COFINS"}
                  </CardTitle>
                  <CardDescription>
                    {businessMode 
                      ? "O que muda na hora de cobrar seu cliente final." 
                      : "Comparativo de alíquota efetiva e nominal na prestação de serviços."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <h4 className="font-semibold text-accent-foreground mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" /> O que acontece?
                    </h4>
                    <p className="text-sm">
                      {businessMode 
                        ? "Empresas de serviços costumam pagar menos impostos hoje. Com a reforma, a alíquota geral vai subir para cerca de 26,5%. Seus clientes que são empresas (B2B) não vão sentir tanto, porque vão poder abater esse imposto. Mas clientes finais (pessoas físicas) vão sentir o aumento."
                        : "A transição do regime cumulativo (Lucro Presumido) para o IVA Dual (não-cumulativo) elevará a alíquota nominal de ~8,65% (ISS+PIS/COFINS) para a alíquota de referência (~26,5%). O impacto real depende da capacidade de tomar créditos da cadeia."}
                    </p>
                  </div>
                  
                  <h4 className="font-semibold mt-4">Ação Recomendada:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span className="text-sm">Mapear quais contratos são B2B (onde o aumento de imposto gera crédito para o cliente) e quais são B2C.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span className="text-sm">Revisar cláusulas contratuais de reajuste para prever os efeitos do período de transição (2026-2032).</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {businessMode ? "Negociação com Clientes" : "Destacamento de Tributos e Transparência"}
                  </CardTitle>
                  <CardDescription>
                    Como a nova nota fiscal altera a percepção de valor.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {businessMode 
                      ? "Seu cliente B2B agora vai olhar muito mais para quanto de 'crédito' sua nota fiscal gera para ele, do que apenas para o preço final. O valor do imposto virá totalmente separado ('por fora') na nota."
                      : "O IVA Dual impõe o modelo 'por fora', onde o CBS e IBS não compõem a própria base de cálculo. Clientes do Lucro Real priorizarão fornecedores que geram crédito integral."}
                  </p>

                  <div className="p-4 border rounded-lg bg-background">
                    <div className="flex justify-between items-center text-sm font-medium mb-2 border-b pb-2">
                      <span>Antes da Reforma (Exemplo)</span>
                      <span>Preço Final: R$ 10.000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-primary">
                      <span>Pós Reforma (Exemplo)</span>
                      <span>Preço R$ 7.905 + Imposto R$ 2.095</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
          
          {/* Outras tabs seriam preenchidas de forma similar, mantendo a simplicidade para o mockup */}
          <TabsContent value="suprimentos" className="animate-in fade-in">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    {businessMode ? "Revisão de Fornecedores" : "Maximização de Créditos (Não-cumulatividade)"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {businessMode 
                      ? "A regra de ouro muda: comprar de fornecedores que pagam imposto cheio passa a ser melhor, porque tudo o que você compra para a operação da empresa vai abater o imposto que você tem que pagar. Fornecedores do Simples Nacional vão gerar menos abatimento."
                      : "Implementação da não-cumulatividade plena: créditos financeiros amplos. A aquisição de optantes do Simples Nacional gerará crédito restrito ao montante efetivamente recolhido pelo fornecedor nas guias do DAS."}
                  </p>
                </CardContent>
              </Card>
          </TabsContent>
          
          <TabsContent value="sistemas" className="animate-in fade-in">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Atualização de ERP e Faturamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Durante 7 anos (2026 a 2032), sua empresa terá que conviver com dois sistemas de impostos ao mesmo tempo: o antigo (PIS/COFINS/ISS) e o novo (CBS/IBS).
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive-foreground rounded border border-destructive/20 text-sm font-medium">
                    <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                    É crítico começar a orçar e planejar a atualização do seu sistema de gestão (ERP) ainda este ano.
                  </div>
                </CardContent>
              </Card>
          </TabsContent>

        </Tabs>

      </div>
    </MainLayout>
  );
}
