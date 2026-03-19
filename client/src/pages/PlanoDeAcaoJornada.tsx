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
  Scale, DollarSign, ClipboardList, BarChart3, Home, RefreshCw,
  Package, Users, LayoutGrid, Zap, TrendingUp, Clock, User,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { generateActionPlanPdf } from "@/lib/generatePdf";

const INPUT_SCREENS = 7;

const SCREEN_LABELS = [
  "Apresentação",
  "Cadastro da Empresa",
  "Perfil da Operação",
  "Como a Empresa Vende",
  "Como a Empresa Compra",
  "Sistemas e Emissão Fiscal",
  "Financeiro, Preço e Caixa",
  "Governança e Maturidade",
  "Diagnóstico Consolidado",
  "Plano de Ação",
  "Relatório Final",
];

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

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
  axis: string;
}

interface AxisScore {
  id: string;
  name: string;
  icon: any;
  score: number;
  items: RiskItem[];
}

interface DiagnosisResult {
  overallScore: number;
  axes: AxisScore[];
  allItems: RiskItem[];
  topOpportunity: string;
}

interface PlanAction {
  id: string;
  phase: 1 | 2 | 3;
  title: string;
  motivo: string;
  prazo: string;
  responsavel: string;
  priority: "urgente" | "alta" | "media" | "baixa";
}

type AppData = ReturnType<typeof useAppStore>["data"];

function validarCNPJ(raw: string): boolean {
  const clean = raw.replace(/[.\-/\s]/g, "");
  if (clean.length < 14) return false;
  if (!/^\d+$/.test(clean)) return clean.length >= 14;
  if (/^(\d)\1+$/.test(clean)) return false;
  const calc = (len: number) => {
    let s = 0, p = len - 7;
    for (let i = 0; i < len; i++) { s += parseInt(clean[i]) * p--; if (p < 2) p = 9; }
    const r = s % 11; return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === parseInt(clean[12]) && calc(13) === parseInt(clean[13]);
}

function formatCNPJ(value: string): string {
  const digits = value.replace(/[^\d]/g, "").slice(0, 14);
  return digits.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhone(value: string): string {
  const digits = value.replace(/[^\d]/g, "").slice(0, 11);
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d)/, "($1) $2-$3");
  return digits.replace(/(\d{2})(\d{5})(\d)/, "($1) $2-$3");
}

function computeRisk(data: AppData): DiagnosisResult {
  const axis1Items: RiskItem[] = [];
  let a1 = 0;
  if (data.erpSystem === "nenhum" || data.erpSystem === "planilha") {
    axis1Items.push({ level: "critico", title: "Sistema fiscal inadequado para 2026", desc: "Sem ERP integrado, a emissão de NF-e com os campos obrigatórios de IBS e CBS será inviável a partir de 2026.", action: "Avaliar e contratar sistema de gestão (Bling, Omie, Conta Azul ou equivalente) imediatamente.", axis: "fiscal" }); a1 += 30;
  }
  if (data.catalogStandardized === "nao") {
    axis1Items.push({ level: "alto", title: "Cadastro de produtos sem padrão", desc: "Um cadastro desorganizado impedirá a correta classificação de NCM/NBS e o cálculo de alíquotas por produto.", action: "Padronizar o cadastro dos 30 principais produtos/serviços com NCM/NBS correto.", axis: "fiscal" }); a1 += 20;
  }
  if (data.erpVendorReformPlan === "nao" || data.erpVendorReformPlan === "nao_sei") {
    axis1Items.push({ level: "moderado", title: "ERP sem plano para IBS/CBS confirmado", desc: "Sem confirmação do fornecedor sobre a adaptação, existe risco de incompatibilidade no prazo.", action: "Contatar o fornecedor do sistema e exigir cronograma escrito de atualização.", axis: "fiscal" }); a1 += 12;
  }
  if (data.internalFiscalResponsible === "nao") {
    axis1Items.push({ level: "moderado", title: "Sem responsável interno pelo cadastro fiscal", desc: "Sem um ponto focal interno, adaptações dependem exclusivamente do contador externo, criando gargalo.", action: "Designar uma pessoa interna para acompanhar o tema e ser a interface com o contador.", axis: "fiscal" }); a1 += 10;
  }
  const hasSeletivo = data.specialRegimes.some((r) => r.startsWith("seletivo_"));
  if (hasSeletivo) {
    axis1Items.push({ level: "alto", title: "Imposto Seletivo incide sobre seus produtos", desc: "Seus produtos/serviços estão sujeitos ao IS (adicional sobre itens considerados prejudiciais à saúde ou ambiente).", action: "Calcular o IS na tabela de preços e confirmar as alíquotas específicas com o contador.", axis: "fiscal" }); a1 += 15;
  }

  const axis2Items: RiskItem[] = [];
  let a2 = 0;
  if (data.simplesSupplierPercent === "acima_60") {
    axis2Items.push({ level: "alto", title: "Maioria dos fornecedores com crédito limitado", desc: "Com >60% dos fornecedores no Simples, os créditos gerados são de 4–8%, não os 26,5% cheios. Isso eleva o custo efetivo.", action: "Classificar fornecedores na matriz A/B/C e negociar preços ou substituição dos Classe C.", axis: "compras" }); a2 += 22;
  } else if (data.simplesSupplierPercent === "30_60") {
    axis2Items.push({ level: "moderado", title: "Parte dos fornecedores com crédito reduzido", desc: "30–60% dos fornecedores no Simples geram créditos menores que o esperado.", action: "Priorizar renegociações com fornecedores de maior volume de compra.", axis: "compras" }); a2 += 10;
  }
  if (data.hasNFErrors === "frequente") {
    axis2Items.push({ level: "alto", title: "Notas fiscais recebidas com erros frequentes", desc: "Erros de cadastro nas NF-e recebidas comprometem o aproveitamento dos créditos de IBS/CBS.", action: "Implantar programa de qualidade de NF junto aos fornecedores. Prazo de 90 dias para adequação.", axis: "compras" }); a2 += 18;
  }
  if (data.hasRegularNF === "nao") {
    axis2Items.push({ level: "critico", title: "Compras sem nota fiscal regular", desc: "Aquisições sem NF não geram crédito de IBS/CBS. Toda a carga fica como custo puro.", action: "Formalizar o relacionamento com fornecedores e exigir emissão de NF em todas as operações.", axis: "compras" }); a2 += 25;
  }
  if (data.mainExpenses.includes("folha")) {
    axis2Items.push({ level: "alto", title: "Folha de pagamento é o maior custo — sem crédito", desc: "Salários e encargos NÃO geram crédito de IBS/CBS. Isso eleva a carga tributária efetiva para empresas de mão de obra.", action: "Simular o impacto real na margem e recalibrar preços antes de 2026.", axis: "compras" }); a2 += 20;
  }
  if (data.hasImports === "sim") {
    axis2Items.push({ level: "moderado", title: "Importações: regras específicas de crédito", desc: "O IBS/CBS na importação tem mecânica própria. Créditos sobre importações são calculados de forma diferente.", action: "Revisar com o despachante aduaneiro e contador as novas regras de crédito na importação.", axis: "compras" }); a2 += 8;
  }

  const axis3Items: RiskItem[] = [];
  let a3 = 0;
  if (data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao") {
    axis3Items.push({ level: "critico", title: "Contratos longos sem proteção tributária", desc: "Contratos acima de 12 meses sem cláusula de revisão por mudança tributária obrigam a empresa a absorver toda a nova carga.", action: "Revisar contratos com urgência e negociar cláusula prevista na LC 214/2025, art. 378.", axis: "comercial" }); a3 += 25;
  } else if (data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao_sei") {
    axis3Items.push({ level: "alto", title: "Situação dos contratos de longo prazo indefinida", desc: "Não saber se há cláusula de revisão tributária já é um risco. Contratos não analisados podem ser uma armadilha.", action: "Listar todos os contratos acima de 12 meses e levar para revisão jurídica.", axis: "comercial" }); a3 += 15;
  }
  if (data.sector === "servicos") {
    axis3Items.push({ level: "alto", title: "Setor de serviços: maior impacto da reforma", desc: "O ISS atual (2–5%) será substituído pelo IBS/CBS. A carga pode subir significativamente.", action: "Revisar toda a tabela de preços e projetar cenários antes de renovar contratos.", axis: "comercial" }); a3 += 18;
  }
  const isMultiState = data.salesStates.includes("many_states") || data.salesStates.includes("national") || data.geographicScope === "nacional";
  if (isMultiState) {
    axis3Items.push({ level: "moderado", title: "Operação multi-estado: IBS calculado por destino", desc: "Com o IBS, o imposto usa a alíquota do estado do comprador (princípio do destino). Cada estado terá alíquota diferente.", action: "Confirmar se o ERP calcula IBS pelo estado de destino de cada venda.", axis: "comercial" }); a3 += 10;
  }
  if (data.hasGovernmentContracts === "sim") {
    axis3Items.push({ level: "moderado", title: "Contratos públicos com impacto no equilíbrio econômico", desc: "Contratos com governo podem ter cláusulas de equilíbrio econômico-financeiro afetadas pela nova carga tributária.", action: "Analisar contratos públicos com assessoria jurídica especializada.", axis: "comercial" }); a3 += 8;
  }

  const axis4Items: RiskItem[] = [];
  let a4 = 0;
  if (data.splitPaymentAware === "nao") {
    axis4Items.push({ level: "alto", title: "Split Payment desconhecido — risco de caixa", desc: "O Split Payment retém o imposto no pagamento (cartão, PIX, boleto). Você receberá o valor líquido direto.", action: "Estudar o mecanismo, simular o impacto no caixa e ajustar capital de giro antes de 2026.", axis: "financeiro" }); a4 += 18;
  } else if (data.splitPaymentAware === "ouvi_falar") {
    axis4Items.push({ level: "moderado", title: "Compreensão parcial do Split Payment", desc: "Conhecer superficialmente não é suficiente para planejar o impacto no fluxo de caixa.", action: "Realizar treinamento específico sobre Split Payment com contador.", axis: "financeiro" }); a4 += 8;
  }
  if (data.profitMargin === "ate_5" || data.profitMargin === "5_10") {
    axis4Items.push({ level: "alto", title: "Margem de lucro vulnerável à reforma", desc: "Com margem abaixo de 10%, qualquer variação de carga tributária pode comprometer a viabilidade.", action: "Recalcular estrutura de preços imediatamente com base no novo regime.", axis: "financeiro" }); a4 += 22;
  }
  if (data.tightWorkingCapital === "sim") {
    axis4Items.push({ level: "alto", title: "Capital de giro apertado — vulnerável ao Split Payment", desc: "Com o Split Payment, o prazo de recebimento efetivo aumenta pois o imposto é retido antes. Isso pressiona ainda mais o caixa.", action: "Simular o impacto no fluxo de caixa e revisar limites de crédito junto ao banco.", axis: "financeiro" }); a4 += 18;
  }
  if (data.easePriceAdjustment === "dificil" || data.easePriceAdjustment === "impossivel") {
    axis4Items.push({ level: "moderado", title: "Dificuldade para reajustar preços", desc: "Sem capacidade de ajustar preços, eventuais aumentos de carga tributária serão absorvidos como redução de margem.", action: "Desenvolver estratégia de repasse gradual e comunicação antecipada ao mercado.", axis: "financeiro" }); a4 += 12;
  }
  if (data.knowsMarginByProduct === "nao") {
    axis4Items.push({ level: "moderado", title: "Margem por produto/serviço desconhecida", desc: "Sem conhecer a margem por item, é impossível avaliar quais produtos serão inviabilizados pela nova carga.", action: "Calcular margem por produto/serviço principal antes de definir a estratégia de preços.", axis: "financeiro" }); a4 += 10;
  }
  if (data.regime === "lucro_presumido") {
    axis4Items.push({ level: "moderado", title: "Lucro Presumido será extinto gradualmente", desc: "O regime de Lucro Presumido (PIS/COFINS cumulativos) será substituído pelo não-cumulativo pleno.", action: "Planejar a transição com o contador e avaliar ajustes nos processos fiscais.", axis: "financeiro" }); a4 += 8;
  }

  const axis5Items: RiskItem[] = [];
  let a5 = 0;
  if (data.managementAwareOfReform === "nao") {
    axis5Items.push({ level: "alto", title: "Diretoria não acompanha o tema reforma tributária", desc: "Sem engajamento da liderança, as decisões estratégicas necessárias para adaptação não terão prioridade.", action: "Apresentar um briefing executivo sobre impactos e cronograma de adaptação à diretoria.", axis: "governanca" }); a5 += 20;
  }
  if (data.preparationStarted === "nao") {
    axis5Items.push({ level: "alto", title: "Preparação para a reforma ainda não iniciada", desc: "Com a implantação começando em 2026, empresas que não iniciaram a preparação estão em desvantagem crescente.", action: "Criar um grupo de trabalho interno para coordenar a adaptação à reforma.", axis: "governanca" }); a5 += 18;
  }
  if (data.hadInternalTraining === "nao") {
    axis5Items.push({ level: "moderado", title: "Equipe sem treinamento sobre a reforma", desc: "Sem treinamento, erros operacionais aumentam durante a transição (emissão errada, créditos perdidos, etc.).", action: "Planejar treinamento para as equipes fiscal, comercial e financeira até o 2º trimestre de 2025.", axis: "governanca" }); a5 += 12;
  }
  if (data.taxResponsible === "ninguem") {
    axis5Items.push({ level: "critico", title: "Nenhum responsável pelo tema fiscal/tributário", desc: "Sem responsável, a empresa está exposta a erros e omissões que podem resultar em multas e autuações.", action: "Definir imediatamente quem responde pelo tema — interno ou escritório de contabilidade.", axis: "governanca" }); a5 += 25;
  }
  if (data.internalERPResponsible === "nao") {
    axis5Items.push({ level: "moderado", title: "Sem responsável interno pelo sistema (ERP)", desc: "Sem ponto focal de TI/sistemas, a atualização do ERP para IBS/CBS pode ser postergada sem urgência clara.", action: "Designar responsável interno para acompanhar a adaptação do ERP junto ao fornecedor.", axis: "governanca" }); a5 += 10;
  }

  const axes: AxisScore[] = [
    { id: "fiscal", name: "Fiscal / Documental", icon: FileText, score: Math.min(a1, 100), items: axis1Items },
    { id: "compras", name: "Compras / Créditos", icon: Package, score: Math.min(a2, 100), items: axis2Items },
    { id: "comercial", name: "Comercial / Contratos", icon: Scale, score: Math.min(a3, 100), items: axis3Items },
    { id: "financeiro", name: "Financeiro / Caixa", icon: DollarSign, score: Math.min(a4, 100), items: axis4Items },
    { id: "governanca", name: "Governança / Sistemas", icon: LayoutGrid, score: Math.min(a5, 100), items: axis5Items },
  ];

  const weights = [0.25, 0.20, 0.20, 0.20, 0.15];
  const overallScore = Math.min(Math.round(axes.reduce((s, ax, i) => s + ax.score * weights[i], 0)), 100);
  const allItems = axes.flatMap((ax) => ax.items).sort((a, b) => {
    const o: Record<string, number> = { critico: 0, alto: 1, moderado: 2 };
    return o[a.level] - o[b.level];
  });

  let topOpportunity = "Acompanhe a regulamentação e mantenha o cadastro fiscal atualizado.";
  if (data.specialRegimes.some((r) => ["cesta_basica", "educacao", "saude_servicos", "saude_medicamentos"].includes(r))) {
    topOpportunity = "Sua empresa tem direito a reduções de 60% ou alíquota zero no IBS/CBS. Formalize o enquadramento com o contador para garantir o benefício.";
  } else if (data.regime === "simples" && (data.operations === "b2b" || data.operations === "b2b_b2c")) {
    topOpportunity = "Empresas do Simples que vendem para outras empresas podem optar por recolher IBS/CBS separadamente — gerando crédito integral de 26,5% para os clientes. Isso é um argumento de venda poderoso.";
  } else if (data.sector === "industria") {
    topOpportunity = "A indústria é um dos setores mais favorecidos: não-cumulatividade plena permite crédito em praticamente todos os insumos, incluindo energia elétrica e bens de capital.";
  } else if (data.hasExports === "sim") {
    topOpportunity = "Exportações têm imunidade do IBS/CBS e os créditos acumulados são ressarcíveis. Isso pode melhorar o caixa da empresa em relação ao regime atual.";
  }

  return { overallScore, axes, allItems, topOpportunity };
}

