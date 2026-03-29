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

// ─── Limiares de risco (NÃO ALTERE sem revisar ambos UI e PDF) ───────────────
export const RISK_THRESHOLDS = {
  CRITICO: 70,
  ALTO: 45,
  MODERADO: 20,
} as const;

// ─── Tipo de nível de risco ───────────────────────────────────────────────────
export type RiskLevelKey = "CRÍTICO" | "ALTO" | "MODERADO" | "BAIXO";

// ─── Configuração completa por nível de risco ─────────────────────────────────
export interface RiskLevelConfig {
  label: RiskLevelKey;          // rótulo em PT-BR com acentuação
  labelAscii: string;           // rótulo sem Unicode (para PDF Helvetica)
  color: string;                // classes Tailwind: borda + fundo + texto
  solid: string;                // classe Tailwind bg sólido + texto branco
  hex: string;                  // hex para CSS inline
  rgb: [number, number, number]; // RGB para jsPDF
  badgeBg: [number, number, number];  // fundo suave do badge (PDF)
  badgeFg: [number, number, number];  // cor de texto/borda do badge (PDF)
}

const LEVEL_CONFIGS: RiskLevelConfig[] = [
  {
    label: "CRÍTICO",
    labelAscii: "CRITICO",
    color: "text-red-700 bg-red-50 border-red-200",
    solid: "bg-red-600 text-white",
    hex: "#dc2626",
    rgb: [220, 38, 38],
    badgeBg: [255, 235, 235],
    badgeFg: [220, 38, 38],
  },
  {
    label: "ALTO",
    labelAscii: "ALTO",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    solid: "bg-orange-500 text-white",
    hex: "#f97316",
    rgb: [249, 115, 22],
    badgeBg: [255, 243, 232],
    badgeFg: [249, 115, 22],
  },
  {
    label: "MODERADO",
    labelAscii: "MODERADO",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    solid: "bg-amber-600 text-white",
    hex: "#d97706",
    rgb: [217, 119, 6],
    badgeBg: [255, 248, 230],
    badgeFg: [217, 119, 6],
  },
  {
    label: "BAIXO",
    labelAscii: "BAIXO",
    color: "text-green-700 bg-green-50 border-green-200",
    solid: "bg-green-600 text-white",
    hex: "#16a34a",
    rgb: [22, 163, 74],
    badgeBg: [230, 255, 237],
    badgeFg: [22, 163, 74],
  },
];

/** Retorna a configuração completa de risco dado um score numérico. */
export function getRiskLabelConfig(score: number): RiskLevelConfig {
  if (score >= RISK_THRESHOLDS.CRITICO) return LEVEL_CONFIGS[0];
  if (score >= RISK_THRESHOLDS.ALTO)    return LEVEL_CONFIGS[1];
  if (score >= RISK_THRESHOLDS.MODERADO) return LEVEL_CONFIGS[2];
  return LEVEL_CONFIGS[3];
}

/** Retorna a configuração completa dado o nível string (ex: "critico", "ALTO"). */
export function getRiskLabelConfigByLevel(level: string): RiskLevelConfig {
  const key = level.toLowerCase();
  if (key === "critico" || key === "crítico") return LEVEL_CONFIGS[0];
  if (key === "alto")     return LEVEL_CONFIGS[1];
  if (key === "moderado") return LEVEL_CONFIGS[2];
  return LEVEL_CONFIGS[3];
}

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

  const sortedAxes = [...diagnosis.axes].sort((a, b) => b.score - a.score);
  const topAxes = sortedAxes.filter(ax => ax.score > 0).slice(0, 2);
  const axisNames = topAxes.map(ax => ax.name);
  const name = companyName && companyName !== "Minha Empresa" ? companyName : "A empresa";

  if (level === "CRÍTICO") {
    const ax = axisNames.length > 0 ? `nos eixos de ${axisNames.join(" e ")}` : "em múltiplos eixos";
    return {
      text: `${name} foi classificada com risco CRÍTICO na Reforma Tributária. Os principais fatores que determinaram esta classificação foram identificados ${ax}, onde existem falhas estruturais que comprometem diretamente a operação e o resultado financeiro durante a transição. Com a fase de coexistência IBS/CBS já ativa desde 2026, o custo de não agir cresce a cada mês que passa. O Plano de Ação indica as ações imediatas que precisam ser iniciadas esta semana para estabilizar a situação antes que o impacto se torne irreversível.`,
      urgency: "Convoque uma reunião de crise esta semana. Exija cronogramas por escrito de todos os fornecedores e parceiros envolvidos na adequação.",
    };
  }
  if (level === "ALTO") {
    const ax = axisNames.length > 0 ? axisNames.join(" e ") : "fiscal e operacional";
    return {
      text: `${name} foi classificada com risco ALTO na Reforma Tributária. Os eixos de ${ax} concentram as principais lacunas identificadas, com pontos que precisam ser endereçados nos próximos 30 dias para evitar impacto financeiro relevante. A transição já está ativa desde 2026 e o custo de não agir é crescente. O Plano de Ação detalha as ações prioritárias para reduzir a exposição antes que os riscos identificados se materializem.`,
      urgency: "Inicie as ações de Fase 1 imediatamente. Notifique a diretoria sobre os riscos identificados e defina responsáveis com prazos claros.",
    };
  }
  if (level === "MODERADO") {
    const ax = axisNames.length > 0 ? axisNames.join(" e ") : "alguns eixos";
    return {
      text: `${name} foi classificada com risco MODERADO na Reforma Tributária. A empresa já possui uma base parcial de adequação, mas os eixos de ${ax} ainda apresentam pontos que precisam de atenção nos próximos 60 a 90 dias. Com a transição ativa desde 2026, é hora de converter os fundamentos já construídos em ações concretas e estruturadas. O Plano de Ação indica os próximos passos para consolidar a adequação e reduzir a exposição residual.`,
      urgency: "Organize as ações por responsável e revise o progresso mensalmente com o contador.",
    };
  }
  return {
    text: `${name} foi classificada com risco BAIXO na Reforma Tributária. A empresa demonstra boa base de adequação nas principais dimensões avaliadas${axisNames.length > 0 ? `, com atenção pontual aos eixos de ${axisNames.join(" e ")}` : ""}. A transição está ativa desde 2026 e exige monitoramento contínuo ao longo do período de coexistência (2026–2033). O Plano de Ação indica os ajustes pontuais recomendados para manter a conformidade e aproveitar as oportunidades identificadas no diagnóstico.`,
    urgency: "Revise os pontos indicados, monitore a regulamentação mensalmente e agende revisão trimestral com o contador.",
  };
}
