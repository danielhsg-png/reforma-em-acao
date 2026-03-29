/**
 * riskConfig.ts — FONTE ÚNICA DE VERDADE
 *
 * Centraliza: interfaces de dados, limiares de risco, configurações de nível,
 * mapas de rótulos e geração do texto de conclusão.
 *
 * Ambos PlanoDeAcaoJornada.tsx (UI) e generatePdf.ts (PDF) importam daqui.
 * Qualquer adaptação funcional, estrutural ou informativa do app precisa
 * ser feita AQUI para refletir automaticamente no PDF gerado.
 */

// ─── Interfaces compartilhadas ────────────────────────────────────────────────

export interface RiskItem {
  level: "critico" | "alto" | "moderado";
  title: string;
  desc: string;
  action: string;
  axis: string;
  planActionId?: string;
}

export interface AxisScore {
  id: string;
  name: string;
  icon?: unknown;   // React.ElementType no componente UI; undefined no PDF
  score: number;
  items: RiskItem[];
}

export interface DiagnosisResult {
  overallScore: number;
  axes: AxisScore[];
  allItems: RiskItem[];
  topOpportunity: string;
}

export interface PlanAction {
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

// ─── Limiares de prontidão operacional ────────────────────────────────────────
export const RISK_THRESHOLDS = {
  AVANCADO: 75,
  MODERADO: 55,
  BAIXO: 30,
} as const;

// ─── Tipo de nível de prontidão ───────────────────────────────────────────────
export type ReadinessLevel = "CRITICO" | "BAIXO" | "MODERADO" | "AVANCADO";

// Mantido por compatibilidade com código que usa acentuação
export type RiskLevelKey = "CRÍTICO" | "ALTO" | "MODERADO" | "BAIXO" | "AVANÇADO";

// ─── Configuração completa por nível ──────────────────────────────────────────
export interface RiskLevelConfig {
  label: RiskLevelKey;          // rótulo em PT-BR com acentuação
  labelAscii: string;           // rótulo sem Unicode (para PDF Helvetica)
  color: string;                // classes Tailwind: borda + fundo + texto
  solid: string;                // classe Tailwind bg sólido + texto branco
  hex: string;                  // hex cor principal (CSS inline)
  bg: string;                   // hex cor de fundo suave (CSS inline)
  rgb: [number, number, number]; // RGB da cor principal (jsPDF)
  badgeBg: [number, number, number];  // fundo suave do badge (PDF)
  badgeFg: [number, number, number];  // cor de texto/borda do badge (PDF)
  description: string;          // descrição curta do nível de prontidão
}

// ─── Configs de prontidão (ordem: CRÍTICO → BAIXO → MODERADO → AVANÇADO) ──────
const READINESS_CONFIGS: RiskLevelConfig[] = [
  {
    label: "CRÍTICO",
    labelAscii: "CRITICO",
    color: "text-red-700 bg-red-50 border-red-200",
    solid: "bg-red-600 text-white",
    hex: "#dc2626",
    bg: "#fee2e2",
    rgb: [220, 38, 38],
    badgeBg: [254, 226, 226],
    badgeFg: [220, 38, 38],
    description: "Sua empresa não está preparada para a Reforma Tributária.",
  },
  {
    label: "BAIXO",
    labelAscii: "BAIXO",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    solid: "bg-orange-500 text-white",
    hex: "#f97316",
    bg: "#ffedd5",
    rgb: [249, 115, 22],
    badgeBg: [255, 237, 213],
    badgeFg: [249, 115, 22],
    description: "Sua empresa tem baixa prontidão para a Reforma Tributária.",
  },
  {
    label: "MODERADO",
    labelAscii: "MODERADO",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    solid: "bg-amber-600 text-white",
    hex: "#d97706",
    bg: "#fef9c3",
    rgb: [217, 119, 6],
    badgeBg: [254, 249, 195],
    badgeFg: [217, 119, 6],
    description: "Sua empresa está em processo de adequação à Reforma Tributária.",
  },
  {
    label: "AVANÇADO",
    labelAscii: "AVANCADO",
    color: "text-green-700 bg-green-50 border-green-200",
    solid: "bg-green-600 text-white",
    hex: "#16a34a",
    bg: "#dcfce7",
    rgb: [22, 163, 74],
    badgeBg: [220, 252, 231],
    badgeFg: [22, 163, 74],
    description: "Sua empresa está quase pronta para a Reforma Tributária.",
  },
];

// ─── Configs de severidade por item de eixo (critico/alto/moderado) ────────────
const ITEM_LEVEL_CONFIGS: RiskLevelConfig[] = [
  {
    label: "CRÍTICO",
    labelAscii: "CRITICO",
    color: "text-red-700 bg-red-50 border-red-200",
    solid: "bg-red-600 text-white",
    hex: "#dc2626",
    bg: "#fee2e2",
    rgb: [220, 38, 38],
    badgeBg: [254, 226, 226],
    badgeFg: [220, 38, 38],
    description: "Lacuna crítica identificada neste eixo.",
  },
  {
    label: "ALTO",
    labelAscii: "ALTO",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    solid: "bg-orange-500 text-white",
    hex: "#f97316",
    bg: "#ffedd5",
    rgb: [249, 115, 22],
    badgeBg: [255, 237, 213],
    badgeFg: [249, 115, 22],
    description: "Lacuna relevante identificada neste eixo.",
  },
  {
    label: "MODERADO",
    labelAscii: "MODERADO",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    solid: "bg-amber-600 text-white",
    hex: "#d97706",
    bg: "#fef9c3",
    rgb: [217, 119, 6],
    badgeBg: [254, 249, 195],
    badgeFg: [217, 119, 6],
    description: "Ponto de atenção identificado neste eixo.",
  },
];

/**
 * Classificação de prontidão: converte score (0-100) em ReadinessLevel.
 * Score alto = empresa bem preparada (AVANCADO).
 * Score baixo = empresa muito exposta (CRITICO).
 */
export function getReadinessLevel(score: number): ReadinessLevel {
  if (score >= RISK_THRESHOLDS.AVANCADO) return "AVANCADO";
  if (score >= RISK_THRESHOLDS.MODERADO) return "MODERADO";
  if (score >= RISK_THRESHOLDS.BAIXO)    return "BAIXO";
  return "CRITICO";
}

/**
 * Retorna a configuração visual completa dado um score de PRONTIDÃO (0-100).
 * Usa os 4 níveis: CRÍTICO / BAIXO / MODERADO / AVANÇADO.
 */
export function getRiskLabelConfig(score: number): RiskLevelConfig {
  if (score >= RISK_THRESHOLDS.AVANCADO) return READINESS_CONFIGS[3]; // ≥75 → AVANÇADO (verde)
  if (score >= RISK_THRESHOLDS.MODERADO) return READINESS_CONFIGS[2]; // 55-74 → MODERADO (âmbar)
  if (score >= RISK_THRESHOLDS.BAIXO)    return READINESS_CONFIGS[1]; // 30-54 → BAIXO (laranja)
  return READINESS_CONFIGS[0]; // <30 → CRÍTICO (vermelho)
}

/**
 * Retorna a configuração completa dado o nível string de um item de eixo
 * (ex: "critico", "alto", "moderado").
 * Mantém compatibilidade com RiskItem.level usado no diagnóstico e no PDF.
 */
export function getRiskLabelConfigByLevel(level: string): RiskLevelConfig {
  const key = level.toLowerCase();
  if (key === "critico" || key === "crítico") return ITEM_LEVEL_CONFIGS[0];
  if (key === "alto")                         return ITEM_LEVEL_CONFIGS[1];
  return ITEM_LEVEL_CONFIGS[2]; // moderado
}

/**
 * Objeto de prontidão chaveado por ReadinessLevel (sem acentuação).
 * Combina hex, bg e description para uso direto no UI e no PDF.
 */
export const READINESS_CONFIG: Record<ReadinessLevel, RiskLevelConfig> = {
  AVANCADO: READINESS_CONFIGS[3],
  MODERADO: READINESS_CONFIGS[2],
  BAIXO:    READINESS_CONFIGS[1],
  CRITICO:  READINESS_CONFIGS[0],
};

// ─── Rótulos de prioridade do Plano de Ação ───────────────────────────────────
export interface PriorityConfig {
  label: string;
  cls: string;     // Tailwind
  rgb: [number, number, number];
  badgeBg: [number, number, number];
  badgeFg: [number, number, number];
}

export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  urgente: {
    label: "Urgente",
    cls: "bg-red-100 text-red-700 border-red-200",
    rgb: [220, 38, 38],
    badgeBg: [255, 235, 235],
    badgeFg: [220, 38, 38],
  },
  alta: {
    label: "Alta",
    cls: "bg-orange-100 text-orange-700 border-orange-200",
    rgb: [249, 115, 22],
    badgeBg: [255, 243, 232],
    badgeFg: [249, 115, 22],
  },
  media: {
    label: "Média",
    cls: "bg-amber-100 text-amber-700 border-amber-200",
    rgb: [100, 100, 100],
    badgeBg: [248, 248, 248],
    badgeFg: [100, 100, 100],
  },
  baixa: {
    label: "Baixa",
    cls: "bg-green-100 text-green-700 border-green-200",
    rgb: [22, 163, 74],
    badgeBg: [230, 255, 237],
    badgeFg: [22, 163, 74],
  },
};

