import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  LayoutGrid, 
  Zap, 
  CheckCircle2, 
  BarChart3, 
  Info,
  ChevronRight,
  Landmark,
  Trash2,
  FileCheck,
  ShieldAlert,
  Clock,
  User,
  BookOpen,
  Users,
  AlertTriangle,
  AlertCircle,
  Download,
  Home,
  Loader2,
  Package,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import MaskedInput from "@/components/core/MaskedInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { generateActionPlanPdf } from "@/lib/generatePdf";
import { 
  READINESS_CONFIG,
  PRIORITY_CONFIG,
  getReadinessLevel,
  getRiskLabelConfig as getRiskLabel,
  generateConclusionText,
} from "@/lib/riskConfig";
import { PLAN_EXPLANATIONS } from "@/lib/planExplanations";
import { CATEGORY_CONFIG, type ReformaArticle } from "@/lib/reformaContent";
import { type Company } from "@shared/schema";
import MainLayout from "@/components/layout/MainLayout";

// ===== TYPES & CONSTANTS =====
type CompanySummary = Omit<Company, "userId">;

type AppData = {
  id?: number;
  companyName: string;
  cnpj?: string;
  sector?: string;
  regime?: string;
  annualRevenue?: string;
  geographicScope: string;
  operations?: string;
  employeeCount?: string;
  erpSystem?: string;
  erpVendorReformPlan?: string;
  nfeEmission?: string;
  catalogStandardized?: string;
  hasRegularNF?: string;
  hasNFErrors?: string;
  splitPaymentAware?: string;
  tightWorkingCapital?: string;
  knowsMarginByProduct?: string;
  hasLongTermContracts?: string;
  priceRevisionClause?: string;
  managementAwareOfReform?: string;
  hadInternalTraining?: string;
  preparationStarted?: string;
  taxResponsible?: string;
  simplesSupplierPercent?: string;
  hasExports: string;
  hasGovernmentContracts: string;
  salesStates: string[];
  reformKnowledge: string;
  mainUrgency: string;
  contactName: string;
  contactPhone: string;
  estado: string;
  municipio: string;
  specialRegimes: string[];
  profitMargin: string;
};

type AxisScore = {
  id: string;
  name: string;
  icon: any;
  score: number;
  items: any[];
};

type DiagnosisResult = {
  overallScore: number;
  axes: AxisScore[];
  allItems: any[];
  topOpportunity: string;
};

type PlanAction = {
  id: string;
  phase: number;
  priority: "urgente" | "alta" | "media" | "baixa";
  eixo: string;
  title: string;
  desc: string;
  motivo?: string;
  prazo?: string;
  responsavel?: string;
  source?: string;
  confianca: "verde" | "amarelo" | "vermelho";
};

const INPUT_SCREENS = 7;
const ESTADOS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const SCREEN_LABELS: Record<number, string> = {
  1: "Identificação do Negócio",
  2: "Perfil e Enquadramento",
  3: "Cadeia de Suprimentos",
  4: "Infraestrutura de Gestão",
  5: "Financeiro e Fluxo",
  6: "Conformidade e Contratos",
  7: "Estratégia e Pós-Reforma",
};

const screenSubtitle: Record<number, string> = {
  1: "Dados básicos para personalização do diagnóstico e relatórios executivos.",
  2: "O setor e regime tributário definem as alíquotas de transição do IBS e CBS.",
  3: "A não-cumulatividade plena depende da formalidade dos seus fornecedores.",
  4: "Como seus sistemas atuais lidarão com o Split Payment e novos layouts?",
  5: "Impacto no capital de giro e revisão de margem líquida por produto.",
  6: "Proteção jurídica em contratos de longo prazo e treinamento interno.",
  7: "Prioridades imediatas e nível de conhecimento sobre a nova legislação.",
};

// ===== HELPER FUNCTIONS =====

