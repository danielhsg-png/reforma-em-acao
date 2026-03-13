import jsPDF from "jspdf";

interface CompanyData {
  companyName: string;
  cnpj: string;
  sector: string;
  regime: string;
  operations: string;
  purchaseProfile: string;
  salesStates: string[];
  costStructure: string;
  riskScore: number;
  monthlyRevenue: string;
  employeeCount: string;
  profitMargin: string;
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
  specialRegimes: string[];
}

const LABELS: Record<string, Record<string, string>> = {
  sector: {
    industria: "Industria",
    atacado: "Comercio Atacadista",
    varejo: "Comercio Varejista",
    servicos: "Servicos",
    agronegocio: "Agronegocio",
    outros: "Outros Setores",
  },
  regime: {
    simples: "Simples Nacional",
    lucro_presumido: "Lucro Presumido",
    lucro_real: "Lucro Real",
  },
  operations: {
    b2b: "Empresas (B2B)",
    b2c: "Consumidor Final (B2C)",
    b2b_b2c: "Misto (B2B + B2C)",
  },
  purchaseProfile: {
    simples_suppliers: "Maioria do Simples Nacional",
    general_suppliers: "Maioria Lucro Real/Presumido",
    mixed_suppliers: "Mix equilibrado",
  },
  costStructure: {
    folha: "Folha de Pagamento",
    mercadorias: "Estoque / Mercadorias",
    logistica: "Logistica e Frete",
    tecnologia: "Tecnologia e Licencas",
    aluguel: "Aluguel / Ocupacao",
  },
  monthlyRevenue: {
    ate_50k: "Ate R$ 50 mil/mes",
    "50k_100k": "R$ 50 mil a R$ 100 mil/mes",
    "100k_500k": "R$ 100 mil a R$ 500 mil/mes",
    "500k_1m": "R$ 500 mil a R$ 1 milhao/mes",
    acima_1m: "Acima de R$ 1 milhao/mes",
  },
  employeeCount: {
    "1_10": "1 a 10 pessoas",
    "11_50": "11 a 50 pessoas",
    "51_200": "51 a 200 pessoas",
    acima_200: "Acima de 200 pessoas",
  },
  profitMargin: {
    ate_5: "Ate 5%",
    "5_10": "5% a 10%",
    "10_20": "10% a 20%",
    acima_20: "Acima de 20%",
  },
  erpSystem: {
    sap: "SAP / TOTVS / Oracle",
    medio_porte: "Bling / Omie / Tiny / Conta Azul",
    planilha: "Planilhas / Controle manual",
    nenhum: "Nao usa sistema de gestao",
    proprio: "Sistema proprio",
  },
  nfeEmission: {
    sistema_integrado: "Sistema integrado automatico",
    emissor_gratuito: "Emissor gratuito / portal SEFAZ",
    contador: "Contador faz tudo",
  },
  invoiceVolume: {
    ate_50: "Ate 50 notas/mes",
    ate_100: "50 a 100 notas/mes",
    ate_500: "100 a 500 notas/mes",
    acima_500: "Acima de 500 notas/mes",
  },
  supplierCount: {
    ate_10: "Ate 10 fornecedores",
    ate_20: "10 a 20 fornecedores",
    ate_50: "20 a 50 fornecedores",
    acima_50: "Acima de 50 fornecedores",
  },
  simplesSupplierPercent: {
    ate_30: "Menos de 30%",
    "30_60": "30% a 60%",
    acima_60: "Mais de 60%",
    nao_sei: "Nao informado",
  },
  taxResponsible: {
    contador_externo: "Escritorio de contabilidade externo",
    contador_interno: "Contador/analista interno",
    dono: "Dono/socio",
    ninguem: "Ninguem cuida especificamente",
  },
  splitPaymentAware: {
    sim_entendo: "Sim, entende como funciona",
    ouvi_falar: "Ja ouviu falar, mas nao entende bem",
    nao: "Nao conhece",
  },
};