// ─── Mapas de rótulos — UI e PDF ──────────────────────────────────────────────
// Ao adicionar um novo setor, regime ou porte aqui, o PDF reflete automaticamente.

export const SECTOR_LABELS: Record<string, string> = {
  industria:    "Indústria",
  atacado:      "Comércio Atacadista",
  varejo:       "Comércio Varejista",
  servicos:     "Serviços",
  agronegocio:  "Agronegócio",
  outros:       "Outros Setores",
};

export const REGIME_LABELS: Record<string, string> = {
  simples:          "Simples Nacional",
  lucro_presumido:  "Lucro Presumido",
  lucro_real:       "Lucro Real",
};

export const EMPLOYEE_LABELS: Record<string, string> = {
  "1_10":      "1 a 10 pessoas",
  "11_50":     "11 a 50 pessoas",
  "51_200":    "51 a 200 pessoas",
  acima_200:   "Acima de 200 pessoas",
};

export const REVENUE_LABELS: Record<string, string> = {
  ate_360k:     "Até R$ 360 mil/ano",
  "360k_4_8m":  "R$ 360 mil a R$ 4,8 mi/ano",
  "4_8m_78m":   "R$ 4,8 mi a R$ 78 mi/ano",
  acima_78m:    "Acima de R$ 78 mi/ano",
  ate_50k:      "Até R$ 50 mil/mês",
  "50k_100k":   "R$ 50 mil a R$ 100 mil/mês",
  "100k_500k":  "R$ 100 mil a R$ 500 mil/mês",
  "500k_1m":    "R$ 500 mil a R$ 1 milhão/mês",
  acima_1m:     "Acima de R$ 1 milhão/mês",
};

