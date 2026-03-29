import jsPDF from "jspdf";
import {
  getRiskLabelConfig,
  getRiskLabelConfigByLevel,
  generateConclusionText,
  SECTOR_LABELS,
  REGIME_LABELS,
  EMPLOYEE_LABELS,
  REVENUE_LABELS,
  type DiagnosisResult,
  type PlanAction,
} from "@/lib/riskConfig";

// ─── Interfaces PDF-específicas ───────────────────────────────────────────────
// DiagnosisResult, PlanAction importados de riskConfig acima.
// CompanyData é local ao PDF pois contém campos de sessão não tipados no shared.

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

// SECTOR_LABELS, REGIME_LABELS, EMPLOYEE_LABELS, REVENUE_LABELS importados de riskConfig

// ─── Sanitize ─────────────────────────────────────────────────────────────────
function sanitizeText(str: string): string {
  if (!str) return "";
  return str
    .replace(/\u2192/g, "->")   // → arrow
    .replace(/\u21d2/g, "->")   // ⇒ double arrow
    .replace(/\u2014/g, "-")    // em dash
    .replace(/\u2013/g, "-")    // en dash
    .replace(/\u2018|\u2019/g, "'")  // curly single quotes
    .replace(/\u201c|\u201d/g, '"')  // curly double quotes
    .replace(/\u00f7/g, "/")    // ÷
    .replace(/[\u2713\u2714\u2611\u2610\u2705\u2611]/g, "")  // checkmarks/checkboxes
    .replace(/\u00de/g, "")     // þ / Þ
    .replace(/\u2726|\u2728|\u2605/g, "")  // decorative stars
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")  // emoji (surrogate range)
    .split("").map(c => {
      const code = c.charCodeAt(0);
      if (code > 255) return "";
      return c;
    }).join("");
}

// ─── Color helpers ────────────────────────────────────────────────────────────
const NAVY: [number, number, number] = [15, 30, 53];
const ORANGE: [number, number, number] = [249, 115, 22];
const GREEN: [number, number, number] = [22, 163, 74];
const RED: [number, number, number] = [220, 38, 38];
const AMBER: [number, number, number] = [217, 119, 6];
const WHITE: [number, number, number] = [255, 255, 255];
const GRAY_DARK: [number, number, number] = [51, 51, 51];
const GRAY_MID: [number, number, number] = [100, 100, 100];
const GRAY_LIGHT: [number, number, number] = [220, 220, 220];
const CARD_BG: [number, number, number] = [248, 248, 248];

// ─── Risk helpers (derivados de riskConfig) ───────────────────────────────────
function getRiskLevel(score: number): string {
  return getRiskLabelConfig(score).label;
}

function getRiskSolidColor(score: number): [number, number, number] {
  const level = getRiskLevel(score);
  return getLevelSolidColor(level);
}

function getLevelSolidColor(level: string): [number, number, number] {
  const upper = level.toUpperCase();
  if (upper === "CRÍTICO" || upper === "CRITICO") return RED;
  if (upper === "ALTO") return ORANGE;
  if (upper === "MODERADO") return AMBER;
  return GREEN;
}

function getLevelLabel(level: string): string {
  return getRiskLabelConfigByLevel(level).label;
}

// Badge colors: light bg + colored border/text
function getRiskBadgeColors(level: string): { bg: [number,number,number]; fg: [number,number,number] } {
  const upper = level.toUpperCase();
  if (upper === "CRÍTICO" || upper === "CRITICO") return { bg: [255,235,235], fg: RED };
  if (upper === "ALTO")                            return { bg: [255,243,232], fg: ORANGE };
  if (upper === "MODERADO")                        return { bg: [255,248,230], fg: AMBER };
  return { bg: [230,255,237], fg: GREEN };
}

function getScoreBadgeColors(score: number): { bg: [number,number,number]; fg: [number,number,number] } {
  return getRiskBadgeColors(getRiskLevel(score));
}

// ─── Conclusion text (usa generateConclusionText de riskConfig + sanitizeText) ─
function getConclusionText(companyName: string, diagnosis: DiagnosisResult): string {
  const { text } = generateConclusionText(companyName, diagnosis);
  return sanitizeText(text);
}

