import jsPDF from "jspdf";

interface AxisScore {
  id: string;
  name: string;
  score: number;
  items: Array<{ level: string; title: string; desc: string; action: string }>;
}

interface DiagnosisResult {
  overallScore: number;
  axes: AxisScore[];
  allItems: Array<{ level: string; title: string; desc: string; action: string; axis: string }>;
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
  priority: string;
  eixo: string;
  source?: string;
  confianca?: string;
}

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

// ─── Label maps ─────────────────────────────────────────────────────────────
const SECTOR_LABELS: Record<string, string> = {
  industria: "Indústria",
  atacado: "Comércio Atacadista",
  varejo: "Comércio Varejista",
  servicos: "Outros / Não listado",
  agronegocio: "Agronegócio",
  outros: "Outros Setores",
};

const REGIME_LABELS: Record<string, string> = {
  simples: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
};

const OPERATIONS_LABELS: Record<string, string> = {
  b2b: "Empresas (B2B)",
  b2c: "Consumidor Final (B2C)",
  b2b_b2c: "Misto (B2B + B2C)",
};

const EMPLOYEE_LABELS: Record<string, string> = {
  "1_10": "1 a 10 pessoas",
  "11_50": "11 a 50 pessoas",
  "51_200": "51 a 200 pessoas",
  acima_200: "Acima de 200 pessoas",
};

const ERP_LABELS: Record<string, string> = {
  sap: "SAP / TOTVS / Oracle",
  medio_porte: "Bling / Omie / Tiny / Conta Azul",
  planilha: "Planilhas / Controle manual",
  nenhum: "Sem sistema de gestão",
  proprio: "Sistema próprio",
};

const SUPPLIER_LABELS: Record<string, string> = {
  ate_10: "Até 10 fornecedores",
  ate_20: "10 a 20 fornecedores",
  ate_50: "20 a 50 fornecedores",
  acima_50: "Acima de 50 fornecedores",
};

const SIMPLES_PCT_LABELS: Record<string, string> = {
  ate_30: "Menos de 30%",
  "30_60": "30% a 60%",
  acima_60: "Mais de 60%",
  nao_sei: "Não informado",
};

const TAX_LABELS: Record<string, string> = {
  contador_externo: "Escritório de contabilidade externo",
  contador_interno: "Contador/analista interno",
  dono: "Dono/sócio",
  ninguem: "Ninguém cuida especificamente",
};

const SPLIT_LABELS: Record<string, string> = {
  sim_entendo: "Sim, entende como funciona",
  ouvi_falar: "Já ouviu falar, mas não entende bem",
  nao: "Não conhece",
};

const MARGIN_LABELS: Record<string, string> = {
  ate_5: "Até 5%",
  "5_10": "5% a 10%",
  "10_20": "10% a 20%",
  acima_20: "Acima de 20%",
};

const REVENUE_LABELS: Record<string, string> = {
  ate_360k: "Até R$ 360 mil/ano",
  "360k_4_8m": "R$ 360 mil a R$ 4,8 mi/ano",
  "4_8m_78m": "R$ 4,8 mi a R$ 78 mi/ano",
  acima_78m: "Acima de R$ 78 mi/ano",
  ate_50k: "Até R$ 50 mil/mês",
  "50k_100k": "R$ 50 mil a R$ 100 mil/mês",
  "100k_500k": "R$ 100 mil a R$ 500 mil/mês",
  "500k_1m": "R$ 500 mil a R$ 1 milhão/mês",
  acima_1m: "Acima de R$ 1 milhão/mês",
};

const CONCERN_LABELS: Record<string, string> = {
  custos: "Aumento dos custos e da carga tributária",
  preco: "Impacto nos preços e na competitividade",
  sistemas: "Adequação dos sistemas e notas fiscais",
  caixa: "Impacto no fluxo de caixa (Split Payment)",
  fornecedores: "Adequação dos fornecedores",
  contratos: "Revisão de contratos",
  desconhecimento: "Não sei por onde começar",
};