function computeReadiness(data: AppData): DiagnosisResult {
  const isB2B = data.operations === "b2b" || data.operations === "b2b_b2c";
  const neverPrepared = data.preparationStarted === "nao";
  const isMultiState = data.geographicScope === "nacional" || data.salesStates.length > 0;
  const hasNoERP = data.erpSystem === "nenhum" || data.erpSystem === "planilha";

  const axis1Items: any[] = [];
  let a1 = 0;
  axis1Items.push({ level: "moderado", title: "Transição obrigatória: novos códigos e campos nos documentos fiscais", desc: "A partir de 2026, todas as empresas precisam emitir documentos fiscais com os campos de IBS e CBS preenchidos corretamente.", action: "Confirmar com o fornecedor do sistema qual a versão compatível com os novos layouts.", axis: "fiscal" }); a1 += 10;
  if (hasNoERP) {
    axis1Items.push({ level: "critico", title: "Sistema fiscal inadequado para a transição", desc: "A adaptação ao novo modelo exige revisão do ERP. Processos manuais elevam bastante o risco.", action: "Avaliar e contratar ERP imediatamente.", axis: "fiscal" }); a1 += 30;
  }
  if (data.nfeEmission === "emissor_gratuito" || data.nfeEmission === "contador") {
    axis1Items.push({ level: "moderado", title: "Emissão fiscal não integrada ao processo operacional", desc: "Emissão manual cria gargalo e risco de erro nos campos IBS/CBS.", action: "Avaliar integração da emissão de NF-e.", axis: "fiscal" }); a1 += 10;
  }
  if (data.catalogStandardized === "nao") {
    axis1Items.push({ level: "alto", title: "Cadastro de produtos sem padrão", desc: "Um cadastro desorganizado impede a correta classificação de NCM/NBS.", action: "Padronizar o cadastro dos 30 principais produtos.", axis: "fiscal" }); a1 += 20;
  }
  if (isMultiState) {
    axis1Items.push({ level: "alto", title: "Operação multi-estado: parametrização por destino", desc: "O IBS depende do destino da operação. Isso exige parametrização correta no sistema.", action: "Confirmar se o ERP suporta esse cálculo.", axis: "fiscal" }); a1 += 15;
  }
  const hasSeletivo = data.specialRegimes.some((r: any) => r.startsWith("seletivo_"));
  if (hasSeletivo) {
    axis1Items.push({ level: "alto", title: "Imposto Seletivo incide sobre seus produtos", desc: "Produtos sujeitos ao IS têm carga adicional.", action: "Calcular o IS na tabela de preços.", axis: "fiscal" }); a1 += 15;
  }

  const axis2Items: any[] = [];
  let a2 = 0;
  if (data.simplesSupplierPercent === "acima_60") {
    axis2Items.push({ level: "alto", title: "Fornecedores Simples: impacto no crédito indefinido", desc: "Mais de 60% dos seus fornecedores são do Simples Nacional.", action: "Entrar em contato com os principais fornecedores.", axis: "compras" }); a2 += 22;
  }
  if (data.hasNFErrors === "frequente") {
    axis2Items.push({ level: "alto", title: "Notas fiscais recebidas com erros frequentes", desc: "Cada NF com erro é crédito de IBS/CBS comprometido.", action: "Implantar programa de qualidade de NF.", axis: "compras" }); a2 += 18;
  }
  if (data.hasRegularNF === "nao") {
    axis2Items.push({ level: "critico", title: "Compras sem documentação fiscal adequada", desc: "Aquisições sem nota fiscal impedem o aproveitamento de créditos.", action: "Formalizar o relacionamento com fornecedores.", axis: "compras" }); a2 += 25;
  }

  const axis3Items: any[] = [];
  let a3 = 0;
  if (data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao") {
    axis3Items.push({ level: "critico", title: "Contratos longos sem proteção tributária", desc: "Contratos sem cláusula de revisão podem obrigar a empresa a absorver a carga.", action: "Revisar contratos com urgência.", axis: "comercial" }); a3 += 25;
  }
  if (data.knowsMarginByProduct === "nao") {
    axis3Items.push({ level: "moderado", title: "Sem visibilidade de margem por produto", desc: "Sem saber a margem, a política comercial será baseada em intuição.", action: "Montar DRE por produto.", axis: "comercial" }); a3 += 8;
  }

  const axis4Items: any[] = [];
  let a4 = 0;
  if (data.splitPaymentAware === "nao") {
    axis4Items.push({ level: "alto", title: "Split Payment desconhecido — risco de caixa", desc: "O imposto é retido antes do valor chegar à empresa.", action: "Estudar o mecanismo e projetar o impacto.", axis: "financeiro" }); a4 += 18;
  }
  if (data.profitMargin === "ate_5" || data.profitMargin === "5_10") {
    axis4Items.push({ level: "alto", title: "Margem de lucro vulnerável à reforma", desc: "Carga tributária pode comprometer a viabilidade.", action: "Recalcular estrutura de preços.", axis: "financeiro" }); a4 += 22;
  }

  const axis5Items: any[] = [];
  let a5 = 0;
  if (data.taxResponsible === "ninguem") {
    axis5Items.push({ level: "critico", title: "Nenhum responsável pelo tema fiscal/tributário", desc: "Sem um ponto focal, os riscos se acumulam.", action: "Definir imediatamente quem responde pelo tema.", axis: "governanca" }); a5 += 25;
  }
  if (neverPrepared) {
    axis5Items.push({ level: "critico", title: "Zero preparação e zero treinamento", desc: "Maior grau de exposição operacional.", action: "Iniciar imediatamente o plano de adaptação.", axis: "governanca" }); a5 += 25;
  }

  const axes: AxisScore[] = [
    { id: "fiscal", name: "Fiscal / Documental", icon: FileText, score: Math.min(a1, 100), items: axis1Items },
    { id: "compras", name: "Compras / Créditos", icon: Package, score: Math.min(a2, 100), items: axis2Items },
    { id: "comercial", name: "Comercial / Contratos", icon: Target, score: Math.min(a3, 100), items: axis3Items },
    { id: "financeiro", name: "Financeiro / Caixa", icon: TrendingUp, score: Math.min(a4, 100), items: axis4Items },
    { id: "governanca", name: "Governança / Sistemas", icon: LayoutGrid, score: Math.min(a5, 100), items: axis5Items },
  ];

  const weights = [0.25, 0.20, 0.20, 0.20, 0.15];
  const rawScore = Math.min(Math.round(axes.reduce((s, ax, i) => s + ax.score * weights[i], 0)), 100);
  const overallScore = Math.max(0, Math.min(100, 100 - rawScore));
  const allItems = axes.flatMap((ax) => ax.items).sort((a, b) => {
    const o: Record<string, number> = { critico: 0, alto: 1, moderado: 2 };
    return o[a.level] - o[b.level];
  });

  let topOpportunity = "Monitore a regulamentação e mantenha o cadastro fiscal atualizado — empresas organizadas saem na frente.";
  if (data.specialRegimes.some((r) => ["cesta_basica", "educacao", "saude_servicos", "saude_medicamentos"].includes(r))) {
    topOpportunity = "Sua empresa tem direito a reduções de 60% ou alíquota zero no IBS/CBS. Formalize o enquadramento com o contador e inclua o benefício na tabela de preços para usar como argumento comercial.";
  } else if (data.regime === "simples" && isB2B) {
    topOpportunity = "Empresas do Simples que vendem B2B podem avaliar a opção por apurar o IBS/CBS no regime regular, o que pode ampliar a transferência de crédito ao adquirente. Esta decisão deve ser analisada caso a caso com o contador, comparando o custo adicional e o benefício comercial.";
  } else if (data.sector === "industria") {
    topOpportunity = "A indústria tende a se beneficiar da não-cumulatividade plena: créditos amplos em insumos, logística e bens de capital podem reduzir a carga efetiva. Confirme com o contador quais insumos do seu processo produtivo geram crédito de IBS/CBS.";
  } else if (data.hasExports === "sim") {
    topOpportunity = "Exportações têm imunidade total do IBS/CBS e os créditos acumulados são ressarcíveis pelo governo — isso pode melhorar significativamente o fluxo de caixa da empresa.";
  } else if (isB2B && data.simplesSupplierPercent !== "acima_60") {
    topOpportunity = "Empresas B2B com fornecedores em regime regular tendem a aproveitar mais crédito de IBS/CBS na cadeia de compras — o que pode representar um diferencial de custo em relação a concorrentes com fornecedores do Simples. Avalie isso com seu contador.";
  }

  return { overallScore, axes, allItems, topOpportunity };
}

