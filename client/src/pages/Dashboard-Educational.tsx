import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowRight, CheckCircle2, DollarSign, Zap, CreditCard, ShieldCheck, FileText, Clock, Banknote, ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";

const REGIME_DETAILS: Record<string, { label: string; rate: string; ref: string }> = {
  saude_servicos: { label: "Servicos de Saude", rate: "60% de reducao", ref: "LC 214, art. 275" },
  saude_dispositivos: { label: "Dispositivos Medicos", rate: "60% de reducao", ref: "LC 214, art. 276" },
  saude_medicamentos: { label: "Medicamentos", rate: "60% de reducao / zero (CMED)", ref: "LC 214, art. 277" },
  educacao: { label: "Educacao", rate: "60% de reducao", ref: "LC 214, art. 274" },
  cesta_basica: { label: "Cesta Basica Nacional", rate: "Aliquota zero", ref: "LC 214, arts. 282-287" },
  alimentos_reduzidos: { label: "Alimentos com Reducao", rate: "60% de reducao", ref: "LC 214" },
  agro_insumos: { label: "Insumos Agropecuarios", rate: "60% de reducao", ref: "LC 214, art. 279" },
  transporte_coletivo: { label: "Transporte Coletivo", rate: "60% de reducao", ref: "LC 214, art. 280" },
  profissional_liberal: { label: "Profissional Liberal", rate: "30% de reducao", ref: "LC 214/LC 227" },
  imobiliario: { label: "Operacoes Imobiliarias", rate: "Regime especifico", ref: "LC 214, arts. 257-263" },
  combustiveis: { label: "Combustiveis", rate: "Monofasico (aliquota fixa)", ref: "LC 214, arts. 246-256" },
  financeiro: { label: "Servicos Financeiros", rate: "Regime cumulativo especifico", ref: "LC 214, arts. 264-268" },
  cooperativa: { label: "Cooperativas", rate: "Atos cooperativos especiais", ref: "LC 214, arts. 269-273" },
  zfm: { label: "Zona Franca de Manaus", rate: "Beneficios mantidos + credito presumido", ref: "LC 214, arts. 448-473" },
  hotelaria_turismo: { label: "Hotelaria e Turismo", rate: "60% de reducao", ref: "LC 214" },
  higiene_limpeza: { label: "Higiene e Limpeza", rate: "60% de reducao", ref: "LC 214, art. 278" },
  cultura: { label: "Cultura e Arte", rate: "60% de reducao / zero (livros)", ref: "LC 214" },
  seguranca_nacional: { label: "Seguranca Nacional", rate: "Reducao especifica", ref: "LC 214" },
  seletivo_bebidas: { label: "Bebidas (IS)", rate: "Imposto Seletivo ADICIONAL", ref: "LC 214, arts. 393-421" },
  seletivo_tabaco: { label: "Tabaco (IS)", rate: "Imposto Seletivo ADICIONAL", ref: "LC 214" },
  seletivo_veiculos: { label: "Veiculos (IS)", rate: "Imposto Seletivo ADICIONAL", ref: "LC 214" },
  seletivo_minerio: { label: "Mineracao (IS)", rate: "IS 0,25% a 1%", ref: "LC 214" },
};

