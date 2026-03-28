import { useState, useEffect, useCallback } from "react";
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
  desc: string;
  motivo: string;
  prazo: string;
  responsavel: string;
  priority: "urgente" | "alta" | "media" | "baixa";
  eixo: string;
  source?: string;
  confianca?: "verde" | "amarelo" | "laranja" | "vermelho";
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
  const isB2B = data.operations === "b2b" || data.operations === "b2b_b2c";
  const isB2C = data.operations === "b2c" || data.operations === "b2b_b2c";
  const isMultiState = data.salesStates.includes("many_states") || data.salesStates.includes("national") || data.geographicScope === "nacional";
  const hasNoERP = data.erpSystem === "nenhum" || data.erpSystem === "planilha";
  const neverPrepared = data.preparationStarted === "nao" && data.hadInternalTraining === "nao";

  // ─── EIXO 1: FISCAL / DOCUMENTAL (peso 25%) ───────────────────────────
  const axis1Items: RiskItem[] = [];
  let a1 = 0;

  // Regra 1: planilhas ou controle manual
  if (hasNoERP) {
    axis1Items.push({ level: "critico", title: "Sistema fiscal inadequado para a transição", desc: "A adaptação ao novo modelo exige revisão do ERP, da emissão fiscal e dos cadastros. Processos muito manuais ou sem integração elevam bastante o risco operacional e dificultam o cumprimento das novas exigências fiscais.", action: "Avaliar e contratar ERP (Bling, Omie, Conta Azul, Tiny ou equivalente) imediatamente.", axis: "fiscal" }); a1 += 30;
  }
  if (data.nfeEmission === "emissor_gratuito" || data.nfeEmission === "contador") {
    axis1Items.push({ level: "moderado", title: "Emissão fiscal não integrada ao processo operacional", desc: "Emissão manual ou delegada ao contador sem integração cria gargalo, atraso e risco de erro nos campos IBS/CBS.", action: "Avaliar integração da emissão de NF-e ao fluxo operacional da empresa.", axis: "fiscal" }); a1 += 10;
  }
  if (data.catalogStandardized === "nao") {
    axis1Items.push({ level: "alto", title: "Cadastro de produtos sem padrão", desc: "Um cadastro desorganizado impede a correta classificação de NCM/NBS e o cálculo de alíquotas por produto.", action: "Padronizar o cadastro dos 30 principais produtos/serviços com NCM/NBS correto.", axis: "fiscal" }); a1 += 20;
  }
  if (data.erpVendorReformPlan === "nao" || data.erpVendorReformPlan === "nao_sei") {
    axis1Items.push({ level: "moderado", title: "ERP sem plano de adaptação confirmado", desc: "Sem confirmação escrita do fornecedor sobre IBS/CBS, a empresa depende de uma atualização que pode não chegar a tempo.", action: "Contatar o fornecedor e exigir cronograma escrito de atualização com prazo definido.", axis: "fiscal" }); a1 += 12;
  }
  if (data.internalFiscalResponsible === "nao") {
    axis1Items.push({ level: "moderado", title: "Sem responsável interno pelo cadastro fiscal", desc: "Toda a gestão fiscal delegada ao contador externo cria gargalo e dificulta adaptações rápidas.", action: "Designar pessoa interna para interface com o contador e acompanhamento das adaptações.", axis: "fiscal" }); a1 += 10;
  }
  // Regra 6: operação multi-estado eleva muito o risco fiscal
  if (isMultiState) {
    axis1Items.push({ level: "alto", title: "Operação multi-estado: parametrização por destino", desc: "O IBS depende do destino da operação e envolve componente estadual e municipal. Isso exige parametrização correta no sistema e na emissão fiscal — verifique se o ERP suporta esse cálculo.", action: "Confirmar com o fornecedor do ERP se o sistema identifica o estado do comprador e aplica a alíquota de IBS correta por destino em cada nota emitida.", axis: "fiscal" }); a1 += 15;
  }
  const hasSeletivo = data.specialRegimes.some((r) => r.startsWith("seletivo_"));
  if (hasSeletivo) {
    axis1Items.push({ level: "alto", title: "Imposto Seletivo incide sobre seus produtos", desc: "Produtos sujeitos ao IS (bebidas, tabaco, veículos) têm carga adicional que precisa ser calculada separadamente.", action: "Calcular o IS na tabela de preços e confirmar as alíquotas específicas com o contador.", axis: "fiscal" }); a1 += 15;
  }
  // Regra 4: B2B amplifica exigências de cadastro e emissão
  if (isB2B) {
    axis1Items.push({ level: "moderado", title: "Clientes B2B dependem da qualidade do seu cadastro fiscal", desc: "Compradores empresariais verificarão o crédito de IBS/CBS gerado por cada NF recebida. Erros de cadastro (NCM, NBS, regime) podem impedir o aproveitamento de crédito pelo adquirente e comprometer a relação comercial.", action: "Auditar a exatidão dos dados fiscais (NCM, CEST, CNPJ, regimes) de todos os itens vendidos para empresas.", axis: "fiscal" }); a1 += 8;
  }

  // ─── EIXO 2: COMPRAS / CRÉDITOS (peso 20%) ────────────────────────────
  const axis2Items: RiskItem[] = [];
  let a2 = 0;

  if (data.simplesSupplierPercent === "acima_60") {
    axis2Items.push({ level: "alto", title: "Maioria dos fornecedores com crédito potencialmente reduzido", desc: "Com >60% dos fornecedores no Simples, o crédito de IBS/CBS transferido ao adquirente tende a ser inferior ao do regime regular. O impacto exato depende da sistemática legal aplicável — confirme com seu contador.", action: "Classificar fornecedores em matriz A/B/C e negociar preços ou substituição dos Classe C.", axis: "compras" }); a2 += 22;
  } else if (data.simplesSupplierPercent === "30_60") {
    axis2Items.push({ level: "moderado", title: "Parte dos fornecedores com crédito reduzido", desc: "30–60% no Simples geram créditos parciais. O impacto varia com o volume de compra de cada fornecedor.", action: "Priorizar renegociações com os fornecedores de maior volume de compra.", axis: "compras" }); a2 += 10;
  }
  // Regra 3: muitos fornecedores Simples, MEI ou PF
  if (data.supplierRegimeType === "simples_maioria") {
    axis2Items.push({ level: "alto", title: "Cadeia de fornecimento com crédito sistemicamente reduzido", desc: "Quando a maioria dos fornecedores é do Simples, MEI ou PF, a empresa não pode recuperar o IBS/CBS em compras — toda a carga vira custo.", action: "Mapear os 10 fornecedores críticos e avaliar substituição, renegociação de preço ou migração de regime.", axis: "compras" }); a2 += 15;
  }
  if (data.hasNFErrors === "frequente") {
    axis2Items.push({ level: "alto", title: "Notas fiscais recebidas com erros frequentes", desc: "Cada NF com erro é crédito de IBS/CBS comprometido — o aproveitamento só ocorre com documentos válidos e corretos.", action: "Implantar programa de qualidade de NF junto a fornecedores. Dar 90 dias para adequação ou cancelar pedidos.", axis: "compras" }); a2 += 18;
  }
  if (data.hasRegularNF === "nao") {
    axis2Items.push({ level: "critico", title: "Compras sem documentação fiscal adequada", desc: "Aquisições sem nota fiscal tendem a impedir o aproveitamento regular de créditos de IBS/CBS e elevam o custo tributário da operação. A formalização das compras é requisito para o pleno funcionamento do regime não-cumulativo.", action: "Formalizar o relacionamento com fornecedores e exigir emissão de nota fiscal em todas as operações.", axis: "compras" }); a2 += 25;
  }
  if (data.mainExpenses.includes("folha")) {
    axis2Items.push({ level: "alto", title: "Custo concentrado em folha — menor potencial de creditamento", desc: "Empresas com estrutura de custos concentrada em folha de pagamento podem ter menor potencial de aproveitamento de créditos de IBS/CBS sobre seus custos relevantes, exigindo maior atenção à margem e à precificação no novo regime.", action: "Simular o impacto na margem com base na estrutura de custos atual e calibrar preços antes de 2026 com auxílio do contador.", axis: "compras" }); a2 += 20;
  }
  if (data.hasImports === "sim") {
    axis2Items.push({ level: "moderado", title: "Importações: mecânica de crédito específica", desc: "O IBS/CBS na importação tem regras próprias, diferentes das compras domésticas. Exige atenção redobrada.", action: "Revisar com despachante aduaneiro e contador as novas regras de crédito na importação sob LC 214/2025.", axis: "compras" }); a2 += 8;
  }
  // Regra 4: B2B amplifica a importância de créditos
  if (isB2B && (data.simplesSupplierPercent === "acima_60" || data.hasRegularNF !== "sim")) {
    a2 += 5; // boost silencioso — já adicionado item acima
  }

  // ─── EIXO 3: COMERCIAL / CONTRATOS (peso 20%) ─────────────────────────
  const axis3Items: RiskItem[] = [];
  let a3 = 0;

  // Regra 7: contratos longos sem cláusula
  if (data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao") {
    axis3Items.push({ level: "critico", title: "Contratos longos sem proteção tributária", desc: "Contratos acima de 12 meses sem cláusula de revisão por mudança tributária podem obrigar a empresa a absorver toda a nova carga sem possibilidade de repasse.", action: "Revisar contratos com urgência junto a assessoria jurídica especializada — avaliar inclusão de cláusula de reequilíbrio por mudança tributária.", axis: "comercial" }); a3 += 25;
  } else if (data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao_sei") {
    axis3Items.push({ level: "alto", title: "Situação dos contratos de longo prazo indefinida", desc: "Não saber se há cláusula de revisão tributária já é um risco. Contratos não analisados podem ser uma armadilha.", action: "Listar todos os contratos acima de 12 meses e levar para revisão jurídica imediata.", axis: "comercial" }); a3 += 15;
  }
  // Regra 5: B2C eleva sensibilidade de preço
  if (isB2C) {
    axis3Items.push({ level: "moderado", title: "Venda B2C: consumidor final absorve ou rejeita a carga", desc: "Consumidores finais não se beneficiam de créditos — se o preço subir, podem migrar para concorrentes. O repasse deve ser cuidadoso.", action: "Desenvolver estratégia de comunicação e repasse gradual. Identifique quais itens têm margem para absorver a carga.", axis: "comercial" }); a3 += 10;
  }
  // Regra 8: não conhece margem ou dificuldade de repasse
  if (data.knowsMarginByProduct === "nao") {
    axis3Items.push({ level: "moderado", title: "Sem visibilidade de margem por produto — estratégia cega", desc: "Sem saber a margem por item, a política comercial para 2026 será baseada em intuição, não em dados.", action: "Montar DRE por produto/serviço principal antes de definir qualquer estratégia de preço para 2026.", axis: "comercial" }); a3 += 8;
  }
  if (data.easePriceAdjustment === "dificil" || data.easePriceAdjustment === "impossivel") {
    axis3Items.push({ level: "moderado", title: "Dificuldade estrutural de reajuste de preços", desc: "Sem capacidade de ajustar preços, aumentos de carga tributária são absorvidos como redução de margem — o que pode tornar itens inviáveis.", action: "Identificar quais itens permitem repasse e quais precisam ser descontinuados ou reformulados.", axis: "comercial" }); a3 += 8;
  }
  if (data.hasGovernmentContracts === "sim") {
    axis3Items.push({ level: "moderado", title: "Contratos públicos: equilíbrio econômico em risco", desc: "A nova carga tributária pode romper o equilíbrio econômico-financeiro de contratos licitatórios.", action: "Analisar cláusulas de equilíbrio com assessoria jurídica e protocolar pedido de revisão se necessário.", axis: "comercial" }); a3 += 8;
  }
  // Regra 6: multi-estado amplia risco comercial
  if (isMultiState && isB2B) {
    axis3Items.push({ level: "moderado", title: "Multi-estado B2B: preço varia por UF do cliente", desc: "Com alíquotas de IBS diferentes por estado, o preço líquido (sem imposto) pode ser diferente para clientes de UFs distintas.", action: "Verificar se a tabela comercial e o ERP suportam precificação com IBS variável por estado de destino.", axis: "comercial" }); a3 += 5;
  }

  // ─── EIXO 4: FINANCEIRO / CAIXA (peso 20%) ────────────────────────────
  const axis4Items: RiskItem[] = [];
  let a4 = 0;

  if (data.splitPaymentAware === "nao") {
    axis4Items.push({ level: "alto", title: "Split Payment desconhecido — risco relevante de caixa", desc: "O Split Payment é o mecanismo legal pelo qual o imposto é retido antes do valor chegar à empresa. Sua implementação operacional ainda depende de regulamentação específica por meio de pagamento — acompanhe as atualizações com seu contador.", action: "Estudar o mecanismo, projetar o impacto no fluxo de caixa e ajustar a reserva de capital de giro antes de 2026.", axis: "financeiro" }); a4 += 18;
  } else if (data.splitPaymentAware === "ouvi_falar") {
    axis4Items.push({ level: "moderado", title: "Compreensão superficial do Split Payment", desc: "Conhecer superficialmente não é suficiente. O impacto no caixa exige acompanhamento da regulamentação e projeção para cada meio de recebimento.", action: "Realizar treinamento aprofundado sobre o mecanismo do Split Payment e projetar o impacto com o financeiro.", axis: "financeiro" }); a4 += 8;
  }
  if (data.profitMargin === "ate_5" || data.profitMargin === "5_10") {
    axis4Items.push({ level: "alto", title: "Margem de lucro vulnerável à reforma", desc: "Com margem abaixo de 10%, qualquer variação de carga tributária pode comprometer a viabilidade de produtos/serviços.", action: "Recalcular urgentemente a estrutura de preços com base no novo regime antes de qualquer renovação de contrato.", axis: "financeiro" }); a4 += 22;
  }
  if (data.tightWorkingCapital === "sim") {
    axis4Items.push({ level: "alto", title: "Capital de giro apertado — atenção ao Split Payment", desc: "O Split Payment prevê retenção do imposto antes do valor líquido chegar à empresa, dependendo do meio de pagamento e da regulamentação aplicável. Empresas com capital de giro apertado devem acompanhar de perto a implementação.", action: "Projetar o impacto no fluxo de caixa e revisar limites de crédito junto ao banco antes de 2026.", axis: "financeiro" }); a4 += 18;
  }
  // Regra 5: B2C eleva pressão financeira de preço e margem
  if (isB2C && (data.profitMargin === "ate_5" || data.profitMargin === "5_10")) {
    axis4Items.push({ level: "alto", title: "B2C com margem apertada: risco de inviabilidade de produtos", desc: "Com consumidores finais resistentes a preço e margem abaixo de 10%, alguns produtos podem se tornar inviáveis com a nova carga.", action: "Mapear os 10 itens com menor margem e definir qual será descontinuado, reformulado ou repassado ao cliente.", axis: "financeiro" }); a4 += 12;
  }
  // Regra 8: não conhece margem por produto
  if (data.knowsMarginByProduct === "nao") {
    axis4Items.push({ level: "moderado", title: "Margem por produto desconhecida — risco de subsídio cruzado", desc: "Sem saber a margem por item, produtos deficitários podem estar sendo subsidiados por outros — a reforma vai expor isso.", action: "Calcular a margem líquida por produto/serviço principal antes de definir a estratégia de preços para 2026.", axis: "financeiro" }); a4 += 10;
  }
  if (data.easePriceAdjustment === "dificil" || data.easePriceAdjustment === "impossivel") {
    axis4Items.push({ level: "moderado", title: "Dificuldade de reajustar preços comprime margem", desc: "Sem espaço para ajuste, a nova carga vira redução de margem — impacto direto no resultado da empresa.", action: "Desenvolver estratégia de repasse gradual com comunicação antecipada ao mercado.", axis: "financeiro" }); a4 += 10;
  }
  if (data.regime === "lucro_presumido") {
    axis4Items.push({ level: "moderado", title: "Lucro Presumido: atenção à mudança na tributação do consumo", desc: "A reforma altera profundamente a tributação do consumo (IBS/CBS substituem PIS, COFINS, IPI, ICMS e ISS), o que impacta empresas do Lucro Presumido — que hoje têm PIS/COFINS cumulativos. O regime de IRPJ/CSLL não é automaticamente alterado pela reforma.", action: "Planejar com o contador os ajustes necessários nos processos fiscais e de apuração de créditos.", axis: "financeiro" }); a4 += 8;
  }

  // ─── EIXO 5: GOVERNANÇA / SISTEMAS (peso 15%) ─────────────────────────
  const axis5Items: RiskItem[] = [];
  let a5 = 0;

  if (data.taxResponsible === "ninguem") {
    axis5Items.push({ level: "critico", title: "Nenhum responsável pelo tema fiscal/tributário", desc: "Sem um ponto focal, erros e omissões se acumulam. O risco operacional e de conformidade fiscal é muito alto — com impacto em múltiplas frentes da reforma.", action: "Definir imediatamente quem responde pelo tema — interno ou escritório de contabilidade com SLA definido.", axis: "governanca" }); a5 += 25;
  }
  if (data.managementAwareOfReform === "nao") {
    axis5Items.push({ level: "alto", title: "Diretoria não acompanha a reforma tributária", desc: "Sem engajamento da liderança, as decisões estratégicas e os investimentos para adaptação não serão priorizados.", action: "Apresentar briefing executivo com impactos financeiros quantificados e cronograma de adaptação.", axis: "governanca" }); a5 += 20;
  }
  if (data.preparationStarted === "nao") {
    axis5Items.push({ level: "alto", title: "Preparação para a reforma ainda não iniciada", desc: "Com a implantação começando em 2026, empresas que não iniciaram a preparação perdem vantagem competitiva crescente.", action: "Criar grupo de trabalho interno com cronograma de adaptação e pontos de controle mensais.", axis: "governanca" }); a5 += 18;
  }
  if (data.hadInternalTraining === "nao") {
    axis5Items.push({ level: "moderado", title: "Equipe sem treinamento sobre a reforma", desc: "Sem treinamento, erros operacionais aumentam na transição — NF errada, crédito perdido, retrabalho fiscal.", action: "Planejar treinamento para as equipes fiscal, comercial e financeira antes do 2º semestre de 2025.", axis: "governanca" }); a5 += 12;
  }
  // Regra 10: nunca preparou + nunca treinou = urgência global
  if (neverPrepared) {
    axis5Items.push({ level: "critico", title: "Zero preparação e zero treinamento — urgência máxima", desc: "A combinação de empresa sem preparação iniciada e sem treinamento de equipe representa o maior grau de exposição operacional.", action: "Iniciar imediatamente: (1) definir responsável, (2) levantar impacto e (3) criar cronograma de adaptação.", axis: "governanca" }); a5 += 15;
  }
  // Regra 9: sem responsável de ERP
  if (data.internalERPResponsible === "nao") {
    axis5Items.push({ level: "moderado", title: "Sem responsável interno pelo sistema (ERP)", desc: "Sem ponto focal de TI/sistemas, a atualização do ERP para IBS/CBS pode ser postergada indefinidamente.", action: "Designar responsável interno para acompanhar a adaptação do ERP e cobrar cronograma do fornecedor.", axis: "governanca" }); a5 += 10;
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

  if (data.hasMarketplace === "sim") {
    actions.push({ id: "marketplace_reform", phase: 2, priority: "alta", eixo: "Comercial / Contratos", title: "Contatar marketplace sobre adaptação e Split Payment", desc: "Solicite ao marketplace: (1) plano de adaptação para IBS/CBS, (2) como funcionará o Split Payment na plataforma, (3) nova forma de repasse ao vendedor.", motivo: "O marketplace precisará adaptar o sistema de repasse. Sem clareza sobre como o Split Payment funcionará lá, o caixa é imprevisível.", prazo: "30 a 60 dias", responsavel: "Comercial / TI", source: "Opera em marketplace: Sim", confianca: "verde" });
  }

  if (data.hasExports === "sim") {
    actions.push({ id: "export_rules", phase: 2, priority: "media", eixo: "Compras / Créditos", title: "Verificar imunidade e ressarcimento de créditos de exportação", desc: "Confirme com o contador: (1) quais operações têm imunidade total de IBS/CBS, (2) como solicitar ressarcimento de créditos acumulados, (3) prazo de retorno.", motivo: "Exportações têm imunidade do IBS/CBS e créditos ressarcíveis. Isso pode melhorar o caixa — mas exige processo formal.", prazo: "30 a 60 dias", responsavel: "Fiscal / Contador", source: "Exportações: Sim — imunidade IBS/CBS identificada", confianca: "verde" });
  }

  if (data.hasGovernmentContracts === "sim") {
    actions.push({ id: "gov_contracts", phase: 2, priority: "alta", eixo: "Comercial / Contratos", title: "Analisar contratos públicos para revisão de equilíbrio", desc: "Para cada contrato com órgão público, verifique: (1) cláusula de equilíbrio econômico-financeiro, (2) possibilidade de pedido de revisão por mudança tributária, (3) prazo para protocolo.", motivo: "A nova carga pode romper o equilíbrio de contratos licitatórios. O pedido de revisão precisa ser protocolado dentro do prazo.", prazo: "30 a 60 dias", responsavel: "Jurídico", source: "Contratos com órgãos públicos: Sim", confianca: "verde" });
  }

  if (isSimples && isB2B) {
    actions.push({ id: "simples_option", phase: 2, priority: "media", eixo: "Fiscal / Documental", title: "Avaliar opção por apuração de IBS/CBS no regime regular", desc: "Consulte o contador: a LC 214/2025 prevê que empresas do Simples podem optar por apurar o IBS/CBS fora do DAS. Essa opção pode ampliar a transferência de crédito para clientes B2B. Avalie o custo-benefício no seu caso concreto.", motivo: "A opção de apuração no regime regular pode gerar mais crédito ao adquirente, tornando a empresa mais competitiva no mercado B2B. A análise deve ser personalizada.", prazo: "30 a 60 dias", responsavel: "Contador", source: "Regime: Simples Nacional · Operação: B2B", confianca: "verde" });
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

  actions.push({ id: "final_validation", phase: 3, priority: "alta", eixo: "Governança / Sistemas", title: "Reunião de validação final com contador antes de 2026", desc: "Use este checklist: ☐ ERP atualizado e testado; ☐ Cadastros corretos (NCM/NBS, regimes); ☐ Contratos revisados; ☐ Política de preços publicada; ☐ Equipe treinada; ☐ Split Payment simulado.", motivo: "A validação final garante que nenhum ponto crítico foi esquecido antes da virada para o novo regime em 2026.", prazo: "60 a 120 dias", responsavel: "Contador / Diretoria", source: "Validação estruturante para todos os perfis", confianca: "verde" });

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
  const [showInfractions, setShowInfractions] = useState(false);
  const [openInfraction, setOpenInfraction] = useState<string | null>(null);

  useEffect(() => {
    if (companyId && screen === 0) {
      const d = computeRisk(data);
      setDiagnosis(d);
      setPlan(generatePlan(data, d));
      setScreen(8);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [screen]);

  const progressPct = screen >= 1 && screen <= INPUT_SCREENS ? ((screen - 1) / (INPUT_SCREENS - 1)) * 100 : screen > INPUT_SCREENS ? 100 : 0;

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
    { id: "agronegocio", label: "Agronegócio", icon: Tractor, desc: "Produção rural, cooperativas" },
    { id: "outros", label: "Outros / Não listado", icon: Building, desc: "Serviços, construção, transporte, etc." },
  ];

  const screenSubtitle: Record<number, string> = {
    1: "Identifique a empresa e o responsável pelo tema. Esses dados vinculam todo o diagnóstico.",
    2: "Perfil tributário e operacional — base do cálculo de risco.",
    3: "Como a empresa vai ao mercado determina a estratégia comercial pós-reforma.",
    4: "O perfil de compras define os créditos tributários que a empresa pode aproveitar.",
    5: "A adequação dos sistemas fiscais é obrigatória — a NF-e exigirá novos campos em 2026.",
    6: "A saúde financeira e o acompanhamento do Split Payment definem o nível de atenção necessário para o fluxo de caixa.",
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
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 max-w-screen-lg items-center justify-between px-4 md:px-6">
          <a href="/inicio" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-lg"><Building2 className="h-4 w-4 text-primary" /></div>
            <span className="font-heading font-bold uppercase tracking-wider text-xs sm:text-sm">REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO</span>
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
                  <p className="text-sm text-muted-foreground">Responda as perguntas sobre seu negócio. O plano de ação e o PDF são gerados automaticamente ao final — não antes.</p>
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
                          <input id="companyName" data-testid="input-company-name" className={inputClass} placeholder="Ex: Distribuidora Norte LTDA" value={data.companyName === "Minha Empresa" ? "" : data.companyName} onChange={(e) => { updateData("companyName", e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusAndScroll("nomeFantasia"); } }} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nomeFantasia" className="font-bold">Nome Fantasia <span className="font-normal text-muted-foreground">(opcional)</span></Label>
                          <input id="nomeFantasia" className={inputClass} placeholder="Ex: Distribuidora Norte" value={data.nomeFantasia} onChange={(e) => updateData("nomeFantasia", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusAndScroll("cnpj"); } }} />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cnpj" className="font-bold">CNPJ <span className="font-normal text-muted-foreground">(opcional)</span></Label>
                          <input id="cnpj" data-testid="input-cnpj" className={inputClass} placeholder="00.000.000/0000-00" value={data.cnpj} onChange={(e) => { updateData("cnpj", formatCNPJ(e.target.value)); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusAndScroll("cnaeCode"); } }} />
                          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cnaeCode" className="font-bold">CNAE Principal <span className="font-normal text-muted-foreground">(opcional)</span></Label>
                          <input id="cnaeCode" className={inputClass} placeholder="Ex: 4711-3/02 — Supermercados" value={data.cnaeCode} onChange={(e) => updateData("cnaeCode", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusAndScroll("municipio"); } }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4" id="section-localizacao">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">B — Localização da Sede</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="font-bold">Estado</Label>
                          <Select value={data.estado} onValueChange={(v) => { updateData("estado", v); focusAndScroll("municipio"); }} data-testid="select-estado">
                            <SelectTrigger><SelectValue placeholder="Selecione o estado" /></SelectTrigger>
                            <SelectContent>{ESTADOS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="municipio" className="font-bold">Município</Label>
                          <input id="municipio" className={inputClass} placeholder="Ex: São Paulo" value={data.municipio} onChange={(e) => updateData("municipio", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusAndScroll("contactName"); } }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4" id="section-responsavel">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">C — Responsável pela Adaptação</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactName" className="font-bold">Nome do Responsável</Label>
                          <input id="contactName" data-testid="input-contact-name" className={inputClass} placeholder="Ex: Ana Silva" value={data.contactName} onChange={(e) => updateData("contactName", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusAndScroll("contactRole"); } }} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactRole" className="font-bold">Cargo / Função</Label>
                          <input id="contactRole" className={inputClass} placeholder="Ex: Gerente Financeiro" value={data.contactRole} onChange={(e) => updateData("contactRole", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusAndScroll("contactEmail"); } }} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail" className="font-bold">E-mail</Label>
                          <input id="contactEmail" type="email" className={inputClass} placeholder="responsavel@empresa.com.br" value={data.contactEmail} onChange={(e) => updateData("contactEmail", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); focusAndScroll("contactPhone"); } }} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone" className="font-bold">Telefone / WhatsApp</Label>
                          <input id="contactPhone" className={inputClass} placeholder="(11) 99999-9999" value={data.contactPhone} onChange={(e) => updateData("contactPhone", formatPhone(e.target.value))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); scrollToContinuar(); } }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {screen === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3" data-question="sector">
                      <Label className="font-bold">Setor / Atividade Principal</Label>
                      <RadioGroup value={data.sector} onValueChange={(v) => { updateData("sector", v); scrollToNext("sector"); }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

                    <div className="space-y-3" data-question="regime">
                      <Label className="font-bold">Como sua empresa paga impostos hoje?</Label>
                      <RadioGroup value={data.regime} onValueChange={(v) => { updateData("regime", v); scrollToNext("regime"); }} className="flex flex-col space-y-2">
                        <RadioRow field="regime" val="simples" label="Simples Nacional" desc="Recolhimento unificado em guia DAS" />
                        <RadioRow field="regime" val="lucro_presumido" label="Lucro Presumido" desc="PIS/COFINS cumulativos, IRPJ/CSLL por presunção" />
                        <RadioRow field="regime" val="lucro_real" label="Lucro Real" desc="PIS/COFINS não-cumulativos, apuração pelo resultado real" />
                      </RadioGroup>
                      {data.regime === "simples" && (
                        <Alert className="bg-blue-50 border-blue-200">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-xs text-blue-700">Para empresas do Simples que vendem para outras empresas (B2B), a LC 214/2025 prevê a possibilidade de optar por apurar o IBS/CBS no regime regular — o que pode ampliar a transferência de crédito ao adquirente. Esta opção deve ser analisada caso a caso com o contador.</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4" data-question="scale">
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
                        <Select value={data.establishmentCount} onValueChange={(v) => { updateData("establishmentCount", v); scrollToNext("scale"); }}>
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

                    <div className="space-y-3" data-question="businessType">
                      <Label className="font-bold">A empresa vende principalmente:</Label>
                      <RadioGroup value={data.businessType} onValueChange={(v) => { updateData("businessType", v); scrollToNext("businessType"); }} className="flex flex-col space-y-2">
                        <RadioRow field="businessType" val="produtos" label="Produtos / Mercadorias" desc="Estoque físico, revenda, manufactura" />
                        <RadioRow field="businessType" val="servicos" label="Serviços" desc="Prestação de serviços, consultoria, mão de obra" />
                        <RadioRow field="businessType" val="ambos" label="Produtos e Serviços (misto)" desc="Combinação de venda de mercadoria com serviços" />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="geographicScope">
                      <Label className="font-bold">Área geográfica de atuação</Label>
                      <RadioGroup value={data.geographicScope} onValueChange={(v) => { updateData("geographicScope", v); if (v === "local") updateData("salesStates", []); else if (v === "nacional") updateData("salesStates", ["national"]); scrollToNext("geographicScope"); }} className="flex flex-col space-y-2">
                        <RadioRow field="geographicScope" val="local" label="Apenas no meu estado" desc="Operação concentrada em uma UF" />
                        <RadioRow field="geographicScope" val="regional" label="Em 2 a 5 estados" desc="Operação regional" />
                        <RadioRow field="geographicScope" val="nacional" label="Nacional / E-commerce para todo o Brasil" desc="O IBS envolve componente por estado/município de destino — exige parametrização correta no sistema" />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="specialRegimes">
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
                    <div className="space-y-3" data-question="operations">
                      <Label className="font-bold">Para quem a empresa vende principalmente?</Label>
                      <RadioGroup value={data.operations} onValueChange={(v) => { updateData("operations", v); scrollToNext("operations"); }} className="flex flex-col space-y-2">
                        <RadioRow field="operations" val="b2b" label="Para outras empresas (B2B)" desc="Clientes corporativos que aproveitam créditos de imposto." />
                        <RadioRow field="operations" val="b2c" label="Para o consumidor final (B2C)" desc="Pessoas físicas, sem aproveitamento de crédito." />
                        <RadioRow field="operations" val="b2b_b2c" label="Para ambos (B2B + B2C)" desc="Mix de clientes empresariais e consumidores finais." />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="salesChannels">
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

                    <div className="space-y-3" data-question="multiMunicipality">
                      <Label className="font-bold">A empresa presta serviços em mais de um município?</Label>
                      <RadioGroup value={data.multiMunicipality} onValueChange={(v) => { updateData("multiMunicipality", v); scrollToNext("multiMunicipality"); }} className="flex flex-col space-y-2">
                        <RadioRow field="multiMunicipality" val="sim" label="Sim, atuamos em vários municípios" desc="O IBS de serviços é calculado pelo município de destino." />
                        <RadioRow field="multiMunicipality" val="nao" label="Não, atuamos em um único município" />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="hasLongTermContracts">
                      <Label className="font-bold">A empresa tem contratos de longo prazo (acima de 12 meses)?</Label>
                      <RadioGroup value={data.hasLongTermContracts} onValueChange={(v) => { updateData("hasLongTermContracts", v); scrollToNext("hasLongTermContracts"); }} className="flex flex-col space-y-2">
                        <RadioRow field="hasLongTermContracts" val="sim" label="Sim, temos contratos acima de 12 meses" />
                        <RadioRow field="hasLongTermContracts" val="nao" label="Não, trabalhamos com pedidos avulsos ou contratos curtos" />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="priceSensitivity">
                      <Label className="font-bold">Os preços da empresa são mais sensíveis a:</Label>
                      <RadioGroup value={data.priceSensitivity} onValueChange={(v) => { updateData("priceSensitivity", v); scrollToNext("priceSensitivity"); }} className="flex flex-col space-y-2">
                        <RadioRow field="priceSensitivity" val="mercado" label="Mercado / concorrência" desc="O preço é ditado pelo que o mercado pratica." />
                        <RadioRow field="priceSensitivity" val="margem" label="Margem interna" desc="O preço é calculado sobre custo + margem desejada." />
                        <RadioRow field="priceSensitivity" val="contrato" label="Contrato / tabela fixa" desc="Preços negociados e travados em contrato." />
                        <RadioRow field="priceSensitivity" val="licitacao" label="Licitação / pregão" desc="Preços definidos em processo licitatório público." />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="additionalSituations">
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
                    <div className="grid sm:grid-cols-2 gap-4" data-question="supplierGrid">
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
                        <Select value={data.simplesSupplierPercent} onValueChange={(v) => { updateData("simplesSupplierPercent", v); scrollToNext("supplierGrid"); }} data-testid="select-simples-percent">
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
                        <AlertDescription className="text-xs text-amber-700"><strong>Atenção:</strong> Fornecedores do Simples tendem a transferir menos crédito de IBS/CBS do que fornecedores do regime regular. O impacto exato depende da sistemática legal aplicável — isso será um tema prioritário no seu plano.</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-3" data-question="hasRegularNF">
                      <Label className="font-bold">A empresa compra regularmente com nota fiscal?</Label>
                      <RadioGroup value={data.hasRegularNF} onValueChange={(v) => { updateData("hasRegularNF", v); scrollToNext("hasRegularNF"); }} className="flex flex-col space-y-2">
                        <RadioRow field="hasRegularNF" val="sim" label="Sim, todas as compras têm NF" />
                        <RadioRow field="hasRegularNF" val="parcialmente" label="Parcialmente — algumas compras sem NF" desc="Compras informais não geram crédito de IBS/CBS." />
                        <RadioRow field="hasRegularNF" val="nao" label="Não, muitas compras sem nota fiscal" desc="Toda a carga tributária fica como custo puro." highlight />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="mainExpenses">
                      <Label className="font-bold">Quais despesas/compras têm maior peso na operação?</Label>
                      <p className="text-xs text-muted-foreground">Selecione todas que representam custo relevante.</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <CheckRow field="mainExpenses" val="mercadorias" label="Estoque e mercadorias para revenda" desc="Tende a gerar crédito de IBS/CBS quando acompanhado de documentação fiscal adequada" />
                        <CheckRow field="mainExpenses" val="folha" label="Folha de pagamento e encargos" desc="Não gera crédito de IBS/CBS — exige atenção à margem e à precificação" />
                        <CheckRow field="mainExpenses" val="logistica" label="Logística e frete" desc="Gera crédito pelo CT-e do transportador" />
                        <CheckRow field="mainExpenses" val="tecnologia" label="Tecnologia e licenças de software" desc="Gera crédito se fornecedor for PJ" />
                        <CheckRow field="mainExpenses" val="aluguel" label="Aluguel e ocupação" desc="Gera crédito apenas se locador for PJ" />
                        <CheckRow field="mainExpenses" val="servicos_pj" label="Serviços de terceiros / PJ" desc="Tende a gerar crédito de IBS/CBS quando contratado de PJ com documentação adequada" />
                      </div>
                      {data.mainExpenses.includes("folha") && (
                        <Alert className="bg-red-50 border-red-200">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-xs text-red-700"><strong>Atenção:</strong> Empresas com custo concentrado em folha de pagamento podem ter menor potencial de creditamento de IBS/CBS sobre seus custos, exigindo maior atenção à margem e à precificação no novo regime.</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-3" data-question="hasNFErrors">
                      <Label className="font-bold">As notas fiscais recebidas têm erros de cadastro com frequência?</Label>
                      <RadioGroup value={data.hasNFErrors} onValueChange={(v) => { updateData("hasNFErrors", v); scrollToNext("hasNFErrors"); }} className="flex flex-col space-y-2">
                        <RadioRow field="hasNFErrors" val="raramente" label="Raramente ou nunca" />
                        <RadioRow field="hasNFErrors" val="as_vezes" label="Às vezes — corrigimos quando necessário" />
                        <RadioRow field="hasNFErrors" val="frequente" label="Com frequência — é um problema recorrente" desc="Erros de NF comprometem o aproveitamento de créditos de IBS/CBS." highlight />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="hasImports">
                      <Label className="font-bold">A empresa importa produtos ou insumos?</Label>
                      <RadioGroup value={data.hasImports} onValueChange={(v) => { updateData("hasImports", v); scrollToNext("hasImports"); }} className="flex flex-col space-y-2">
                        <RadioRow field="hasImports" val="sim" label="Sim, importamos regularmente" desc="Importações têm regras específicas de IBS/CBS — exige análise." />
                        <RadioRow field="hasImports" val="ocasional" label="Ocasionalmente" />
                        <RadioRow field="hasImports" val="nao" label="Não importamos" />
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {screen === 5 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3" data-question="erpSystem">
                      <Label className="font-bold">Sistema de gestão (ERP) utilizado</Label>
                      <Select value={data.erpSystem} onValueChange={(v) => { updateData("erpSystem", v); scrollToNext("erpSystem"); }} data-testid="select-erp">
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
                          <AlertDescription className="text-xs text-red-700"><strong>Risco crítico:</strong> A adaptação ao novo modelo exige revisão do sistema, da emissão fiscal e dos cadastros. Processos muito manuais elevam bastante o risco operacional — este será o primeiro item do seu plano.</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-3" data-question="nfeEmission">
                      <Label className="font-bold">Como a empresa emite documentos fiscais?</Label>
                      <RadioGroup value={data.nfeEmission} onValueChange={(v) => { updateData("nfeEmission", v); scrollToNext("nfeEmission"); }} className="flex flex-col space-y-2">
                        <RadioRow field="nfeEmission" val="sistema_integrado" label="Sistema integrado automático" desc="O ERP emite a NF-e automaticamente." />
                        <RadioRow field="nfeEmission" val="emissor_gratuito" label="Emissor gratuito ou portal SEFAZ" desc="Emissão manual via site do estado." />
                        <RadioRow field="nfeEmission" val="contador" label="O contador faz tudo" desc="Delega toda a emissão ao escritório contábil." />
                      </RadioGroup>
                    </div>

                    <div className="space-y-3" data-question="fiscalDocTypes">
                      <Label className="font-bold">Documentos fiscais que a empresa emite</Label>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <CheckRow field="fiscalDocTypes" val="nfe" label="NF-e" desc="Nota Fiscal de mercadorias" />
                        <CheckRow field="fiscalDocTypes" val="nfse" label="NFS-e" desc="Nota Fiscal de serviços" />
                        <CheckRow field="fiscalDocTypes" val="nfce" label="NFC-e" desc="Cupom Fiscal Eletrônico (varejo)" />
                        <CheckRow field="fiscalDocTypes" val="cte" label="CT-e" desc="Conhecimento de Transporte" />
                      </div>
                    </div>

                    <div className="space-y-2" data-question="invoiceVolume">
                      <Label className="font-bold">Volume médio mensal de documentos fiscais emitidos</Label>
                      <Select value={data.invoiceVolume} onValueChange={(v) => { updateData("invoiceVolume", v); scrollToNext("invoiceVolume"); }} data-testid="select-invoice-volume">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ate_50">Até 50 documentos/mês</SelectItem>
                          <SelectItem value="ate_100">50 a 100</SelectItem>
                          <SelectItem value="ate_500">100 a 500</SelectItem>
                          <SelectItem value="acima_500">Acima de 500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4" data-question="erpGrid1">
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
                        <RadioGroup value={data.erpVendorReformPlan} onValueChange={(v) => { updateData("erpVendorReformPlan", v); scrollToNext("erpGrid1"); }} className="flex flex-col space-y-2">
                          <RadioRow field="erpVendorReformPlan" val="sim_cronograma" label="Sim, com cronograma definido" />
                          <RadioRow field="erpVendorReformPlan" val="sim_sem_prazo" label="Falou, mas sem prazo concreto" />
                          <RadioRow field="erpVendorReformPlan" val="nao_sei" label="Ainda não perguntamos" />
                          <RadioRow field="erpVendorReformPlan" val="nao" label="Disse que ainda não tem previsão" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4" data-question="erpGrid2">
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
                        <RadioGroup value={data.internalFiscalResponsible} onValueChange={(v) => { updateData("internalFiscalResponsible", v); scrollToNext("erpGrid2"); }} className="flex flex-col space-y-2">
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
                    <div className="space-y-3" data-question="paymentMethods">
                      <Label className="font-bold">Principais meios de recebimento</Label>
                      <p className="text-xs text-muted-foreground">Selecione todos que a empresa utiliza. O Split Payment prevê retenção do imposto nos meios de pagamento — acompanhe a regulamentação específica por modalidade.</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <CheckRow field="paymentMethods" val="pix" label="PIX" desc="Previsto no escopo do Split Payment — confirmar regulamentação" />
                        <CheckRow field="paymentMethods" val="cartao_credito" label="Cartão de crédito" desc="Previsto no escopo do Split Payment — confirmar com adquirente" />
                        <CheckRow field="paymentMethods" val="cartao_debito" label="Cartão de débito" desc="Previsto no escopo do Split Payment — confirmar com adquirente" />
                        <CheckRow field="paymentMethods" val="boleto" label="Boleto bancário" desc="Previsto no escopo do Split Payment — regras em regulamentação" />
                        <CheckRow field="paymentMethods" val="transferencia" label="Transferência bancária / TED" desc="Verificar se há regras específicas de Split Payment" />
                        <CheckRow field="paymentMethods" val="prazo_proprio" label="Venda a prazo / crediário próprio" desc="Regras de Split Payment ainda em regulamentação" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4" data-question="paymentGrid">
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
                        <Select value={data.profitMargin} onValueChange={(v) => { updateData("profitMargin", v); scrollToNext("paymentGrid"); }} data-testid="select-margin">
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

                    <div className="grid sm:grid-cols-2 gap-4" data-question="workingCapitalGrid">
                      <div className="space-y-3">
                        <Label className="font-bold">O capital de giro é apertado?</Label>
                        <RadioGroup value={data.tightWorkingCapital} onValueChange={(v) => updateData("tightWorkingCapital", v)} className="flex flex-col space-y-2">
                          <RadioRow field="tightWorkingCapital" val="sim" label="Sim, operamos no limite" desc="A sistemática do Split Payment pode reduzir o valor disponível em determinadas operações — atenção redobrada ao caixa." highlight />
                          <RadioRow field="tightWorkingCapital" val="parcial" label="Às vezes — sazonalidade" />
                          <RadioRow field="tightWorkingCapital" val="nao" label="Não, temos folga de caixa" />
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold">A empresa consegue reajustar preços com facilidade?</Label>
                        <RadioGroup value={data.easePriceAdjustment} onValueChange={(v) => { updateData("easePriceAdjustment", v); scrollToNext("workingCapitalGrid"); }} className="flex flex-col space-y-2">
                          <RadioRow field="easePriceAdjustment" val="sim" label="Sim, ajustamos conforme necessário" />
                          <RadioRow field="easePriceAdjustment" val="parcial" label="Parcialmente — depende do cliente" />
                          <RadioRow field="easePriceAdjustment" val="dificil" label="Difícil — mercado muito sensível" desc="Elevações de carga serão absorvidas como redução de margem." />
                          <RadioRow field="easePriceAdjustment" val="impossivel" label="Impossível — contratos ou licitações fixos" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4" data-question="marginGrid">
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
                        <p className="text-xs text-muted-foreground">Mecanismo legal previsto na LC 227/2026 que prevê retenção do imposto na liquidação financeira. A implementação operacional depende de regulamentação específica por meio de pagamento.</p>
                        <RadioGroup value={data.splitPaymentAware} onValueChange={(v) => { updateData("splitPaymentAware", v); scrollToNext("marginGrid"); }} className="flex flex-col space-y-2">
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
                      <div className="space-y-3" data-question="priceRevisionClause">
                        <Label className="font-bold">Os contratos de longo prazo têm cláusula de revisão por mudança tributária?</Label>
                        <p className="text-xs text-muted-foreground">A LC 214/2025 prevê mecanismos de revisão contratual por desequilíbrio causado pela reforma. Consulte advogado especializado para análise do seu contrato específico.</p>
                        <RadioGroup value={data.priceRevisionClause} onValueChange={(v) => { updateData("priceRevisionClause", v); scrollToNext("priceRevisionClause"); }} className="flex flex-col space-y-2">
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

                    <div className="space-y-3" data-question="taxResponsible">
                      <Label className="font-bold">Quem cuida do fiscal e tributário hoje?</Label>
                      <Select value={data.taxResponsible} onValueChange={(v) => { updateData("taxResponsible", v); scrollToNext("taxResponsible"); }} data-testid="select-tax-responsible">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contador_externo">Escritório de contabilidade externo</SelectItem>
                          <SelectItem value="contador_interno">Contador ou analista fiscal interno</SelectItem>
                          <SelectItem value="dono">O próprio dono ou sócio</SelectItem>
                          <SelectItem value="ninguem">Ninguém — esta reforma será o ponto de partida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4" data-question="erpResponsibleGrid">
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
                        <RadioGroup value={data.managementAwareOfReform} onValueChange={(v) => { updateData("managementAwareOfReform", v); scrollToNext("erpResponsibleGrid"); }} className="flex flex-col space-y-2">
                          <RadioRow field="managementAwareOfReform" val="sim" label="Sim, está acompanhando ativamente" />
                          <RadioRow field="managementAwareOfReform" val="parcialmente" label="Conhece superficialmente" />
                          <RadioRow field="managementAwareOfReform" val="nao" label="Não acompanha" desc="Sem engajamento da liderança, a adaptação fica sem prioridade." />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4" data-question="preparationGrid">
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
                        <RadioGroup value={data.hadInternalTraining} onValueChange={(v) => { updateData("hadInternalTraining", v); scrollToNext("preparationGrid"); }} className="flex flex-col space-y-2">
                          <RadioRow field="hadInternalTraining" val="sim_completo" label="Sim, equipe treinada" />
                          <RadioRow field="hadInternalTraining" val="sim_parcial" label="Parcialmente — alguns colaboradores" />
                          <RadioRow field="hadInternalTraining" val="nao" label="Não houve treinamento ainda" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4" data-question="maturityGrid">
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
                        <Select value={data.mainConcern} onValueChange={(v) => { updateData("mainConcern", v); scrollToNext("maturityGrid"); }} data-testid="select-concern">
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
                { phase: 1, title: "Fase 1 — Ações Imediatas", subtitle: criticalCount > 0 ? `7 a 15 dias — ${criticalCount} risco(s) crítico(s) a resolver` : "7 a 15 dias — base para toda a transição", color: "bg-red-600", actions: phase1Actions },
                { phase: 2, title: "Fase 2 — Curto Prazo", subtitle: "30 a 60 dias — organizar processos e dados fiscais", color: "bg-amber-500", actions: phase2Actions },
                { phase: 3, title: "Fase 3 — Ações Estruturantes", subtitle: "60 a 120 dias — estruturar, testar e validar", color: "bg-primary", actions: phase3Actions },
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
                      const confiancaCfg = {
                        verde:    { dot: "bg-green-500",  label: "Baseado em resposta direta" },
                        amarelo:  { dot: "bg-amber-400",  label: "Conclusão derivada" },
                        laranja:  { dot: "bg-orange-500", label: "Dado parcial" },
                        vermelho: { dot: "bg-red-500",    label: "Risco identificado" },
                      };
                      const conf = action.confianca ? confiancaCfg[action.confianca] : null;
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
                                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">{action.eixo}</Badge>
                                </div>
                                <p className="text-xs font-medium text-foreground mt-1">{action.desc}</p>
                                <p className="text-xs text-muted-foreground mt-1 italic">Motivo: {action.motivo}</p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{action.prazo}</span>
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" />{action.responsavel}</span>
                                </div>
                                {action.source && (
                                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-muted/50">
                                    {conf && <span className={`h-2 w-2 rounded-full shrink-0 ${conf.dot}`} />}
                                    <span className="text-[10px] text-muted-foreground">Com base em: {action.source}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* ===== INFRAÇÕES E PENALIDADES BLOCK ===== */}
              {(() => {
                const hasNoERP = data.erpSystem === "nenhum" || data.erpSystem === "planilha";
                const operatesWithoutNF = data.hasRegularNF === "nao" || data.hasRegularNF === "parcialmente";
                const hasNFErrorsFlag = data.hasNFErrors === "frequente" || data.hasNFErrors === "as_vezes";
                const hasMarketplaceFlag = data.hasMarketplace === "sim";
                const hasImportExport = data.hasImports === "sim" || data.hasImports === "ocasional" || data.hasExports === "sim";
                const noFiscalPerson = data.internalFiscalResponsible === "nao";
                const hasReturns = data.hasFrequentReturns === "sim";

                // Grupos com risco elevado para este perfil
                const groupRisks = {
                  g1: hasNoERP || hasMarketplaceFlag,           // Falhas documentais
                  g2: noFiscalPerson,                            // Cadastro e conformidade
                  g3: operatesWithoutNF || hasNFErrorsFlag,      // Documento fiscal irregular
                  g4: hasNFErrorsFlag || hasImportExport || hasReturns, // Crédito e devoluções
                };
                const totalHighlighted = Object.values(groupRisks).filter(Boolean).length;

                const overallRisk = diagnosis?.overallScore ?? 0;
                const isPreventionMode = overallRisk < 30 && totalHighlighted === 0;

                const checklist = [
                  { text: "Inscrição cadastral atualizada no Comitê Gestor do IBS e na RFB (CBS)", done: data.internalFiscalResponsible !== "nao" },
                  { text: "Domicílio fiscal principal informado e atualizado", done: !!(data.municipio && data.estado) },
                  { text: "NFs emitidas e recebidas dentro dos padrões legais vigentes", done: data.hasRegularNF === "sim" && data.hasNFErrors !== "frequente" },
                  { text: "Política de cancelamento e eventos documentais com prazos definidos", done: data.erpSystem !== "nenhum" && data.erpSystem !== "planilha" },
                  { text: "Rotina de conferência e validação antes da transmissão de declarações", done: data.erpSystem !== "nenhum" && data.erpSystem !== "planilha" },
                  { text: "Situação cadastral dos fornecedores validada regularmente", done: data.catalogStandardized === "sim" || data.catalogStandardized === "parcial" },
                  { text: "Responsável por compliance fiscal designado", done: data.internalFiscalResponsible === "sim" || data.internalFiscalResponsible === "compartilhado" },
                  { text: "Processo documentado para devoluções, retornos e desfazimentos", done: data.hasFrequentReturns !== "sim" },
                  { text: "Obrigações de importação/exportação mapeadas com o setor fiscal", done: data.hasImports === "nao" && data.hasExports !== "sim" },
                  { text: "Equipe orientada para atender fiscalização e apresentar documentação", done: data.hadInternalTraining !== "nao" },
                ];
                const doneCount = checklist.filter(c => c.done).length;

                // ── 4 thematic group cards ─────────────────────────────────────
                const GROUPS = [
                  {
                    id: "g1",
                    title: "Falhas documentais",
                    subtitle: "Declarações, arquivos digitais e eventos de NF",
                    Icon: ClipboardList,
                    hl: groupRisks.g1,
                    hlMsg: hasNoERP
                      ? "Sem ERP integrado, a entrega de declarações e eventos fiscais dentro do prazo fica fragilizada — ponto de atenção para este perfil."
                      : "Operação em marketplace exige controle rigoroso de eventos fiscais e conciliação documental.",
                    base: "LC 214/2025, Cap. IV — Categorias D, G e Q",
                    items: [
                      {
                        letra: "D",
                        label: "Atraso ou erro em declarações e arquivos fiscais",
                        risco: "Declaração de IBS/CBS transmitida com atraso, com campos incorretos ou omissa. É causa frequente de auto de infração acessório.",
                        como: "Rotina de conferência pré-transmissão com validação pelo sistema e revisão com o contador antes do envio.",
                      },
                      {
                        letra: "G",
                        label: "Eventos de documentos fiscais fora do prazo",
                        risco: "Cancelamento, carta de correção ou inutilização de NF-e registrados fora do prazo regulamentar.",
                        como: "Alertas automáticos no ERP com prazo máximo de cancelamento; política interna de eventos documentais.",
                      },
                      {
                        letra: "Q",
                        label: "Contingência com valor divergente",
                        risco: "NF emitida em contingência com valor ou dados diferentes da declaração prévia enviada ao fisco.",
                        como: "Validar e transmitir o documento definitivo imediatamente após o retorno da conectividade.",
                      },
                    ],
                  },
                  {
                    id: "g2",
                    title: "Cadastro e conformidade operacional",
                    subtitle: "Inscrições, atualizações e deveres instrumentais",
                    Icon: Building2,
                    hl: groupRisks.g2,
                    hlMsg: "Sem responsável fiscal dedicado, prazos cadastrais e obrigações acessórias tendem a ser descumpridos — risco significativo para este perfil.",
                    base: "LC 214/2025, Cap. IV — Categorias A, B, C, E, F, I, S e T",
                    items: [
                      {
                        letra: "A · B · C",
                        label: "Inscrição, atualização e encerramento cadastral",
                        risco: "Não se inscrever no cadastro do IBS/CBS no prazo, não comunicar alterações de dados, ou encerrar o estabelecimento sem a baixa formal.",
                        como: "Definir responsável pelo cadastro fiscal e estabelecer rotina de verificação a cada alteração societária, de endereço ou de atividade.",
                      },
                      {
                        letra: "E · F",
                        label: "Softwares fiscais e equipamentos de medição",
                        risco: "Uso de emissor de NF-e sem homologação, sistema paralelo não validado, ou equipamentos de medição (balanças, medidores) sem lacre ou calibração.",
                        como: "Confirmar com o fornecedor do ERP a homologação dos sistemas; manter equipamentos com calibração e documentação de homologação vigente.",
                      },
                      {
                        letra: "I · S · T",
                        label: "Fiscalização, trânsito e ZFM",
                        risco: "Impedir ou dificultar agente fiscal; violar lacres em unidades de carga; descumprir obrigações específicas da Zona Franca de Manaus ou Áreas de Livre Comércio.",
                        como: "Designar responsável para atender fiscalizações; treinar a equipe de logística; mapear obrigações específicas da ZFM com assessoria especializada.",
                      },
                    ],
                  },
                  {
                    id: "g3",
                    title: "Documentos fiscais irregulares",
                    subtitle: "Operações sem nota, documentos inválidos e cancelamentos",
                    Icon: FileText,
                    hl: groupRisks.g3,
                    hlMsg: operatesWithoutNF
                      ? "Compras ou vendas sem nota fiscal colocam a empresa na situação de operação desacobertada — uma das infrações mais frequentes em fiscalizações."
                      : "Erros frequentes em NF recebida aumentam o risco de aceitar documento não idôneo ou reutilizado.",
                    base: "LC 214/2025, Cap. IV — Categorias J, K, L, M, O e P",
                    items: [
                      {
                        letra: "J · O",
                        label: "Operação sem documento fiscal",
                        risco: "Venda ou prestação de serviço sem NF emitida; entrada de mercadoria de produtor rural ou importação sem NF de entrada quando exigida pelo destinatário.",
                        como: "Política zero de operação informal; mapear todas as hipóteses em que a empresa deve emitir NF de entrada e incluir no processo.",
                      },
                      {
                        letra: "K · L · M",
                        label: "Documento inválido, reutilizado ou adulterado",
                        risco: "Reúso de NF cancelada; aceitação de nota de fornecedor com CNPJ ou inscrição estadual cancelados; adulteração de valores em documento fiscal.",
                        como: "Controle rigoroso de numeração e status; validar situação cadastral do fornecedor antes de aceitar a nota; arquivo digital seguro e imutável.",
                      },
                      {
                        letra: "P",
                        label: "Cancelamento extemporâneo",
                        risco: "Cancelar NF-e fora do prazo regulamentar (que pode ser de horas, conforme a legislação técnica vigente).",
                        como: "Alertas automáticos no sistema; garantir que pedidos de cancelamento sejam transmitidos dentro do prazo.",
                      },
                    ],
                  },
                  {
                    id: "g4",
                    title: "Crédito indevido, devoluções e comércio exterior",
                    subtitle: "Apropriação de crédito, retornos e operações internacionais",
                    Icon: DollarSign,
                    hl: groupRisks.g4,
                    hlMsg: hasImportExport
                      ? "Importação ou exportação têm obrigações informacionais específicas no contexto do IBS/CBS — atenção para a integração entre o setor de comércio exterior e o fiscal."
                      : "Erros em NFs recebidas elevam o risco de crédito fiscal escriturado indevidamente.",
                    base: "LC 214/2025, Cap. IV — Categorias N, H e R",
                    items: [
                      {
                        letra: "N",
                        label: "Crédito fiscal apropriado indevidamente",
                        risco: "Tomar crédito de IBS/CBS sem respaldo documental, fora das condições legais, em duplicidade, ou de operação isenta ou não tributada.",
                        como: "Rotina de validação de créditos antes da escrituração; confirmar com o contador quais operações geram crédito e quais condições são exigidas.",
                      },
                      {
                        letra: "H",
                        label: "Devoluções, retornos e desfazimentos",
                        risco: "Não registrar ou emitir corretamente os documentos correspondentes a devoluções, retornos ou desfazimentos de operações.",
                        como: "Processo estruturado para devoluções com NF-e e eventos corretos; auditoria mensal de retornos versus documentos emitidos.",
                      },
                      {
                        letra: "R",
                        label: "Omissões em importação ou exportação",
                        risco: "Omitir informações ou documentos exigidos pelo fisco em operações de comércio exterior no contexto do IBS e da CBS.",
                        como: "Integrar os setores de comércio exterior e fiscal; confirmar com o contador quais obrigações informacionais se aplicam a cada operação.",
                      },
                    ],
                  },
                ];

                return (
                  <div className={`rounded-xl overflow-hidden border-2 ${isPreventionMode ? "border-green-200" : totalHighlighted > 0 ? "border-amber-300" : "border-slate-200"}`} data-testid="section-infracoes">

                    {/* ── Cabeçalho colapsável ── */}
                    <button
                      className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${isPreventionMode ? "bg-green-50 hover:bg-green-100" : totalHighlighted > 0 ? "bg-amber-50 hover:bg-amber-100" : "bg-slate-50 hover:bg-slate-100"}`}
                      onClick={() => setShowInfractions(!showInfractions)}
                      data-testid="button-toggle-infracoes"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${isPreventionMode ? "bg-green-100" : "bg-amber-100"}`}>
                          <ShieldAlert className={`h-5 w-5 ${isPreventionMode ? "text-green-700" : "text-amber-700"}`} />
                        </div>
                        <div>
                          <p className={`font-bold text-base ${isPreventionMode ? "text-green-900" : "text-amber-900"}`}>
                            {isPreventionMode ? "Prevenção e Conformidade: mantenha a organização" : "Infrações e Penalidades: o que sua empresa deve evitar"}
                          </p>
                          <p className={`text-xs mt-0.5 ${isPreventionMode ? "text-green-700" : "text-amber-700"}`}>
                            {isPreventionMode
                              ? `Seu perfil indica boa organização. Use este bloco para manter a conformidade com o IBS/CBS.`
                              : `${totalHighlighted > 0 ? `${totalHighlighted} grupo(s) de risco prioritário(s) para o seu perfil · ` : ""}Organização e controle evitam autuações — conheça os riscos e como preveni-los.`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-[10px] hidden sm:flex">{doneCount}/{checklist.length} conformes</Badge>
                        <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${showInfractions ? "rotate-90" : ""} ${isPreventionMode ? "text-green-600" : "text-amber-600"}`} />
                      </div>
                    </button>

                    {showInfractions && (
                      <div className="p-5 space-y-5 bg-white">

                        {/* ── Banner: multa de ofício ── */}
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-3">Multas por descumprimento de obrigação principal — LC 214/2025, Capítulo IV</p>
                          <div className="grid sm:grid-cols-3 gap-3">
                            {[
                              { pct: "75%", label: "Multa de ofício — caso geral", desc: "Fisco lança o tributo não recolhido e aplica 75% sobre o valor apurado.", cls: "text-orange-700" },
                              { pct: "150%", label: "Sonegação, fraude, simulação ou conluio", desc: "Quando comprovado dolo ou conluio, o percentual é majorado.", cls: "text-red-700" },
                              { pct: "Agravada", label: "Reincidência na mesma infração", desc: "A reincidência é expressamente prevista como fator de agravamento.", cls: "text-rose-700" },
                            ].map((m) => (
                              <div key={m.label} className="bg-white rounded-lg border border-red-200 p-3 flex flex-col gap-1">
                                <span className={`text-xl font-bold ${m.cls}`}>{m.pct}</span>
                                <span className="text-[11px] font-bold text-foreground leading-tight">{m.label}</span>
                                <span className="text-[11px] text-muted-foreground">{m.desc}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-red-500 mt-3 italic">Os percentuais de 75% e 150% são consagrados no ordenamento tributário brasileiro e aplicáveis ao IBS/CBS conforme o Capítulo IV da LC 214/2025. Confirme com seu contador se há dispositivo específico para o período de transição que possa alterar esses valores no seu caso.</p>
                        </div>

                        {/* ── 4 thematic group cards ── */}
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Infrações acessórias por grupo temático — LC 214/2025, Capítulo IV</p>
                          <div className="space-y-2">
                            {GROUPS.map((grp) => {
                              const isOpen = openInfraction === grp.id;
                              return (
                                <div key={grp.id} className={`rounded-lg border overflow-hidden ${grp.hl ? "border-amber-300" : "border-slate-200"}`} data-testid={`card-group-${grp.id}`}>
                                  <button
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${grp.hl ? "bg-amber-50 hover:bg-amber-100" : "bg-white hover:bg-slate-50"}`}
                                    onClick={() => setOpenInfraction(isOpen ? null : grp.id)}
                                    data-testid={`toggle-group-${grp.id}`}
                                  >
                                    <div className={`p-1.5 rounded-lg shrink-0 ${grp.hl ? "bg-amber-100" : "bg-slate-100"}`}>
                                      <grp.Icon className={`h-4 w-4 ${grp.hl ? "text-amber-700" : "text-muted-foreground"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-bold leading-tight ${grp.hl ? "text-amber-900" : "text-foreground"}`}>{grp.title}</p>
                                      <p className={`text-[11px] mt-0.5 ${grp.hl ? "text-amber-700" : "text-muted-foreground"}`}>{grp.subtitle}</p>
                                    </div>
                                    {grp.hl && <Badge className="text-[10px] bg-amber-600 text-white shrink-0 mr-1">Atenção</Badge>}
                                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""} ${grp.hl ? "text-amber-600" : "text-muted-foreground"}`} />
                                  </button>

                                  {isOpen && (
                                    <div className={`border-t px-4 pb-4 pt-3 space-y-3 ${grp.hl ? "border-amber-200 bg-amber-50/40" : "border-slate-100 bg-slate-50/50"}`}>
                                      {grp.hl && (
                                        <Alert className="border-amber-200 bg-white py-2">
                                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                                          <AlertDescription className="text-xs text-amber-800">{grp.hlMsg}</AlertDescription>
                                        </Alert>
                                      )}
                                      <div className="space-y-2">
                                        {grp.items.map((item) => (
                                          <div key={item.letra} className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                                            <div className="flex items-start gap-2">
                                              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">{item.letra}</span>
                                              <p className="text-xs font-bold text-foreground leading-tight">{item.label}</p>
                                            </div>
                                            <div className="flex items-start gap-2 ml-6">
                                              <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                                              <p className="text-xs text-muted-foreground">{item.risco}</p>
                                            </div>
                                            <div className="ml-6 bg-green-50 border border-green-200 rounded p-2 flex items-start gap-2">
                                              <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
                                              <p className="text-xs text-green-800">{item.como}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <p className="text-[10px] text-muted-foreground italic text-right">{grp.base} · Penalidade específica: consulte o texto oficial com seu contador.</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* ── Card 5: Reduções legais da multa ── */}
                        <div className={`rounded-lg border overflow-hidden ${openInfraction === "g5" ? "border-green-300" : "border-green-200"}`} data-testid="card-group-g5">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-3 text-left bg-green-50 hover:bg-green-100 transition-colors"
                            onClick={() => setOpenInfraction(openInfraction === "g5" ? null : "g5")}
                            data-testid="toggle-group-g5"
                          >
                            <div className="p-1.5 rounded-lg shrink-0 bg-green-100"><TrendingDown className="h-4 w-4 text-green-700" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-green-900 leading-tight">Reduções legais da multa</p>
                              <p className="text-[11px] text-green-700 mt-0.5">Quem regulariza voluntariamente paga menos — conheça os momentos certos</p>
                            </div>
                            <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 text-green-600 ${openInfraction === "g5" ? "rotate-90" : ""}`} />
                          </button>
                          {openInfraction === "g5" && (
                            <div className="border-t border-green-200 px-4 pb-4 pt-3 bg-green-50/30 space-y-2">
                              <p className="text-xs text-green-800">A LC 214/2025 prevê hipóteses de redução das penalidades para contribuintes que regularizem sua situação. O momento da regularização determina o benefício.</p>
                              {[
                                { n: "1", momento: "Pagamento integral no prazo da impugnação", efeito: "Maior redução prevista na lei. O contribuinte regulariza tributo + multa reduzida, sem contestar administrativamente.", dica: "Avalie com o contador se o valor lançado está correto antes de pagar sem contestar." },
                                { n: "2", momento: "Parcelamento no prazo da impugnação", efeito: "Redução menor que o pagamento integral, mas ainda significativa. O parcelamento deve ser formalizado dentro do prazo da impugnação.", dica: "Confirme os termos antes de aderir ao parcelamento." },
                                { n: "3", momento: "Pagamento antes da inscrição em Dívida Ativa", efeito: "Redução menor que na fase de impugnação. Evita a cobrança judicial e os acréscimos da dívida ativa.", dica: "A inscrição acrescenta encargos e torna a negociação mais difícil." },
                                { n: "4", momento: "Parcelamento antes da inscrição em Dívida Ativa", efeito: "Alternativa ao pagamento integral. Regulariza a situação sem exposição judicial.", dica: "Formalize antes do prazo de inscrição para garantir a redução." },
                                { n: "5", momento: "Participação em programa de conformidade tributária", efeito: "Quando cabível, pode ampliar a redução ou qualificar o contribuinte para tratamento diferenciado — previsto para contribuintes com boa conduta cadastral e fiscal.", dica: "Acompanhe a regulamentação do Comitê Gestor do IBS sobre programas de conformidade." },
                              ].map((r) => (
                                <div key={r.n} className="bg-white border border-green-200 rounded-lg p-3 space-y-1">
                                  <p className="text-xs font-bold text-green-900">{r.n}. {r.momento}</p>
                                  <p className="text-xs text-green-700">{r.efeito}</p>
                                  <p className="text-[10px] text-green-500 italic">Dica prática: {r.dica}</p>
                                </div>
                              ))}
                              <p className="text-[10px] text-green-500 italic">Os percentuais exatos de redução dependem da modalidade de lançamento e do momento da regularização — consulte o Capítulo IV da LC 214/2025 com seu contador antes de decidir.</p>
                            </div>
                          )}
                        </div>

                        {/* ── Card 6: Checklist para evitar autuação ── */}
                        <div className={`rounded-lg border overflow-hidden ${openInfraction === "g6" ? "border-primary" : "border-slate-200"}`} data-testid="card-group-g6">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50 transition-colors"
                            onClick={() => setOpenInfraction(openInfraction === "g6" ? null : "g6")}
                            data-testid="toggle-group-g6"
                          >
                            <div className="p-1.5 rounded-lg shrink-0 bg-primary/10"><CheckCircle2 className="h-4 w-4 text-primary" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground leading-tight">Checklist para evitar autuação</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {doneCount}/{checklist.length} itens em conformidade com base nas respostas fornecidas
                              </p>
                            </div>
                            <div className={`text-sm font-bold shrink-0 mr-2 ${doneCount >= 8 ? "text-green-600" : doneCount >= 5 ? "text-amber-600" : "text-red-600"}`}>{Math.round((doneCount / checklist.length) * 100)}%</div>
                            <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground ${openInfraction === "g6" ? "rotate-90" : ""}`} />
                          </button>
                          {openInfraction === "g6" && (
                            <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-2 bg-slate-50/30">
                              {checklist.map((item, idx) => (
                                <div key={idx} className={`flex items-start gap-3 p-2.5 rounded-lg border ${item.done ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`} data-testid={`checklist-infraction-${idx}`}>
                                  <div className={`shrink-0 mt-0.5 ${item.done ? "text-green-600" : "text-amber-500"}`}>
                                    {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                                  </div>
                                  <p className={`text-xs flex-1 ${item.done ? "text-green-800" : "text-amber-800 font-medium"}`}>{item.text}</p>
                                  <Badge variant="outline" className={`text-[10px] shrink-0 ${item.done ? "border-green-300 text-green-700" : "border-amber-300 text-amber-700"}`}>{item.done ? "OK" : "Verificar"}</Badge>
                                </div>
                              ))}
                              <p className="text-[10px] text-muted-foreground italic pt-1">Checklist baseado nas respostas fornecidas. Realize revisão completa com o contador para confirmar o status real de conformidade da empresa.</p>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })()}
              {/* ===== END INFRAÇÕES E PENALIDADES BLOCK ===== */}

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleBack} className="gap-2"><ArrowLeft className="h-4 w-4" />Diagnóstico</Button>
                <Button onClick={handleNext} className="gap-2" data-testid="button-to-report">Gerar Relatório Final <FileText className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {screen === 10 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* ── Header ─────────────────────────────────────────────── */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mx-auto mb-3"><CheckCircle2 className="h-7 w-7 text-green-600" /></div>
                <Badge className="bg-green-600 hover:bg-green-600">Jornada Concluída</Badge>
                <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight" data-testid="text-report-title">Relatório Final — {data.companyName}</h1>
                <p className="text-sm font-medium text-primary">Plano de Ação para Adaptação à Reforma Tributária</p>
                <p className="text-muted-foreground text-xs">Gerado em: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} · Base normativa: EC 132/2023 · LC 214/2025 · LC 227/2026</p>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">Diagnóstico e plano de ação construídos a partir das respostas fornecidas pela empresa. Baixe o PDF para compartilhar com seu contador, equipe ou consultores.</p>
              </div>

              {/* ── Empresa + Score ────────────────────────────────────── */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="sm:col-span-2">
                  <CardContent className="pt-5 pb-4 space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Empresa Analisada</p>
                    <p className="text-xl font-bold">{data.companyName}</p>
                    {data.nomeFantasia && <p className="text-sm text-muted-foreground">"{data.nomeFantasia}"</p>}
                    {data.cnpj && <p className="text-sm text-muted-foreground font-mono">CNPJ: {data.cnpj}</p>}
                    {data.cnaeCode && <p className="text-sm text-muted-foreground">CNAE: {data.cnaeCode}</p>}
                    {(data.municipio || data.estado) && <p className="text-sm text-muted-foreground">{[data.municipio, data.estado].filter(Boolean).join(" — ")}</p>}
                    {data.contactName && <p className="text-sm text-muted-foreground">Responsável: {data.contactName}{data.contactRole ? ` (${data.contactRole})` : ""}</p>}
                    {data.contactEmail && <p className="text-sm text-muted-foreground">E-mail: {data.contactEmail}</p>}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        data.sector === "industria" ? "Indústria" : data.sector === "atacado" ? "Atacado" : data.sector === "varejo" ? "Varejo" : data.sector === "agronegocio" ? "Agronegócio" : "Outros / Não listado",
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

              {/* ── Grau de Precisão do Diagnóstico ─────────────────── */}
              {(() => {
                const prec = computePrecision(data);
                const verdeCount = plan.filter(a => a.confianca === "verde" || a.confianca === "vermelho").length;
                const parcialCount = plan.filter(a => a.confianca === "amarelo" || a.confianca === "laranja").length;
                const unfilled = prec.criticalFields.filter(f => !f.filled);
                return (
                  <div data-testid="precision-section">
                    <h2 className="text-lg font-bold font-heading mb-1">Grau de Precisão do Diagnóstico</h2>
                    <p className="text-xs text-muted-foreground mb-3">
                      {prec.filledCount} de {prec.totalFields} campos críticos preenchidos · {prec.pct}% de completude do questionário
                    </p>
                    <div className="h-2.5 bg-muted rounded-full mb-4 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${prec.pct >= 85 ? "bg-green-500" : prec.pct >= 60 ? "bg-amber-500" : "bg-orange-500"}`} style={{ width: `${prec.pct}%` }} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 mb-4">
                      <div className="p-3 rounded-lg border bg-green-50 border-green-200 text-center">
                        <p className="text-2xl font-bold text-green-700">{verdeCount}</p>
                        <p className="text-xs text-green-700 mt-1">Ações com base direta nas respostas</p>
                      </div>
                      <div className="p-3 rounded-lg border bg-amber-50 border-amber-200 text-center">
                        <p className="text-2xl font-bold text-amber-700">{parcialCount}</p>
                        <p className="text-xs text-amber-700 mt-1">Ações com dado derivado ou parcial</p>
                      </div>
                      <div className="p-3 rounded-lg border bg-muted/40 text-center">
                        <p className="text-2xl font-bold">{plan.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total de ações no plano</p>
                      </div>
                    </div>
                    {unfilled.length > 0 && (
                      <div className="p-3 rounded-lg border bg-orange-50 border-orange-200">
                        <p className="text-xs font-bold text-orange-800 mb-2">Campos não preenchidos — recomendações nesses pontos têm precisão reduzida:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {unfilled.map((f, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">{f.label}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Legenda de Confiabilidade */}
                    <div className="mt-4 p-3 rounded-lg border bg-muted/20">
                      <p className="text-xs font-bold mb-2">Legenda de Confiabilidade das Ações</p>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { dot: "bg-green-500",  label: "Verde — baseado em resposta direta do questionário" },
                          { dot: "bg-amber-400",  label: "Amarelo — conclusão derivada de múltiplas respostas" },
                          { dot: "bg-orange-500", label: "Laranja — estimativa com dado parcial ou ausente" },
                          { dot: "bg-red-500",    label: "Vermelho — risco identificado por resposta expressa de risco" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-1.5">
                            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.dot}`} />
                            <span className="text-[10px] text-muted-foreground">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Riscos Identificados ─────────────────────────────── */}
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

              {/* ── Resumo do Plano de Ação ──────────────────────────── */}
              <div>
                <h2 className="text-lg font-bold font-heading mb-3">Resumo do Plano de Ação ({plan.length} ações)</h2>
                <div className="space-y-2">
                  {plan.map((action, idx) => {
                    const confDot: Record<string, string> = { verde: "bg-green-500", amarelo: "bg-amber-400", laranja: "bg-orange-500", vermelho: "bg-red-500" };
                    return (
                      <div key={idx} className="p-3 rounded-lg border bg-muted/10" data-testid={`report-action-${idx}`}>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className={`text-[10px] shrink-0 mt-0.5 ${priorityConfig[action.priority].cls}`}>{priorityConfig[action.priority].label}</Badge>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-bold block">{action.title}</span>
                            <span className="text-xs text-muted-foreground block">{action.desc}</span>
                            <span className="text-[11px] text-muted-foreground">{action.prazo} · {action.responsavel} · <span className="text-blue-600">{action.eixo}</span></span>
                            {action.source && (
                              <div className="flex items-center gap-1.5 mt-1">
                                {action.confianca && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${confDot[action.confianca]}`} />}
                                <span className="text-[10px] text-muted-foreground italic">Com base em: {action.source}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {diagnosis && (() => {
                const urgentActions = plan.filter((a) => a.priority === "urgente");
                const checklistItems = [
                  { done: data.taxResponsible !== "ninguem", label: "Responsável pelo tema fiscal/tributário definido" },
                  { done: data.erpSystem !== "nenhum" && data.erpSystem !== "planilha", label: "Sistema de gestão (ERP) contratado e configurado" },
                  { done: data.erpVendorReformPlan === "sim", label: "Cronograma de atualização do ERP para IBS/CBS confirmado" },
                  { done: data.catalogStandardized === "sim", label: "Cadastro de produtos/serviços padronizado com NCM/NBS" },
                  { done: data.hasRegularNF === "sim", label: "Todos os fornecedores emitem NF regularmente" },
                  { done: data.hasNFErrors !== "frequente", label: "NFs recebidas sem erros frequentes de cadastro" },
                  { done: !(data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao"), label: "Contratos de longo prazo revisados com cláusula tributária" },
                  { done: data.splitPaymentAware === "sim", label: "Split Payment compreendido e simulado no fluxo de caixa" },
                  { done: data.knowsMarginByProduct === "sim", label: "Margem por produto/serviço mapeada e documentada" },
                  { done: data.managementAwareOfReform === "sim", label: "Diretoria informada e engajada com o tema" },
                  { done: data.hadInternalTraining === "sim", label: "Equipes fiscal, comercial e financeira treinadas" },
                  { done: data.preparationStarted !== "nao", label: "Preparação para a reforma tributária iniciada formalmente" },
                ];
                const doneCount = checklistItems.filter((c) => c.done).length;
                const pct = Math.round((doneCount / checklistItems.length) * 100);
                return (
                  <div data-testid="checklist-executivo">
                    <h2 className="text-lg font-bold font-heading mb-1">Checklist Executivo de Prontidão</h2>
                    <p className="text-xs text-muted-foreground mb-3">{doneCount} de {checklistItems.length} pontos atendidos ({pct}% de prontidão)</p>
                    <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {checklistItems.map((item, idx) => (
                        <div key={idx} className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${item.done ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                          {item.done
                            ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            : <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                          <span className={item.done ? "text-green-800" : "text-red-800"}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                    {urgentActions.length > 0 && (
                      <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm font-bold text-red-800 mb-2">⚠ Pontos mais urgentes da sua empresa:</p>
                        <ul className="space-y-1">
                          {urgentActions.slice(0, 4).map((a, idx) => (
                            <li key={idx} className="text-xs text-red-700 flex items-start gap-1.5">
                              <ChevronRight className="h-3 w-3 shrink-0 mt-0.5" />{a.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}

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