export const ERP_LABELS: Record<string, string> = {
  sap:         "SAP / TOTVS / Oracle",
  medio_porte: "Bling / Omie / Tiny / Conta Azul",
  planilha:    "Planilhas / Controle manual",
  nenhum:      "Sem sistema de gestão",
  proprio:     "Sistema próprio",
};

export const SUPPLIER_LABELS: Record<string, string> = {
  ate_10:    "Até 10 fornecedores",
  ate_20:    "10 a 20 fornecedores",
  ate_50:    "20 a 50 fornecedores",
  acima_50:  "Acima de 50 fornecedores",
};

export const SIMPLES_PCT_LABELS: Record<string, string> = {
  ate_30:    "Menos de 30%",
  "30_60":   "30% a 60%",
  acima_60:  "Mais de 60%",
  nao_sei:   "Não informado",
};

export const TAX_LABELS: Record<string, string> = {
  contador_externo:  "Escritório de contabilidade externo",
  contador_interno:  "Contador/analista interno",
  dono:             "Dono/sócio",
  ninguem:          "Ninguém cuida especificamente",
};

export const SPLIT_LABELS: Record<string, string> = {
  sim_entendo:  "Sim, entende como funciona",
  ouvi_falar:   "Já ouviu falar, mas não entende bem",
  nao:          "Não conhece",
};

export const MARGIN_LABELS: Record<string, string> = {
  ate_5:      "Até 5%",
  "5_10":     "5% a 10%",
  "10_20":    "10% a 20%",
  acima_20:   "Acima de 20%",
};

export const CONCERN_LABELS: Record<string, string> = {
  custos:         "Aumento dos custos e da carga tributária",
  preco:          "Impacto nos preços e na competitividade",
  sistemas:       "Adequação dos sistemas e notas fiscais",
  caixa:          "Impacto no fluxo de caixa (Split Payment)",
  fornecedores:   "Adequação dos fornecedores",
  contratos:      "Revisão de contratos",
  desconhecimento: "Não sei por onde começar",
};

export const SPECIAL_REGIME_LABELS: Record<string, string> = {
  saude_servicos:        "Serviços de Saúde (60% de redução)",
  saude_medicamentos:    "Medicamentos (60% / alíquota zero lista CMED)",
  educacao:              "Educação (60% de redução)",
  cesta_basica:          "Alimentos da Cesta Básica (alíquota zero)",
  alimentos_reduzidos:   "Outros Alimentos (60% de redução)",
  agro_insumos:          "Insumos Agropecuários (60% de redução)",
  transporte_coletivo:   "Transporte Coletivo (60% de redução)",
  profissional_liberal:  "Profissional Liberal Regulamentado (30% de redução)",
  imobiliario:           "Imóveis e Construção Civil (regime específico)",
  combustiveis:          "Combustíveis (regime monofásico)",
  hotelaria_turismo:     "Hotelaria e Turismo (60% de redução)",
  cooperativa:           "Cooperativas (tratamento especial)",
  zfm:                   "Zona Franca de Manaus (benefícios mantidos)",
  higiene_limpeza:       "Higiene e Limpeza Essenciais (60% de redução)",
  cultura:               "Cultura e Arte (60% / livros alíquota zero)",
  seletivo_bebidas:      "Bebidas Alcoólicas/Açucaradas — IS adicional",
  seletivo_tabaco:       "Tabaco e Cigarro — IS adicional",
  seletivo_veiculos:     "Veículos/Embarcações — IS adicional",
};