function computePrecision(data: AppData): {
  filledCount: number;
  totalFields: number;
  pct: number;
  criticalFields: Array<{ label: string; filled: boolean }>;
} {
  const cnpjClean = (data.cnpj || "").replace(/\D/g, "");
  const criticalFields = [
    { label: "Razão Social", filled: !!data.companyName && data.companyName.length > 3 && data.companyName !== "Minha Empresa" },
    { label: "CNPJ", filled: cnpjClean.length === 14 },
    { label: "Setor de Atuação", filled: !!data.sector },
    { label: "Regime Tributário", filled: !!data.regime },
    { label: "Tipo de Operação (B2B/B2C)", filled: !!data.operations },
    { label: "Número de Colaboradores", filled: !!data.employeeCount },
    { label: "Faturamento Anual", filled: !!data.annualRevenue },
    { label: "Sistema de Gestão (ERP)", filled: !!data.erpSystem },
    { label: "Plano do Fornecedor de ERP", filled: !!data.erpVendorReformPlan },
    { label: "Cadastro de Produtos/Serviços", filled: !!data.catalogStandardized },
    { label: "Emissão de NF-e", filled: !!data.nfeEmission },
    { label: "Fornecedores com NF Regular", filled: !!data.hasRegularNF },
    { label: "Erros nas NFs Recebidas", filled: !!data.hasNFErrors },
    { label: "Conhecimento sobre Split Payment", filled: !!data.splitPaymentAware },
    { label: "Situação do Capital de Giro", filled: !!data.tightWorkingCapital },
    { label: "Margem por Produto/Serviço", filled: !!data.knowsMarginByProduct },
    { label: "Contratos de Longo Prazo", filled: !!data.hasLongTermContracts },
    { label: "Diretoria Ciente da Reforma", filled: !!data.managementAwareOfReform },
    { label: "Treinamento Interno", filled: !!data.hadInternalTraining },
    { label: "Preparação Iniciada", filled: !!data.preparationStarted },
    { label: "Responsável Fiscal Definido", filled: !!data.taxResponsible },
  ];
  const filledCount = criticalFields.filter((f) => f.filled).length;
  const totalFields = criticalFields.length;
  const pct = Math.round((filledCount / totalFields) * 100);
  return { filledCount, totalFields, pct, criticalFields };
}

