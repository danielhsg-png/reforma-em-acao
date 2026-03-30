import jsPDF from "jspdf";
import {
  getReadinessLevel,
  generateConclusionText,
  SECTOR_LABELS,
  REGIME_LABELS,
  EMPLOYEE_LABELS,
  REVENUE_LABELS,
  type DiagnosisResult,
  type PlanAction,
} from "@/lib/riskConfig";

// ─── Data interface ────────────────────────────────────────────────────────────
interface CompanyData {
  companyName: string;
  nomeFantasia?: string;
  cnpj: string;
  cnaeCode?: string;
  estado?: string;
  municipio?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  sector: string;
  regime: string;
  operations: string;
  annualRevenue?: string;
  employeeCount: string;
  businessType?: string;
  geographicScope?: string;
  salesStates: string[];
  erpSystem: string;
  nfeEmission: string;
  invoiceVolume: string;
  supplierCount: string;
  simplesSupplierPercent: string;
  hasLongTermContracts: string;
  priceRevisionClause: string;
  taxResponsible: string;
  splitPaymentAware: string;
  mainConcern: string;
  profitMargin: string;
  specialRegimes: string[];
  tightWorkingCapital?: string;
  hasExports?: string;
  hasImports?: string;
  mainExpenses?: string[];
  managementAwareOfReform?: string;
  preparationStarted?: string;
  hadInternalTraining?: string;
  paymentMethods?: string[];
  riskScore: number;
  hasRegularNF?: string;
  hasNFErrors?: string;
  internalFiscalResponsible?: string;
  catalogStandardized?: string;
}

// ─── 2.2 sanitizeText ─────────────────────────────────────────────────────────
function sanitizeText(str: string): string {
  if (!str) return "";
  return str
    .replace(/[áàâã]/g, "a").replace(/[ÁÀÂÃ]/g, "A")
    .replace(/[éèê]/g,  "e").replace(/[ÉÈÊ]/g,  "E")
    .replace(/[íìî]/g,  "i").replace(/[ÍÌÎ]/g,  "I")
    .replace(/[óòôõ]/g, "o").replace(/[ÓÒÔÕ]/g, "O")
    .replace(/[úùû]/g,  "u").replace(/[ÚÙÛ]/g,  "U")
    .replace(/ç/g, "c").replace(/Ç/g, "C")
    .replace(/°/g, "o")
    .replace(/&/g, "e")
    .replace(/→|⇒/g, ">")
    .replace(/–/g, "-").replace(/—/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2713\u2714\u2611\u2610\u2705]/g, "")
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .split("").map(c => c.charCodeAt(0) > 255 ? "" : c).join("");
}

// ─── Color palette ────────────────────────────────────────────────────────────
type RGB = [number, number, number];
const NAVY:      RGB = [15,  30,  53];
const ORANGE:    RGB = [249, 115, 22];
const GREEN:     RGB = [22,  163, 74];
const RED:       RGB = [220, 38,  38];
const AMBER:     RGB = [202, 138, 4];
const WHITE:     RGB = [255, 255, 255];
const GRAY_DARK: RGB = [51,  51,  51];
const GRAY_MID:  RGB = [100, 100, 100];
const GRAY_LIGHT:RGB = [210, 210, 210];

function readinessColor(level: string): RGB {
  switch (level) {
    case "CRITICO":  return RED;
    case "BAIXO":    return ORANGE;
    case "MODERADO": return AMBER;
    default:         return GREEN;
  }
}

function readinessLabel(level: string): string {
  switch (level) {
    case "CRITICO":  return "CRITICO";
    case "BAIXO":    return "BAIXO";
    case "MODERADO": return "MODERADO";
    default:         return "AVANCADO";
  }
}

// ─── ASCII progress bar ───────────────────────────────────────────────────────
function asciiBar(score: number, width = 18): string {
  const filled = Math.max(0, Math.min(width, Math.round((score / 100) * width)));
  return "[" + "=".repeat(filled) + " ".repeat(width - filled) + "]";
}

