import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Building2, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle,
  LogOut, Loader2, FileText, Target, ShieldAlert, TrendingDown,
  Download, ChevronRight, Info, Sparkles, Factory, Store,
  ShoppingBag, Landmark, Tractor, Building, Monitor, Truck,
  Scale, Users, DollarSign, Calendar, ClipboardList, BarChart3,
  Home, RefreshCw,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { generateActionPlanPdf } from "@/lib/generatePdf";

const INPUT_SCREENS = 7;

const SCREEN_LABELS = [
  "Apresentação",
  "Cadastro da Empresa",
  "Enquadramento Tributário",
  "Como a Empresa Vende",
  "Como a Empresa Compra",
  "Sistemas e Emissão Fiscal",
  "Financeiro e Caixa",
  "Contratos e Governança",
  "Diagnóstico",
  "Plano de Ação",
  "Relatório Final",
];

const SPECIAL_REGIMES = [
  { id: "saude_servicos", label: "Serviços de Saúde", desc: "Hospitais, clínicas, consultórios médicos/odontológicos", note: "60% de redução", color: "green" },
  { id: "saude_medicamentos", label: "Medicamentos e Farmácias", desc: "Fabricação ou comércio de fármacos e remédios", note: "60% de redução / alíquota zero (lista CMED)", color: "green" },
  { id: "educacao", label: "Educação", desc: "Escolas, universidades, cursos técnicos, creches", note: "60% de redução", color: "green" },
  { id: "cesta_basica", label: "Alimentos da Cesta Básica", desc: "Arroz, feijão, farinha, pão, leite, ovos, hortaliças", note: "Alíquota ZERO", color: "green" },
  { id: "alimentos_reduzidos", label: "Outros Alimentos", desc: "Carnes, peixes, queijos, açúcar, café, óleos", note: "60% de redução", color: "green" },
  { id: "agro_insumos", label: "Insumos Agropecuários", desc: "Sementes, fertilizantes, defensivos, rações", note: "60% de redução", color: "green" },
  { id: "transporte_coletivo", label: "Transporte Coletivo de Passageiros", desc: "Ônibus, metrô, trem, ferry", note: "60% de redução", color: "green" },
  { id: "profissional_liberal", label: "Profissional Liberal Regulamentado", desc: "Advogados, contadores, engenheiros, arquitetos, médicos", note: "30% de redução (18 categorias)", color: "green" },
  { id: "imobiliario", label: "Imóveis e Construção Civil", desc: "Venda, incorporação, locação, loteamento, obra civil", note: "Regime específico com redutor social", color: "green" },
  { id: "combustiveis", label: "Combustíveis e Lubrificantes", desc: "Distribuidora ou revenda de combustíveis, posto de gasolina", note: "Regime monofásico com alíquota fixa", color: "green" },
  { id: "hotelaria_turismo", label: "Hotelaria, Restaurantes e Turismo", desc: "Hotéis, pousadas, bares, restaurantes, parques temáticos", note: "60% de redução", color: "green" },
  { id: "cooperativa", label: "Cooperativa", desc: "Cooperativa de qualquer natureza (agro, crédito, trabalho)", note: "Tratamento especial para atos cooperativos", color: "green" },
  { id: "zfm", label: "Zona Franca de Manaus / ALC", desc: "Opera na ZFM ou áreas de livre comércio da Amazônia", note: "Benefícios mantidos + crédito presumido", color: "green" },
  { id: "higiene_limpeza", label: "Higiene e Limpeza Essenciais", desc: "Sabão, detergente, papel higiênico, produtos de limpeza", note: "60% de redução", color: "green" },
  { id: "cultura", label: "Cultura, Arte e Entretenimento", desc: "Espetáculos, museus, livros, cinema nacional, música", note: "60% de redução / livros com alíquota zero", color: "green" },
  { id: "seletivo_bebidas", label: "Bebidas Alcoólicas ou Açucaradas", desc: "Cervejas, destilados, refrigerantes", note: "⚠ Imposto Seletivo ADICIONAL", color: "red" },
  { id: "seletivo_tabaco", label: "Tabaco e Cigarro", desc: "Fabricação ou comércio de cigarros e derivados", note: "⚠ Imposto Seletivo ADICIONAL", color: "red" },
  { id: "seletivo_veiculos", label: "Veículos, Embarcações ou Aeronaves", desc: "Fabricação/importação de veículos esportivos, jatos, lanchas", note: "⚠ Imposto Seletivo ADICIONAL", color: "red" },
];

interface RiskItem {
  level: "critico" | "alto" | "moderado";
  title: string;
  desc: string;
  action: string;
}

interface AppData {
  companyName: string; cnpj: string; sector: string; regime: string;
  operations: string; purchaseProfile: string; salesStates: string[];
  costStructure: string; riskScore: number; monthlyRevenue: string;
  employeeCount: string; profitMargin: string; erpSystem: string;
  nfeEmission: string; invoiceVolume: string; supplierCount: string;
  simplesSupplierPercent: string; hasLongTermContracts: string;
  priceRevisionClause: string; taxResponsible: string;
  splitPaymentAware: string; mainConcern: string; specialRegimes: string[];
}

