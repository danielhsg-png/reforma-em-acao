export interface PlanItemExplanation {
  whyItMatters: string;
  consequences: string[];
  legalBasis: string;
}

export const PLAN_EXPLANATIONS: Record<string, PlanItemExplanation> = {
  define_responsible: {
    whyItMatters:
      "Sem uma pessoa responsável pela reforma, as adaptações necessárias não têm dono — e o que não tem dono não avança. A reforma exige decisões em áreas distintas ao mesmo tempo: fiscal, comercial, compras e financeiro. Sem um ponto focal, cada área espera a outra agir e nada sai do papel.",
    consequences: [
      "Cada mês sem responsável é um mês de atraso acumulado — e quanto mais tarde a adaptação começa, mais cara ela fica",
      "Fornecedores de ERP, contadores e advogados precisam de um interlocutor: sem ele, cobranças e decisões ficam suspensas indefinidamente",
      "Quando os problemas aparecerem em 2026, será tarde demais para corrigi-los sem custo operacional e financeiro alto",
    ],
    legalBasis:
      "EC 132/2023, Art. 1º — A Reforma cria obrigações diretas para todos os contribuintes, sem exceção de porte ou setor",
  },

  erp_adoption: {
    whyItMatters:
      "O IBS e a CBS terão campos obrigatórios específicos em NF-e e NFS-e. Um sistema manual (planilha ou sem integração) não consegue gerar esses documentos no formato exigido pela SEFAZ. Nota emitida fora do padrão é nota rejeitada — e nota rejeitada significa venda não formalizada.",
    consequences: [
      "Sem ERP atualizado, você não consegue emitir notas fiscais válidas com o novo layout de IBS/CBS",
      "Perda permanente de créditos de IBS/CBS por ausência de documentação adequada nas compras",
      "Risco de autuação por emissão irregular de documentos fiscais durante o período de fiscalização",
    ],
    legalBasis:
      "LC 214/2025, Art. 56 — Obrigatoriedade de documentação eletrônica no regime do IBS/CBS; layouts técnicos definidos pela RFB",
  },

  erp_contact: {
    whyItMatters:
      "Mesmo que seu ERP funcione bem hoje, ele precisa ser atualizado para suportar os novos campos e cálculos do IBS/CBS. Essa atualização depende 100% do seu fornecedor de sistema — e muitos fornecedores estão atrasados. Sem confirmação por escrito e com prazo, você não tem nenhuma garantia de estar coberto quando precisar.",
    consequences: [
      "Se o ERP não for atualizado a tempo, você não consegue emitir notas com o novo formato — e a operação para",
      "Sem prazo confirmado, você não consegue planejar quando testar o sistema em ambiente de homologação",
      "Fornecedores de ERP que não entregarem podem deixar sua empresa sem solução no pior momento possível",
    ],
    legalBasis:
      "LC 214/2025, Art. 56 — Documentação fiscal eletrônica obrigatória; Nota Técnica ENCAT/RFB — novos layouts de NF-e com campos de IBS/CBS",
  },

  top30_items: {
    whyItMatters:
      "A reforma tributária não tem impacto igual em todos os produtos ou serviços. O IBS/CBS é calculado item a item, com base no NCM (mercadorias) ou NBS (serviços). Sem saber quais itens concentram seu faturamento e qual é o impacto em cada um, você está precificando no escuro — e pode ser surpreendido no DRE.",
    consequences: [
      "Preços calculados sem a nova alíquota por item vão gerar margem menor do que o planejado a partir de 2026",
      "Sem a lista priorizada, você não consegue identificar quais produtos são mais afetados e agir primeiro",
      "Sem NCM/NBS correto por item, o ERP vai aplicar a alíquota errada automaticamente em todas as notas",
    ],
    legalBasis:
      "LC 214/2025, Art. 12 — Cálculo do IBS/CBS por produto ou serviço com base no código NCM ou NBS",
  },

  contracts_review: {
    whyItMatters:
      "Contratos de longo prazo sem cláusula de revisão tributária colocam o equilíbrio financeiro do seu negócio em risco. Se a alíquota efetiva aumentar com a reforma e o contrato não permitir repasse ao cliente, você terá que absorver o custo sozinho — mês a mês, sem poder renegociar.",
    consequences: [
      "Cada mês de execução de um contrato sem cláusula de revisão pode representar perda direta e acumulada de margem",
      "Sem a cláusula, o cliente pode se recusar juridicamente a aceitar qualquer reajuste relacionado à reforma",
      "Risco de litígio contratual durante o longo período de transição 2026–2033, com custo jurídico alto",
    ],
    legalBasis:
      "LC 214/2025, Art. 114 — Dispositivos de reequilíbrio contratual por alteração tributária em contratos públicos e privados",
  },

  mgmt_briefing: {
    whyItMatters:
      "A reforma tributária não é assunto só do contador. Ela afeta preço, margem, caixa, contratos e sistemas. Se a diretoria não entender o que está vindo, as decisões estratégicas e os recursos necessários — investimento em ERP, contratação de assessoria, treinamento — simplesmente não serão aprovados.",
    consequences: [
      "Sem aprovação da liderança, investimentos em ERP, treinamento e assessoria jurídica não acontecem",
      "A empresa pode chegar em 2026 sem ter feito nenhuma das adaptações necessárias — e aí o custo de correção é muito maior",
      "Quando o impacto no caixa aparecer, será tarde para agir de forma preventiva e organizada",
    ],
    legalBasis:
      "EC 132/2023 — Obrigação legal que afeta diretamente o resultado econômico-financeiro de toda empresa contribuinte",
  },

  nf_formal: {
    whyItMatters:
      "Comprar sem nota fiscal é comprar sem crédito de IBS/CBS. No novo sistema, cada compra com documentação correta gera um crédito que reduz o imposto que você deve pagar. Sem a nota, você paga o imposto integral sobre o produto — enquanto seu concorrente que exige nota paga menos.",
    consequences: [
      "Cada compra sem NF é um crédito de IBS/CBS que você não vai aproveitar — dinheiro que vai para o governo em vez de ficar no seu caixa",
      "Fornecedores que se recusarem a emitir NF devem ser substituídos — e troca de fornecedor tem custo de relacionamento e logística",
      "Carga tributária líquida permanentemente maior em comparação com concorrentes que operam com documentação adequada",
    ],
    legalBasis:
      "LC 214/2025, Art. 28 — Condições para creditamento de IBS/CBS: documentação fiscal adequada é requisito obrigatório",
  },

  governance_setup: {
    whyItMatters:
      "A reforma afeta ao mesmo tempo sua área fiscal, suas compras, seus contratos, seu caixa e seus sistemas. Sem uma governança básica, cada área cuida do seu pedaço e ninguém enxerga o todo. O resultado é adaptação incompleta, ações contraditórias e problemas que aparecem na pior hora.",
    consequences: [
      "Ações críticas não são concluídas porque cada área espera a outra tomar a decisão primeiro",
      "Sem reuniões periódicas, os atrasos só são percebidos quando já é tarde para corrigir sem custo alto",
      "Decisões interdependentes — preço, contrato, ERP — são tomadas de forma descoordenada, gerando retrabalho",
    ],
    legalBasis:
      "EC 132/2023 + LC 214/2025 — Obrigações simultâneas em múltiplas áreas operacionais da empresa",
  },

  catalog_std: {
    whyItMatters:
      "Cada produto ou serviço que você vende precisa ter um código NCM (mercadorias) ou NBS (serviços) correto no sistema. Esse código determina a alíquota exata de IBS/CBS aplicada à nota. Código errado = alíquota errada. Alíquota errada = nota rejeitada ou imposto calculado a menor — o que gera autuação com multa e juros.",
    consequences: [
      "NFs com NCM/NBS errado podem ser rejeitadas eletronicamente pela SEFAZ no momento da transmissão",
      "Alíquota calculada a menor gera cobrança retroativa de imposto acrescida de multa (75% a 150%) e juros Selic",
      "Créditos de IBS/CBS aproveitados pelos seus clientes B2B podem ser questionados por erro na nota que você emitiu",
    ],
    legalBasis:
      "LC 214/2025, Art. 12 + Instrução Normativa RFB — NCM/NBS obrigatório na NF-e para cálculo correto do IBS/CBS",
  },

  supplier_abc: {
    whyItMatters:
      "Nem todos os seus fornecedores geram o mesmo crédito de IBS/CBS para a sua empresa. Fornecedores do Simples Nacional têm regras de crédito específicas que podem ser mais limitadas. Saber quem é quem na sua base de fornecedores permite negociar melhor, trocar estrategicamente e reduzir a carga tributária líquida das compras.",
    consequences: [
      "Comprar de fornecedores com crédito limitado pode ser mais caro tributariamente após a reforma — sem você perceber",
      "Sem essa análise, você não sabe o real impacto das suas compras no caixa tributário e na margem efetiva",
      "Concorrentes que fizeram esse mapeamento podem ter vantagem de custo e de preço que você não vai conseguir explicar",
    ],
    legalBasis:
      "LC 214/2025, Art. 28 a 35 — Regras de creditamento de IBS/CBS nas aquisições conforme regime do fornecedor",
  },

  fiscal_routine: {
    whyItMatters:
      "Erros fiscais descobertos depois do fechamento mensal são muito mais caros de corrigir — e alguns não podem ser corrigidos de forma retroativa. Uma rotina semanal de 1 hora identifica problemas enquanto ainda há margem de manobra: nota cancelada, crédito recuperado, obrigação cumprida no prazo.",
    consequences: [
      "NFs com erro não corrigidas dentro do prazo resultam em crédito de IBS/CBS perdido permanentemente",
      "Obrigações acessórias esquecidas geram multa automática após o vencimento — mesmo que o imposto em si esteja pago",
      "Erros fiscais acumulados criam passivo invisível que só aparece na fiscalização — quando o custo é máximo",
    ],
    legalBasis:
      "LC 214/2025, Art. 56 a 62 — Obrigações acessórias do IBS/CBS e prazos de declaração e correção",
  },

  supplier_nf_quality: {
    whyItMatters:
      "NFs com erro nos dados do produto — NCM/NBS errado, descrição genérica, valor divergente — podem invalidar o crédito de IBS/CBS da sua empresa. Se um fornecedor emite NFs com erro frequentemente, você está pagando imposto que deveria ser compensado, mas não está sendo.",
    consequences: [
      "Cada NF com erro é potencialmente um crédito perdido: o imposto vai para o governo em vez de ficar no seu caixa",
      "Fornecedores que não se adequarem até 2026 precisarão ser substituídos — e troca de fornecedor tem custo de relacionamento e operação",
      "Você pode ser questionado em fiscalização pelos créditos aproveitados com base em NFs com erro de origem",
    ],
    legalBasis:
      "LC 214/2025, Art. 28 — Creditamento de IBS/CBS condicionado à regularidade e correção da documentação fiscal recebida",
  },

  export_rules: {
    whyItMatters:
      "Se você exporta, sua operação tem imunidade de IBS/CBS — e os créditos acumulados nas compras para produção do que você exporta podem ser ressarcidos pelo governo. Isso representa caixa real que muitas empresas exportadoras deixam de recuperar simplesmente por não conhecerem o processo formal.",
    consequences: [
      "Créditos de IBS/CBS não ressarcidos são dinheiro que fica retido nas suas compras sem retorno ao caixa",
      "O prazo de solicitação de ressarcimento tem regras específicas — perder o prazo significa perder o crédito definitivamente",
      "Concorrentes exportadores que solicitam ressarcimento têm vantagem de caixa que se acumula mês a mês",
    ],
    legalBasis:
      "CF/88, Art. 149-B + LC 214/2025, Art. 73 — Imunidade de IBS/CBS nas exportações e ressarcimento de créditos acumulados",
  },

  gov_contracts: {
    whyItMatters:
      "Contratos com órgãos públicos têm proteção legal de equilíbrio econômico-financeiro. Se a carga tributária aumentar por mudança de lei — como a reforma tributária —, você tem direito de pedir revisão do valor contratado. Mas esse pedido precisa ser feito com documentação adequada e dentro do prazo.",
    consequences: [
      "Sem o pedido formal de revisão, a empresa absorve toda a nova carga tributária sem poder repassar ao órgão contratante",
      "Contratos que seriam lucrativos sem a reforma podem se tornar deficitários e precisar ser cumpridos assim mesmo",
      "O prazo para pedido de revisão pode ser decadencial: depois que passa, não tem mais como recorrer",
    ],
    legalBasis:
      "Lei 14.133/2021, Art. 124 + LC 214/2025 — Reequilíbrio econômico-financeiro de contratos públicos por alteração da carga tributária",
  },

  simples_option: {
    whyItMatters:
      "Empresas do Simples Nacional que vendem para outras empresas (B2B) enfrentam um dilema real: no Simples, o crédito de IBS/CBS transferido ao seu cliente pode ser menor do que o que um concorrente no regime regular transfere. Seu cliente vai comparar isso — e pode preferir comprar de quem gera mais crédito.",
    consequences: [
      "Clientes B2B vão comparar o crédito que você gera vs. o que o concorrente gera — e tender a preferir quem gera mais",
      "A opção pelo regime regular de IBS/CBS tem prazo e não pode ser revertida no mesmo exercício fiscal",
      "Sem a análise de viabilidade, você pode estar perdendo contratos ou tendo que reduzir margem para compensar a desvantagem de crédito",
    ],
    legalBasis:
      "LC 214/2025, Art. 16 — Opção do contribuinte do Simples Nacional pelo recolhimento regular de IBS/CBS com prazo definido",
  },

  margin_calc: {
    whyItMatters:
      "A nova alíquota de IBS/CBS vai alterar o custo tributário de cada produto que você vende. Para saber se você precisa reajustar preço, reduzir custo ou descontinuar um produto, você precisa saber qual é sua margem atual por item. Sem esse dado, qualquer decisão de precificação é um chute — e chute em tributo tem custo.",
    consequences: [
      "Produtos com margem abaixo de 10% podem se tornar deficitários após a nova alíquota — sem que você perceba até ver o DRE negativo",
      "Você pode estar sustentando produtos que já não são viáveis sem saber — e continuará fazendo isso em 2026",
      "Sem a margem por produto, você não tem como priorizar quais itens ajustar primeiro na precificação",
    ],
    legalBasis:
      "EC 132/2023 + LC 214/2025 — A mudança de alíquota efetiva impacta diretamente a lucratividade por produto ou linha de serviço",
  },

  multistate_erp: {
    whyItMatters:
      "O IBS é calculado com base no destino da operação — ou seja, o estado e município para onde o produto vai ou onde o serviço é prestado. Se você vende para múltiplos estados, seu ERP precisa identificar o destino correto e aplicar o componente de IBS de cada ente federativo. Sem isso, as notas serão emitidas com alíquota errada.",
    consequences: [
      "NFs com IBS de destino errado podem ser rejeitadas na transmissão ou gerar obrigação adicional de recolhimento ao destino correto",
      "O Comitê Gestor do IBS vai cruzar o destino declarado com o efetivo — divergências sistemáticas geram auto de infração",
      "Recálculo manual de todas as notas erradas tem custo operacional alto e pode exigir pagamento retroativo com juros",
    ],
    legalBasis:
      "LC 214/2025, Art. 11 — Princípio de destino do IBS; Art. 56 — Obrigações do contribuinte quanto à identificação correta do local da operação",
  },

  pricing_formula: {
    whyItMatters:
      "A forma de calcular o preço muda com a reforma. Hoje você embute o tributo de forma cumulativa. A partir de 2026, o IBS/CBS é calculado 'por dentro' do preço — o que significa que o preço bruto precisa ser maior para cobrir a alíquota nova e ainda manter a margem que você planejou. Usar a fórmula antiga resulta em margem menor do que o esperado.",
    consequences: [
      "Preços calculados com a fórmula antiga vão gerar margem menor do que você planeja — e você vai descobrir isso só no DRE do mês seguinte",
      "Clientes B2B vão perceber que o crédito que você gera não é compatível com o preço que você cobra — e podem questionar",
      "Produtos com margem fina podem se tornar inviáveis financeiramente se a nova fórmula não for aplicada antes de 2026",
    ],
    legalBasis:
      "LC 214/2025, Art. 12 — Cálculo do IBS/CBS 'por dentro' do preço de venda; base de cálculo inclui o próprio tributo",
  },

  split_simulation: {
    whyItMatters:
      "O Split Payment é um mecanismo pelo qual o valor do IBS/CBS pode ser retido diretamente no momento do pagamento — dependendo do meio usado. Isso significa que parte do que você recebe em vendas pode ir diretamente ao fisco sem passar pelo seu caixa. Para empresas com capital de giro apertado, isso é um risco concreto de insolvência operacional.",
    consequences: [
      "O caixa disponível no fim do mês pode ser menor do que você planejou — sem aviso prévio e sem margem de manobra",
      "Empresas que já operam no limite do capital de giro podem ter falta de caixa para pagar fornecedores e salários",
      "Crédito de giro contratado sem considerar o Split Payment pode ser insuficiente para cobrir o impacto real",
    ],
    legalBasis:
      "LC 214/2025, Art. 44 a 53 — Regras do Split Payment de IBS/CBS por meio de pagamento (PIX, cartão, boleto)",
  },

  nfe_test: {
    whyItMatters:
      "A NF-e vai ganhar novos grupos de campos obrigatórios para registrar o IBS e a CBS por item. Esses campos não existem no layout atual. Se o seu ERP não estiver configurado para preenchê-los corretamente, a nota será rejeitada na transmissão para a SEFAZ — e você não vai conseguir faturar até resolver.",
    consequences: [
      "NF rejeitada = venda não formalizada = produto entregue ou serviço prestado sem garantia de recebimento",
      "Testar em produção, sem ambiente de homologação prévia, gera retrabalho, notas canceladas e custo alto de correção",
      "Atraso na validação do sistema pode paralisar as operações já no primeiro dia útil de 2026",
    ],
    legalBasis:
      "LC 214/2025, Art. 56 + Nota Técnica ENCAT/RFB — Novos layouts obrigatórios de NF-e com campos de IBS/CBS por item",
  },

  team_training: {
    whyItMatters:
      "A reforma não muda só as regras — muda a rotina de quem emite nota, de quem negocia contrato e de quem controla o caixa. Sem treinamento, sua equipe vai continuar fazendo o que sempre fez, agora com regras novas que não conhece. O erro operacional de quem não foi treinado vira perda financeira e passivo fiscal.",
    consequences: [
      "Nota emitida com campo errado = crédito perdido para o cliente B2B + possível rejeição automática na SEFAZ",
      "Vendedor que não entende o crédito de IBS/CBS não consegue usar isso como diferencial comercial nas negociações",
      "Financeiro que não conhece o Split Payment não vai prever corretamente o caixa disponível — e o negócio sofre",
    ],
    legalBasis:
      "LC 214/2025 — Múltiplos artigos que criam obrigações operacionais diretas para diferentes setores da empresa",
  },

  b2c_pricing_comms: {
    whyItMatters:
      "Consumidor final é o público mais sensível a aumento de preço — e o que menos entende de tributação. Se você precisar reajustar preços em 2026 por causa da reforma e não comunicar adequadamente, o cliente pode interpretar como ganância da empresa. Uma comunicação mal feita pode virar reclamação pública, perda de cliente ou comparação desfavorável com concorrentes.",
    consequences: [
      "Clientes não avisados com antecedência tendem a reagir mais negativamente ao reajuste — e isso aparece em redes sociais",
      "Sem uma estratégia clara, cada parte da equipe comunica de um jeito diferente, gerando mensagens inconsistentes",
      "Concorrentes com comunicação melhor podem usar a confusão gerada pela reforma como diferencial perante o consumidor",
    ],
    legalBasis:
      "CDC, Art. 6º — Direito à informação clara e transparente ao consumidor; LC 214/2025 — Repasse da carga tributária ao preço final",
  },

  regime_transition: {
    whyItMatters:
      "Empresas do Lucro Presumido recolhem PIS/COFINS hoje de forma cumulativa — sem direito a crédito sobre compras. Com a reforma, o IBS/CBS substitui o PIS/COFINS com não-cumulatividade plena. Isso pode representar créditos novos que você não tinha antes — mas também pode significar alíquota efetiva maior se sua cadeia de compras for do Simples.",
    consequences: [
      "Sem análise do impacto, você pode ser positiva ou negativamente surpreendido na alíquota efetiva a partir de 2026",
      "O regime de IRPJ/CSLL não muda, mas as obrigações acessórias do novo tributo precisam ser incorporadas ao processo contábil",
      "Oportunidades de crédito identificadas antes da reforma podem ser aproveitadas; as não identificadas são perdidas permanentemente",
    ],
    legalBasis:
      "LC 214/2025, Art. 28 a 35 — Não-cumulatividade do IBS/CBS aplicável às empresas do Lucro Presumido a partir de 2026",
  },

  final_validation: {
    whyItMatters:
      "A validação final é o momento de confirmar se tudo que foi planejado foi de fato implementado. É muito comum que ações críticas estejam 'em andamento' há semanas sem nunca serem concluídas. Uma reunião com checklist formal com o contador fecha as lacunas antes da virada do regime — quando o custo de correção ainda é gerenciável.",
    consequences: [
      "Lacunas descobertas depois de 2026 têm custo de correção muito maior — porque agora são urgências, não preparações",
      "Sem a reunião de validação, você não tem como saber com certeza se o ERP foi testado ou apenas 'quase testado'",
      "Problemas não resolvidos antes da virada se tornam emergências operacionais no pior momento possível",
    ],
    legalBasis:
      "EC 132/2023 + LC 214/2025 + LC 227/2026 — Prazo de conformidade para todos os contribuintes; coexistência IBS/CBS ativa desde 2026",
  },
};