const SPECIAL_REGIME_LABELS: Record<string, string> = {
  saude_servicos: "Serviços de Saúde (60% de redução)",
  saude_medicamentos: "Medicamentos (60% / alíquota zero lista CMED)",
  educacao: "Educação (60% de redução)",
  cesta_basica: "Alimentos da Cesta Básica (alíquota zero)",
  alimentos_reduzidos: "Outros Alimentos (60% de redução)",
  agro_insumos: "Insumos Agropecuários (60% de redução)",
  transporte_coletivo: "Transporte Coletivo (60% de redução)",
  profissional_liberal: "Profissional Liberal Regulamentado (30% de redução)",
  imobiliario: "Imóveis e Construção Civil (regime específico)",
  combustiveis: "Combustíveis (regime monofásico)",
  hotelaria_turismo: "Hotelaria e Turismo (60% de redução)",
  cooperativa: "Cooperativas (tratamento especial)",
  zfm: "Zona Franca de Manaus (benefícios mantidos)",
  higiene_limpeza: "Higiene e Limpeza Essenciais (60% de redução)",
  cultura: "Cultura e Arte (60% / livros alíquota zero)",
  seletivo_bebidas: "Bebidas Alcoólicas/Açucaradas — IS adicional",
  seletivo_tabaco: "Tabaco e Cigarro — IS adicional",
  seletivo_veiculos: "Veículos/Embarcações — IS adicional",
};

// ─── Color helpers ───────────────────────────────────────────────────────────
// Theme colors (RGB)
const NAVY: [number, number, number] = [15, 30, 53];
const ORANGE: [number, number, number] = [249, 115, 22];
const GREEN: [number, number, number] = [22, 163, 74];
const RED: [number, number, number] = [220, 38, 38];
const AMBER: [number, number, number] = [217, 119, 6];
const WHITE: [number, number, number] = [255, 255, 255];
const LIGHT_GRAY: [number, number, number] = [245, 246, 248];
const DARK_TEXT: [number, number, number] = [26, 26, 46];
const MID_TEXT: [number, number, number] = [80, 80, 100];
const RULE_COLOR: [number, number, number] = [220, 224, 235];

function getRiskLevel(score: number): string {
  if (score >= 70) return "CRÍTICO";
  if (score >= 45) return "ALTO";
  if (score >= 20) return "MODERADO";
  return "BAIXO";
}

function getRiskColor(score: number): [number, number, number] {
  if (score >= 70) return RED;
  if (score >= 45) return ORANGE;
  if (score >= 20) return AMBER;
  return GREEN;
}

function getAxisColor(score: number): [number, number, number] {
  if (score >= 70) return RED;
  if (score >= 45) return ORANGE;
  if (score >= 20) return AMBER;
  return GREEN;
}

function getAxisLabel(score: number): string {
  if (score >= 70) return "CRÍTICO";
  if (score >= 45) return "ALTO";
  if (score >= 20) return "MODERADO";
  return "BAIXO";
}

function getItemColor(level: string): [number, number, number] {
  if (level === "critico") return RED;
  if (level === "alto") return ORANGE;
  return AMBER;
}

function getItemLabel(level: string): string {
  if (level === "critico") return "CRÍTICO";
  if (level === "alto") return "ALTO";
  return "MODERADO";
}

