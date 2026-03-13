import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Building, CheckCircle2, Factory, Landmark, ShoppingBag, Store, Tractor } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const { data, updateData, saveCompany } = useAppStore();

  const handleNext = async () => {
    if (step < 6) {
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

  return (
    <MainLayout>
      <div className="container max-w-screen-md mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold font-heading text-foreground uppercase tracking-tight">REFORMA EM AÇÃO</h1>
            <span className="text-sm font-medium text-muted-foreground">Passo {step} de 6</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            {step === 1 && (
              <>
                <CardTitle className="text-xl">Dados da Empresa</CardTitle>
                <CardDescription>Identifique seu negócio para um plano personalizado.</CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <CardTitle className="text-xl">Setor Econômico</CardTitle>
                <CardDescription>A reforma impacta de forma radicalmente diferente cada setor. Qual é o seu?</CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <CardTitle className="text-xl">Regime e Compras</CardTitle>
                <CardDescription>A origem das suas mercadorias define seus créditos de IBS/CBS.</CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <CardTitle className="text-xl">Abrangência Geográfica</CardTitle>
                <CardDescription>Para quais estados você vende ou presta serviços?</CardDescription>
              </>
            )}
            {step === 5 && (
              <>
                <CardTitle className="text-xl">Perfil de Clientes & Custos</CardTitle>
                <CardDescription>Defina sua estratégia de precificação e tomada de crédito.</CardDescription>
              </>
            )}
            {step === 6 && (
              <>
                <CardTitle className="text-xl">Analisando Cenários Jurídicos...</CardTitle>
                <CardDescription>Cruzando dados com a EC 132/23, LC 214/25, LC 227/26 e Notas Técnicas da RFB.</CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="min-h-[380px]">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <input 
                      id="companyName"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ex: Minha Empresa LTDA"
                      value={data.companyName}
                      onChange={(e) => updateData("companyName", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                    <input 
                      id="cnpj"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="00.000.000/0000-00"
                      value={data.cnpj}
                      onChange={(e) => updateData("cnpj", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <RadioGroup 
                  value={data.sector} 
                  onValueChange={(val) => updateData("sector", val)}
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

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-4">
                  <Label>Regime Tributário Atual</Label>
                  <Select value={data.regime} onValueChange={(val) => updateData("regime", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu regime" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simples">Simples Nacional</SelectItem>
                      <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                      <SelectItem value="lucro_real">Lucro Real</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label>Perfil de Fornecedores (Origem dos Insumos)</Label>
                  <RadioGroup 
                    value={data.purchaseProfile} 
                    onValueChange={(val) => updateData("purchaseProfile", val)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="simples_suppliers" id="s_supp" />
                      <Label htmlFor="s_supp" className="flex-1 cursor-pointer">Compro majoritariamente de empresas do Simples Nacional</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="general_suppliers" id="g_supp" />
                      <Label htmlFor="g_supp" className="flex-1 cursor-pointer">Compro de empresas do Lucro Real/Presumido</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="mixed_suppliers" id="m_supp" />
                      <Label htmlFor="m_supp" className="flex-1 cursor-pointer">Mix equilibrado de fornecedores</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <Label>Estados de Atuação (Vendas e Serviços)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["SP", "RJ", "MG", "ES", "RS", "SC", "PR", "MT", "MS", "GO", "DF", "BA", "PE", "CE", "AM", "PA"].map((uf) => (
                    <div key={uf} className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/30">
                      <input 
                        type="checkbox" 
                        id={`uf-${uf}`} 
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
                  <div className="col-span-full text-xs text-muted-foreground mt-2 italic">
                    * A Reforma traz o princípio do destino. Suas vendas interestaduais serão tributadas no estado do cliente.
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-3">
                  <Label>Qual é o seu público principal?</Label>
                  <RadioGroup 
                    value={data.operations} 
                    onValueChange={(val) => updateData("operations", val)}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="b2b" id="b2b" />
                      <div className="flex-1">
                        <Label htmlFor="b2b" className="font-bold cursor-pointer block">Empresas (B2B)</Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="b2c" id="b2c" />
                      <div className="flex-1">
                        <Label htmlFor="b2c" className="font-bold cursor-pointer block">Consumidor Final (B2C)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <Label>Maior custo operacional hoje:</Label>
                  <Select value={data.costStructure} onValueChange={(val) => updateData("costStructure", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o custo principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="folha">Folha de Pagamento</SelectItem>
                      <SelectItem value="mercadorias">Estoque / Mercadorias</SelectItem>
                      <SelectItem value="logistica">Logística e Frete</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia e Licenças</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="flex flex-col items-center justify-center text-center h-[380px] animate-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="h-24 w-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6 relative z-10 shadow-xl">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-3">Diagnóstico Legal Concluído</h3>
                <p className="text-muted-foreground max-w-md">
                  Seu plano está fundamentado na <strong>EC 132/23</strong>, <strong>LC 214/25</strong> e <strong>LC 227/26</strong>, integrando as últimas notas técnicas da RFB e Comitê Gestor do IBS.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1 || step === 6}
              className={step === 6 ? "invisible" : "w-[100px]"}
            >
              {step > 1 && <ArrowLeft className="mr-2 h-4 w-4" />}
              Voltar
            </Button>
            <Button 
              onClick={handleNext}
              className="w-[160px] shadow-sm font-bold"
              size="lg"
            >
              {step === 6 ? "GERAR PLANO" : "CONTINUAR"}
              {step < 6 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
