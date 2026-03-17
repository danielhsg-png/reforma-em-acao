import MainLayout from "@/components/layout/MainLayout";
import PlanStepper from "@/components/PlanStepper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CalendarDays, CheckCircle2, ChevronRight, FileText, Landmark, LayoutList, Scale, TrendingDown, TrendingUp, AlertTriangle, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";
import { generateActionPlanPdf } from "@/lib/generatePdf";

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

export default function Dashboard() {
  const { data } = useAppStore();

  const getRegimeLabel = () => {
    switch (data.regime) {
      case "simples": return "Simples Nacional";
      case "lucro_presumido": return "Lucro Presumido";
      case "lucro_real": return "Lucro Real";
      default: return "Regime não informado";
    }
  };

  const getSectorLabel = () => {
    switch (data.sector) {
      case "industria": return "Indústria";
      case "atacado": return "Comércio Atacadista";
      case "varejo": return "Comércio Varejista";
      case "servicos": return "Serviços";
      case "agronegocio": return "Agronegócio";
      default: return "Outros Setores";
    }
  };

  const getOperationsLabel = () => {
    return data.operations === "b2b" ? "B2B (Empresas)" : "B2C (Consumidor Final)";
  };

  return (
    <MainLayout>
      <PlanStepper currentStep={1} />
      <div className="bg-secondary/40 border-b border-border">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="bg-primary hover:bg-primary">Diagnóstico Concluído</Badge>
                <span className="text-sm font-medium text-muted-foreground flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Base legal: EC 132/23, LC 214/25, LC 227/26
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mt-2 uppercase tracking-tight">
                Plano de Ação: {data.companyName || "Sua Empresa"}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-3xl text-lg">
                Fundamentado na <strong>EC 132/23, LC 214/25, LC 227/26</strong> e Notas Técnicas RFB.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="bg-background border rounded-md px-3 py-1.5 text-sm font-medium flex items-center shadow-sm">
                  <Landmark className="h-4 w-4 mr-2 text-muted-foreground" />
                  {getSectorLabel()}
                </div>
                <div className="bg-background border rounded-md px-3 py-1.5 text-sm font-medium flex items-center shadow-sm">
                  <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
                  {getRegimeLabel()}
                </div>
                <div className="bg-background border rounded-md px-3 py-1.5 text-sm font-medium flex items-center shadow-sm">
                  <LayoutList className="h-4 w-4 mr-2 text-muted-foreground" />
                  {getOperationsLabel()}
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

      <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8 space-y-10">
        
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6" data-testid="text-section-transformacao">O Que Muda: Visão Geral da Transformação</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-l-4 border-l-destructive shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sistema Antigo (Extinto até 2033)</CardTitle>
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
                  5 tributos com legislações diferentes, 27 regulamentos de ICMS, mais de 5.500 regulamentos de ISS.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Período de Transição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm font-medium text-accent flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  2026 a 2033 (8 anos)
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p><strong>2026:</strong> CBS 0,9% + IBS 0,1% (fase de teste)</p>
                  <p><strong>2027:</strong> CBS plena. PIS/COFINS extintos.</p>
                  <p><strong>2029-2032:</strong> ICMS/ISS reduzidos 10%/ano</p>
                  <p><strong>2033:</strong> ICMS e ISS extintos. IBS pleno.</p>
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
                  <span className="text-sm font-medium">CBS (Federal) - alíquota ref. ~8,8%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">IBS (Estadual/Municipal) - alíquota ref. ~17,7%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">IS (Imposto Seletivo) - itens específicos</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                  Alíquota combinada de referência: 26,5% (LC 214/2025, art. 9º). Cálculo "por fora".
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Nova Lógica Tributária: Débito x Crédito</h2>
          <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <p className="text-sm text-muted-foreground">
                O modelo passa a ser não-cumulativo pleno (LC 214/2025, arts. 28-47). Você toma crédito sobre praticamente tudo que compra de outra empresa.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold text-destructive mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Débito Tributário (Saída)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Quando você <strong>vende</strong>, o IBS/CBS é lançado como débito.
                  </p>
                  <div className="mt-3 p-2 bg-background rounded text-xs font-mono">
                    Venda de R$ 100 x 26,5% = R$ 26,50 de débito
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-bold text-green-600 mb-3 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Crédito Tributário (Entrada)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Quando você <strong>compra</strong> de outra empresa, toma crédito. Crédito amplo em bens, serviços, energia, aluguel, frete.
                  </p>
                  <div className="mt-3 p-2 bg-background rounded text-xs font-mono">
                    Compra de R$ 60 x 26,5% = R$ 15,90 de crédito
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h5 className="font-bold text-primary mb-2">Resultado Final</h5>
                <p className="text-sm">
                  Débito (R$ 26,50) - Crédito (R$ 15,90) = <strong>Imposto a Recolher: R$ 10,60</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Se suas compras não forem documentadas corretamente (NF-e sem campos IBS/CBS), você perde o crédito e recolhe R$ 26,50 inteiros.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {data.specialRegimes.length > 0 && (
          <section className="space-y-4" data-testid="section-special-regimes">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Seus Regimes Especiais
            </h2>
            <p className="text-sm text-muted-foreground">
              Com base no seu diagnóstico, sua empresa se enquadra em {data.specialRegimes.length} regime(s) 
              especial(is) da LC 214/2025, o que impacta diretamente a alíquota efetiva de IBS/CBS aplicável.
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
                          {isSeletivo ? "IS" : "Redução"}
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
                Os regimes especiais selecionados são considerados automaticamente no <strong>Simulador Financeiro</strong> e 
                na <strong>Estratégia de Precificação</strong> para refletir alíquotas reduzidas ou específicas.
              </AlertDescription>
            </Alert>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Impacto no Seu Negócio</h2>
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
                    Sua alíquota nominal subirá de forma significativa (saída do Presumido para IVA base de ~26.5%). O impacto real depende do repasse de preços ao {data.operations === "b2b" ? "seu cliente B2B, que poderá tomar crédito" : "seu consumidor B2C"}.
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
        </section>

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
                  Margens espremidas: Por focar em {data.operations === "b2b" ? "B2B" : "B2C"}, {data.operations === "b2b" ? "o cliente exigirá notas perfeitas para tomada de crédito." : "o repasse de 100% do aumento de carga pode derrubar vendas."}
                </li>
                <li className="flex items-start text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                  Cuidado com o perfil de fornecedores: como você {data.purchaseProfile === "simples_suppliers" ? "compra muito do Simples Nacional, terá dificuldade de acumular créditos no novo sistema." : "possui fornecedores diversos, mapear quem gera e quem não gera crédito será o diferencial competitivo."}
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

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Cronograma de Ação</h2>
          <Card className="shadow-sm">
            <CardContent className="pt-6">
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
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Impacto Operacional e Custos</h2>
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
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Recomendações Estratégicas</h2>
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
                    <h4 className="font-bold text-foreground">3. Simulação Financeira ({data.costStructure === "folha" ? "Cuidado com a Folha" : "Custo de Insumos"})</h4>
                    <p className="text-sm text-muted-foreground mt-1">Peça à contabilidade uma "simulação sombra". {data.costStructure === "folha" ? "Como seu maior custo é Folha de Pagamento (que não gera crédito de IBS/CBS), sua margem está vulnerável. Simule o impacto real." : "Verifique quanto dos seus insumos e fornecedores vão gerar créditos reais na nova não-cumulatividade plena."} Utilize o Simulador Financeiro disponível na tela inicial da plataforma.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t flex justify-end p-6">
              <Button variant="default" onClick={() => generateActionPlanPdf(data)} data-testid="button-download-pdf-dashboard">
                <FileText className="mr-2 h-4 w-4" />
                Baixar Relatório em PDF
              </Button>
            </CardFooter>
          </Card>
        </section>

        <div className="flex justify-end pt-6 border-t">
          <Link href="/plano-de-acao/diagnostico">
            <Button size="lg" className="gap-2" data-testid="button-next-risk-from-dashboard">
              Próximo: Diagnóstico de Risco
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}