function getLabel(field: string, value: string): string {
  return LABELS[field]?.[value] || value;
}

function getRiskLevel(score: number): string {
  if (score >= 80) return "CRITICO";
  if (score >= 60) return "ALTO";
  if (score >= 40) return "MODERADO";
  return "BAIXO";
}

function getRiskColor(score: number): [number, number, number] {
  if (score >= 80) return [220, 38, 38];
  if (score >= 60) return [234, 88, 12];
  if (score >= 40) return [202, 138, 4];
  return [22, 163, 74];
}

export function generateActionPlanPdf(data: CompanyData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  function checkPageBreak(needed: number) {
    if (y + needed > pageHeight - 25) {
      doc.addPage();
      y = 20;
      addFooter();
    }
  }

  function addFooter() {
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `REFORMA EM ACAO - Plano de Acao Personalizado | Pagina ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      "Este documento nao substitui consultoria tributaria e juridica especializada.",
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }

  function addSectionTitle(title: string) {
    checkPageBreak(20);
    y += 4;
    doc.setFillColor(30, 64, 175);
    doc.rect(margin, y, contentWidth, 9, "F");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), margin + 4, y + 6.5);
    y += 14;
    doc.setTextColor(30, 30, 30);
  }

  function addField(label: string, value: string) {
    checkPageBreak(10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(label + ":", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    const labelWidth = doc.getTextWidth(label + ": ");
    const lines = doc.splitTextToSize(value, contentWidth - labelWidth - 2);
    doc.text(lines, margin + labelWidth + 1, y);
    y += lines.length * 5 + 2;
  }

  function addParagraph(text: string, fontSize = 9) {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(lines.length * 5 + 4);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  }

  function addBullet(text: string) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    checkPageBreak(lines.length * 5 + 2);
    doc.text("•", margin + 2, y);
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 1;
  }

  // === COVER PAGE ===
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("REFORMA EM ACAO", pageWidth / 2, 30, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("Plano de Acao Personalizado para a Reforma Tributaria", pageWidth / 2, 42, { align: "center" });

  doc.setFontSize(9);
  doc.text("EC 132/2023 | LC 214/2025 | LC 227/2026", pageWidth / 2, 54, { align: "center" });

  doc.setFillColor(245, 245, 250);
  doc.rect(margin, 95, contentWidth, 45, "F");
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.rect(margin, 95, contentWidth, 45, "S");

  doc.setFontSize(18);
  doc.setTextColor(30, 64, 175);
  doc.setFont("helvetica", "bold");
  const companyNameLines = doc.splitTextToSize(data.companyName.toUpperCase(), contentWidth - 20);
  doc.text(companyNameLines, pageWidth / 2, 110, { align: "center" });

  if (data.cnpj) {
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.text(`CNPJ: ${data.cnpj}`, pageWidth / 2, 125, { align: "center" });
  }

  y = 155;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");

  const coverFields = [
    ["Setor", getLabel("sector", data.sector)],
    ["Regime Tributario", getLabel("regime", data.regime)],
    ["Faturamento", getLabel("monthlyRevenue", data.monthlyRevenue)],
    ["Colaboradores", getLabel("employeeCount", data.employeeCount)],
    ["Atuacao", data.salesStates.length > 0 ? data.salesStates.join(", ") : "Nacional"],
  ];

  coverFields.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin + 5, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 55, y);
    y += 7;
  });

  y += 10;
  const [rr, rg, rb] = getRiskColor(data.riskScore);
  doc.setFillColor(rr, rg, rb);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(
    `NIVEL DE RISCO: ${getRiskLevel(data.riskScore)} (${data.riskScore}/100)`,
    pageWidth / 2,
    y + 11,
    { align: "center" }
  );

  y += 30;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Relatorio gerado em ${new Date().toLocaleDateString("pt-BR")} as ${new Date().toLocaleTimeString("pt-BR")}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );

  addFooter();

  // === PAGE 2: PERFIL COMPLETO ===
  doc.addPage();
  y = 20;
  addFooter();

  addSectionTitle("1. Perfil Completo da Empresa");
  addField("Razao Social", data.companyName);
  if (data.cnpj) addField("CNPJ", data.cnpj);
  addField("Setor", getLabel("sector", data.sector));
  addField("Regime Tributario", getLabel("regime", data.regime));
  addField("Publico-alvo", getLabel("operations", data.operations));
  addField("Perfil de Compras", getLabel("purchaseProfile", data.purchaseProfile));
  addField("Faturamento Mensal", getLabel("monthlyRevenue", data.monthlyRevenue));
  addField("Colaboradores", getLabel("employeeCount", data.employeeCount));
  addField("Margem de Lucro", getLabel("profitMargin", data.profitMargin));
  addField("Maior Custo", getLabel("costStructure", data.costStructure));
  addField("Estados de Atuacao", data.salesStates.length > 0 ? data.salesStates.join(", ") : "Nao informado");
  addField("Sistema ERP", getLabel("erpSystem", data.erpSystem));
  addField("Emissao NF-e", getLabel("nfeEmission", data.nfeEmission));
  addField("Volume de Notas", getLabel("invoiceVolume", data.invoiceVolume));
  addField("Qtd. Fornecedores", getLabel("supplierCount", data.supplierCount));
  addField("% Fornecedores Simples", getLabel("simplesSupplierPercent", data.simplesSupplierPercent));
  addField("Contratos Longo Prazo", data.hasLongTermContracts === "sim" ? "Sim" : "Nao");
  if (data.hasLongTermContracts === "sim") {
    addField("Clausula de Revisao", data.priceRevisionClause === "sim" ? "Sim" : data.priceRevisionClause === "nao" ? "Nao" : "Nao sabe");
  }
  addField("Responsavel Fiscal", getLabel("taxResponsible", data.taxResponsible));
  addField("Conhece Split Payment", getLabel("splitPaymentAware", data.splitPaymentAware));

  if (data.specialRegimes && data.specialRegimes.length > 0) {
    addField("Regimes Especiais", data.specialRegimes.length + " regime(s) aplicavel(is)");
    const regimeLabels: Record<string, string> = {
      saude_servicos: "Servicos de Saude (60% reducao)",
      saude_dispositivos: "Dispositivos Medicos (60% reducao)",
      saude_medicamentos: "Medicamentos (60% reducao / zero CMED)",
      educacao: "Educacao (60% reducao)",
      cesta_basica: "Cesta Basica Nacional (aliquota zero)",
      alimentos_reduzidos: "Alimentos com Reducao (60%)",
      agro_insumos: "Insumos Agropecuarios (60% reducao)",
      transporte_coletivo: "Transporte Coletivo (60% reducao)",
      profissional_liberal: "Profissional Liberal (30% reducao)",
      imobiliario: "Operacoes Imobiliarias (regime especifico)",
      combustiveis: "Combustiveis (monofasico)",
      financeiro: "Servicos Financeiros (regime cumulativo)",
      cooperativa: "Cooperativas (regime especial)",
      zfm: "Zona Franca de Manaus (beneficios mantidos)",
      hotelaria_turismo: "Hotelaria e Turismo (60% reducao)",
      higiene_limpeza: "Higiene e Limpeza (60% reducao)",
      cultura: "Cultura e Arte (60% reducao / zero livros)",
      seguranca_nacional: "Seguranca Nacional (reducao especifica)",
      seletivo_bebidas: "Bebidas Alcoolicas/Acucaradas (IS adicional)",
      seletivo_tabaco: "Tabaco (IS adicional)",
      seletivo_veiculos: "Veiculos/Embarcacoes (IS adicional)",
      seletivo_minerio: "Mineracao (IS 0,25% a 1%)",
    };
    data.specialRegimes.forEach((r) => {
      addBullet(regimeLabels[r] || r);
    });
  }

  // === SECTION 2: O QUE MUDA ===
  addSectionTitle("2. O Que Muda com a Reforma Tributaria");
  addParagraph("A Reforma Tributaria (EC 132/2023, regulamentada pela LC 214/2025 e LC 227/2026) extingue cinco tributos (PIS, COFINS, IPI, ICMS e ISS) e cria dois novos: o IBS (Imposto sobre Bens e Servicos, subnacional) e a CBS (Contribuicao sobre Bens e Servicos, federal). Juntos, formam o IVA Dual com aliquota-referencia estimada de 26,5%.");
  addParagraph("Principais mudancas operacionais:");
  addBullet("Principio do Destino: o imposto e recolhido no estado do consumidor, nao do produtor.");
  addBullet("Nao-Cumulatividade Plena: creditos amplos em toda a cadeia, exceto itens de uso pessoal.");
  addBullet("Split Payment: retencao automatica do imposto na liquidacao financeira (cartao, PIX, boleto).");
  addBullet("Cashback: devolucao de tributo para familias de baixa renda em itens essenciais.");
  addBullet("Transicao de 2026 a 2033: aliquotas-teste em 2026-2027, aumento gradual ate 2033.");

  // === SECTION 3: IMPACTO NO SETOR ===
  addSectionTitle(`3. Impacto Especifico: ${getLabel("sector", data.sector)}`);

  if (data.sector === "industria") {
    addParagraph("A industria e um dos setores mais beneficiados pela reforma. A nao-cumulatividade plena permite credito em praticamente todos os insumos, incluindo energia, logistica e bens de capital. No entanto, a transicao exige adaptacao completa de sistemas fiscais e renegociacao com fornecedores do Simples Nacional.");
  } else if (data.sector === "servicos") {
    addParagraph("O setor de servicos enfrenta o maior impacto negativo. Hoje, o ISS varia de 2% a 5%. Com o IVA Dual de 26,5%, mesmo com creditos, a carga efetiva pode subir significativamente, especialmente para empresas intensivas em mao de obra (que nao gera credito). A revisao de precos e urgente.");
  } else if (data.sector === "varejo") {
    addParagraph("O varejo sera diretamente impactado pelo Split Payment, que retira o imposto na fonte em transacoes com cartao e PIX. Isso muda o fluxo de caixa: o lojista recebe o valor liquido. A gestao de creditos de fornecedores e a precificacao correta se tornam essenciais para manter a margem.");
  } else if (data.sector === "atacado") {
    addParagraph("O atacado distribuidor precisa se adaptar a transparencia total de precos. Clientes B2B vao exigir destaque de IBS/CBS na nota para aproveitamento de creditos. A reclassificacao de fornecedores e a gestao de aliquotas por estado de destino sao prioridades imediatas.");
  } else if (data.sector === "agronegocio") {
    addParagraph("O agronegocio tera regras especificas. Produtores rurais PF com faturamento ate R$ 3,6 milhoes/ano podem optar por contribuinte especial com credito presumido. Cooperativas mantem regime diferenciado. A cadeia agroindustrial precisa mapear quais insumos geram credito efetivo.");
  } else {
    addParagraph("Seu setor tera impactos variados conforme a composicao de custos e o perfil de clientes. A analise deve considerar o peso da mao de obra (sem credito), a origem dos insumos e a presenca de operacoes interestaduais.");
  }

  // === SECTION 4: DIAGNOSTICO DE RISCO ===
  addSectionTitle("4. Diagnostico de Risco");

  const riskLevel = getRiskLevel(data.riskScore);
  addParagraph(`Nivel de Risco Calculado: ${riskLevel} (${data.riskScore}/100)`);
  addParagraph("O diagnostico considera 6 indicadores criticos:");

  const risks: string[] = [];
  if (data.costStructure === "folha") risks.push("ALTO RISCO: Maior custo e Folha de Pagamento, que nao gera credito de IBS/CBS. Impacto direto na margem.");
  if (data.purchaseProfile === "simples_suppliers") risks.push("RISCO MODERADO: Maioria dos fornecedores e do Simples Nacional, gerando creditos limitados.");
  if (data.regime === "lucro_presumido") risks.push("ATENCAO: Lucro Presumido sera extinto. Transicao para nao-cumulatividade plena exige controles novos.");
  if (data.sector === "servicos") risks.push("CRITICO: Setor de servicos com potencial aumento significativo de carga tributaria (de ISS 2-5% para IVA 26,5%).");
  if (data.erpSystem === "nenhum" || data.erpSystem === "planilha") risks.push("ALTO RISCO: Sem sistema de gestao integrado. A NF-e com campos IBS/CBS exigira automacao.");
  if (data.hasLongTermContracts === "sim" && data.priceRevisionClause === "nao") risks.push("CRITICO: Contratos de longo prazo SEM clausula de revisao tributaria. Risco de absorver aumento de carga.");
  if (data.splitPaymentAware === "nao") risks.push("ATENCAO: Desconhecimento do Split Payment. Impacto direto no fluxo de caixa a partir de 2026.");
  if (data.salesStates.length > 5) risks.push(`MODERADO: Operacao em ${data.salesStates.length} estados exige gestao de obrigacoes acessorias em multiplas jurisdicoes.`);

  if (risks.length === 0) {
    addBullet("Perfil de risco dentro da media. Manter acompanhamento das publicacoes regulamentares.");
  } else {
    risks.forEach((r) => addBullet(r));
  }

  // === SECTION 5: IMPACTO FINANCEIRO ===
  addSectionTitle("5. Analise de Impacto Financeiro");
  addParagraph("A nova sistematica do IVA Dual (IBS + CBS) altera fundamentalmente o calculo de tributos sobre consumo. A aliquota-referencia de 26,5% incide sobre o preco de venda, mas com direito a creditos amplos sobre todas as aquisicoes tributadas.");
  
  if (data.costStructure === "folha") {
    addParagraph("ALERTA: Como seu maior custo e Folha de Pagamento, sua empresa tem exposicao elevada. Salarios, encargos e beneficios NAO geram credito de IBS/CBS. Recomenda-se simulacao detalhada no modulo Simulador Financeiro do aplicativo para quantificar o impacto real na margem.");
  } else {
    addParagraph(`Seu maior custo operacional (${getLabel("costStructure", data.costStructure)}) e passivel de geracao de credito no novo sistema, o que pode amenizar o impacto da aliquota de 26,5%. Utilize o Simulador Financeiro do aplicativo para projetar cenarios.`);
  }

  if (data.profitMargin === "ate_5" || data.profitMargin === "5_10") {
    addParagraph("ATENCAO CRITICA: Sua margem de lucro e inferior a 10%. Qualquer aumento de carga tributaria liquida pode comprometer a viabilidade do negocio. A recalibracao de precos e prioridade maxima.");
  }

  // === SECTION 6: GESTAO DE SISTEMAS ===
  addSectionTitle("6. Gestao de Sistemas e NF-e");
  addField("Sistema atual", getLabel("erpSystem", data.erpSystem));
  addField("Emissao de NF-e", getLabel("nfeEmission", data.nfeEmission));
  addField("Volume mensal", getLabel("invoiceVolume", data.invoiceVolume));
  y += 3;
  addParagraph("Acoes recomendadas para sistemas:");
  addBullet("Verificar com o fornecedor de ERP/sistema se ha plano de atualizacao para incluir campos de IBS e CBS na NF-e.");
  addBullet("Confirmar se o sistema suporta calculo de aliquota por estado de destino (principio do destino).");
  addBullet("Testar a emissao de NF-e com os novos campos em ambiente de homologacao (quando disponivel pela SEFAZ).");
  if (data.erpSystem === "nenhum" || data.erpSystem === "planilha") {
    addBullet("URGENTE: Considerar a adocao de um sistema de gestao integrado (ERP). O controle manual nao suportara a complexidade do novo regime.");
  }

  // === SECTION 7: CADEIA DE FORNECEDORES ===
  addSectionTitle("7. Cadeia de Fornecedores");
  addField("Fornecedores ativos", getLabel("supplierCount", data.supplierCount));
  addField("% Simples Nacional", getLabel("simplesSupplierPercent", data.simplesSupplierPercent));
  y += 3;
  addParagraph("Metodologia de classificacao A/B/C recomendada:");
  addBullet("CLASSE A (Lucro Real/Presumido, com NF-e): Gera credito integral de 26,5%. Manter e priorizar.");
  addBullet("CLASSE B (Simples Nacional optante IBS/CBS fora do DAS): Gera credito parcial. Negociar transparencia.");
  addBullet("CLASSE C (Simples sem opcao / informais): Credito minimo ou zero. Avaliar substituicao ou renegociacao de preco.");

  if (data.simplesSupplierPercent === "acima_60") {
    addParagraph("ALERTA: Mais de 60% dos seus fornecedores sao do Simples Nacional. Isso significa que a maioria dos seus creditos de IBS/CBS sera pela aliquota efetiva (4-8%), nao pela aliquota cheia de 26,5%. Impacto significativo no custo final.");
  }

  // === SECTION 8: ESTRATEGIA DE PRECIFICACAO ===
  addSectionTitle("8. Estrategia de Precificacao");
  addField("Publico principal", getLabel("operations", data.operations));
  y += 3;

  if (data.operations === "b2b" || data.operations === "b2b_b2c") {
    addParagraph("Para vendas B2B:");
    addBullet("O cliente empresarial se apropria do credito de IBS/CBS. Trabalhe com preco liquido (sem imposto) nas negociacoes.");
    addBullet("Destaque o valor do credito gerado na proposta comercial. Isso e argumento de venda.");
    addBullet("Revise tabelas de preco para explicitar: Preco Liquido + IBS/CBS = Preco Bruto.");
  }

  if (data.operations === "b2c" || data.operations === "b2b_b2c") {
    addParagraph("Para vendas B2C:");
    addBullet("O consumidor final nao aproveita credito. O preco final inclui 26,5% de IVA Dual visivel na nota.");
    addBullet("O Split Payment retira o imposto na fonte (cartao/PIX). Voce recebe o valor liquido.");
    addBullet("Simule o preco final com e sem os creditos de insumos para definir a margem real.");
  }

  // === SECTION 9: ROTINAS SEMANAIS ===
  addSectionTitle("9. Rotinas Semanais Recomendadas");
  addParagraph("Implemente estas rotinas para manter o controle durante a transicao:");
  addBullet("Segunda: Conferencia de NF-e emitidas na semana anterior. Verificar se campos IBS/CBS estao corretos.");
  addBullet("Terca: Revisao de cadastro de fornecedores. Atualizar classificacao A/B/C conforme novas informacoes.");
  addBullet("Quarta: Analise de margem por produto/servico. Comparar preco praticado vs. custo + novo tributo.");
  addBullet("Quinta: Reuniao com contador/assessor. Pautar pendencias de obrigacoes acessorias e atualizacoes normativas.");
  addBullet("Sexta: Revisao do cronograma de implementacao. Atualizar status das tarefas da semana.");

  // === SECTION 10: CRONOGRAMA 51 DIAS ===
  addSectionTitle("10. Cronograma de Implementacao (51 Dias)");

  const phases = [
    {
      name: "FASE 1 - DIAGNOSTICO (Dias 1-10)",
      tasks: [
        "Mapear todos os tributos atuais (PIS, COFINS, ICMS, ISS, IPI) com valores mensais",
        "Listar os Top 30 produtos/servicos por faturamento e identificar NCM/NBS",
        "Classificar os Top 20 fornecedores na matriz A/B/C",
        "Solicitar ao ERP/sistema o plano de atualizacao para IBS/CBS",
      ],
    },
    {
      name: "FASE 2 - SIMULACAO (Dias 11-20)",
      tasks: [
        "Executar simulacao financeira: debito IVA Dual vs. creditos projetados",
        "Calcular impacto na margem por produto/servico principal",
        "Simular cenarios de preco (repasse integral, parcial, absorcao)",
        "Avaliar impacto do Split Payment no fluxo de caixa",
      ],
    },
    {
      name: "FASE 3 - ADAPTACAO (Dias 21-35)",
      tasks: [
        "Definir novas tabelas de preco (B2B: preco liquido + IBS/CBS / B2C: preco cheio)",
        "Negociar com fornecedores Classe C (Simples/informais): preco ou substituicao",
        "Revisar contratos de longo prazo e incluir clausula de reequilibrio tributario",
        "Configurar sistema para emissao com campos IBS e CBS (homologacao)",
        "Treinar equipe fiscal e comercial sobre nova mecanica",
      ],
    },
    {
      name: "FASE 4 - VALIDACAO (Dias 36-45)",
      tasks: [
        "Emitir NF-e teste com novos campos em ambiente de homologacao",
        "Validar calculo de creditos com a contabilidade",
        "Testar conciliacao de pagamentos com Split Payment simulado",
        "Apresentar impacto financeiro ao dono/conselho com recomendacoes",
      ],
    },
    {
      name: "FASE 5 - GO-LIVE (Dias 46-51)",
      tasks: [
        "Ativar novas tabelas de preco em producao",
        "Iniciar rotinas semanais de conferencia e controle",
        "Definir indicadores de acompanhamento (margem, creditos, inadimplencia)",
        "Agendar revisao mensal com contador e assessor juridico",
      ],
    },
  ];

  phases.forEach((phase) => {
    checkPageBreak(30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(phase.name, margin, y);
    y += 6;
    doc.setTextColor(50, 50, 50);
    phase.tasks.forEach((task) => {
      addBullet(task);
    });
    y += 3;
  });

  // === SECTION 11: CHECKLIST FINAL ===
  addSectionTitle("11. Checklist Final do Dono");
  addParagraph("Valide estes 9 indicadores criticos antes de considerar sua empresa preparada:");

  const checklistQuestions = [
    "O sistema tem plano IBS/CBS para 2026?",
    "O responsavel por cadastro/emissao/conferencia esta definido?",
    "O mapeamento das Top 30 mercadorias esta pronto?",
    "A classificacao (A/B/C) dos Top 20 fornecedores esta pronta?",
    "O padrao de cadastro esta ativo?",
    "A rotina semanal de conferencia esta rodando?",
    "As regras de preco e desconto estao definidas?",
    "A conciliacao por canal esta ativa?",
    "A prioridade numero 1 dos proximos 14 dias esta definida?",
  ];

  checklistQuestions.forEach((q, i) => {
    checkPageBreak(8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`[ ] ${i + 1}. ${q}`, margin + 2, y);
    y += 6;
  });

  // === DISCLAIMER ===
  checkPageBreak(40);
  y += 5;
  addSectionTitle("Aviso Legal");
  addParagraph("Este relatorio foi gerado pelo aplicativo REFORMA EM ACAO com base nas informacoes fornecidas pelo usuario e na legislacao vigente (EC 132/2023, LC 214/2025, LC 227/2026, Notas Tecnicas da RFB e diretrizes do Comite Gestor do IBS).");
  addParagraph("As informacoes e recomendacoes contidas neste documento NAO SUBSTITUEM: (i) validacao tecnica do seu contador ou auditor; (ii) analise juridica de contratos por advogado tributarista; (iii) testes de integracao com seu fornecedor de sistema; (iv) consulta especifica sobre seu regime tributario e setor.");
  addParagraph("Use este relatorio como base para uma conversa com seus assessores. A implementacao exige alinhamento tecnico-juridico-contabil-operacional.");

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `REFORMA EM ACAO - Plano de Acao | ${data.companyName} | Pagina ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      "Este documento nao substitui consultoria tributaria e juridica especializada.",
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }

  const sanitizedName = data.companyName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
  doc.save(`Reforma_Em_Acao_${sanitizedName}.pdf`);
}