function generatePlan(data: AppData, diagnosis: DiagnosisResult): PlanAction[] {
  const actions: PlanAction[] = [];
  const criticalItems = diagnosis.allItems.filter((i) => i.level === "critico");
  const hasNoERP = data.erpSystem === "nenhum" || data.erpSystem === "planilha";
  const hasContracts = data.hasLongTermContracts === "sim";
  const isSimples = data.regime === "simples";
  const isB2B = data.operations === "b2b" || data.operations === "b2b_b2c";

  if (hasNoERP) {
    actions.push({ id: "erp_adoption", phase: 1, priority: "urgente", title: "Contratar sistema de gestão (ERP) imediatamente", motivo: "Sem ERP, a emissão de NF-e com os novos campos obrigatórios de IBS/CBS será tecnicamente inviável a partir de janeiro de 2026.", prazo: "Imediato — 7 dias", responsavel: "Diretoria / TI" });
  }
  actions.push({ id: "erp_contact", phase: 1, priority: hasNoERP ? "alta" : "urgente", title: "Contatar o fornecedor do sistema e exigir cronograma", motivo: "Sem confirmação do plano de atualização do ERP para IBS/CBS, a empresa fica em dependência cega de um terceiro.", prazo: "7 dias", responsavel: "TI / Responsável de sistemas" });
  actions.push({ id: "top30_items", phase: 1, priority: "alta", title: "Listar os 30 produtos/serviços com maior faturamento", motivo: "O impacto da reforma é calculado item a item. Sem essa lista, nenhuma simulação de preço é possível.", prazo: "7 dias", responsavel: "Comercial / Fiscal" });
  if (data.taxResponsible === "ninguem") {
    actions.push({ id: "define_responsible", phase: 1, priority: "urgente", title: "Definir responsável pelo tema fiscal/tributário agora", motivo: "Sem um ponto focal, as adaptações não terão dono e as chances de erros e atrasos são elevadas.", prazo: "Imediato — 2 dias", responsavel: "Diretoria" });
  }
  if (hasContracts && (data.priceRevisionClause === "nao" || data.priceRevisionClause === "nao_sei")) {
    actions.push({ id: "contracts_review", phase: 1, priority: "urgente", title: "Revisar todos os contratos de longo prazo com advogado", motivo: "Contratos sem cláusula de revisão tributária podem obrigar a absorver toda a nova carga. A LC 214/2025, art. 378, permite revisão.", prazo: "7 dias", responsavel: "Jurídico / Contador" });
  }
  if (data.managementAwareOfReform === "nao") {
    actions.push({ id: "mgmt_briefing", phase: 1, priority: "alta", title: "Apresentar briefing executivo sobre a reforma à diretoria", motivo: "Sem engajamento da liderança, as decisões estratégicas e alocações de recursos necessárias não serão priorizadas.", prazo: "7 dias", responsavel: "Contador / Responsável fiscal" });
  }
  if (data.hasRegularNF === "nao") {
    actions.push({ id: "nf_formal", phase: 1, priority: "urgente", title: "Formalizar exigência de NF em todas as compras", motivo: "Aquisições sem NF não geram crédito de IBS/CBS — a carga vira custo puro. Isso deve ser corrigido imediatamente.", prazo: "7 dias", responsavel: "Compras / Financeiro" });
  }

  actions.push({ id: "catalog_std", phase: 2, priority: "alta", title: "Padronizar cadastro dos 30 principais itens", motivo: "Cada item deve ter: código único, descrição padronizada, NCM/NBS correto e categoria tributária definida.", prazo: "30 dias", responsavel: "Fiscal / TI" });
  actions.push({ id: "supplier_abc", phase: 2, priority: "alta", title: "Classificar os 20 principais fornecedores na matriz A/B/C", motivo: "Classe A (regime regular, NF correta) = crédito integral. Classe B (Simples) = crédito parcial. Classe C (PF/informal) = sem crédito.", prazo: "30 dias", responsavel: "Compras / Fiscal" });
  actions.push({ id: "fiscal_routine", phase: 2, priority: "media", title: "Implantar reunião semanal de conferência fiscal", motivo: "Uma hora semanal de conferência fiscal evita erros que se acumulam e são descobertos apenas nas obrigações acessórias mensais.", prazo: "30 dias", responsavel: "Fiscal / Contador" });
  if (data.hasNFErrors === "frequente") {
    actions.push({ id: "supplier_nf_quality", phase: 2, priority: "alta", title: "Notificar fornecedores com NF de baixa qualidade", motivo: "Erros de cadastro nas NF recebidas comprometem diretamente os créditos de IBS/CBS — cada nota errada é crédito perdido.", prazo: "30 dias", responsavel: "Compras / Fiscal" });
  }
  if (data.hasMarketplace === "sim") {
    actions.push({ id: "marketplace_reform", phase: 2, priority: "alta", title: "Contatar plataforma de marketplace sobre adaptação à reforma", motivo: "Marketplaces precisam adaptar seus sistemas de repasse. Entender o prazo e o impacto no Split Payment é essencial.", prazo: "30 dias", responsavel: "Comercial / TI" });
  }
  if (data.hasExports === "sim") {
    actions.push({ id: "export_rules", phase: 2, priority: "media", title: "Verificar regras de imunidade e ressarcimento para exportações", motivo: "Exportações têm imunidade do IBS/CBS. Os créditos acumulados podem ser ressarcidos — isso melhora o fluxo de caixa.", prazo: "30 dias", responsavel: "Fiscal / Contador" });
  }
  if (data.hasGovernmentContracts === "sim") {
    actions.push({ id: "gov_contracts", phase: 2, priority: "alta", title: "Analisar contratos públicos com assessoria jurídica", motivo: "Contratos com o governo podem ter cláusulas de equilíbrio econômico-financeiro afetadas pela nova tributação.", prazo: "30 dias", responsavel: "Jurídico" });
  }
  if (isSimples && isB2B) {
    actions.push({ id: "simples_option", phase: 2, priority: "media", title: "Avaliar opção por recolhimento de IBS/CBS fora do DAS", motivo: "Empresas do Simples que vendem B2B podem optar por recolher separadamente e gerar crédito integral de 26,5% para os clientes.", prazo: "30 dias", responsavel: "Contador" });
  }
  if (data.knowsMarginByProduct === "nao") {
    actions.push({ id: "margin_calc", phase: 2, priority: "alta", title: "Calcular margem líquida por produto/serviço principal", motivo: "Sem saber a margem por item, é impossível identificar quais produtos serão inviabilizados pela nova carga tributária.", prazo: "30 dias", responsavel: "Financeiro / Comercial" });
  }

  actions.push({ id: "nfe_test", phase: 3, priority: "alta", title: "Testar emissão de NF-e com novos campos em homologação", motivo: "A NF-e passará a exigir campos específicos de IBS/CBS. Testar antes de 2026 evita paralisação operacional.", prazo: "51 dias", responsavel: "TI / Fiscal" });
  actions.push({ id: "pricing_formula", phase: 3, priority: "alta", title: "Definir nova fórmula de precificação para 2026", motivo: `Fórmula: Custo + Margem = Preço Líquido. Preço Líquido × (1 + alíquota efetiva) = Preço Bruto. ${isB2B ? "Para B2B: destacar o crédito gerado." : "Para B2C: comunicar mudança ao mercado com antecedência."}`, prazo: "51 dias", responsavel: "Comercial / Financeiro" });
  if (data.tightWorkingCapital === "sim" || data.splitPaymentAware === "nao") {
    actions.push({ id: "split_simulation", phase: 3, priority: "urgente", title: "Simular impacto do Split Payment no fluxo de caixa", motivo: "O Split Payment retém o imposto no momento do pagamento. Com capital de giro apertado, esse efeito pode ser crítico.", prazo: "51 dias", responsavel: "Financeiro / CFO" });
  }
  if (data.hadInternalTraining === "nao") {
    actions.push({ id: "team_training", phase: 3, priority: "media", title: "Treinar as equipes fiscal, comercial e financeira", motivo: "Cada área precisa entender seu papel na reforma: fiscal (NF-e), comercial (créditos e precificação), financeiro (Split Payment).", prazo: "51 dias", responsavel: "RH / Gestor de área" });
  }
  actions.push({ id: "final_validation", phase: 3, priority: "alta", title: "Reunião de validação final com contador antes de 2026", motivo: "Confirmar: sistema atualizado, cadastros corretos, contratos revisados, rotinas funcionando e equipe treinada.", prazo: "51 dias", responsavel: "Contador / Diretoria" });
  if (data.regime === "lucro_presumido") {
    actions.push({ id: "regime_transition", phase: 3, priority: "media", title: "Planejar transição do Lucro Presumido para novo regime", motivo: "O Lucro Presumido (PIS/COFINS cumulativos) será extinto. A migração para não-cumulatividade exige preparação de controles.", prazo: "51 dias", responsavel: "Contador / Financeiro" });
  }

  return actions;
}