function computeRisk(data: AppData): { score: number; items: RiskItem[] } {
  const items: RiskItem[] = [];
  let score = 0;

  if (data.erpSystem === "nenhum" || data.erpSystem === "planilha") {
    items.push({
      level: "critico",
      title: "Sistema fiscal inadequado para 2026",
      desc: "Sem um ERP integrado, a emissão de notas fiscais com os novos campos obrigatórios de IBS e CBS será inviável a partir de janeiro de 2026.",
      action: "Adotar um sistema de gestão (Bling, Omie, Conta Azul ou similar) com prazo imediato.",
    });
    score += 25;
  }

  if (data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao") {
    items.push({
      level: "critico",
      title: "Contratos de longo prazo sem proteção tributária",
      desc: "Você tem contratos longos sem cláusula de reequilíbrio tributário. Sua empresa pode ser obrigada a absorver toda a nova carga.",
      action: "Revisar contratos com urgência e negociar a cláusula de revisão prevista na LC 214/2025, art. 378.",
    });
    score += 22;
  }

  if (data.costStructure === "folha") {
    items.push({
      level: "alto",
      title: "Maior custo não gera crédito tributário",
      desc: "Folha de pagamento é seu maior custo e NÃO gera crédito de IBS/CBS. Isso eleva a carga tributária efetiva da sua empresa.",
      action: "Simular o impacto real na margem e recalibrar a tabela de preços antes de 2026.",
    });
    score += 20;
  }

  if (data.sector === "servicos") {
    items.push({
      level: "alto",
      title: "Setor de serviços: maior impacto da reforma",
      desc: "O ISS atual (2% a 5%) será substituído pelo IBS/CBS. A carga pode subir significativamente, especialmente para empresas com alto custo de mão de obra.",
      action: "Revisar toda a tabela de preços e projetar cenários com o novo regime antes de renovar contratos.",
    });
    score += 18;
  }

  if (data.profitMargin === "ate_5" || data.profitMargin === "5_10") {
    items.push({
      level: "alto",
      title: "Margem de lucro vulnerável à reforma",
      desc: "Com margem abaixo de 10%, qualquer variação de carga tributária pode comprometer a viabilidade do negócio.",
      action: "Recalcular estrutura de preços imediatamente com base no novo regime e no impacto do Split Payment.",
    });
    score += 16;
  }

  if (data.simplesSupplierPercent === "acima_60") {
    items.push({
      level: "alto",
      title: "Fornecedores com crédito limitado",
      desc: "Mais de 60% dos seus fornecedores são do Simples Nacional. Eles geram créditos de 4% a 8%, não os 26,5% cheios. Isso eleva seu custo efetivo.",
      action: "Classificar fornecedores na matriz A/B/C e negociar preços que compensem a diferença de crédito.",
    });
    score += 15;
  } else if (data.simplesSupplierPercent === "30_60") {
    items.push({
      level: "moderado",
      title: "Parte dos fornecedores com crédito reduzido",
      desc: "30% a 60% dos seus fornecedores são do Simples. Os créditos gerados são menores que o esperado.",
      action: "Classificar fornecedores e priorizar renegociações com os de maior volume de compra.",
    });
    score += 8;
  }

  if (data.splitPaymentAware === "nao") {
    items.push({
      level: "moderado",
      title: "Risco de fluxo de caixa pelo Split Payment",
      desc: "O Split Payment retém o imposto no momento do pagamento (cartão, PIX, boleto). Você passará a receber o valor líquido já com o tributo descontado.",
      action: "Entender o mecanismo, simular o impacto no caixa e ajustar o capital de giro antes de 2026.",
    });
    score += 10;
  }

  const geoStates = data.salesStates;
  const isMultiState = geoStates.includes("many_states") || geoStates.includes("national") || geoStates.length > 5;
  if (isMultiState) {
    items.push({
      level: "moderado",
      title: "Operação interestadual: cálculo por destino",
      desc: "Com o IBS, o imposto é calculado pela alíquota do estado do comprador (princípio do destino). Cada estado terá uma alíquota diferente.",
      action: "Confirmar se o ERP calcula o IBS pelo estado de destino de cada venda.",
    });
    score += 8;
  }

  if (data.regime === "lucro_presumido") {
    items.push({
      level: "moderado",
      title: "Lucro Presumido será extinto gradualmente",
      desc: "O regime de Lucro Presumido (PIS/COFINS cumulativos) será substituído pelo regime não-cumulativo pleno, que exige controles fiscais mais rigorosos.",
      action: "Planejar a transição com o contador e avaliar se há necessidade de ajustar processos internos.",
    });
    score += 6;
  }

  score = Math.min(score, 100);
  return { score, items };
}

interface PlanTask { id: string; title: string; desc: string; priority: boolean; }
interface PlanPhase { phase: number; title: string; subtitle: string; color: string; tasks: PlanTask[]; }

function generatePlan(data: AppData, risks: RiskItem[]): PlanPhase[] {
  const criticalCount = risks.filter((r) => r.level === "critico").length;
  const hasERP = data.erpSystem !== "nenhum" && data.erpSystem !== "planilha";
  const hasContracts = data.hasLongTermContracts === "sim";
  const isSimples = data.regime === "simples";
  const isB2B = data.operations === "b2b" || data.operations === "b2b_b2c";

  const phase1: PlanTask[] = [
    {
      id: "system",
      title: "Contatar fornecedor do sistema (ERP/emissor)",
      desc: `Perguntar especificamente: "Qual é o seu plano para os novos campos de IBS/CBS na NF-e? Quando teremos uma versão de teste?" ${!hasERP ? "⚠ Se não tem sistema: avaliar Bling, Omie ou Conta Azul imediatamente." : ""}`,
      priority: !hasERP || criticalCount > 0,
    },
    {
      id: "top30",
      title: "Listar as 30 mercadorias/serviços mais vendidos",
      desc: "Identificar no sistema os itens com maior faturamento, margem e giro. Verificar se cada um tem NCM ou NBS correto cadastrado.",
      priority: true,
    },
    {
      id: "top20_suppliers",
      title: "Listar e classificar os 20 principais fornecedores",
      desc: "Usar a matriz A/B/C: A = gera crédito integral (Lucro Real/Presumido com NF-e), B = crédito parcial (Simples), C = sem crédito (pessoa física ou informal).",
      priority: true,
    },
    {
      id: "responsible",
      title: "Definir o responsável pela adaptação à reforma",
      desc: "Quem será o ponto focal interno para cadastros, emissão e conferência fiscal? Se não houver equipe, alinhar com o contador externo.",
      priority: criticalCount > 1,
    },
    ...(hasContracts ? [{
      id: "contracts",
      title: "Levantar todos os contratos de longo prazo",
      desc: "Listar contratos com vigência além de 2026. Verificar se há cláusula de revisão tributária. Se não houver, incluir nas próximas renovações (LC 214/2025, art. 378).",
      priority: data.priceRevisionClause === "nao",
    }] : []),
  ];

  const phase2: PlanTask[] = [
    {
      id: "catalog",
      title: "Padronizar o cadastro dos 30 principais itens",
      desc: "Cada item deve ter: código único, descrição padronizada, unidade de medida fixa, NCM/NBS e categoria tributária correta. Eliminar duplicatas.",
      priority: true,
    },
    {
      id: "weekly_routine",
      title: "Implantar rotina semanal de auditoria de dados",
      desc: "Toda segunda-feira: revisar os 20 itens mais vendidos + 10 mais comprados (30 minutos). Toda quarta: conciliar vendas por canal (1 hora). Último dia útil: reunião com contador.",
      priority: false,
    },
    {
      id: "nfe_test",
      title: "Preparar ambiente de testes da NF-e",
      desc: "Solicitar acesso ao ambiente de homologação com alíquotas simuladas (CBS 0,9% + IBS 0,1%). Emitir 10 notas de teste e validar os campos novos antes de janeiro de 2026.",
      priority: !hasERP,
    },
    ...(isSimples && isB2B ? [{
      id: "simples_option",
      title: "Avaliar recolhimento de IBS/CBS fora do Simples",
      desc: "Empresas do Simples que vendem para outras empresas podem optar por recolher IBS/CBS separadamente, gerando crédito integral de 26,5% para os clientes (argumento de venda poderoso).",
      priority: false,
    }] : []),
    {
      id: "supplier_audit",
      title: "Formalizar auditoria com os fornecedores Classe B/C",
      desc: "Notificar fornecedores com qualidade de nota insuficiente. Prazo de 90 dias para adequação. Classe C sem melhora = substituir nos itens críticos.",
      priority: data.simplesSupplierPercent === "acima_60",
    },
  ];

  const phase3: PlanTask[] = [
    {
      id: "pricing",
      title: "Definir nova fórmula de precificação",
      desc: `Fórmula: Custo + Margem = Preço Líquido. Preço Líquido × (1 + alíquota efetiva) = Preço Bruto. ${isB2B ? "Para B2B: destacar o crédito gerado como argumento de venda." : "Para B2C: comunicar mudança com antecedência ao mercado."}`,
      priority: data.profitMargin === "ate_5" || data.profitMargin === "5_10",
    },
    {
      id: "split_payment",
      title: "Simular impacto do Split Payment no caixa",
      desc: "Calcular: faturamento mensal × alíquota IBS/CBS = valor retido na fonte. Ajustar capital de giro ou linhas de crédito para absorver a diferença antes de 2026.",
      priority: data.splitPaymentAware === "nao",
    },
    {
      id: "team_training",
      title: "Treinar a equipe operacional",
      desc: "Equipe de vendas: nova mecânica de preços e créditos. Equipe fiscal: novos campos da NF-e. Equipe financeira: impacto do Split Payment no recebimento.",
      priority: false,
    },
    {
      id: "final_validation",
      title: "Validação final com contador antes de 2026",
      desc: "Reunião de fechamento para confirmar: sistema atualizado, cadastros padronizados, rotinas funcionando, contratos revisados e equipe treinada.",
      priority: true,
    },
  ];

  return [
    { phase: 1, title: "Fase 1: O Essencial", subtitle: "Próximos 7 dias — eliminar os riscos críticos", color: "destructive", tasks: phase1 },
    { phase: 2, title: "Fase 2: Organização", subtitle: "Dias 8 a 30 — implantar rotinas e padrões", color: "accent", tasks: phase2 },
    { phase: 3, title: "Fase 3: Validação", subtitle: "Dias 31 a 51 — testar, medir e confirmar", color: "primary", tasks: phase3 },
  ];
}

