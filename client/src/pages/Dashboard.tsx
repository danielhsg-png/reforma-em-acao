import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CalendarDays, CheckCircle2, ChevronRight, FileText, Landmark, LayoutList, Scale, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="bg-secondary/40 border-b border-border">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="bg-primary hover:bg-primary">Diagnóstico Concluído</Badge>
                <span className="text-sm font-medium text-muted-foreground flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Atualizado com PLP 68/2024
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mt-2 uppercase tracking-tight">
                Plano de Ação: REFORMA EM AÇÃO
              </h1>
              <p className="text-muted-foreground mt-2 max-w-3xl text-lg">
                Fundamentado na <strong>EC 132/23, LC 214/25, LC 227/26</strong> e Notas Técnicas RFB.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="bg-background border rounded-md px-3 py-1.5 text-sm font-medium flex items-center shadow-sm">
                  <Landmark className="h-4 w-4 mr-2 text-muted-foreground" />
                  Comércio Varejista
                </div>
                <div className="bg-background border rounded-md px-3 py-1.5 text-sm font-medium flex items-center shadow-sm">
                  <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
                  Lucro Presumido
                </div>
                <div className="bg-background border rounded-md px-3 py-1.5 text-sm font-medium flex items-center shadow-sm">
                  <LayoutList className="h-4 w-4 mr-2 text-muted-foreground" />
                  B2C / Misto
                </div>
              </div>
            </div>
            
            <Card className="md:w-80 bg-background shadow-md border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Aviso Importante</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      As recomendações são indicativas e baseadas em cenários simulados. <strong>A validação por um contador ou advogado tributarista é indispensável</strong> antes de mudanças estruturais.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
        
        <Tabs defaultValue="visao_geral" className="space-y-8">
          <TabsList className="bg-secondary p-1 h-auto flex flex-wrap gap-1 justify-start">
            <TabsTrigger value="visao_geral" className="py-2.5 px-4 font-medium">Visão Executiva</TabsTrigger>
            <TabsTrigger value="cronograma" className="py-2.5 px-4 font-medium">Cronograma de Ação (Curto, Médio, Longo)</TabsTrigger>
            <TabsTrigger value="operacoes" className="py-2.5 px-4 font-medium">Impacto Operacional & Custos</TabsTrigger>
            <TabsTrigger value="estrategia" className="py-2.5 px-4 font-medium">Recomendações Estratégicas</TabsTrigger>
          </TabsList>

          {/* TAB: VISÃO GERAL */}
          <TabsContent value="visao_geral" className="space-y-8 animate-in fade-in">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Carga Tributária Efetiva
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-foreground">Aumento</div>
                    <TrendingUp className="h-6 w-6 text-destructive mb-1" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                    Sua alíquota nominal subirá de forma significativa (saída do Presumido para IVA base de ~26.5%). O impacto real depende do repasse de preços ao B2C.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Geração de Créditos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-foreground">Ampliada</div>
                    <TrendingUp className="h-6 w-6 text-green-500 mb-1" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                    Com a não-cumulatividade plena, energia, aluguéis e praticamente todos os serviços e insumos contratados de outras empresas gerarão crédito.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-accent shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Complexidade Sistêmica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-foreground">Crítica</div>
                    <AlertCircle className="h-6 w-6 text-accent mb-1" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                    De 2026 a 2032, seu ERP e faturamento terão que lidar com o sistema antigo (ICMS/PIS/COFINS) e o novo (IBS/CBS) simultaneamente.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <div className="border-b bg-muted/30 px-6 py-4">
                <h3 className="text-lg font-bold font-heading flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  O que é diagnóstico e o que é recomendação?
                </h3>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-destructive mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Diagnóstico Direto
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                      Margens espremidas: Por vender muito para B2C, o repasse de 100% do aumento de carga pode derrubar vendas.
                    </li>
                    <li className="flex items-start text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                      Fornecedores informais ou do Simples Nacional que não optarem por destacar IBS/CBS representarão "custo morto", pois não gerarão crédito integral.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-green-600 mb-3 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Sugestões de Ação
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2 shrink-0" />
                      Iniciar auditoria da base de fornecedores: classifique quem gera crédito e quem não gera, para renegociar contratos a tempo.
                    </li>
                    <li className="flex items-start text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2 shrink-0" />
                      Validar com seu fornecedor de software (ERP) o cronograma de atualização para a "fase de teste" da CBS em 2026.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* TAB: CRONOGRAMA */}
          <TabsContent value="cronograma" className="animate-in fade-in">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Plano de Ação no Tempo</CardTitle>
                <CardDescription>O que deve estar no radar da sua diretoria e contabilidade nos próximos anos.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l border-border ml-3 space-y-10 py-4">
                  
                  <div className="relative pl-8">
                    <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                      <span className="text-primary-foreground text-xs font-bold">1</span>
                    </span>
                    <h3 className="text-xl font-bold text-foreground">Curto Prazo <span className="text-sm font-normal text-muted-foreground ml-2">(2024 - 2025)</span></h3>
                    <p className="text-sm font-medium text-primary mt-1 mb-3">Fase de Preparação e Orçamento</p>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <ChevronRight className="h-4 w-4 text-primary mr-1 shrink-0 mt-0.5" />
                          <span><strong>Mapeamento de Fornecedores:</strong> Avalie sua cadeia atual. Quem não gerar crédito integral do novo IVA pode precisar ser substituído ou renegociado.</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <ChevronRight className="h-4 w-4 text-primary mr-1 shrink-0 mt-0.5" />
                          <span><strong>Budget de TI:</strong> Aloque orçamento para atualização de ERP e PDV, que precisarão de adaptações robustas antes de 2026.</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <ChevronRight className="h-4 w-4 text-primary mr-1 shrink-0 mt-0.5" />
                          <span><strong>Análise Societária:</strong> Valide com advogados se manter-se no Lucro Presumido fará sentido ou se a mudança para Lucro Real será obrigatória por conta dos créditos.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="relative pl-8">
                    <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-accent ring-4 ring-background">
                      <span className="text-accent-foreground text-xs font-bold">2</span>
                    </span>
                    <h3 className="text-xl font-bold text-foreground">Médio Prazo <span className="text-sm font-normal text-muted-foreground ml-2">(2026 - 2028)</span></h3>
                    <p className="text-sm font-medium text-accent mt-1 mb-3">Transição Inicial e Testes (CBS)</p>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <ChevronRight className="h-4 w-4 text-accent mr-1 shrink-0 mt-0.5" />
                          <span><strong>2026:</strong> Início da cobrança da CBS (Federal) a uma alíquota de 0,9%. O PIS e a COFINS serão reduzidos de forma correspondente. Teste dos sistemas de faturamento na prática.</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <ChevronRight className="h-4 w-4 text-accent mr-1 shrink-0 mt-0.5" />
                          <span><strong>2027:</strong> Extinção total do PIS/COFINS e adoção plena da CBS. Redução de 10% do ICMS e ISS. Começa o período de <strong>convivência de dois sistemas</strong> (velho e novo).</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="relative pl-8">
                    <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-muted-foreground ring-4 ring-background">
                      <span className="text-background text-xs font-bold">3</span>
                    </span>
                    <h3 className="text-xl font-bold text-foreground">Longo Prazo <span className="text-sm font-normal text-muted-foreground ml-2">(2029 - 2033)</span></h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1 mb-3">Transição do IBS (Estadual/Municipal) e Fim do Sistema Antigo</p>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <ChevronRight className="h-4 w-4 text-muted-foreground mr-1 shrink-0 mt-0.5" />
                          <span><strong>Faseamento gradual:</strong> O ICMS e o ISS diminuem proporcionalmente a cada ano, enquanto a alíquota do IBS sobe, até a extinção completa em 2033.</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <ChevronRight className="h-4 w-4 text-muted-foreground mr-1 shrink-0 mt-0.5" />
                          <span>Atenção aos repasses de preços ano a ano, acompanhando as tabelas de transição.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: OPERACOES */}
          <TabsContent value="operacoes" className="animate-in fade-in">
             <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Formação de Preço (Pricing)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O modelo de cálculo do imposto passa a ser <strong>"por fora"</strong> (base não integra o próprio imposto).
                  </p>
                  <div className="p-4 border rounded-lg bg-secondary/20">
                    <h5 className="font-bold text-sm mb-2">Exemplo Prático (Varejo B2C):</h5>
                    <p className="text-sm mb-2">Você vende um produto por R$ 100 hoje.</p>
                    <ul className="text-sm space-y-1 mt-2 border-t pt-2">
                      <li>• A percepção de preço do cliente final pode mudar com o destaque explícito do tributo (~26.5%).</li>
                      <li>• Sua margem dependerá do volume de créditos acumulados nas compras de mercadorias, energia, frete e serviços.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contratos e Jurídico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Contratos de longo prazo (como fornecimento contínuo, aluguéis atípicos, prestação de serviço) precisam de cláusulas de transição.
                  </p>
                  <div className="p-3 bg-accent/10 text-accent-foreground rounded border border-accent/20 text-sm">
                    <strong>Ponto de Atenção:</strong> É necessário incluir cláusulas prevendo o repasse das novas alíquotas de CBS e IBS conforme elas entrarem em vigor entre 2026 e 2033.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: ESTRATEGIA */}
          <TabsContent value="estrategia" className="animate-in fade-in">
             <Card>
                <CardHeader>
                  <CardTitle>Seu Plano de Ação Individualizado</CardTitle>
                  <CardDescription>Resumo prático para levar à próxima reunião de diretoria.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">1. Auditoria de ERP (Imediato)</h4>
                        <p className="text-sm text-muted-foreground mt-1">Convoque o provedor do seu sistema. Exija o roadmap deles para adaptação ao layout da nova nota fiscal eletrônica e módulo de cálculo "por fora".</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">2. "Rating" de Fornecedores (Próximos 6 meses)</h4>
                        <p className="text-sm text-muted-foreground mt-1">Peça ao setor de Compras/Suprimentos para listar os Top 50 fornecedores e verificar quais deles são do Simples Nacional ou informais. Inicie planejamento de alternativas.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">3. Simulação Financeira (Ano base 2025)</h4>
                        <p className="text-sm text-muted-foreground mt-1">Peça à contabilidade uma "simulação sombra": pegar os custos reais de 2024 e aplicar as regras do IVA Dual (crédito amplo vs débito de 26,5%). Isso revelará se sua margem cairá ou subirá.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t flex justify-end p-6">
                  <Button variant="default">
                    <FileText className="mr-2 h-4 w-4" />
                    Baixar Relatório em PDF
                  </Button>
                </CardFooter>
              </Card>
          </TabsContent>

        </Tabs>
      </div>
    </MainLayout>
  );
}