function axisLegend(score: number): string {
  const prontidao = 100 - score;
  if (prontidao < 40) return "Necessita atencao";
  if (prontidao < 70) return "Em andamento";
  return "Adequado";
}

// ─── Axis weights (display only) ──────────────────────────────────────────────
const AXIS_WEIGHTS: Record<string, string> = {
  "Fiscal / Documental":   "25%",
  "Compras / Creditos":    "25%",
  "Compras / Cr":          "25%",
  "Comercial / Contratos": "20%",
  "Financeiro / Caixa":    "20%",
  "Governanca / Sistemas": "10%",
};
function getAxisWeight(name: string): string {
  const sane = sanitizeText(name);
  for (const [key, val] of Object.entries(AXIS_WEIGHTS)) {
    if (sane.includes(sanitizeText(key).slice(0, 10))) return val;
  }
  return "";
}

// ─── Remove boilerplate from motivo ──────────────────────────────────────────
function cleanMotivo(text: string): string {
  const boilerplates = ["A fase de coexist", "Com a fase de coexist"];
  const sentences = text.split(/\.\s+/);
  const filtered = sentences.filter(s => !boilerplates.some(bp => s.startsWith(bp)));
  const result = filtered.join(". ").trim();
  return result || text.trim();
}

// ─── Main export ───────────────────────────────────────────────────────────────
export function generateActionPlanPdf(data: CompanyData, diagnosis: DiagnosisResult, plan: PlanAction[]) {
  const doc    = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW     = 210;
  const PH     = 297;
  const M      = 20;
  const CW     = 170;
  const todayStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const level     = getReadinessLevel(diagnosis.overallScore);
  const levelRgb  = readinessColor(level);
  const levelTxt  = readinessLabel(level);

  // ── Low-level draw helpers ─────────────────────────────────────────────────
  function setF(style: "bold" | "normal", size: number) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  }
  function setC(rgb: RGB) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }
  function fillR(x: number, y: number, w: number, h: number, rgb: RGB) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(x, y, w, h, "F");
  }
  function strokeR(x: number, y: number, w: number, h: number, rgb: RGB, lw = 0.4) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    doc.setLineWidth(lw);
    doc.rect(x, y, w, h);
  }
  function fillStrokeR(x: number, y: number, w: number, h: number, fill: RGB, stroke: RGB, lw = 0.4) {
    doc.setFillColor(fill[0], fill[1], fill[2]);
    doc.setDrawColor(stroke[0], stroke[1], stroke[2]);
    doc.setLineWidth(lw);
    doc.rect(x, y, w, h, "FD");
  }
  function hLine(y: number, rgb: RGB = GRAY_LIGHT, lw = 0.3) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    doc.setLineWidth(lw);
    doc.line(M, y, M + CW, y);
  }

  // ─── 2.4 drawCheckbox ──────────────────────────────────────────────────────
  function drawCheckbox(x: number, y: number, size = 4): void {
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);
    doc.rect(x, y - size + 0.5, size, size);
  }

  // ─── 2.6 addPageFooter ─────────────────────────────────────────────────────
  function addPageFooter(): void {
    const pageNum = doc.getCurrentPageInfo().pageNumber;
    doc.setDrawColor(GRAY_LIGHT[0], GRAY_LIGHT[1], GRAY_LIGHT[2]);
    doc.setLineWidth(0.3);
    doc.line(M, 285, M + CW, 285);
    setF("normal", 7);
    setC(GRAY_MID);
    doc.text("REFORMA EM ACAO - Diagnostico Tributario", M, 289);
    doc.text(`Pagina ${pageNum}`, PW - M, 289, { align: "right" });
  }

  // ─── 2.3 checkPageBreak ────────────────────────────────────────────────────
  function checkPageBreak(y: number, needed: number, margin = 20): number {
    if (y + needed > 277) {
      doc.addPage();
      fillR(0, 0, PW, PH, WHITE);
      addPageFooter();
      return margin;
    }
    return y;
  }

  // ─── 2.5 addSectionHeader ──────────────────────────────────────────────────
  function addSectionHeader(text: string, y: number): number {
    fillR(0, y, PW, 8, NAVY);
    setF("bold", 10);
    setC(WHITE);
    doc.text(sanitizeText(text).toUpperCase(), M + 4, y + 6);
    return y + 12;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PAGE 1 — CAPA
  // ──────────────────────────────────────────────────────────────────────────
  fillR(0, 0, PW, PH, NAVY);

  // Heading: "REFORMA EM ACAO" in orange, bold 28pt
  setF("bold", 28);
  setC(ORANGE);
  doc.text("REFORMA EM ACAO", PW / 2, 52, { align: "center" });

  // Subtitle
  setF("normal", 14);
  setC(WHITE);
  doc.text("Diagnostico de Prontidao Tributaria", PW / 2, 65, { align: "center" });

  // Orange separator line 2pt
  doc.setDrawColor(ORANGE[0], ORANGE[1], ORANGE[2]);
  doc.setLineWidth(2);
  doc.line((PW - 80) / 2, 73, (PW + 80) / 2, 73);

  // Company name — reduce to 14pt if > 40 chars
  const cnSafe = sanitizeText(data.companyName).toUpperCase();
  const cnFontSize = cnSafe.length > 40 ? 14 : 18;
  setF("bold", cnFontSize);
  setC(WHITE);
  const cnLines: string[] = doc.splitTextToSize(cnSafe, 160);
  doc.text(cnLines, PW / 2, 86, { align: "center" });
  const cnBottom = 86 + (cnLines.length - 1) * (cnFontSize * 0.42);

  // CNPJ and date
  setF("normal", 10);
  setC(WHITE);
  const cnpjLine = sanitizeText([
    data.cnpj ? `CNPJ: ${data.cnpj}` : "",
    todayStr,
  ].filter(Boolean).join("   |   "));
  doc.text(cnpjLine, PW / 2, cnBottom + 10, { align: "center" });

  // Level badge centered
  const badgeW = 100;
  const badgeH = 30;
  const badgeX = (PW - badgeW) / 2;
  const badgeY = cnBottom + 22;
  fillR(badgeX, badgeY, badgeW, badgeH, levelRgb);
  setF("bold", 22);
  setC(WHITE);
  doc.text(levelTxt, PW / 2, badgeY + 15, { align: "center" });
  setF("normal", 9);
  setC(WHITE);
  doc.text("Nivel de Prontidao Operacional", PW / 2, badgeY + 24, { align: "center" });

  // If CRÍTICO: warning line
  if (level === "CRITICO") {
    setF("bold", 9);
    setC([255, 170, 170]);
    doc.text("ATENCAO: Acao imediata necessaria", PW / 2, badgeY + 36, { align: "center" });
  }

  // Cover footer — date in white 8pt
  hLine(281, [80, 80, 80], 0.3);
  setF("normal", 8);
  setC(WHITE);
  const todaySafe = sanitizeText(todayStr);
  doc.text(`Gerado em ${todaySafe}`, M, 285);
  doc.text("EC 132/2023 - LC 214/2025 - LC 227/2026", PW / 2, 285, { align: "center" });
  doc.text("Transicao: 2026-2033", PW - M, 285, { align: "right" });

  // ──────────────────────────────────────────────────────────────────────────
  // PAGE 2 — DADOS DA EMPRESA
  // ──────────────────────────────────────────────────────────────────────────
  doc.addPage();
  fillR(0, 0, PW, PH, WHITE);
  let y = M;
  addPageFooter();

  // Title
  setF("bold", 13);
  setC(NAVY);
  doc.text("DADOS DA EMPRESA", M, y + 7);
  y += 14;
  hLine(y, NAVY, 0.5);
  y += 8;

  // 2-column grid
  const colW = (CW - 8) / 2;
  const col1X = M;
  const col2X = M + colW + 8;
  const rowH  = 12;

  const companyFields: [string, string][] = [
    ["Razao Social",        sanitizeText(data.companyName + (data.nomeFantasia ? ` (${data.nomeFantasia})` : ""))],
    ["CNPJ",                sanitizeText(data.cnpj || "-")],
    ["Regime Tributario",   sanitizeText(REGIME_LABELS[data.regime] || data.regime || "-")],
    ["Setor de Atuacao",    sanitizeText(SECTOR_LABELS[data.sector] || data.sector || "-")],
    ["Faturamento Anual",   sanitizeText(REVENUE_LABELS[data.annualRevenue || ""] || data.annualRevenue || "-")],
    ["Porte",               sanitizeText(EMPLOYEE_LABELS[data.employeeCount] || data.employeeCount || "-")],
    ["Estado",              sanitizeText(data.estado || "-")],
    ["Municipio",           sanitizeText(data.municipio || "-")],
  ];

  companyFields.forEach(([label, value], idx) => {
    const isLeft = idx % 2 === 0;
    const cx = isLeft ? col1X : col2X;
    const cy = y + Math.floor(idx / 2) * rowH;

    // Label — gray 8pt
    setF("normal", 8);
    setC(GRAY_MID);
    doc.text(label, cx, cy);

    // Value — navy bold 10pt
    setF("bold", 10);
    setC(NAVY);
    const vLines: string[] = doc.splitTextToSize(value, colW);
    doc.text(vLines, cx, cy + 5);
  });

  y += Math.ceil(companyFields.length / 2) * rowH + 8;
  hLine(y, GRAY_LIGHT, 0.3);
  y += 8;

  // Operations + geographic scope
  const opsMap: Record<string, string> = {
    b2b:     "B2B (venda para empresas)",
    b2c:     "B2C (venda para consumidor final)",
    b2b_b2c: "B2B e B2C (ambos os publicos)",
  };
  const geoMap: Record<string, string> = {
    local:     "Local / Municipal",
    estadual:  "Estadual",
    nacional:  "Nacional / Multi-estado",
  };

  const extraFields: [string, string][] = [
    ["Tipo de Operacao",      sanitizeText(opsMap[data.operations] || data.operations || "-")],
    ["Abrangencia Geografica", sanitizeText(geoMap[data.geographicScope || ""] || "-")],
  ];
  extraFields.forEach(([label, value]) => {
    setF("normal", 8);
    setC(GRAY_MID);
    doc.text(label, M, y);
    setF("bold", 10);
    setC(NAVY);
    doc.text(value, M, y + 5);
    y += 12;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // PAGE 3 — DIAGNÓSTICO DE PRONTIDÃO
  // ──────────────────────────────────────────────────────────────────────────
  doc.addPage();
  fillR(0, 0, PW, PH, WHITE);
  y = M;
  addPageFooter();

  y = addSectionHeader("DIAGNOSTICO DE PRONTIDAO", y);

  // Large badge
  const bigBadgeW = 120;
  const bigBadgeH = 24;
  const bigBadgeX = (PW - bigBadgeW) / 2;
  fillR(bigBadgeX, y, bigBadgeW, bigBadgeH, levelRgb);
  setF("bold", 20);
  setC(WHITE);
  doc.text(levelTxt, PW / 2, y + 14, { align: "center" });
  y += bigBadgeH + 6;

  // If CRÍTICO: additional alert paragraph
  if (level === "CRITICO") {
    fillR(M, y, CW, 12, [255, 235, 235]);
    strokeR(M, y, CW, 12, RED, 0.5);
    setF("bold", 9);
    setC(RED);
    doc.text("SITUACAO CRITICA: Esta empresa necessita de acao imediata em multiplas frentes.", M + 4, y + 8);
    y += 16;
  }

  // Conclusion text
  const { text: conclusionRaw } = generateConclusionText(data.companyName, diagnosis);
  const conclusionSafe = sanitizeText(conclusionRaw);
  const conclusionLines: string[] = doc.splitTextToSize(conclusionSafe, CW);
  setF("normal", 9);
  setC(GRAY_DARK);
  doc.text(conclusionLines, M, y);
  y += conclusionLines.length * 5 + 8;

  // Section: 5 axes
  setF("bold", 10);
  setC(NAVY);
  doc.text("Avaliacao por Eixo de Prontidao", M, y);
  y += 8;

  // Sort axes weakest first for the "2 eixos mais fracos" mention
  const axesSorted = [...diagnosis.axes].sort((a, b) => a.score - b.score);

  diagnosis.axes.forEach(ax => {
    y = checkPageBreak(y, 18);

    const weight   = getAxisWeight(ax.name);
    const axLabel  = sanitizeText(ax.name) + (weight ? " - " + weight : "");
    const legend   = axisLegend(ax.score);
    const legendC  = ax.score < 40 ? RED : ax.score < 70 ? AMBER : GREEN;
    const bar      = asciiBar(ax.score);

    setF("bold", 9);
    setC(NAVY);
    doc.text(axLabel, M, y);

    setF("normal", 9);
    setC(GRAY_DARK);
    doc.text(bar, M + 2, y + 5);

    setF("bold", 8);
    setC(legendC);
    doc.text(legend, M + 2 + doc.getTextWidth(bar) + 4, y + 5);

    y += 13;
  });

  // Opportunity callout (if present)
  if (diagnosis.topOpportunity) {
    y = checkPageBreak(y, 24);
    const oppSafe  = sanitizeText(diagnosis.topOpportunity);
    const oppLines: string[] = doc.splitTextToSize(oppSafe, CW - 8);
    const oppH = 10 + oppLines.length * 5;
    fillStrokeR(M, y, CW, oppH, [230, 255, 237], GREEN, 0.5);
    setF("bold", 8);
    setC(GREEN);
    doc.text(">> Maior Oportunidade para sua empresa", M + 4, y + 7);
    setF("normal", 8);
    setC(GRAY_DARK);
    doc.text(oppLines, M + 4, y + 13);
    y += oppH + 6;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PAGES 4+ — PLANO DE AÇÃO
  // ──────────────────────────────────────────────────────────────────────────
  doc.addPage();
  fillR(0, 0, PW, PH, WHITE);
  y = M;
  addPageFooter();

  y = addSectionHeader("PLANO DE ACAO PRIORITARIO", y);

  interface PhaseInfo { num: 1 | 2 | 3; label: string; prazo: string; color: RGB }
  const phases: PhaseInfo[] = [
    { num: 1, label: "FASE 1 - ACOES IMEDIATAS",  prazo: "7 a 15 dias",    color: RED   },
    { num: 2, label: "FASE 2 - ESTRUTURACAO",      prazo: "30 a 60 dias",   color: ORANGE},
    { num: 3, label: "FASE 3 - CONSOLIDACAO",      prazo: "60 a 120 dias",  color: NAVY  },
  ];

  phases.forEach(ph => {
    const phActions = plan.filter(a => a.phase === ph.num);
    if (phActions.length === 0) return;

    y = checkPageBreak(y, 22);

    // Phase header — navy background, prazo in orange on the right
    fillR(M, y, CW, 10, NAVY);
    setF("bold", 11);
    setC(WHITE);
    doc.text(ph.label, M + 4, y + 7);
    setF("bold", 9);
    setC(ORANGE);
    doc.text(ph.prazo, PW - M - 2, y + 7, { align: "right" });
    y += 12;

    phActions.forEach((action, idx) => {
      const titleSafe  = sanitizeText(action.title);
      const descSafe   = sanitizeText(action.desc || "");
      const motivoSafe = sanitizeText(cleanMotivo(action.motivo || ""));
      const prazoSafe  = sanitizeText(`Prazo: ${action.prazo}  |  Responsavel: ${action.responsavel}`);

      const titleLines:  string[] = doc.splitTextToSize(`${idx + 1}. ${titleSafe}`, 145);
      const descLines:   string[] = doc.splitTextToSize(descSafe, 155);
      const motivoLines: string[] = doc.splitTextToSize(motivoSafe, 155);

      const itemH = 8 + titleLines.length * 5 + descLines.length * 4.5 + motivoLines.length * 4.5 + 10;

      y = checkPageBreak(y, itemH + 4);

      // Card with left color stripe
      fillStrokeR(M, y, CW, itemH, WHITE, GRAY_LIGHT, 0.3);
      fillR(M, y, 3, itemH, ph.color);

      // 2.4 Checkbox
      drawCheckbox(M + 6, y + 6);

      // Title — 8mm per item as spec
      setF("bold", 9);
      setC(NAVY);
      doc.text(titleLines, M + 13, y + 7);
      let cy = y + 7 + (titleLines.length - 1) * 5 + 4;

      // Desc
      setF("normal", 8);
      setC(GRAY_DARK);
      doc.text(descLines, M + 13, cy);
      cy += descLines.length * 4.5 + 2;

      // Motivo
      if (motivoSafe) {
        setF("bold", 7.5);
        setC(NAVY);
        doc.text("Por que:", M + 13, cy);
        cy += 4;
        setF("normal", 7.5);
        setC(GRAY_MID);
        doc.text(motivoLines, M + 13, cy);
        cy += motivoLines.length * 4.5;
      }

      // Prazo / responsável
      setF("normal", 7.5);
      setC(GRAY_MID);
      doc.text(prazoSafe, M + 13, cy + 2);

      // 8mm spacing between items (spec 2.8)
      y += itemH + 8;
    });

    y += 4;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // ÚLTIMA PÁGINA — DISCLAIMER
  // ──────────────────────────────────────────────────────────────────────────
  y = checkPageBreak(y, 80);

  hLine(y, NAVY, 0.5);
  y += 8;

  setF("bold", 11);
  setC(NAVY);
  doc.text("Aviso Legal e Informacoes Regulatorias", M, y);
  y += 8;

  const disclaimers: string[] = [
    "Este diagnostico tem carater estritamente informativo e foi gerado com base nas informacoes fornecidas pela empresa e nas normas EC 132/2023, LC 214/2025 e LC 227/2026. Nao substitui consultoria tributaria, juridica ou contabil especializada.",
    "As aliquotas definitivas de IBS e CBS serao definidas pelo Comite Gestor do IBS e dependem de regulamentacao complementar. Os percentuais utilizados sao estimativas comparativas — consulte seu contador para confirmar os valores aplicaveis a sua operacao.",
    "O periodo de transicao previsto e de 2026 a 2033, com convivencia simultanea de tributos antigos e novos conforme calendario da LC 214/2025.",
  ];

  disclaimers.forEach(d => {
    const dLines: string[] = doc.splitTextToSize(sanitizeText(d), CW);
    y = checkPageBreak(y, dLines.length * 4.5 + 6);
    setF("normal", 8);
    setC(GRAY_MID);
    doc.text(dLines, M, y);
    y += dLines.length * 4.5 + 5;
  });

  y += 6;

  // Final box — gray border, readiness level in level color
  const finalBoxH = 22;
  y = checkPageBreak(y, finalBoxH + 4);
  fillStrokeR(M, y, CW, finalBoxH, [250, 250, 250], GRAY_LIGHT, 0.5);
  setF("normal", 8);
  setC(GRAY_MID);
  doc.text(sanitizeText(`Documento gerado em ${todayStr} - REFORMA EM ACAO`), M + 4, y + 8);
  setF("bold", 9);
  setC(levelRgb);
  doc.text(`Nivel de Prontidao: ${levelTxt}`, M + 4, y + 17);

  // ─── Save ─────────────────────────────────────────────────────────────────
  const nameSafe  = sanitizeText(data.companyName).replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
  const filename  = `REFORMA-EM-ACAO_${nameSafe}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
