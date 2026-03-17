import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Building, Building2, CheckCircle2, Factory, Landmark, ShoppingBag, Store, Tractor, Info, Monitor, Users, Truck, Scale, ShieldAlert, Target, Loader2, Sparkles, LogOut, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

const TOTAL_STEPS = 11;

const BLOCKS = [
  { id: 1, label: "Identificação", steps: [1, 2], icon: Building },
  { id: 2, label: "Tributário", steps: [3, 4], icon: Landmark },
  { id: 3, label: "Operacional", steps: [5, 6, 7], icon: Users },
  { id: 4, label: "Sistemas", steps: [8, 9], icon: Monitor },
  { id: 5, label: "Prontidão", steps: [10], icon: Scale },
  { id: 6, label: "Conclusão", steps: [11], icon: CheckCircle2 },
];

function getBlockForStep(step: number) {
  return BLOCKS.find((b) => b.steps.includes(step))!;
}

function getStepWithinBlock(step: number) {
  const block = getBlockForStep(step);
  return { index: block.steps.indexOf(step) + 1, total: block.steps.length };
}

const SPECIAL_REGIME_OPTIONS = [
  { id: "saude_servicos", group: "Saude", label: "Servicos de Saude", desc: "Hospitais, clinicas, laboratorios, consultorio medico/odontologico", reduction: "60% de reducao na aliquota (LC 214, art. 275)" },
  { id: "saude_dispositivos", group: "Saude", label: "Dispositivos Medicos e Acessibilidade", desc: "Equipamentos hospitalares, proteses, orteses, dispositivos para PcD", reduction: "60% de reducao (art. 276); alguns itens aliquota zero" },
  { id: "saude_medicamentos", group: "Saude", label: "Medicamentos", desc: "Fabricacao ou comercio de farmacos/remedios", reduction: "60% de reducao; lista CMED pode ter aliquota zero (art. 277)" },
  { id: "educacao", group: "Educacao", label: "Servicos de Educacao", desc: "Escolas, universidades, cursos tecnicos, creches, educacao infantil", reduction: "60% de reducao na aliquota (art. 274)" },
  { id: "cesta_basica", group: "Alimentos", label: "Cesta Basica Nacional", desc: "Arroz, feijao, farinha de mandioca/trigo, pao frances, leite, ovos, horticolas", reduction: "Aliquota ZERO para 22 itens (arts. 282-287)" },
  { id: "alimentos_reduzidos", group: "Alimentos", label: "Alimentos com Reducao", desc: "Carnes, peixes, queijos, acucar, farinha de aveia, oleo, manteiga, cafe", reduction: "60% de reducao na aliquota" },
  { id: "agro_insumos", group: "Agropecuaria", label: "Insumos Agropecuarios", desc: "Sementes, fertilizantes, defensivos, racoes, implementos agricolas", reduction: "60% de reducao na aliquota (art. 279)" },
  { id: "transporte_coletivo", group: "Transporte", label: "Transporte Coletivo de Passageiros", desc: "Onibus urbano, metropolitano, intermunicipal, ferroviario", reduction: "60% de reducao na aliquota (art. 280)" },
  { id: "profissional_liberal", group: "Profissionais", label: "Profissional Liberal Regulamentado", desc: "Advogados, contadores, engenheiros, arquitetos, medicos, dentistas, psicologos", reduction: "30% de reducao na aliquota (18 categorias - LC 214/LC 227)" },
  { id: "imobiliario", group: "Imobiliario", label: "Operacoes Imobiliarias", desc: "Venda de imoveis, incorporacao, locacao, loteamento, construcao civil", reduction: "Regime especifico com redutor social (arts. 257-263)" },
  { id: "combustiveis", group: "Combustiveis", label: "Combustiveis e Lubrificantes", desc: "Distribuidora, revenda de combustiveis, postos de gasolina", reduction: "Regime monofasico com aliquota fixa por unidade (arts. 246-256)" },
  { id: "financeiro", group: "Financeiro", label: "Servicos Financeiros e Seguros", desc: "Bancos, cooperativas de credito, seguradoras, operadoras de saude", reduction: "Regime especifico cumulativo (arts. 264-268)" },
  { id: "cooperativa", group: "Cooperativas", label: "Cooperativa", desc: "Cooperativa de qualquer natureza (agro, credito, trabalho, consumo)", reduction: "Tratamento especial para atos cooperativos (arts. 269-273)" },
  { id: "zfm", group: "ZFM", label: "Zona Franca de Manaus / ALC", desc: "Opera na ZFM, ALC ou areas de livre comercio da Amazonia", reduction: "Manutencao de beneficios, credito presumido (arts. 448-473)" },
  { id: "hotelaria_turismo", group: "Turismo", label: "Hotelaria, Restaurantes e Parques", desc: "Hoteis, pousadas, bares, restaurantes, parques de diversao/tematicos", reduction: "60% de reducao na aliquota" },
  { id: "higiene_limpeza", group: "Higiene", label: "Produtos de Higiene e Limpeza", desc: "Sabao, detergente, papel higienico, produtos de limpeza essenciais", reduction: "60% de reducao na aliquota (art. 278)" },
  { id: "cultura", group: "Cultura", label: "Producoes Artisticas e Culturais", desc: "Espetaculos, museus, cinema nacional, livros, musica", reduction: "60% de reducao na aliquota; livros com aliquota zero" },
  { id: "seguranca_nacional", group: "Defesa", label: "Seguranca Nacional e Defesa", desc: "Materiais de uso das Forcas Armadas, seguranca publica", reduction: "Reducao de aliquota especifica" },
  { id: "seletivo_bebidas", group: "Imposto Seletivo", label: "Bebidas Alcoolicas ou Acucaradas", desc: "Fabricacao ou comercio de cervejas, destilados, refrigerantes", reduction: "Aliquota ADICIONAL (Imposto Seletivo - arts. 393-421)" },
  { id: "seletivo_tabaco", group: "Imposto Seletivo", label: "Tabaco e Cigarros", desc: "Fabricacao ou comercio de cigarros e derivados do tabaco", reduction: "Aliquota ADICIONAL (Imposto Seletivo)" },
  { id: "seletivo_veiculos", group: "Imposto Seletivo", label: "Veiculos, Embarcacoes, Aeronaves", desc: "Fabricacao/importacao de veiculos, embarcacoes esportivas, jatinhos", reduction: "Aliquota ADICIONAL (Imposto Seletivo)" },
  { id: "seletivo_minerio", group: "Imposto Seletivo", label: "Extracao de Minerios", desc: "Mineracao, extracao de petroleo e gas, minerios ferrosos e nao ferrosos", reduction: "Aliquota ADICIONAL de 0,25% a 1% (Imposto Seletivo)" },
];

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const { data, updateData, saveCompany, user, logout } = useAppStore();

  const currentBlock = getBlockForStep(step);
  const stepInBlock = getStepWithinBlock(step);
  const progressPercent = (step / TOTAL_STEPS) * 100;

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSaving(true);
      try {
        await saveCompany();
        setLocation("/plano-de-acao/visao-executiva");
      } catch (err) {
        console.error("Erro ao salvar empresa:", err);
        setLocation("/plano-de-acao/visao-executiva");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const inputClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <a href="/inicio" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-xs sm:text-sm">
              REFORMA<span className="text-primary">EM</span>AÇÃO
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => logout()} className="gap-1 text-muted-foreground h-8 text-xs" data-testid="button-assessment-logout">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="w-full bg-background border-b">
        <div className="container max-w-screen-lg mx-auto px-4 md:px-6">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            {BLOCKS.map((block, idx) => {
              const isActive = block.id === currentBlock.id;
              const isCompleted = block.steps[block.steps.length - 1] < step;
              const BlockIcon = block.icon;
              return (
                <div key={block.id} className="flex items-center shrink-0">
                  {idx > 0 && (
                    <ChevronRight className={`h-3.5 w-3.5 mx-0.5 shrink-0 ${isCompleted || isActive ? "text-primary/60" : "text-muted-foreground/30"}`} />
                  )}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isCompleted
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                    data-testid={`block-indicator-${block.id}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <BlockIcon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">{block.label}</span>
                    <span className="sm:hidden">{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
            data-testid="progress-bar"
          />
        </div>
      </div>

      <main className="flex-1">
        <div className="container max-w-screen-md mx-auto py-8 md:py-10 px-4 md:px-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wider" data-testid="text-block-label">
                {currentBlock.label}
              </span>
              {stepInBlock.total > 1 && (
                <span className="text-xs text-muted-foreground">
                  — Parte {stepInBlock.index} de {stepInBlock.total}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground" data-testid="text-step-counter">
              Passo {step} de {TOTAL_STEPS}
            </span>
          </div>

          <Card className="border-border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-5 border-b">
              {step === 1 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground" data-testid="text-assessment-title">Identificação da Empresa</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Informe os dados básicos do seu negócio para personalizar todo o plano de ação.
                    </p>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Factory className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Setor Econômico</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      A Reforma impacta cada setor de forma diferente. Qual é o seu setor principal?
                    </p>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Regimes Especiais & Diferenciados</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      A LC 214/2025 criou regimes com alíquotas reduzidas ou específicas. Marque os que se aplicam ao seu negócio.
                    </p>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Regime Tributário & Perfil de Compras</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      O regime atual define como você será migrado ao IBS/CBS. O perfil dos fornecedores determina os créditos disponíveis.
                    </p>
                  </div>
                </div>
              )}
              {step === 5 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Abrangência Geográfica</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Com o princípio do destino, o IBS será recolhido no estado do consumidor. Marque onde você atua.
                    </p>
                  </div>
                </div>
              )}
              {step === 6 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Porte da Empresa</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Faturamento, equipe e margem de lucro determinam o impacto financeiro real da transição.
                    </p>
                  </div>
                </div>
              )}
              {step === 7 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Perfil de Clientes & Custos</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Vendas B2B geram créditos para o comprador. O maior custo operacional define onde estão seus créditos mais valiosos.
                    </p>
                  </div>
                </div>
              )}
              {step === 8 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Sistemas & Emissão Fiscal</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      A NF-e precisará de campos novos de IBS e CBS a partir de 2026. Como está sua operação fiscal hoje?
                    </p>
                  </div>
                </div>
              )}
              {step === 9 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Perfil de Fornecedores</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fornecedores do Simples geram créditos limitados. Isso impacta diretamente seu custo final.
                    </p>
                  </div>
                </div>
              )}
              {step === 10 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Contratos & Maturidade Tributária</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contratos antigos podem não prever a nova carga. Avalie também quem cuida da parte fiscal e o conhecimento sobre Split Payment.
                    </p>
                  </div>
                </div>
              )}
              {step === 11 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading text-foreground">Diagnóstico Concluído</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Analisamos seus dados com base na EC 132/2023, LC 214/2025 e LC 227/2026.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-6 md:p-8 min-h-[380px]">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-1-content">
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
                        Usado apenas para identificação interna. Nenhum dado é compartilhado.
                      </p>
                    </div>
                  </div>
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-700">
                      Ao final deste diagnóstico, você receberá um plano de ação personalizado com módulos estratégicos,
                      cronograma de 51 dias e checklist de implementação.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-2-content">
                  <RadioGroup
                    value={data.sector}
                    onValueChange={(val) => updateData("sector", val)}
                    className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
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
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-3-content">
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      Marque todos os regimes especiais que se aplicam. Se nenhum se aplica, avance para o próximo passo.
                    </p>
                    {data.specialRegimes.length > 0 && (
                      <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-primary">{data.specialRegimes.length} regime(s) selecionado(s)</span>
                      </div>
                    )}
                  </div>
                  {(() => {
                    const groups = SPECIAL_REGIME_OPTIONS.reduce((acc, opt) => {
                      if (!acc[opt.group]) acc[opt.group] = [];
                      acc[opt.group].push(opt);
                      return acc;
                    }, {} as Record<string, typeof SPECIAL_REGIME_OPTIONS>);
                    return Object.entries(groups).map(([group, options]) => (
                      <div key={group} className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground border-b pb-1">{group}</h4>
                        <div className="grid gap-2">
                          {options.map((opt) => {
                            const checked = data.specialRegimes.includes(opt.id);
                            return (
                              <label
                                key={opt.id}
                                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${checked ? "border-primary bg-primary/5" : "hover:bg-muted/30"}`}
                                data-testid={`checkbox-regime-${opt.id}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    const current = data.specialRegimes;
                                    const next = checked ? current.filter((r) => r !== opt.id) : [...current, opt.id];
                                    updateData("specialRegimes", next);
                                  }}
                                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-bold block">{opt.label}</span>
                                  <span className="text-xs text-muted-foreground block">{opt.desc}</span>
                                  <span className={`text-[10px] font-medium block mt-1 ${opt.group === "Imposto Seletivo" ? "text-red-600" : "text-green-700"}`}>{opt.reduction}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                  {data.specialRegimes.some((r) => r.startsWith("seletivo_")) && (
                    <Alert className="bg-red-50 border-red-200">
                      <ShieldAlert className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-xs text-red-700">
                        <strong>Imposto Seletivo (IS):</strong> Os itens marcados estão sujeitos a um imposto adicional
                        sobre produtos prejudiciais à saúde ou ao meio ambiente (LC 214, arts. 393-421).
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-4-content">
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

              {step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-5-content">
                  <Label>Estados de Atuação (Vendas e Prestação de Serviços)</Label>
                  <p className="text-xs text-muted-foreground -mt-4">
                    Marque todos os estados onde sua empresa vende produtos ou presta serviços.
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

              {step === 6 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-6-content">
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
                        comprometer a viabilidade do negócio. Recalibração de preços e otimização de créditos serão prioridade máxima.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {step === 7 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-7-content">
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
                          <span className="text-xs text-muted-foreground">Seus clientes aproveitam créditos de IBS/CBS.</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                        <RadioGroupItem value="b2c" id="b2c" data-testid="radio-b2c" />
                        <div className="flex-1">
                          <Label htmlFor="b2c" className="font-bold cursor-pointer block">Consumidor Final (B2C)</Label>
                          <span className="text-xs text-muted-foreground">Preço final inclui 26,5% de IVA Dual visível na nota.</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                        <RadioGroupItem value="b2b_b2c" id="b2b_b2c" data-testid="radio-b2b-b2c" />
                        <div className="flex-1">
                          <Label htmlFor="b2b_b2c" className="font-bold cursor-pointer block">Misto (B2B + B2C)</Label>
                          <span className="text-xs text-muted-foreground">Duas estratégias de preço: com crédito e sem crédito.</span>
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

              {step === 8 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-8-content">
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

              {step === 9 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-9-content">
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
                        <strong>Impacto nos créditos:</strong> Fornecedores do Simples geram crédito proporcional
                        à alíquota efetiva deles (4-8%), não à cheia de 26,5%.
                        O módulo "Cadeia de Fornecedores" trará recomendações específicas.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {step === 10 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" data-testid="step-10-content">
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

              {step === 11 && (
                <div className="flex flex-col items-center justify-center text-center min-h-[380px] animate-in zoom-in-95 duration-500" data-testid="step-11-content">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                    <div className="h-20 w-20 bg-green-600 text-white rounded-full flex items-center justify-center relative z-10 shadow-xl">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-2">Tudo pronto!</h3>
                  <p className="text-muted-foreground max-w-md mb-6 text-sm">
                    Cruzamos os dados de <strong>{data.companyName || "sua empresa"}</strong> com a legislação vigente
                    e vamos gerar um plano personalizado.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center max-w-xs w-full mb-6">
                    <div className="bg-primary/5 rounded-lg p-3 border">
                      <div className="text-lg font-bold text-primary">8</div>
                      <div className="text-[10px] text-muted-foreground">Módulos</div>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3 border">
                      <div className="text-lg font-bold text-primary">51</div>
                      <div className="text-[10px] text-muted-foreground">Dias</div>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3 border">
                      <div className="text-lg font-bold text-primary">3</div>
                      <div className="text-[10px] text-muted-foreground">Leis Base</div>
                    </div>
                  </div>
                  <div className="text-left bg-muted/20 rounded-lg p-4 w-full max-w-md space-y-1 border">
                    <p className="text-xs font-bold text-foreground mb-2">Seu plano inclui:</p>
                    <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                      <span>1. Visão Executiva e Recomendações</span>
                      <span>2. Diagnóstico de Risco (8 indicadores)</span>
                      <span>3. Gestão de Sistemas & NF-e</span>
                      <span>4. Cadeia de Fornecedores (Matriz A/B/C)</span>
                      <span>5. Estratégia de Precificação</span>
                      <span>6. Rotinas Semanais de Controle</span>
                      <span>7. Cronograma de 51 Dias</span>
                      <span>8. Checklist Final do Dono</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-4 max-w-md italic">
                    Fundamentado na EC 132/2023, LC 214/2025, LC 227/2026 e diretrizes do Comitê Gestor do IBS.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-muted/10 px-6 py-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className={step === 11 ? "invisible" : "gap-2"}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
              <Button
                onClick={handleNext}
                className="min-w-[180px] shadow-sm font-bold gap-2"
                size="lg"
                disabled={saving}
                data-testid="button-next"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {step === 11 ? "GERAR PLANO DE AÇÃO" : "CONTINUAR"}
                {step < 11 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t py-4 mt-auto">
        <div className="container flex items-center justify-center max-w-screen-2xl px-4">
          <p className="text-center text-xs text-muted-foreground">
            As informações não substituem consultoria tributária e jurídica especializada.
          </p>
        </div>
      </footer>
    </div>
  );
}