// ─── Texto de conclusão personalizado ────────────────────────────────────────
// Único gerador de texto — UI usa diretamente, PDF usa via sanitizeText().
// Altere aqui para que o texto mude em ambos os canais.

export function generateConclusionText(
  companyName: string,
  diagnosis: DiagnosisResult
): { text: string; urgency: string } {
  const score = diagnosis.overallScore;
  const cfg = getRiskLabelConfig(score);
  const level = cfg.label;

  // Ordena pelos eixos com maior contribuição de risco bruto (score ainda representa exposição por eixo)
  const sortedAxes = [...diagnosis.axes].sort((a, b) => b.score - a.score);
  const topAxes = sortedAxes.filter(ax => ax.score > 0).slice(0, 2);
  const axisNames = topAxes.map(ax => ax.name);
  const name = companyName && companyName !== "Minha Empresa" ? companyName : "A empresa";

  // CRÍTICO: prontidão < 30 — empresa muito exposta
  if (level === "CRÍTICO") {
    const ax = axisNames.length > 0 ? `nos eixos de ${axisNames.join(" e ")}` : "em múltiplos eixos";
    return {
      text: `${name} apresenta nível CRÍTICO de prontidão para a Reforma Tributária — exposição operacional muito alta. As principais lacunas foram identificadas ${ax}, onde existem falhas estruturais que comprometem diretamente a operação e o resultado financeiro durante a transição. Com a fase de coexistência IBS/CBS já ativa desde 2026, o custo de não agir cresce a cada mês que passa. O Plano de Ação indica as ações imediatas que precisam ser iniciadas esta semana para estabilizar a situação antes que o impacto se torne irreversível.`,
      urgency: "Convoque uma reunião de crise esta semana. Exija cronogramas por escrito de todos os fornecedores e parceiros envolvidos na adequação.",
    };
  }
  // BAIXO: prontidão 30-54 — exposição relevante, ação necessária
  if (level === "BAIXO") {
    const ax = axisNames.length > 0 ? axisNames.join(" e ") : "fiscal e operacional";
    return {
      text: `${name} apresenta nível BAIXO de prontidão para a Reforma Tributária — exposição relevante que requer ação estruturada. Os eixos de ${ax} concentram as principais lacunas identificadas, com pontos que precisam ser endereçados nos próximos 30 dias para evitar impacto financeiro relevante. A transição já está ativa desde 2026 e o custo de não agir é crescente. O Plano de Ação detalha as ações prioritárias para elevar a prontidão antes que os riscos identificados se materializem.`,
      urgency: "Inicie as ações de Fase 1 imediatamente. Notifique a diretoria sobre as lacunas identificadas e defina responsáveis com prazos claros.",
    };
  }
  // MODERADO: prontidão 55-74 — base parcial, consolidar
  if (level === "MODERADO") {
    const ax = axisNames.length > 0 ? axisNames.join(" e ") : "alguns eixos";
    return {
      text: `${name} apresenta nível MODERADO de prontidão para a Reforma Tributária. A empresa já possui uma base parcial de adequação, mas os eixos de ${ax} ainda apresentam pontos que precisam de atenção nos próximos 60 a 90 dias. Com a transição ativa desde 2026, é hora de converter os fundamentos já construídos em ações concretas e estruturadas. O Plano de Ação indica os próximos passos para consolidar a adequação e avançar para o nível AVANÇADO de prontidão.`,
      urgency: "Organize as ações por responsável e revise o progresso mensalmente com o contador.",
    };
  }
  // AVANÇADO: prontidão ≥ 75 — bem preparada, monitorar
  return {
    text: `${name} demonstra nível AVANÇADO de prontidão para a Reforma Tributária — boa adequação nas principais dimensões avaliadas${axisNames.length > 0 ? `, com atenção pontual aos eixos de ${axisNames.join(" e ")}` : ""}. A transição está ativa desde 2026 e exige monitoramento contínuo ao longo do período de coexistência (2026–2033). O Plano de Ação indica os ajustes pontuais recomendados para manter a conformidade e aproveitar as oportunidades identificadas no diagnóstico.`,
    urgency: "Revise os pontos indicados, monitore a regulamentação mensalmente e agende revisão trimestral com o contador.",
  };
}
