import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Building, CheckCircle2, Factory, Landmark, ShoppingBag, Store, Tractor } from "lucide-react";

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sector: "",
    regime: "",
    operations: "",
    costStructure: "",
  });

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setLocation("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-screen-md mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold font-heading text-foreground">Perfil da Empresa</h1>
            <span className="text-sm font-medium text-muted-foreground">Passo {step} de 5</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            {step === 1 && (
              <>
                <CardTitle className="text-xl">Setor Econômico</CardTitle>
                <CardDescription>A reforma impacta de forma radicalmente diferente cada setor. Qual é o seu?</CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <CardTitle className="text-xl">Regime Tributário</CardTitle>
                <CardDescription>O regime atual dita o ponto de partida da sua transição.</CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <CardTitle className="text-xl">Perfil de Clientes</CardTitle>
                <CardDescription>A forma como você precifica dependerá de quem compra de você.</CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <CardTitle className="text-xl">Estrutura de Custos & Compras</CardTitle>
                <CardDescription>Isso define sua capacidade de gerar e utilizar novos créditos tributários.</CardDescription>
              </>
            )}
            {step === 5 && (
              <>
                <CardTitle className="text-xl">Analisando Cenários...</CardTitle>
                <CardDescription>Estamos cruzando seus dados com as regras do novo IBS e CBS.</CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="min-h-[350px]">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <RadioGroup 
                  value={formData.sector} 
                  onValueChange={(val) => updateForm("sector", val)}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {[
                    { id: "industria", label: "Indústria", icon: Factory },
                    { id: "atacado", label: "Comércio Atacadista", icon: Store },
                    { id: "varejo", label: "Comércio Varejista", icon: ShoppingBag },
                    { id: "servicos", label: "Serviços", icon: Landmark },
                    { id: "agronegocio", label: "Agronegócio", icon: Tractor },
                    { id: "outros", label: "Outros", icon: Building },
                  ].map((item) => (
                    <div key={item.id}>
                      <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" />
                      <Label
                        htmlFor={item.id}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center h-full"
                      >
                        <item.icon className="mb-3 h-8 w-8 text-muted-foreground peer-data-[state=checked]:text-primary" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <RadioGroup 
                  value={formData.regime} 
                  onValueChange={(val) => updateForm("regime", val)}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="simples" id="simples" />
                    <div className="flex-1 cursor-pointer">
                      <Label htmlFor="simples" className="font-bold text-base block cursor-pointer">Simples Nacional</Label>
                      <span className="text-sm text-muted-foreground block mt-1">Terá a opção de continuar no regime recolhendo na guia única ou optar por destacar os novos tributos para não perder competitividade B2B.</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="lucro_presumido" id="lucro_presumido" />
                    <div className="flex-1 cursor-pointer">
                      <Label htmlFor="lucro_presumido" className="font-bold text-base block cursor-pointer">Lucro Presumido</Label>
                      <span className="text-sm text-muted-foreground block mt-1">Sairá do regime cumulativo para a não-cumulatividade plena. O impacto na precificação é direto.</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="lucro_real" id="lucro_real" />
                    <div className="flex-1 cursor-pointer">
                      <Label htmlFor="lucro_real" className="font-bold text-base block cursor-pointer">Lucro Real</Label>
                      <span className="text-sm text-muted-foreground block mt-1">Já possui familiaridade com não-cumulatividade. O foco será na ampliação de créditos e simplificação de obrigações (fim da substituição tributária).</span>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-3">
                  <Label>Para quem sua empresa mais vende?</Label>
                  <RadioGroup 
                    value={formData.operations} 
                    onValueChange={(val) => updateForm("operations", val)}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="b2b" id="b2b" />
                      <div className="flex-1">
                        <Label htmlFor="b2b" className="font-bold cursor-pointer block">Principalmente B2B (Outras Empresas)</Label>
                        <span className="text-sm text-muted-foreground">Os novos impostos (IBS/CBS) gerarão crédito para seus clientes, mudando a forma de negociar preços.</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="b2c" id="b2c" />
                      <div className="flex-1">
                        <Label htmlFor="b2c" className="font-bold cursor-pointer block">Principalmente B2C (Consumidor Final)</Label>
                        <span className="text-sm text-muted-foreground">O impacto no preço final será sentido diretamente pelo consumidor. Pode haver efeitos de demanda.</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="mixed" id="mixed" />
                      <div className="flex-1">
                        <Label htmlFor="mixed" className="font-bold cursor-pointer block">Misto (Equilibrado B2B e B2C)</Label>
                        <span className="text-sm text-muted-foreground">Sua estratégia de precificação terá que ser segmentada.</span>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-3">
                  <Label>Qual é o principal peso nos custos da sua operação hoje?</Label>
                  <Select value={formData.costStructure} onValueChange={(val) => updateForm("costStructure", val)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o principal custo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="folha">Folha de Pagamento (Mão de obra)</SelectItem>
                      <SelectItem value="mercadorias">Mercadorias para Revenda</SelectItem>
                      <SelectItem value="insumos_servicos">Insumos e Contratação de Terceiros (Serviços)</SelectItem>
                      <SelectItem value="importacao">Insumos/Produtos Importados</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="bg-primary/5 p-4 rounded-lg mt-4 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong>Por que perguntamos isso?</strong> A reforma não permite tomar crédito tributário sobre Folha de Pagamento. Mas permite crédito amplo sobre praticamente qualquer serviço ou insumo adquirido de outras empresas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center justify-center text-center h-[350px] animate-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="h-24 w-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6 relative z-10 shadow-xl">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-3">Diagnóstico Pronto</h3>
                <p className="text-muted-foreground max-w-md">
                  Processamos os dados do seu setor e regime. Geramos um plano de ação específico focado em blindagem financeira e adaptação operacional.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1 || step === 5}
              className={step === 5 ? "invisible" : "w-[100px]"}
            >
              {step > 1 && <ArrowLeft className="mr-2 h-4 w-4" />}
              Voltar
            </Button>
            <Button 
              onClick={handleNext}
              className="w-[140px] shadow-sm"
              size="lg"
            >
              {step === 5 ? "Ver Relatório" : "Continuar"}
              {step < 5 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
