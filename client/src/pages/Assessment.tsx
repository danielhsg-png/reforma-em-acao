import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Building, CheckCircle2, Factory, Landmark, ShoppingBag, Store, Tractor, Info, Monitor, Users, FileText, Truck, Scale, ShieldAlert, Target, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

const TOTAL_STEPS = 10;

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const { data, updateData, saveCompany } = useAppStore();

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setSaving(true);
      try {
        await saveCompany();
        setLocation("/dashboard-educational");
      } catch (err) {
        console.error("Erro ao salvar empresa:", err);
        setLocation("/dashboard-educational");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const inputClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <MainLayout>
      <div className="container max-w-screen-md mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold font-heading text-foreground uppercase tracking-tight" data-testid="text-assessment-title">REFORMA EM AÇÃO</h1>
            <span className="text-sm font-medium text-muted-foreground" data-testid="text-step-counter">Passo {step} de {TOTAL_STEPS}</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              data-testid="progress-bar"
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>Identificação</span>
            <span>Setor</span>
            <span>Regime</span>
            <span>Geografia</span>
            <span>Porte</span>
            <span>Clientes</span>
            <span>Sistemas</span>
            <span>Fornecedores</span>
            <span>Contratos</span>
            <span>Conclusão</span>
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            {step === 1 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Identificação da Empresa</CardTitle>
                </div>
                <CardDescription>
                  Informe os dados básicos do seu negócio. Essas informações serão usadas para personalizar 
                  todo o plano de ação com alertas e recomendações específicas para a sua realidade.
                </CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Factory className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Setor Econômico</CardTitle>
                </div>
                <CardDescription>
                  A Reforma Tributária impacta cada setor de forma completamente diferente. 
                  A indústria ganha créditos amplos, o varejo enfrenta o split payment, 
                  e serviços perdem benefícios de ISS municipal. Qual é o seu setor principal?
                </CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Landmark className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Regime Tributário & Perfil de Compras</CardTitle>
                </div>
                <CardDescription>
                  O regime tributário atual define como você será migrado ao IBS/CBS. 
                  Empresas do Simples podem optar por recolhimento fora do DAS, e o perfil 
                  dos seus fornecedores determina o volume de créditos que poderá tomar.
                </CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Abrangência Geográfica</CardTitle>
                </div>
                <CardDescription>
                  A Reforma Tributária adota o princípio do destino: o IBS será recolhido 
                  integralmente no estado do consumidor. Se você vende para múltiplos estados, 
                  terá obrigações acessórias em cada um deles. Marque todos os estados onde atua.
                </CardDescription>
              </>
            )}
            {step === 5 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Porte da Empresa</CardTitle>
                </div>
                <CardDescription>
                  O faturamento mensal, número de colaboradores e margem de lucro determinam 
                  o impacto financeiro real da transição. Empresas com margens menores 
                  precisam agir mais rápido para proteger sua rentabilidade.
                </CardDescription>
              </>
            )}
            {step === 6 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Perfil de Clientes & Estrutura de Custos</CardTitle>
                </div>
                <CardDescription>
                  Vendas B2B geram créditos para o comprador (transparência total). 
                  Vendas B2C não geram crédito, mas sofrem impacto de split payment na venda. 
                  O maior custo operacional define onde estão seus créditos mais valiosos.
                </CardDescription>
              </>
            )}
            {step === 7 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Monitor className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Sistemas & Emissão Fiscal</CardTitle>
                </div>
                <CardDescription>
                  A NF-e precisará conter campos novos de IBS e CBS a partir de 2026. 
                  Sistemas que não se adaptarem podem travar emissões. Informe como funciona 
                  sua operação fiscal hoje para avaliar o risco de descontinuidade.
                </CardDescription>
              </>
            )}
            {step === 8 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Perfil de Fornecedores</CardTitle>
                </div>
                <CardDescription>
                  Fornecedores do Simples Nacional geram créditos limitados (alíquota efetiva, não cheia). 
                  Quanto maior a concentração em fornecedores do Simples, menor o aproveitamento 
                  de créditos IBS/CBS. Isso impacta diretamente seu custo final.
                </CardDescription>
              </>
            )}
            {step === 9 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Contratos & Maturidade Tributária</CardTitle>
                </div>
                <CardDescription>
                  Contratos de longo prazo firmados antes da reforma podem não prever 
                  a nova carga tributária. Cláusulas de revisão de preço são essenciais. 
                  Avalie também quem cuida da parte fiscal e se já conhece o split payment.
                </CardDescription>
              </>
            )}
            {step === 10 && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Diagnóstico Concluído</CardTitle>
                </div>
                <CardDescription>
                  Analisamos seus dados com base na EC 132/2023, LC 214/2025, LC 227/2026 
                  e nas últimas notas técnicas da Receita Federal e do Comitê Gestor do IBS.
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="min-h-[420px]">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-1-content">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Nome da Empresa *</Label>
                    <input 
                      id="companyName"
                      data-testid="input-company-name"
                      className={inputClassName}
                      placeholder="Ex: Minha Empresa LTDA"
                      value={data.companyName}
                      onChange={(e) => updateData("companyName", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                    <input 
                      id="cnpj"
                      data-testid="input-cnpj"
                      className={inputClassName}
                      placeholder="00.000.000/0000-00"
                      value={data.cnpj}
                      onChange={(e) => updateData("cnpj", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      O CNPJ é usado apenas para identificação interna. Nenhum dado é compartilhado com terceiros.
                    </p>
                  </div>
                </div>
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-xs text-blue-700">
                    Ao final deste diagnóstico, você receberá um plano de ação personalizado com 9 módulos: 
                    panorama educacional, diagnóstico de risco, simulador financeiro, gestão de sistemas, 
                    cadeia de fornecedores, estratégia de preços, rotinas semanais, cronograma de 51 dias e checklist final.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-2-content">
                <RadioGroup 
                  value={data.sector} 
                  onValueChange={(val) => updateData("sector", val)}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {[
                    { id: "industria", label: "Indústria", icon: Factory, desc: "Transformação, manufatura" },
                    { id: "atacado", label: "Comércio Atacadista", icon: Store, desc: "Distribuição, revenda B2B" },
                    { id: "varejo", label: "Comércio Varejista", icon: ShoppingBag, desc: "Venda ao consumidor final" },
                    { id: "servicos", label: "Serviços", icon: Landmark, desc: "Consultoria, tecnologia, saúde" },
                    { id: "agronegocio", label: "Agronegócio", icon: Tractor, desc: "Produção rural, cooperativas" },
                    { id: "outros", label: "Outros Setores", icon: Building, desc: "Construção, transporte, etc." },
                  ].map((item) => (
                    <div key={item.id}>
                      <RadioGroupItem value={item.id} id={`sector-${item.id}`} className="peer sr-only" data-testid={`radio-sector-${item.id}`} />
                      <Label
                        htmlFor={`sector-${item.id}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center h-full"
                      >
                        <item.icon className="mb-3 h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-bold">{item.label}</span>
                        <span className="text-[11px] text-muted-foreground mt-1">{item.desc}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs text-amber-700">
                    <strong>Por que importa:</strong> A indústria terá regime não-cumulativo pleno com créditos amplos. 
                    Serviços que hoje pagam ISS (2-5%) podem enfrentar alíquota de até 26,5%. 
                    O varejo será impactado pelo split payment obrigatório em cartão/PIX.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-3-content">
                <div className="space-y-4">
                  <Label>Regime Tributário Atual</Label>
                  <Select value={data.regime} onValueChange={(val) => updateData("regime", val)} data-testid="select-regime">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu regime" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simples">Simples Nacional (DAS unificado)</SelectItem>
                      <SelectItem value="lucro_presumido">Lucro Presumido (PIS/COFINS cumulativo)</SelectItem>
                      <SelectItem value="lucro_real">Lucro Real (PIS/COFINS não-cumulativo)</SelectItem>
                    </SelectContent>
                  </Select>
                  {data.regime === "simples" && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-xs text-blue-700">
                        No Simples Nacional, a LC 214/25 permite optar por recolher IBS/CBS fora do DAS. 
                        Isso gera crédito integral para seus clientes B2B, tornando sua empresa mais competitiva.
                      </AlertDescription>
                    </Alert>
                  )}
                  {data.regime === "lucro_presumido" && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <Info className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-xs text-amber-700">
                        O Lucro Presumido será extinto gradualmente. Você passará ao regime não-cumulativo 
                        com direito a créditos, mas precisará de controle fiscal mais rigoroso.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-4">
                  <Label>Perfil de Fornecedores (Origem dos Insumos)</Label>
                  <RadioGroup 
                    value={data.purchaseProfile} 
                    onValueChange={(val) => updateData("purchaseProfile", val)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/30">
                      <RadioGroupItem value="simples_suppliers" id="s_supp" data-testid="radio-simples-suppliers" />
                      <div className="flex-1">
                        <Label htmlFor="s_supp" className="cursor-pointer font-bold block">Maioria do Simples Nacional</Label>
                        <span className="text-xs text-muted-foreground">Créditos limitados à alíquota efetiva do fornecedor</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/30">
                      <RadioGroupItem value="general_suppliers" id="g_supp" data-testid="radio-general-suppliers" />
                      <div className="flex-1">
                        <Label htmlFor="g_supp" className="cursor-pointer font-bold block">Maioria Lucro Real / Presumido</Label>
                        <span className="text-xs text-muted-foreground">Créditos pela alíquota cheia de 26,5%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/30">
                      <RadioGroupItem value="mixed_suppliers" id="m_supp" data-testid="radio-mixed-suppliers" />
                      <div className="flex-1">
                        <Label htmlFor="m_supp" className="cursor-pointer font-bold block">Mix equilibrado de fornecedores</Label>
                        <span className="text-xs text-muted-foreground">Créditos variados conforme perfil de cada fornecedor</span>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-4-content">
                <Label>Estados de Atuação (Vendas e Prestação de Serviços)</Label>
                <p className="text-xs text-muted-foreground -mt-4">
                  Marque todos os estados onde sua empresa vende produtos ou presta serviços. 
                  Com o princípio do destino, cada estado terá sua própria alíquota de IBS.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[
                    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
                    "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
                  ].map((uf) => (
                    <div key={uf} className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/30">
                      <input 
                        type="checkbox" 
                        id={`uf-${uf}`}
                        data-testid={`checkbox-uf-${uf}`}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={data.salesStates.includes(uf)}
                        onChange={(e) => {
                          const newStates = e.target.checked 
                            ? [...data.salesStates, uf]
                            : data.salesStates.filter(s => s !== uf);
                          updateData("salesStates", newStates);
                        }}
                      />
                      <Label htmlFor={`uf-${uf}`} className="text-xs font-bold cursor-pointer">{uf}</Label>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3">
                  <strong>Selecionados:</strong> {data.salesStates.length === 0 ? "Nenhum" : data.salesStates.join(", ")} 
                  {data.salesStates.length > 3 && (
                    <span className="block mt-1 text-amber-600 font-medium">
                      Atenção: operação em {data.salesStates.length} estados exige planejamento de obrigações acessórias em cada jurisdição.
                    </span>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-5-content">
                <div className="space-y-3">
                  <Label>Faturamento Mensal Aproximado</Label>
                  <Select value={data.monthlyRevenue} onValueChange={(val) => updateData("monthlyRevenue", val)} data-testid="select-revenue">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate_50k">Até R$ 50 mil/mês</SelectItem>
                      <SelectItem value="50k_100k">R$ 50 mil a R$ 100 mil/mês</SelectItem>
                      <SelectItem value="100k_500k">R$ 100 mil a R$ 500 mil/mês</SelectItem>
                      <SelectItem value="500k_1m">R$ 500 mil a R$ 1 milhão/mês</SelectItem>
                      <SelectItem value="acima_1m">Acima de R$ 1 milhão/mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Número de Colaboradores</Label>
                  <Select value={data.employeeCount} onValueChange={(val) => updateData("employeeCount", val)} data-testid="select-employees">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_10">1 a 10 pessoas</SelectItem>
                      <SelectItem value="11_50">11 a 50 pessoas</SelectItem>
                      <SelectItem value="51_200">51 a 200 pessoas</SelectItem>
                      <SelectItem value="acima_200">Acima de 200 pessoas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Margem de Lucro Líquida Estimada</Label>
                  <Select value={data.profitMargin} onValueChange={(val) => updateData("profitMargin", val)} data-testid="select-margin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate_5">Até 5% (margem apertada)</SelectItem>
                      <SelectItem value="5_10">5% a 10%</SelectItem>
                      <SelectItem value="10_20">10% a 20%</SelectItem>
                      <SelectItem value="acima_20">Acima de 20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(data.profitMargin === "ate_5" || data.profitMargin === "5_10") && (
                  <Alert className="bg-red-50 border-red-200">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-xs text-red-700">
                      <strong>Alerta de margem:</strong> Com margem abaixo de 10%, qualquer aumento de carga tributária pode 
                      comprometer a viabilidade do negócio. A recalibração de preços e a otimização de créditos 
                      serão prioridade máxima no seu plano.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-6-content">
                <div className="space-y-3">
                  <Label>Qual é o seu público principal?</Label>
                  <RadioGroup 
                    value={data.operations} 
                    onValueChange={(val) => updateData("operations", val)}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="b2b" id="b2b" data-testid="radio-b2b" />
                      <div className="flex-1">
                        <Label htmlFor="b2b" className="font-bold cursor-pointer block">Empresas (B2B)</Label>
                        <span className="text-xs text-muted-foreground">
                          Seus clientes aproveitam créditos de IBS/CBS. Transparência de preço líquido é essencial.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="b2c" id="b2c" data-testid="radio-b2c" />
                      <div className="flex-1">
                        <Label htmlFor="b2c" className="font-bold cursor-pointer block">Consumidor Final (B2C)</Label>
                        <span className="text-xs text-muted-foreground">
                          O preço final inclui 26,5% de IVA Dual visível na nota. Split payment retém imposto na fonte.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="b2b_b2c" id="b2b_b2c" data-testid="radio-b2b-b2c" />
                      <div className="flex-1">
                        <Label htmlFor="b2b_b2c" className="font-bold cursor-pointer block">Misto (B2B + B2C)</Label>
                        <span className="text-xs text-muted-foreground">
                          Precisa de duas estratégias de preço: com crédito (B2B) e sem crédito (B2C).
                        </span>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <Label>Maior custo operacional hoje:</Label>
                  <Select value={data.costStructure} onValueChange={(val) => updateData("costStructure", val)} data-testid="select-cost-structure">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o custo principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="folha">Folha de Pagamento (sem crédito IBS/CBS)</SelectItem>
                      <SelectItem value="mercadorias">Estoque / Mercadorias (gera crédito)</SelectItem>
                      <SelectItem value="logistica">Logística e Frete (gera crédito)</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia e Licenças (gera crédito parcial)</SelectItem>
                      <SelectItem value="aluguel">Aluguel / Ocupação (gera crédito se PJ)</SelectItem>
                    </SelectContent>
                  </Select>
                  {data.costStructure === "folha" && (
                    <p className="text-xs text-red-600 font-medium">
                      Folha de pagamento NÃO gera crédito de IBS/CBS. Empresas intensivas em mão de obra 
                      tendem a ter aumento de carga tributária efetiva.
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-7-content">
                <div className="space-y-3">
                  <Label>Sistema de Gestão (ERP) Utilizado</Label>
                  <Select value={data.erpSystem} onValueChange={(val) => updateData("erpSystem", val)} data-testid="select-erp">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sap">SAP / TOTVS / Oracle (grande porte)</SelectItem>
                      <SelectItem value="medio_porte">Bling / Omie / Tiny / Conta Azul</SelectItem>
                      <SelectItem value="planilha">Planilhas / Controle manual</SelectItem>
                      <SelectItem value="nenhum">Não uso sistema de gestão</SelectItem>
                      <SelectItem value="proprio">Sistema próprio / desenvolvido internamente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Como emite Nota Fiscal Eletrônica (NF-e)?</Label>
                  <RadioGroup 
                    value={data.nfeEmission} 
                    onValueChange={(val) => updateData("nfeEmission", val)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/30">
                      <RadioGroupItem value="sistema_integrado" id="nfe_integrado" data-testid="radio-nfe-integrado" />
                      <div className="flex-1">
                        <Label htmlFor="nfe_integrado" className="cursor-pointer font-bold block">Sistema integrado emite automaticamente</Label>
                        <span className="text-xs text-muted-foreground">ERP calcula impostos e transmite direto à SEFAZ</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/30">
                      <RadioGroupItem value="emissor_gratuito" id="nfe_gratuito" data-testid="radio-nfe-gratuito" />
                      <div className="flex-1">
                        <Label htmlFor="nfe_gratuito" className="cursor-pointer font-bold block">Emissor gratuito / portal da SEFAZ</Label>
                        <span className="text-xs text-muted-foreground">Preenchimento manual ou semi-automatizado</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/30">
                      <RadioGroupItem value="contador" id="nfe_contador" data-testid="radio-nfe-contador" />
                      <div className="flex-1">
                        <Label htmlFor="nfe_contador" className="cursor-pointer font-bold block">Meu contador faz tudo</Label>
                        <span className="text-xs text-muted-foreground">Terceirização completa da emissão fiscal</span>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <Label>Volume mensal de notas emitidas</Label>
                  <Select value={data.invoiceVolume} onValueChange={(val) => updateData("invoiceVolume", val)} data-testid="select-invoice-volume">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate_50">Até 50 notas/mês</SelectItem>
                      <SelectItem value="ate_100">50 a 100 notas/mês</SelectItem>
                      <SelectItem value="ate_500">100 a 500 notas/mês</SelectItem>
                      <SelectItem value="acima_500">Acima de 500 notas/mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-8-content">
                <div className="space-y-3">
                  <Label>Quantos fornecedores ativos você tem?</Label>
                  <Select value={data.supplierCount} onValueChange={(val) => updateData("supplierCount", val)} data-testid="select-supplier-count">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate_10">Até 10 fornecedores</SelectItem>
                      <SelectItem value="ate_20">10 a 20 fornecedores</SelectItem>
                      <SelectItem value="ate_50">20 a 50 fornecedores</SelectItem>
                      <SelectItem value="acima_50">Acima de 50 fornecedores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Qual percentual dos seus fornecedores é do Simples Nacional?</Label>
                  <Select value={data.simplesSupplierPercent} onValueChange={(val) => updateData("simplesSupplierPercent", val)} data-testid="select-simples-percent">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate_30">Menos de 30%</SelectItem>
                      <SelectItem value="30_60">30% a 60%</SelectItem>
                      <SelectItem value="acima_60">Mais de 60%</SelectItem>
                      <SelectItem value="nao_sei">Não sei informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(data.simplesSupplierPercent === "acima_60" || data.simplesSupplierPercent === "30_60") && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-xs text-amber-700">
                      <strong>Impacto nos créditos:</strong> Fornecedores do Simples Nacional geram crédito proporcional 
                      à alíquota efetiva deles (ex: 4-8%), não à alíquota cheia de 26,5%. 
                      Isso reduz significativamente seu aproveitamento de créditos. 
                      O módulo "Cadeia de Fornecedores" do seu plano trará recomendações específicas.
                    </AlertDescription>
                  </Alert>
                )}
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-xs text-blue-700">
                    O plano vai gerar uma matriz A/B/C para classificar seus principais fornecedores 
                    por risco tributário e recomendar ações de renegociação ou substituição.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {step === 9 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" data-testid="step-9-content">
                <div className="space-y-3">
                  <Label>Possui contratos de longo prazo com clientes ou fornecedores?</Label>
                  <RadioGroup 
                    value={data.hasLongTermContracts} 
                    onValueChange={(val) => updateData("hasLongTermContracts", val)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/30">
                      <RadioGroupItem value="sim" id="contract_yes" data-testid="radio-contracts-yes" />
                      <Label htmlFor="contract_yes" className="flex-1 cursor-pointer font-bold">Sim, tenho contratos acima de 12 meses</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/30">
                      <RadioGroupItem value="nao" id="contract_no" data-testid="radio-contracts-no" />
                      <Label htmlFor="contract_no" className="flex-1 cursor-pointer font-bold">Não, trabalho com pedidos avulsos / curto prazo</Label>
                    </div>
                  </RadioGroup>
                </div>
                {data.hasLongTermContracts === "sim" && (
                  <div className="space-y-3">
                    <Label>Seus contratos têm cláusula de revisão por mudança tributária?</Label>
                    <RadioGroup 
                      value={data.priceRevisionClause} 
                      onValueChange={(val) => updateData("priceRevisionClause", val)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/30">
                        <RadioGroupItem value="sim" id="clause_yes" data-testid="radio-clause-yes" />
                        <Label htmlFor="clause_yes" className="flex-1 cursor-pointer">Sim, há cláusula de reequilíbrio</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/30">
                        <RadioGroupItem value="nao" id="clause_no" data-testid="radio-clause-no" />
                        <Label htmlFor="clause_no" className="flex-1 cursor-pointer">Não, o preço é fixo até o vencimento</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/30">
                        <RadioGroupItem value="nao_sei" id="clause_dk" data-testid="radio-clause-dk" />
                        <Label htmlFor="clause_dk" className="flex-1 cursor-pointer">Não sei / preciso verificar</Label>
                      </div>
                    </RadioGroup>
                    {data.priceRevisionClause === "nao" && (
                      <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-md">
                        Contratos sem cláusula de reequilíbrio tributário são um risco grave. 
                        Se a nova carga for maior, você absorve a diferença até o vencimento. 
                        O plano de ação incluirá modelo de aditivo contratual sugerido.
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-3">
                  <Label>Quem é o responsável pela área fiscal/tributária?</Label>
                  <Select value={data.taxResponsible} onValueChange={(val) => updateData("taxResponsible", val)} data-testid="select-tax-responsible">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contador_externo">Escritório de contabilidade externo</SelectItem>
                      <SelectItem value="contador_interno">Contador/analista interno</SelectItem>
                      <SelectItem value="dono">Eu mesmo (dono/sócio)</SelectItem>
                      <SelectItem value="ninguem">Ninguém cuida especificamente disso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Você já ouviu falar do Split Payment (recolhimento na fonte)?</Label>
                  <RadioGroup 
                    value={data.splitPaymentAware} 
                    onValueChange={(val) => updateData("splitPaymentAware", val)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/30">
                      <RadioGroupItem value="sim_entendo" id="split_yes" data-testid="radio-split-yes" />
                      <Label htmlFor="split_yes" className="flex-1 cursor-pointer">Sim, entendo como funciona</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/30">
                      <RadioGroupItem value="ouvi_falar" id="split_heard" data-testid="radio-split-heard" />
                      <Label htmlFor="split_heard" className="flex-1 cursor-pointer">Já ouvi falar, mas não entendo bem</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/30">
                      <RadioGroupItem value="nao" id="split_no" data-testid="radio-split-no" />
                      <Label htmlFor="split_no" className="flex-1 cursor-pointer">Não, nunca ouvi falar</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 10 && (
              <div className="flex flex-col items-center justify-center text-center min-h-[420px] animate-in zoom-in-95 duration-500" data-testid="step-10-content">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="h-24 w-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center relative z-10 shadow-xl">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-3">Diagnóstico Completo</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Cruzamos os dados de <strong>{data.companyName}</strong> com a legislação vigente 
                  e geramos um plano personalizado com <strong>9 módulos estratégicos</strong>.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center max-w-sm w-full mb-6">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-primary">9</div>
                    <div className="text-[10px] text-muted-foreground">Módulos</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-primary">51</div>
                    <div className="text-[10px] text-muted-foreground">Dias no Plano</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-primary">3</div>
                    <div className="text-[10px] text-muted-foreground">Leis Base</div>
                  </div>
                </div>
                <div className="text-left bg-muted/20 rounded-lg p-4 w-full max-w-md space-y-2">
                  <p className="text-xs font-bold text-foreground mb-2">Seu plano inclui:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                    <span>1. Panorama Educacional da Reforma</span>
                    <span>2. Diagnóstico de Risco (6 indicadores)</span>
                    <span>3. Simulador Financeiro IVA Dual</span>
                    <span>4. Gestão de Sistemas & NF-e</span>
                    <span>5. Cadeia de Fornecedores (Matriz A/B/C)</span>
                    <span>6. Estratégia de Precificação</span>
                    <span>7. Rotinas Semanais de Controle</span>
                    <span>8. Cronograma de 51 Dias</span>
                    <span>9. Checklist Final do Dono</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-4 max-w-md italic">
                  Fundamentado na EC 132/2023, LC 214/2025, LC 227/2026, 
                  Notas Técnicas da RFB e diretrizes do Comitê Gestor do IBS.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1 || step === 10}
              className={step === 10 ? "invisible" : "w-[100px]"}
              data-testid="button-back"
            >
              {step > 1 && <ArrowLeft className="mr-2 h-4 w-4" />}
              Voltar
            </Button>
            <Button 
              onClick={handleNext}
              className="w-[200px] shadow-sm font-bold"
              size="lg"
              disabled={saving}
              data-testid="button-next"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === 10 ? "GERAR PLANO DE AÇÃO" : "CONTINUAR"}
              {step < 10 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
