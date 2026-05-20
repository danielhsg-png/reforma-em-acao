import jsPDF from "jspdf";
import {
  getReadinessLevel,
  getRiskLabelConfig,
  generateConclusionText,
  RISK_THRESHOLDS,
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
  contactPhone?: string;
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
  priceSensitivity?: string;
  hasGovernmentContracts?: string;
  supplierRegimeType?: string;
  hasFrequentReturns?: string;
  erpIntegratedFinance?: string;
  erpVendorReformPlan?: string;
  fiscalDocTypes?: string[];
  knowsMarginByProduct?: string;
  easePriceAdjustment?: string;
}

// Remove only emojis, surrogate pairs and chars the jsPDF WinAnsi encoding
// does not cover. Latin-1 accents (áéíóúãõç) remain intact.
function sanitizeText(str: string): string {
  if (!str) return "";
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/–|—/g, "-")
    .replace(/→|⇒/g, ">")
    .replace(/•/g, "-")
    .replace(/…/g, "...")
    .replace(/°/g, "o")
    .replace(/[\u2705\u2713\u2714\u2611\u2610]/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{1F000}-\u{1F2FF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .split("")
    .filter((c) => c.charCodeAt(0) <= 255)
    .join("");
}

// ─── Color palette ────────────────────────────────────────────────────────────
type RGB = [number, number, number];
const NAVY: RGB = [15, 30, 53];
const NAVY_DEEP: RGB = [8, 16, 31];
const ORANGE: RGB = [249, 115, 22];
const ORANGE_SOFT: RGB = [255, 237, 213];
const GREEN: RGB = [16, 185, 129];
const RED: RGB = [220, 38, 38];
const AMBER: RGB = [202, 138, 4];
const WHITE: RGB = [255, 255, 255];
const INK: RGB = [30, 41, 59];
const SLATE: RGB = [71, 85, 105];
const MUTED: RGB = [100, 116, 139];
const LINE: RGB = [226, 232, 240];
const ZEBRA: RGB = [248, 250, 252];

function readinessColor(level: string): RGB {
  switch (level) {
    case "CRITICO":
      return RED;
    case "BAIXO":
      return ORANGE;
    case "MODERADO":
      return AMBER;
    default:
      return GREEN;
  }
}
function readinessLabel(level: string): string {
  switch (level) {
    case "CRITICO":
      return "CRÍTICO";
    case "BAIXO":
      return "BAIXO";
    case "MODERADO":
      return "MODERADO";
    default:
      return "AVANÇADO";
  }
}

// Axis weights (display-only)
const AXIS_WEIGHTS: Record<string, string> = {
  "Fiscal / Documental": "25%",
  "Compras / Creditos": "20%",
  "Compras / Cr": "20%",
  "Comercial / Contratos": "20%",
  "Financeiro / Caixa": "20%",
  "Governanca / Sistemas": "15%",
};
function getAxisWeight(name: string): string {
  const sane = sanitizeText(name);
  for (const [key, val] of Object.entries(AXIS_WEIGHTS)) {
    if (sane.includes(sanitizeText(key).slice(0, 10))) return val;
  }
  return "";
}
function axisLegend(score: number): string {
  const prontidao = 100 - score;
  if (prontidao < RISK_THRESHOLDS.BAIXO) return "Crítico";
  if (prontidao < RISK_THRESHOLDS.MODERADO) return "Baixa prontidão";
  if (prontidao < RISK_THRESHOLDS.AVANCADO) return "Em estruturação";
  return "Adequado";
}
function cleanMotivo(text: string): string {
  const boilerplates = ["A fase de coexist", "Com a fase de coexist"];
  const sentences = text.split(/\.\s+/);
  const filtered = sentences.filter((s) => {
    const stripped = s.replace(/^[^A-Za-z\u00C0-\u024F]+/, "");
    return !boilerplates.some((bp) => stripped.startsWith(bp));
  });
  const result = filtered.join(". ").trim();
  return result || text.trim();
}

// Load a PNG from /public and return a base64 data URL (cached).
const logoCache: Record<string, string> = {};
async function loadImageAsDataUrl(path: string): Promise<string | null> {
  if (logoCache[path]) return logoCache[path];
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("reader error"));
      reader.readAsDataURL(blob);
    });
    logoCache[path] = dataUrl;
    return dataUrl;
  } catch {
    return null;
  }
}

