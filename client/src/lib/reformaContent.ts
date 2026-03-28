export interface ReformaArticle {
  id: string;
  title: string;
  summary: string;
  category: 'fundamentos' | 'operacoes' | 'setores' | 'regimes' | 'contratos' | 'planejamento';
  categoryLabel: string;
  tags: string[];
  icon: string;
  difficulty: 'basico' | 'intermediario' | 'avancado';
  readTime: number;
  lawBasis: string[];
  featured: boolean;
  sections: {
    oquedizalei: string;
    oquemudata: string;
    oquefarzer: string;
    baseLegal: string;
  };
  relatedArticles: string[];
  planActionIds: string[];
}

export const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  fundamentos:  { label: 'Fundamentos',             color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  operacoes:    { label: 'Operações e Tecnologia',   color: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
  setores:      { label: 'Setores da Economia',      color: 'bg-green-500/20 text-green-300 border border-green-500/30' },
  regimes:      { label: 'Regimes Tributários',      color: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  contratos:    { label: 'Contratos e Preços',       color: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' },
  planejamento: { label: 'Planejamento e Adequação', color: 'bg-red-500/20 text-red-300 border border-red-500/30' },
};

export const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  basico:        { label: 'Básico',         color: 'bg-green-500/20 text-green-300' },
  intermediario: { label: 'Intermediário',  color: 'bg-yellow-500/20 text-yellow-300' },
  avancado:      { label: 'Avançado',       color: 'bg-red-500/20 text-red-300' },
};

export const reformaArticles: ReformaArticle[] = [
  {
    id: "ibs-cbs-o-que-sao",
    title: "IBS e CBS: o que são e como substituem os tributos atuais",
    summary: "O coração da Reforma Tributária é a criação de dois novos tributos sobre o consumo — IBS e CBS — que substituem cinco tributos existentes. Entenda a lógica do novo sistema e o que muda no dia a dia da sua empresa.",
    category: "fundamentos",
    categoryLabel: "Fundamentos",
    tags: ["IBS", "CBS", "ICMS", "ISS", "PIS", "COFINS", "IPI", "consumo"],
    icon: "Layers",
    difficulty: "basico",
    readTime: 5,
    lawBasis: ["EC 132/2023", "LC 214/2025"],
    featured: true,
    sections: {
      oquedizalei: "A EC 132/2023 cria o IBS (Imposto sobre Bens e Serviços) de competência dos estados e municípios, e a CBS (Contribuição sobre Bens e Serviços) de competência federal. Juntos, substituem o ICMS, ISS, PIS, COFINS e IPI ao longo do período de transição de 2026 a 2033.",
      oquemudata: "Toda a empresa que hoje apura ICMS, ISS, PIS ou COFINS passará a apurar IBS e CBS. O cálculo muda: a alíquota passa a incidir sobre o valor total da operação (por fora), não mais embutida no preço. A não-cumulatividade é plena — créditos são permitidos em praticamente toda a cadeia.",
      oquefarzer: "Confirme com seu contador como o IBS e CBS afetarão seu regime atual. Verifique se seu ERP já tem roadmap de atualização para os novos campos. Recalcule preços considerando que a alíquota passará a ser visível por fora do valor do produto.",
      baseLegal: "EC 132/2023 (art. 156-A a 195-B); LC 214/2025 (regulamentação do IBS e CBS); período de transição definido nos arts. 120 a 133 do ADCT."
    },
    relatedArticles: ["split-payment", "nao-cumulatividade", "cronograma-transicao"],
    planActionIds: ["erp_contact", "catalog_std", "nfe_test"]
  },
  {
    id: "split-payment",
    title: "Split Payment: como funciona a retenção automática do imposto",
    summary: "O Split Payment é o mecanismo pelo qual o imposto é retido diretamente na liquidação financeira da venda, antes de o valor chegar à sua conta. Entenda o impacto no fluxo de caixa e como se preparar.",
    category: "fundamentos",
    categoryLabel: "Fundamentos",
    tags: ["Split Payment", "fluxo de caixa", "PIX", "cartão", "boleto", "caixa"],
    icon: "CreditCard",
    difficulty: "intermediario",
    readTime: 6,
    lawBasis: ["LC 227/2026"],
    featured: true,
    sections: {
      oquedizalei: "A LC 227/2026 institui o Split Payment como mecanismo estruturante do novo sistema. O imposto (IBS + CBS) é retido automaticamente pelo agente financeiro no momento da liquidação do pagamento, antes de o valor líquido ser repassado ao vendedor.",
      oquemudata: "Em transações com cartão, PIX e meios digitais, sua empresa passará a receber apenas o valor líquido (sem o imposto). O imposto vai diretamente ao Comitê Gestor e à Receita Federal. Isso reduz o valor disponível imediatamente após a venda e exige maior capital de giro.",
      oquefarzer: "Projete o impacto no seu fluxo de caixa para cada meio de pagamento que você aceita. Revise limites de crédito junto ao banco. Ajuste o planejamento financeiro para operar sem o imposto como 'reserva temporária' de caixa. Consulte seu contador sobre o cronograma de implementação por meio de pagamento.",
      baseLegal: "LC 227/2026; Resolução do Comitê Gestor do IBS (a ser publicada com cronograma por meio de pagamento)."
    },
    relatedArticles: ["ibs-cbs-o-que-sao", "capital-de-giro", "cronograma-transicao"],
    planActionIds: ["split_simulation"]
  },
  {
    id: "nao-cumulatividade",
    title: "Não-cumulatividade plena: o que pode e o que não pode ser creditado",
    summary: "A Reforma cria a não-cumulatividade ampla do IBS/CBS, mas com restrições específicas. Saiba o que sua empresa pode creditar e o que fica de fora — como despesas pessoais e determinados bens de luxo.",
    category: "fundamentos",
    categoryLabel: "Fundamentos",
    tags: ["crédito", "não-cumulatividade", "insumos", "IBS", "CBS", "aproveitamento"],
    icon: "Percent",
    difficulty: "intermediario",
    readTime: 7,
    lawBasis: ["LC 214/2025"],
    featured: true,
    sections: {
      oquedizalei: "A LC 214/2025 garante crédito amplo de IBS e CBS sobre praticamente todos os insumos, bens de capital, energia elétrica, aluguel de imóveis e serviços utilizados na atividade econômica. Exceções incluem bens e serviços de uso pessoal, operações isentas e situações específicas definidas em regulamento.",
      oquemudata: "Empresas do regime regular poderão creditar muito mais do que hoje (com PIS/COFINS não-cumulativo restrito e sem crédito de ICMS em diversas situações). A cadeia de fornecedores passa a ter peso maior: comprar de quem emite NF corretamente e está no regime regular traz mais crédito.",
      oquefarzer: "Mapeie todos os insumos relevantes da sua operação e confirme com o contador quais geram crédito no novo regime. Revise sua cadeia de fornecedores priorizando quem emite NF corretamente. Verifique se itens hoje sem crédito (como energia elétrica industrial) passarão a gerar crédito.",
      baseLegal: "LC 214/2025, arts. 28 a 58 (IBS) e arts. 85 a 115 (CBS)."
    },
    relatedArticles: ["ibs-cbs-o-que-sao", "fornecedores-simples", "simples-nacional"],
    planActionIds: ["supplier_abc", "catalog_std"]
  },
  {
    id: "cronograma-transicao",
    title: "Cronograma de transição 2026–2033: o que muda em cada ano",
    summary: "A Reforma não acontece de uma vez. Há um período de convivência entre os tributos antigos e os novos que vai até 2033. Veja o que cada ano significa para sua empresa.",
    category: "fundamentos",
    categoryLabel: "Fundamentos",
    tags: ["cronograma", "transição", "2026", "2027", "2033", "ICMS", "ISS"],
    icon: "Calendar",
    difficulty: "basico",
    readTime: 5,
    lawBasis: ["EC 132/2023", "LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "A transição ocorre de 2026 a 2033. Em 2026–2027: período de teste com alíquotas reduzidas de IBS/CBS coexistindo com ICMS/ISS/PIS/COFINS. De 2029 a 2032: redução progressiva das alíquotas de ICMS e ISS com aumento proporcional de IBS/CBS. Em 2033: extinção completa dos tributos antigos e vigência plena do novo sistema.",
      oquemudata: "Sua empresa vai apurar e pagar dois sistemas simultaneamente durante o período de transição. Isso aumenta a complexidade fiscal temporariamente. Os benefícios fiscais de ICMS existentes são gradualmente extintos. O imposto sobre serviços (ISS) vai sendo substituído pelo IBS com alíquota que pode ser diferente.",
      oquefarzer: "Crie um calendário interno com os marcos de cada ano. Avalie seus benefícios fiscais de ICMS e quando eles serão extintos. Confirme com seu ERP quando cada etapa da transição será implementada no sistema. Estabeleça rotina de monitoramento mensal com seu contador.",
      baseLegal: "ADCT, arts. 120 a 133 (incluídos pela EC 132/2023); LC 214/2025, Título VII."
    },
    relatedArticles: ["ibs-cbs-o-que-sao", "split-payment", "erp-adaptacao"],
    planActionIds: ["final_validation", "governance_setup"]
  },
  {
    id: "erp-adaptacao",
    title: "ERP e sistemas fiscais: o que precisa ser atualizado",
    summary: "A NF-e passará a exigir novos campos obrigatórios de IBS e CBS. Seu sistema de gestão precisa estar atualizado antes dos primeiros vencimentos. Veja o que cobrar do seu fornecedor.",
    category: "operacoes",
    categoryLabel: "Operações e Tecnologia",
    tags: ["ERP", "NF-e", "sistema", "fiscal", "tecnologia", "atualização"],
    icon: "FileCheck",
    difficulty: "intermediario",
    readTime: 5,
    lawBasis: ["LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "A LC 214/2025 define os campos obrigatórios de IBS e CBS nos documentos fiscais eletrônicos (NF-e, NFC-e, CT-e). Os layouts serão atualizados pela SEFAZ Nacional e os emissores terão prazo para homologação antes da entrada em vigor plena.",
      oquemudata: "Todo sistema emissor de nota fiscal precisará ser atualizado. Emissores que não estiverem adaptados não conseguirão emitir NF-e válida a partir das datas definidas pela SEFAZ. Empresas com ERP desatualizado correm risco de paralisação operacional.",
      oquefarzer: "Contate seu fornecedor de ERP e exija por escrito: (1) qual versão suportará IBS/CBS; (2) qual o prazo de entrega; (3) se há custo adicional. Se não obtiver resposta satisfatória, avalie migração para outro sistema. Teste o novo layout em ambiente de homologação antes da data de corte.",
      baseLegal: "LC 214/2025; Nota Técnica da SEFAZ Nacional (consulte o site da SEFAZ do seu estado para versão atualizada do layout de NF-e)."
    },
    relatedArticles: ["ibs-cbs-o-que-sao", "cronograma-transicao", "cadastro-ncm"],
    planActionIds: ["erp_contact", "erp_adoption", "nfe_test"]
  },
  {
    id: "cadastro-ncm",
    title: "NCM e NBS: por que o cadastro correto de produtos define sua alíquota",
    summary: "A alíquota de IBS e CBS varia por produto e serviço de acordo com o NCM (mercadorias) ou NBS (serviços). Um cadastro errado significa alíquota errada — e risco de autuação.",
    category: "operacoes",
    categoryLabel: "Operações e Tecnologia",
    tags: ["NCM", "NBS", "classificação", "alíquota", "cadastro", "produto"],
    icon: "FileText",
    difficulty: "intermediario",
    readTime: 6,
    lawBasis: ["LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "A LC 214/2025 vincula as alíquotas de IBS e CBS ao código NCM (para mercadorias) ou NBS (para serviços). Produtos da cesta básica, saúde e educação têm alíquotas reduzidas ou zero. Produtos sujeitos ao Imposto Seletivo têm carga adicional. A classificação correta é obrigatória.",
      oquemudata: "Cada produto e serviço precisará estar classificado corretamente no sistema. Um erro de NCM pode significar cobrança a maior (perda de competitividade) ou a menor (autuação futura). Empresas com centenas de SKUs precisarão de uma auditoria sistemática.",
      oquefarzer: "Faça uma lista dos seus 30 principais produtos/serviços por faturamento. Para cada um, confirme o NCM ou NBS com seu contador. Identifique quais se enquadram em redução de alíquota (cesta básica, saúde, educação). Atualize o cadastro no ERP e documente a fonte da classificação.",
      baseLegal: "LC 214/2025, Anexos I a IV (tabelas de alíquotas por NCM/NBS); Decreto de NCM (Decreto nº 11.158/2022 e atualizações)."
    },
    relatedArticles: ["erp-adaptacao", "cesta-basica", "ibs-cbs-o-que-sao"],
    planActionIds: ["top30_items", "catalog_std"]
  },
  {
    id: "fornecedores-simples",
    title: "Fornecedores do Simples Nacional: impacto nos seus créditos de IBS/CBS",
    summary: "Comprar de fornecedores no Simples Nacional pode limitar os créditos de IBS/CBS que sua empresa pode aproveitar. Entenda a mecânica e saiba como avaliar sua cadeia de compras.",
    category: "operacoes",
    categoryLabel: "Operações e Tecnologia",
    tags: ["Simples Nacional", "fornecedor", "crédito", "IBS", "CBS", "regime regular"],
    icon: "ShoppingCart",
    difficulty: "intermediario",
    readTime: 6,
    lawBasis: ["LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "A LC 214/2025 permite que empresas do Simples Nacional optem por recolher o IBS/CBS pelo regime regular, garantindo crédito pleno ao adquirente. Para quem não optar, o crédito transferido ao comprador pode ser menor. A decisão de optar é voluntária e deve ser formalizada.",
      oquemudata: "Se você compra muito de fornecedores no Simples que não optarem pelo regime regular, seus créditos de IBS/CBS nas compras serão menores do que se comprasse de fornecedores do regime regular. Isso aumenta seu custo efetivo de aquisição. O impacto varia com o volume de compra de cada fornecedor.",
      oquefarzer: "Mapeie seus 10–20 principais fornecedores e identifique o regime tributário de cada um. Pergunte diretamente aos fornecedores do Simples se vão optar pelo regime regular de IBS/CBS. Para os que não optarem, negocie desconto ou busque alternativas. Classifique fornecedores em A (regime regular), B (Simples com opção) e C (Simples sem opção).",
      baseLegal: "LC 214/2025, arts. 14 a 20 (opção do Simples pelo regime regular de IBS/CBS)."
    },
    relatedArticles: ["simples-nacional", "nao-cumulatividade", "ibs-cbs-o-que-sao"],
    planActionIds: ["supplier_abc", "simples_option"]
  },
  {
    id: "simples-nacional",
    title: "Simples Nacional na Reforma: o que muda para MEI, ME e EPP",
    summary: "O Simples Nacional não é extinto, mas muda de forma relevante. Empresas do Simples que vendem para outras empresas (B2B) têm uma decisão importante a tomar sobre o recolhimento de IBS/CBS.",
    category: "regimes",
    categoryLabel: "Regimes Tributários",
    tags: ["Simples Nacional", "MEI", "ME", "EPP", "DAS", "B2B", "regime regular"],
    icon: "PieChart",
    difficulty: "intermediario",
    readTime: 7,
    lawBasis: ["LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "O Simples Nacional continua existindo. A LC 214/2025 permite que empresas optantes pelo Simples escolham recolher o IBS e a CBS pelo regime regular (fora do DAS), para que seus clientes B2B possam aproveitar crédito pleno. Essa opção é facultativa e tem impacto direto na competitividade comercial.",
      oquemudata: "Empresas do Simples que vendem para outras empresas (B2B) e não optarem pelo regime regular de IBS/CBS podem perder competitividade, pois seus clientes terão crédito menor (ou nenhum) sobre as compras feitas com elas. Empresas que vendem só para consumidor final (B2C) são menos afetadas por essa decisão.",
      oquefarzer: "Se você vende para empresas (B2B), consulte urgentemente seu contador sobre a conveniência de optar pelo regime regular de IBS/CBS. Calcule: (1) o custo adicional de recolher fora do DAS; (2) o ganho competitivo pela transferência de crédito pleno ao cliente. A decisão deve ser tomada antes de 2026.",
      baseLegal: "LC 214/2025, arts. 14 a 20; LC 123/2006 (atualizada pela EC 132/2023)."
    },
    relatedArticles: ["fornecedores-simples", "ibs-cbs-o-que-sao", "cronograma-transicao"],
    planActionIds: ["simples_option"]
  },
  {
    id: "lucro-presumido",
    title: "Lucro Presumido: como a reforma afeta quem usa esse regime",
    summary: "Empresas do Lucro Presumido hoje recolhem PIS/COFINS cumulativos. Com a Reforma, migram para IBS/CBS com não-cumulatividade plena — o que pode ser uma vantagem, mas exige adaptação.",
    category: "regimes",
    categoryLabel: "Regimes Tributários",
    tags: ["Lucro Presumido", "PIS", "COFINS", "cumulativo", "não-cumulativo", "IBS", "CBS"],
    icon: "TrendingUp",
    difficulty: "intermediario",
    readTime: 6,
    lawBasis: ["LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "Empresas do Lucro Presumido hoje recolhem PIS (0,65%) e COFINS (3%) de forma cumulativa, sem direito a créditos. Com a Reforma, o IBS e a CBS substituem esses tributos e o ICMS/ISS, adotando a não-cumulatividade plena. O regime de IRPJ/CSLL (Lucro Presumido) não é alterado pela Reforma.",
      oquemudata: "Na prática, empresas do Lucro Presumido passarão a ter direito a crédito de IBS/CBS sobre seus insumos — o que hoje não ocorre com o PIS/COFINS cumulativo. A alíquota total de IBS+CBS tende a ser maior do que o PIS+COFINS atual, mas o crédito pode compensar dependendo da estrutura de custos.",
      oquefarzer: "Peça ao seu contador uma simulação comparativa: carga atual de PIS/COFINS+ICMS/ISS vs. carga futura de IBS/CBS com os créditos disponíveis. Identifique quais insumos hoje sem crédito passarão a gerar crédito no novo regime. Revise preços considerando a mudança na forma de cálculo.",
      baseLegal: "LC 214/2025; RIR (IRPJ/CSLL pelo Lucro Presumido não é alterado pela Reforma Tributária)."
    },
    relatedArticles: ["ibs-cbs-o-que-sao", "nao-cumulatividade", "cronograma-transicao"],
    planActionIds: ["regime_transition"]
  },
  {
    id: "contratos-longo-prazo",
    title: "Contratos de longo prazo: cláusula de revisão tributária é essencial",
    summary: "Contratos acima de 12 meses firmados sem cláusula de revisão por mudança tributária podem obrigar sua empresa a absorver toda a nova carga sem poder repassar ao cliente. Saiba como se proteger.",
    category: "contratos",
    categoryLabel: "Contratos e Preços",
    tags: ["contrato", "longo prazo", "revisão", "reequilíbrio", "cláusula tributária", "repasse"],
    icon: "Scale",
    difficulty: "avancado",
    readTime: 7,
    lawBasis: ["LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "O ordenamento jurídico brasileiro permite a revisão de contratos de longo prazo quando há alteração significativa da carga tributária que desequilibra o contrato (teoria da imprevisão / onerosidade excessiva). A LC 214/2025 é uma mudança normativa suficientemente relevante para embasar esse pedido.",
      oquemudata: "Contratos sem cláusula de revisão tributária podem ser interpretados como tendo risco da variação tributária a cargo do vendedor/prestador. Isso significa que o aumento de carga pode ter que ser absorvido como redução de margem, sem direito de repasse automático ao contratante.",
      oquefarzer: "Liste todos os contratos com duração superior a 12 meses. Para cada um, verifique se há cláusula de reequilíbrio por mudança tributária. Se não houver, avalie com advogado tributarista: (1) negociar aditivo contratual; (2) invocar onerosidade excessiva; (3) para contratos públicos, protocolar pedido de revisão de equilíbrio econômico-financeiro.",
      baseLegal: "LC 214/2025; Código Civil, arts. 478–480 (onerosidade excessiva); Lei 14.133/2021, art. 124 (contratos públicos — reequilíbrio econômico-financeiro)."
    },
    relatedArticles: ["precificacao-b2b", "precificacao-b2c", "ibs-cbs-o-que-sao"],
    planActionIds: ["contracts_review"]
  },
  {
    id: "precificacao-b2b",
    title: "Precificação B2B na Reforma: como calcular e usar o crédito como argumento comercial",
    summary: "Empresas que vendem para outras empresas precisam recalcular preços considerando o novo IBS/CBS. Mas o crédito gerado pela sua NF pode ser um argumento competitivo poderoso.",
    category: "contratos",
    categoryLabel: "Contratos e Preços",
    tags: ["precificação", "B2B", "preço", "crédito", "IBS", "CBS", "margem"],
    icon: "TrendingUp",
    difficulty: "intermediario",
    readTime: 6,
    lawBasis: ["LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "O IBS e CBS são calculados 'por fora' (não embutidos no preço). Isso significa que a alíquota incide sobre o valor do produto/serviço sem o imposto. No B2B, o comprador pode aproveitar o IBS/CBS destacado na NF como crédito — o que reduz o custo efetivo da aquisição.",
      oquemudata: "A fórmula de precificação muda: Preço Líquido ÷ (1 – alíquota efetiva) = Preço Bruto. O crédito de IBS/CBS gerado pela sua NF passa a ser parte do argumento comercial — seu cliente paga menos efetivamente se você estiver no regime regular e emitir NF corretamente.",
      oquefarzer: "Recalcule os preços dos seus principais produtos usando a nova fórmula. Treine a equipe comercial para apresentar o crédito de IBS/CBS como benefício ao cliente B2B. Verifique se seu ERP calcula o imposto por fora corretamente. Revise tabelas de preços antes de renovar contratos.",
      baseLegal: "LC 214/2025, arts. 28–30 (base de cálculo e destaque do IBS/CBS na NF)."
    },
    relatedArticles: ["contratos-longo-prazo", "nao-cumulatividade", "precificacao-b2c"],
    planActionIds: ["pricing_formula"]
  },
  {
    id: "precificacao-b2c",
    title: "Precificação B2C: como repassar a nova carga ao consumidor final sem perder clientes",
    summary: "Consumidores finais não aproveitam créditos de IBS/CBS — qualquer aumento de carga é sentido no preço final. A estratégia de comunicação e o timing do repasse fazem toda a diferença.",
    category: "contratos",
    categoryLabel: "Contratos e Preços",
    tags: ["precificação", "B2C", "consumidor", "preço", "repasse", "margem"],
    icon: "Users",
    difficulty: "intermediario",
    readTime: 5,
    lawBasis: ["LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "A Reforma exige que o valor do IBS e CBS seja transparente ao consumidor. A LC 214/2025 prevê destaque obrigatório do imposto no cupom fiscal ou NFC-e para operações com consumidor final, de forma que o consumidor saiba quanto está pagando de imposto.",
      oquemudata: "Consumidores finais não têm crédito — toda a carga de IBS/CBS é suportada por eles. Se sua margem for apertada e a nova alíquota for maior do que a carga atual, você terá que repassar o aumento ao preço ou absorver na margem. A transparência obrigatória pode gerar mais questionamentos dos consumidores.",
      oquefarzer: "Calcule a diferença de carga entre o regime atual e o novo regime para seus principais produtos. Defina quais itens têm margem para absorver parte do aumento e quais precisam de repasse integral. Comunique o reajuste com pelo menos 30–60 dias de antecedência. Evite framing de 'imposto novo' — foque no valor entregue.",
      baseLegal: "LC 214/2025, arts. 28–30 e 173–178 (transparência e destaque nos documentos fiscais ao consumidor)."
    },
    relatedArticles: ["precificacao-b2b", "split-payment", "contratos-longo-prazo"],
    planActionIds: ["pricing_formula", "b2c_pricing_comms"]
  },
  {
    id: "capital-de-giro",
    title: "Capital de giro na Reforma: o que muda com o Split Payment",
    summary: "O Split Payment pode reduzir o valor que entra no caixa imediatamente após a venda. Empresas que usam o imposto como reserva de caixa temporária serão diretamente impactadas.",
    category: "planejamento",
    categoryLabel: "Planejamento e Adequação",
    tags: ["capital de giro", "caixa", "Split Payment", "liquidez", "financeiro"],
    icon: "Wallet",
    difficulty: "avancado",
    readTime: 6,
    lawBasis: ["LC 227/2026"],
    featured: false,
    sections: {
      oquedizalei: "A LC 227/2026 institui o Split Payment, pelo qual o agente financeiro retém o IBS/CBS no momento da liquidação do pagamento. O cronograma de implementação por meio de pagamento ainda depende de regulamentação complementar do Comitê Gestor do IBS.",
      oquemudata: "Empresas que hoje recebem o valor bruto (com imposto incluído) e usam esse montante como capital de giro temporário antes de pagar o imposto verão esse mecanismo desaparecer. O valor que entra na conta após a venda será apenas o líquido (sem o imposto). Isso pode criar tensão de caixa significativa.",
      oquefarzer: "Projete o impacto mensalmente: para cada R$100 vendidos com cartão/PIX, qual percentual você deixará de receber imediatamente? Revise seu limite de crédito junto ao banco antes de 2026. Considere ajustar o prazo de pagamento de fornecedores para equilibrar o ciclo financeiro. Avalie se precisa de linha de crédito adicional.",
      baseLegal: "LC 227/2026; Resolução do Comitê Gestor (cronograma por meio de pagamento — a ser publicada)."
    },
    relatedArticles: ["split-payment", "precificacao-b2c", "cronograma-transicao"],
    planActionIds: ["split_simulation"]
  },
  {
    id: "cesta-basica",
    title: "Cesta Básica e alíquota zero: quais produtos e serviços têm benefício",
    summary: "A Reforma cria a Cesta Básica Nacional com alíquota zero de IBS/CBS, além de reduções de 60% para saúde, educação e transporte público. Saiba se sua empresa se enquadra.",
    category: "setores",
    categoryLabel: "Setores da Economia",
    tags: ["cesta básica", "alíquota zero", "saúde", "educação", "benefício", "redução"],
    icon: "Heart",
    difficulty: "basico",
    readTime: 5,
    lawBasis: ["EC 132/2023", "LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "A EC 132/2023 e a LC 214/2025 criaram a Cesta Básica Nacional com alíquota zero de IBS e CBS. Serviços de saúde, educação, transporte público coletivo e outros bens essenciais têm redução de 60% na alíquota. O enquadramento é por NCM/NBS — nem todo produto 'da área' tem benefício automático.",
      oquemudata: "Empresas que vendem produtos ou prestam serviços da Cesta Básica ou das categorias beneficiadas precisam: (1) confirmar o enquadramento correto no NCM/NBS; (2) emitir NF com destaque da alíquota reduzida; (3) entender como os créditos funcionam quando você vende com alíquota zero. Atenção: créditos acumulados na cadeia podem ser ressarcíveis.",
      oquefarzer: "Liste os produtos/serviços da sua empresa que podem ter benefício. Confirme com o contador o NCM/NBS correto e se há enquadramento na lista da cesta básica ou categorias com redução de 60%. Revise o cadastro do ERP para refletir a alíquota correta. Use o benefício como argumento comercial.",
      baseLegal: "EC 132/2023, art. 9º, § 1º (alíquota zero e reduções); LC 214/2025, arts. 120 a 145 (lista da cesta básica e categorias beneficiadas)."
    },
    relatedArticles: ["ibs-cbs-o-que-sao", "cadastro-ncm", "imposto-seletivo"],
    planActionIds: ["catalog_std", "top30_items"]
  },
  {
    id: "imposto-seletivo",
    title: "Imposto Seletivo (IS): quais produtos têm carga adicional",
    summary: "O Imposto Seletivo é um tributo extrafiscal criado pela Reforma para onerar produtos considerados prejudiciais à saúde ou ao meio ambiente. Saiba se sua operação é afetada.",
    category: "setores",
    categoryLabel: "Setores da Economia",
    tags: ["Imposto Seletivo", "IS", "bebidas", "tabaco", "veículos", "pesticidas", "carga adicional"],
    icon: "AlertTriangle",
    difficulty: "intermediario",
    readTime: 5,
    lawBasis: ["EC 132/2023", "LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "A EC 132/2023 cria o Imposto Seletivo (IS), de competência federal, incidente sobre bens e serviços prejudiciais à saúde e ao meio ambiente: bebidas alcoólicas, tabaco, veículos automotores, embarcações, aeronaves, produtos financeiros (em análise), agrotóxicos e bens com alto índice de carbono.",
      oquemudata: "Empresas que produzem, importam ou comercializam esses produtos terão uma carga adicional de IS sobre o IBS/CBS. O IS não gera crédito para o adquirente — é uma carga que fica definitivamente na cadeia. Isso pode impactar significativamente a competitividade de produtos no limite da incidência.",
      oquefarzer: "Verifique se algum produto ou insumo da sua operação está na lista do Imposto Seletivo. Confirme as alíquotas específicas com seu contador (ainda dependem de regulamentação complementar). Recalcule o preço de venda incorporando o IS. Se for importador, inclua o IS no custo de importação.",
      baseLegal: "EC 132/2023, art. 153, VIII (Imposto Seletivo); LC 214/2025, arts. 409 a 468 (regulamentação do IS)."
    },
    relatedArticles: ["ibs-cbs-o-que-sao", "cesta-basica", "precificacao-b2b"],
    planActionIds: ["catalog_std", "pricing_formula"]
  },
  {
    id: "agronegocio-reforma",
    title: "Agronegócio na Reforma: regras diferenciadas e crédito de insumos",
    summary: "O agronegócio tem tratamento diferenciado: cesta básica, regime monofásico para algumas cadeias e regras específicas de crédito. Entenda o que muda para produtores rurais e cooperativas.",
    category: "setores",
    categoryLabel: "Setores da Economia",
    tags: ["agronegócio", "produtor rural", "cooperativa", "insumos agrícolas", "cesta básica", "monofásico"],
    icon: "Wheat",
    difficulty: "avancado",
    readTime: 8,
    lawBasis: ["EC 132/2023", "LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "A LC 214/2025 trata o agronegócio com regras diferenciadas: produtos da cesta básica têm alíquota zero; determinadas cadeias (carnes, grãos) podem ter regime monofásico (imposto recolhido em uma só etapa da cadeia); insumos agropecuários têm crédito amplo de IBS/CBS. Exportações agrícolas mantêm imunidade total.",
      oquemudata: "Produtores rurais que hoje são pessoas físicas ou têm regime simplificado precisarão avaliar se passam a ter obrigações novas de apuração de IBS/CBS. Cooperativas terão regras específicas. A rastreabilidade de insumos ganha ainda mais importância para aproveitamento de créditos.",
      oquefarzer: "Mapeie cada produto da sua operação e confirme com o contador o regime aplicável (cesta básica, monofásico, regime regular). Para insumos agropecuários, verifique quais geram crédito de IBS/CBS. Se exportar, confirme o procedimento de ressarcimento de créditos acumulados na cadeia exportadora.",
      baseLegal: "LC 214/2025, arts. 204 a 240 (regimes diferenciados do agronegócio); EC 132/2023, art. 9º (imunidade de exportações)."
    },
    relatedArticles: ["cesta-basica", "nao-cumulatividade", "ibs-cbs-o-que-sao"],
    planActionIds: ["catalog_std", "supplier_abc"]
  },
  {
    id: "industria-reforma",
    title: "Indústria na Reforma: não-cumulatividade plena e crédito de bens de capital",
    summary: "A indústria é um dos setores mais beneficiados pela não-cumulatividade ampla do IBS/CBS. Créditos em insumos, energia, logística e bens de capital podem reduzir a carga efetiva — mas exigem adaptação.",
    category: "setores",
    categoryLabel: "Setores da Economia",
    tags: ["indústria", "manufatura", "insumo", "bens de capital", "energia", "crédito", "IPI"],
    icon: "Factory",
    difficulty: "intermediario",
    readTime: 7,
    lawBasis: ["EC 132/2023", "LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "Com a extinção do IPI (gradual até 2033), a indústria passa a recolher IBS e CBS. A não-cumulatividade plena permite crédito sobre praticamente todos os insumos industriais, energia elétrica usada no processo produtivo, serviços de frete e logística, e bens de capital (máquinas e equipamentos) — em crédito imediato ou parcelado.",
      oquemudata: "A cadeia de fornecedores passa a ter impacto direto na carga efetiva da indústria. Comprar de fornecedores no Simples sem opção pelo regime regular significa menos crédito. Máquinas importadas podem ter tratamento específico. A complexidade fiscal temporária aumenta durante a convivência de IPI e IBS/CBS.",
      oquefarzer: "Faça uma simulação comparativa da carga atual (IPI + PIS/COFINS + ICMS) vs. carga futura (IBS + CBS) com créditos plenos. Mapeie fornecedores de insumos por regime tributário. Verifique o tratamento dos bens de capital adquiridos durante a transição. Confirme com o ERP como o IBS/CBS será calculado nas saídas industriais.",
      baseLegal: "LC 214/2025, arts. 28–58 (IBS); EC 132/2023, art. 153, IV (IPI — extinção gradual)."
    },
    relatedArticles: ["nao-cumulatividade", "fornecedores-simples", "erp-adaptacao"],
    planActionIds: ["supplier_abc", "catalog_std", "pricing_formula"]
  },
  {
    id: "governanca-reforma",
    title: "Governança interna: como estruturar o acompanhamento da Reforma na sua empresa",
    summary: "A Reforma exige monitoramento contínuo até 2033. Empresas sem estrutura mínima de governança tributária correm o risco de perder prazos críticos e acumular passivos evitáveis.",
    category: "planejamento",
    categoryLabel: "Planejamento e Adequação",
    tags: ["governança", "compliance", "responsável", "monitoramento", "treinamento", "cronograma"],
    icon: "Shield",
    difficulty: "basico",
    readTime: 5,
    lawBasis: ["EC 132/2023", "LC 214/2025"],
    featured: false,
    sections: {
      oquedizalei: "Não há uma norma específica exigindo um 'comitê da reforma tributária', mas as obrigações acessórias (novos layouts de NF-e, novos registros, novas apurações) exigem que alguém na empresa esteja acompanhando ativamente as publicações do Comitê Gestor do IBS, da Receita Federal e da SEFAZ.",
      oquemudata: "Empresas sem responsável claro pelo tema tributário tendem a descobrir mudanças tarde e correr contra o prazo. Durante a transição (2026–2033), serão publicadas dezenas de regulamentações complementares com prazos variados. Quem não monitorar, perde prazo ou comete erro por desconhecimento.",
      oquefarzer: "Defina um responsável interno (ou confirme esse papel com seu escritório de contabilidade). Estabeleça reunião mensal de acompanhamento tributário. Crie um calendário de marcos críticos (datas de publicação esperadas, datas de implementação no ERP, datas de corte por obrigação). Treine as equipes fiscal, comercial e financeira com foco prático.",
      baseLegal: "EC 132/2023; LC 214/2025; Resoluções do Comitê Gestor do IBS (monitorar publicações em comitegestor.gov.br)."
    },
    relatedArticles: ["cronograma-transicao", "erp-adaptacao", "ibs-cbs-o-que-sao"],
    planActionIds: ["define_responsible", "governance_setup", "team_training", "final_validation"]
  },
];