function getRiskLabel(score: number) {
  if (score >= 70) return { label: "CRÍTICO", color: "text-red-700 bg-red-50 border-red-200" };
  if (score >= 45) return { label: "ALTO", color: "text-orange-700 bg-orange-50 border-orange-200" };
  if (score >= 20) return { label: "MODERADO", color: "text-amber-700 bg-amber-50 border-amber-200" };
  return { label: "BAIXO", color: "text-green-700 bg-green-50 border-green-200" };
}

const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function PlanoDeAcaoJornada() {
  const { data, updateData, saveCompany, companyId, user, logout, resetData } = useAppStore();
  const [, navigate] = useLocation();
  const [screen, setScreen] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [diagnosis, setDiagnosis] = useState<{ score: number; items: RiskItem[] } | null>(null);
  const [plan, setPlan] = useState<PlanPhase[]>([]);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

  useEffect(() => {
    if (companyId && screen === 0) {
      const d = computeRisk(data);
      setDiagnosis(d);
      setPlan(generatePlan(data, d.items));
      setScreen(8);
    }
  }, []);

  const progressPct = screen >= 1 && screen <= INPUT_SCREENS ? ((screen - 1) / (INPUT_SCREENS - 1)) * 100 : screen > INPUT_SCREENS ? 100 : 0;

  const validate = (): boolean => {
    if (screen === 1 && !data.companyName.trim()) {
      setError("Por favor, informe o nome da empresa para continuar.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (screen === INPUT_SCREENS) {
      setSaving(true);
      try {
        const d = computeRisk(data);
        updateData("riskScore", d.score);
        await saveCompany();
        setDiagnosis(d);
        setPlan(generatePlan(data, d.items));
        setScreen(8);
      } catch (err) {
        console.error(err);
        const d = computeRisk(data);
        setDiagnosis(d);
        setPlan(generatePlan(data, d.items));
        setScreen(8);
      } finally {
        setSaving(false);
      }
    } else if (screen < 10) {
      setScreen(screen + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (screen > 0) {
      setScreen(screen - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNewPlan = () => {
    resetData();
    setScreen(1);
    setDiagnosis(null);
    setPlan([]);
    setCheckedTasks([]);
  };

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const sectorOptions = [
    { id: "industria", label: "Indústria", icon: Factory, desc: "Transformação, manufatura" },
    { id: "atacado", label: "Atacado / Distribuição", icon: Store, desc: "Revenda B2B em grande volume" },
    { id: "varejo", label: "Varejo", icon: ShoppingBag, desc: "Venda ao consumidor final" },
    { id: "servicos", label: "Serviços", icon: Landmark, desc: "Consultoria, saúde, educação, TI" },
    { id: "agronegocio", label: "Agronegócio", icon: Tractor, desc: "Produção rural, cooperativas" },
    { id: "outros", label: "Outros Setores", icon: Building, desc: "Construção, transporte, etc." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 max-w-screen-lg items-center justify-between px-4 md:px-6">
          <a href="/inicio" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading font-bold uppercase tracking-wider text-xs sm:text-sm">
              REFORMA<span className="text-primary">EM</span>AÇÃO
            </span>
          </a>
          <div className="flex items-center gap-3">
            {screen >= 1 && screen <= INPUT_SCREENS && (
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                Etapa {screen} de {INPUT_SCREENS}
              </span>
            )}
            {screen >= 8 && data.companyName && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                {data.companyName}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="gap-1 text-muted-foreground h-8 text-xs"
              data-testid="button-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {screen >= 1 && screen <= INPUT_SCREENS && (
        <div className="w-full bg-background border-b">
          <div className="container max-w-screen-lg mx-auto px-4 md:px-6 py-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {Array.from({ length: INPUT_SCREENS }, (_, i) => i + 1).map((s, idx) => (
                <div key={s} className="flex items-center shrink-0">
                  {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/30 mx-0.5" />}
                  <div
                    className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                      s === screen
                        ? "bg-primary text-primary-foreground"
                        : s < screen
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    <span className="hidden sm:inline">{SCREEN_LABELS[s]}</span>
                    <span className="sm:hidden">{s}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPct}%` }}
                data-testid="progress-bar"
              />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className={`container mx-auto py-8 px-4 md:px-6 ${screen >= 8 ? "max-w-screen-lg" : "max-w-screen-md"}`}>

          {screen === 0 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-4">
                <Badge className="mb-2">Diagnóstico + Plano de Ação</Badge>
                <h1 className="text-3xl md:text-4xl font-bold font-heading uppercase tracking-tight" data-testid="text-welcome-title">
                  Prepare Sua Empresa para a Reforma Tributária
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Uma entrevista guiada que coleta informações do seu negócio, gera um diagnóstico personalizado e entrega um plano de ação concreto.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Target, title: "Diagnóstico de Risco", desc: "Identificamos os pontos críticos do seu negócio com base nas novas regras." },
                  { icon: ShieldAlert, title: "Riscos Nomeados", desc: "Cada risco vem com descrição clara e ação corretiva específica." },
                  { icon: ClipboardList, title: "Plano de 51 Dias", desc: "Tarefas organizadas em 3 fases: o essencial, a organização e a validação." },
                  { icon: FileText, title: "Relatório em PDF", desc: "Gerado só ao final — com diagnóstico, prioridades e plano completo." },
                ].map((item) => (
                  <Card key={item.title} className="border shadow-sm">
                    <CardContent className="pt-5 pb-4 flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-primary">7 etapas · ~10 minutos</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Responda as perguntas sobre seu negócio. O plano de ação e o PDF são gerados automaticamente ao final — não antes.
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button size="lg" className="gap-2 w-full sm:w-auto sm:mx-auto" onClick={handleNext} data-testid="button-start-journey">
                  Iniciar Diagnóstico
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground mx-auto"
                  onClick={() => navigate("/plano-de-acao/meus-planos")}
                  data-testid="button-view-plans"
                >
                  Ver meus diagnósticos anteriores
                </Button>
              </div>
            </div>
          )}

          {screen >= 1 && screen <= INPUT_SCREENS && (
            <Card className="border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-5 border-b">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    {screen === 1 && <Building className="h-5 w-5 text-primary" />}
                    {screen === 2 && <Landmark className="h-5 w-5 text-primary" />}
                    {screen === 3 && <ShoppingBag className="h-5 w-5 text-primary" />}
                    {screen === 4 && <Truck className="h-5 w-5 text-primary" />}
                    {screen === 5 && <Monitor className="h-5 w-5 text-primary" />}
                    {screen === 6 && <DollarSign className="h-5 w-5 text-primary" />}
                    {screen === 7 && <Scale className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading" data-testid="text-screen-title">
                      {SCREEN_LABELS[screen]}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {screen === 1 && "Identifique sua empresa. Esses dados serão usados para personalizar todo o diagnóstico."}
                      {screen === 2 && "O enquadramento tributário define como sua empresa será afetada pela reforma e quais benefícios se aplicam."}
                      {screen === 3 && "Seu perfil de vendas define estratégias de preço, crédito tributário e impacto no fluxo de caixa."}
                      {screen === 4 && "O perfil de compras determina os créditos de imposto que você pode aproveitar no novo sistema."}
                      {screen === 5 && "A adequação dos sistemas fiscais é obrigatória. A NF-e exigirá novos campos a partir de 2026."}
                      {screen === 6 && "Sua saúde financeira e a compreensão do novo mecanismo de pagamento definem o nível de risco."}
                      {screen === 7 && "Contratos e governança determinam a capacidade de adaptação e os riscos jurídicos da transição."}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 md:p-8 min-h-[360px] space-y-6">

                {screen === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="companyName" className="font-bold">Razão Social / Nome da Empresa *</Label>
                        <input
                          id="companyName"
                          data-testid="input-company-name"
                          className={inputClass}
                          placeholder="Ex: Distribuidora Norte LTDA"
                          value={data.companyName === "Minha Empresa" ? "" : data.companyName}
                          onChange={(e) => { updateData("companyName", e.target.value); setError(""); }}
                        />
                        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cnpj" className="font-bold">CNPJ <span className="font-normal text-muted-foreground">(opcional)</span></Label>
                        <input
                          id="cnpj"
                          data-testid="input-cnpj"
                          className={inputClass}
                          placeholder="00.000.000/0000-00"
                          value={data.cnpj}
                          onChange={(e) => updateData("cnpj", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Setor de Atuação Principal</Label>
                      <RadioGroup
                        value={data.sector}
                        onValueChange={(val) => updateData("sector", val)}
                        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                      >
                        {sectorOptions.map((item) => (
                          <div key={item.id}>
                            <RadioGroupItem value={item.id} id={`sector-${item.id}`} className="peer sr-only" data-testid={`radio-sector-${item.id}`} />
                            <Label
                              htmlFor={`sector-${item.id}`}
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center h-full gap-2"
                            >
                              <item.icon className="h-7 w-7 text-muted-foreground" />
                              <span className="text-sm font-bold">{item.label}</span>
                              <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {screen === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">Como sua empresa paga impostos hoje?</Label>
                      <RadioGroup
                        value={data.regime}
                        onValueChange={(val) => updateData("regime", val)}
                        className="flex flex-col space-y-2"
                      >
                        {[
                          { id: "simples", label: "Simples Nacional", desc: "Recolhimento unificado em guia DAS" },
                          { id: "lucro_presumido", label: "Lucro Presumido", desc: "PIS/COFINS cumulativos, IRPJ/CSLL por presunção" },
                          { id: "lucro_real", label: "Lucro Real", desc: "PIS/COFINS não-cumulativos, apuração pelo resultado real" },
                        ].map((r) => (
                          <div key={r.id} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer">
                            <RadioGroupItem value={r.id} id={`regime-${r.id}`} data-testid={`radio-regime-${r.id}`} />
                            <div className="flex-1">
                              <Label htmlFor={`regime-${r.id}`} className="font-bold cursor-pointer block">{r.label}</Label>
                              <span className="text-xs text-muted-foreground">{r.desc}</span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                      {data.regime === "simples" && (
                        <Alert className="bg-blue-50 border-blue-200">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-xs text-blue-700">
                            A reforma permite optar por recolher IBS/CBS fora do DAS para gerar crédito integral para clientes empresariais — uma vantagem competitiva importante se você vende para empresas.
                          </AlertDescription>
                        </Alert>
                      )}
                      {data.regime === "lucro_presumido" && (
                        <Alert className="bg-amber-50 border-amber-200">
                          <Info className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-xs text-amber-700">
                            O Lucro Presumido será extinto gradualmente e substituído pelo novo regime não-cumulativo pleno. Controles fiscais mais rigorosos serão necessários.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Sua empresa tem benefício ou regime especial?</Label>
                      <p className="text-xs text-muted-foreground">Marque os que se aplicam. Se nenhum se aplica, avance normalmente.</p>
                      {data.specialRegimes.length > 0 && (
                        <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold text-primary">{data.specialRegimes.length} regime(s) selecionado(s)</span>
                        </div>
                      )}
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {SPECIAL_REGIMES.map((opt) => {
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
                                  const next = checked
                                    ? data.specialRegimes.filter((r) => r !== opt.id)
                                    : [...data.specialRegimes, opt.id];
                                  updateData("specialRegimes", next);
                                }}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-bold block">{opt.label}</span>
                                <span className="text-xs text-muted-foreground block">{opt.desc}</span>
                                <span className={`text-[10px] font-medium block mt-0.5 ${opt.color === "red" ? "text-red-600" : "text-green-700"}`}>{opt.note}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {screen === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">Para quem a empresa vende principalmente?</Label>
                      <RadioGroup
                        value={data.operations}
                        onValueChange={(val) => updateData("operations", val)}
                        className="flex flex-col space-y-3"
                      >
                        {[
                          { id: "b2b", label: "Para outras empresas (B2B)", desc: "Clientes corporativos que podem aproveitar créditos de imposto." },
                          { id: "b2c", label: "Para o consumidor final (B2C)", desc: "Pessoas físicas que compram para uso próprio, sem aproveitamento de crédito." },
                          { id: "b2b_b2c", label: "Para ambos (B2B + B2C)", desc: "Vende tanto para empresas quanto para consumidores finais." },
                        ].map((op) => (
                          <div key={op.id} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value={op.id} id={op.id} data-testid={`radio-${op.id}`} />
                            <div className="flex-1">
                              <Label htmlFor={op.id} className="font-bold cursor-pointer block">{op.label}</Label>
                              <span className="text-xs text-muted-foreground">{op.desc}</span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Em quais estados a empresa vende ou presta serviços?</Label>
                      <RadioGroup
                        value={
                          data.salesStates.includes("national") ? "national"
                          : data.salesStates.includes("many_states") ? "many_states"
                          : data.salesStates.includes("few_states") ? "few_states"
                          : "local"
                        }
                        onValueChange={(val) => {
                          if (val === "local") updateData("salesStates", []);
                          else updateData("salesStates", [val]);
                        }}
                        className="flex flex-col space-y-2"
                      >
                        {[
                          { id: "local", label: "Apenas no meu estado", desc: "Operação concentrada em um único estado." },
                          { id: "few_states", label: "Em 2 a 5 estados", desc: "Operação regional, algumas UFs." },
                          { id: "many_states", label: "Em mais de 5 estados", desc: "Operação nacional ampla com múltiplas alíquotas por destino." },
                          { id: "national", label: "Em todo o Brasil (e-commerce nacional)", desc: "Venda online para qualquer estado — alíquota do estado do comprador em cada pedido." },
                        ].map((geo) => (
                          <div key={geo.id} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer">
                            <RadioGroupItem value={geo.id} id={`geo-${geo.id}`} data-testid={`radio-geo-${geo.id}`} />
                            <div className="flex-1">
                              <Label htmlFor={`geo-${geo.id}`} className="font-bold cursor-pointer block">{geo.label}</Label>
                              <span className="text-xs text-muted-foreground">{geo.desc}</span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {screen === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">Qual é o maior custo operacional da empresa?</Label>
                      <p className="text-xs text-muted-foreground">Isso determina quanto crédito de imposto você poderá aproveitar no novo sistema.</p>
                      <RadioGroup
                        value={data.costStructure}
                        onValueChange={(val) => updateData("costStructure", val)}
                        className="flex flex-col space-y-2"
                      >
                        {[
                          { id: "mercadorias", label: "Estoque e mercadorias para revenda", desc: "Gera crédito integral de IBS/CBS — cenário favorável." },
                          { id: "folha", label: "Folha de pagamento e encargos", desc: "NÃO gera crédito de IBS/CBS — principal risco para empresas de serviço e varejo." },
                          { id: "logistica", label: "Logística e frete", desc: "Gera crédito integral pelo CT-e do transportador." },
                          { id: "tecnologia", label: "Tecnologia, software e licenças", desc: "Gera crédito integral se o fornecedor for pessoa jurídica." },
                          { id: "aluguel", label: "Aluguel e ocupação", desc: "Gera crédito se o locador for pessoa jurídica. Aluguel de PF não gera crédito." },
                        ].map((c) => (
                          <div key={c.id} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer">
                            <RadioGroupItem value={c.id} id={`cost-${c.id}`} data-testid={`radio-cost-${c.id}`} />
                            <div className="flex-1">
                              <Label htmlFor={`cost-${c.id}`} className="font-bold cursor-pointer block">{c.label}</Label>
                              <span className={`text-xs ${c.id === "folha" ? "text-red-600 font-medium" : "text-muted-foreground"}`}>{c.desc}</span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Quantos fornecedores ativos?</Label>
                        <Select value={data.supplierCount} onValueChange={(val) => updateData("supplierCount", val)} data-testid="select-supplier-count">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate_10">Até 10 fornecedores</SelectItem>
                            <SelectItem value="ate_20">10 a 20 fornecedores</SelectItem>
                            <SelectItem value="ate_50">20 a 50 fornecedores</SelectItem>
                            <SelectItem value="acima_50">Acima de 50 fornecedores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">% do Simples Nacional entre seus fornecedores?</Label>
                        <Select
                          value={data.simplesSupplierPercent}
                          onValueChange={(val) => {
                            updateData("simplesSupplierPercent", val);
                            const pp = val === "acima_60" ? "simples_suppliers" : val === "ate_30" ? "general_suppliers" : "mixed_suppliers";
                            updateData("purchaseProfile", pp);
                          }}
                          data-testid="select-simples-percent"
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate_30">Menos de 30% são do Simples</SelectItem>
                            <SelectItem value="30_60">30% a 60% são do Simples</SelectItem>
                            <SelectItem value="acima_60">Mais de 60% são do Simples</SelectItem>
                            <SelectItem value="nao_sei">Não sei informar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {(data.simplesSupplierPercent === "acima_60" || data.simplesSupplierPercent === "30_60") && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-700">
                          <strong>Impacto nos créditos:</strong> Fornecedores do Simples geram crédito equivalente à alíquota efetiva que eles recolhem (4% a 8%), não os 26,5% cheios do novo sistema. Isso eleva seu custo real.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {screen === 5 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">Qual sistema de gestão (ERP) a empresa usa?</Label>
                      <Select value={data.erpSystem} onValueChange={(val) => updateData("erpSystem", val)} data-testid="select-erp">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sap">SAP / TOTVS / Oracle (grande porte)</SelectItem>
                          <SelectItem value="medio_porte">Bling / Omie / Tiny / Conta Azul (médio porte)</SelectItem>
                          <SelectItem value="proprio">Sistema próprio desenvolvido internamente</SelectItem>
                          <SelectItem value="planilha">Planilhas / controle manual</SelectItem>
                          <SelectItem value="nenhum">Não usa sistema de gestão</SelectItem>
                        </SelectContent>
                      </Select>
                      {(data.erpSystem === "nenhum" || data.erpSystem === "planilha") && (
                        <Alert className="bg-red-50 border-red-200">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-xs text-red-700">
                            <strong>Risco crítico:</strong> O controle manual não suportará os novos campos obrigatórios de IBS/CBS na NF-e. A adoção de um sistema integrado é urgente.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Como são emitidas as notas fiscais?</Label>
                      <RadioGroup
                        value={data.nfeEmission}
                        onValueChange={(val) => updateData("nfeEmission", val)}
                        className="flex flex-col space-y-2"
                      >
                        {[
                          { id: "sistema_integrado", label: "O sistema emite automaticamente", desc: "ERP calcula os impostos e transmite direto para a SEFAZ." },
                          { id: "emissor_gratuito", label: "Emissor gratuito ou portal da SEFAZ", desc: "Preenchimento manual ou semi-automatizado." },
                          { id: "contador", label: "O contador faz tudo", desc: "Terceirização completa da emissão fiscal." },
                        ].map((nfe) => (
                          <div key={nfe.id} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer">
                            <RadioGroupItem value={nfe.id} id={`nfe-${nfe.id}`} data-testid={`radio-nfe-${nfe.id}`} />
                            <div className="flex-1">
                              <Label htmlFor={`nfe-${nfe.id}`} className="font-bold cursor-pointer block">{nfe.label}</Label>
                              <span className="text-xs text-muted-foreground">{nfe.desc}</span>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Volume mensal de notas fiscais emitidas</Label>
                      <Select value={data.invoiceVolume} onValueChange={(val) => updateData("invoiceVolume", val)} data-testid="select-invoice-volume">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ate_50">Até 50 notas por mês</SelectItem>
                          <SelectItem value="ate_100">50 a 100 notas por mês</SelectItem>
                          <SelectItem value="ate_500">100 a 500 notas por mês</SelectItem>
                          <SelectItem value="acima_500">Acima de 500 notas por mês</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {screen === 6 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Faturamento mensal aproximado</Label>
                        <Select value={data.monthlyRevenue} onValueChange={(val) => updateData("monthlyRevenue", val)} data-testid="select-revenue">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate_50k">Até R$ 50 mil / mês</SelectItem>
                            <SelectItem value="50k_100k">R$ 50 mil a R$ 100 mil / mês</SelectItem>
                            <SelectItem value="100k_500k">R$ 100 mil a R$ 500 mil / mês</SelectItem>
                            <SelectItem value="500k_1m">R$ 500 mil a R$ 1 milhão / mês</SelectItem>
                            <SelectItem value="acima_1m">Acima de R$ 1 milhão / mês</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Margem de lucro líquida estimada</Label>
                        <Select value={data.profitMargin} onValueChange={(val) => updateData("profitMargin", val)} data-testid="select-margin">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate_5">Até 5% (margem muito apertada)</SelectItem>
                            <SelectItem value="5_10">5% a 10%</SelectItem>
                            <SelectItem value="10_20">10% a 20%</SelectItem>
                            <SelectItem value="acima_20">Acima de 20%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {(data.profitMargin === "ate_5" || data.profitMargin === "5_10") && (
                      <Alert className="bg-red-50 border-red-200">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-xs text-red-700">
                          <strong>Margem crítica:</strong> Com menos de 10% de lucro, qualquer variação tributária pode comprometer a viabilidade. A recalibração de preços será prioridade máxima no seu plano.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-3">
                      <Label className="font-bold">Sua empresa já entende como o Split Payment vai funcionar?</Label>
                      <p className="text-xs text-muted-foreground">O Split Payment é o novo mecanismo que retém o imposto no momento do pagamento — antes de o dinheiro chegar à sua conta.</p>
                      <RadioGroup
                        value={data.splitPaymentAware}
                        onValueChange={(val) => updateData("splitPaymentAware", val)}
                        className="flex flex-col space-y-2"
                      >
                        {[
                          { id: "sim_entendo", label: "Sim, entendemos como vai funcionar e estamos nos preparando." },
                          { id: "ouvi_falar", label: "Já ouvi falar, mas ainda não entendo bem o impacto." },
                          { id: "nao", label: "Não conhecemos este mecanismo ainda." },
                        ].map((sp) => (
                          <div key={sp.id} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer">
                            <RadioGroupItem value={sp.id} id={`sp-${sp.id}`} data-testid={`radio-split-${sp.id}`} />
                            <Label htmlFor={`sp-${sp.id}`} className="cursor-pointer text-sm">{sp.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Qual é a maior preocupação com a reforma?</Label>
                      <Select value={data.mainConcern} onValueChange={(val) => updateData("mainConcern", val)} data-testid="select-concern">
                        <SelectTrigger><SelectValue placeholder="Selecione a principal preocupação" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custos">Aumento dos custos e da carga tributária</SelectItem>
                          <SelectItem value="preco">Impacto nos preços e na competitividade</SelectItem>
                          <SelectItem value="sistemas">Adequação dos sistemas e notas fiscais</SelectItem>
                          <SelectItem value="caixa">Impacto no fluxo de caixa (Split Payment)</SelectItem>
                          <SelectItem value="fornecedores">Adequação dos fornecedores</SelectItem>
                          <SelectItem value="contratos">Revisão de contratos</SelectItem>
                          <SelectItem value="desconhecimento">Desconhecimento geral — não sei por onde começar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {screen === 7 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">A empresa tem contratos de longo prazo (acima de 12 meses) com clientes ou fornecedores?</Label>
                      <RadioGroup
                        value={data.hasLongTermContracts}
                        onValueChange={(val) => updateData("hasLongTermContracts", val)}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer">
                          <RadioGroupItem value="sim" id="contract-yes" data-testid="radio-contracts-yes" />
                          <Label htmlFor="contract-yes" className="font-bold cursor-pointer">Sim, temos contratos acima de 12 meses</Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer">
                          <RadioGroupItem value="nao" id="contract-no" data-testid="radio-contracts-no" />
                          <Label htmlFor="contract-no" className="font-bold cursor-pointer">Não, trabalhamos com pedidos avulsos ou contratos curtos</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {data.hasLongTermContracts === "sim" && (
                      <div className="space-y-3">
                        <Label className="font-bold">Esses contratos têm cláusula de revisão por mudança tributária?</Label>
                        <p className="text-xs text-muted-foreground">A LC 214/2025, art. 378, permite revisão de contratos por desequilíbrio causado pela reforma.</p>
                        <RadioGroup
                          value={data.priceRevisionClause}
                          onValueChange={(val) => updateData("priceRevisionClause", val)}
                          className="flex flex-col space-y-2"
                        >
                          {[
                            { id: "sim", label: "Sim, os contratos já têm essa cláusula." },
                            { id: "nao", label: "Não, os contratos não preveem revisão tributária." },
                            { id: "nao_sei", label: "Não sei / Não analisamos isso ainda." },
                          ].map((cl) => (
                            <div key={cl.id} className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer">
                              <RadioGroupItem value={cl.id} id={`clause-${cl.id}`} data-testid={`radio-clause-${cl.id}`} />
                              <Label htmlFor={`clause-${cl.id}`} className="cursor-pointer text-sm">{cl.label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {data.priceRevisionClause === "nao" && (
                          <Alert className="bg-red-50 border-red-200">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-xs text-red-700">
                              <strong>Risco crítico:</strong> Contratos sem cláusula de revisão podem obrigar a empresa a absorver toda a nova carga tributária. Revisão urgente recomendada.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    <div className="space-y-3">
                      <Label className="font-bold">Quem cuida da parte fiscal e tributária da empresa?</Label>
                      <Select value={data.taxResponsible} onValueChange={(val) => updateData("taxResponsible", val)} data-testid="select-tax-responsible">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contador_externo">Escritório de contabilidade externo</SelectItem>
                          <SelectItem value="contador_interno">Contador ou analista fiscal interno</SelectItem>
                          <SelectItem value="dono">O próprio dono ou sócio</SelectItem>
                          <SelectItem value="ninguem">Ninguém cuida especificamente disso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Número de colaboradores da empresa</Label>
                      <Select value={data.employeeCount} onValueChange={(val) => updateData("employeeCount", val)} data-testid="select-employees">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1_10">1 a 10 pessoas</SelectItem>
                          <SelectItem value="11_50">11 a 50 pessoas</SelectItem>
                          <SelectItem value="51_200">51 a 200 pessoas</SelectItem>
                          <SelectItem value="acima_200">Acima de 200 pessoas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>

              <div className="px-6 md:px-8 py-5 border-t flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={saving}
                  className="gap-2"
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {screen === 1 ? "Apresentação" : "Voltar"}
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={saving}
                  className="gap-2"
                  data-testid="button-next"
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analisando...</>
                  ) : screen === INPUT_SCREENS ? (
                    <><BarChart3 className="h-4 w-4" /> Gerar Diagnóstico</>
                  ) : (
                    <>Continuar <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {screen === 8 && diagnosis && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-2">Diagnóstico Concluído</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight" data-testid="text-diagnosis-title">
                    {data.companyName}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">Análise baseada em EC 132/2023, LC 214/2025 e LC 227/2026</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleNewPlan} className="gap-1 shrink-0" data-testid="button-new-diagnosis">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Novo diagnóstico</span>
                </Button>
              </div>

              <Card className={`border-2 ${getRiskLabel(diagnosis.score).color}`}>
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nível de Risco Operacional</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-bold" data-testid="text-risk-score">{diagnosis.score}</span>
                        <span className="text-muted-foreground text-sm">/100</span>
                        <Badge className={`ml-2 text-sm px-3 py-0.5 ${getRiskLabel(diagnosis.score).color}`} data-testid="text-risk-label">
                          {getRiskLabel(diagnosis.score).label}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground mb-1">Pontos de risco identificados</p>
                      <p className="text-2xl font-bold">{diagnosis.items.length}</p>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-white/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${diagnosis.score >= 70 ? "bg-red-600" : diagnosis.score >= 45 ? "bg-orange-500" : diagnosis.score >= 20 ? "bg-amber-500" : "bg-green-600"}`}
                      style={{ width: `${diagnosis.score}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Pontos de Atenção Identificados</h2>
                <div className="space-y-4">
                  {diagnosis.items.length === 0 ? (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-5 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        <div>
                          <p className="font-bold text-green-800">Perfil de risco controlado</p>
                          <p className="text-sm text-green-700 mt-1">Não identificamos riscos críticos ou altos com base nas informações fornecidas. Continue acompanhando as atualizações normativas e implante as rotinas de conferência.</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    diagnosis.items.map((item, idx) => (
                      <Card key={idx} className={`border-l-4 ${item.level === "critico" ? "border-l-red-500" : item.level === "alto" ? "border-l-orange-500" : "border-l-amber-400"}`} data-testid={`card-risk-${idx}`}>
                        <CardContent className="pt-5 pb-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-lg shrink-0 ${item.level === "critico" ? "bg-red-100" : item.level === "alto" ? "bg-orange-100" : "bg-amber-100"}`}>
                              <AlertTriangle className={`h-4 w-4 ${item.level === "critico" ? "text-red-600" : item.level === "alto" ? "text-orange-600" : "text-amber-600"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-bold text-sm">{item.title}</span>
                                <Badge variant="outline" className={`text-[10px] ${item.level === "critico" ? "border-red-300 text-red-700" : item.level === "alto" ? "border-orange-300 text-orange-700" : "border-amber-300 text-amber-700"}`}>
                                  {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                              <div className="mt-2 p-2 bg-primary/5 rounded text-xs font-medium text-primary border border-primary/10">
                                → {item.action}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Refazer perguntas
                </Button>
                <Button onClick={handleNext} className="gap-2" data-testid="button-to-plan">
                  Ver Plano de Ação
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {screen === 9 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <Badge className="mb-2">Plano de Ação Personalizado</Badge>
                <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight">
                  Roteiro de 51 Dias
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">Tarefas organizadas por prioridade com base no seu diagnóstico. Marque as concluídas conforme avançar.</p>
              </div>

              {diagnosis && diagnosis.items.filter((r) => r.level === "critico").length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm text-red-800">
                    <strong>Atenção prioritária:</strong> Seu diagnóstico identificou {diagnosis.items.filter((r) => r.level === "critico").length} risco(s) crítico(s). As tarefas marcadas com ⚡ na Fase 1 devem ser iniciadas nos próximos 3 dias.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-8">
                {plan.map((phase) => (
                  <div key={phase.phase}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm text-white ${phase.color === "destructive" ? "bg-red-600" : phase.color === "accent" ? "bg-amber-500" : "bg-primary"}`}>
                        {phase.phase}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold font-heading">{phase.title}</h2>
                        <p className="text-xs text-muted-foreground">{phase.subtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-3 ml-11">
                      {phase.tasks.map((task) => (
                        <Card
                          key={task.id}
                          className={`cursor-pointer transition-all ${checkedTasks.includes(task.id) ? "opacity-60 bg-muted/30" : ""} ${task.priority ? "border-l-4 border-l-primary" : ""}`}
                          onClick={() => toggleTask(task.id)}
                          data-testid={`card-task-${task.id}`}
                        >
                          <CardContent className="pt-4 pb-3">
                            <div className="flex items-start gap-3">
                              <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${checkedTasks.includes(task.id) ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                                {checkedTasks.includes(task.id) && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-bold text-sm ${checkedTasks.includes(task.id) ? "line-through text-muted-foreground" : ""}`}>
                                    {task.priority && "⚡ "}{task.title}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{task.desc}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Diagnóstico
                </Button>
                <Button onClick={handleNext} className="gap-2" data-testid="button-to-report">
                  Gerar Relatório Final
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {screen === 10 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mx-auto mb-3">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
                <Badge className="bg-green-600 hover:bg-green-600">Jornada Concluída</Badge>
                <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight" data-testid="text-report-title">
                  Relatório Final Disponível
                </h1>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  Seu diagnóstico e plano de ação foram consolidados. Baixe o relatório em PDF para compartilhar com seu contador, equipe ou consultores.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="sm:col-span-2">
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Empresa Analisada</p>
                    <p className="text-xl font-bold">{data.companyName}</p>
                    {data.cnpj && <p className="text-sm text-muted-foreground font-mono">CNPJ: {data.cnpj}</p>}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { label: data.sector === "industria" ? "Indústria" : data.sector === "atacado" ? "Atacado" : data.sector === "varejo" ? "Varejo" : data.sector === "servicos" ? "Serviços" : data.sector === "agronegocio" ? "Agronegócio" : "Outros" },
                        { label: data.regime === "simples" ? "Simples Nacional" : data.regime === "lucro_presumido" ? "Lucro Presumido" : "Lucro Real" },
                        { label: data.operations === "b2b" ? "B2B" : data.operations === "b2c" ? "B2C" : "B2B + B2C" },
                      ].map((tag) => (
                        <Badge key={tag.label} variant="secondary" className="text-xs">{tag.label}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {diagnosis && (
                  <Card className={`border-2 ${getRiskLabel(diagnosis.score).color}`}>
                    <CardContent className="pt-5 pb-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Risco</p>
                      <p className="text-4xl font-bold" data-testid="text-report-score">{diagnosis.score}<span className="text-lg font-normal">/100</span></p>
                      <Badge className={`mt-2 ${getRiskLabel(diagnosis.score).color}`}>{getRiskLabel(diagnosis.score).label}</Badge>
                    </CardContent>
                  </Card>
                )}
              </div>

              {diagnosis && diagnosis.items.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold font-heading mb-3">Principais Riscos Identificados</h2>
                  <div className="space-y-2">
                    {diagnosis.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-lg border">
                        <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${item.level === "critico" ? "text-red-600" : item.level === "alto" ? "text-orange-500" : "text-amber-500"}`} />
                        <div>
                          <span className="text-sm font-bold">{item.title}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6 pb-5 space-y-4">
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-1">Baixar Relatório Completo em PDF</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      O PDF inclui: perfil completo, diagnóstico de risco, impacto por setor, estratégia de fornecedores, precificação, rotinas e cronograma de 51 dias.
                    </p>
                    <Button
                      size="lg"
                      className="gap-2 px-8"
                      onClick={() => generateActionPlanPdf(data)}
                      data-testid="button-download-pdf"
                    >
                      <Download className="h-5 w-5" />
                      Baixar Relatório em PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-5 pb-4">
                  <p className="text-xs text-amber-800">
                    <strong>Aviso legal:</strong> Este relatório fornece orientação prática de preparação operacional com base em normas públicas (EC 132/2023, LC 214/2025, LC 227/2026). As informações <strong>não substituem</strong> consultoria tributária, análise jurídica por advogado tributarista, testes de integração com fornecedores de sistema, nem consulta específica sobre seu regime tributário e setor. Use este relatório como base para conversa com seus assessores.
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 justify-between pt-2 border-t">
                <Button variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Plano de Ação
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleNewPlan} className="gap-2" data-testid="button-new-plan">
                    <RefreshCw className="h-4 w-4" />
                    Novo Diagnóstico
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/inicio")} className="gap-2" data-testid="button-go-home">
                    <Home className="h-4 w-4" />
                    Voltar ao Hub
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-4 mt-8">
        <div className="container max-w-screen-lg mx-auto px-4 md:px-6">
          <p className="text-center text-xs text-muted-foreground">
            REFORMA EM AÇÃO · Orientação operacional baseada em EC 132/2023, LC 214/2025 e LC 227/2026 · Não substitui consultoria tributária especializada
          </p>
        </div>
      </footer>
    </div>
  );
}