export default function DashboardEducational() {
  const { data } = useAppStore();
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight" data-testid="text-educational-title">
            O que Muda com a Reforma
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Entenda os pilares da transformacao tributaria brasileira e como ela afeta sua operacao.
            Base legal: EC 132/2023, LC 214/2025, LC 227/2026.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6" data-testid="text-resumo-title">Resumo Executivo</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-l-4 border-l-destructive shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sistema Antigo (Extinto ate 2033)</CardTitle>
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
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                  5 tributos com legislacoes diferentes, 27 regulamentos de ICMS, mais de 5.500 regulamentos de ISS.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Periodo de Transicao</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm font-medium text-accent flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  2026 a 2033 (8 anos)
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p><strong>2026:</strong> CBS 0,9% + IBS 0,1% (fase de teste)</p>
                  <p><strong>2027:</strong> CBS plena. PIS/COFINS extintos. IBS a 0,1%.</p>
                  <p><strong>2029-2032:</strong> ICMS/ISS reduzidos 10%/ano; IBS sobe proporcionalmente</p>
                  <p><strong>2033:</strong> ICMS e ISS extintos. IBS pleno.</p>
                </div>
                <div className="text-xs font-mono bg-muted p-2 rounded mt-2">
                  Convivencia de dois sistemas ate 2033
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sistema Novo (IVA Dual)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">CBS (Federal) - aliquota ref. ~8,8%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">IBS (Estadual/Municipal) - aliquota ref. ~17,7%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">IS (Imposto Seletivo) - itens especificos</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                  Aliquota combinada de referencia: 26,5% (LC 214/2025, art. 9o). Calculo "por fora" (nao integra a propria base).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Nova Logica Tributaria</h2>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Debito na Venda x Credito na Compra
              </CardTitle>
              <CardDescription>
                O modelo passa a ser nao-cumulativo pleno (LC 214/2025, arts. 28-47). Voce toma credito sobre praticamente tudo que compra de outra empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold text-destructive mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Debito Tributario (Saida)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Quando voce <strong>vende</strong>, o IBS/CBS e lancado como debito. Voce fica devendo este imposto ao governo.
                  </p>
                  <div className="mt-3 p-2 bg-background rounded text-xs font-mono">
                    Venda de R$ 100 x 26,5% = R$ 26,50 de debito
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    O imposto e calculado "por fora" (art. 12, LC 214): nao integra sua propria base de calculo.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold text-green-600 mb-3 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Credito Tributario (Entrada)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Quando voce <strong>compra</strong> de outra empresa, voce toma credito e reduz o debito. Credito amplo em bens, servicos, energia, aluguel, frete.
                  </p>
                  <div className="mt-3 p-2 bg-background rounded text-xs font-mono">
                    Compra de R$ 60 x 26,5% = R$ 15,90 de credito
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Excecoes: bens de uso pessoal, servicos de lazer e entretenimento (art. 36, LC 214).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h5 className="font-bold text-primary mb-2">Resultado Final</h5>
                <p className="text-sm">
                  Debito (R$ 26,50) - Credito (R$ 15,90) = <strong>Imposto a Recolher: R$ 10,60</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Se suas compras nao forem documentadas corretamente (NF-e sem campos IBS/CBS), voce perde o credito e recolhe R$ 26,50 inteiros.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Mecanismos Criticos da Reforma</h2>
          <Tabs defaultValue="split" className="space-y-4">
            <TabsList className="bg-secondary h-auto flex flex-wrap gap-1 p-1">
              <TabsTrigger value="split" className="py-2 px-3 text-sm">Split Payment</TabsTrigger>
              <TabsTrigger value="nfe" className="py-2 px-3 text-sm">NF-e / Campos Novos</TabsTrigger>
              <TabsTrigger value="cashback" className="py-2 px-3 text-sm">Cashback</TabsTrigger>
              <TabsTrigger value="destino" className="py-2 px-3 text-sm">Principio do Destino</TabsTrigger>
            </TabsList>

            <TabsContent value="split" className="animate-in fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Split Payment (Pagamento Cindido)
                  </CardTitle>
                  <CardDescription>LC 214/2025, arts. 50-55 | LC 227/2026</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O <strong>Split Payment</strong> e a retencao automatica do IBS/CBS no momento da liquidacao financeira da operacao. O imposto e separado antes de chegar ao vendedor.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <h5 className="font-bold text-sm mb-2 flex items-center gap-1">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Cartao de Credito/Debito
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        A adquirente (maquininha) retira automaticamente o IBS/CBS do valor da venda antes de repassar ao lojista. Voce recebe o valor liquido.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <h5 className="font-bold text-sm mb-2 flex items-center gap-1">
                        <Banknote className="h-4 w-4 text-primary" />
                        PIX / Transferencia
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        Instituicoes financeiras farao a retencao automatica em operacoes identificadas (B2B com NF-e vinculada). O Banco Central regulamentara os fluxos.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <h5 className="font-bold text-sm mb-2 flex items-center gap-1">
                        <FileText className="h-4 w-4 text-primary" />
                        Boleto Bancario
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        Boletos registrados com NF-e vinculada terao o tributo retido na liquidacao. Isso altera o fluxo de caixa do vendedor.
                      </p>
                    </div>
                  </div>
                  <Alert className="border-accent bg-accent/5">
                    <AlertTriangle className="h-4 w-4 text-accent" />
                    <AlertDescription className="text-sm">
                      <strong>Impacto no fluxo de caixa:</strong> Hoje voce recebe 100% e recolhe o imposto depois. Com o Split Payment, o imposto e retido na hora. O caixa disponivel diminui imediatamente.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nfe" className="animate-in fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Novos Campos na NF-e
                  </CardTitle>
                  <CardDescription>NT 2025.002 v1.34 - Nota Tecnica RFB/ENCAT</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    A NF-e (modelo 55) ganha um novo grupo de campos obrigatorios para documentar IBS e CBS a partir de 01/01/2026.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-bold text-sm text-primary">cClassTrib (Classificacao Tributaria)</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Codigo que identifica o tratamento tributario do item (tributacao integral, reducao de aliquota, isencao, imunidade, diferimento, etc.). Cada produto/servico devera ter um cClassTrib correto cadastrado.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-bold text-sm text-primary">cCredPres (Credito Presumido)</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Indicador de credito presumido para o adquirente. Aplicavel quando o vendedor e do Simples Nacional ou em situacoes de credito presumido previstas na LC 214.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-bold text-sm text-primary">Grupo IBS/CBS por item</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cada item da NF-e tera campos especificos: aliquota de IBS estadual, aliquota de IBS municipal, aliquota de CBS, base de calculo, e valor calculado de cada tributo. NCM e NBS sao usados para determinar o enquadramento.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-bold text-sm text-primary">Vinculacao ao Pagamento</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        NF-e, CT-e e BPe ganham campos de vinculacao ao meio de pagamento para viabilizar o Split Payment. A NT 2026.001 trata da vinculacao entre documento fiscal e liquidacao financeira.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm font-bold text-destructive">
                      Aliquotas de Teste em 2026
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CBS: 0,9% | IBS: 0,1% (total 1,0%). Estas aliquotas devem estar configuradas no seu sistema a partir de 01/01/2026. Se a NF-e nao tiver esses campos preenchidos, aplica-se penalidade automatica.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cashback" className="animate-in fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-primary" />
                    Cashback Tributario
                  </CardTitle>
                  <CardDescription>LC 214/2025, arts. 106-112</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Familias inscritas no CadUnico com renda per capita de ate meio salario minimo terao direito a devolucao de parte do IBS/CBS pago em compras essenciais.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg bg-green-50">
                      <h5 className="font-bold text-sm text-green-700">100% de devolucao</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Gas de cozinha (GLP ate 13kg), energia eletrica (ate consumo definido), agua e esgoto.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <h5 className="font-bold text-sm text-blue-700">20% de devolucao</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Demais bens e servicos. Devolucao via PIX vinculado ao CPF do beneficiario, em ate 15 dias.
                      </p>
                    </div>
                  </div>
                  <Alert className="bg-muted">
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Para empresarios:</strong> O cashback nao altera sua operacao fiscal. A devolucao e feita diretamente pelo governo ao consumidor. Porem, clientes beneficiarios podem preferir comprar de estabelecimentos que emitem NF-e corretamente (para rastrear o beneficio).
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="destino" className="animate-in fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowDown className="h-5 w-5 text-primary" />
                    Principio do Destino
                  </CardTitle>
                  <CardDescription>EC 132/2023, art. 156-A, inciso I</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O IBS sera recolhido integralmente no estado e municipio do <strong>consumidor</strong> (destino), nao do produtor/vendedor (origem). Isso elimina a "guerra fiscal" entre estados.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-bold text-sm">O que muda para voce?</h5>
                      <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          Cada venda interestadual usa a aliquota do estado de destino
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          Sem DIFAL ou partilha de ICMS entre estados (simplificacao)
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          Comite Gestor do IBS centraliza a arrecadacao e faz a distribuicao
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          E-commerce e marketplace: imposto recolhido pelo estado do comprador
                        </li>
                      </ul>
                    </div>
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Transicao gradual:</strong> De 2029 a 2078 (50 anos), a receita do IBS sera gradualmente transferida da origem para o destino, com mecanismos de compensacao para estados que percam arrecadacao.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

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
                    <span><strong>Margens protegidas:</strong> Conhecem o custo real e ajustam precos sem sustos.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                    <span><strong>Menos erros:</strong> Cadastros padronizados = menos notas rejeitadas.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                    <span><strong>Credito otimizado:</strong> Sabem exatamente onde estao os creditos e o cClassTrib correto de cada item.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                    <span><strong>Negociacao forte:</strong> Clientes B2B preferem fornecedores que geram credito integral.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                    <span><strong>Fluxo de caixa previsivel:</strong> Preparadas para o impacto do Split Payment no recebimento.</span>
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
                    <span><strong>Operando no escuro:</strong> Nao sabem o custo real ate o fechamento.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                    <span><strong>Muitos erros:</strong> Notas devolvidas, retrabalho, penalidades de 1%.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                    <span><strong>Credito perdido:</strong> Compras nao-documentadas ou sem cClassTrib = sem credito.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                    <span><strong>Descoberta tardia:</strong> So percebem o problema quando a margem ja foi.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                    <span><strong>Clientes fogem:</strong> B2B migra para fornecedores que emitem nota correta e geram credito.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Cronograma Oficial da Transicao</h2>
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="relative border-l-2 border-primary/30 ml-4 space-y-6">
                {[
                  { year: "2026", color: "bg-primary", title: "Fase de Teste", desc: "CBS a 0,9% e IBS a 0,1%. PIS/COFINS reduzidos em 0,9pp. Compensacao via declaracao. Sistemas devem emitir NF-e com campos IBS/CBS." },
                  { year: "2027", color: "bg-accent", title: "CBS Plena", desc: "Extincao do PIS e COFINS. CBS com aliquota plena (~8,8%). IBS se mantem a 0,1%. IPI zerado, exceto para produtos com similar na ZFM." },
                  { year: "2028", color: "bg-accent", title: "Transicao IBS", desc: "IBS sobe para cobrir a reducao de 10% do ICMS e ISS. Primeiro ano de coexistencia real dos dois sistemas." },
                  { year: "2029-2032", color: "bg-muted-foreground", title: "Reducao Gradual", desc: "ICMS e ISS reduzidos em 10% ao ano (2029: 90%, 2030: 80%, 2031: 70%, 2032: 60%). IBS sobe proporcionalmente a cada ano." },
                  { year: "2033", color: "bg-green-600", title: "Sistema Novo Pleno", desc: "ICMS e ISS extintos. IBS com aliquota plena (~17,7%). IVA Dual (IBS + CBS) em regime definitivo com aliquota combinada de ~26,5%." },
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    <span className={`absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full ${item.color} ring-4 ring-background`} />
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.year} - {item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Alert className="border-2 border-destructive bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-lg text-destructive font-bold">Penalidade Automatica: 1% sem defesa</AlertTitle>
            <AlertDescription className="text-sm mt-2 space-y-2">
              <p>
                Se a nota fiscal <strong>nao tiver o IBS/CBS preenchido corretamente</strong>, a RFB aplica automaticamente uma penalidade de 1% sobre o valor da operacao, sem aviso previo e sem direito a defesa previa (LC 214/2025, art. 63).
              </p>
              <p>
                <strong>Isso nao e credito. E perda financeira direta.</strong>
              </p>
              <div className="mt-3 p-3 bg-background rounded-lg border text-xs text-muted-foreground">
                <strong>Exemplo pratico:</strong> Se voce emitir R$ 500.000/mes em notas sem os campos IBS/CBS, a penalidade sera de R$ 5.000/mes (R$ 60.000/ano) de perda pura, sem possibilidade de recuperacao.
              </div>
            </AlertDescription>
          </Alert>
        </section>

        {data.specialRegimes.length > 0 && (
          <section className="space-y-4" data-testid="section-special-regimes">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Seus Regimes Especiais
            </h2>
            <p className="text-sm text-muted-foreground">
              Com base no seu diagnostico, sua empresa se enquadra em {data.specialRegimes.length} regime(s) 
              especial(is) da LC 214/2025, o que impacta diretamente a aliquota efetiva de IBS/CBS aplicavel.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.specialRegimes.map((regime) => {
                const details = REGIME_DETAILS[regime];
                if (!details) return null;
                const isSeletivo = regime.startsWith("seletivo_");
                return (
                  <Card key={regime} className={`border ${isSeletivo ? "border-red-200 bg-red-50/50" : "border-green-200 bg-green-50/50"}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Badge variant={isSeletivo ? "destructive" : "default"} className="text-[10px] shrink-0 mt-0.5">
                          {isSeletivo ? "IS" : "Reducao"}
                        </Badge>
                        <div>
                          <p className="text-sm font-bold">{details.label}</p>
                          <p className={`text-xs font-medium ${isSeletivo ? "text-red-600" : "text-green-700"}`}>{details.rate}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{details.ref}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Alert className="bg-blue-50 border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-700">
                Os regimes especiais selecionados serao considerados automaticamente no <strong>Simulador Financeiro</strong> e 
                na <strong>Estrategia de Precificacao</strong> para refletir aliquotas reduzidas ou especificas.
              </AlertDescription>
            </Alert>
          </section>
        )}

        <div className="flex justify-end pt-6 border-t">
          <Link href="/risk-assessment">
            <Button size="lg" className="gap-2" data-testid="button-next-risk">
              Proximo: Diagnostico de Risco
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
