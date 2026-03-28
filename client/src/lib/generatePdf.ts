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
  selfAssessedMaturity?: string;
  riskScore: number;
}

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

function getRiskLevel(score: number): string {
  if (score >= 70) return "CRÍTICO";
  if (score >= 45) return "ALTO";
  if (score >= 20) return "MODERADO";
  return "BAIXO";
}

function getRiskColor(score: number): [number, number, number] {
  if (score >= 70) return [220, 38, 38];
  if (score >= 45) return [234, 88, 12];
  if (score >= 20) return [202, 138, 4];
  return [22, 163, 74];
}

export function generateActionPlanPdf(data: CompanyData, diagnosis: DiagnosisResult, plan: PlanAction[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const cw = pageWidth - margin * 2;
  let y = 0;

  function checkBreak(needed: number) {
    if (y + needed > pageHeight - 22) { doc.addPage(); y = 18; addFooter(); }
  }

  function addFooter() {
    const pg = doc.getNumberOfPages();
    doc.setFontSize(7); doc.setTextColor(150, 150, 150);
    doc.text(`REFORMA EM AÇÃO — Diagnóstico e Plano de Ação | Página ${pg}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text("Este documento não substitui consultoria tributária e jurídica especializada.", pageWidth / 2, pageHeight - 6, { align: "center" });
  }

  function addSection(title: string) {
    checkBreak(18); y += 3;
    doc.setFillColor(30, 64, 175); doc.rect(margin, y, cw, 8.5, "F");
    doc.setFontSize(10); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), margin + 4, y + 6); y += 13;
    doc.setTextColor(30, 30, 30);
  }

  function addSubSection(title: string) {
    checkBreak(12); y += 2;
    doc.setFillColor(240, 245, 255); doc.rect(margin, y, cw, 7, "F");
    doc.setFontSize(9); doc.setTextColor(30, 64, 175); doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, y + 5); y += 10;
    doc.setTextColor(30, 30, 30);
  }

  function addField(label: string, value: string) {
    if (!value) return;
    checkBreak(8);
    doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(80, 80, 80);
    doc.text(label + ":", margin, y);
    const lw = doc.getTextWidth(label + ": ");
    doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(value, cw - lw - 1);
    doc.text(lines, margin + lw + 0.5, y); y += lines.length * 5 + 1.5;
  }

  function addParagraph(text: string, sz = 8.5) {
    doc.setFontSize(sz); doc.setFont("helvetica", "normal"); doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, cw);
    checkBreak(lines.length * 5 + 3);
    doc.text(lines, margin, y); y += lines.length * 5 + 2;
  }

  function addBullet(text: string, color: [number, number, number] = [50, 50, 50]) {
    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, cw - 7);
    checkBreak(lines.length * 5 + 1.5);
    doc.text("•", margin + 2, y); doc.text(lines, margin + 7, y); y += lines.length * 5 + 1;
    doc.setTextColor(50, 50, 50);
  }

  // ============ COVER PAGE ============
  doc.setFillColor(30, 64, 175); doc.rect(0, 0, pageWidth, 70, "F");
  doc.setFontSize(22); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold");
  doc.text("REFORMA EM AÇÃO", pageWidth / 2, 23, { align: "center" });
  doc.setFontSize(11); doc.setFont("helvetica", "normal");
  doc.text("Plano de Ação para Adaptação à Reforma Tributária", pageWidth / 2, 34, { align: "center" });
  doc.setFontSize(8.5);
  doc.text("Diagnóstico Personalizado · Plano de Ação · Infrações e Penalidades", pageWidth / 2, 44, { align: "center" });
  doc.setFontSize(8);
  doc.text("Base: EC 132/2023 | LC 214/2025 | LC 227/2026", pageWidth / 2, 54, { align: "center" });

  doc.setFillColor(248, 250, 255); doc.roundedRect(margin, 78, cw, 52, 3, 3, "F");
  doc.setDrawColor(200, 215, 255); doc.setLineWidth(0.5); doc.roundedRect(margin, 78, cw, 52, 3, 3, "S");

  doc.setFontSize(16); doc.setTextColor(30, 64, 175); doc.setFont("helvetica", "bold");
  const cnLines = doc.splitTextToSize(data.companyName.toUpperCase(), cw - 10);
  doc.text(cnLines, pageWidth / 2, 92, { align: "center" });

  let coverY = 92 + cnLines.length * 8;
  doc.setFontSize(9); doc.setTextColor(80, 80, 80); doc.setFont("helvetica", "normal");
  if (data.nomeFantasia) { doc.text(`"${data.nomeFantasia}"`, pageWidth / 2, coverY, { align: "center" }); coverY += 7; }
  if (data.cnpj) { doc.text(`CNPJ: ${data.cnpj}`, pageWidth / 2, coverY, { align: "center" }); coverY += 6; }
  if (data.municipio || data.estado) { doc.text([data.municipio, data.estado].filter(Boolean).join(" — "), pageWidth / 2, coverY, { align: "center" }); coverY += 6; }
  if (data.contactName) { doc.text(`Responsável: ${data.contactName}${data.contactRole ? ` (${data.contactRole})` : ""}`, pageWidth / 2, coverY, { align: "center" }); }

  y = 145;
  const [rr, rg, rb] = getRiskColor(diagnosis.overallScore);
  doc.setFillColor(rr, rg, rb); doc.roundedRect(margin, y, cw, 18, 3, 3, "F");
  doc.setFontSize(12); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold");
  doc.text(`NÍVEL DE RISCO: ${getRiskLevel(diagnosis.overallScore)} — Score ${diagnosis.overallScore}/100`, pageWidth / 2, y + 11, { align: "center" });

  y += 26;
  const coverInfo = [
    ["Setor", SECTOR_LABELS[data.sector] || data.sector],
    ["Regime Tributário", REGIME_LABELS[data.regime] || data.regime],
    ["Faturamento", REVENUE_LABELS[data.annualRevenue || ""] || REVENUE_LABELS[data.annualRevenue || ""] || "—"],
    ["Colaboradores", EMPLOYEE_LABELS[data.employeeCount] || data.employeeCount],
    ["Público-alvo", OPERATIONS_LABELS[data.operations] || data.operations],
    ["Sistema ERP", ERP_LABELS[data.erpSystem] || data.erpSystem],
  ];
  doc.setFontSize(9); doc.setTextColor(50, 50, 50);
  coverInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold"); doc.text(`${label}:`, margin + 4, y);
    doc.setFont("helvetica", "normal"); doc.text(value, margin + 55, y); y += 7;
  });

  y += 8;
  doc.setFontSize(7.5); doc.setTextColor(120, 120, 120); doc.setFont("helvetica", "italic");
  doc.text(`Relatório gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, pageWidth / 2, y, { align: "center" });

  addFooter();

  // ============ PAGE 2: PERFIL COMPLETO ============
  doc.addPage(); y = 18; addFooter();

  addSection("1. Identificação e Perfil da Empresa");
  addSubSection("Dados Cadastrais");
  addField("Razão Social", data.companyName);
  if (data.nomeFantasia) addField("Nome Fantasia", data.nomeFantasia);
  addField("CNPJ", data.cnpj);
  if (data.cnaeCode) addField("CNAE Principal", data.cnaeCode);
  if (data.estado || data.municipio) addField("Sede", [data.municipio, data.estado].filter(Boolean).join(" — "));
  if (data.contactName) addField("Responsável", `${data.contactName}${data.contactRole ? ` — ${data.contactRole}` : ""}${data.contactEmail ? ` | ${data.contactEmail}` : ""}`);

  addSubSection("Perfil Tributário e Operacional");
  addField("Setor", SECTOR_LABELS[data.sector] || data.sector);
  addField("Regime Tributário", REGIME_LABELS[data.regime] || data.regime);
  addField("Faturamento", REVENUE_LABELS[data.annualRevenue || ""] || "—");
  addField("Colaboradores", EMPLOYEE_LABELS[data.employeeCount] || data.employeeCount);
  addField("Público-alvo", OPERATIONS_LABELS[data.operations] || data.operations);
  addField("Tipo de operação", data.businessType === "produtos" ? "Produtos/mercadorias" : data.businessType === "servicos" ? "Serviços" : "Produtos e Serviços");
  addField("Alcance geográfico", data.geographicScope === "local" ? "Local (estado da sede)" : data.geographicScope === "regional" ? "Regional (2–5 estados)" : "Nacional");
  addField("ERP / Sistema", ERP_LABELS[data.erpSystem] || data.erpSystem);
  addField("Emissão NF-e", data.nfeEmission === "sistema_integrado" ? "Sistema integrado automático" : data.nfeEmission === "emissor_gratuito" ? "Emissor gratuito / portal SEFAZ" : "Contador faz tudo");
  addField("Volume de NF/mês", data.invoiceVolume === "ate_50" ? "Até 50" : data.invoiceVolume === "ate_100" ? "50 a 100" : data.invoiceVolume === "ate_500" ? "100 a 500" : "Acima de 500");
  addField("Fornecedores ativos", SUPPLIER_LABELS[data.supplierCount] || data.supplierCount);
  addField("% no Simples Nacional", SIMPLES_PCT_LABELS[data.simplesSupplierPercent] || data.simplesSupplierPercent);
  addField("Contratos longo prazo", data.hasLongTermContracts === "sim" ? "Sim" : "Não");
  if (data.hasLongTermContracts === "sim") addField("Cláusula de revisão tributária", data.priceRevisionClause === "sim" ? "Sim" : data.priceRevisionClause === "nao" ? "Não" : "Não analisado");
  addField("Responsável fiscal", TAX_LABELS[data.taxResponsible] || data.taxResponsible);
  addField("Margem de lucro", MARGIN_LABELS[data.profitMargin] || data.profitMargin);
  addField("Capital de giro", data.tightWorkingCapital === "sim" ? "Apertado" : data.tightWorkingCapital === "parcial" ? "Ocasionalmente" : "Confortável");
  addField("Split Payment", SPLIT_LABELS[data.splitPaymentAware] || data.splitPaymentAware);
  addField("Principal preocupação", CONCERN_LABELS[data.mainConcern] || data.mainConcern);
  if (data.hasExports === "sim") addField("Exportações", "Sim — imunidade de IBS/CBS aplicável");
  if (data.hasImports === "sim") addField("Importações", "Sim — regras específicas de IBS/CBS na importação");
  if (data.preparationStarted) addField("Preparação iniciada", data.preparationStarted === "sim_avancado" ? "Sim, bem avançada" : data.preparationStarted === "sim_inicial" ? "Sim, início" : "Não iniciada");
  if (data.hadInternalTraining) addField("Treinamento interno", data.hadInternalTraining === "sim_completo" ? "Sim, completo" : data.hadInternalTraining === "sim_parcial" ? "Parcial" : "Não realizado");
  if (data.selfAssessedMaturity) addField("Maturidade autoavaliada", data.selfAssessedMaturity === "alta" ? "Alta" : data.selfAssessedMaturity === "media" ? "Média" : "Baixa");

  if (data.specialRegimes && data.specialRegimes.length > 0) {
    addSubSection("Regimes Especiais e Benefícios");
    data.specialRegimes.forEach((r) => addBullet(SPECIAL_REGIME_LABELS[r] || r));
  }

  // ============ PAGE: CONTEXTO ============
  addSection("2. O Que Muda com a Reforma Tributária");
  addParagraph("A Reforma Tributária, regulamentada pela EC 132/2023, LC 214/2025 e LC 227/2026, representa a maior mudança na tributação do consumo no Brasil desde a Constituição de 1988. Os principais eixos da transformação são:");
  addBullet("Extinção gradual do sistema atual: PIS, COFINS, IPI, ICMS e ISS serão extintos de forma progressiva entre 2026 e 2033, conforme cronograma da LC 214/2025.");
  addBullet("Criação do IVA Dual: o sistema é substituído pelo IBS (Imposto sobre Bens e Serviços, de competência subnacional) e pela CBS (Contribuição sobre Bens e Serviços, de competência federal). As alíquotas de referência ainda dependem de definição normativa — considere os parâmetros divulgados como estimativas comparativas a serem confirmadas com o contador.");
  addBullet("Princípio do Destino: o imposto passa a ser devido no estado e município do consumidor da operação, não do produtor ou prestador, alterando o fluxo de arrecadação e a parametrização dos sistemas fiscais.");
  addBullet("Não-Cumulatividade Ampla: o IBS/CBS admite aproveitamento de crédito em praticamente toda a cadeia de insumos, observadas as regras e exceções da LC 214/2025 (itens de uso pessoal, operações específicas, etc.).");
  addBullet("Split Payment como mecanismo estruturante (LC 227/2026): a retenção do imposto na liquidação financeira está prevista em lei como estrutura base do modelo. A implementação operacional é progressiva e depende de regulamentação específica por meio de pagamento — acompanhe as atualizações com o contador e as instituições financeiras.");
  addBullet("Transição de 2026 a 2033: o calendário prevê período de testes e convivência com o sistema atual. Os percentuais e cronogramas por ano constam da LC 214/2025 e serão detalhados pelo Comitê Gestor do IBS.");

  if (data.sector === "industria") {
    addSubSection("Impacto Específico: Setor Industrial");
    addParagraph("A indústria tende a se beneficiar da não-cumulatividade plena: créditos amplos em insumos, logística e bens de capital podem reduzir a carga efetiva. Confirme com o contador quais insumos do seu processo produtivo geram crédito de IBS/CBS. A transição exige adaptação de sistemas fiscais e atenção aos fornecedores do Simples Nacional.");
  } else if (data.sector === "varejo") {
    addSubSection("Impacto Específico: Varejo");
    addParagraph("O varejo deve acompanhar de perto a implementação do Split Payment, mecanismo legal que prevê retenção do imposto antes do repasse ao lojista. A operacionalização depende de regulamentação específica por meio de pagamento. A gestão de créditos de fornecedores e a precificação correta tornam-se essenciais para manter a margem.");
  } else if (data.sector === "atacado") {
    addSubSection("Impacto Específico: Atacado / Distribuição");
    addParagraph("O atacado distribuidor precisa adaptar-se à transparência total de preços. Clientes B2B vão exigir destaque de IBS/CBS na nota para aproveitamento de créditos. A classificação de fornecedores e a gestão de alíquotas por estado de destino são prioridades imediatas.");
  }

  // ============ PAGE: DIAGNÓSTICO ============
  addSection("3. Diagnóstico Consolidado por Eixo");

  const riskLv = getRiskLevel(diagnosis.overallScore);
  const [drr, drg, drb] = getRiskColor(diagnosis.overallScore);
  checkBreak(20); doc.setFillColor(drr, drg, drb); doc.roundedRect(margin, y, cw, 14, 2, 2, "F");
  doc.setFontSize(11); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold");
  doc.text(`Score Geral: ${riskLv} — ${diagnosis.overallScore}/100 pontos de risco`, pageWidth / 2, y + 9, { align: "center" });
  y += 18; doc.setTextColor(30, 30, 30);

  const axisColorMap = (score: number): [number, number, number] => score >= 60 ? [220, 38, 38] : score >= 30 ? [217, 119, 6] : [22, 163, 74];

  diagnosis.axes.forEach((ax) => {
    checkBreak(30);
    const [axr, axg, axb] = axisColorMap(ax.score);
    doc.setFillColor(248, 250, 255); doc.roundedRect(margin, y, cw, ax.items.length > 0 ? 20 + ax.items.length * 8 : 18, 2, 2, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(30, 30, 30);
    doc.text(ax.name, margin + 4, y + 7);
    doc.setFillColor(axr, axg, axb);
    const barW = Math.round((ax.score / 100) * (cw - 8));
    doc.roundedRect(margin + 4, y + 10, barW || 2, 3, 1, 1, "F");
    doc.setFillColor(220, 220, 220); doc.rect(margin + 4 + barW, y + 10, cw - 8 - barW, 3, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(axr, axg, axb);
    doc.text(`${ax.score}/100 — ${ax.score >= 60 ? "Alto risco" : ax.score >= 30 ? "Moderado" : "Controlado"}`, pageWidth - margin - 4, y + 7, { align: "right" });
    y += 18;
    if (ax.items.length > 0) {
      ax.items.forEach((item) => {
        const [ir, ig, ib] = item.level === "critico" ? [220, 38, 38] : item.level === "alto" ? [234, 88, 12] : [202, 138, 4];
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(ir, ig, ib);
        doc.text(`[${item.level.charAt(0).toUpperCase() + item.level.slice(1)}] `, margin + 6, y);
        doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
        doc.text(item.title, margin + 6 + doc.getTextWidth(`[${item.level.charAt(0).toUpperCase() + item.level.slice(1)}] `), y);
        y += 7;
      });
    }
    y += 4;
  });

  if (diagnosis.allItems.length > 0) {
    addSection("4. Pontos de Atenção Detalhados");
    const criticalItems = diagnosis.allItems.filter((i) => i.level === "critico");
    const highItems = diagnosis.allItems.filter((i) => i.level === "alto");
    const modItems = diagnosis.allItems.filter((i) => i.level === "moderado");

    if (criticalItems.length > 0) {
      addSubSection("Riscos Críticos — Ação Imediata Obrigatória");
      criticalItems.forEach((item) => {
        checkBreak(22); doc.setFillColor(255, 240, 240); doc.roundedRect(margin, y, cw, 18, 2, 2, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(185, 28, 28);
        doc.text(item.title, margin + 4, y + 6);
        doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
        const dl = doc.splitTextToSize(item.desc, cw - 8);
        doc.text(dl, margin + 4, y + 12); y += 20;
        doc.setTextColor(30, 64, 175); doc.setFont("helvetica", "italic");
        const al = doc.splitTextToSize("→ " + item.action, cw - 8);
        checkBreak(al.length * 5 + 3); doc.text(al, margin + 4, y); y += al.length * 5 + 4;
        doc.setTextColor(30, 30, 30);
      });
    }
    if (highItems.length > 0) {
      addSubSection("Riscos Altos — Tratar nos Próximos 30 Dias");
      highItems.forEach((item) => {
        checkBreak(12); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(185, 80, 0);
        doc.text(item.title, margin + 2, y); y += 6;
        doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60);
        const dl = doc.splitTextToSize(item.action, cw - 4);
        checkBreak(dl.length * 5 + 3); doc.text(dl, margin + 2, y); y += dl.length * 5 + 4;
        doc.setTextColor(30, 30, 30);
      });
    }
    if (modItems.length > 0) {
      addSubSection("Riscos Moderados — Planejar nos Próximos 51 Dias");
      modItems.forEach((item) => { addBullet(item.title + ": " + item.action); });
    }
  }

  addSubSection("Maior Oportunidade");
  addParagraph(diagnosis.topOpportunity);

  // ============ PAGE: GRAU DE PRECISÃO ============
  addSection("5. Grau de Precisão do Diagnóstico");
  const cnpjClean2 = (data.cnpj || "").replace(/\D/g, "");
  const precisionFields = [
    { label: "Razão Social", filled: !!data.companyName && data.companyName.length > 3 },
    { label: "CNPJ", filled: cnpjClean2.length === 14 },
    { label: "Setor de Atuação", filled: !!data.sector },
    { label: "Regime Tributário", filled: !!data.regime },
    { label: "Tipo de Operação (B2B/B2C)", filled: !!data.operations },
    { label: "Número de Colaboradores", filled: !!data.employeeCount },
    { label: "Faturamento Anual", filled: !!data.annualRevenue },
    { label: "Sistema de Gestão (ERP)", filled: !!data.erpSystem },
    { label: "Plano do Fornecedor de ERP", filled: !!data.erpVendorReformPlan },
    { label: "Cadastro de Produtos/Serviços", filled: !!data.catalogStandardized },
    { label: "Emissão de NF-e", filled: !!data.nfeEmission },
    { label: "Fornecedores com NF Regular", filled: !!(data as any).hasRegularNF },
    { label: "Erros nas NFs Recebidas", filled: !!(data as any).hasNFErrors },
    { label: "Conhecimento sobre Split Payment", filled: !!data.splitPaymentAware },
    { label: "Situação do Capital de Giro", filled: !!data.tightWorkingCapital },
    { label: "Margem por Produto/Serviço", filled: !!(data as any).knowsMarginByProduct },
    { label: "Contratos de Longo Prazo", filled: !!data.hasLongTermContracts },
    { label: "Diretoria Ciente da Reforma", filled: !!data.managementAwareOfReform },
    { label: "Treinamento Interno", filled: !!data.hadInternalTraining },
    { label: "Preparação Iniciada", filled: !!data.preparationStarted },
    { label: "Responsável Fiscal Definido", filled: !!data.taxResponsible },
  ];
  const filledPrecision = precisionFields.filter(f => f.filled).length;
  const totalPrecision = precisionFields.length;
  const pctPrecision = Math.round((filledPrecision / totalPrecision) * 100);
  const verdeCountPdf = plan.filter(a => a.confianca === "verde" || a.confianca === "vermelho").length;
  const parcialCountPdf = plan.filter(a => a.confianca === "amarelo" || a.confianca === "laranja").length;

  addParagraph(`Completude do questionário: ${filledPrecision} de ${totalPrecision} campos críticos preenchidos (${pctPrecision}%)`);
  addParagraph(`Ações com base direta nas respostas: ${verdeCountPdf} | Ações com dado derivado ou parcial: ${parcialCountPdf} | Total: ${plan.length} ações`);

  const unfilledFields = precisionFields.filter(f => !f.filled);
  if (unfilledFields.length > 0) {
    addParagraph(`Campos não preenchidos — recomendações nesses pontos têm precisão reduzida: ${unfilledFields.map(f => f.label).join(", ")}.`);
  }

  addParagraph("Legenda de confiabilidade das ações:");
  addBullet("● Verde — baseado em resposta direta do questionário");
  addBullet("● Amarelo — conclusão derivada de múltiplas respostas");
  addBullet("● Laranja — estimativa com dado parcial ou ausente");
  addBullet("● Vermelho — risco identificado por resposta expressa de risco");

  // ============ PAGE: PLANO DE AÇÃO ============
  addSection("6. Plano de Ação Personalizado");

  const phases: Array<{ num: 1 | 2 | 3; title: string; subtitle: string }> = [
    { num: 1, title: "FASE 1 — Ações Imediatas (7 a 15 dias)", subtitle: "Resolva os riscos críticos e estabeleça a base para toda a transição." },
    { num: 2, title: "FASE 2 — Curto Prazo (30 a 60 dias)", subtitle: "Organize processos, dados fiscais e fornecedores." },
    { num: 3, title: "FASE 3 — Ações Estruturantes (60 a 120 dias)", subtitle: "Estruture, teste sistemas e valide com o contador." },
  ];

  const priorityLabel: Record<string, string> = { urgente: "URGENTE", alta: "ALTA", media: "MÉDIA", baixa: "BAIXA" };

  phases.forEach((ph) => {
    const phActions = plan.filter((a) => a.phase === ph.num);
    if (phActions.length === 0) return;
    checkBreak(16); y += 2;
    doc.setFillColor(30, 64, 175); doc.rect(margin, y, 6, 6, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(30, 64, 175);
    doc.text(ph.title, margin + 9, y + 5); y += 9;
    doc.setFont("helvetica", "italic"); doc.setFontSize(8); doc.setTextColor(100, 100, 100);
    doc.text(ph.subtitle, margin + 9, y); y += 7; doc.setTextColor(30, 30, 30);

    phActions.forEach((action, idx) => {
      const descLines = doc.splitTextToSize(action.desc || "", cw - 8);
      const motivoLines = doc.splitTextToSize(`Por quê: ${action.motivo}`, cw - 8);
      const sourceLines = action.source ? doc.splitTextToSize(`Base: ${action.source}`, cw - 8) : [];
      const cardH = 10 + descLines.length * 4.5 + motivoLines.length * 4.5 + (sourceLines.length > 0 ? sourceLines.length * 4 + 1 : 0) + 8;
      checkBreak(cardH);
      doc.setFillColor(248, 248, 255); doc.roundedRect(margin, y, cw, cardH, 2, 2, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(30, 30, 30);
      doc.text(`${idx + 1}. ${action.title}`, margin + 4, y + 7);
      const [pr, pg, pb] = action.priority === "urgente" ? [220, 38, 38] : action.priority === "alta" ? [234, 88, 12] : action.priority === "media" ? [202, 138, 4] : [22, 163, 74];
      doc.setFontSize(7); doc.setTextColor(pr, pg, pb);
      doc.text(`[${priorityLabel[action.priority] || action.priority}]`, pageWidth - margin - 30, y + 7, { align: "right" });
      doc.setFont("helvetica", "italic"); doc.setFontSize(7); doc.setTextColor(30, 64, 175);
      doc.text(action.eixo || "", pageWidth - margin - 4, y + 7, { align: "right" });
      let cy = y + 12;
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(30, 30, 30);
      doc.text(descLines, margin + 4, cy); cy += descLines.length * 4.5 + 1;
      doc.setTextColor(100, 80, 0);
      doc.text(motivoLines, margin + 4, cy); cy += motivoLines.length * 4.5 + 2;
      doc.setTextColor(30, 64, 175);
      doc.text(`Prazo: ${action.prazo}   |   Responsável: ${action.responsavel}`, margin + 4, cy); cy += 5;
      if (sourceLines.length > 0) {
        doc.setFont("helvetica", "italic"); doc.setFontSize(7); doc.setTextColor(120, 120, 120);
        doc.text(sourceLines, margin + 4, cy);
      }
      y += cardH + 3; doc.setTextColor(30, 30, 30);
    });
    y += 4;
  });

  // ============ PAGE: CHECKLIST FINAL ============
  addSection("7. Checklist de Prontidão Operacional");
  addParagraph("Use esta lista para validar se a empresa está pronta para 2026:");

  const checklist = [
    "Fornecedor do ERP confirmou plano de atualização para IBS/CBS com cronograma",
    "Cadastro dos 30 principais produtos/serviços padronizado com NCM/NBS",
    "Fornecedores classificados em matriz A (regime regular, doc. adequada) / B (crédito potencialmente limitado) / C (documentação inadequada)",
    "Contratos de longo prazo revisados por advogado e cláusula de revisão tributária incluída",
    "Equipe fiscal, comercial e financeira treinada sobre a reforma",
    "Nova tabela de preços calculada com IBS/CBS explícito",
    "Impacto do Split Payment simulado e capital de giro ajustado",
    "NF-e emitida com campos de IBS/CBS testada em ambiente de homologação",
    "Diretoria engajada com cronograma e orçamento para adaptação",
    "Reunião de validação final com contador realizada",
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
    checkBreak(10);
    doc.setFillColor(isUrgent ? 255 : 255, isUrgent ? 248 : 255, isUrgent ? 248 : 255);
    doc.roundedRect(margin, y, cw, 8, 1, 1, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(isUrgent ? 185 : 50, isUrgent ? 28 : 50, isUrgent ? 28 : 50);
    doc.text(`${idx + 1}. ${item}`, margin + 4, y + 5.5);
    if (isUrgent) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(7);
      doc.text("[URGENTE]", pageWidth - margin - 4, y + 5.5, { align: "right" });
    }
    y += 10;
  });

  y += 6;

  // ============ PAGE: INFRAÇÕES E PENALIDADES ============
  addSection("8. Infrações e Penalidades: o que sua empresa deve evitar");
  addParagraph("A reforma tributária não exige apenas adaptação fiscal. Ela também aumenta a importância da conformidade documental, cadastral e operacional. O Capítulo IV da LC 214/2025 (com alterações da LC 227/2026) estabelece as infrações e penalidades aplicáveis ao IBS e à CBS.");

  // Conceito Geral
  addSubSection("Conceito Geral");
  addParagraph("Infração é toda ação ou omissão que viole normas tributárias relativas ao IBS e à CBS — incluindo falhas no pagamento do tributo (obrigação principal) e descumprimentos documentais, cadastrais e declaratórios (obrigações acessórias). A multa não elimina a obrigação de pagar o tributo: o contribuinte deve regularizar ambos.");

  // Multas de Obrigação Principal
  addSubSection("Multas por Descumprimento de Obrigação Principal — Base: LC 214/2025, Capítulo IV");

  const multasData = [
    { label: "Multa de Ofício — Caso Geral", pct: "75%", desc: "Aplicável nos casos de lançamento de ofício — quando o fisco identifica e lança o tributo não recolhido corretamente pelo contribuinte." },
    { label: "Majoração — Sonegação, Fraude, Simulação ou Conluio", pct: "150%", desc: "Quando o fisco comprova sonegação fiscal, fraude, simulação ou conluio, o percentual da multa é dobrado. Trata-se de agravamento qualificado." },
    { label: "Reincidência", pct: "Agravada", desc: "A reincidência na mesma infração é fator de agravamento da penalidade, com previsão expressa no Capítulo IV da LC 214/2025." },
  ];

  multasData.forEach((m) => {
    checkBreak(22);
    doc.setFillColor(255, 245, 245);
    doc.roundedRect(margin, y, cw, 20, 2, 2, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(180, 28, 28);
    doc.text(m.pct, margin + 4, y + 7);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(30, 30, 30);
    doc.text(m.label, margin + 4, y + 13);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(80, 80, 80);
    const descLines = doc.splitTextToSize(m.desc, cw - 8);
    doc.text(descLines, margin + 4, y + 18);
    y += 22 + (descLines.length > 1 ? (descLines.length - 1) * 4 : 0);
  });

  y += 3;
  addParagraph("Nota sobre os percentuais: Os percentuais de 75% e 150% são consagrados no ordenamento tributário brasileiro e compatíveis com os dispositivos do Capítulo IV da LC 214/2025. Verifique com seu contador se há algum dispositivo específico para o período de transição que possa modificar esses valores.");

  // Infrações Acessórias
  addSubSection("Infrações por Descumprimento de Obrigações Acessórias — 20 Categorias (LC 214/2025, Cap. IV)");

  const categoriesData = [
    { id: "A", title: "Cadastro e Inscrição", desc: "Não realizar ou manter a inscrição no cadastro do IBS/CBS dentro do prazo exigido." },
    { id: "B", title: "Atualização Cadastral", desc: "Não comunicar alterações de dados cadastrais (endereço, sócio, atividade) no prazo regulamentar." },
    { id: "C", title: "Fechamento, Paralisação e Transferência", desc: "Encerrar ou transferir estabelecimento sem comunicação formal ao Comitê Gestor do IBS ou à RFB." },
    { id: "D", title: "Atraso ou Erro em Arquivos, Declarações e Informações Fiscais", desc: "Não entregar declarações/arquivos digitais no prazo ou entregá-los com erros relevantes." },
    { id: "E", title: "Softwares e Soluções Tecnológicas Irregulares", desc: "Uso de softwares fiscais não autorizados, não homologados ou adulterados." },
    { id: "F", title: "Uso Irregular de Equipamento de Medição", desc: "Utilizar equipamentos de medição sem atender às exigências legais de calibração, lacre ou homologação." },
    { id: "G", title: "Inutilização e Eventos de Documento Fiscal", desc: "Não registrar eventos obrigatórios (cancelamento, carta de correção, inutilização) no prazo regulamentar." },
    { id: "H", title: "Confirmação, Devolução, Desfazimento e Retorno de Operação", desc: "Não registrar corretamente devoluções, retornos ou desfazimentos com os documentos correspondentes." },
    { id: "I", title: "Embaraço à Fiscalização", desc: "Impedir, dificultar ou não colaborar com agentes fiscais no exercício de suas atribuições legais." },
    { id: "J", title: "Operação Desacobertada de Documento Fiscal", desc: "Realizar operação de venda ou prestação de serviço sem emissão do documento fiscal exigido." },
    { id: "K", title: "Documento Fiscal Reutilizado Indevidamente", desc: "Utilizar número, chave ou sequência de documento fiscal já utilizado, cancelado ou inutilizado." },
    { id: "L", title: "Documento Fiscal Não Idôneo", desc: "Emitir ou aceitar documento fiscal inválido ou emitido por empresa com cadastro irregular ou cancelado." },
    { id: "M", title: "Falsificação, Adulteração, Extravio ou Inutilização de Documento Fiscal", desc: "Praticar atos de falsidade material em documentos fiscais ou criar situações de extravio indevido." },
    { id: "N", title: "Crédito Fiscal Apropriado Indevidamente", desc: "Apropriar crédito de IBS/CBS sem respaldo documental válido, sem atendimento dos requisitos legais ou em duplicidade." },
    { id: "O", title: "Falta de Emissão de Documento Fiscal de Entrada/Aquisição", desc: "Não emitir NF de entrada quando a legislação exige que o destinatário seja o emissor (produtor rural, importação etc.)." },
    { id: "P", title: "Cancelamento Extemporâneo de Documento Fiscal", desc: "Cancelar NF-e ou outro documento fiscal fora do prazo regulamentar previsto na legislação." },
    { id: "Q", title: "Declaração Prévia de Contingência com Valor Divergente", desc: "Emitir documento fiscal em contingência com valor ou dados divergentes da declaração prévia enviada ao fisco." },
    { id: "R", title: "Omissões em Importação ou Exportação", desc: "Omitir informações ou documentos exigidos pelo fisco em operações de comércio exterior no contexto do IBS/CBS." },
    { id: "S", title: "Violações em Unidade de Carga", desc: "Violar lacres fiscais ou descumprir normas de fiscalização aplicáveis a unidades de carga (contêineres, paletes fiscalizados etc.)." },
    { id: "T", title: "Zona Franca de Manaus e Áreas de Livre Comércio", desc: "Descumprir obrigações específicas aplicáveis a empresas beneficiárias da ZFM ou das Áreas de Livre Comércio." },
  ];

  // Relevância personalizada baseada nos dados da empresa
  const highlightPdf = new Set<string>();
  if (data.erpSystem === "nenhum" || data.erpSystem === "planilha") { highlightPdf.add("D"); highlightPdf.add("G"); highlightPdf.add("J"); }
  if (data.hasRegularNF === "nao" || data.hasRegularNF === "parcialmente") { highlightPdf.add("J"); highlightPdf.add("O"); }
  if (data.hasNFErrors === "frequente" || data.hasNFErrors === "as_vezes") { highlightPdf.add("N"); highlightPdf.add("L"); }
  if (data.hasMarketplace === "sim") { highlightPdf.add("G"); highlightPdf.add("H"); highlightPdf.add("Q"); }
  if (data.hasImports === "sim" || data.hasImports === "ocasional" || data.hasExports === "sim") { highlightPdf.add("R"); }
  if (data.internalFiscalResponsible === "nao") { highlightPdf.add("A"); highlightPdf.add("B"); highlightPdf.add("C"); highlightPdf.add("D"); }

  categoriesData.forEach((cat) => {
    const isHL = highlightPdf.has(cat.id);
    checkBreak(20);
    doc.setFillColor(isHL ? 255 : 250, isHL ? 243 : 250, isHL ? 225 : 250);
    doc.roundedRect(margin, y, cw, 17, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
    doc.setTextColor(isHL ? 146 : 50, isHL ? 64 : 50, isHL ? 14 : 50);
    doc.text(`${cat.id}. ${cat.title}${isHL ? "  [ATENÇÃO - relevante para seu perfil]" : ""}`, margin + 3, y + 6);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(cat.desc, cw - 6);
    doc.text(lines, margin + 3, y + 11);
    y += 18 + (lines.length > 1 ? (lines.length - 1) * 3.5 : 0);
  });

  // Reduções de Penalidade
  y += 4;
  addSubSection("Hipóteses de Redução da Multa — Base: LC 214/2025, Capítulo IV");
  addParagraph("A LC 214/2025 prevê reduções de multa para contribuintes que regularizem voluntariamente sua situação. O momento da regularização é determinante para o benefício obtido:");

  const reducoes = [
    "Pagamento integral no prazo da impugnação — maior redução prevista na lei.",
    "Parcelamento no prazo da impugnação — redução menor que o pagamento integral.",
    "Pagamento antes da inscrição em Dívida Ativa — ainda possível, com redução menor.",
    "Parcelamento antes da inscrição em Dívida Ativa — regularização sem exposição judicial.",
    "Participação em programa de conformidade tributária ou boa conduta fiscal — quando cabível, pode ampliar a redução.",
  ];

  reducoes.forEach((r, i) => {
    checkBreak(9);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, y, cw, 7, 1, 1, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(22, 101, 52);
    doc.text(`${i + 1}. ${r}`, margin + 3, y + 5);
    y += 8;
  });

  y += 3;
  addParagraph("Os percentuais exatos de redução estão previstos no Capítulo IV da LC 214/2025. Consulte o texto oficial atualizado e seu contador antes de tomar qualquer decisão sobre pagamento ou parcelamento.");

  y += 6;
  addSubSection("Aviso Legal");
  addParagraph("Este diagnóstico é baseado nas informações fornecidas pela empresa e nas normas EC 132/2023, LC 214/2025 e LC 227/2026. Não substitui consultoria tributária e jurídica especializada. As alíquotas definitivas de IBS e CBS serão definidas pelo Comitê Gestor do IBS e dependem de regulamentação complementar — consulte seu contador para atualizações. Gerado em: " + new Date().toLocaleDateString("pt-BR") + ".");

  const filename = `REFORMA-EM-ACAO_${data.companyName.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30)}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