function getConclusionText(companyName: string, diagnosis: DiagnosisResult): string {
  const score = diagnosis.overallScore;
  const level = getRiskLevel(score);
  const sortedAxes = [...diagnosis.axes].sort((a, b) => b.score - a.score);
  const topAxes = sortedAxes.filter((ax) => ax.score > 0).slice(0, 2);
  const axisNames = topAxes.map((ax) => ax.name);
  const name = companyName && companyName !== "Minha Empresa" ? companyName : "A empresa";

  if (level === "CRÍTICO") {
    const ax = axisNames.length > 0 ? `nos eixos de ${axisNames.join(" e ")}` : "em múltiplos eixos";
    return `${name} foi classificada com risco CRÍTICO na Reforma Tributária. Os principais fatores determinantes foram identificados ${ax}, onde existem falhas estruturais que comprometem a operação e o resultado financeiro durante a transição. Com a fase de coexistência IBS/CBS ativa desde 2026, o custo de não agir cresce a cada mês. As ações imediatas indicadas no Plano de Ação devem ser iniciadas esta semana.`;
  }
  if (level === "ALTO") {
    const ax = axisNames.length > 0 ? `${axisNames.join(" e ")}` : "fiscal e operacional";
    return `${name} foi classificada com risco ALTO na Reforma Tributária. Os eixos de ${ax} concentram as principais lacunas identificadas, com pontos que precisam ser endereçados nos próximos 30 dias. A transição está ativa desde 2026 — o Plano de Ação detalha as ações prioritárias para reduzir a exposição antes que os riscos se materializem.`;
  }
  if (level === "MODERADO") {
    const ax = axisNames.length > 0 ? `${axisNames.join(" e ")}` : "alguns eixos";
    return `${name} foi classificada com risco MODERADO na Reforma Tributária. A empresa possui base parcial de adequação, mas os eixos de ${ax} apresentam pontos que precisam de atenção nos próximos 60 a 90 dias. O Plano de Ação abaixo indica os próximos passos para consolidar a adequação durante a transição (2026–2033).`;
  }
  return `${name} foi classificada com risco BAIXO na Reforma Tributária. A empresa demonstra boa base de adequação${axisNames.length > 0 ? `, com atenção pontual aos eixos de ${axisNames.join(" e ")}` : ""}. A transição está ativa desde 2026 — mantenha o monitoramento mensal e revise trimestralmente com o contador para garantir conformidade ao longo de 2026–2033.`;
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function generateActionPlanPdf(data: CompanyData, diagnosis: DiagnosisResult, plan: PlanAction[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const M = 20;
  const CW = PW - M * 2;
  let y = 0;

  const riskColor = getRiskColor(diagnosis.overallScore);
  const riskLevel = getRiskLevel(diagnosis.overallScore);
  const todayStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const todayShort = new Date().toLocaleDateString("pt-BR");

  // ── helpers ──────────────────────────────────────────────────────────────

  function setFont(style: "bold" | "normal" | "italic" | "bolditalic" = "normal", size = 9) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  }

  function setColor(rgb: [number, number, number]) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }

  function fillRect(x: number, yr: number, w: number, h: number, rgb: [number, number, number]) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(x, yr, w, h, "F");
  }

  function fillRounded(x: number, yr: number, w: number, h: number, rgb: [number, number, number], r = 2) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.roundedRect(x, yr, w, h, r, r, "F");
  }

  function hRule(yr: number, rgb: [number, number, number] = RULE_COLOR) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
    doc.setLineWidth(0.3);
    doc.line(M, yr, M + CW, yr);
  }

  function checkBreak(needed: number) {
    if (y + needed > PH - 18) {
      doc.addPage();
      y = M;
      addBodyFooter();
    }
  }

  function addBodyFooter() {
    const pg = doc.getNumberOfPages();
    setFont("normal", 7);
    setColor([160, 160, 175]);
    doc.text(`REFORMA EM AÇÃO  ·  Diagnóstico de Risco Tributário`, M, PH - 8);
    doc.text(`Página ${pg}`, PW - M, PH - 8, { align: "right" });
    hRule(PH - 12, [210, 214, 225]);
  }

  // Section header with colored band
  function addSectionHeader(title: string, rgb: [number, number, number]) {
    checkBreak(16);
    fillRect(0, y, PW, 11, rgb);
    setFont("bold", 9.5);
    setColor(WHITE);
    doc.text(title.toUpperCase(), M, y + 7.5);
    y += 15;
    doc.setTextColor(...DARK_TEXT);
  }

  // Sub-section label
  function addSubLabel(label: string) {
    checkBreak(12);
    y += 2;
    setFont("bold", 8.5);
    setColor(NAVY);
    doc.text(label, M, y);
    y += 6;
    setColor(DARK_TEXT);
  }

  // Paragraph text with word wrap
  function addParagraph(text: string, size = 8.5, color: [number, number, number] = DARK_TEXT) {
    setFont("normal", size);
    setColor(color);
    const lines = doc.splitTextToSize(text, CW);
    checkBreak(lines.length * 5 + 3);
    doc.text(lines, M, y);
    y += lines.length * 5 + 2;
  }

  // Bullet item
  function addBullet(text: string, indentX = M + 5, bulletColor: [number, number, number] = ORANGE) {
    setFont("normal", 8);
    const lines = doc.splitTextToSize(text, CW - 8);
    checkBreak(lines.length * 5 + 2);
    doc.setFillColor(...bulletColor);
    doc.circle(indentX - 3, y - 0.8, 0.9, "F");
    setColor(DARK_TEXT);
    doc.text(lines, indentX, y);
    y += lines.length * 5 + 1.5;
  }

  // Key–value row (compact)
  function addKV(label: string, value: string) {
    if (!value || value === "—") return;
    checkBreak(7);
    setFont("bold", 8);
    setColor(MID_TEXT);
    doc.text(label + ":", M, y);
    setFont("normal", 8);
    setColor(DARK_TEXT);
    const lw = doc.getTextWidth(label + ":  ");
    const lines = doc.splitTextToSize(value, CW - lw - 1);
    doc.text(lines, M + lw, y);
    y += lines.length * 5 + 1;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════════════════════
  fillRect(0, 0, PW, PH, NAVY);

  // Top accent stripe
  fillRect(0, 0, PW, 3, ORANGE);

  // App logo area
  const logoY = 24;
  setFont("bold", 22);
  setColor(WHITE);
  // "REFORMA " in white
  doc.text("REFORMA ", PW / 2, logoY, { align: "center" });
  // recalculate to place "EM" in orange and "AÇÃO" in white side by side
  const fullTitle = "REFORMA EM AÇÃO";
  const fullW = doc.getTextWidth(fullTitle);
  const startX = (PW - fullW) / 2;
  const reformaW = doc.getTextWidth("REFORMA ");
  const emW = doc.getTextWidth("EM ");
  doc.setTextColor(...ORANGE);
  doc.text("EM ", startX + reformaW, logoY);
  doc.setTextColor(...WHITE);
  doc.text("AÇÃO", startX + reformaW + emW, logoY);

  // Tagline
  setFont("normal", 8.5);
  setColor([190, 200, 220]);
  doc.text("Plataforma de Diagnóstico para a Reforma Tributária Brasileira", PW / 2, logoY + 8, { align: "center" });

  // Divider
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(0.8);
  doc.line(M + 20, logoY + 14, PW - M - 20, logoY + 14);

  // Main title
  const titleY = logoY + 28;
  setFont("bold", 20);
  setColor(WHITE);
  doc.text("DIAGNÓSTICO DE RISCO TRIBUTÁRIO", PW / 2, titleY, { align: "center" });

  setFont("normal", 9);
  setColor([190, 200, 220]);
  doc.text("Análise personalizada de exposição à Reforma Tributária (EC 132/2023 · LC 214/2025 · LC 227/2026)", PW / 2, titleY + 8, { align: "center" });

  // Company box (rounded, semi-transparent border)
  const boxY = titleY + 20;
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(1);
  doc.roundedRect(M, boxY, CW, 38, 3, 3);

  setFont("bold", 15);
  setColor(WHITE);
  const cnLines = doc.splitTextToSize(data.companyName.toUpperCase(), CW - 12);
  doc.text(cnLines, PW / 2, boxY + 10, { align: "center" });

  let coverInfoY = boxY + 10 + cnLines.length * 7;
  setFont("normal", 8.5);
  setColor([190, 200, 220]);
  if (data.nomeFantasia) {
    doc.text(`"${data.nomeFantasia}"`, PW / 2, coverInfoY, { align: "center" });
    coverInfoY += 6;
  }
  if (data.cnpj) {
    doc.text(`CNPJ: ${data.cnpj}`, PW / 2, coverInfoY, { align: "center" });
    coverInfoY += 5;
  }
  if (data.municipio || data.estado) {
    doc.text([data.municipio, data.estado].filter(Boolean).join(" — "), PW / 2, coverInfoY, { align: "center" });
  }

  // Risk badge
  const badgeY = boxY + 48;
  fillRounded(M + 10, badgeY, CW - 20, 24, riskColor, 4);
  setFont("bold", 18);
  setColor(WHITE);
  doc.text(riskLevel, PW / 2, badgeY + 11, { align: "center" });
  setFont("normal", 9);
  doc.text(`Índice de Exposição: ${diagnosis.overallScore} pontos`, PW / 2, badgeY + 19, { align: "center" });

  // Score bar
  const barY = badgeY + 30;
  fillRounded(M + 10, barY, CW - 20, 5, [40, 55, 80], 2.5);
  const barFill = Math.max(4, ((diagnosis.overallScore / 100) * (CW - 20)));
  fillRounded(M + 10, barY, barFill, 5, riskColor, 2.5);

  setFont("normal", 7.5);
  setColor([140, 155, 175]);
  doc.text("0", M + 10, barY + 9.5);
  doc.text("100", M + CW - 10, barY + 9.5, { align: "right" });

  // Responsible
  const respY = barY + 14;
  if (data.contactName) {
    setFont("normal", 8);
    setColor([190, 200, 220]);
    doc.text(`Responsável: ${data.contactName}${data.contactRole ? ` — ${data.contactRole}` : ""}`, PW / 2, respY, { align: "center" });
  }

  // Bottom footer area of cover
  const coverFootY = PH - 20;
  hRule(coverFootY - 4, [40, 55, 80]);
  setFont("normal", 7.5);
  setColor([140, 155, 175]);
  doc.text(`Documento gerado em ${todayStr}`, M, coverFootY + 1);
  doc.text("Baseado em EC 132/2023  ·  LC 214/2025  ·  LC 227/2026", PW / 2, coverFootY + 1, { align: "center" });
  doc.text("Período de transição: 2026–2033", PW - M, coverFootY + 1, { align: "right" });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — RESUMO EXECUTIVO
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  y = M;
  addBodyFooter();

  addSectionHeader("Resumo Executivo", ORANGE);

  // Company data box
  fillRounded(M, y, CW, 54, LIGHT_GRAY, 3);
  const boxPad = 5;
  let by = y + boxPad + 4;

  setFont("bold", 9);
  setColor(NAVY);
  doc.text("DADOS DA EMPRESA", M + boxPad, by);
  by += 7;

  const companyRows = [
    ["Empresa", data.companyName + (data.nomeFantasia ? ` (${data.nomeFantasia})` : "")],
    ["CNPJ", data.cnpj || "—"],
    ["Setor", SECTOR_LABELS[data.sector] || data.sector],
    ["Regime", REGIME_LABELS[data.regime] || data.regime],
    ["Porte", EMPLOYEE_LABELS[data.employeeCount] || data.employeeCount],
    ["Localização", [data.municipio, data.estado].filter(Boolean).join(" — ") || "—"],
    ["Nível de risco", `${riskLevel} — Score ${diagnosis.overallScore}/100`],
  ];

  const halfW = (CW - boxPad * 2 - 6) / 2;
  let col2x = M + boxPad + halfW + 6;
  let col1y = by;
  let col2y = by;

  companyRows.forEach(([label, value], idx) => {
    const isLeft = idx % 2 === 0;
    const cx = isLeft ? M + boxPad : col2x;
    let cy = isLeft ? col1y : col2y;

    setFont("bold", 7.5);
    setColor(MID_TEXT);
    doc.text(label + ":", cx, cy);
    setFont("normal", 7.5);
    setColor(idx === 6 ? riskColor : DARK_TEXT);
    const lw = doc.getTextWidth(label + ":  ");
    const vLines = doc.splitTextToSize(value, halfW - lw - 2);
    doc.text(vLines, cx + lw, cy);
    const rowH = vLines.length * 4.5 + 1;
    if (isLeft) col1y += rowH;
    else col2y += rowH;
  });

  y += 57;

  // Conclusion paragraph
  y += 3;
  addSubLabel("Análise e Conclusão");
  const conclusionText = getConclusionText(data.companyName, diagnosis);
  addParagraph(conclusionText);

  y += 5;

  // Axis bar chart
  addSubLabel("Exposição por Eixo de Avaliação");

  const barRowH = 11;
  const labelColW = 52;
  const barColW = CW - labelColW - 20;

  diagnosis.axes.forEach((ax) => {
    checkBreak(barRowH + 3);
    const axColor = getAxisColor(ax.score);
    const axLabel = getAxisLabel(ax.score);

    // Row background
    fillRounded(M, y, CW, barRowH, LIGHT_GRAY, 1.5);

    // Axis name
    setFont("bold", 7.5);
    setColor(DARK_TEXT);
    doc.text(ax.name, M + 3, y + 7.5);

    // Background bar track
    const trackX = M + labelColW;
    fillRounded(trackX, y + 3.5, barColW, 4, [210, 215, 225], 2);

    // Filled bar
    const fillW = Math.max(2, Math.round((ax.score / 100) * barColW));
    fillRounded(trackX, y + 3.5, fillW, 4, axColor, 2);

    // Score + label right side
    setFont("bold", 7);
    setColor(axColor);
    doc.text(`${ax.score}/100`, PW - M - 18, y + 7.5, { align: "right" });
    setFont("normal", 6.5);
    doc.text(axLabel, PW - M - 2, y + 7.5, { align: "right" });

    y += barRowH + 2;
  });

  y += 4;

  // Top opportunity
  checkBreak(20);
  fillRounded(M, y, CW, 16, [236, 253, 245], 3);
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.4);
  doc.roundedRect(M, y, CW, 16, 3, 3);
  setFont("bold", 8);
  setColor(GREEN);
  doc.text("✦  Maior Oportunidade", M + 4, y + 6);
  setFont("normal", 7.5);
  setColor([22, 100, 50]);
  const oppLines = doc.splitTextToSize(diagnosis.topOpportunity, CW - 8);
  doc.text(oppLines, M + 4, y + 12);
  y += 19 + (oppLines.length > 1 ? (oppLines.length - 1) * 4 : 0);

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — RISCOS IDENTIFICADOS (grouped by axis)
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  y = M;
  addBodyFooter();

  addSectionHeader("Riscos Identificados", RED);

  // Summary count line
  const critCount = diagnosis.allItems.filter(i => i.level === "critico").length;
  const altoCount = diagnosis.allItems.filter(i => i.level === "alto").length;
  const modCount = diagnosis.allItems.filter(i => i.level === "moderado").length;

  const summaryBoxH = 14;
  fillRounded(M, y, CW, summaryBoxH, LIGHT_GRAY, 2);

  const colW3 = CW / 3;
  const summaryItems: Array<[string, number, [number, number, number]]> = [
    ["CRÍTICO", critCount, RED],
    ["ALTO", altoCount, ORANGE],
    ["MODERADO", modCount, AMBER],
  ];
  summaryItems.forEach(([label, count, color], idx) => {
    const cx = M + idx * colW3 + colW3 / 2;
    setFont("bold", 13);
    setColor(color);
    doc.text(String(count), cx, y + 8, { align: "center" });
    setFont("normal", 7);
    setColor(MID_TEXT);
    doc.text(label, cx, y + 12.5, { align: "center" });
  });
  y += summaryBoxH + 6;

  // Items grouped by axis
  diagnosis.axes.forEach((ax) => {
    if (ax.items.length === 0) return;

    checkBreak(14);

    // Axis group header
    const axC = getAxisColor(ax.score);
    fillRounded(M, y, CW, 9, [axC[0], axC[1], axC[2]], 2);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...WHITE);
    setFont("bold", 8.5);
    setColor(WHITE);
    doc.text(ax.name.toUpperCase(), M + 4, y + 6.3);
    setFont("normal", 7.5);
    doc.text(`Score: ${ax.score}/100`, PW - M - 4, y + 6.3, { align: "right" });
    y += 11;

    ax.items.forEach((item) => {
      const itemColor = getItemColor(item.level);
      const itemLabel = getItemLabel(item.level);
      const descLines = doc.splitTextToSize(item.desc, CW - 14);
      const actionLines = doc.splitTextToSize("→ " + item.action, CW - 14);
      const cardH = 10 + descLines.length * 4.5 + 2 + actionLines.length * 4.5 + 4;

      checkBreak(cardH + 2);

      // Card
      fillRounded(M, y, CW, cardH, LIGHT_GRAY, 2);

      // Left accent stripe
      fillRect(M, y, 3, cardH, itemColor);

      // Level badge
      fillRounded(M + 6, y + 3, 18, 5.5, itemColor, 1.5);
      setFont("bold", 6);
      setColor(WHITE);
      doc.text(itemLabel, M + 15, y + 7, { align: "center" });

      // Title
      setFont("bold", 8);
      setColor(DARK_TEXT);
      doc.text(item.title, M + 27, y + 7);

      // Description
      setFont("normal", 7.5);
      setColor(MID_TEXT);
      doc.text(descLines, M + 7, y + 13);

      // Action
      let actY = y + 13 + descLines.length * 4.5 + 2;
      setFont("italic", 7.5);
      setColor([22, 100, 50]);
      doc.text(actionLines, M + 7, actY);

      y += cardH + 3;
    });

    y += 3;
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGES 4+ — PLANO DE AÇÃO
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  y = M;
  addBodyFooter();

  addSectionHeader("Plano de Ação Recomendado", GREEN);

  const phases: Array<{ num: 1 | 2 | 3; title: string; subtitle: string; color: [number, number, number]; bgColor: [number, number, number] }> = [
    { num: 1, title: "FASE 1 — Ação Imediata", subtitle: "7 a 15 dias — resolva os riscos críticos e estabeleça a base da transição", color: RED, bgColor: [255, 245, 245] },
    { num: 2, title: "FASE 2 — Estruturação", subtitle: "30 a 60 dias — organize processos, dados fiscais e fornecedores", color: AMBER, bgColor: [255, 252, 240] },
    { num: 3, title: "FASE 3 — Consolidação", subtitle: "60 a 120 dias — estruture, teste sistemas e valide com o contador", color: NAVY, bgColor: LIGHT_GRAY },
  ];

  const priorityLabel: Record<string, string> = { urgente: "URGENTE", alta: "ALTA", media: "MÉDIA", baixa: "BAIXA" };
  const priorityColor: Record<string, [number, number, number]> = { urgente: RED, alta: ORANGE, media: AMBER, baixa: GREEN };

  phases.forEach((ph) => {
    const phActions = plan.filter((a) => a.phase === ph.num);
    if (phActions.length === 0) return;

    checkBreak(18);

    // Phase header block
    fillRounded(M, y, CW, 14, ph.color, 3);
    setFont("bold", 10);
    setColor(WHITE);
    doc.text(ph.title, M + 5, y + 8);
    setFont("normal", 7.5);
    doc.text(ph.subtitle, M + 5, y + 13);
    y += 17;

    phActions.forEach((action, idx) => {
      const descLines = doc.splitTextToSize(action.desc || "", CW - 14);
      const motivoLines = doc.splitTextToSize(`Por quê: ${action.motivo}`, CW - 14);
      const prazoLine = `Prazo: ${action.prazo}  |  Responsável: ${action.responsavel}`;
      const cardH = 12 + descLines.length * 4.5 + motivoLines.length * 4.5 + 7;

      checkBreak(cardH + 3);

      // Card background
      fillRounded(M, y, CW, cardH, ph.bgColor, 2);
      doc.setDrawColor(...RULE_COLOR);
      doc.setLineWidth(0.3);
      doc.roundedRect(M, y, CW, cardH, 2, 2);

      // Checkbox
      doc.setDrawColor(...MID_TEXT);
      doc.setLineWidth(0.5);
      doc.rect(M + 4, y + 4, 5, 5);

      // Number + title
      setFont("bold", 8.5);
      setColor(DARK_TEXT);
      doc.text(`${idx + 1}.  ${action.title}`, M + 12, y + 8);

      // Priority badge
      const pColor = priorityColor[action.priority] || MID_TEXT;
      const pLabel = priorityLabel[action.priority] || action.priority;
      setFont("bold", 6.5);
      setColor(pColor);
      doc.text(`[${pLabel}]`, PW - M - 30, y + 8, { align: "right" });

      // Eixo
      setFont("italic", 6.5);
      setColor(NAVY);
      const eixoLines = doc.splitTextToSize(action.eixo || "", 28);
      doc.text(eixoLines, PW - M - 3, y + 8, { align: "right" });

      let cy = y + 13;

      // Description
      setFont("normal", 7.5);
      setColor(DARK_TEXT);
      doc.text(descLines, M + 7, cy);
      cy += descLines.length * 4.5 + 1.5;

      // Motivo
      setFont("normal", 7);
      setColor([100, 80, 30]);
      doc.text(motivoLines, M + 7, cy);
      cy += motivoLines.length * 4.5 + 1.5;

      // Prazo / responsável
      setFont("bold", 7);
      setColor(NAVY);
      doc.text(prazoLine, M + 7, cy);

      y += cardH + 4;
    });

    y += 5;
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CHECKLIST + LEGAL DISCLAIMER (last page)
  // ═══════════════════════════════════════════════════════════════════════════
  checkBreak(80);

  addSectionHeader("Checklist de Prontidão Operacional", NAVY);

  const checklist = [
    "Fornecedor do ERP confirmou plano de atualização para IBS/CBS com cronograma por escrito",
    "Cadastro dos 30 principais produtos/serviços padronizado com NCM/NBS correto",
    "Fornecedores classificados em A (regime regular) / B (crédito limitado) / C (documentação inadequada)",
    "Contratos de longo prazo revisados por advogado com cláusula de revisão tributária",
    "Equipes fiscal, comercial e financeira treinadas sobre a reforma tributária",
    "Nova tabela de preços calculada com IBS/CBS incorporado",
    "Impacto do Split Payment simulado e capital de giro ajustado",
    "NF-e com campos de IBS/CBS testada em ambiente de homologação da SEFAZ",
    "Diretoria engajada com cronograma e orçamento aprovados para a adaptação",
    "Reunião de validação final com contador realizada antes de 2026",
  ];

  const urgentFlags = [
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
    const isUrgent = urgentFlags[idx];
    const rowH = 8;
    checkBreak(rowH + 2);

    fillRounded(M, y, CW, rowH, isUrgent ? [255, 245, 245] : LIGHT_GRAY, 1.5);
    if (isUrgent) {
      doc.setDrawColor(...RED);
      doc.setLineWidth(0.3);
      doc.roundedRect(M, y, CW, rowH, 1.5, 1.5);
    }

    // Checkbox
    doc.setDrawColor(isUrgent ? RED[0] : MID_TEXT[0], isUrgent ? RED[1] : MID_TEXT[1], isUrgent ? RED[2] : MID_TEXT[2]);
    doc.setLineWidth(0.5);
    doc.rect(M + 4, y + 1.8, 4.5, 4.5);

    setFont("normal", 7.5);
    setColor(isUrgent ? RED : DARK_TEXT);
    doc.text(`${item}`, M + 12, y + 5.5);

    if (isUrgent) {
      setFont("bold", 6.5);
      setColor(RED);
      doc.text("[PENDENTE]", PW - M - 3, y + 5.5, { align: "right" });
    }

    y += rowH + 2;
  });

  y += 10;

  // Disclaimer box
  checkBreak(36);
  hRule(y, RULE_COLOR);
  y += 6;

  setFont("bold", 8);
  setColor(NAVY);
  doc.text("Aviso Legal e Informações Regulatórias", M, y);
  y += 7;

  const disclaimer = [
    "Este diagnóstico tem caráter estritamente informativo e foi gerado com base nas informações fornecidas pela empresa e nas normas EC 132/2023, LC 214/2025 e LC 227/2026. Não substitui consultoria tributária, jurídica ou contábil especializada.",
    "As alíquotas definitivas de IBS e CBS serão definidas pelo Comitê Gestor do IBS e dependem de regulamentação complementar. Os percentuais utilizados neste documento são estimativas comparativas — consulte seu contador para confirmar os valores aplicáveis à sua operação.",
    "O período de transição previsto é de 2026 a 2033, com convivência simultânea de tributos antigos e novos conforme calendário da LC 214/2025.",
  ];

  disclaimer.forEach((d) => {
    addParagraph(d, 7.5, MID_TEXT);
    y += 1;
  });

  y += 6;
  hRule(y, RULE_COLOR);
  y += 6;

  setFont("italic", 7.5);
  setColor([140, 155, 175]);
  doc.text(`Documento gerado em ${todayStr} pela plataforma REFORMA EM AÇÃO`, PW / 2, y, { align: "center" });
  y += 5;
  doc.text("reforma-em-acao.com.br  ·  Este diagnóstico tem caráter informativo. Consulte um especialista tributário para decisões específicas.", PW / 2, y, { align: "center" });

  // Save
  const filename = `REFORMA-EM-ACAO_${data.companyName.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30)}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