function getRiskLabel(score: number) {
  if (score >= 70) return { label: "CRÍTICO", color: "text-red-700 bg-red-50 border-red-200" };
  if (score >= 45) return { label: "ALTO", color: "text-orange-700 bg-orange-50 border-orange-200" };
  if (score >= 20) return { label: "MODERADO", color: "text-amber-700 bg-amber-50 border-amber-200" };
  return { label: "BAIXO", color: "text-green-700 bg-green-50 border-green-200" };
}

const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const priorityConfig = {
  urgente: { label: "Urgente", cls: "bg-red-100 text-red-700 border-red-200" },
  alta: { label: "Alta", cls: "bg-orange-100 text-orange-700 border-orange-200" },
  media: { label: "Média", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  baixa: { label: "Baixa", cls: "bg-green-100 text-green-700 border-green-200" },
};

const statusConfig = {
  pendente: { label: "Pendente", cls: "bg-muted text-muted-foreground", icon: Clock },
  em_andamento: { label: "Em andamento", cls: "bg-amber-100 text-amber-700", icon: Zap },
  concluida: { label: "Concluída", cls: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

export default function PlanoDeAcaoJornada() {
  const { data, updateData, saveCompany, companyId, user, logout, resetData } = useAppStore();
  const [, navigate] = useLocation();
  const [screen, setScreen] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [plan, setPlan] = useState<PlanAction[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, "pendente" | "em_andamento" | "concluida">>({});

  useEffect(() => {
    if (companyId && screen === 0) {
      const d = computeRisk(data);
      setDiagnosis(d);
      setPlan(generatePlan(data, d));
      setScreen(8);
    }
  }, []);

  const progressPct = screen >= 1 && screen <= INPUT_SCREENS ? ((screen - 1) / (INPUT_SCREENS - 1)) * 100 : screen > INPUT_SCREENS ? 100 : 0;

  const cycleStatus = (id: string) => {
    setTaskStatuses((prev) => {
      const cur = prev[id] || "pendente";
      const next = cur === "pendente" ? "em_andamento" : cur === "em_andamento" ? "concluida" : "pendente";
      return { ...prev, [id]: next };
    });
  };

  const validate = (): boolean => {
    if (screen === 1) {
      if (!data.companyName.trim() || data.companyName === "Minha Empresa") {
        setError("Informe a Razão Social da empresa para continuar."); return false;
      }
      const cleanCNPJ = data.cnpj.replace(/[^\d]/g, "");
      if (cleanCNPJ.length < 14) {
        setError("CNPJ é obrigatório. Informe o CNPJ completo (14 dígitos)."); return false;
      }
      if (!validarCNPJ(data.cnpj)) {
        setError("CNPJ inválido. Verifique os dígitos e tente novamente."); return false;
      }
    }
    setError(""); return true;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (screen === INPUT_SCREENS) {
      setSaving(true);
      try {
        const d = computeRisk(data);
        updateData("riskScore", d.overallScore);
        await saveCompany();
        setDiagnosis(d);
        setPlan(generatePlan(data, d));
        setScreen(8);
      } catch {
        const d = computeRisk(data);
        setDiagnosis(d);
        setPlan(generatePlan(data, d));
        setScreen(8);
      } finally { setSaving(false); }
    } else if (screen < 10) {
      setScreen(screen + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (screen > 0) { setScreen(screen - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const handleNewPlan = () => {
    resetData(); setScreen(1); setDiagnosis(null); setPlan([]); setTaskStatuses({});
  };

  const sectorOptions = [
    { id: "industria", label: "Indústria", icon: Factory, desc: "Transformação, manufatura" },
    { id: "atacado", label: "Atacado / Distribuição", icon: Store, desc: "Revenda B2B em grande volume" },
    { id: "varejo", label: "Varejo", icon: ShoppingBag, desc: "Venda ao consumidor final" },
    { id: "servicos", label: "Serviços", icon: Landmark, desc: "Consultoria, saúde, educação, TI" },
    { id: "agronegocio", label: "Agronegócio", icon: Tractor, desc: "Produção rural, cooperativas" },
    { id: "outros", label: "Outros Setores", icon: Building, desc: "Construção, transporte, etc." },
  ];

  const screenSubtitle: Record<number, string> = {
    1: "Identifique a empresa e o responsável pelo tema. Esses dados vinculam todo o diagnóstico.",
    2: "Perfil tributário e operacional — base do cálculo de risco.",
    3: "Como a empresa vai ao mercado determina a estratégia comercial pós-reforma.",
    4: "O perfil de compras define os créditos tributários que a empresa pode aproveitar.",
    5: "A adequação dos sistemas fiscais é obrigatória — a NF-e exigirá novos campos em 2026.",
    6: "A saúde financeira e a compreensão do Split Payment definem o nível de risco de caixa.",
    7: "Contratos, governança e maturidade determinam a capacidade de adaptação da empresa.",
  };

  const phase1Actions = plan.filter((a) => a.phase === 1);
  const phase2Actions = plan.filter((a) => a.phase === 2);
  const phase3Actions = plan.filter((a) => a.phase === 3);
  const criticalCount = diagnosis?.allItems.filter((i) => i.level === "critico").length || 0;

  const toggleCheckbox = (field: "salesChannels" | "mainExpenses" | "fiscalDocTypes" | "paymentMethods" | "specialRegimes", val: string) => {
    const arr = data[field] as string[];
    const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
    updateData(field, next);
  };

  const CheckRow = ({ field, val, label, desc }: { field: "salesChannels" | "mainExpenses" | "fiscalDocTypes" | "paymentMethods" | "specialRegimes"; val: string; label: string; desc?: string }) => {
    const arr = data[field] as string[];
    const checked = arr.includes(val);
    return (
      <label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${checked ? "border-primary bg-primary/5" : "hover:bg-muted/30"}`}>
        <input type="checkbox" checked={checked} onChange={() => toggleCheckbox(field, val)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary shrink-0" />
        <div><span className="text-sm font-bold block">{label}</span>{desc && <span className="text-xs text-muted-foreground">{desc}</span>}</div>
      </label>
    );
  };

  const RadioRow = ({ field, val, label, desc, highlight }: { field: keyof AppData; val: string; label: string; desc?: string; highlight?: string }) => (
    <div className={`flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/30 cursor-pointer ${(data[field] as string) === val ? "border-primary bg-primary/5" : ""}`}>
      <RadioGroupItem value={val} id={`${field}-${val}`} data-testid={`radio-${field}-${val}`} />
      <div className="flex-1">
        <Label htmlFor={`${field}-${val}`} className="font-bold cursor-pointer block">{label}</Label>
        {desc && <span className={`text-xs ${highlight ? "text-red-600 font-medium" : "text-muted-foreground"}`}>{desc}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 max-w-screen-lg items-center justify-between px-4 md:px-6">
          <a href="/inicio" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-lg"><Building2 className="h-4 w-4 text-primary" /></div>
            <span className="font-heading font-bold uppercase tracking-wider text-xs sm:text-sm">REFORMA<span className="text-primary">EM</span>AÇÃO</span>
          </a>
          <div className="flex items-center gap-3">
            {screen >= 1 && screen <= INPUT_SCREENS && (
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Etapa {screen} de {INPUT_SCREENS}</span>
            )}
            {screen >= 8 && data.companyName && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">{data.companyName}</Badge>
            )}
            <Button variant="ghost" size="sm" onClick={() => logout()} className="gap-1 text-muted-foreground h-8 text-xs" data-testid="button-logout">
              <LogOut className="h-3.5 w-3.5" /><span className="hidden sm:inline">Sair</span>
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
                  <div className={`text-[10px] font-medium px-2 py-1 rounded-full ${s === screen ? "bg-primary text-primary-foreground" : s < screen ? "bg-primary/10 text-primary" : "text-muted-foreground/50"}`}>
                    <span className="hidden sm:inline">{SCREEN_LABELS[s]}</span>
                    <span className="sm:hidden">{s}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500 ease-out rounded-full" style={{ width: `${progressPct}%` }} data-testid="progress-bar" />
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
                  Uma entrevista guiada que coleta informações do seu negócio, gera um diagnóstico por eixo e entrega um plano de ação concreto — com motivo, prazo e responsável para cada tarefa.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Target, title: "Score de prontidão", desc: "Sua empresa recebe uma nota de 0 a 100 com nível de exposição: Baixo, Moderado, Alto ou Crítico." },
                  { icon: ShieldAlert, title: "Diagnóstico por eixo", desc: "5 dimensões avaliadas: Fiscal, Compras, Comercial, Financeiro e Governança." },
                  { icon: ClipboardList, title: "Plano filtrado pelo perfil", desc: "Cada ação vem com motivo claro, prazo e responsável sugerido — nada genérico." },
                  { icon: FileText, title: "PDF para seu contador", desc: "Gerado apenas ao final — com diagnóstico completo, prioridades e plano de ação." },
                ].map((item) => (
                  <Card key={item.title} className="border shadow-sm">
                    <CardContent className="pt-5 pb-4 flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0"><item.icon className="h-5 w-5 text-primary" /></div>
                      <div><p className="font-bold text-sm">{item.title}</p><p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p></div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-2"><Info className="h-4 w-4 text-primary" /><span className="text-sm font-bold text-primary">7 etapas · ~12 minutos · Plano + PDF ao final</span></div>
                  <p className="text-sm text-muted-foreground">Responda as perguntas sobre seu negócio. O CNPJ é obrigatório para vincular o diagnóstico à empresa. O plano de ação e o PDF são gerados automaticamente ao final — não antes.</p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button size="lg" className="gap-2 w-full sm:w-auto sm:mx-auto" onClick={handleNext} data-testid="button-start-journey">
                  Iniciar Diagnóstico <ArrowRight className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground mx-auto" onClick={() => navigate("/plano-de-acao/meus-planos")} data-testid="button-view-plans">
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
                    {screen === 2 && <LayoutGrid className="h-5 w-5 text-primary" />}
                    {screen === 3 && <ShoppingBag className="h-5 w-5 text-primary" />}
                    {screen === 4 && <Truck className="h-5 w-5 text-primary" />}
                    {screen === 5 && <Monitor className="h-5 w-5 text-primary" />}
                    {screen === 6 && <DollarSign className="h-5 w-5 text-primary" />}
                    {screen === 7 && <Scale className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-heading" data-testid="text-screen-title">{SCREEN_LABELS[screen]}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{screenSubtitle[screen]}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 md:p-8 space-y-8">

                {screen === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">A — Identificação da Empresa</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="font-bold">Razão Social *</Label>
                          <input id="companyName" data-testid="input-company-name" className={inputClass} placeholder="Ex: Distribuidora Norte LTDA" value={data.companyName === "Minha Empresa" ? "" : data.companyName} onChange={(e) => { updateData("companyName", e.target.value); setError(""); }} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nomeFantasia" className="font-bold">Nome Fantasia <span className="font-normal text-muted-foreground">(opcional)</span></Label>
                          <input id="nomeFantasia" className={inputClass} placeholder="Ex: Distribuidora Norte" value={data.nomeFantasia} onChange={(e) => updateData("nomeFantasia", e.target.value)} />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cnpj" className="font-bold">CNPJ *</Label>
                          <input id="cnpj" data-testid="input-cnpj" className={inputClass} placeholder="00.000.000/0000-00" value={data.cnpj} onChange={(e) => { updateData("cnpj", formatCNPJ(e.target.value)); setError(""); }} />
                          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cnaeCode" className="font-bold">CNAE Principal <span className="font-normal text-muted-foreground">(opcional)</span></Label>
                          <input id="cnaeCode" className={inputClass} placeholder="Ex: 4711-3/02 — Supermercados" value={data.cnaeCode} onChange={(e) => updateData("cnaeCode", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">B — Localização da Sede</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="font-bold">Estado</Label>
                          <Select value={data.estado} onValueChange={(v) => updateData("estado", v)} data-testid="select-estado">
                            <SelectTrigger><SelectValue placeholder="Selecione o estado" /></SelectTrigger>
                            <SelectContent>{ESTADOS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="municipio" className="font-bold">Município</Label>
                          <input id="municipio" className={inputClass} placeholder="Ex: São Paulo" value={data.municipio} onChange={(e) => updateData("municipio", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">C — Responsável pela Adaptação</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactName" className="font-bold">Nome do Responsável</Label>
                          <input id="contactName" data-testid="input-contact-name" className={inputClass} placeholder="Ex: Ana Silva" value={data.contactName} onChange={(e) => updateData("contactName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactRole" className="font-bold">Cargo / Função</Label>
                          <input id="contactRole" className={inputClass} placeholder="Ex: Gerente Financeiro" value={data.contactRole} onChange={(e) => updateData("contactRole", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail" className="font-bold">E-mail</Label>
                          <input id="contactEmail" type="email" className={inputClass} placeholder="responsavel@empresa.com.br" value={data.contactEmail} onChange={(e) => updateData("contactEmail", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone" className="font-bold">Telefone / WhatsApp</Label>
                          <input id="contactPhone" className={inputClass} placeholder="(11) 99999-9999" value={data.contactPhone} onChange={(e) => updateData("contactPhone", formatPhone(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {screen === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">Setor / Atividade Principal</Label>
                      <RadioGroup value={data.sector} onValueChange={(v) => updateData("sector", v)} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {sectorOptions.map((item) => (
                          <div key={item.id}>
                            <RadioGroupItem value={item.id} id={`sector-${item.id}`} className="peer sr-only" data-testid={`radio-sector-${item.id}`} />
                            <Label htmlFor={`sector-${item.id}`} className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center h-full gap-2">
                              <item.icon className="h-7 w-7 text-muted-foreground" />
                              <span className="text-sm font-bold">{item.label}</span>
                              <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Como sua empresa paga impostos hoje?</Label>
                      <RadioGroup value={data.regime} onValueChange={(v) => updateData("regime", v)} className="flex flex-col space-y-2">
                        <RadioRow field="regime" val="simples" label="Simples Nacional" desc="Recolhimento unificado em guia DAS" />
                        <RadioRow field="regime" val="lucro_presumido" label="Lucro Presumido" desc="PIS/COFINS cumulativos, IRPJ/CSLL por presunção" />
                        <RadioRow field="regime" val="lucro_real" label="Lucro Real" desc="PIS/COFINS não-cumulativos, apuração pelo resultado real" />
                      </RadioGroup>
                      {data.regime === "simples" && (
                        <Alert className="bg-blue-50 border-blue-200">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-xs text-blue-700">Para empresas do Simples que vendem para outras empresas (B2B), a reforma permite optar por recolher IBS/CBS separadamente — gerando crédito integral para os clientes.</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Faturamento Anual Aproximado</Label>
                        <Select value={data.annualRevenue} onValueChange={(v) => updateData("annualRevenue", v)} data-testid="select-annual-revenue">
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate_360k">Até R$ 360 mil (MEI / Simples)</SelectItem>
                            <SelectItem value="360k_4_8m">R$ 360 mil a R$ 4,8 mi</SelectItem>
                            <SelectItem value="4_8m_78m">R$ 4,8 mi a R$ 78 mi</SelectItem>
                            <SelectItem value="acima_78m">Acima de R$ 78 mi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Colaboradores</Label>
                        <Select value={data.employeeCount} onValueChange={(v) => updateData("employeeCount", v)} data-testid="select-employees">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1_10">1 a 10</SelectItem>
                            <SelectItem value="11_50">11 a 50</SelectItem>
                            <SelectItem value="51_200">51 a 200</SelectItem>
                            <SelectItem value="acima_200">Acima de 200</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Estabelecimentos</Label>
                        <Select value={data.establishmentCount} onValueChange={(v) => updateData("establishmentCount", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 (sede única)</SelectItem>
                            <SelectItem value="2_5">2 a 5</SelectItem>
                            <SelectItem value="6_20">6 a 20</SelectItem>
                            <SelectItem value="acima_20">Acima de 20</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">A empresa vende principalmente:</Label>
                      <RadioGroup value={data.businessType} onValueChange={(v) => updateData("businessType", v)} className="flex flex-col space-y-2">
                        <RadioRow field="businessType" val="produtos" label="Produtos / Mercadorias" desc="Estoque físico, revenda, manufactura" />
                        <RadioRow field="businessType" val="servicos" label="Serviços" desc="Prestação de serviços, consultoria, mão de obra" />
                        <RadioRow field="businessType" val="ambos" label="Produtos e Serviços (misto)" desc="Combinação de venda de mercadoria com serviços" />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Área geográfica de atuação</Label>
                      <RadioGroup value={data.geographicScope} onValueChange={(v) => { updateData("geographicScope", v); if (v === "local") updateData("salesStates", []); else if (v === "nacional") updateData("salesStates", ["national"]); }} className="flex flex-col space-y-2">
                        <RadioRow field="geographicScope" val="local" label="Apenas no meu estado" desc="Operação concentrada em uma UF" />
                        <RadioRow field="geographicScope" val="regional" label="Em 2 a 5 estados" desc="Operação regional" />
                        <RadioRow field="geographicScope" val="nacional" label="Nacional / E-commerce para todo o Brasil" desc="Alíquota de IBS varia por estado de destino — risco elevado" />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Regimes especiais ou benefícios tributários</Label>
                      <p className="text-xs text-muted-foreground">Marque os que se aplicam. Se nenhum se aplica, avance normalmente.</p>
                      {data.specialRegimes.length > 0 && (
                        <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold text-primary">{data.specialRegimes.length} regime(s) selecionado(s)</span>
                        </div>
                      )}
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {SPECIAL_REGIMES.map((opt) => {
                          const checked = data.specialRegimes.includes(opt.id);
                          return (
                            <label key={opt.id} className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${checked ? "border-primary bg-primary/5" : "hover:bg-muted/30"}`} data-testid={`checkbox-regime-${opt.id}`}>
                              <input type="checkbox" checked={checked} onChange={() => toggleCheckbox("specialRegimes", opt.id)} className="mt-0.5 h-4 w-4 rounded shrink-0" />
                              <div><span className="text-sm font-bold block">{opt.label}</span><span className="text-xs text-muted-foreground block">{opt.desc}</span><span className={`text-[10px] font-medium block mt-0.5 ${opt.color === "red" ? "text-red-600" : "text-green-700"}`}>{opt.note}</span></div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {screen === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">Para quem a empresa vende principalmente?</Label>
                      <RadioGroup value={data.operations} onValueChange={(v) => updateData("operations", v)} className="flex flex-col space-y-2">
                        <RadioRow field="operations" val="b2b" label="Para outras empresas (B2B)" desc="Clientes corporativos que aproveitam créditos de imposto." />
                        <RadioRow field="operations" val="b2c" label="Para o consumidor final (B2C)" desc="Pessoas físicas, sem aproveitamento de crédito." />
                        <RadioRow field="operations" val="b2b_b2c" label="Para ambos (B2B + B2C)" desc="Mix de clientes empresariais e consumidores finais." />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Canais de venda utilizados</Label>
                      <p className="text-xs text-muted-foreground">Selecione todos que se aplicam.</p>
                      <div className="space-y-2">
                        <CheckRow field="salesChannels" val="direto" label="Venda direta / presencial" desc="Representantes, balcão ou força de vendas própria" />
                        <CheckRow field="salesChannels" val="online_proprio" label="E-commerce próprio" desc="Loja virtual da empresa" />
                        <CheckRow field="salesChannels" val="marketplace" label="Marketplace" desc="Mercado Livre, Amazon, Shopee, Magalu, etc." />
                        <CheckRow field="salesChannels" val="distribuidor" label="Via distribuidores ou representantes" desc="Canal indireto de vendas B2B" />
                        <CheckRow field="salesChannels" val="licitacao" label="Licitação pública / governo" desc="Contratos com órgãos públicos" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">A empresa presta serviços em mais de um município?</Label>
                      <RadioGroup value={data.multiMunicipality} onValueChange={(v) => updateData("multiMunicipality", v)} className="flex flex-col space-y-2">
                        <RadioRow field="multiMunicipality" val="sim" label="Sim, atuamos em vários municípios" desc="O IBS de serviços é calculado pelo município de destino." />
                        <RadioRow field="multiMunicipality" val="nao" label="Não, atuamos em um único município" />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">A empresa tem contratos de longo prazo (acima de 12 meses)?</Label>
                      <RadioGroup value={data.hasLongTermContracts} onValueChange={(v) => updateData("hasLongTermContracts", v)} className="flex flex-col space-y-2">
                        <RadioRow field="hasLongTermContracts" val="sim" label="Sim, temos contratos acima de 12 meses" />
                        <RadioRow field="hasLongTermContracts" val="nao" label="Não, trabalhamos com pedidos avulsos ou contratos curtos" />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Os preços da empresa são mais sensíveis a:</Label>
                      <RadioGroup value={data.priceSensitivity} onValueChange={(v) => updateData("priceSensitivity", v)} className="flex flex-col space-y-2">
                        <RadioRow field="priceSensitivity" val="mercado" label="Mercado / concorrência" desc="O preço é ditado pelo que o mercado pratica." />
                        <RadioRow field="priceSensitivity" val="margem" label="Margem interna" desc="O preço é calculado sobre custo + margem desejada." />
                        <RadioRow field="priceSensitivity" val="contrato" label="Contrato / tabela fixa" desc="Preços negociados e travados em contrato." />
                        <RadioRow field="priceSensitivity" val="licitacao" label="Licitação / pregão" desc="Preços definidos em processo licitatório público." />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Situações adicionais</Label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { field: "hasExports" as const, label: "Exporta produtos ou serviços", hint: "Exportações têm imunidade do IBS/CBS" },
                          { field: "hasMarketplace" as const, label: "Opera em marketplace", hint: "Mercado Livre, Amazon, etc." },
                          { field: "hasGovernmentContracts" as const, label: "Contratos com o governo", hint: "Federal, estadual ou municipal" },
                        ].map(({ field, label, hint }) => (
                          <label key={field} className={`flex flex-col gap-2 rounded-lg border p-4 cursor-pointer transition-colors ${data[field] === "sim" ? "border-primary bg-primary/5" : "hover:bg-muted/30"}`}>
                            <div className="flex items-start gap-2">
                              <input type="checkbox" checked={data[field] === "sim"} onChange={() => updateData(field, data[field] === "sim" ? "nao" : "sim")} className="mt-0.5 h-4 w-4 shrink-0" data-testid={`checkbox-${field}`} />
                              <span className="text-sm font-bold">{label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground pl-6">{hint}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {screen === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Quantos fornecedores ativos?</Label>
                        <Select value={data.supplierCount} onValueChange={(v) => updateData("supplierCount", v)} data-testid="select-supplier-count">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate_10">Até 10</SelectItem>
                            <SelectItem value="ate_20">10 a 20</SelectItem>
                            <SelectItem value="ate_50">20 a 50</SelectItem>
                            <SelectItem value="acima_50">Acima de 50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">% dos fornecedores no Simples Nacional</Label>
                        <Select value={data.simplesSupplierPercent} onValueChange={(v) => updateData("simplesSupplierPercent", v)} data-testid="select-simples-percent">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate_30">Menos de 30%</SelectItem>
                            <SelectItem value="30_60">30% a 60%</SelectItem>
                            <SelectItem value="acima_60">Mais de 60%</SelectItem>
                            <SelectItem value="nao_sei">Não sei informar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {data.simplesSupplierPercent === "acima_60" && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-700"><strong>Atenção:</strong> Fornecedores do Simples geram créditos de 4–8%, não os 26,5% cheios. Isso eleva seu custo efetivo e será um tema prioritário no seu plano.</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-3">
                      <Label className="font-bold">A empresa compra regularmente com nota fiscal?</Label>
                      <RadioGroup value={data.hasRegularNF} onValueChange={(v) => updateData("hasRegularNF", v)} className="flex flex-col space-y-2">
                        <RadioRow field="hasRegularNF" val="sim" label="Sim, todas as compras têm NF" />
                        <RadioRow field="hasRegularNF" val="parcialmente" label="Parcialmente — algumas compras sem NF" desc="Compras informais não geram crédito de IBS/CBS." />
                        <RadioRow field="hasRegularNF" val="nao" label="Não, muitas compras sem nota fiscal" desc="Toda a carga tributária fica como custo puro." highlight />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Quais despesas/compras têm maior peso na operação?</Label>
                      <p className="text-xs text-muted-foreground">Selecione todas que representam custo relevante.</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <CheckRow field="mainExpenses" val="mercadorias" label="Estoque e mercadorias para revenda" desc="Gera crédito integral de IBS/CBS" />
                        <CheckRow field="mainExpenses" val="folha" label="Folha de pagamento e encargos" desc="NÃO gera crédito — principal risco para serviços" />
                        <CheckRow field="mainExpenses" val="logistica" label="Logística e frete" desc="Gera crédito pelo CT-e do transportador" />
                        <CheckRow field="mainExpenses" val="tecnologia" label="Tecnologia e licenças de software" desc="Gera crédito se fornecedor for PJ" />
                        <CheckRow field="mainExpenses" val="aluguel" label="Aluguel e ocupação" desc="Gera crédito apenas se locador for PJ" />
                        <CheckRow field="mainExpenses" val="servicos_pj" label="Serviços de terceiros / PJ" desc="Gera crédito integral" />
                      </div>
                      {data.mainExpenses.includes("folha") && (
                        <Alert className="bg-red-50 border-red-200">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-xs text-red-700"><strong>Risco alto:</strong> Folha de pagamento é seu maior custo e não gera crédito de IBS/CBS. Isso eleva a carga tributária efetiva.</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">As notas fiscais recebidas têm erros de cadastro com frequência?</Label>
                      <RadioGroup value={data.hasNFErrors} onValueChange={(v) => updateData("hasNFErrors", v)} className="flex flex-col space-y-2">
                        <RadioRow field="hasNFErrors" val="raramente" label="Raramente ou nunca" />
                        <RadioRow field="hasNFErrors" val="as_vezes" label="Às vezes — corrigimos quando necessário" />
                        <RadioRow field="hasNFErrors" val="frequente" label="Com frequência — é um problema recorrente" desc="Erros de NF comprometem o aproveitamento de créditos de IBS/CBS." highlight />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">A empresa importa produtos ou insumos?</Label>
                      <RadioGroup value={data.hasImports} onValueChange={(v) => updateData("hasImports", v)} className="flex flex-col space-y-2">
                        <RadioRow field="hasImports" val="sim" label="Sim, importamos regularmente" desc="Importações têm regras específicas de IBS/CBS — exige análise." />
                        <RadioRow field="hasImports" val="ocasional" label="Ocasionalmente" />
                        <RadioRow field="hasImports" val="nao" label="Não importamos" />
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {screen === 5 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">Sistema de gestão (ERP) utilizado</Label>
                      <Select value={data.erpSystem} onValueChange={(v) => updateData("erpSystem", v)} data-testid="select-erp">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sap">SAP / TOTVS / Oracle / Sankhya</SelectItem>
                          <SelectItem value="medio_porte">Bling / Omie / Tiny / Conta Azul / NF-e.io</SelectItem>
                          <SelectItem value="proprio">Sistema próprio</SelectItem>
                          <SelectItem value="planilha">Planilha / controle manual</SelectItem>
                          <SelectItem value="nenhum">Não usa sistema de gestão</SelectItem>
                        </SelectContent>
                      </Select>
                      {(data.erpSystem === "nenhum" || data.erpSystem === "planilha") && (
                        <Alert className="bg-red-50 border-red-200">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-xs text-red-700"><strong>Risco crítico:</strong> Sem sistema integrado, a emissão de NF-e com campos de IBS/CBS será inviável a partir de 2026. Este será o primeiro item do seu plano.</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Como a empresa emite documentos fiscais?</Label>
                      <RadioGroup value={data.nfeEmission} onValueChange={(v) => updateData("nfeEmission", v)} className="flex flex-col space-y-2">
                        <RadioRow field="nfeEmission" val="sistema_integrado" label="Sistema integrado automático" desc="O ERP emite a NF-e automaticamente." />
                        <RadioRow field="nfeEmission" val="emissor_gratuito" label="Emissor gratuito ou portal SEFAZ" desc="Emissão manual via site do estado." />
                        <RadioRow field="nfeEmission" val="contador" label="O contador faz tudo" desc="Delega toda a emissão ao escritório contábil." />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold">Documentos fiscais que a empresa emite</Label>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <CheckRow field="fiscalDocTypes" val="nfe" label="NF-e" desc="Nota Fiscal de mercadorias" />
                        <CheckRow field="fiscalDocTypes" val="nfse" label="NFS-e" desc="Nota Fiscal de serviços" />
                        <CheckRow field="fiscalDocTypes" val="nfce" label="NFC-e" desc="Cupom Fiscal Eletrônico (varejo)" />
                        <CheckRow field="fiscalDocTypes" val="cte" label="CT-e" desc="Conhecimento de Transporte" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">Volume médio mensal de documentos fiscais emitidos</Label>
                      <Select value={data.invoiceVolume} onValueChange={(v) => updateData("invoiceVolume", v)} data-testid="select-invoice-volume">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ate_50">Até 50 documentos/mês</SelectItem>
                          <SelectItem value="ate_100">50 a 100</SelectItem>
                          <SelectItem value="ate_500">100 a 500</SelectItem>
                          <SelectItem value="acima_500">Acima de 500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="font-bold">O sistema está integrado ao financeiro?</Label>
                        <RadioGroup value={data.erpIntegratedFinance} onValueChange={(v) => updateData("erpIntegratedFinance", v)} className="flex flex-col space-y-2">
                          <RadioRow field="erpIntegratedFinance" val="sim" label="Sim, totalmente integrado" />
                          <RadioRow field="erpIntegratedFinance" val="parcial" label="Parcialmente" />
                          <RadioRow field="erpIntegratedFinance" val="nao" label="Não, são sistemas separados" />
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold">O fornecedor do ERP já comunicou o plano para IBS/CBS?</Label>
                        <RadioGroup value={data.erpVendorReformPlan} onValueChange={(v) => updateData("erpVendorReformPlan", v)} className="flex flex-col space-y-2">
                          <RadioRow field="erpVendorReformPlan" val="sim_cronograma" label="Sim, com cronograma definido" />
                          <RadioRow field="erpVendorReformPlan" val="sim_sem_prazo" label="Falou, mas sem prazo concreto" />
                          <RadioRow field="erpVendorReformPlan" val="nao_sei" label="Ainda não perguntamos" />
                          <RadioRow field="erpVendorReformPlan" val="nao" label="Disse que ainda não tem previsão" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="font-bold">O cadastro de produtos/serviços está padronizado?</Label>
                        <RadioGroup value={data.catalogStandardized} onValueChange={(v) => updateData("catalogStandardized", v)} className="flex flex-col space-y-2">
                          <RadioRow field="catalogStandardized" val="sim" label="Sim, NCM/NBS correto em todos os itens" />
                          <RadioRow field="catalogStandardized" val="parcial" label="Parcialmente — alguns com problemas" />
                          <RadioRow field="catalogStandardized" val="nao" label="Não — cadastro desorganizado" />
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold">Existe responsável interno pelo cadastro fiscal?</Label>
                        <RadioGroup value={data.internalFiscalResponsible} onValueChange={(v) => updateData("internalFiscalResponsible", v)} className="flex flex-col space-y-2">
                          <RadioRow field="internalFiscalResponsible" val="sim" label="Sim, temos pessoa dedicada" />
                          <RadioRow field="internalFiscalResponsible" val="compartilhado" label="É compartilhado com outras funções" />
                          <RadioRow field="internalFiscalResponsible" val="nao" label="Não, depende do contador externo" />
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {screen === 6 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <Label className="font-bold">Principais meios de recebimento</Label>
                      <p className="text-xs text-muted-foreground">Selecione todos que a empresa utiliza. O Split Payment afetará PIX, cartão e boleto.</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <CheckRow field="paymentMethods" val="pix" label="PIX" desc="Liquidação imediata — Split Payment automático" />
                        <CheckRow field="paymentMethods" val="cartao_credito" label="Cartão de crédito" desc="Split Payment via adquirente" />
                        <CheckRow field="paymentMethods" val="cartao_debito" label="Cartão de débito" desc="Split Payment via adquirente" />
                        <CheckRow field="paymentMethods" val="boleto" label="Boleto bancário" desc="Split Payment no momento da compensação" />
                        <CheckRow field="paymentMethods" val="transferencia" label="Transferência bancária / TED" desc="Regra específica de Split Payment" />
                        <CheckRow field="paymentMethods" val="prazo_proprio" label="Venda a prazo / crediário próprio" desc="Regra de Split Payment a ser regulamentada" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Prazo médio de recebimento</Label>
                        <Select value={data.avgPaymentTerm} onValueChange={(v) => updateData("avgPaymentTerm", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a_vista">À vista (D+0 a D+2)</SelectItem>
                            <SelectItem value="ate_30">Até 30 dias</SelectItem>
                            <SelectItem value="30_60">30 a 60 dias</SelectItem>
                            <SelectItem value="acima_60">Acima de 60 dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Margem de lucro aproximada</Label>
                        <Select value={data.profitMargin} onValueChange={(v) => updateData("profitMargin", v)} data-testid="select-margin">
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
                        <AlertDescription className="text-xs text-red-700"><strong>Margem crítica:</strong> Com menos de 10%, qualquer variação de carga tributária pode comprometer a viabilidade. A revisão de preços será prioridade no plano.</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="font-bold">O capital de giro é apertado?</Label>
                        <RadioGroup value={data.tightWorkingCapital} onValueChange={(v) => updateData("tightWorkingCapital", v)} className="flex flex-col space-y-2">
                          <RadioRow field="tightWorkingCapital" val="sim" label="Sim, operamos no limite" desc="Alto risco com Split Payment — o imposto é retido antes do recebimento." highlight />
                          <RadioRow field="tightWorkingCapital" val="parcial" label="Às vezes — sazonalidade" />
                          <RadioRow field="tightWorkingCapital" val="nao" label="Não, temos folga de caixa" />
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold">A empresa consegue reajustar preços com facilidade?</Label>
                        <RadioGroup value={data.easePriceAdjustment} onValueChange={(v) => updateData("easePriceAdjustment", v)} className="flex flex-col space-y-2">
                          <RadioRow field="easePriceAdjustment" val="sim" label="Sim, ajustamos conforme necessário" />
                          <RadioRow field="easePriceAdjustment" val="parcial" label="Parcialmente — depende do cliente" />
                          <RadioRow field="easePriceAdjustment" val="dificil" label="Difícil — mercado muito sensível" desc="Elevações de carga serão absorvidas como redução de margem." />
                          <RadioRow field="easePriceAdjustment" val="impossivel" label="Impossível — contratos ou licitações fixos" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="font-bold">A empresa conhece a margem por produto/serviço?</Label>
                        <RadioGroup value={data.knowsMarginByProduct} onValueChange={(v) => updateData("knowsMarginByProduct", v)} className="flex flex-col space-y-2">
                          <RadioRow field="knowsMarginByProduct" val="sim" label="Sim, temos DRE por produto" />
                          <RadioRow field="knowsMarginByProduct" val="parcial" label="Parcialmente" />
                          <RadioRow field="knowsMarginByProduct" val="nao" label="Não — trabalhamos com margem global" desc="Impossível avaliar quais itens são inviabilizados pela reforma." />
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold">Já conhece o Split Payment?</Label>
                        <p className="text-xs text-muted-foreground">Mecanismo que retém o imposto no pagamento, antes do dinheiro chegar à sua conta.</p>
                        <RadioGroup value={data.splitPaymentAware} onValueChange={(v) => updateData("splitPaymentAware", v)} className="flex flex-col space-y-2">
                          <RadioRow field="splitPaymentAware" val="sim_entendo" label="Sim, entendemos e estamos nos preparando" />
                          <RadioRow field="splitPaymentAware" val="ouvi_falar" label="Já ouvi falar, mas não entendo bem" />
                          <RadioRow field="splitPaymentAware" val="nao" label="Não conhecemos ainda" desc="Será item urgente no seu plano de ação." />
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {screen === 7 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    {data.hasLongTermContracts === "sim" && (
                      <div className="space-y-3">
                        <Label className="font-bold">Os contratos de longo prazo têm cláusula de revisão por mudança tributária?</Label>
                        <p className="text-xs text-muted-foreground">A LC 214/2025, art. 378, permite revisão de contratos por desequilíbrio causado pela reforma.</p>
                        <RadioGroup value={data.priceRevisionClause} onValueChange={(v) => updateData("priceRevisionClause", v)} className="flex flex-col space-y-2">
                          <RadioRow field="priceRevisionClause" val="sim" label="Sim, os contratos já têm essa cláusula" />
                          <RadioRow field="priceRevisionClause" val="nao" label="Não têm — não foi prevista" desc="Risco crítico: empresa pode absorver toda a nova carga." highlight />
                          <RadioRow field="priceRevisionClause" val="nao_sei" label="Não analisamos ainda" desc="Falta de análise já é um risco a ser corrigido." />
                        </RadioGroup>
                        {data.priceRevisionClause === "nao" && (
                          <Alert className="bg-red-50 border-red-200">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-xs text-red-700"><strong>Risco crítico:</strong> Revisão urgente com advogado especializado — este será o primeiro item do seu plano.</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label className="font-bold">Quem cuida do fiscal e tributário hoje?</Label>
                      <Select value={data.taxResponsible} onValueChange={(v) => updateData("taxResponsible", v)} data-testid="select-tax-responsible">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contador_externo">Escritório de contabilidade externo</SelectItem>
                          <SelectItem value="contador_interno">Contador ou analista fiscal interno</SelectItem>
                          <SelectItem value="dono">O próprio dono ou sócio</SelectItem>
                          <SelectItem value="ninguem">Ninguém — esta reforma será o ponto de partida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="font-bold">Há responsável interno pelo ERP/sistema?</Label>
                        <RadioGroup value={data.internalERPResponsible} onValueChange={(v) => updateData("internalERPResponsible", v)} className="flex flex-col space-y-2">
                          <RadioRow field="internalERPResponsible" val="sim" label="Sim, temos responsável de TI/sistemas" />
                          <RadioRow field="internalERPResponsible" val="compartilhado" label="É compartilhado com outras funções" />
                          <RadioRow field="internalERPResponsible" val="nao" label="Não há responsável interno" />
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold">A diretoria acompanha o tema reforma tributária?</Label>
                        <RadioGroup value={data.managementAwareOfReform} onValueChange={(v) => updateData("managementAwareOfReform", v)} className="flex flex-col space-y-2">
                          <RadioRow field="managementAwareOfReform" val="sim" label="Sim, está acompanhando ativamente" />
                          <RadioRow field="managementAwareOfReform" val="parcialmente" label="Conhece superficialmente" />
                          <RadioRow field="managementAwareOfReform" val="nao" label="Não acompanha" desc="Sem engajamento da liderança, a adaptação fica sem prioridade." />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="font-bold">A empresa já iniciou preparação para a reforma?</Label>
                        <RadioGroup value={data.preparationStarted} onValueChange={(v) => updateData("preparationStarted", v)} className="flex flex-col space-y-2">
                          <RadioRow field="preparationStarted" val="sim_avancado" label="Sim, estamos bem avançados" />
                          <RadioRow field="preparationStarted" val="sim_inicial" label="Iniciamos, mas ainda no começo" />
                          <RadioRow field="preparationStarted" val="nao" label="Ainda não iniciamos" desc="Com 2026 próximo, o tempo é um fator de risco." />
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold">Já houve algum treinamento interno sobre a reforma?</Label>
                        <RadioGroup value={data.hadInternalTraining} onValueChange={(v) => updateData("hadInternalTraining", v)} className="flex flex-col space-y-2">
                          <RadioRow field="hadInternalTraining" val="sim_completo" label="Sim, equipe treinada" />
                          <RadioRow field="hadInternalTraining" val="sim_parcial" label="Parcialmente — alguns colaboradores" />
                          <RadioRow field="hadInternalTraining" val="nao" label="Não houve treinamento ainda" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Como avalia a maturidade atual da empresa?</Label>
                        <Select value={data.selfAssessedMaturity} onValueChange={(v) => updateData("selfAssessedMaturity", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alta">Alta — processos organizados e equipe preparada</SelectItem>
                            <SelectItem value="media">Média — organização razoável, melhorias necessárias</SelectItem>
                            <SelectItem value="baixa">Baixa — muita coisa ainda informal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Qual é a maior preocupação com a reforma?</Label>
                        <Select value={data.mainConcern} onValueChange={(v) => updateData("mainConcern", v)} data-testid="select-concern">
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="custos">Aumento dos custos e da carga tributária</SelectItem>
                            <SelectItem value="preco">Impacto nos preços e na competitividade</SelectItem>
                            <SelectItem value="sistemas">Adequação dos sistemas e notas fiscais</SelectItem>
                            <SelectItem value="caixa">Impacto no fluxo de caixa (Split Payment)</SelectItem>
                            <SelectItem value="fornecedores">Adequação dos fornecedores</SelectItem>
                            <SelectItem value="contratos">Revisão de contratos</SelectItem>
                            <SelectItem value="desconhecimento">Não sei por onde começar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <div className="px-6 md:px-8 py-5 border-t flex justify-between items-center">
                <Button variant="outline" onClick={handleBack} disabled={saving} className="gap-2" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4" />{screen === 1 ? "Apresentação" : "Voltar"}
                </Button>
                <Button onClick={handleNext} disabled={saving} className="gap-2" data-testid="button-next">
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Analisando...</> : screen === INPUT_SCREENS ? <><BarChart3 className="h-4 w-4" /> Gerar Diagnóstico</> : <>Continuar <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </div>
            </Card>
          )}

          {screen === 8 && diagnosis && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-2">Diagnóstico Consolidado</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight" data-testid="text-diagnosis-title">{data.companyName}</h1>
                  <p className="text-muted-foreground text-sm mt-1">Análise com base em EC 132/2023, LC 214/2025 e LC 227/2026</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleNewPlan} className="gap-1 shrink-0" data-testid="button-new-diagnosis">
                  <RefreshCw className="h-3.5 w-3.5" /><span className="hidden sm:inline">Novo diagnóstico</span>
                </Button>
              </div>

              <Card className={`border-2 ${getRiskLabel(diagnosis.overallScore).color}`}>
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Score de Prontidão Operacional</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-5xl font-bold" data-testid="text-risk-score">{diagnosis.overallScore}</span>
                        <span className="text-muted-foreground text-sm">/100</span>
                        <Badge className={`ml-2 text-sm px-3 py-0.5 ${getRiskLabel(diagnosis.overallScore).color}`} data-testid="text-risk-label">{getRiskLabel(diagnosis.overallScore).label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Quanto maior, maior o risco de impacto sem adaptação</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground mb-1">Pontos de atenção</p>
                      <p className="text-3xl font-bold">{diagnosis.allItems.length}</p>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-white/50 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${diagnosis.overallScore >= 70 ? "bg-red-600" : diagnosis.overallScore >= 45 ? "bg-orange-500" : diagnosis.overallScore >= 20 ? "bg-amber-500" : "bg-green-600"}`} style={{ width: `${diagnosis.overallScore}%` }} />
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Diagnóstico por Eixo</h2>
                <div className="space-y-3">
                  {diagnosis.axes.map((ax) => (
                    <Card key={ax.id} className="border">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-1.5 bg-primary/10 rounded-lg shrink-0"><ax.icon className="h-4 w-4 text-primary" /></div>
                          <span className="font-bold text-sm flex-1">{ax.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${ax.score >= 60 ? "border-red-300 text-red-700" : ax.score >= 30 ? "border-amber-300 text-amber-700" : "border-green-300 text-green-700"}`}>{ax.score}/100</Badge>
                            <span className={`text-xs font-medium ${ax.score >= 60 ? "text-red-600" : ax.score >= 30 ? "text-amber-600" : "text-green-600"}`}>{ax.score >= 60 ? "Alto risco" : ax.score >= 30 ? "Moderado" : "Controlado"}</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden ml-9">
                          <div className={`h-full rounded-full transition-all duration-700 ${ax.score >= 60 ? "bg-red-500" : ax.score >= 30 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${ax.score}%` }} />
                        </div>
                        {ax.items.length > 0 && (
                          <div className="mt-2 ml-9 flex flex-wrap gap-1">
                            {ax.items.map((item, i) => (
                              <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.level === "critico" ? "bg-red-100 text-red-700" : item.level === "alto" ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-700"}`}>{item.title}</span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {diagnosis.allItems.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-red-600 shrink-0" /><span className="font-bold text-sm text-red-800">Maior Risco</span></div>
                      <p className="text-sm font-bold text-red-900">{diagnosis.allItems[0].title}</p>
                      <p className="text-xs text-red-700 mt-1">{diagnosis.allItems[0].action}</p>
                    </CardContent>
                  </Card>
                )}
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-2"><Zap className="h-4 w-4 text-amber-600 shrink-0" /><span className="font-bold text-sm text-amber-800">Maior Urgência</span></div>
                    <p className="text-sm font-bold text-amber-900">{plan.filter(p => p.priority === "urgente")[0]?.title || plan[0]?.title || "Contatar fornecedor do ERP"}</p>
                    <p className="text-xs text-amber-700 mt-1">Prazo: {plan.filter(p => p.priority === "urgente")[0]?.prazo || "7 dias"}</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-green-600 shrink-0" /><span className="font-bold text-sm text-green-800">Maior Oportunidade</span></div>
                    <p className="text-xs text-green-700">{diagnosis.topOpportunity}</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-2"><Target className="h-4 w-4 text-blue-600 shrink-0" /><span className="font-bold text-sm text-blue-800">Nível de Prontidão</span></div>
                    <p className="text-sm font-bold text-blue-900">{getRiskLabel(diagnosis.overallScore).label} ({diagnosis.overallScore}/100)</p>
                    <p className="text-xs text-blue-700 mt-1">{diagnosis.overallScore < 20 ? "Empresa bem preparada. Continue o monitoramento." : diagnosis.overallScore < 45 ? "Riscos moderados. O plano de ação ajudará." : diagnosis.overallScore < 70 ? "Riscos relevantes. Ação imediata necessária." : "Exposição crítica. Iniciar adaptação hoje."}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Todos os Pontos de Atenção</h2>
                <div className="space-y-3">
                  {diagnosis.allItems.length === 0 ? (
                    <Card className="border-green-200 bg-green-50"><CardContent className="pt-5 flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" /><div><p className="font-bold text-green-800">Perfil de risco controlado</p><p className="text-sm text-green-700 mt-1">Não identificamos riscos críticos ou altos com base nas informações fornecidas.</p></div></CardContent></Card>
                  ) : (
                    diagnosis.allItems.map((item, idx) => (
                      <Card key={idx} className={`border-l-4 ${item.level === "critico" ? "border-l-red-500" : item.level === "alto" ? "border-l-orange-500" : "border-l-amber-400"}`} data-testid={`card-risk-${idx}`}>
                        <CardContent className="pt-4 pb-3">
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-lg shrink-0 ${item.level === "critico" ? "bg-red-100" : item.level === "alto" ? "bg-orange-100" : "bg-amber-100"}`}>
                              <AlertTriangle className={`h-4 w-4 ${item.level === "critico" ? "text-red-600" : item.level === "alto" ? "text-orange-600" : "text-amber-600"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-bold text-sm">{item.title}</span>
                                <Badge variant="outline" className={`text-[10px] ${item.level === "critico" ? "border-red-300 text-red-700" : item.level === "alto" ? "border-orange-300 text-orange-700" : "border-amber-300 text-amber-700"}`}>{item.level.charAt(0).toUpperCase() + item.level.slice(1)}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                              <div className="mt-2 p-2 bg-primary/5 rounded text-xs font-medium text-primary border border-primary/10">→ {item.action}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleBack} className="gap-2"><ArrowLeft className="h-4 w-4" />Refazer perguntas</Button>
                <Button onClick={handleNext} className="gap-2" data-testid="button-to-plan">Ver Plano de Ação <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {screen === 9 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <Badge className="mb-2">Plano de Ação Personalizado</Badge>
                <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight" data-testid="text-plan-title">Plano de Ação — {data.companyName}</h1>
                <p className="text-muted-foreground mt-1 text-sm">Ações selecionadas com base no seu diagnóstico. Clique no status para atualizar o progresso de cada item.</p>
              </div>

              {criticalCount > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm text-red-800"><strong>Atenção prioritária:</strong> Seu diagnóstico identificou {criticalCount} risco(s) crítico(s). As ações marcadas como "Urgente" devem ser iniciadas nos próximos 3 dias.</AlertDescription>
                </Alert>
              )}

              {[
                { phase: 1, title: "Fase 1: O Essencial", subtitle: criticalCount > 0 ? `Primeiros 7 dias — ${criticalCount} risco(s) crítico(s) a resolver` : "Primeiros 7 dias — base para toda a transição", color: "bg-red-600", actions: phase1Actions },
                { phase: 2, title: "Fase 2: Organização", subtitle: "Até 30 dias — padronizar processos e dados fiscais", color: "bg-amber-500", actions: phase2Actions },
                { phase: 3, title: "Fase 3: Validação", subtitle: "Até 51 dias — testar sistemas e validar com contador", color: "bg-primary", actions: phase3Actions },
              ].map((phaseData) => (
                <div key={phaseData.phase}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm text-white ${phaseData.color}`}>{phaseData.phase}</div>
                    <div><h2 className="text-lg font-bold font-heading">{phaseData.title}</h2><p className="text-xs text-muted-foreground">{phaseData.subtitle}</p></div>
                  </div>
                  <div className="space-y-3 ml-11">
                    {phaseData.actions.map((action) => {
                      const status = taskStatuses[action.id] || "pendente";
                      const StatusIcon = statusConfig[status].icon;
                      return (
                        <Card key={action.id} className={`transition-all ${status === "concluida" ? "opacity-60" : ""}`} data-testid={`card-task-${action.id}`}>
                          <CardContent className="pt-4 pb-3">
                            <div className="flex items-start gap-3">
                              <button onClick={() => cycleStatus(action.id)} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border shrink-0 transition-all ${statusConfig[status].cls}`} data-testid={`status-${action.id}`}>
                                <StatusIcon className="h-3 w-3" />{statusConfig[status].label}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className={`font-bold text-sm ${status === "concluida" ? "line-through text-muted-foreground" : ""}`}>{action.title}</span>
                                  <Badge variant="outline" className={`text-[10px] ${priorityConfig[action.priority].cls}`}>{priorityConfig[action.priority].label}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{action.motivo}</p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{action.prazo}</span>
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" />{action.responsavel}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleBack} className="gap-2"><ArrowLeft className="h-4 w-4" />Diagnóstico</Button>
                <Button onClick={handleNext} className="gap-2" data-testid="button-to-report">Gerar Relatório Final <FileText className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {screen === 10 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mx-auto mb-3"><CheckCircle2 className="h-7 w-7 text-green-600" /></div>
                <Badge className="bg-green-600 hover:bg-green-600">Jornada Concluída</Badge>
                <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight" data-testid="text-report-title">Relatório Final Disponível</h1>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">Diagnóstico e plano de ação consolidados. Baixe o PDF para compartilhar com seu contador, equipe ou consultores.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="sm:col-span-2">
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Empresa Analisada</p>
                    <p className="text-xl font-bold">{data.companyName}</p>
                    {data.nomeFantasia && <p className="text-sm text-muted-foreground">"{data.nomeFantasia}"</p>}
                    {data.cnpj && <p className="text-sm text-muted-foreground font-mono">CNPJ: {data.cnpj}</p>}
                    {(data.municipio || data.estado) && <p className="text-sm text-muted-foreground">{[data.municipio, data.estado].filter(Boolean).join(" — ")}</p>}
                    {data.contactName && <p className="text-sm text-muted-foreground">Responsável: {data.contactName}{data.contactRole ? ` (${data.contactRole})` : ""}</p>}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        data.sector === "industria" ? "Indústria" : data.sector === "atacado" ? "Atacado" : data.sector === "varejo" ? "Varejo" : data.sector === "servicos" ? "Serviços" : data.sector === "agronegocio" ? "Agronegócio" : "Outros",
                        data.regime === "simples" ? "Simples Nacional" : data.regime === "lucro_presumido" ? "Lucro Presumido" : "Lucro Real",
                        data.operations === "b2b" ? "B2B" : data.operations === "b2c" ? "B2C" : "B2B + B2C",
                        data.employeeCount === "1_10" ? "1–10 colaboradores" : data.employeeCount === "11_50" ? "11–50" : data.employeeCount === "51_200" ? "51–200" : "200+",
                      ].map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
                {diagnosis && (
                  <Card className={`border-2 ${getRiskLabel(diagnosis.overallScore).color}`}>
                    <CardContent className="pt-5 pb-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Nível de Risco</p>
                      <p className="text-4xl font-bold" data-testid="text-report-score">{diagnosis.overallScore}<span className="text-lg font-normal">/100</span></p>
                      <Badge className={`mt-2 ${getRiskLabel(diagnosis.overallScore).color}`}>{getRiskLabel(diagnosis.overallScore).label}</Badge>
                      <p className="text-xs text-muted-foreground mt-3">{diagnosis.allItems.length} ponto(s) de atenção</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {diagnosis && diagnosis.axes && (
                <div>
                  <h2 className="text-lg font-bold font-heading mb-3">Diagnóstico por Eixo</h2>
                  <div className="grid sm:grid-cols-5 gap-2">
                    {diagnosis.axes.map((ax) => (
                      <div key={ax.id} className="text-center p-3 rounded-lg border bg-muted/20">
                        <div className={`text-lg font-bold ${ax.score >= 60 ? "text-red-600" : ax.score >= 30 ? "text-amber-600" : "text-green-600"}`}>{ax.score}</div>
                        <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{ax.name}</div>
                        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${ax.score >= 60 ? "bg-red-500" : ax.score >= 30 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${ax.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diagnosis && diagnosis.allItems.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold font-heading mb-3">Riscos Identificados</h2>
                  <div className="space-y-2">
                    {diagnosis.allItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-lg border" data-testid={`report-risk-${idx}`}>
                        <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${item.level === "critico" ? "text-red-600" : item.level === "alto" ? "text-orange-500" : "text-amber-500"}`} />
                        <div><span className="text-sm font-bold block">{item.title}</span><span className="text-xs text-muted-foreground">{item.action}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold font-heading mb-3">Resumo do Plano de Ação ({plan.length} ações)</h2>
                <div className="space-y-2">
                  {plan.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-lg border bg-muted/10">
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${priorityConfig[action.priority].cls}`}>{priorityConfig[action.priority].label}</Badge>
                      <div><span className="text-sm font-bold block">{action.title}</span><span className="text-xs text-muted-foreground">{action.prazo} · {action.responsavel}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6 pb-5 text-center">
                  <Download className="h-8 w-8 mx-auto mb-3 opacity-90" />
                  <p className="font-bold text-lg mb-1">Baixar Relatório Completo em PDF</p>
                  <p className="text-sm opacity-80 mb-4">Inclui identificação da empresa, diagnóstico por eixo, riscos, oportunidades, plano de ação e checklist final.</p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="gap-2"
                    data-testid="button-download-pdf"
                    onClick={() => {
                      if (diagnosis) generateActionPlanPdf(data as any, diagnosis, plan);
                    }}
                  >
                    <Download className="h-5 w-5" /> Gerar e Baixar PDF
                  </Button>
                </CardContent>
              </Card>

              <Alert className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-xs text-amber-700">
                  <strong>Aviso legal:</strong> Este diagnóstico é baseado nas informações fornecidas e nas normas EC 132/2023, LC 214/2025 e LC 227/2026. Não substitui consultoria tributária e jurídica especializada. As alíquotas definitivas serão publicadas pelo Comitê Gestor do IBS.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" className="gap-2" onClick={() => navigate("/inicio")}><Home className="h-4 w-4" />Voltar ao Hub</Button>
                <Button variant="outline" className="gap-2" onClick={() => navigate("/plano-de-acao/meus-planos")}>Ver todos os diagnósticos</Button>
                <Button className="gap-2 sm:ml-auto" onClick={handleNewPlan}><RefreshCw className="h-4 w-4" />Novo Diagnóstico</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
