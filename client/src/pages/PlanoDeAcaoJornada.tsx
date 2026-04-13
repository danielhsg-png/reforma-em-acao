import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PLAN_EXPLANATIONS } from "@/lib/planExplanations";
import {
  ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle,
  Loader2, FileText, Target, ShieldAlert, TrendingDown,
  Download, ChevronRight, Info, BarChart3, Home, RefreshCw, 
  Package, Users, LayoutGrid, Zap, TrendingUp, Clock, User,
  FileCheck, BookOpen, ShieldCheck, AlertCircle, ChevronDown
} from "lucide-react";
import { MaskedInput } from "@/components/core/MaskedInput";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { generateActionPlanPdf } from "@/lib/generatePdf";
import { reformaArticles, CATEGORY_CONFIG, type ReformaArticle } from "@/lib/reformaContent";
import {
  getRiskLabelConfig,
  getReadinessLevel,
  generateConclusionText,
  READINESS_CONFIG,
  type AxisScore,
  type DiagnosisResult,
  type PlanAction,
} from "@/lib/riskConfig";
import MainLayout from "@/components/layout/MainLayout";

// Alias para backward-compat com chamadas existentes no componente
const getRiskLabel = getRiskLabelConfig;

const INPUT_SCREENS = 6;

const SCREEN_LABELS = [
  "Apresentação",
  "Cadastro da Empresa",
  "Perfil e Operação",
  "Como a Empresa Compra",
  "Sistemas e Emissão",
  "Financeiro e Caixa",
  "Governança",
  "Diagnóstico",
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

function normalizeStr(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function computeReadiness(data: any): DiagnosisResult {
  const isB2B = data.operations === "b2b" || data.operations === "b2b_b2c";
  const isB2C = data.operations === "b2c" || data.operations === "b2b_b2c";
  const isMultiState = data.geographicScope === "nacional";
  const hasNoERP = !data.erpSystem || data.erpSystem === "nenhum" || data.erpSystem === "planilha";
  const neverPrepared = data.preparationStarted === "nao" && data.hadInternalTraining === "nao";

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
  const isMultiState = data.geographicScope === "nacional" || data.salesStates.includes("national");

  // ─── FASE 1: AÇÕES IMEDIATAS (7 a 15 dias) ────────────────────────────

  if (data.taxResponsible === "ninguem") {
    actions.push({ id: "define_responsible", phase: 1, priority: "urgente", eixo: "Governança / Sistemas", title: "Definir responsável pelo tema fiscal/tributário", desc: "Escolha uma pessoa interna ou escritório contábil com mandato claro para coordenar a adaptação à reforma. Documente o responsável por escrito com lista de entregas.", motivo: "Sem um ponto focal, as adaptações não terão dono. Tudo se atrasa e os riscos se acumulam sem controle.", prazo: "7 a 15 dias", responsavel: "Diretoria / Sócios", source: "Responsável fiscal: nenhum designado", confianca: "vermelho" });
  }

  if (hasNoERP) {
    actions.push({ id: "erp_adoption", phase: 1, priority: "urgente", eixo: "Fiscal / Documental", title: "Contratar sistema de gestão (ERP) com suporte a IBS/CBS", desc: "Pesquise e contrate sistema com roadmap publicado para reforma tributária: Bling, Omie, Conta Azul, Tiny, TOTVS ou equivalente. Exija cronograma de atualização por escrito antes de assinar.", motivo: "A adaptação ao novo modelo exige revisão do ERP, da emissão fiscal e dos cadastros. Processos muito manuais ou sem integração elevam bastante o risco operacional e dificultam o cumprimento das novas exigências.", prazo: "7 a 15 dias", responsavel: "Diretoria / TI", source: `ERP informado: "${data.erpSystem === "nenhum" ? "Nenhum" : "Planilhas / Controle manual"}"`, confianca: "vermelho" });
  }

  actions.push({ id: "erp_contact", phase: 1, priority: hasNoERP ? "alta" : "urgente", eixo: "Fiscal / Documental", title: "Exigir cronograma técnico do fornecedor do sistema", desc: "Envie e-mail formal ao suporte do ERP pedindo: (1) prazo de atualização, (2) versão compatível com IBS/CBS, (3) suporte aos novos layouts de NF-e/documentos fiscais eletrônicos para a reforma. Documente a resposta.", motivo: "Sem confirmação escrita do plano de adaptação, a empresa depende de uma atualização que pode não chegar a tempo para 2026.", prazo: "7 a 15 dias", responsavel: "TI / Responsável de sistemas", source: "Obrigação técnica para todos os emissores de NF", confianca: "verde" });

  actions.push({ id: "top30_items", phase: 1, priority: "alta", eixo: "Fiscal / Documental", title: "Mapear os 30 produtos/serviços com maior faturamento", desc: "Use o relatório de vendas dos últimos 6 meses. Para cada item, registre: código, descrição, NCM/NBS atual e faturamento mensal. Esta lista alimenta todas as simulações de preço.", motivo: "O impacto da reforma é calculado item a item. Sem essa lista priorizada, nenhuma simulação é possível.", prazo: "7 a 15 dias", responsavel: "Comercial / Fiscal", source: "Ação base para todos os perfis — setor: " + (data.sector || "não informado"), confianca: "verde" });

  if (hasContracts && (data.priceRevisionClause === "nao" || data.priceRevisionClause === "nao_sei")) {
    actions.push({ id: "contracts_review", phase: 1, priority: "urgente", eixo: "Comercial / Contratos", title: "Revisar contratos de longo prazo com assessoria jurídica", desc: "Liste todos os contratos acima de 12 meses. Para cada um, identifique se há cláusula de revisão ou reequilíbrio por mudança tributária. Se não houver, avalie com o advogado a possibilidade de incluir aditivo contratual.", motivo: "Contratos sem cláusula de revisão tributária podem obrigar a empresa a absorver sozinha toda a nova carga sem possibilidade de repasse.", prazo: "7 a 15 dias", responsavel: "Jurídico / Contador", source: `Contratos longo prazo: Sim · Cláusula tributária: ${data.priceRevisionClause === "nao" ? "Não" : "Não sabe"}`, confianca: "vermelho" });
  }

  if (data.managementAwareOfReform === "nao") {
    actions.push({ id: "mgmt_briefing", phase: 1, priority: "alta", eixo: "Governança / Sistemas", title: "Apresentar briefing executivo à diretoria sobre a reforma", desc: "Prepare apresentação de 15 minutos com: (1) o que muda, (2) impacto estimado na margem, (3) cronograma crítico, (4) investimentos necessários.", motivo: "Sem engajamento da liderança, as decisões estratégicas e os recursos necessários não serão priorizados.", prazo: "7 a 15 dias", responsavel: "Contador / Responsável fiscal", source: "Diretoria ciente da reforma: Não", confianca: "vermelho" });
  }

  if (data.hasRegularNF === "nao") {
    actions.push({ id: "nf_formal", phase: 1, priority: "urgente", eixo: "Compras / Créditos", title: "Formalizar exigência de documentação fiscal em todas as compras", desc: "Notifique todos os fornecedores por escrito que a emissão de nota fiscal será obrigatória a partir de agora. Suspenda pedidos de fornecedores que se recusarem.", motivo: "Aquisições sem documentação fiscal adequada tendem a impedir o aproveitamento regular de créditos de IBS/CBS e elevam o custo tributário da operação. A formalização das compras é condição para participar do regime não-cumulativo.", prazo: "7 a 15 dias", responsavel: "Compras / Financeiro", source: "Fornecedores com NF regular: Não", confianca: "vermelho" });
  }

  // ─── FASE 2: AÇÕES DE CURTO PRAZO (30 a 60 dias) ──────────────────────

  actions.push({ id: "governance_setup", phase: 2, priority: "alta", eixo: "Governança / Sistemas", title: "Organizar governança mínima para a reforma tributária", desc: "Defina: (1) responsável por eixo (fiscal, compras, comercial, financeiro), (2) frequência de reunião (quinzenal), (3) checklist de controle mensal.", motivo: "A reforma exige adaptação em múltiplas frentes simultaneamente. Sem coordenação, os times trabalham em silos.", prazo: "30 a 60 dias", responsavel: "Diretoria / Gestor de área", source: "Ação estruturante para todos os perfis", confianca: "verde" });

  actions.push({ id: "catalog_std", phase: 2, priority: "alta", eixo: "Fiscal / Documental", title: "Padronizar cadastro dos 30 principais itens com NCM/NBS", desc: "Para cada item da lista da Fase 1, valide: código único, descrição padronizada, NCM (mercadorias) ou NBS (serviços) correto, e regime tributário. Valide com contador.", motivo: "Cada item deve ter NCM/NBS correto para que o IBS/CBS seja calculado na alíquota certa. Erro de cadastro = alíquota errada.", prazo: "30 a 60 dias", responsavel: "Fiscal / TI", source: `Cadastro padronizado: ${data.catalogStandardized === "sim" ? "Sim (manutenção)" : "Não — ação obrigatória"}`, confianca: data.catalogStandardized === "nao" ? "vermelho" : "verde" });

  actions.push({ id: "supplier_abc", phase: 2, priority: "alta", eixo: "Compras / Créditos", title: "Mapear e classificar os 20 fornecedores mais relevantes", desc: "Classifique em: A (regime regular e documentação adequada — maior potencial de transferência de crédito de IBS/CBS), B (crédito potencialmente limitado ou dependente da sistemática aplicável), C (documentação inadequada ou forte restrição de creditamento). Calcule o impacto estimado por classe com seu contador.", motivo: "O aproveitamento de créditos de IBS/CBS nas compras depende do regime tributário e da qualidade da documentação dos fornecedores. Esse diagnóstico afeta diretamente a margem e a competitividade.", prazo: "30 a 60 dias", responsavel: "Compras / Fiscal", source: `Fornecedores do Simples: ${data.simplesSupplierPercent || "não informado"} · Total: ${data.supplierCount || "não informado"}`, confianca: "amarelo" });

  actions.push({ id: "fiscal_routine", phase: 2, priority: "media", eixo: "Fiscal / Documental", title: "Estruturar rotina de conferência fiscal semanal", desc: "Reserve 1 hora semanal com o responsável fiscal para revisar: NFs emitidas e recebidas, erros de cadastro, créditos potenciais e obrigações pendentes.", motivo: "Erros fiscais descobertos após o fechamento custam mais caro. A rotina semanal evita acúmulo de problemas.", prazo: "30 a 60 dias", responsavel: "Fiscal / Contador", source: "Rotina de conformidade fiscal preventiva", confianca: "verde" });

  if (data.hasNFErrors === "frequente") {
    actions.push({ id: "supplier_nf_quality", phase: 2, priority: "alta", eixo: "Compras / Créditos", title: "Programa de qualidade de NF com fornecedores", desc: "Notifique formalmente os 5 fornecedores com mais erros. Estabeleça SLA: 90 dias para adequação. Forneça checklist com os campos críticos para IBS/CBS.", motivo: "Cada NF com erro é crédito de IBS/CBS comprometido — os erros de hoje viram perda financeira permanente em 2026.", prazo: "30 a 60 dias", responsavel: "Compras / Fiscal", source: "Erros em NFs recebidas: Frequente", confianca: "vermelho" });
  }

  if (data.hasExports === "sim") {
    actions.push({ id: "export_rules", phase: 2, priority: "media", eixo: "Compras / Créditos", title: "Verificar imunidade e ressarcimento de créditos de exportação", desc: "Confirme com o contador: (1) quais operações têm imunidade total de IBS/CBS, (2) como solicitar ressarcimento de créditos acumulados, (3) prazo de retorno.", motivo: "Exportações têm imunidade do IBS/CBS e créditos ressarcíveis. Isso pode melhorar o caixa — mas exige processo formal.", prazo: "30 a 60 dias", responsavel: "Fiscal / Contador", source: "Exportações: Sim — imunidade IBS/CBS identificada", confianca: "verde" });
  }

  if (data.hasGovernmentContracts === "sim") {
    actions.push({ id: "gov_contracts", phase: 2, priority: "alta", eixo: "Comercial / Contratos", title: "Analisar contratos públicos para revisão de equilíbrio", desc: "Para cada contrato com órgão público, verifique: (1) cláusula de equilíbrio econômico-financeiro, (2) possibilidade de pedido de revisão por mudança tributária, (3) prazo para protocolo.", motivo: "A nova carga pode romper o equilíbrio de contratos licitatórios. O pedido de revisão precisa ser protocolado dentro do prazo.", prazo: "30 a 60 dias", responsavel: "Jurídico", source: "Contratos com órgãos públicos: Sim", confianca: "verde" });
  }

  if (isSimples && isB2B) {
    actions.push({ id: "simples_option", phase: 1, priority: "urgente", eixo: "Compras / Créditos", title: "Decisão imediata: optar pelo recolhimento regular de IBS/CBS", desc: "Empresas do Simples Nacional que vendem para outras empresas (B2B) precisam decidir com urgência se optam pelo recolhimento de IBS/CBS pelo regime regular. Essa opção permite que seus clientes aproveitem crédito pleno — sem ela, seus preços ficam menos competitivos. Consulte seu contador ou advogado tributarista agora.", motivo: "Em 2026, seus clientes B2B já apuram créditos de IBS/CBS. Cada mês sem essa decisão representa risco comercial concreto.", prazo: "Imediato — 2026", responsavel: "Sócio / Contador / Advogado tributarista", source: "Regime: Simples Nacional · Operação: B2B", confianca: "vermelho" });
  }

  if (data.knowsMarginByProduct === "nao") {
    actions.push({ id: "margin_calc", phase: 2, priority: "alta", eixo: "Financeiro / Caixa", title: "Calcular margem líquida por produto/serviço principal", desc: "Monte DRE simplificada por produto: Receita − Custos diretos (insumos, NF, frete) − % rateio indireto = Margem líquida. Identifique quais itens têm margem negativa ou inferior a 5%.", motivo: "Sem saber a margem por item, é impossível identificar quais produtos serão inviabilizados pela nova carga tributária.", prazo: "30 a 60 dias", responsavel: "Financeiro / Comercial", source: "Margem por produto/serviço: Não mapeada", confianca: "vermelho" });
  }

  if (isMultiState) {
    actions.push({ id: "multistate_erp", phase: 2, priority: "alta", eixo: "Fiscal / Documental", title: "Validar cálculo de IBS por estado/município de destino no ERP", desc: "Com o fornecedor do sistema, confirme se o ERP consegue: (1) identificar o estado e município do comprador, (2) aplicar o componente de IBS correto por destino, (3) separar os débitos por Comitê Gestor conforme exigido.", motivo: "O IBS depende do destino da operação e envolve componente estadual e municipal. Isso exige parametrização correta no sistema — sem suporte adequado do ERP, as notas podem ser emitidas com parâmetros incorretos.", prazo: "30 a 60 dias", responsavel: "TI / Fiscal", source: "Abrangência geográfica: Nacional / múltiplos estados", confianca: "verde" });
  }

  // ─── FASE 3: AÇÕES ESTRUTURANTES (60 a 120 dias + acompanhamento) ─────

  actions.push({ id: "pricing_formula", phase: 3, priority: "alta", eixo: "Comercial / Contratos", title: "Recalcular política de precificação para 2026", desc: `Fórmula base: Custo + Margem desejada = Preço Líquido. Preço Líquido ÷ (1 − alíquota efetiva) = Preço Bruto. ${isB2B ? "Para B2B: destaque o crédito gerado como argumento comercial." : "Para B2C: comunique mudança de preço com antecedência mínima de 60 dias."}`, motivo: "A precificação para 2026 deve ser feita com a nova alíquota incorporada. Usar a fórmula antiga resulta em margem menor do que o planejado.", prazo: "60 a 120 dias", responsavel: "Comercial / Financeiro", source: `Aplicável a todos · Operação: ${isB2B && isB2C ? "B2B + B2C" : isB2B ? "B2B" : "B2C"}`, confianca: "verde" });

  if (data.tightWorkingCapital === "sim" || data.splitPaymentAware === "nao") {
    actions.push({ id: "split_simulation", phase: 3, priority: "urgente", eixo: "Financeiro / Caixa", title: "Simular impacto do Split Payment no fluxo de caixa", desc: "Para cada meio de pagamento usado (PIX, cartão, boleto): projete quanto pode ser retido mensalmente, quando você receberá o saldo, e qual capital de giro adicional precisará ter disponível. Acompanhe a regulamentação com seu contador.", motivo: "A sistemática de split payment pode reduzir o valor financeiro imediatamente disponível em determinadas operações, exigindo atenção redobrada ao caixa e ao capital de giro — especialmente em empresas que operam com reservas limitadas.", prazo: "60 a 120 dias", responsavel: "Financeiro / CFO", source: `Capital de giro apertado: ${data.tightWorkingCapital === "sim" ? "Sim" : "—"} · Split Payment: ${data.splitPaymentAware === "nao" ? "Não conhecido" : "Conhecimento parcial"}`, confianca: "amarelo" });
  }

  actions.push({ id: "nfe_test", phase: 3, priority: "alta", eixo: "Fiscal / Documental", title: "Testar emissão de NF-e com novos layouts em homologação", desc: "No ambiente de homologação da SEFAZ, emita NF-e de teste com os novos grupos e campos de IBS/CBS previstos na documentação técnica vigente (confira com o fornecedor do ERP quais layouts já estão disponíveis). Registre erros e corrija antes da virada.", motivo: "A NF-e passará a exigir campos obrigatórios de IBS/CBS. Falhas na emissão em produção causam paralisação operacional.", prazo: "60 a 120 dias", responsavel: "TI / Fiscal", source: "Obrigação técnica fiscal para todos os emissores", confianca: "verde" });

  if (data.hadInternalTraining === "nao") {
    actions.push({ id: "team_training", phase: 3, priority: "media", eixo: "Governança / Sistemas", title: "Treinar equipes fiscal, comercial e financeira", desc: "Módulos sugeridos: (1) Fiscal: novos campos NF-e e IBS/CBS; (2) Comercial: créditos de clientes e nova precificação; (3) Financeiro: Split Payment e capital de giro. Mínimo 4h cada equipe.", motivo: "Sem treinamento, erros operacionais aumentam na transição — nota emitida errada, crédito perdido, retrabalho fiscal.", prazo: "60 a 120 dias", responsavel: "RH / Gestor de área", source: "Treinamento interno realizado: Não", confianca: "amarelo" });
  }

  if (isB2C) {
    actions.push({ id: "b2c_pricing_comms", phase: 3, priority: "media", eixo: "Comercial / Contratos", title: "Elaborar estratégia de comunicação de preços ao consumidor final", desc: "Defina: (1) quais itens serão repassados, (2) cronograma de reajuste, (3) mensagem ao cliente (não abordar imposto em si, focar no valor entregue).", motivo: "Consumidores finais são mais sensíveis a preço. Um repasse mal comunicado pode gerar cancelamentos e perda de clientes.", prazo: "60 a 120 dias", responsavel: "Comercial / Marketing", source: `Operação: ${isB2C && isB2B ? "B2B + B2C" : "B2C"} — consumidor final identificado`, confianca: "verde" });
  }

  if (data.regime === "lucro_presumido") {
    actions.push({ id: "regime_transition", phase: 3, priority: "media", eixo: "Fiscal / Documental", title: "Planejar adaptação do Lucro Presumido à nova tributação do consumo", desc: "Com o contador, avalie: (1) como o IBS/CBS substituirá o PIS/COFINS cumulativos na prática, (2) ajustes necessários nos controles e obrigações acessórias, (3) oportunidades de crédito antes inacessíveis com o regime cumulativo.", motivo: "A reforma altera profundamente a tributação do consumo para empresas do Lucro Presumido, que deixarão de recolher PIS/COFINS e passarão ao IBS/CBS. O regime de IRPJ/CSLL não é automaticamente extinto — a preparação deve focar nos impactos operacionais e fiscais do novo regime.", prazo: "60 a 120 dias", responsavel: "Contador / Financeiro", source: "Regime tributário: Lucro Presumido", confianca: "verde" });
  }

  actions.push({ id: "final_validation", phase: 3, priority: "alta", eixo: "Governança / Sistemas", title: "Reunião de validação final com contador em 2026", desc: "Use este checklist: ☐ ERP atualizado e testado; ☐ Cadastros corretos (NCM/NBS, regimes); ☐ Contratos revisados; ☐ Política de preços publicada; ☐ Equipe treinada; ☐ Split Payment simulado.", motivo: "A validação final garante que nenhum ponto crítico foi esquecido durante o período de testes e coexistência do novo regime em 2026.", prazo: "60 a 120 dias", responsavel: "Contador / Diretoria", source: "Validação estruturante para todos os perfis", confianca: "verde" });

  if (isTransitionActive) {
    actions.filter((a) => a.phase === 1).forEach((a) => {
      a.motivo = (a.motivo || "") + " ⚠️ A fase de coexistência IBS/CBS está em vigor desde 2026. Esta ação é adequação em curso, não preparação futura.";
    });
  }

  return actions;
}

// getRiskLabel = alias de getRiskLabelConfig (importado de riskConfig — ver topo do arquivo)
// generateConclusionText = importado de riskConfig — ver topo do arquivo

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

function ArticleQuickView({ 
  article, onClose 
}: { 
  article: ReformaArticle; 
  onClose: () => void 
}) {
  const catConfig = CATEGORY_CONFIG[article.category];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
         onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-[hsl(var(--card))] border border-[hsl(var(--border))] 
                   rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${catConfig.color} mb-2 inline-block`}>
                {catConfig.label}
              </span>
              <h3 className="font-bold text-foreground text-base leading-tight">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {article.lawBasis.map(law => (
                  <span key={law} 
                        className="text-xs text-[hsl(var(--primary))] 
                                   bg-[hsl(var(--primary))]/10 px-2 py-0.5 rounded">
                    {law}
                  </span>
                ))}
                <span className="flex items-center gap-1 text-xs 
                                  text-[hsl(var(--muted-foreground))]">
                  <Clock className="w-3 h-3" />{article.readTime} min
                </span>
              </div>
            </div>
            <button onClick={onClose} 
                    className="text-muted-foreground 
                               hover:text-foreground transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                O que diz a lei
              </p>
              <p className="text-foreground/80 leading-relaxed">{article.sections.oquedizalei}</p>
            </div>
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                O que muda na prática
              </p>
              <p className="text-foreground/80 leading-relaxed">{article.sections.oquemudata}</p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                O que sua empresa precisa fazer
              </p>
              <p className="text-foreground/80 leading-relaxed">{article.sections.oquefarzer}</p>
            </div>
            <p className="text-xs text-muted-foreground bg-background rounded p-2 border border-border">
              <span className="font-semibold text-foreground">Base legal: </span>
              {article.sections.baseLegal}
            </p>
          </div>

          <button
            onClick={() => { onClose(); window.location.href = '/o-que-muda'; }}
            className="mt-4 w-full flex items-center justify-center gap-2 
                       text-xs text-[hsl(var(--primary))] hover:underline"
          >
            Ver todos os artigos em O Que Muda?
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface CompanySummary {
  id: string;
  companyName: string;
  cnpj: string;
  riskScore: number;
  createdAt: string;
}

function getRiskLevel(score: number): { label: string; color: string } {
  const cfg = getRiskLabelConfig(score);
  return { label: cfg.label, color: cfg.solid };
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch { return "—"; }
}

export default function PlanoDeAcaoJornada() {
  const { data, updateData, saveCompany, companyId, user, logout, resetData, loadCompany } = useAppStore();
  const [, navigate] = useLocation();
  const [screen, setScreen] = useState(0);
  const [saving, setSaving] = useState(false);
  const [quickViewArticle, setQuickViewArticle] = useState<ReformaArticle | null>(null);
  const [entendaMelhorItem, setEntendaMelhorItem] = useState<PlanAction | null>(null);
  const [error, setError] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [plan, setPlan] = useState<PlanAction[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, "pendente" | "em_andamento" | "concluida">>({});
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [redoId, setRedoId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [pendingRedo, setPendingRedo] = useState(false);

  const [cnpjFetching, setCnpjFetching] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  const [cnpjSuccess, setCnpjSuccess] = useState(false);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [municipiosLoading, setMunicipiosLoading] = useState(false);
  const [erpSystemTouched, setErpSystemTouched] = useState(false);

  useEffect(() => {
    const digits = data.cnpj.replace(/\D/g, "");
    if (digits.length !== 14) { setCnpjError(null); setCnpjSuccess(false); return; }
    setCnpjFetching(true);
    setCnpjError(null);
    setCnpjSuccess(false);
    fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`)
      .then((r) => {
        if (!r.ok) throw new Error("CNPJ não encontrado na Receita Federal");
        return r.json();
      })
      .then((api) => {
        if (api.razao_social) updateData("companyName", api.razao_social);
        if (api.nome_fantasia) updateData("nomeFantasia", api.nome_fantasia);
        if (api.cnae_fiscal_descricao) updateData("cnaeCode", `${api.cnae_fiscal} — ${api.cnae_fiscal_descricao}`);
        if (api.uf) updateData("estado", api.uf);
        if (api.municipio) updateData("municipio", api.municipio);
        setCnpjSuccess(true);
      })
      .catch((e) => setCnpjError(e.message || "CNPJ não encontrado na Receita Federal"))
      .finally(() => setCnpjFetching(false));
  }, [data.cnpj]);

  useEffect(() => {
    if (!data.estado) { setMunicipios([]); return; }
    setMunicipiosLoading(true);
    const uf = data.estado;
    const rawMunicipio = data.municipio;
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then((r) => r.ok ? r.json() : [])
      .then((list: { nome: string }[]) => {
        const names = list.map((m) => m.nome).sort((a, b) => a.localeCompare(b, "pt-BR"));
        setMunicipios(names);
        if (rawMunicipio) {
          const norm = normalizeStr(rawMunicipio);
          const match = names.find((n) => normalizeStr(n) === norm);
          if (match && match !== rawMunicipio) updateData("municipio", match);
        }
      })
      .catch(() => setMunicipios([]))
      .finally(() => setMunicipiosLoading(false));
  }, [data.estado]);

  useEffect(() => {
    fetch("/api/my/companies", { credentials: "include" })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setCompanies(d))
      .catch(() => setCompanies([]))
      .finally(() => setCompaniesLoading(false));
  }, []);

  useEffect(() => {
    if (pendingOpen && companyId) {
      const d = computeReadiness(data);
      setDiagnosis(d);
      setPlan(generatePlan(data, d));
      setScreen(8);
      setPendingOpen(false);
      setLoadingId(null);
    }
  }, [pendingOpen, companyId, data]);

  useEffect(() => {
    if (pendingRedo && companyId) {
      setDiagnosis(null);
      setPlan([]);
      setTaskStatuses({});
      setScreen(1);
      setPendingRedo(false);
      setRedoId(null);
    }
  }, [pendingRedo, companyId, data]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [screen]);

  const progressPct = screen >= 1 && screen <= INPUT_SCREENS ? ((screen - 1) / (INPUT_SCREENS - 1)) * 100 : screen > INPUT_SCREENS ? 100 : 0;

  const getArticleForAction = (actionId: string): ReformaArticle | null => {
    return reformaArticles.find(a => a.planActionIds.includes(actionId)) ?? null;
  };

  const cycleStatus = (id: string) => {
    setTaskStatuses((prev) => {
      const cur = prev[id] || "pendente";
      const next = cur === "pendente" ? "em_andamento" : cur === "em_andamento" ? "concluida" : "pendente";
      return { ...prev, [id]: next };
    });
  };

  const scrollToContinuar = useCallback(() => {
    const btn = document.querySelector('[data-testid="button-next"]') as HTMLElement | null;
    if (btn) {
      const top = btn.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, []);

  const scrollToNext = useCallback((questionId: string) => {
    setTimeout(() => {
      const all = Array.from(document.querySelectorAll("[data-question]"));
      const idx = all.findIndex((el) => el.getAttribute("data-question") === questionId);
      if (idx === -1 || idx >= all.length - 1) {
        scrollToContinuar();
        return;
      }
      const next = all[idx + 1] as HTMLElement;
      const top = next.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 220);
  }, [scrollToContinuar]);

  const focusAndScroll = useCallback((id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return;
      el.focus({ preventScroll: true });
      setTimeout(() => {
        const top = el.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }, 60);
    }, 80);
  }, []);

  const validate = (): boolean => {
    if (screen === 1) {
      if (!data.companyName.trim() || data.companyName === "Minha Empresa") {
        setError("Informe a Razão Social da empresa para continuar."); return false;
      }
    }
    setError(""); return true;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (screen === INPUT_SCREENS) {
      setSaving(true);
      try {
        const d = computeReadiness(data);
        updateData("riskScore", d.overallScore);
        await saveCompany();
        setDiagnosis(d);
        setPlan(generatePlan(data, d));
        setScreen(8);
      } catch {
        const d = computeReadiness(data);
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

  const handleOpenCompany = async (id: string) => {
    setLoadingId(id);
    await loadCompany(id);
    setPendingOpen(true);
  };

  const handleRedoCompany = async (id: string) => {
    setRedoId(id);
    await loadCompany(id);
    setPendingRedo(true);
  };

  const handleDeleteCompany = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este diagnóstico? Esta ação não pode ser desfeita.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/companies/${id}`, { method: "DELETE" });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const sectorOptions = [
    { id: "industria", label: "Indústria", icon: Factory, desc: "Transformação, manufatura" },
    { id: "atacado", label: "Atacado / Distribuição", icon: Store, desc: "Revenda B2B em grande volume" },
    { id: "varejo", label: "Varejo", icon: ShoppingBag, desc: "Venda ao consumidor final" },
    { id: "agronegocio", label: "Agronegócio", icon: Tractor, desc: "Produção rural, cooperativas" },
    { id: "outros", label: "Outros / Não listado", icon: Building, desc: "Construção Civil, Incorporação, Transportes, etc." },
  ];

  const screenSubtitle: Record<number, string> = {
    1: "Identifique a empresa e o responsável pelo tema. Esses dados vinculam todo o diagnóstico.",
    2: "Perfil tributário, operacional e comercial — base do cálculo de risco.",
    3: "O perfil de compras define os créditos tributários que a empresa pode aproveitar.",
    4: "A adequação dos sistemas fiscais é obrigatória — a NF-e exigirá novos campos em 2026.",
    5: "A saúde financeira e o acompanhamento do Split Payment definem o nível de atenção necessário para o fluxo de caixa.",
    6: "Contratos, governança e maturidade determinam a capacidade de adaptação da empresa.",
  };

  const phase1Actions = plan.filter((a) => a.phase === 1);
  const phase2Actions = plan.filter((a) => a.phase === 2);
  const phase3Actions = plan.filter((a) => a.phase === 3);
  const criticalCount = diagnosis?.allItems.filter((i) => i.level === "critico").length || 0;

  const toggleCheckbox = (field: "mainExpenses" | "fiscalDocTypes" | "paymentMethods" | "specialRegimes", val: string) => {
    const arr = data[field] as string[];
    const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
    updateData(field, next);
  };

  const CheckRow = ({ field, val, label, desc }: { field: "mainExpenses" | "fiscalDocTypes" | "paymentMethods" | "specialRegimes"; val: string; label: string; desc?: string }) => {
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
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-navbar/90 backdrop-blur-xl text-white">
        <div className="container flex h-16 max-w-screen-lg items-center justify-between px-4 md:px-6">
          <a href="/inicio" className="flex items-center gap-3 group">
            <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 transition-all duration-300 group-hover:bg-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading font-extrabold uppercase tracking-tight text-lg sm:text-xl text-white group-hover:text-primary transition-colors">
              REFORMA<span className="text-primary italic">EM</span>AÇÃO
            </span>
          </a>
          <div className="flex items-center gap-2">
            {screen >= 1 && screen <= INPUT_SCREENS && (
              <span className="text-xs text-white/70 font-medium hidden sm:inline">Etapa {screen} de {INPUT_SCREENS}</span>
            )}
            {screen >= 8 && data.companyName && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">{data.companyName}</Badge>
            )}
            {screen === 9 && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs font-semibold" data-testid="button-menu-plano">
                    <Menu className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Menu do Plano</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] p-0">
                  <SheetHeader className="p-5 text-left bg-muted/30 border-b">
                    <SheetTitle className="font-heading uppercase tracking-tight text-base">
                      Diagnóstico e Plano
                    </SheetTitle>
                    {data.companyName && (
                      <p className="text-xs text-muted-foreground mt-0.5">{data.companyName}</p>
                    )}
                  </SheetHeader>
                  <div className="flex flex-col py-2">
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          const el = document.getElementById("fase-1");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="w-full flex items-center gap-3 px-5 h-11 text-sm font-medium hover:bg-accent transition-colors text-left"
                      >
                        <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">1</div>
                        Fase 1 — Ações Imediatas
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          const el = document.getElementById("fase-2");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="w-full flex items-center gap-3 px-5 h-11 text-sm font-medium hover:bg-accent transition-colors text-left"
                      >
                        <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">2</div>
                        Fase 2 — Curto Prazo
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          const el = document.getElementById("fase-3");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="w-full flex items-center gap-3 px-5 h-11 text-sm font-medium hover:bg-accent transition-colors text-left"
                      >
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">3</div>
                        Fase 3 — Estruturantes
                      </button>
                    </SheetClose>
                    <div className="h-px bg-border mx-5 my-1" />
                    <SheetClose asChild>
                      <button
                        onClick={() => navigate("/plano-de-acao/meus-planos")}
                        className="w-full flex items-center gap-3 px-5 h-11 text-sm font-medium hover:bg-accent transition-colors text-left text-muted-foreground"
                      >
                        <FolderOpen className="h-4 w-4 shrink-0" />
                        Meus Diagnósticos
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => { if (diagnosis) generateActionPlanPdf(data as any, diagnosis, plan); }}
                        className="w-full flex items-center gap-3 px-5 h-11 text-sm font-medium hover:bg-accent transition-colors text-left text-muted-foreground"
                      >
                        <Download className="h-4 w-4 shrink-0" />
                        Baixar PDF do Plano
                      </button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <Button variant="ghost" size="sm" onClick={() => logout()} className="gap-1 text-muted-foreground h-8 text-xs" data-testid="button-logout">
              <LogOut className="h-3.5 w-3.5" /><span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {screen >= 1 && screen <= INPUT_SCREENS && (
        <div className="w-full bg-background border-b border-white/5 shadow-xl">
          <div className="container max-w-screen-lg mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-4">
              {Array.from({ length: INPUT_SCREENS }, (_, i) => i + 1).map((s, idx) => (
                <div key={s} className="flex items-center shrink-0">
                  {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/20 mx-1" />}
                  <div className={cn(
                    "text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg border transition-all duration-300",
                    s === screen 
                      ? "bg-primary text-background border-primary shadow-lg shadow-primary/20" 
                      : s < screen 
                        ? "bg-primary/5 text-primary border-primary/20" 
                        : "text-muted-foreground/30 border-white/5"
                  )}>
                    <span className="hidden sm:inline">{SCREEN_LABELS[s]}</span>
                    <span className="sm:hidden">{s}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-primary to-accent transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                style={{ width: `${progressPct}%` }} 
                data-testid="progress-bar" 
              />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 relative z-10">
        <div className={cn(
          "container mx-auto py-8 px-4 md:px-6 transition-all duration-500",
          screen >= 8 ? "max-w-screen-xl" : "max-w-4xl"
        )}>
          {/* Dashboard Inicial (Screen 0) */}
          {screen === 0 && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                    CENTRAL DE <span className="text-primary italic">CONFORMIDADE</span>
                  </h1>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-[0.3em] mt-2">
                    Ecossistema de Inteligência Tributária
                  </p>
                </div>
                <Button
                  onClick={handleNewPlan}
                  className="h-14 bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-widest px-10 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="mr-3 h-6 w-6" />
                  Novo Diagnóstico
                </Button>
              </div>

              {/* Grid de Métricas Rápidas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-white/5 flex items-center gap-4 group hover:border-primary/20 transition-all">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white">{companies.length}</span>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Diagnósticos</p>
                  </div>
                </div>
                <div className="glass-card p-6 border-white/5 flex items-center gap-4 group hover:border-emerald-500/20 transition-all">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white uppercase italic">OLED v3</span>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Segurança Digital</p>
                  </div>
                </div>
                <div className="glass-card p-6 border-white/5 flex items-center gap-4 group hover:border-sky-500/20 transition-all">
                  <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white italic">Real-time</span>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Processamento</p>
                  </div>
                </div>
              </div>

              {/* Lista de Empresas */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Histórico de Análises</h3>
                </div>

                {companies.length === 0 ? (
                  <div className="glass-card flex flex-col items-center justify-center py-24 text-center border-white/5 border-dashed">
                    <div className="p-6 bg-white/5 rounded-3xl mb-6">
                      <ShieldAlert className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <h4 className="text-white font-black uppercase tracking-widest">Sua base está vazia</h4>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Inicie seu primeiro diagnóstico para visualizar o plano de conformidade tributária.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className="glass-card group p-6 border-white/5 hover:border-primary/30 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6"
                      >
                        <div className="flex items-center gap-5 flex-1">
                          <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-colors">
                            <Landmark className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-white uppercase tracking-tight group-hover:text-primary transition-colors italic">
                              {company.companyName}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 opacity-70">
                              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">CNPJ: {company.cnpj || "—"}</span>
                              <div className="h-1 w-1 bg-white/20 rounded-full" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{formatDate(company.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleOpenCompany(company.id)}
                            className="bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-primary hover:text-background"
                          >
                            Resultados
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => handleRedoCompany(company.id)}
                            className="border border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-primary/10"
                          >
                            Revisar
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => handleDeleteCompany(company.id)}
                            className="h-10 w-10 p-0 border border-red-500/20 text-red-500/40 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Telas de Entrada (1-6) */}
          {screen >= 1 && screen <= INPUT_SCREENS && (
            <div className="animate-fade-in-up space-y-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                    {SCREEN_LABELS[screen]}
                  </h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed max-w-xl">
                    {screenSubtitle[screen]}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={screen === 1}
                    className="h-12 px-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] disabled:opacity-20"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={saving}
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : screen === INPUT_SCREENS ? "Gerar Diagnóstico" : "Continuar"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-12">
                {screen === 1 && (
                  <div className="grid gap-8">
                    <div className="glass-card p-8 border-white/5 space-y-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-1 bg-primary rounded-full" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground underline decoration-primary/30 underline-offset-8">Dados da Entidade</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 italic">CNPJ (Opcional)</Label>
                            <input
                              className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold tracking-wide text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/30"
                              placeholder="00.000.000/0000-00"
                              value={data.cnpj}
                              onChange={(e) => updateData("cnpj", e.target.value)}
                            />
                            {cnpjFetching && <p className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin"/> Sincronizando Receita...</p>}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 italic">Razão Social *</Label>
                            <input
                              className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold tracking-wide text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/30"
                              placeholder="Firma Individual ou LTDA"
                              value={data.companyName === "Minha Empresa" ? "" : data.companyName}
                              onChange={(e) => { updateData("companyName", e.target.value); setError(""); }}
                            />
                            {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 italic">Estado (UF)</Label>
                            <Select value={data.estado} onValueChange={(v) => updateData("estado", v)}>
                              <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 font-bold">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent className="bg-navbar border-white/10 rounded-xl max-h-64">
                                {ESTADOS.map(uf => <SelectItem key={uf} value={uf} className="font-bold focus:bg-primary/20">{uf}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 italic">Município</Label>
                            <Select value={data.municipio} onValueChange={(v) => updateData("municipio", v)} disabled={!data.estado}>
                              <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 font-bold italic">
                                <SelectValue placeholder={data.estado ? "Selecione" : "Aguardando UF..."} />
                              </SelectTrigger>
                              <SelectContent className="bg-navbar border-white/10 rounded-xl max-h-64 overflow-y-auto">
                                {municipios.map(m => <SelectItem key={m} value={m} className="font-bold focus:bg-primary/20">{m}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-1 bg-primary rounded-full" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground underline decoration-primary/30 underline-offset-8">Ponto Focal</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 italic">Nome do Gestor</Label>
                            <input
                              className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold tracking-wide text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/30"
                              placeholder="Nome Completo"
                              value={data.contactName}
                              onChange={(e) => updateData("contactName", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1 italic">Telefone / WhatsApp</Label>
                            <MaskedInput
                              mask="(00) 00000-0000"
                              className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold tracking-wide text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/30"
                              placeholder="(00) 00000-0000"
                              value={data.contactPhone}
                              onAccept={(v) => updateData("contactPhone", v)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {screen === 2 && (
                  <div className="grid gap-10">
                    <div className="space-y-6">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">A — Vocação Econômica</Label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sectorOptions.map((opt) => (
                          <div 
                            key={opt.id}
                            onClick={() => updateData("sector", opt.id)}
                            className={cn(
                              "glass-card p-6 flex flex-col items-center text-center gap-4 cursor-pointer transition-all duration-300 group hover:border-primary/50",
                              data.sector === opt.id ? "bg-primary/10 border-primary border shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "border-white/5 bg-white/5"
                            )}
                          >
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                              data.sector === opt.id ? "bg-primary text-background rotate-3" : "bg-white/5 text-muted-foreground group-hover:text-white"
                            )}>
                              <opt.icon className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-black uppercase tracking-widest text-white">{opt.label}</h4>
                              <p className="text-[10px] text-muted-foreground leading-tight uppercase font-medium">{opt.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">B — Regime Tributário Atual</Label>
                        <RadioGroup value={data.regime} onValueChange={(v) => updateData("regime", v)} className="grid gap-3">
                          <RadioRow field="regime" val="simples" label="Simples Nacional" desc="Recolhimento unificado via DAS" />
                          <RadioRow field="regime" val="lucro_presumido" label="Lucro Presumido" desc="Tributação por presunção de margem" />
                          <RadioRow field="regime" val="lucro_real" label="Lucro Real" desc="Tributação baseada no lucro líquido real" />
                        </RadioGroup>
                      </div>

                      <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">C — Porte e Capilaridade</Label>
                        <div className="grid gap-4">
                          <div className="space-y-2 italic">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1">Faturamento Anual</Label>
                            <Select value={data.annualRevenue} onValueChange={(v) => updateData("annualRevenue", v)}>
                              <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 font-bold"><SelectValue placeholder="Selecione" /></SelectTrigger>
                              <SelectContent className="bg-navbar border-white/10 rounded-xl">
                                <SelectItem value="ate_360k" className="font-bold italic focus:bg-primary/20">Até R$ 360 mil</SelectItem>
                                <SelectItem value="360k_4_8m" className="font-bold italic focus:bg-primary/20">R$ 360k a R$ 4,8 mi</SelectItem>
                                <SelectItem value="4_8m_78m" className="font-bold italic focus:bg-primary/20">R$ 4,8 mi a R$ 78 mi</SelectItem>
                                <SelectItem value="acima_78m" className="font-bold italic focus:bg-primary/20">Acima de R$ 78 mi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 italic">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1">Abrangência Geográfica</Label>
                            <Select value={data.geographicScope} onValueChange={(v) => updateData("geographicScope", v)}>
                              <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 font-bold"><SelectValue placeholder="Selecione" /></SelectTrigger>
                              <SelectContent className="bg-navbar border-white/10 rounded-xl">
                                <SelectItem value="local" className="font-bold italic focus:bg-primary/20">Apenas um Estado</SelectItem>
                                <SelectItem value="regional" className="font-bold italic focus:bg-primary/20">Mais de um Estado</SelectItem>
                                <SelectItem value="nacional" className="font-bold italic focus:bg-primary/20">Nacional / Exportador</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {screen === 3 && (
                  <div className="grid gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Cadeia de Fornecimento</Label>
                        <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase font-black tracking-widest bg-primary/5">Análise de Crédito</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Dependência do Simples</h4>
                          <RadioGroup value={data.simplesSupplierPercent} onValueChange={(v) => updateData("simplesSupplierPercent", v)} className="grid gap-3">
                            <RadioRow field="simplesSupplierPercent" val="ate_30" label="Até 30% dos Fornecedores" desc="Baixo impacto comercial inicial" />
                            <RadioRow field="simplesSupplierPercent" val="30_60" label="30% a 60% no Simples" desc="Dificulta transferência de crédito" />
                            <RadioRow field="simplesSupplierPercent" val="acima_60" label="Mais de 60% no Simples" desc="Risco elevado de custo tributário" highlight="true" />
                          </RadioGroup>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Formalidade das Entradas</h4>
                          <RadioGroup value={data.hasRegularNF} onValueChange={(v) => updateData("hasRegularNF", v)} className="grid gap-3">
                            <RadioRow field="hasRegularNF" val="sim" label="100% com Nota Fiscal" desc="Conformidade plena" />
                            <RadioRow field="hasRegularNF" val="parcialmente" label="Operações Mistas" desc="Risco de fiscalização" />
                            <RadioRow field="hasRegularNF" val="nao" label="Alta Informalidade" desc="Inviável no novo regime IBS/CBS" highlight="true" />
                          </RadioGroup>
                        </div>
                      </div>
                         {screen === 4 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-6">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">A — Infraestrutura de Gestão</Label>
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest">Sistema de Gestão (ERP)</h4>
                        <RadioGroup value={data.erpSystem} onValueChange={(v) => updateData("erpSystem", v)} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <RadioRow field="erpSystem" val="sap_oracle" label="SAP / Oracle" desc="Enterprise Level" />
                          <RadioRow field="erpSystem" val="totvs" label="TOTVS" desc="Líder Nacional" />
                          <RadioRow field="erpSystem" val="senior" label="Senior" desc="Foco em RH/Fiscal" />
                          <RadioRow field="erpSystem" val="omnie_contaazul" label="Cloud ERP (Omnie/CA)" desc="Foco em PME" />
                          <RadioRow field="erpSystem" val="proprio" label="Sistema Próprio" desc="Risco de Adaptação" highlight="true" />
                          <RadioRow field="erpSystem" val="planilha" label="Planilhas / Sem ERP" desc="Crítico para 2026" highlight="true" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-white/5">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">B — Cultura de Dados</Label>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Padronização de Cadastro</h4>
                          <RadioGroup value={data.catalogStandardized} onValueChange={(v) => updateData("catalogStandardized", v)} className="grid gap-3">
                            <RadioRow field="catalogStandardized" val="sim" label="Itens Padronizados" desc="NCM e NBS revisados" />
                            <RadioRow field="catalogStandardized" val="parcial" label="Parcialmente" desc="Alguns erros de cadastro" />
                            <RadioRow field="catalogStandardized" val="nao" label="Sem Padronização" desc="Risco de erro na CBS/IBS" highlight="true" />
                          </RadioGroup>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Responsável Fiscal</h4>
                          <RadioGroup value={data.taxResponsible} onValueChange={(v) => updateData("taxResponsible", v)} className="grid gap-3">
                            <RadioRow field="taxResponsible" val="interno" label="Equipe Interna" desc="Dedicada ao projeto" />
                            <RadioRow field="taxResponsible" val="externo" label="Contabilidade Externa" desc="Parceria estratégica" />
                            <RadioRow field="taxResponsible" val="ninguem" label="Sem Responsável" desc="Vulnerabilidade total" highlight="true" />
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {screen === 5 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">A — Fluxo de Caixa & Split Payment</Label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CheckRow field="paymentMethods" val="pix" label="PIX" desc="Rastreabilidade 100%" />
                        <CheckRow field="paymentMethods" val="cartao" label="Cartões" desc="Split em 2026" />
                        <CheckRow field="paymentMethods" val="boleto" label="Boletos" desc="Crédito Vinculado" />
                        <CheckRow field="paymentMethods" val="dinheiro" label="Espécie" desc="Fuga de Crédito" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest">Margem de Lucro Bruta</h4>
                        <Select value={data.profitMargin} onValueChange={(v) => updateData("profitMargin", v)}>
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"><SelectValue placeholder="Selecione a margem" /></SelectTrigger>
                          <SelectContent className="bg-navbar border-white/10 rounded-xl">
                            <SelectItem value="ate_10" className="font-bold italic">Apertada (Até 10%)</SelectItem>
                            <SelectItem value="10_25" className="font-bold italic">Média (10% a 25%)</SelectItem>
                            <SelectItem value="acima_25" className="font-bold italic">Confortável (Acima 25%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest">Regras de Preços</h4>
                        <RadioGroup value={data.pricingStrategy} onValueChange={(v) => updateData("pricingStrategy", v)} className="grid gap-3">
                          <RadioRow field="pricingStrategy" val="gross_up" label="Gross-up Completo" desc="Repassa todo o tributo" />
                          <RadioRow field="pricingStrategy" val="absorcao" label="Absorção Parcial" desc="Reduz margem para competir" />
                          <RadioRow field="pricingStrategy" val="indefinido" label="Indefinido" desc="Risco de prejuízo direto" highlight="true" />
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {screen === 6 && (
                  <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className="text-center space-y-4 mb-4">
                      <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                      <h3 className="text-lg font-black uppercase tracking-tighter text-white">Última etapa: Estratégia e Foco</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">A — Conhecimento da Reforma</Label>
                        <RadioGroup value={data.reformKnowledge} onValueChange={(v) => updateData("reformKnowledge", v)} className="grid gap-3">
                          <RadioRow field="reformKnowledge" val="alto" label="Acompanhamento Ativo" desc="Lê as leis complementares" />
                          <RadioRow field="reformKnowledge" val="medio" label="Conhecimento Geral" desc="Sabe que vai mudar" />
                          <RadioRow field="reformKnowledge" val="baixo" label="Desconhecimento" desc="Apenas ouviu falar" highlight="true" />
                        </RadioGroup>
                      </div>

                      <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">B — Prioridade de Adaptação</Label>
                        <RadioGroup value={data.mainUrgency} onValueChange={(v) => updateData("mainUrgency", v)} className="grid gap-3">
                          <RadioRow field="mainUrgency" val="sistemas" label="Atualizar Sistemas" desc="ERP e NF-e" />
                          <RadioRow field="mainUrgency" val="fornecedores" label="Mapear Fornecedores" desc="Créditos e Custos" />
                          <RadioRow field="mainUrgency" val="precos" label="Revisar Preços" desc="Proteção da Margem" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Compromisso com a Transição</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Ao clicar em "Gerar Diagnóstico", nosso motor processará as 22 variáveis fornecidas para criar um plano de ação personalizado baseado na cronologia da Reforma Tributária (2026-2033).
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              <div className="px-6 md:px-10 py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  disabled={saving} 
                  className="w-full sm:w-auto h-12 text-muted-foreground font-bold uppercase tracking-widest text-xs"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>

                {screen === INPUT_SCREENS ? (
                  <Button
                    onClick={handleNext}
                    disabled={saving}
                    className="w-full sm:w-auto h-14 bg-primary hover:bg-primary-foreground text-background font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 rounded-xl px-12"
                    data-testid="button-next"
                  >
                    {saving ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</>
                    ) : (
                      <><BarChart3 className="mr-2 h-5 w-5" /> Gerar Diagnóstico Estratégico</>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext} 
                    disabled={saving} 
                    className="w-full sm:w-auto h-14 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-[0.2em] rounded-xl px-10 border border-white/10"
                    data-testid="button-next"
                  >
                    Continuar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          )}

          {screen === 8 && diagnosis && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-xs uppercase tracking-widest text-primary font-bold">Sumário Executivo</span>
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                  PRONTIDÃO<span className="text-primary italic">ESTRATÉGICA</span>
                </h1>
                <p className="text-muted-foreground text-sm max-w-2xl mx-auto uppercase tracking-wide">
                  Análise de risco baseada na EC 132/2023 e Leis Complementares 214/2025 e 227/2026.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 text-center border-white/5 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Score de Prontidão</p>
                  <div className="text-6xl font-black mb-4 text-white">
                    {Math.round(diagnosis.overallScore)}<span className="text-lg opacity-30">%</span>
                  </div>
                  <Badge className={cn("text-xs font-bold px-4 py-1", getRiskLabel(diagnosis.overallScore).color)}>
                    {getRiskLabel(diagnosis.overallScore).label}
                  </Badge>
                </div>

                <div className="md:col-span-2 glass-card p-8 border-white/5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Visão Geral por Eixo
                  </h3>
                  <div className="space-y-6">
                    {diagnosis.axes.map((ax) => (
                      <div key={ax.id} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold text-muted-foreground uppercase">{ax.name}</span>
                          <span className="text-xs font-mono text-primary">{ax.score}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                            style={{ width: `${ax.score}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 border-destructive/20 bg-destructive/5">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">Risco Crítico</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed mb-4">{diagnosis.allItems[0]?.title || "Nenhum risco crítico"}</p>
                  {diagnosis.allItems[0] && (
                    <div className="text-[10px] p-2 rounded bg-destructive/10 text-destructive border border-destructive/10 font-bold uppercase">Ação: {diagnosis.allItems[0].action}</div>
                  )}
                </div>

                <div className="glass-card p-5 border-accent/20 bg-accent/5">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Urgência Máxima</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed mb-4">{plan[0]?.title || "Adaptação de Sistemas"}</p>
                  <div className="text-[10px] p-2 rounded bg-accent/10 text-accent border border-accent/10 font-bold uppercase">Prazo: {plan[0]?.prazo || "Imediato"}</div>
                </div>

                <div className="glass-card p-5 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Margem Operacional</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed mb-4">Mapeamento de créditos para evitar erosão de margem no novo regime.</p>
                  <div className="text-[10px] p-2 rounded bg-primary/10 text-primary border border-primary/10 font-bold uppercase">Prioridade A</div>
                </div>

                <div className="glass-card p-5 border-white/10 bg-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Responsabilidade</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed mb-4">{data.contactName || "Gestor do Projeto"}</p>
                  <div className="text-[10px] p-2 rounded bg-white/10 text-muted-foreground border border-white/10 font-bold uppercase">Responsável</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5">
                <Button variant="ghost" onClick={handleBack} className="h-14 px-8 text-muted-foreground font-bold uppercase tracking-widest text-xs">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Revisar Respostas
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1 h-14 bg-primary hover:bg-primary-foreground text-background font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 rounded-xl"
                  data-testid="button-to-plan"
                >
                  Visualizar Plano de Ação Estratégico <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {screen === 9 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 w-8 bg-primary rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Plano Estratégico</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white" data-testid="text-plan-title">
                    AGENDA DE<span className="text-primary italic">ADAPTAÇÃO</span>
                  </h1>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                    Prioridades de {data.companyName} para a Reforma Tributária
                  </p>
                </div>
                <Button
                  onClick={handleNext}
                  className="h-14 px-8 bg-primary hover:bg-primary-foreground text-background font-black uppercase tracking-widest shadow-xl shadow-primary/10 rounded-xl"
                  data-testid="button-to-report-top"
                >
                  <FileText className="mr-2 h-5 w-5" /> Gerar Relatório Final
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card p-4 border-white/5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Ações Totais</p>
                  <p className="text-2xl font-black text-white">{plan.length}</p>
                </div>
                <div className="glass-card p-4 border-destructive/20 bg-destructive/5">
                  <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-1">Alertas de Risco</p>
                  <p className="text-2xl font-black text-destructive">{criticalCount}</p>
                </div>
                <div className="glass-card p-4 border-primary/20">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Concluídas</p>
                  <p className="text-2xl font-black text-white">{Object.values(taskStatuses).filter(s => s === "concluida").length}</p>
                </div>
                <div className="glass-card p-4 border-white/5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Milestone</p>
                  <p className="text-sm font-bold text-white uppercase mt-1">2026/2027</p>
                </div>
              </div>

              {[
                { phase: 1, title: "Fase 01 — Implantação e Transição", subtitle: "Ações imediatas para conformidade em 2026", color: "bg-destructive shadow-destructive/20", actions: phase1Actions },
                { phase: 2, title: "Fase 02 — Estruturação e Ajustes", subtitle: "Otimização de processos e cadastros", color: "bg-accent shadow-accent/20", actions: phase2Actions },
                { phase: 3, title: "Fase 03 — Monitoramento e Go-Live", subtitle: "Consolidação e mitigação de erros", color: "bg-primary shadow-primary/20", actions: phase3Actions },
              ].map((phaseData) => (
                <div key={phaseData.phase} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-black text-background shadow-lg", phaseData.color)}>
                      {phaseData.phase}
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight text-white">{phaseData.title}</h2>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide italic">{phaseData.subtitle}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {phaseData.actions.map((action) => {
                      const status = taskStatuses[action.id] || "pendente";
                      const config = statusConfig[status];
                      return (
                        <div key={action.id} className="glass-card p-6 border-white/5 group hover:border-white/10 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={cn("text-[8px] font-bold uppercase tracking-widest py-0", priorityConfig[action.priority].cls)}>
                                  {priorityConfig[action.priority].label}
                                </Badge>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">{action.eixo}</span>
                              </div>
                              <h3 className="text-sm font-bold text-white uppercase">{action.title}</h3>
                              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">{action.desc}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-primary">
                                  <Clock className="w-3 h-3" /> {action.prazo}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                                  <User className="w-3 h-3" /> {action.responsavel}
                                </div>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center gap-2">
                              {PLAN_EXPLANATIONS[action.id] && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEntendaMelhorItem(action)}
                                  className="h-10 px-4 border border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest group/btn"
                                >
                                  <BookOpen className="w-3 h-3 mr-2 text-primary group-hover/btn:scale-110 transition-transform" /> 
                                  Detalhes
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    className={cn("h-10 px-4 min-w-[120px] rounded-lg font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all", config.color)}
                                  >
                                    <config.icon className="w-3 h-3 mr-2" /> {config.label}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-navbar border-white/10">
                                  {Object.entries(statusConfig).map(([key, cfg]) => (
                                    <DropdownMenuItem 
                                      key={key} 
                                      onClick={() => updateTaskStatus(action.id, key as any)}
                                      className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/20"
                                    >
                                      <cfg.icon className="w-3 h-3 mr-2" /> {cfg.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-10 border-t border-white/5">
                <Button variant="ghost" onClick={handleBack} className="h-12 px-6 text-muted-foreground font-bold uppercase tracking-widest text-xs">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Diagnóstico
                </Button>
                <Button
                  onClick={handleNext}
                  className="h-14 px-10 bg-primary hover:bg-primary-foreground text-background font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 rounded-xl"
                  data-testid="button-to-report"
                >
                  Concluir e Ver Relatório Final <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {screen === 10 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="text-center space-y-6 pb-12 border-b border-white/5">
                <div className="mx-auto h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/20">
                  <FileCheck className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-white" data-testid="text-report-title">
                    RELATÓRIO DE<span className="text-primary italic">CONFORMIDADE</span>
                  </h1>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-[0.3em]">
                    {data.companyName} — Diagnóstico Consolidado
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="glass-card p-8 border-white/5 relative group">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-10 w-1 bg-primary rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white">Identificação Executiva</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Razão Social</p>
                        <p className="text-sm font-bold text-white uppercase">{data.companyName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Documento</p>
                        <p className="text-sm font-bold text-white font-mono">{data.cnpj || "NÃO INFORMADO"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Setor / Regime</p>
                        <p className="text-sm font-bold text-white uppercase">{data.sector} — {data.regime}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Responsável</p>
                        <p className="text-sm font-bold text-white uppercase">{data.contactName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 border-white/5">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-10 w-1 bg-primary rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white">Prontidão por Checklist</h3>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { done: data.taxResponsible !== "ninguem", label: "Responsabilidade Fiscal Definida" },
                        { done: data.erpSystem !== "nenhum" && data.erpSystem !== "planilha", label: "Infraestrutura de ERP Digital" },
                        { done: data.catalogStandardized === "sim", label: "Padronização de NCM/NBS" },
                        { done: data.hasRegularNF === "sim", label: "Formalidade no Faturamento" },
                        { done: data.managementAwareOfReform === "sim", label: "Engajamento da Liderança" }
                      ].map((item, idx) => (
                        <div key={idx} className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-all",
                          item.done ? "bg-primary/5 border-primary/20 text-white" : "bg-destructive/5 border-destructive/20 text-destructive/70"
                        )}>
                          <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
                          {item.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass-card p-8 border-white/5 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">Status Final</p>
                    <div className="relative z-10">
                      <div className="text-7xl font-black text-white mb-4">
                        {Math.round(diagnosis?.overallScore || 0)}
                        <span className="text-2xl opacity-30">%</span>
                      </div>
                      <Badge className={cn("text-xs font-bold px-6 py-1.5 uppercase tracking-widest", getRiskLabel(diagnosis?.overallScore || 0).color)}>
                        {getRiskLabel(diagnosis?.overallScore || 0).label}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-6 uppercase tracking-wider leading-relaxed">
                        {getRiskLabel(diagnosis?.overallScore || 0).description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => diagnosis && generateActionPlanPdf(data as any, diagnosis, plan)}
                    className="w-full h-32 glass-card border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <Download className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Download PDF Executivo</span>
                  </button>

                  <Button
                    variant="ghost"
                    onClick={() => navigate("/inicio")}
                    className="w-full h-14 border border-white/5 text-muted-foreground hover:text-white font-bold uppercase tracking-widest text-xs"
                  >
                    <Home className="mr-2 h-4 w-4" /> Voltar ao Dashboard
                  </Button>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5">
                <Alert className="bg-white/5 border-white/10 text-muted-foreground">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-xs font-medium uppercase tracking-wide">
                    Base Legislativa: EC 132/2023 · LC 214/2025 · LC 227/2026. Este relatório é uma ferramenta estratégica e não substitui parecer jurídico.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </div>
      </main>

      {quickViewArticle && (
        <ArticleQuickView
          article={quickViewArticle}
          onClose={() => setQuickViewArticle(null)}
        />
      )}

      {/* ===== MODAL ENTENDA MELHOR ===== */}
      <Dialog open={!!entendaMelhorItem} onOpenChange={(open) => { if (!open) setEntendaMelhorItem(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-navbar border-white/10 text-white rounded-3xl p-8">
          {entendaMelhorItem && (() => {
            const explanation = PLAN_EXPLANATIONS[entendaMelhorItem.id];
            const score = diagnosis?.overallScore ?? 50;
            const level = getReadinessLevel(score);
            const cfg = READINESS_CONFIG[level];
            return (
              <div className="space-y-8">
                <DialogHeader className="pb-0">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-lg font-black leading-tight uppercase tracking-tighter text-white">
                        {entendaMelhorItem.title}
                      </DialogTitle>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge className={cn("text-[8px] font-bold uppercase tracking-widest py-0", cfg.color === "green" ? "bg-green-600" : cfg.color === "red" ? "bg-red-600" : "bg-amber-600")}>
                          Prontidão: {cfg.label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {entendaMelhorItem.eixo}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                {explanation ? (
                  <div className="space-y-6">
                    <div className="glass-card p-6 border-primary/20 bg-primary/5">
                      <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4" /> Impacto Estratégico
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed font-medium">
                        {explanation.whyItMatters}
                      </p>
                    </div>

                    <div className="glass-card p-6 border-destructive/20 bg-destructive/5">
                      <h3 className="text-xs font-black text-destructive uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Riscos de Inércia
                      </h3>
                      <ul className="space-y-3">
                        {explanation.consequences.map((c, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                            <span className="font-medium">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                      <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" /> Suporte Normativo
                      </h3>
                      <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-mono italic">
                        {explanation.legalBasis}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
                      Explicação técnica em processamento...
                    </p>
                  </div>
                )}

                <DialogFooter className="pt-4 border-t border-white/5">
                  <Button
                    variant="ghost"
                    onClick={() => setEntendaMelhorItem(null)}
                    className="w-full text-muted-foreground hover:text-white font-black uppercase tracking-widest text-[10px]"
                  >
                    Fechar Detalhes
                  </Button>
                </DialogFooter>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