// Clean motivo: remove generic boilerplate sentences
function cleanMotivo(text: string): string {
  const boilerplates = [
    "A fase de coexist",
    "Com a fase de coexist",
  ];
  const sentences = text.split(/\.\s+/);
  const filtered = sentences.filter(s => !boilerplates.some(bp => s.startsWith(bp)));
  const result = filtered.join(". ").trim();
  return result || text.trim();
}

// ─── Main PDF export ───────────────────────────────────────────────────────────
export function generateActionPlanPdf(data: CompanyData, diagnosis: DiagnosisResult, plan: PlanAction[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW = doc.internal.pageSize.getWidth();   // 210
  const PH = doc.internal.pageSize.getHeight();  // 297
  const M = 20;
  const CW = PW - M * 2;  // 170
  const FOOTER_Y = 274;
  const SAFE_BOTTOM = FOOTER_Y - 4;
  let y = 0;

  const overallScore = diagnosis.overallScore;
  const riskLevel = getRiskLevel(overallScore);
  const riskSolid = getRiskSolidColor(overallScore);
  const todayStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  // ── Low-level helpers ─────────────────────────────────────────────────────

  function setF(style: "bold" | "normal", size: number) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  }

  function setC(rgb: [number, number, number]) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }

  function fillR(x: number, yy: number, w: number, h: number, rgb: [number, number, number]) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(x, yy, w, h, "F");
  }

  function strokeR(x: number, yy: number, w: number, h: number, strokeRgb: [number, number, number], lw = 0.5) {
    doc.setDrawColor(strokeRgb[0], strokeRgb[1], strokeRgb[2]);
    doc.setLineWidth(lw);
    doc.rect(x, yy, w, h);
  }

  function fillAndStrokeR(x: number, yy: number, w: number, h: number, fillRgb: [number, number, number], strokeRgb: [number, number, number], lw = 0.5) {
    doc.setFillColor(fillRgb[0], fillRgb[1], fillRgb[2]);
    doc.setDrawColor(strokeRgb[0], strokeRgb[1], strokeRgb[2]);
    doc.setLineWidth(lw);
    doc.rect(x, yy, w, h, "FD");
  }

  function drawCheckbox(x: number, yy: number, size: number, urgent = false) {
    const borderC: [number, number, number] = urgent ? RED : [80, 80, 80];
    fillAndStrokeR(x, yy, size, size, WHITE, borderC, 0.5);
  }

  function hLine(yy: number, rgb: [number, number, number] = GRAY_LIGHT, lw = 0.3) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    doc.setLineWidth(lw);
    doc.line(M, yy, M + CW, yy);
  }

  // inline badge (light bg + border + text)
  function drawBadge(label: string, x: number, yy: number, w: number, h: number, badge: { bg: [number,number,number]; fg: [number,number,number] }) {
    fillAndStrokeR(x, yy, w, h, badge.bg, badge.fg, 0.5);
    setF("bold", 7);
    setC(badge.fg);
    doc.text(label, x + w / 2, yy + h * 0.68, { align: "center" });
  }

  // solid badge (colored background + white text)
  function drawSolidBadge(label: string, x: number, yy: number, w: number, h: number, rgb: [number, number, number]) {
    fillR(x, yy, w, h, rgb);
    setF("bold", 7);
    setC(WHITE);
    doc.text(label, x + w / 2, yy + h * 0.68, { align: "center" });
  }

  // check page break — adds new page with white background, resets y
  function chk(needed: number) {
    if (y + needed > SAFE_BOTTOM) {
      doc.addPage();
      fillR(0, 0, PW, PH, WHITE);
      y = M;
    }
  }

  // page footer (called in loop at end)
  function applyFooter(pageNum: number, totalPages: number) {
    hLine(FOOTER_Y, GRAY_LIGHT, 0.3);
    setF("normal", 7);
    setC([150, 150, 150]);
    doc.text("REFORMA EM ACAO  -  Diagnostico de Risco Tributario", M, FOOTER_Y + 4);
    doc.text(`Pagina ${pageNum} de ${totalPages}`, PW - M, FOOTER_Y + 4, { align: "right" });
  }

  // section header: full-width colored strip
  function addSectionHeader(title: string, rgb: [number, number, number]) {
    chk(14);
    fillR(0, y, PW, 10, rgb);
    setF("bold", 10);
    setC(WHITE);
    doc.text(sanitizeText(title).toUpperCase(), M + 5, y + 7);
    y += 14;
  }

  // text block with word wrap — returns new y
  function textBlock(text: string, x: number, maxW: number, size: number, style: "bold" | "normal", rgb: [number, number, number]): number {
    const safe = sanitizeText(text);
    setF(style, size);
    setC(rgb);
    const lh = size * 0.42;
    const lines: string[] = doc.splitTextToSize(safe, maxW);
    doc.text(lines, x, y);
    return lines.length * lh;
  }

  // ─── PAGE 1 — CAPA ─────────────────────────────────────────────────────────
  fillR(0, 0, PW, PH, NAVY);

  // Top orange stripe 4mm
  fillR(0, 0, PW, 4, ORANGE);

  // Logo: "REFORMA " white + "EM ACAO" orange, Helvetica bold 32pt
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  const reformaStr = "REFORMA ";
  const emAcaoStr = "EM ACAO";
  const fullLogoStr = reformaStr + emAcaoStr;
  const fullLogoW = doc.getTextWidth(fullLogoStr);
  const logoStartX = (PW - fullLogoW) / 2;
  const reformaW = doc.getTextWidth(reformaStr);
  const logoY = 46;

  doc.setTextColor(...WHITE);
  doc.text(reformaStr, logoStartX, logoY);
  doc.setTextColor(...ORANGE);
  doc.text(emAcaoStr, logoStartX + reformaW, logoY);

  // Tagline
  setF("normal", 10);
  setC([180, 180, 180]);
  doc.text("Plataforma de Diagnostico para a Reforma Tributaria Brasileira", PW / 2, logoY + 10, { align: "center" });

  // Orange divider 60mm
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(1);
  const divX = (PW - 60) / 2;
  doc.line(divX, 68, divX + 60, 68);

  // Main title
  setF("bold", 18);
  setC(WHITE);
  doc.text("DIAGNOSTICO DE RISCO TRIBUTARIO", PW / 2, 82, { align: "center" });
  setF("normal", 9);
  setC([180, 180, 180]);
  doc.text("Analise personalizada de exposicao a Reforma Tributaria", PW / 2, 90, { align: "center" });
  doc.text("(EC 132/2023 - LC 214/2025 - LC 227/2026)", PW / 2, 96, { align: "center" });

  // Company card: 150mm x 32mm centered, dark navy fill, orange border
  const cardW = 150;
  const cardX = (PW - cardW) / 2;
  const cardY = 108;
  doc.setFillColor(25, 45, 75);
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(1);
  doc.rect(cardX, cardY, cardW, 34, "FD");

  // Company name
  setF("bold", 12);
  setC(WHITE);
  const cnSafe = sanitizeText(data.companyName).toUpperCase();
  const cnLines: string[] = doc.splitTextToSize(cnSafe, cardW - 10);
  doc.text(cnLines, PW / 2, cardY + 9, { align: "center" });
  let cardTxtY = cardY + 9 + cnLines.length * 6;

  setF("normal", 9);
  setC([180, 180, 180]);
  if (data.nomeFantasia) {
    const nf = `"${sanitizeText(data.nomeFantasia)}"`;
    doc.text(nf, PW / 2, cardTxtY, { align: "center" });
    cardTxtY += 5.5;
  }
  if (data.cnpj) {
    doc.text(`CNPJ: ${sanitizeText(data.cnpj)}`, PW / 2, cardTxtY, { align: "center" });
    cardTxtY += 5;
  }
  if (data.municipio || data.estado) {
    const loc = [data.municipio, data.estado].filter(Boolean).map(s => sanitizeText(s!)).join(" - ");
    doc.text(loc, PW / 2, cardTxtY, { align: "center" });
  }

  // Risk badge: 90mm x 22mm centered, solid level color
  const badgeW = 90;
  const badgeH = 22;
  const badgeX = (PW - badgeW) / 2;
  const badgeY = 155;
  fillR(badgeX, badgeY, badgeW, badgeH, riskSolid);
  setF("bold", 20);
  setC(WHITE);
  doc.text(riskLevel, PW / 2, badgeY + 11, { align: "center" });
  setF("normal", 10);
  doc.text(`Indice de Exposicao: ${overallScore} pontos`, PW / 2, badgeY + 19, { align: "center" });

  // Score bar: 160mm x 4mm at x=25, y=192
  const barBaseX = 25;
  const barW = 160;
  const barY = 192;
  fillR(barBaseX, barY, barW, 4, [80, 80, 80]);
  const barFill = Math.max(4, Math.round((overallScore / 100) * barW));
  fillR(barBaseX, barY, barFill, 4, riskSolid);
  setF("normal", 8);
  setC([180, 180, 180]);
  doc.text("0", barBaseX, barY + 8.5);
  doc.text("100", barBaseX + barW, barY + 8.5, { align: "right" });

  // Responsible
  if (data.contactName) {
    setF("normal", 9);
    setC([180, 180, 180]);
    const resp = sanitizeText(`Responsavel: ${data.contactName}${data.contactRole ? ` - ${data.contactRole}` : ""}`);
    doc.text(resp, PW / 2, barY + 15, { align: "center" });
  }

  // Cover footer at y=278
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(M, 274, PW - M, 274);
  setF("normal", 8);
  setC([180, 180, 180]);
  doc.text(`Gerado em ${sanitizeText(todayStr)}`, M, 278);
  doc.text("EC 132/2023 - LC 214/2025 - LC 227/2026", PW / 2, 278, { align: "center" });
  doc.text("Transicao: 2026-2033", PW - M, 278, { align: "right" });

  // ─── PAGE 2 — RESUMO EXECUTIVO ──────────────────────────────────────────────
  doc.addPage();
  fillR(0, 0, PW, PH, WHITE);
  y = M;

  addSectionHeader("Resumo Executivo", NAVY);

  // Company data card 2 columns
  const cardBH = 42;
  fillAndStrokeR(M, y, CW, cardBH, CARD_BG, GRAY_LIGHT, 0.5);
  setF("bold", 8);
  setC(NAVY);
  doc.text("DADOS DA EMPRESA", M + 4, y + 6);

  // separator
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(M + 4, y + 8, M + CW - 4, y + 8);

  const half = (CW - 8) / 2;
  const col1x = M + 4;
  const col2x = M + 4 + half + 4;
  let c1y = y + 13;
  let c2y = y + 13;
  const lh8 = 4.5;

  const companyRows: [string, string][] = [
    ["Empresa", sanitizeText(data.companyName + (data.nomeFantasia ? ` (${data.nomeFantasia})` : ""))],
    ["CNPJ", sanitizeText(data.cnpj || "-")],
    ["Setor", sanitizeText(SECTOR_LABELS[data.sector] || data.sector)],
    ["Regime", sanitizeText(REGIME_LABELS[data.regime] || data.regime)],
    ["Porte", sanitizeText(EMPLOYEE_LABELS[data.employeeCount] || data.employeeCount)],
    ["Localizacao", sanitizeText([data.municipio, data.estado].filter(Boolean).join(" - ") || "-")],
    ["Nivel de risco", `${riskLevel} - Score ${overallScore}/100`],
  ];

  companyRows.forEach(([label, value], idx) => {
    const isLeft = idx % 2 === 0;
    const cx = isLeft ? col1x : col2x;
    const cy = isLeft ? c1y : c2y;
    const colW = half - 2;

    setF("bold", 7.5);
    setC(NAVY);
    doc.text(label + ":", cx, cy);

    const lw = doc.getTextWidth(label + ": ");
    setF("normal", 7.5);
    setC(idx === 6 ? riskSolid : GRAY_DARK);
    const vLines: string[] = doc.splitTextToSize(value, colW - lw);
    doc.text(vLines, cx + lw, cy);
    const rowH = vLines.length * lh8 + 1.5;

    if (isLeft) c1y += rowH;
    else c2y += rowH;
  });

  y += cardBH + 6;

  // Analise e Conclusao
  chk(40);
  setF("bold", 10);
  setC(NAVY);
  doc.text("Analise e Conclusao", M, y);
  y += 6;

  const conclusionText = getConclusionText(data.companyName, diagnosis);
  setF("normal", 9);
  setC(GRAY_DARK);
  const conclLines: string[] = doc.splitTextToSize(sanitizeText(conclusionText), CW);
  chk(conclLines.length * 4.7 + 4);
  doc.text(conclLines, M, y);
  y += conclLines.length * 4.7 + 6;

  // Exposicao por Eixo
  chk(14);
  setF("bold", 10);
  setC(NAVY);
  doc.text("Exposicao por Eixo de Avaliacao", M, y);
  y += 7;

  const labelColW = 50;
  const barColX = M + labelColW + 4;
  const barColW2 = 90;
  const scoreX = barColX + barColW2 + 3;
  const badgeX2 = scoreX + 14;

  diagnosis.axes.forEach(ax => {
    chk(10);
    const axScore = ax.score;
    const axSolid = getRiskSolidColor(axScore);
    const axLevel = getRiskLevel(axScore);
    const axBadge = getScoreBadgeColors(axScore);
    const rowH2 = 8;

    // Label
    setF("bold", 8.5);
    setC(GRAY_DARK);
    const axNameSafe = sanitizeText(ax.name);
    const axNameLines: string[] = doc.splitTextToSize(axNameSafe, labelColW);
    doc.text(axNameLines, M, y + 5.5);

    // Bar track
    fillR(barColX, y + 2, barColW2, 5, GRAY_LIGHT);
    // Bar fill
    const bFill = Math.max(2, Math.round((axScore / 100) * barColW2));
    fillR(barColX, y + 2, bFill, 5, axSolid);

    // Score
    setF("bold", 9);
    setC(GRAY_DARK);
    doc.text(`${axScore}/100`, scoreX + 10, y + 6, { align: "right" });

    // Badge
    drawBadge(axLevel, badgeX2, y + 1.5, 22, 5.5, axBadge);

    y += rowH2 + 3;
  });

  y += 4;

  // Opportunity card
  if (diagnosis.topOpportunity) {
    const oppSafe = sanitizeText(diagnosis.topOpportunity);
    const oppLines: string[] = doc.splitTextToSize(oppSafe, CW - 10);
    const oppH = 8 + oppLines.length * 4.5 + 4;
    chk(oppH + 4);
    fillAndStrokeR(M, y, CW, oppH, [230, 255, 237], GREEN, 1);
    setF("bold", 9);
    setC(GREEN);
    doc.text(">> Maior Oportunidade", M + 4, y + 6);
    setF("normal", 9);
    setC(GRAY_DARK);
    doc.text(oppLines, M + 4, y + 12);
    y += oppH + 6;
  }

  // ─── PAGE — RISCOS IDENTIFICADOS ─────────────────────────────────────────────
  doc.addPage();
  fillR(0, 0, PW, PH, WHITE);
  y = M;

  addSectionHeader("Riscos Identificados", RED);

  // Summary 3 boxes
  const critCount = diagnosis.allItems.filter(i => i.level === "critico").length;
  const altoCount = diagnosis.allItems.filter(i => i.level === "alto").length;
  const modCount  = diagnosis.allItems.filter(i => i.level === "moderado").length;

  const colW3 = CW / 3;
  const summH = 16;

  [["CRITICO", critCount, RED, { bg: [255,235,235] as [number,number,number], fg: RED }],
   ["ALTO",    altoCount, ORANGE, { bg: [255,243,232] as [number,number,number], fg: ORANGE }],
   ["MODERADO",modCount,  AMBER,  { bg: [255,248,230] as [number,number,number], fg: AMBER }]].forEach(([label, count, _color, badge], idx) => {
    const bx = M + idx * colW3;
    const bdata = badge as { bg: [number,number,number]; fg: [number,number,number] };
    fillAndStrokeR(bx, y, colW3 - 1, summH, bdata.bg, bdata.fg, 0.5);
    setF("bold", 18);
    setC(bdata.fg);
    doc.text(String(count), bx + (colW3 - 1) / 2, y + 9.5, { align: "center" });
    setF("normal", 8);
    doc.text(String(label), bx + (colW3 - 1) / 2, y + 14.5, { align: "center" });
  });
  y += summH + 8;

  // Items grouped by axis
  diagnosis.axes.forEach(ax => {
    if (ax.items.length === 0) return;
    chk(12);

    // Axis header
    const axSolid = getRiskSolidColor(ax.score);
    fillR(M, y, CW, 7, axSolid);
    setF("bold", 8.5);
    setC(WHITE);
    doc.text(sanitizeText(ax.name).toUpperCase(), M + 4, y + 5);
    setF("normal", 8);
    doc.text(`Score: ${ax.score}/100`, M + CW - 4, y + 5, { align: "right" });
    y += 9;

    ax.items.forEach(item => {
      const itemSolid = getLevelSolidColor(item.level);
      const itemLabel = getLevelLabel(item.level);
      const itemBadge = getRiskBadgeColors(item.level);

      const titleSafe = sanitizeText(item.title);
      const descSafe = sanitizeText(item.desc);
      const actionSafe = sanitizeText("-> " + item.action);

      const descLines: string[] = doc.splitTextToSize(descSafe, CW - 18);
      const actionLines: string[] = doc.splitTextToSize(actionSafe, CW - 18);
      const cardH = 12 + descLines.length * 4.2 + 2 + actionLines.length * 4.2 + 4;

      chk(cardH + 4);

      // Card: white fill, gray border, left stripe
      fillAndStrokeR(M, y, CW, cardH, CARD_BG, GRAY_LIGHT, 0.3);
      fillR(M, y, 3, cardH, itemSolid);

      // Badge
      drawBadge(itemLabel, M + 5, y + 3, 20, 5.5, itemBadge);

      // Title
      setF("bold", 9);
      setC(NAVY);
      const titleLines: string[] = doc.splitTextToSize(titleSafe, CW - 32);
      doc.text(titleLines, M + 28, y + 7);

      // Desc
      setF("normal", 8);
      setC(GRAY_DARK);
      let iy = y + 13;
      doc.text(descLines, M + 7, iy);
      iy += descLines.length * 4.2 + 2;

      // Action
      setF("normal", 8);
      setC(ORANGE);
      doc.text(actionLines, M + 7, iy);

      y += cardH + 4;
    });

    y += 3;
  });

  // ─── PAGE — PLANO DE ACAO ─────────────────────────────────────────────────────
  doc.addPage();
  fillR(0, 0, PW, PH, WHITE);
  y = M;

  addSectionHeader("Plano de Acao Recomendado", GREEN);

  interface PhaseInfo { num: 1|2|3; label: string; prazoDesc: string; color: [number,number,number] }
  const phases: PhaseInfo[] = [
    { num: 1, label: "FASE 1 - ACAO IMEDIATA",  prazoDesc: "7 a 15 dias - resolva os riscos criticos e estabeleca a base da transicao", color: RED },
    { num: 2, label: "FASE 2 - ESTRUTURACAO",   prazoDesc: "30 a 60 dias - organize processos, dados fiscais e fornecedores",           color: ORANGE },
    { num: 3, label: "FASE 3 - CONSOLIDACAO",   prazoDesc: "60 a 120 dias - estruture, teste sistemas e valide com o contador",         color: NAVY },
  ];

  const priorityBadge: Record<string, { bg: [number,number,number]; fg: [number,number,number] }> = {
    urgente: { bg: [255,235,235], fg: RED },
    alta:    { bg: [255,243,232], fg: ORANGE },
    media:   { bg: [248,248,248], fg: GRAY_MID },
    baixa:   { bg: [230,255,237], fg: GREEN },
  };
  const priorityLabel: Record<string, string> = {
    urgente: "URGENTE", alta: "ALTA", media: "MEDIA", baixa: "BAIXA",
  };

  phases.forEach(ph => {
    const phActions = plan.filter(a => a.phase === ph.num);
    if (phActions.length === 0) return;

    chk(18);

    // Phase header
    fillR(M, y, CW, 10, ph.color);
    setF("bold", 11);
    setC(WHITE);
    doc.text(ph.label, M + 4, y + 7);
    y += 11;
    setF("normal", 8.5);
    setC(WHITE);
    // Draw prazo on same-colored background — need one more px height
    // Actually draw it on a slightly lighter band
    fillR(M, y, CW, 6, ph.color);
    doc.text(ph.prazoDesc, M + 4, y + 4.5);
    y += 8;

    phActions.forEach((action, idx) => {
      const titleSafe = sanitizeText(action.title);
      const descSafe  = sanitizeText(action.desc || "");
      const motivoSafe = sanitizeText(cleanMotivo(action.motivo || ""));
      const prazoSafe  = sanitizeText(`Prazo: ${action.prazo}  |  Responsavel: ${action.responsavel}`);
      const eixoSafe   = sanitizeText(action.eixo || "");

      const descLines: string[]   = doc.splitTextToSize(descSafe, CW - 22);
      const motivoLines: string[] = doc.splitTextToSize(`Por que: ${motivoSafe}`, CW - 22);
      const cardH = 8 + descLines.length * 4.5 + motivoLines.length * 4.5 + 9;

      chk(cardH + 5);

      // Card
      fillAndStrokeR(M, y, CW, cardH, WHITE, GRAY_LIGHT, 0.5);
      fillR(M, y, 3, cardH, ph.color);

      // Checkbox
      drawCheckbox(M + 5, y + 4, 6, false);

      // Number + title
      setF("bold", 9.5);
      setC(NAVY);
      const titleLines: string[] = doc.splitTextToSize(`${idx + 1}. ${titleSafe}`, CW - 55);
      doc.text(titleLines, M + 14, y + 8);

      // Priority badge (right-aligned)
      const pBadge = priorityBadge[action.priority] || priorityBadge.media;
      const pLabel = priorityLabel[action.priority] || sanitizeText(action.priority);
      drawBadge(pLabel, PW - M - 30, y + 3, 28, 5.5, pBadge);

      // Eixo label
      setF("normal", 7);
      setC(GRAY_MID);
      const eixoLines: string[] = doc.splitTextToSize(eixoSafe, 55);
      doc.text(eixoLines, PW - M - 31, y + 11, { align: "right" });

      let cy = y + 11;

      // Description
      setF("normal", 8.5);
      setC(GRAY_DARK);
      doc.text(descLines, M + 14, cy);
      cy += descLines.length * 4.5 + 2;

      // Motivo
      setF("bold", 8);
      setC(NAVY);
      doc.text("Por que:", M + 14, cy);
      cy += 4.5;
      setF("normal", 8);
      setC(GRAY_MID);
      doc.text(motivoLines.slice(1).length ? motivoLines.slice(1) : motivoLines, M + 14, cy);
      cy += (motivoLines.length > 1 ? motivoLines.length - 1 : motivoLines.length) * 4.5 + 2;

      // Prazo / responsavel
      setF("bold", 8);
      setC(GRAY_MID);
      doc.text(prazoSafe, M + 14, cy);

      y += cardH + 5;
    });

    y += 4;
  });

  // ─── PAGE — CHECKLIST DE PRONTIDAO ──────────────────────────────────────────
  chk(80);

  addSectionHeader("Checklist de Prontidao Operacional", NAVY);

  setF("normal", 9);
  setC(GRAY_MID);
  doc.text("Marque cada item conforme for concluindo a preparacao da sua empresa.", PW / 2, y, { align: "center" });
  y += 8;

  const checklist: string[] = [
    "Fornecedor do ERP confirmou plano de atualizacao para IBS/CBS com cronograma por escrito",
    "Cadastro dos 30 principais produtos/servicos padronizado com NCM/NBS correto",
    "Fornecedores classificados em A (regime regular) / B (credito limitado) / C (documentacao inadequada)",
    "Contratos de longo prazo revisados por advogado com clausula de revisao tributaria",
    "Equipes fiscal, comercial e financeira treinadas sobre a reforma tributaria",
    "Nova tabela de precos calculada com IBS/CBS incorporado",
    "Impacto do Split Payment simulado e capital de giro ajustado",
    "NF-e com campos de IBS/CBS testada em ambiente de homologacao da SEFAZ",
    "Diretoria engajada com cronograma e orcamento aprovados para a adaptacao",
    "Reuniao de validacao final com contador realizada antes de 2027",
  ];

  const urgentFlags: boolean[] = [
    data.erpSystem === "nenhum" || data.erpSystem === "planilha",
    data.catalogStandardized === "nao",
    data.simplesSupplierPercent === "acima_60",
    data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao",
    data.hadInternalTraining === "nao",
    false,
    data.tightWorkingCapital === "sim" || data.splitPaymentAware === "nao",
    data.erpSystem === "nenhum",
    data.managementAwareOfReform === "nao",
    false,
  ];

  checklist.forEach((item, idx) => {
    const isUrgent = urgentFlags[idx] === true;
    const itemLines: string[] = doc.splitTextToSize(sanitizeText(item), CW - 20);
    const rowH = 7 + itemLines.length * 4.2;

    chk(rowH + 3);

    fillAndStrokeR(M, y, CW, rowH, isUrgent ? [255,245,245] : CARD_BG, isUrgent ? RED : GRAY_LIGHT, isUrgent ? 0.4 : 0.3);

    drawCheckbox(M + 4, y + (rowH - 7) / 2, 7, isUrgent);

    setF("normal", 8.5);
    setC(isUrgent ? RED : GRAY_DARK);
    doc.text(itemLines, M + 14, y + 5.5);

    if (isUrgent) {
      setF("bold", 7);
      setC(RED);
      doc.text("[PENDENTE]", M + CW - 2, y + 5.5, { align: "right" });
    }

    if ((idx + 1) % 3 === 0) {
      hLine(y + rowH + 1, GRAY_LIGHT, 0.2);
    }

    y += rowH + 3;
  });

  y += 10;

  // ─── PAGE — AVISO LEGAL ──────────────────────────────────────────────────────
  chk(60);

  hLine(y, NAVY, 0.5);
  y += 8;

  setF("bold", 11);
  setC(NAVY);
  doc.text("Aviso Legal e Informacoes Regulatorias", M, y);
  y += 8;

  const disclaimers: string[] = [
    "Este diagnostico tem carater estritamente informativo e foi gerado com base nas informacoes fornecidas pela empresa e nas normas EC 132/2023, LC 214/2025 e LC 227/2026. Nao substitui consultoria tributaria, juridica ou contabil especializada.",
    "As aliquotas definitivas de IBS e CBS serao definidas pelo Comite Gestor do IBS e dependem de regulamentacao complementar. Os percentuais utilizados neste documento sao estimativas comparativas - consulte seu contador para confirmar os valores aplicaveis a sua operacao.",
    "O periodo de transicao previsto e de 2026 a 2033, com convivencia simultanea de tributos antigos e novos conforme calendario da LC 214/2025.",
  ];

  disclaimers.forEach(d => {
    const dLines: string[] = doc.splitTextToSize(d, CW);
    chk(dLines.length * 4.5 + 6);
    setF("normal", 8);
    setC(GRAY_MID);
    doc.text(dLines, M, y);
    y += dLines.length * 4.5 + 5;
  });

  y += 4;
  hLine(y, GRAY_LIGHT, 0.3);
  y += 6;

  setF("normal", 8);
  setC(GRAY_MID);
  const todaySafe = sanitizeText(todayStr);
  doc.text(`Documento gerado em ${todaySafe} pela plataforma REFORMA EM ACAO`, PW / 2, y, { align: "center" });
  y += 5;
  doc.text("reforma-em-acao.com.br  -  Este diagnostico tem carater informativo. Consulte um especialista tributario.", PW / 2, y, { align: "center" });

  // ─── Apply footers to all pages except cover ─────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p);
    applyFooter(p - 1, totalPages - 1);
  }

  // Save
  const nameSafe = sanitizeText(data.companyName).replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
  const filename = `REFORMA-EM-ACAO_${nameSafe}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