// ─── Main export ───────────────────────────────────────────────────────────────
export async function generateActionPlanPdf(
  data: CompanyData,
  diagnosis: DiagnosisResult,
  plan: PlanAction[],
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW = 210;
  const PH = 297;
  const M = 16;
  const CW = PW - M * 2;
  const todayStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const todayIso = new Date().toISOString().slice(0, 10);

  const level = getReadinessLevel(diagnosis.overallScore);
  const levelRgb = readinessColor(level);
  const levelTxt = readinessLabel(level);

  // Logos (gracefully degrade if offline)
  const [logoWhite, logoColor] = await Promise.all([
    loadImageAsDataUrl("/logo-png-branca.png"),
    loadImageAsDataUrl("/logo-png-color.png"),
  ]);

  // ── Draw helpers ────────────────────────────────────────────────────────────
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
  function roundedFill(x: number, y: number, w: number, h: number, r: number, rgb: RGB) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.roundedRect(x, y, w, h, r, r, "F");
  }
  function roundedBorder(x: number, y: number, w: number, h: number, r: number, fill: RGB, stroke: RGB, lw = 0.4) {
    doc.setFillColor(fill[0], fill[1], fill[2]);
    doc.setDrawColor(stroke[0], stroke[1], stroke[2]);
    doc.setLineWidth(lw);
    doc.roundedRect(x, y, w, h, r, r, "FD");
  }
  function hLine(y: number, x1 = M, x2 = M + CW, rgb: RGB = LINE, lw = 0.3) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    doc.setLineWidth(lw);
    doc.line(x1, y, x2, y);
  }

  // ── Institutional header/footer on internal pages ───────────────────────────
  function drawInternalHeader(title: string): void {
    fillR(0, 0, PW, 14, WHITE);
    if (logoColor) {
      try {
        doc.addImage(logoColor, "PNG", M, 4, 28, 8, undefined, "FAST");
      } catch {
        // logo embed failed — fall through
      }
    }
    setF("bold", 8);
    setC(ORANGE);
    doc.text("DIAGNÓSTICO TRIBUTÁRIO", PW - M, 8, { align: "right" });
    setF("normal", 7);
    setC(MUTED);
    doc.text(sanitizeText(title).toUpperCase(), PW - M, 12, { align: "right" });
    // Accent rule
    doc.setDrawColor(ORANGE[0], ORANGE[1], ORANGE[2]);
    doc.setLineWidth(0.6);
    doc.line(0, 14, PW, 14);
  }

  function drawInternalFooter(): void {
    const pageNum = doc.getCurrentPageInfo().pageNumber;
    const total = (doc as any).internal.getNumberOfPages();
    doc.setDrawColor(LINE[0], LINE[1], LINE[2]);
    doc.setLineWidth(0.3);
    doc.line(M, PH - 14, PW - M, PH - 14);
    setF("normal", 7);
    setC(MUTED);
    doc.text("Reforma em Ação - Plataforma de Diagnóstico Tributário", M, PH - 9);
    doc.text("app.reformaemacao.com.br", PW / 2, PH - 9, { align: "center" });
    doc.text(`Página ${pageNum} de ${total}`, PW - M, PH - 9, { align: "right" });
  }

  function startInternalPage(title: string): number {
    doc.addPage();
    fillR(0, 0, PW, PH, WHITE);
    drawInternalHeader(title);
    drawInternalFooter();
    return 22;
  }

  function checkPageBreak(y: number, needed: number, pageTitle: string): number {
    if (y + needed > PH - 20) {
      return startInternalPage(pageTitle);
    }
    return y;
  }

  function sectionTitle(text: string, y: number): number {
    setF("bold", 13);
    setC(NAVY);
    doc.text(sanitizeText(text), M, y);
    // Orange underline
    doc.setDrawColor(ORANGE[0], ORANGE[1], ORANGE[2]);
    doc.setLineWidth(1.2);
    doc.line(M, y + 1.5, M + 24, y + 1.5);
    return y + 10;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PAGE 1 — COVER
  // ──────────────────────────────────────────────────────────────────────────
  fillR(0, 0, PW, PH, NAVY);

  // Subtle orange accents (top and bottom)
  fillR(0, 0, PW, 1.5, ORANGE);
  fillR(0, PH - 1.5, PW, 1.5, ORANGE);

  // Large soft glow square (decorative)
  doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
  doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
  doc.roundedRect(-30, 30, 120, 120, 60, 60, "F");
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // Logo
  if (logoWhite) {
    try {
      doc.addImage(logoWhite, "PNG", (PW - 70) / 2, 28, 70, 20, undefined, "FAST");
    } catch {
      setF("bold", 26);
      setC(ORANGE);
      doc.text("REFORMA EM ACAO", PW / 2, 44, { align: "center" });
    }
  } else {
    setF("bold", 26);
    setC(ORANGE);
    doc.text("REFORMA EM ACAO", PW / 2, 44, { align: "center" });
  }

  // Accent bar
  doc.setDrawColor(ORANGE[0], ORANGE[1], ORANGE[2]);
  doc.setLineWidth(1.5);
  doc.line((PW - 40) / 2, 58, (PW + 40) / 2, 58);

  // Subtitle
  setF("bold", 20);
  setC(WHITE);
  doc.text("Diagnóstico de Prontidão", PW / 2, 74, { align: "center" });

  setF("normal", 10);
  setC([148, 163, 184]);
  doc.text("Plano de Ação para Adaptação à Reforma Tributária 2026", PW / 2, 86, { align: "center" });

  // Hairline
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.2);
  doc.setGState(new (doc as any).GState({ opacity: 0.25 }));
  doc.line(M + 20, 96, PW - M - 20, 96);
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // Card with company name
  const coverCardY = 108;
  const coverCardH = 46;
  doc.setFillColor(255, 255, 255);
  doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
  doc.roundedRect(M, coverCardY, CW, coverCardH, 4, 4, "F");
  doc.setGState(new (doc as any).GState({ opacity: 1 }));
  doc.setDrawColor(ORANGE[0], ORANGE[1], ORANGE[2]);
  doc.setLineWidth(0.3);
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }));
  doc.roundedRect(M, coverCardY, CW, coverCardH, 4, 4);
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  setF("normal", 8);
  setC([148, 163, 184]);
  doc.text("EMPRESA ANALISADA", PW / 2, coverCardY + 9, { align: "center" });

  const cnSafe = sanitizeText(data.companyName).toUpperCase();
  const cnFontSize = cnSafe.length > 40 ? 13 : cnSafe.length > 28 ? 15 : 18;
  setF("bold", cnFontSize);
  setC(WHITE);
  const cnLines: string[] = doc.splitTextToSize(cnSafe, CW - 10);
  doc.text(cnLines, PW / 2, coverCardY + 18 + (cnFontSize * 0.1), { align: "center" });
  const cnBaselineY = coverCardY + 18 + (cnLines.length - 1) * (cnFontSize * 0.42);

  setF("normal", 9);
  setC([203, 213, 225]);
  const metaLine = sanitizeText(
    [data.cnpj ? `CNPJ ${data.cnpj}` : "", data.estado && data.municipio ? `${data.municipio} / ${data.estado}` : ""]
      .filter(Boolean)
      .join("   |   "),
  );
  doc.text(metaLine, PW / 2, cnBaselineY + 10, { align: "center" });

  // Large readiness badge
  const badgeW = 140;
  const badgeH = 46;
  const badgeX = (PW - badgeW) / 2;
  const badgeY = 168;
  roundedFill(badgeX, badgeY, badgeW, badgeH, 4, levelRgb);
  setF("normal", 8);
  setC(WHITE);
  doc.setGState(new (doc as any).GState({ opacity: 0.85 }));
  doc.text("NÍVEL DE PRONTIDÃO", PW / 2, badgeY + 11, { align: "center" });
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  setF("bold", 28);
  setC(WHITE);
  doc.text(levelTxt, PW / 2, badgeY + 27, { align: "center" });

  setF("bold", 10);
  setC(WHITE);
  doc.text(`Score ${Math.round(diagnosis.overallScore)}/100`, PW / 2, badgeY + 38, { align: "center" });

  // Warning line for critical
  if (level === "CRITICO") {
    setF("bold", 9);
    setC([255, 220, 220]);
    doc.text("ATENÇÃO: esta empresa necessita de ação imediata", PW / 2, badgeY + badgeH + 10, { align: "center" });
  }

  // Cover bottom meta
  setF("normal", 8);
  setC([148, 163, 184]);
  doc.text(`Documento gerado em ${sanitizeText(todayStr)}`, PW / 2, PH - 24, { align: "center" });
  doc.text("Base normativa: EC 132/2023  -  LC 214/2025  -  LC 227/2026", PW / 2, PH - 18, { align: "center" });
  doc.text("Período de transição: 2026 a 2033", PW / 2, PH - 12, { align: "center" });

  // ──────────────────────────────────────────────────────────────────────────
  // PAGE 2 — DADOS DA EMPRESA
  // ──────────────────────────────────────────────────────────────────────────
  let y = startInternalPage("Dados da Empresa");
  y = sectionTitle("Dados da empresa", y);

  const regimeLbl = REGIME_LABELS[data.regime] || data.regime || "-";
  const sectorLbl = SECTOR_LABELS[data.sector] || data.sector || "-";
  const revLbl = REVENUE_LABELS[data.annualRevenue || ""] || data.annualRevenue || "-";
  const empLbl = EMPLOYEE_LABELS[data.employeeCount] || data.employeeCount || "-";
  const opsMap: Record<string, string> = {
    b2b: "B2B (venda para empresas)",
    b2c: "B2C (venda para consumidor final)",
    b2b_b2c: "B2B e B2C (ambos os públicos)",
  };
  const geoMap: Record<string, string> = { local: "Local / Municipal", estadual: "Estadual", nacional: "Nacional / Multi-estado" };

  const rows: [string, string][] = [
    ["Razão Social", data.companyName + (data.nomeFantasia ? ` (${data.nomeFantasia})` : "")],
    ["CNPJ", data.cnpj || "-"],
    ["Regime Tributário", regimeLbl],
    ["Setor de Atuação", sectorLbl],
    ["Faturamento Anual", revLbl],
    ["Porte (colaboradores)", empLbl],
    ["Tipo de Operação", opsMap[data.operations] || data.operations || "-"],
    ["Abrangência Geográfica", geoMap[data.geographicScope || ""] || "-"],
    ["Localidade", [data.municipio, data.estado].filter(Boolean).join(" - ") || "-"],
    ["CNAE", data.cnaeCode || "-"],
  ];
  if (data.contactName) rows.push(["Responsável", data.contactName + (data.contactRole ? ` (${data.contactRole})` : "")]);
  if (data.contactEmail) rows.push(["E-mail", data.contactEmail]);
  if (data.contactPhone) rows.push(["Telefone", data.contactPhone]);

  // Two-column table
  const colW = (CW - 4) / 2;
  const rowH = 14;
  const leftRows = rows.filter((_, i) => i % 2 === 0);
  const rightRows = rows.filter((_, i) => i % 2 === 1);
  const maxLen = Math.max(leftRows.length, rightRows.length);

  for (let i = 0; i < maxLen; i++) {
    const isZebra = i % 2 === 0;
    // Left cell
    if (leftRows[i]) {
      const [lbl, val] = leftRows[i];
      const x = M;
      fillStrokeR(x, y + i * rowH, colW, rowH, isZebra ? ZEBRA : WHITE, LINE, 0.2);
      setF("normal", 7.5);
      setC(MUTED);
      doc.text(sanitizeText(lbl).toUpperCase(), x + 3, y + i * rowH + 5);
      setF("bold", 9.5);
      setC(NAVY);
      const lines: string[] = doc.splitTextToSize(sanitizeText(val), colW - 6);
      doc.text(lines.slice(0, 1), x + 3, y + i * rowH + 11);
    }
    // Right cell
    if (rightRows[i]) {
      const [lbl, val] = rightRows[i];
      const x = M + colW + 4;
      fillStrokeR(x, y + i * rowH, colW, rowH, isZebra ? ZEBRA : WHITE, LINE, 0.2);
      setF("normal", 7.5);
      setC(MUTED);
      doc.text(sanitizeText(lbl).toUpperCase(), x + 3, y + i * rowH + 5);
      setF("bold", 9.5);
      setC(NAVY);
      const lines: string[] = doc.splitTextToSize(sanitizeText(val), colW - 6);
      doc.text(lines.slice(0, 1), x + 3, y + i * rowH + 11);
    }
  }

  y += maxLen * rowH + 10;

  // ──────────────────────────────────────────────────────────────────────────
  // PAGE 3 — DIAGNÓSTICO
  // ──────────────────────────────────────────────────────────────────────────
  y = startInternalPage("Diagnóstico de Prontidão");
  y = sectionTitle("Diagnóstico de Prontidão", y);

  // Score hero: left block with number, middle with bar, right with level chip.
  // Care: every getTextWidth call must be made with the SAME font as the text
  // it measures, otherwise the next element lands on top.
  const heroH = 38;
  roundedBorder(M, y, CW, heroH, 3, WHITE, LINE, 0.3);

  // Chip first (we use its width to reserve space)
  const chipW = 46;
  const chipH = 18;
  const chipX = M + CW - chipW - 6;
  const chipY = y + (heroH - chipH) / 2;
  roundedFill(chipX, chipY, chipW, chipH, 2, levelRgb);
  setF("bold", 11);
  setC(WHITE);
  doc.text(levelTxt, chipX + chipW / 2, chipY + chipH / 2 + 3.5, { align: "center" });

  // Score label
  setF("normal", 8);
  setC(MUTED);
  doc.text("SCORE GERAL DE PRONTIDÃO", M + 6, y + 9);

  // Big score number — measure in bold 30 (same font used to render)
  const scoreStr = `${Math.round(diagnosis.overallScore)}`;
  setF("bold", 30);
  setC(NAVY);
  const scoreW = doc.getTextWidth(scoreStr);
  doc.text(scoreStr, M + 6, y + 28);

  // "/100" suffix — right after the number, using normal 11
  setF("normal", 11);
  setC(MUTED);
  doc.text("/100", M + 6 + scoreW + 2, y + 28);

  // Score bar — sits between the number and the chip, with safe gaps
  const numberBlockW = Math.max(44, scoreW + doc.getTextWidth("/100") + 10);
  const barX = M + 6 + numberBlockW + 6;
  const barRightMax = chipX - 8;
  const barW = Math.max(24, barRightMax - barX);
  const barY = y + 20;
  fillR(barX, barY, barW, 6, [241, 245, 249]);
  const fillPct = Math.max(0.02, Math.min(1, diagnosis.overallScore / 100));
  fillR(barX, barY, barW * fillPct, 6, levelRgb);
  setF("normal", 7);
  setC(MUTED);
  doc.text("0", barX, barY + 11);
  doc.text("100", barX + barW, barY + 11, { align: "right" });

  y += heroH + 8;

  // Conclusion paragraph — reserve 30mm of slack on the right for long
  // accented lines (jsPDF helvetica metrics underestimate Latin-1 glyphs).
  const { text: conclusionRaw } = generateConclusionText(data.companyName, diagnosis);
  const conclusionLines: string[] = doc.splitTextToSize(sanitizeText(conclusionRaw), CW - 30);
  y = checkPageBreak(y, conclusionLines.length * 4 + 8, "Diagnostico de Prontidao");
  setF("normal", 9);
  setC(INK);
  doc.text(conclusionLines, M, y);
  y += conclusionLines.length * 4.5 + 6;

  // Axes
  y = checkPageBreak(y, 28, "Diagnóstico de Prontidão");
  setF("bold", 10);
  setC(NAVY);
  doc.text("Avaliação por eixo de prontidão", M, y);
  y += 6;
  setF("normal", 8);
  setC(MUTED);
  doc.text("Cada eixo é avaliado de 0 a 100. Quanto maior o score, maior a prontidão para a reforma.", M, y);
  y += 7;

  diagnosis.axes.forEach((ax) => {
    y = checkPageBreak(y, 18, "Diagnóstico de Prontidão");

    const weight = getAxisWeight(ax.name);
    const axLabel = sanitizeText(ax.name);
    const legend = axisLegend(ax.score);
    const axCfg = getRiskLabelConfig(100 - ax.score);
    const legendC: RGB = axCfg.rgb;

    // Label — measure width in the SAME font used to render (bold 9).
    setF("bold", 9);
    setC(NAVY);
    const axLabelW = doc.getTextWidth(axLabel);
    doc.text(axLabel, M, y);

    // "peso X%" suffix — placed right after the axis name with a 4mm gap.
    if (weight) {
      setF("normal", 8);
      setC(MUTED);
      doc.text(`peso ${weight}`, M + axLabelW + 4, y);
    }

    // Score "XX /100" right aligned
    const scoreText = `${ax.score}`;
    setF("bold", 9);
    setC(NAVY);
    const scoreTextW = doc.getTextWidth(scoreText);
    doc.text(scoreText, M + CW - 12, y, { align: "right" });
    setF("normal", 7);
    setC(MUTED);
    doc.text("/100", M + CW - 12 + 2, y);
    // consume scoreTextW so tsc doesn't complain when we later remove it
    void scoreTextW;

    // Bar
    const axBarY = y + 2.5;
    const axBarW = CW - 2;
    fillR(M, axBarY, axBarW, 4, [241, 245, 249]);
    fillR(M, axBarY, axBarW * Math.max(0.02, ax.score / 100), 4, legendC);

    // Legend
    setF("bold", 7);
    setC(legendC);
    doc.text(legend.toUpperCase(), M, y + 12);

    y += 18;
  });

  // Opportunity callout — the text starts 6mm inside the card so reserve
  // 12mm on the left + 30mm on the right (40mm total margin inside the CW).
  if (diagnosis.topOpportunity) {
    const oppLines: string[] = doc.splitTextToSize(sanitizeText(diagnosis.topOpportunity), CW - 40);
    const oppH = 14 + oppLines.length * 5;
    y = checkPageBreak(y, oppH + 4, "Diagnóstico de Prontidão");

    roundedBorder(M, y, CW, oppH, 3, [236, 253, 245], GREEN, 0.4);
    // Label
    setF("bold", 8);
    setC(GREEN);
    doc.text("MAIOR OPORTUNIDADE", M + 6, y + 7);
    // Text
    setF("normal", 9);
    setC(INK);
    doc.text(oppLines, M + 6, y + 13);
    y += oppH + 6;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PAGES 4+ — PLANO DE AÇÃO
  // ──────────────────────────────────────────────────────────────────────────
  y = startInternalPage("Plano de Ação Prioritário");
  y = sectionTitle("Plano de Ação Prioritário", y);

  setF("normal", 9);
  setC(MUTED);
  const introLines: string[] = doc.splitTextToSize(
    "A seguir, o plano estruturado em 3 fases, priorizado pelo grau de urgência e impacto nos eixos críticos identificados no diagnóstico.",
    CW - 30,
  );
  doc.text(introLines, M, y);
  y += introLines.length * 4.5 + 6;

  interface PhaseInfo {
    num: 1 | 2 | 3;
    label: string;
    prazo: string;
    color: RGB;
  }
  const phases: PhaseInfo[] = [
    { num: 1, label: "FASE 1 - AÇÕES IMEDIATAS", prazo: "7 a 15 dias", color: RED },
    { num: 2, label: "FASE 2 - ESTRUTURAÇÃO", prazo: "30 a 60 dias", color: ORANGE },
    { num: 3, label: "FASE 3 - CONSOLIDAÇÃO", prazo: "60 a 120 dias", color: NAVY },
  ];

  phases.forEach((ph) => {
    const phActions = plan.filter((a) => a.phase === ph.num);
    if (phActions.length === 0) return;

    y = checkPageBreak(y, 22, "Plano de Ação Prioritário");

    // Phase header: colored left block + navy ribbon
    const headerH = 11;
    fillR(M, y, 4, headerH, ph.color);
    fillR(M + 4, y, CW - 4, headerH, NAVY);

    setF("bold", 11);
    setC(WHITE);
    doc.text(ph.label, M + 9, y + 7.5);

    // Prazo badge
    const prazoText = ph.prazo;
    const prazoW = doc.getTextWidth(prazoText) + 10;
    roundedFill(M + CW - prazoW - 4, y + 2, prazoW, 7, 2, ph.color);
    setF("bold", 7);
    setC(WHITE);
    doc.text(prazoText, M + CW - prazoW / 2 - 4, y + 7, { align: "center" });

    y += headerH + 5;

    phActions.forEach((action, idx) => {
      const titleSafe = sanitizeText(action.title);
      const descSafe = sanitizeText(action.desc || "");
      const motivoSafe = sanitizeText(cleanMotivo(action.motivo || ""));
      const prazoSafe = sanitizeText(`Prazo: ${action.prazo}  |  Responsável: ${action.responsavel}`);

      // Text column with very generous margins on both sides because
      // jsPDF's helvetica metrics systematically underestimate the rendered
      // width of accented glyphs (á, ã, ç…) by up to ~15%. An extra-safe
      // margin guarantees long lines never clip against the card border.
      const TEXT_PAD_L = 15;
      const TEXT_PAD_R = 30;
      const textW = CW - TEXT_PAD_L - TEXT_PAD_R;
      const textX = M + TEXT_PAD_L;
      const titleLines: string[] = doc.splitTextToSize(`${idx + 1}. ${titleSafe}`, textW);
      const descLines: string[] = doc.splitTextToSize(descSafe, textW);
      const motivoLines: string[] = doc.splitTextToSize(motivoSafe, textW);
      const prazoLines: string[] = doc.splitTextToSize(prazoSafe, textW);

      const contentH =
        6 +
        titleLines.length * 5 +
        3 +
        descLines.length * 4.5 +
        (motivoLines.length > 0 ? 4 + 4 + motivoLines.length * 4.5 : 0) +
        4 +
        prazoLines.length * 4 +
        4;

      y = checkPageBreak(y, contentH + 6, "Plano de Ação Prioritário");

      // Card with left stripe
      roundedBorder(M, y, CW, contentH, 2, WHITE, LINE, 0.3);
      fillR(M, y, 2.5, contentH, ph.color);

      // Checkbox
      doc.setDrawColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.setLineWidth(0.3);
      doc.rect(M + 7, y + 4.2, 3.5, 3.5);

      // Title
      setF("bold", 10);
      setC(NAVY);
      doc.text(titleLines, textX, y + 7);
      let cy = y + 7 + (titleLines.length - 1) * 5 + 4;

      // Description
      setF("normal", 8.5);
      setC(INK);
      doc.text(descLines, textX, cy);
      cy += descLines.length * 4.5 + 2;

      // Motivo
      if (motivoSafe) {
        setF("bold", 7.5);
        setC(ph.color);
        doc.text("POR QUÊ", textX, cy + 2);
        cy += 5;
        setF("normal", 8);
        setC(SLATE);
        doc.text(motivoLines, textX, cy);
        cy += motivoLines.length * 4.5;
      }

      // Prazo / Responsavel at bottom (may wrap to 2 lines)
      setF("normal", 7.5);
      setC(MUTED);
      const prazoY = y + contentH - prazoLines.length * 4 - 1;
      doc.text(prazoLines, textX, prazoY);

      y += contentH + 5;
    });

    y += 3;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // FINAL — DISCLAIMER
  // ──────────────────────────────────────────────────────────────────────────
  y = startInternalPage("Aviso Legal");
  y = sectionTitle("Aviso legal e informações regulatórias", y);

  const disclaimers: string[] = [
    "Este diagnóstico tem caráter estritamente informativo e foi gerado com base nas informações fornecidas pela empresa e nas normas EC 132/2023, LC 214/2025 e LC 227/2026. Não substitui consultoria tributária, jurídica ou contábil especializada.",
    "As alíquotas definitivas de IBS e CBS serão definidas pelo Comitê Gestor do IBS e dependem de regulamentação complementar. Os percentuais utilizados são estimativas comparativas - consulte seu contador para confirmar os valores aplicáveis à sua operação.",
    "O período de transição previsto é de 2026 a 2033, com convivência simultânea de tributos antigos e novos conforme calendário da LC 214/2025.",
    "As prioridades e prazos recomendados neste plano refletem boas práticas aplicadas a empresas de perfil similar. Cada organização deve validar o cronograma com seu time fiscal e jurídico antes de implementar as ações.",
  ];

  disclaimers.forEach((d, idx) => {
    const lines: string[] = doc.splitTextToSize(sanitizeText(d), CW - 40);
    const blockH = lines.length * 4.5 + 10;
    y = checkPageBreak(y, blockH + 4, "Aviso legal");

    roundedFill(M, y, 4, blockH - 2, 1, ORANGE);
    setF("bold", 9);
    setC(NAVY);
    doc.text(`${idx + 1}.`, M + 8, y + 6);
    setF("normal", 9);
    setC(SLATE);
    doc.text(lines, M + 14, y + 6);

    y += blockH;
  });

  // Signature block
  y = checkPageBreak(y, 40, "Aviso legal");
  y += 4;
  roundedBorder(M, y, CW, 28, 3, ZEBRA, LINE, 0.3);

  if (logoColor) {
    try {
      doc.addImage(logoColor, "PNG", M + 6, y + 8, 34, 10, undefined, "FAST");
    } catch {}
  }

  setF("normal", 7.5);
  setC(MUTED);
  doc.text("DOCUMENTO GERADO EM", M + CW - 6, y + 8, { align: "right" });
  setF("bold", 9);
  setC(NAVY);
  doc.text(sanitizeText(todayStr), M + CW - 6, y + 14, { align: "right" });

  setF("normal", 7.5);
  setC(MUTED);
  doc.text("NÍVEL DE PRONTIDÃO", M + CW - 6, y + 20, { align: "right" });
  setF("bold", 9);
  setC(levelRgb);
  doc.text(`${levelTxt} - SCORE ${Math.round(diagnosis.overallScore)}/100`, M + CW - 6, y + 25, { align: "right" });

  // Refresh footer on every page with final page count
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p);
    // Redraw footer (already drawn, but now with correct total)
    fillR(M, PH - 14, CW, 14, WHITE);
    drawInternalFooter();
  }

  // ─── Save ─────────────────────────────────────────────────────────────────
  const nameSafe = sanitizeText(data.companyName)
    .replace(/[^a-zA-Z0-9]/g, "_")
    .slice(0, 30);
  const filename = `REFORMA-EM-ACAO_${nameSafe}_${todayIso}.pdf`;
  doc.save(filename);
}
