import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Building, CheckCircle2 } from "lucide-react";

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sector: "",
    regime: "",
    size: "",
    operations: "",
  });

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // In a real app, we would save the data to state/store here
      // For the mockup, we just navigate to dashboard and use dummy data there
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
            <h1 className="text-3xl font-bold font-heading text-foreground">Diagnóstico da Empresa</h1>
            <span className="text-sm font-medium text-muted-foreground">Passo {step} de 4</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            {step === 1 && (
              <>
                <CardTitle className="text-xl">Setor e Atividade Principal</CardTitle>
                <CardDescription>Nos ajude a entender em qual contexto sua empresa atua.</CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <CardTitle className="text-xl">Regime Tributário Atual</CardTitle>
                <CardDescription>A forma como sua empresa recolhe impostos hoje define os impactos de transição.</CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <CardTitle className="text-xl">Cadeia e Operações</CardTitle>
                <CardDescription>Detalhes sobre seus fornecedores, clientes e abrangência geográfica.</CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <CardTitle className="text-xl">Pronto para a Análise!</CardTitle>
                <CardDescription>Revisamos as informações básicas e estamos prontos para gerar o relatório.</CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="min-h-[300px]">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-3">
                  <Label>Setor de Atuação</Label>
                  <Select value={formData.sector} onValueChange={(val) => updateForm("sector", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="comercio">Comércio / Varejo</SelectItem>
                      <SelectItem value="industria">Indústria</SelectItem>
                      <SelectItem value="agronegocio">Agronegócio</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia / Software</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Tipo de Venda Predominante</Label>
                  <RadioGroup defaultValue="b2b" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="b2b" id="b2b" />
                      <Label htmlFor="b2b" className="flex-1 cursor-pointer">B2B (Venda para outras empresas)</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="b2c" id="b2c" />
                      <Label htmlFor="b2c" className="flex-1 cursor-pointer">B2C (Venda para consumidor final)</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="mixed" id="mixed" />
                      <Label htmlFor="mixed" className="flex-1 cursor-pointer">Misto (B2B e B2C)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-3">
                  <Label>Regime de Tributação</Label>
                  <RadioGroup 
                    value={formData.regime} 
                    onValueChange={(val) => updateForm("regime", val)}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <div>
                      <RadioGroupItem value="simples" id="simples" className="peer sr-only" />
                      <Label
                        htmlFor="simples"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                      >
                        <Building className="mb-3 h-6 w-6" />
                        Simples Nacional
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="lucro_presumido" id="lucro_presumido" className="peer sr-only" />
                      <Label
                        htmlFor="lucro_presumido"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                      >
                        <Building className="mb-3 h-6 w-6" />
                        Lucro Presumido
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="lucro_real" id="lucro_real" className="peer sr-only" />
                      <Label
                        htmlFor="lucro_real"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                      >
                        <Building className="mb-3 h-6 w-6" />
                        Lucro Real
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-3">
                  <Label>Abrangência Geográfica (Vendas)</Label>
                  <RadioGroup defaultValue="state" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="state" id="state" />
                      <Label htmlFor="state" className="flex-1 cursor-pointer">Apenas no próprio Estado</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="interstate" id="interstate" />
                      <Label htmlFor="interstate" className="flex-1 cursor-pointer">Operações Interestaduais frequentes</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="international" id="international" />
                      <Label htmlFor="international" className="flex-1 cursor-pointer">Importação / Exportação significativa</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center h-full py-12 animate-in zoom-in-95">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2">Tudo Certo!</h3>
                <p className="text-muted-foreground max-w-md">
                  Processamos suas informações. Vamos gerar um relatório executivo mostrando os impactos do CBS e IBS (novo IVA Dual) nas suas operações, precificação e processos.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1}
              className="w-[100px]"
            >
              {step > 1 && <ArrowLeft className="mr-2 h-4 w-4" />}
              Voltar
            </Button>
            <Button 
              onClick={handleNext}
              className="w-[120px]"
            >
              {step === 4 ? "Ver Análise" : "Próximo"}
              {step < 4 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