function generatePlan(data: AppData, diagnosis: DiagnosisResult): PlanAction[] {
  const actions: PlanAction[] = [];
  const isTransitionActive = new Date().getFullYear() >= 2026;
  const hasNoERP = data.erpSystem === "nenhum" || data.erpSystem === "planilha";
  const hasContracts = data.hasLongTermContracts === "sim";
  const isSimples = data.regime === "simples";
  const isB2B = data.operations === "b2b" || data.operations === "b2b_b2c";
  const isB2C = data.operations === "b2c" || data.operations === "b2b_b2c";
  const isMultiState = data.geographicScope === "nacional" || (data.salesStates && data.salesStates.includes("national"));

  // AÇÕES FASE 1
  if (data.taxResponsible === "ninguem") {
    actions.push({ id: "define_responsible", phase: 1, priority: "urgente", eixo: "Governança / Sistemas", title: "Definir responsável pelo tema fiscal/tributário", desc: "Escolha uma pessoa interna ou escritório contábil.", prazo: "7 a 15 dias", responsavel: "Diretoria", confianca: "vermelho" });
  }
  if (hasNoERP) {
    actions.push({ id: "erp_adoption", phase: 1, priority: "urgente", eixo: "Fiscal / Documental", title: "Contratar sistema de gestão (ERP) com suporte a IBS/CBS", desc: "Contrate sistema com roadmap publicado.", prazo: "7 a 15 dias", responsavel: "Diretoria", confianca: "vermelho" });
  }

  // ADICIONAR DEMAIS AÇÕES CONFORME LÓGICA ANTERIOR...
  return actions;
}

