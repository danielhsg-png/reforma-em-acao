import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { 
  AlertTriangle, 
  Calculator, 
  TrendingDown, 
  TrendingUp, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  ShieldAlert, 
  Target, 
  BarChart, 
  Layers, 
  Zap,
  TrendingUp as TrendingUpIcon
} from "lucide-react";
import { Link } from "wouter";
import CurrencyInput from "@/components/core/CurrencyInput";
import { cn } from "@/lib/utils";

function SimulatorIntro({ onStart }: { onStart: () => void }) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(var(--primary-rgb),0.1),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-screen-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/5 mb-4 group-hover:scale-110 transition-transform duration-500">
            <Calculator className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white tracking-tighter uppercase italic" data-testid="text-simulator-title">
            Simulador <span className="text-primary not-italic">Financeiro</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed">
            Projeção Estratégica de Impacto IBS/CBS no Fluxo de Caixa Corporate 2026—2033.
          </p>
        </div>

        <Card className="glass-card p-2 border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-8 md:p-12 space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Projeção 2033</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tighter leading-relaxed">Visualização do impacto nas alíquotas de transição plena.</p>
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                  <Layers className="h-6 w-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Crédito Estrito</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tighter leading-relaxed">Simulação baseada em compras e serviços documentados.</p>
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Split Retenção</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tighter leading-relaxed">Análise de retenção automática na liquidação financeira.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="glass-card border-amber-500/20 bg-amber-500/5 p-6 rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-200/80 font-bold uppercase tracking-widest leading-relaxed">
                    Disclaimer Profissional: Esta ferramenta possui caráter comparativo e exploratório. Os resultados são estimativas indicativas e não constituem parecer técnico oficial ou garantia de carga tributária final.
                  </p>
                </div>
                <label className="flex items-center gap-4 cursor-pointer group" data-testid="label-acknowledge">
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    acknowledged ? "bg-amber-500 border-amber-500" : "border-amber-500/30 bg-white/5"
                  )}>
                    {acknowledged && <CheckCircle2 className="h-4 w-4 text-black" />}
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      className="hidden"
                      data-testid="checkbox-acknowledge"
                    />
                  </div>
                  <span className="text-[10px] text-amber-200 font-black uppercase tracking-widest group-hover:text-amber-400 transition-colors">
                    Li e concordo com os termos de uso do simulador estratégico.
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className={cn(
                    "w-full h-16 font-black uppercase tracking-[0.2em] text-[10px] group transition-all",
                    acknowledged 
                      ? "bg-primary text-background shadow-2xl shadow-primary/20 hover:scale-[1.02] hover:bg-white active:scale-95" 
                      : "bg-white/5 text-muted-foreground border-white/10 cursor-not-allowed"
                  )}
                  onClick={onStart}
                  disabled={!acknowledged}
                  data-testid="button-start-simulator"
                >
                  Confirmar e Iniciar Análise
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function FinancialSimulation() {
  const { data } = useAppStore();
  const [started, setStarted] = useState(false);

  const [revenue, setRevenue] = useState(100000);
  const [payroll, setPayroll] = useState(30000);
  const [suppliesStandard, setSuppliesStandard] = useState(20000);
  const [suppliesSimples, setSuppliesSimples] = useState(10000);
  const [year, setYear] = useState("2033");

  const valRevenue = revenue || 0;
  const valPayroll = payroll || 0;
  const valStandard = suppliesStandard || 0;
  const valSimples = suppliesSimples || 0;

  let currentTaxRate = 0.15;
  if (data.regime === "simples") currentTaxRate = 0.08;
  if (data.regime === "lucro_real") currentTaxRate = 0.18;

  const currentTax = valRevenue * currentTaxRate;

  const transitionRates: Record<string, { cbs: number; ibs: number; label: string }> = {
    "2026": { cbs: 0.009, ibs: 0.001, label: "Fase de Teste" },
    "2027": { cbs: 0.088, ibs: 0.001, label: "CBS Plena, IBS 0,1%" },
    "2029": { cbs: 0.088, ibs: 0.0354, label: "IBS +10% (ICMS/ISS a 90%)" },
    "2030": { cbs: 0.088, ibs: 0.0708, label: "IBS +20% (ICMS/ISS a 80%)" },
    "2031": { cbs: 0.088, ibs: 0.1062, label: "IBS +30% (ICMS/ISS a 70%)" },
    "2032": { cbs: 0.088, ibs: 0.1416, label: "IBS +40% (ICMS/ISS a 60%)" },
    "2033": { cbs: 0.088, ibs: 0.177, label: "Sistema Pleno" },
  };

  const selectedRates = transitionRates[year] || transitionRates["2033"];
  const baseNewTaxRate = selectedRates.cbs + selectedRates.ibs;

  const regimes60 = ["saude_servicos", "saude_dispositivos", "saude_medicamentos", "educacao", "alimentos_reduzidos", "agro_insumos", "transporte_coletivo", "hotelaria_turismo", "higiene_limpeza", "cultura"];
  const regimes30 = ["profissional_liberal"];
  const regimesZero = ["cesta_basica"];
  const regimesSpecific = ["combustiveis", "financeiro", "imobiliario", "cooperativa", "zfm"];
  const regimesSeletivo = ["seletivo_bebidas", "seletivo_tabaco", "seletivo_veiculos", "seletivo_minerio"];

  let regimeReduction = 0;
  let seletivoExtra = 0;
  let regimeLabel = "";
  if (data.specialRegimes.some((r) => regimesZero.includes(r))) {
    regimeReduction = 1.0;
    regimeLabel = "Alíquota Zero";
  } else if (data.specialRegimes.some((r) => regimes60.includes(r))) {
    regimeReduction = 0.6;
    regimeLabel = "Redução 60%";
  } else if (data.specialRegimes.some((r) => regimes30.includes(r))) {
    regimeReduction = 0.3;
    regimeLabel = "Redução 30%";
  } else if (data.specialRegimes.some((r) => regimesSpecific.includes(r))) {
    regimeReduction = 0.2;
    regimeLabel = "Regime Específico";
  }
  if (data.specialRegimes.some((r) => regimesSeletivo.includes(r))) {
    seletivoExtra = 0.01;
    regimeLabel = regimeLabel ? regimeLabel + " + IS" : "Imposto Seletivo";
  }

  const newTaxRate = baseNewTaxRate * (1 - regimeReduction) + seletivoExtra;
  const debit = valRevenue * newTaxRate;

  const creditStandard = valStandard * newTaxRate;
  const creditSimples = valSimples * 0.05;
  const totalCredit = creditStandard + creditSimples;

  const newTax = Math.max(0, debit - totalCredit);
  const difference = newTax - currentTax;
  const isWorse = difference > 0;

  const splitPaymentImpact = valRevenue * newTaxRate;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!started) {
    return (
      <MainLayout>
        <SimulatorIntro onStart={() => setStarted(true)} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Hub Header Style Content */}
      <div className="relative border-b border-white/5 py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-30%,rgba(var(--primary-rgb),0.1),transparent_70%)] pointer-events-none" />
        
        <div className="container max-w-screen-xl mx-auto px-6 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Simulação Quantitativa v2.5</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic" data-testid="text-simulation-title">
                Simulador de <span className="text-primary not-italic">Impacto Financeiro</span>
              </h1>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest leading-relaxed max-w-2xl">
                Projeção do IBS/CBS vs. Regime Atual: Análise de Fluxo de Caixa e Carga Efetiva Transição 2033.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-screen-xl mx-auto py-12 px-6 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 border-white/5 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em]">Parâmetros Mensais</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Faturamento Bruto</Label>
                  <CurrencyInput 
                    value={revenue} 
                    onChange={setRevenue} 
                    className="h-14 bg-white/5 border-white/10 text-white font-black text-xl tracking-tight"
                    data-testid="input-sim-revenue"
                  />
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Folha de Pagamento</Label>
                     <Badge variant="destructive" className="text-[8px] font-black uppercase tracking-widest py-0">Sem Crédito</Badge>
                   </div>
                  <CurrencyInput 
                    value={payroll} 
                    onChange={setPayroll} 
                    className="h-14 bg-white/5 border-white/10 text-white font-bold"
                    data-testid="input-sim-payroll"
                  />
                  <p className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-tighter">Salários e encargos (LC 214/2025, art. 36).</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Insumos (Lucro Real/Pres.)</Label>
                     <Badge className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest py-0 border-primary/20">Crédito Pleno</Badge>
                  </div>
                  <CurrencyInput 
                    value={suppliesStandard} 
                    onChange={setSuppliesStandard} 
                    className="h-14 bg-white/5 border-white/10 text-white font-bold"
                    data-testid="input-sim-standard"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Insumos (Simples)</Label>
                     <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest py-0 border-white/10 text-muted-foreground">Crédito ~5%</Badge>
                  </div>
                  <CurrencyInput 
                    value={suppliesSimples} 
                    onChange={setSuppliesSimples} 
                    className="h-14 bg-white/5 border-white/10 text-white font-bold"
                    data-testid="input-sim-simples"
                  />
                </div>

                <div className="space-y-3 border-t border-white/5 pt-6">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Janela de Projeção
                  </Label>
                  <Select value={year} onValueChange={setYear} data-testid="select-sim-year">
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white font-bold uppercase tracking-widest text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      <SelectItem value="2026">2026 — Transição (1.0%)</SelectItem>
                      <SelectItem value="2027">2027 — CBS Plena (8.9%)</SelectItem>
                      <SelectItem value="2029">2029 — ICMS/ISS 90% (12.3%)</SelectItem>
                      <SelectItem value="2033">2033 — Sistema Pleno (26.5%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-white/5 bg-white/[0.02] flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-relaxed">
                Este cálculo não considera IPI, ICMS-ST, variações de NCM ou regimes híbridos complexos.
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Status Alert Badge */}
            {data.specialRegimes.length > 0 && regimeLabel && (
              <div className="glass-card p-6 border-primary/20 bg-primary/5 flex items-center gap-6 animate-in slide-in-from-top-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                   <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Aplicação de Regime Favorecido Homologado</h3>
                   <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">
                     Alíquota ajustada para <strong>{(newTaxRate * 100).toFixed(1)}%</strong> conforme diretrizes de {regimeLabel}.
                   </p>
                </div>
              </div>
            )}

            <Tabs defaultValue="impacto" className="space-y-8">
              <TabsList className="bg-white/5 border border-white/10 p-1.5 h-14 rounded-2xl">
                <TabsTrigger value="impacto" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-background transition-all">
                  Cenário de Carga Efetiva
                </TabsTrigger>
                <TabsTrigger value="split" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-accent data-[state=active]:text-background transition-all">
                  Retenção Automática (Split)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="impacto" className="space-y-8 animate-in fade-in duration-500">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="glass-card p-8 border-white/5 bg-white/[0.02] relative overflow-hidden group">
                     <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Referência Atual ({data.regime.toUpperCase()})</p>
                     <div className="text-4xl font-black text-white tracking-tighter" data-testid="text-current-tax">{formatCurrency(currentTax)}</div>
                     <p className="text-[10px] text-muted-foreground/50 font-bold uppercase mt-4 tracking-widest italic">~ {(currentTaxRate * 100).toFixed(1)}% sobre faturamento</p>
                   </div>

                   <div className={cn(
                     "glass-card p-8 border relative overflow-hidden group",
                     isWorse ? "border-destructive/30 bg-destructive/5" : "border-primary/30 bg-primary/5"
                   )}>
                     <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl transition-colors opacity-20" />
                     <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Projeção {year} (IBS/CBS)</p>
                        {isWorse ? <TrendingUpIcon className="h-4 w-4 text-destructive" /> : <TrendingDown className="h-4 w-4 text-primary" />}
                     </div>
                     <div className={cn("text-4xl font-black tracking-tighter", isWorse ? "text-destructive" : "text-primary")} data-testid="text-new-tax">
                       {formatCurrency(newTax)}
                     </div>
                     <p className="text-[10px] text-muted-foreground font-bold uppercase mt-4 tracking-widest">
                       Alíquota Efetiva Pós-Créditos: {valRevenue > 0 ? ((newTax / valRevenue) * 100).toFixed(1) : "0.0"}%
                     </p>
                   </div>
                </div>

                <div className="glass-card border-white/5 overflow-hidden">
                  <div className="bg-white/[0.03] px-8 py-5 border-b border-white/5 flex items-center justify-between">
                     <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                       <BarChart className="h-4 w-4 text-primary" />
                       Composição do Cálculo Estratégico
                     </h3>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Débito Estimado ({(newTaxRate * 100).toFixed(1)}%):</span>
                      <span className="font-black text-destructive text-lg">{formatCurrency(debit)}</span>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Créditos Tributários Projetados:</span>
                      <div className="grid gap-3 pl-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Cadeia Padrão:</span>
                          <span className="font-black text-primary">{formatCurrency(creditStandard)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Forn. Simples Nacional:</span>
                          <span className="font-black text-primary">{formatCurrency(creditSimples)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-dashed border-white/10 font-black">
                          <span className="text-[10px] uppercase tracking-widest text-white">Total de Créditos:</span>
                          <span className="text-primary">- {formatCurrency(totalCredit)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-2xl font-black border-t border-white/5 pt-6 text-white uppercase tracking-tighter">
                      <span>Imposto Líquido ({year}):</span>
                      <span className="text-primary italic px-4 py-1 rounded bg-primary/10 border border-primary/20">{formatCurrency(newTax)}</span>
                    </div>
                  </div>
                </div>

                {isWorse ? (
                  <div className="glass-card border-destructive/30 bg-destructive/5 p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Sinal de Alerta Estratégico</h3>
                    </div>
                    <div className="space-y-4">
                       <p className="text-sm font-medium text-white/90 leading-relaxed">
                         Neste cenário, a carga tributária indicativa sofre um aumento de aproximadamente <strong>{formatCurrency(difference)}/mês</strong>.
                       </p>
                       <div className="grid gap-3 pt-2">
                         <div className="flex items-center gap-3">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avaliar repasse "por fora" nos contratos</p>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revisar compras de fornecedores do Simples</p>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mapear contratos de longo prazo (reequilíbrio)</p>
                         </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card border-primary/30 bg-primary/5 p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Cenário Favorável Detectado</h3>
                    </div>
                    <p className="text-sm font-medium text-white/90 leading-relaxed">
                      A carga tributária efetiva tende a reduzir em aproximadamente <strong>{formatCurrency(Math.abs(difference))}/mês</strong> em {year}.
                      A cadeia de insumos permite uma recuperação eficiente de créditos sob o novo regime.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="split" className="space-y-8 animate-in fade-in duration-500">
                <div className="glass-card p-8 border-white/5 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                      <CreditCard className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Impacto de Retenção (Split Payment)</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">LC 214/2025, Art. 50-55</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-card p-6 bg-white/[0.02] border-white/5 space-y-4">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fluxo Cashless (Atual)</p>
                       <div className="flex justify-between items-center font-black">
                         <span className="text-xs text-white">Recebimento Bruto:</span>
                         <span className="text-emerald-500 text-lg font-mono">{formatCurrency(valRevenue)}</span>
                       </div>
                       <p className="text-[10px] text-muted-foreground uppercase opacity-50">Imposto pago via guia em D+30/D+45.</p>
                    </div>

                    <div className="glass-card p-6 bg-accent/5 border-accent/20 space-y-4 shadow-xl shadow-accent/5">
                       <p className="text-[10px] font-black text-accent uppercase tracking-widest">Fluxo Split ({year})</p>
                       <div className="flex justify-between items-center mb-2 border-b border-accent/10 pb-4">
                         <span className="text-xs text-white font-bold">Retenção Automática:</span>
                         <span className="text-destructive text-lg font-mono">- {formatCurrency(splitPaymentImpact)}</span>
                       </div>
                       <div className="flex justify-between items-center pt-2">
                         <span className="text-xs text-white font-black uppercase tracking-widest">Recebimento Líquido:</span>
                         <span className="text-accent text-xl font-bold font-mono">{formatCurrency(valRevenue - splitPaymentImpact)}</span>
                       </div>
                    </div>
                  </div>

                  <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-4">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-1" />
                    <div className="space-y-2">
                      <p className="text-sm font-black text-white uppercase tracking-tight">Redução de {formatCurrency(splitPaymentImpact)} no Caixa Imediato</p>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                        O Split Payment não é um custo extra, mas uma antecipação de desembolso no momento da liquidação financeira. Planejar o capital de giro é crítico para 2026.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-start">
              <Button 
                variant="outline" 
                onClick={() => setStarted(false)} 
                className="h-12 px-8 font-black uppercase tracking-widest text-[10px] border-white/10 text-muted-foreground hover:bg-white/5"
              >
                <ArrowLeft className="mr-3 h-4 w-4" />
                Reiniciar Análise
              </Button>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
