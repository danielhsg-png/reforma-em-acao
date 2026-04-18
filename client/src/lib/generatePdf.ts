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
      return "CRITICO";
    case "BAIXO":
      return "BAIXO";
    case "MODERADO":
      return "MODERADO";
    default:
      return "AVANCADO";
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
  if (prontidao < RISK_THRESHOLDS.BAIXO) return "Critico";
  if (prontidao < RISK_THRESHOLDS.MODERADO) return "Baixa prontidao";
  if (prontidao < RISK_THRESHOLDS.AVANCADO) return "Em estruturacao";
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
    doc.text("DIAGNOSTICO TRIBUTARIO", PW - M, 8, { align: "right" });
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
    doc.text("Reforma em Acao - Plataforma de Diagnostico Tributario", M, PH - 9);
    doc.text("app.reformaemacao.com.br", PW / 2, PH - 9, { align: "center" });
    doc.text(`Pagina ${pageNum} de ${total}`, PW - M, PH - 9, { align: "right" });
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
  setF("bold", 18);
  setC(WHITE);
  doc.text("Diagnostico de Prontidao", PW / 2, 70, { align: "center" });
  doc.text("Tributaria", PW / 2, 79, { align: "center" });

  setF("normal", 10);
  setC([148, 163, 184]);
  doc.text("Plano de Acao para Adaptacao a Reforma Tributaria 2026", PW / 2, 88, { align: "center" });

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
  doc.text("NIVEL DE PRONTIDAO", PW / 2, badgeY + 11, { align: "center" });
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
    doc.text("ATENCAO: esta empresa necessita de acao imediata", PW / 2, badgeY + badgeH + 10, { align: "center" });
  }

  // Cover bottom meta
  setF("normal", 8);
  setC([148, 163, 184]);
  doc.text(`Documento gerado em ${sanitizeText(todayStr)}`, PW / 2, PH - 24, { align: "center" });
  doc.text("Base normativa: EC 132/2023  -  LC 214/2025  -  LC 227/2026", PW / 2, PH - 18, { align: "center" });
  doc.text("Periodo de transicao: 2026 a 2033", PW / 2, PH - 12, { align: "center" });

  // ──────────────────────────────────────────────────────────────────────────
  // PAGE 2 — DADOS DA EMPRESA
  // ──────────────────────────────────────────────────────────────────────────
  let y = startInternalPage("Dados da Empresa");
  y = sectionTitle("Dados da Empresa", y);

  const regimeLbl = REGIME_LABELS[data.regime] || data.regime || "-";
  const sectorLbl = SECTOR_LABELS[data.sector] || data.sector || "-";
  const revLbl = REVENUE_LABELS[data.annualRevenue || ""] || data.annualRevenue || "-";
  const empLbl = EMPLOYEE_LABELS[data.employeeCount] || data.employeeCount || "-";
  const opsMap: Record<string, string> = {
    b2b: "B2B (venda para empresas)",
    b2c: "B2C (venda para consumidor final)",
    b2b_b2c: "B2B e B2C (ambos os publicos)",
  };
  const geoMap: Record<string, string> = { local: "Local / Municipal", estadual: "Estadual", nacional: "Nacional / Multi-estado" };

  const rows: [string, string][] = [
    ["Razao Social", data.companyName + (data.nomeFantasia ? ` (${data.nomeFantasia})` : "")],
    ["CNPJ", data.cnpj || "-"],
    ["Regime Tributario", regimeLbl],
    ["Setor de Atuacao", sectorLbl],
    ["Faturamento Anual", revLbl],
    ["Porte (colaboradores)", empLbl],
    ["Tipo de Operacao", opsMap[data.operations] || data.operations || "-"],
    ["Abrangencia Geografica", geoMap[data.geographicScope || ""] || "-"],
    ["Localidade", [data.municipio, data.estado].filter(Boolean).join(" - ") || "-"],
    ["CNAE", data.cnaeCode || "-"],
  ];
  if (data.contactName) rows.push(["Responsavel", data.contactName + (data.contactRole ? ` (${data.contactRole})` : "")]);
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
  y = startInternalPage("Diagnostico de Prontidao");
  y = sectionTitle("Diagnostico de Prontidao", y);

  // Score hero (left: big number, right: level badge)
  const heroH = 34;
  roundedBorder(M, y, CW, heroH, 3, WHITE, LINE, 0.3);

  // Score number
  setF("normal", 8);
  setC(MUTED);
  doc.text("SCORE GERAL DE PRONTIDAO", M + 6, y + 8);
  setF("bold", 34);
  setC(NAVY);
  doc.text(`${Math.round(diagnosis.overallScore)}`, M + 6, y + 26);
  setF("normal", 10);
  setC(MUTED);
  const scoreWidth = doc.getTextWidth(`${Math.round(diagnosis.overallScore)}`);
  doc.text("/100", M + 6 + scoreWidth + 2, y + 26);

  // Score bar
  const barX = M + 70;
  const barY = y + 17;
  const barW = CW - 80;
  fillR(barX, barY, barW, 6, [241, 245, 249]);
  const fillPct = Math.max(0.02, Math.min(1, diagnosis.overallScore / 100));
  fillR(barX, barY, barW * fillPct, 6, levelRgb);

  setF("normal", 7);
  setC(MUTED);
  doc.text("0", barX, barY + 11);
  doc.text("100", barX + barW, barY + 11, { align: "right" });

  // Level chip (top right of hero)
  const chipW = 44;
  const chipH = 16;
  roundedFill(M + CW - chipW - 6, y + 6, chipW, chipH, 2, levelRgb);
  setF("bold", 11);
  setC(WHITE);
  doc.text(levelTxt, M + CW - chipW / 2 - 6, y + 16, { align: "center" });

  y += heroH + 8;

  // Conclusion paragraph
  const { text: conclusionRaw } = generateConclusionText(data.companyName, diagnosis);
  const conclusionLines: string[] = doc.splitTextToSize(sanitizeText(conclusionRaw), CW);
  y = checkPageBreak(y, conclusionLines.length * 4 + 8, "Diagnostico de Prontidao");
  setF("normal", 9);
  setC(INK);
  doc.text(conclusionLines, M, y);
  y += conclusionLines.length * 4.5 + 6;

  // Axes
  y = checkPageBreak(y, 28, "Diagnostico de Prontidao");
  setF("bold", 10);
  setC(NAVY);
  doc.text("Avaliacao por Eixo de Prontidao", M, y);
  y += 6;
  setF("normal", 8);
  setC(MUTED);
  doc.text("Cada eixo e avaliado de 0 a 100. Quanto maior o score, maior a prontidao para a reforma.", M, y);
  y += 7;

  diagnosis.axes.forEach((ax) => {
    y = checkPageBreak(y, 16, "Diagnostico de Prontidao");

    const weight = getAxisWeight(ax.name);
    const axLabel = sanitizeText(ax.name);
    const legend = axisLegend(ax.score);
    const axCfg = getRiskLabelConfig(100 - ax.score);
    const legendC: RGB = axCfg.rgb;

    // Label row
    setF("bold", 9);
    setC(NAVY);
    doc.text(axLabel, M, y);
    if (weight) {
      setF("normal", 8);
      setC(MUTED);
      doc.text(`peso ${weight}`, M + doc.getTextWidth(axLabel) + 3, y);
    }

    // Score on right
    setF("bold", 9);
    setC(NAVY);
    doc.text(`${ax.score}`, M + CW - 22, y, { align: "right" });
    setF("normal", 7);
    setC(MUTED);
    doc.text("/100", M + CW, y, { align: "right" });

    // Bar
    const axBarY = y + 2.5;
    const axBarW = CW - 2;
    fillR(M, axBarY, axBarW, 4, [241, 245, 249]);
    fillR(M, axBarY, axBarW * Math.max(0.02, ax.score / 100), 4, legendC);

    // Legend
    setF("bold", 7);
    setC(legendC);
    doc.text(legend.toUpperCase(), M, y + 12);

    y += 16;
  });

  // Opportunity callout
  if (diagnosis.topOpportunity) {
    const oppLines: string[] = doc.splitTextToSize(sanitizeText(diagnosis.topOpportunity), CW - 16);
    const oppH = 14 + oppLines.length * 5;
    y = checkPageBreak(y, oppH + 4, "Diagnostico de Prontidao");

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
  y = startInternalPage("Plano de Acao Prioritario");
  y = sectionTitle("Plano de Acao Prioritario", y);

  setF("normal", 9);
  setC(MUTED);
  const introLines: string[] = doc.splitTextToSize(
    "A seguir, o plano estruturado em 3 fases, priorizado pelo grau de urgencia e impacto nos eixos criticos identificados no diagnostico.",
    CW,
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
    { num: 1, label: "FASE 1 - ACOES IMEDIATAS", prazo: "7 a 15 dias", color: RED },
    { num: 2, label: "FASE 2 - ESTRUTURACAO", prazo: "30 a 60 dias", color: ORANGE },
    { num: 3, label: "FASE 3 - CONSOLIDACAO", prazo: "60 a 120 dias", color: NAVY },
  ];

  phases.forEach((ph) => {
    const phActions = plan.filter((a) => a.phase === ph.num);
    if (phActions.length === 0) return;

    y = checkPageBreak(y, 22, "Plano de Acao Prioritario");

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
      const prazoSafe = sanitizeText(`Prazo: ${action.prazo}  |  Responsavel: ${action.responsavel}`);

      const titleLines: string[] = doc.splitTextToSize(`${idx + 1}. ${titleSafe}`, CW - 16);
      const descLines: string[] = doc.splitTextToSize(descSafe, CW - 16);
      const motivoLines: string[] = doc.splitTextToSize(motivoSafe, CW - 16);

      const contentH =
        6 +
        titleLines.length * 5 +
        3 +
        descLines.length * 4.5 +
        (motivoLines.length > 0 ? 4 + 4 + motivoLines.length * 4.5 : 0) +
        6 +
        5;

      y = checkPageBreak(y, contentH + 6, "Plano de Acao Prioritario");

      // Card with left stripe
      roundedBorder(M, y, CW, contentH, 2, WHITE, LINE, 0.3);
      fillR(M, y, 2.5, contentH, ph.color);

      // Checkbox
      doc.setDrawColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.setLineWidth(0.3);
      doc.rect(M + 6, y + 4, 3.5, 3.5);

      // Title
      setF("bold", 10);
      setC(NAVY);
      doc.text(titleLines, M + 12, y + 7);
      let cy = y + 7 + (titleLines.length - 1) * 5 + 4;

      // Description
      setF("normal", 8.5);
      setC(INK);
      doc.text(descLines, M + 12, cy);
      cy += descLines.length * 4.5 + 2;

      // Motivo
      if (motivoSafe) {
        setF("bold", 7.5);
        setC(ph.color);
        doc.text("POR QUE", M + 12, cy + 2);
        cy += 5;
        setF("normal", 8);
        setC(SLATE);
        doc.text(motivoLines, M + 12, cy);
        cy += motivoLines.length * 4.5;
      }

      // Prazo tag at bottom
      setF("normal", 7.5);
      setC(MUTED);
      doc.text(prazoSafe, M + 12, y + contentH - 3);

      y += contentH + 5;
    });

    y += 3;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // FINAL — DISCLAIMER
  // ──────────────────────────────────────────────────────────────────────────
  y = startInternalPage("Aviso Legal");
  y = sectionTitle("Aviso Legal e Informacoes Regulatorias", y);

  const disclaimers: string[] = [
    "Este diagnostico tem carater estritamente informativo e foi gerado com base nas informacoes fornecidas pela empresa e nas normas EC 132/2023, LC 214/2025 e LC 227/2026. Nao substitui consultoria tributaria, juridica ou contabil especializada.",
    "As aliquotas definitivas de IBS e CBS serao definidas pelo Comite Gestor do IBS e dependem de regulamentacao complementar. Os percentuais utilizados sao estimativas comparativas - consulte seu contador para confirmar os valores aplicaveis a sua operacao.",
    "O periodo de transicao previsto e de 2026 a 2033, com convivencia simultanea de tributos antigos e novos conforme calendario da LC 214/2025.",
    "As prioridades e prazos recomendados neste plano refletem boas praticas aplicadas a empresas de perfil similar. Cada organizacao deve validar o cronograma com seu time fiscal e juridico antes de implementar as acoes.",
  ];

  disclaimers.forEach((d, idx) => {
    const lines: string[] = doc.splitTextToSize(sanitizeText(d), CW - 12);
    const blockH = lines.length * 4.5 + 10;
    y = checkPageBreak(y, blockH + 4, "Aviso Legal");

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
  y = checkPageBreak(y, 40, "Aviso Legal");
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
  doc.text("NIVEL DE PRONTIDAO", M + CW - 6, y + 20, { align: "right" });
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