function ArticleQuickView({ 
  article, onClose 
}: { 
  article: ReformaArticle; 
  onClose: () => void 
}) {
  const catConfig = CATEGORY_CONFIG[article.category];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${catConfig.color} mb-2 inline-block`}>{catConfig.label}</span>
              <h3 className="font-bold text-foreground text-base leading-tight">{article.title}</h3>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0"><X className="w-5 h-5"/></button>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-foreground/80">{article.sections.oquedizalei}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanoDeAcaoJornada() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [screen, setScreen] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [cnpjFetching, setCnpjFetching] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>({});
  const [entendaMelhorItem, setEntendaMelhorItem] = useState<PlanAction | null>(null);
  const [quickViewArticle, setQuickViewArticle] = useState<ReformaArticle | null>(null);

  const [data, setData] = useState<AppData>({
    companyName: "Minha Empresa",
    cnpj: "",
    geographicScope: "local",
    hasExports: "nao",
    hasGovernmentContracts: "nao",
    salesStates: [],
    reformKnowledge: "baixo",
    mainUrgency: "prazos",
    contactName: "",
    contactPhone: "",
    estado: "",
    municipio: "",
    specialRegimes: [],
    profitMargin: "ate_20"
  });

  const updateData = (field: keyof AppData, val: any) => {
    setData(prev => ({ ...prev, [field]: val }));
  };

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery<CompanySummary[]>({
    queryKey: ["/api/companies"],
  });

  const diagnosis = useMemo(() => computeReadiness(data), [data]);
  const plan = useMemo(() => generatePlan(data, diagnosis), [data, diagnosis]);
  const precision = useMemo(() => computePrecision(data), [data]);

  const handleNext = () => {
    if (screen === 1 && (!data.companyName || data.companyName.length < 3)) {
      setError("Por favor, insira a Razão Social da empresa.");
      return;
    }
    if (screen === INPUT_SCREENS) {
      setSaving(true);
      setTimeout(() => {
        setScreen(8);
        setSaving(false);
      }, 1500);
    } else {
      setScreen(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setScreen(prev => (prev > 0 ? prev - 1 : 0));
    window.scrollTo(0, 0);
  };

  const handleNewPlan = () => setScreen(1);

  const handleOpenCompany = (id: string) => navigate(`/company/${id}`);
  const handleRedoCompany = (id: string) => navigate(`/diagnostico?redo=${id}`);
  const handleDeleteCompany = async (id: string) => {
    if (confirm("Deseja realmente excluir este diagnóstico?")) {
      await apiRequest("DELETE", `/api/companies/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
    }
  };

  const updateTaskStatus = (id: string, status: string) => {
    setTaskStatuses(prev => ({ ...prev, [id]: status }));
  };

  const sectorOptions = [
    { id: "servicos", label: "Serviços", icon: FileText },
    { id: "comercio", label: "Comércio", icon: Package },
    { id: "industria", label: "Indústria", icon: Landmark },
    { id: "agro", label: "Agronegócio", icon: Target },
    { id: "construcao", label: "Construção", icon: LayoutGrid }
  ];

  const RadioRow = ({ field, val, label, desc, highlight }: any) => {
    const isSelected = (data as any)[field] === val;
    return (
      <div 
        onClick={() => updateData(field, val)}
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
          isSelected ? "bg-primary/10 border-primary" : "bg-white/5 border-white/5 hover:border-white/20",
          highlight && !isSelected && "border-destructive/20"
        )}
      >
        <RadioGroupItem value={val} id={`${field}-${val}`} className="mt-1" checked={isSelected} />
        <div className="flex-1">
          <Label htmlFor={`${field}-${val}`} className="text-xs font-bold text-white uppercase cursor-pointer">{label}</Label>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
        </div>
      </div>
    );
  };

  const CheckRow = ({ field, val, label, desc }: any) => {
    const list = (data as any)[field] || [];
    const isSelected = Array.isArray(list) ? list.includes(val) : list === val;
    const toggle = () => {
      if (Array.isArray(list)) {
        const next = isSelected ? list.filter((v: any) => v !== val) : [...list, val];
        updateData(field, next);
      } else {
        updateData(field, val);
      }
    };
    return (
      <div 
        onClick={toggle}
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
          isSelected ? "bg-primary/10 border-primary" : "bg-white/5 border-white/5 hover:border-white/20"
        )}
      >
        <div className={cn("h-4 w-4 rounded border flex items-center justify-center mt-1", isSelected ? "bg-primary border-primary" : "border-white/20")}>
          {isSelected && <CheckCircle2 className="h-3 w-3 text-background" />}
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-white uppercase">{label}</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
        </div>
      </div>
    );
  };

  const phase1Actions = plan.filter(a => a.phase === 1);
  const phase2Actions = plan.filter(a => a.phase === 2);
  const phase3Actions = plan.filter(a => a.phase === 3);
  const criticalCount = plan.filter(a => a.priority === "urgente").length;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <MainLayout>
      <div className="flex-1 relative z-10 min-h-[calc(100vh-64px)] pb-32">
        <div className={cn(
          "container mx-auto py-8 px-4 md:px-6 transition-all duration-500",
          screen >= 8 ? "max-w-screen-xl" : "max-w-4xl"
        )}>
          {/* SCREEN 0: DASHBOARD */}
          {screen === 0 && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                    CENTRAL DE <span className="text-primary italic">CONFORMIDADE</span>
                  </h1>
                </div>
                <Button onClick={handleNewPlan} className="h-14 bg-primary text-background font-black uppercase px-10 rounded-2xl">
                  <Plus className="mr-3 h-6 w-6" /> Novo Diagnóstico
                </Button>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Histórico</h3>
                {companies.length === 0 ? (
                  <div className="glass-card flex flex-col items-center justify-center py-20 border-white/5 border-dashed">
                    <ShieldAlert className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p className="text-sm text-muted-foreground">Nenhum diagnóstico realizado.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {companies.map(company => (
                      <div key={company.id} className="glass-card p-6 border-white/5 flex items-center justify-between">
                         <div>
                            <h4 className="font-black text-white uppercase italic">{company.companyName}</h4>
                            <span className="text-[10px] font-mono text-muted-foreground">{company.cnpj}</span>
                         </div>
                         <div className="flex gap-2">
                           <Button variant="ghost" size="sm" onClick={() => handleOpenCompany(company.id)} className="bg-white/5 text-[10px] font-black uppercase">Ver</Button>
                           <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(company.id)} className="text-red-500 hover:bg-red-500 hover:text-white"><Trash2 className="h-4 w-4"/></Button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREENS 1-7: JORNADA */}
          {screen >= 1 && screen <= INPUT_SCREENS && (
            <div className="animate-fade-in-up space-y-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">{SCREEN_LABELS[screen]}</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{screenSubtitle[screen]}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={handleBack} disabled={screen === 1} className="h-12 px-6 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px]">Voltar</Button>
                  <Button onClick={handleNext} className="h-12 px-8 bg-primary text-background font-black uppercase text-[10px]">Próximo</Button>
                </div>
              </div>

              <div className="grid gap-12">
                {screen === 1 && (
                  <div className="glass-card p-8 border-white/5 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-white/50">Razão Social</Label>
                          <input className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white" value={data.companyName} onChange={e => updateData("companyName", e.target.value)} />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-white/50">CNPJ</Label>
                          <MaskedInput mask="00.000.000/0000-00" className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white" value={data.cnpj} onAccept={(v: string) => updateData("cnpj", v)} />
                       </div>
                    </div>
                  </div>
                )}

                {screen === 2 && (
                   <div className="grid gap-10">
                      <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Setor e Regime</Label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {sectorOptions.map(opt => (
                            <div key={opt.id} onClick={() => updateData("sector", opt.id)} className={cn("glass-card p-4 flex flex-col items-center gap-3 cursor-pointer", data.sector === opt.id ? "bg-primary/10 border-primary" : "border-white/5")}>
                              <opt.icon className={cn("h-6 w-6", data.sector === opt.id ? "text-primary" : "text-muted-foreground")} />
                              <span className="text-[10px] font-black uppercase text-white">{opt.label}</span>
                            </div>
                          ))}
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 pt-6">
                           <div className="space-y-4">
                              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Regime</h4>
                              <RadioGroup value={data.regime} onValueChange={v => updateData("regime", v)} className="grid gap-3">
                                <RadioRow field="regime" val="simples" label="Simples" desc="DAS" />
                                <RadioRow field="regime" val="presumido" label="Presumido" desc="Lucro Presumido" />
                                <RadioRow field="regime" val="real" label="Real" desc="Lucro Real" />
                              </RadioGroup>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-4">
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Faturamento</h4>
                                <Select value={data.annualRevenue} onValueChange={v => updateData("annualRevenue", v)}>
                                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"><SelectValue placeholder="Selecione"/></SelectTrigger>
                                  <SelectContent className="bg-navbar border-white/10 rounded-xl">
                                    <SelectItem value="micro" className="font-bold">Até R$ 360k</SelectItem>
                                    <SelectItem value="pequena" className="font-bold">R$ 360k a R$ 4.8m</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                           </div>
                        </div>
                      </div>
                   </div>
                )}

                {screen >= 3 && screen <= 7 && (
                   <div className="glass-card p-10 border-white/5 flex flex-col items-center justify-center text-center">
                      <Zap className="h-10 w-10 text-primary mb-4 animate-pulse" />
                      <h4 className="text-white font-black uppercase tracking-widest mb-2">Página em Construção OLED</h4>
                      <p className="text-xs text-muted-foreground max-w-xs">Clique em Continuar para processar o diagnóstico com os dados padrão Enterprise.</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 8+ : RESULTADOS */}
          {screen === 8 && diagnosis && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase px-6 py-2">Diagnóstico Concluído</Badge>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Prontidão <span className="text-primary italic">Estratégica</span></h1>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-10 text-center border-white/5 bg-white/5">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Score Global</p>
                   <div className="text-7xl font-black text-white mb-2">{Math.round(diagnosis.overallScore)}%</div>
                   <Badge className={cn("text-xs font-bold px-6", getRiskLabel(diagnosis.overallScore).color)}>{getRiskLabel(diagnosis.overallScore).label}</Badge>
                </div>
                <div className="md:col-span-2 glass-card p-8 border-white/5 space-y-6">
                   <h3 className="text-sm font-bold text-primary uppercase flex items-center gap-2"><Target className="w-4 h-4"/> Eixos de Impacto</h3>
                   <div className="grid gap-4">
                      {diagnosis.axes.map(ax => (
                         <div key={ax.id} className="space-y-2">
                            <div className="flex justify-between items-end">
                               <span className="text-[10px] font-black text-white uppercase">{ax.name}</span>
                               <span className="text-[10px] font-mono text-primary">{ax.score}%</span>
                            </div>
                            <Progress value={ax.score} className="h-1.5" />
                         </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-10 border-t border-white/5">
                 <Button variant="ghost" onClick={handleBack} className="h-14 flex-1 text-muted-foreground font-black uppercase">Revisar</Button>
                 <Button onClick={() => setScreen(9)} className="h-14 flex-[2] bg-primary text-background font-black uppercase tracking-widest shadow-2xl shadow-primary/20">Ver Plano de Ação <ArrowRight className="ml-2 w-5 h-5"/></Button>
              </div>
            </div>
          )}

          {screen === 9 && (
             <div className="space-y-8">
                <div className="flex justify-between items-end pb-8 border-b border-white/5">
                   <div>
                      <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Agenda de <span className="text-primary italic">Adaptação</span></h2>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-2">{data.companyName}</p>
                   </div>
                   <Button onClick={() => navigate("/inicio")} className="h-12 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px]">Concluir</Button>
                </div>

                <div className="grid gap-6">
                   {plan.length === 0 ? (
                      <p className="text-center py-20 text-muted-foreground uppercase font-black text-sm">Gerando Recomendações...</p>
                   ) : (
                      plan.map(action => (
                         <div key={action.id} className="glass-card p-6 border-white/5 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1 space-y-1 text-center md:text-left">
                               <Badge className={cn("text-[8px] font-bold uppercase mb-2", PRIORITY_CONFIG[action.priority].cls)}>{action.priority}</Badge>
                               <h4 className="text-sm font-black text-white uppercase tracking-tight">{action.title}</h4>
                               <p className="text-xs text-muted-foreground">{action.desc}</p>
                            </div>
                            <Select defaultValue="pendente">
                               <SelectTrigger className="w-40 bg-white/5 border-white/10 text-[10px] font-black uppercase">Pend.</SelectTrigger>
                               <SelectContent className="bg-navbar border-white/10">
                                  <SelectItem value="pendente">Pendente</SelectItem>
                                  <SelectItem value="concluida">Concluída</SelectItem>
                               </SelectContent>
                            </Select>
                         </div>
                      ))
                   )}
                </div>
             </div>
          )}
        </div>
      </div>

      {quickViewArticle && <ArticleQuickView article={quickViewArticle} onClose={() => setQuickViewArticle(null)} />}
      
      <Dialog open={!!entendaMelhorItem} onOpenChange={open => !open && setEntendaMelhorItem(null)}>
        <DialogContent className="bg-navbar border-white/10 text-white rounded-3xl p-8 max-w-lg">
           {entendaMelhorItem && (
             <div className="space-y-6 text-center">
                <BookOpen className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-xl font-black uppercase">{entendaMelhorItem.title}</h3>
                <p className="text-sm text-white/70">{entendaMelhorItem.desc}</p>
                <DialogFooter>
                   <Button onClick={() => setEntendaMelhorItem(null)} className="w-full bg-primary text-background font-black uppercase">Entendido</Button>
                </DialogFooter>
             </div>
           )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
