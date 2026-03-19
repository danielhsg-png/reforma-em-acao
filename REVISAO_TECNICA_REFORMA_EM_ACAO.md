# RESUMO OPERACIONAL — REFORMA EM AÇÃO
## Conteúdo completo do módulo PLANO DE AÇÃO
### Versão para revisão técnica/jurídica — Março/2026

---

## 1. BASE LEGAL REFERENCIADA NO SISTEMA

O aplicativo declara explicitamente as seguintes normas como base de todo o conteúdo informativo e lógica de diagnóstico:

| Norma | Objeto |
|---|---|
| **EC 132/2023** | Emenda Constitucional que criou o IBS, a CBS e o Imposto Seletivo |
| **LC 214/2025** | Lei Complementar que regulamentou o IBS, CBS e IS |
| **LC 227/2026** | Lei Complementar que regulamentou o Split Payment |
| **NT 2025.002 v1.34** | Nota Técnica da SEFAZ com os novos campos obrigatórios na NF-e para IBS/CBS |

Esses são os únicos diplomas citados. A referência ao art. 378 da LC 214/2025 aparece uma vez, relacionada à revisão de contratos por desequilíbrio tributário.

---

## 2. CONTEÚDO INFORMATIVO EXIBIDO AO USUÁRIO

### 2.1 Tela de apresentação (antes de iniciar)

O sistema descreve o produto assim para o usuário:

> *"Uma entrevista guiada que coleta informações do seu negócio, gera um diagnóstico por eixo e entrega um plano de ação concreto — com motivo, prazo e responsável para cada tarefa."*

Quatro benefícios apresentados:
- **Score de prontidão** — nota de 0 a 100, nível Baixo / Moderado / Alto / Crítico
- **Diagnóstico por eixo** — 5 dimensões: Fiscal, Compras, Comercial, Financeiro, Governança
- **Plano filtrado pelo perfil** — ações com motivo, prazo e responsável
- **PDF para contador** — gerado apenas ao final

### 2.2 Avisos contextuais exibidos durante o preenchimento (alertas inline)

| Campo preenchido | Alerta exibido ao usuário |
|---|---|
| % fornecedores Simples > 60% | "Fornecedores do Simples geram créditos de 4–8%, não os 26,5% cheios." |
| Compras sem NF | "Toda a carga tributária fica como custo puro." |
| Folha = principal custo | "Risco alto: Folha de pagamento é seu maior custo e não gera crédito de IBS/CBS." |
| ERP = planilha ou nenhum | "Sem sistema integrado, a emissão de NF-e com campos de IBS/CBS será inviável a partir de 2026." |
| Margem < 10% | "Com menos de 10%, qualquer variação de carga tributária pode comprometer a viabilidade." |
| Capital de giro apertado | "Alto risco com Split Payment — o imposto é retido antes do recebimento." |
| Contratos sem cláusula de revisão | "Risco crítico: Revisão urgente com advogado especializado." |
| Simples Nacional + B2B | "Para empresas do Simples que vendem para outras empresas (B2B), a reforma permite optar por recolher IBS/CBS separadamente — gerando crédito integral para os clientes." |
| Operação nacional (multi-estado) | "Alíquota de IBS varia por estado de destino — risco elevado" |

### 2.3 Texto sobre o que muda (exibido no PDF — Seção 2)

> *"A Reforma Tributária (EC 132/2023, regulamentada pela LC 214/2025 e LC 227/2026) extingue cinco tributos — PIS, COFINS, IPI, ICMS e ISS — e cria dois novos: o IBS (Imposto sobre Bens e Serviços, subnacional) e a CBS (Contribuição sobre Bens e Serviços, federal). Juntos formam o IVA Dual com alíquota-referência estimada em 26,5%."*

**Quatro mudanças operacionais listadas:**
1. **Princípio do Destino** — o imposto é recolhido no estado/município do consumidor, não do produtor
2. **Não-Cumulatividade Plena** — créditos amplos em toda a cadeia, exceto itens de uso pessoal
3. **Split Payment (LC 227/2026)** — retenção automática do imposto na liquidação financeira (cartão, PIX, boleto)
4. **Transição gradual de 2026 a 2033** — alíquotas-teste em 2026–2027, vigência plena em 2033

### 2.4 Textos de impacto por setor (exibidos no PDF conforme setor escolhido pelo usuário)

**Serviços:**
> *"O setor de serviços enfrenta o maior impacto negativo. O ISS atual (2–5%) será substituído pelo IBS/CBS. A carga pode subir significativamente, especialmente para empresas intensivas em mão de obra — que não gera crédito. A revisão de preços e a renegociação de contratos são urgentes."*

**Indústria:**
> *"A indústria é um dos setores mais favorecidos. A não-cumulatividade plena permite crédito em praticamente todos os insumos, incluindo energia, logística e bens de capital. A transição exige adaptação de sistemas fiscais e renegociação com fornecedores do Simples Nacional."*

**Varejo:**
> *"O varejo será diretamente impactado pelo Split Payment, que retira o imposto na fonte em transações com cartão e PIX. O lojista receberá o valor líquido. A gestão de créditos de fornecedores e a precificação correta tornam-se essenciais para manter a margem."*

**Atacado / Distribuição:**
> *"O atacado distribuidor precisa adaptar-se à transparência total de preços. Clientes B2B vão exigir destaque de IBS/CBS na nota para aproveitamento de créditos. A classificação de fornecedores e a gestão de alíquotas por estado de destino são prioridades imediatas."*

---

## 3. DADOS COLETADOS — 7 TELAS DE PERGUNTAS

### Tela 1 — Cadastro da Empresa

| Campo | Tipo | Obrigatório |
|---|---|---|
| Razão Social | Texto livre | Sim |
| Nome Fantasia | Texto livre | Não |
| CNPJ | 14 dígitos + validação por dígito verificador | Sim |
| CNAE Principal | Texto livre | Não |
| Estado (UF) | Select — 27 estados | Não |
| Município | Texto livre | Não |
| Nome do Responsável | Texto livre | Não |
| Cargo / Função | Texto livre | Não |
| E-mail | E-mail | Não |
| Telefone / WhatsApp | Telefone | Não |

### Tela 2 — Perfil da Operação

| Campo | Opções |
|---|---|
| Setor | Indústria / Atacado-Distribuição / Varejo / Serviços / Agronegócio / Outros |
| Regime tributário | Simples Nacional / Lucro Presumido / Lucro Real |
| Faturamento anual | Até R$ 360 mil / R$ 360k–R$ 4,8mi / R$ 4,8mi–R$ 78mi / Acima de R$ 78 mi |
| Colaboradores | 1–10 / 11–50 / 51–200 / Acima de 200 |
| Estabelecimentos | 1 / 2–5 / 6–20 / Acima de 20 |
| O que a empresa vende | Produtos / Serviços / Ambos |
| Área geográfica | Apenas no meu estado / 2 a 5 estados / Nacional ou e-commerce |
| Regimes especiais | 18 opções (ver tabela abaixo) |

#### Regimes especiais — lista completa com benefício informado ao usuário

| Regime | Benefício informado ao usuário |
|---|---|
| Serviços de Saúde | 60% de redução |
| Medicamentos e Farmácias | 60% de redução / alíquota zero (lista CMED) |
| Educação | 60% de redução |
| Alimentos da Cesta Básica | Alíquota ZERO |
| Outros Alimentos | 60% de redução |
| Insumos Agropecuários | 60% de redução |
| Transporte Coletivo de Passageiros | 60% de redução |
| Profissional Liberal Regulamentado | 30% de redução (18 categorias) |
| Imóveis e Construção Civil | Regime específico com redutor social |
| Combustíveis e Lubrificantes | Regime monofásico com alíquota fixa |
| Hotelaria, Restaurantes e Turismo | 60% de redução |
| Cooperativa | Tratamento especial para atos cooperativos |
| Zona Franca de Manaus / ALC | Benefícios mantidos + crédito presumido |
| Higiene e Limpeza Essenciais | 60% de redução |
| Cultura, Arte e Entretenimento | 60% de redução / livros com alíquota zero |
| Bebidas Alcoólicas ou Açucaradas | ⚠ Imposto Seletivo ADICIONAL |
| Tabaco e Cigarro | ⚠ Imposto Seletivo ADICIONAL |
| Veículos, Embarcações ou Aeronaves | ⚠ Imposto Seletivo ADICIONAL |

### Tela 3 — Como a Empresa Vende

| Campo | Opções |
|---|---|
| Perfil de cliente | B2B / B2C / B2B+B2C |
| Canais de venda | Venda direta / E-commerce próprio / Marketplace / Distribuidores / Licitação pública |
| Serviços em múltiplos municípios | Sim / Não |
| Contratos de longo prazo (>12 meses) | Sim / Não |
| Sensibilidade de preço | Mercado-concorrência / Margem interna / Contrato fixo / Licitação |
| Exporta produtos ou serviços | Sim / Não |
| Opera em marketplace | Sim / Não |
| Contratos com o governo | Sim / Não |

### Tela 4 — Como a Empresa Compra

| Campo | Opções |
|---|---|
| Quantidade de fornecedores ativos | Até 10 / 10–20 / 20–50 / Acima de 50 |
| % fornecedores no Simples Nacional | Menos de 30% / 30%–60% / Mais de 60% / Não sei |
| Compra regularmente com NF | Sim / Parcialmente / Não |
| Principais despesas operacionais | Estoque/mercadorias / Folha de pagamento / Logística-frete / Tecnologia-software / Aluguel / Serviços PJ |
| Erros de cadastro nas NFs recebidas | Raramente / Às vezes / Com frequência |
| Importa produtos ou insumos | Sim / Ocasionalmente / Não |

**Anotações exibidas ao usuário sobre crédito IBS/CBS por tipo de despesa:**

| Despesa | Geração de crédito IBS/CBS informada |
|---|---|
| Estoque e mercadorias para revenda | Gera crédito integral |
| Folha de pagamento e encargos | NÃO gera crédito |
| Logística e frete | Gera crédito pelo CT-e do transportador |
| Tecnologia e licenças de software | Gera crédito se fornecedor for PJ |
| Aluguel e ocupação | Gera crédito apenas se locador for PJ |
| Serviços de terceiros / PJ | Gera crédito integral |

### Tela 5 — Sistemas e Emissão Fiscal

| Campo | Opções |
|---|---|
| ERP utilizado | SAP/TOTVS/Oracle/Sankhya / Bling/Omie/Tiny/Conta Azul / Sistema próprio / Planilha / Nenhum |
| Como emite documentos fiscais | Sistema integrado automático / Emissor gratuito/SEFAZ / Contador faz tudo |
| Tipos de documentos emitidos | NF-e / NFS-e / NFC-e / CT-e |
| Volume mensal de documentos | Até 50 / 50–100 / 100–500 / Acima de 500 |
| ERP integrado ao financeiro | Sim / Parcialmente / Não |
| Fornecedor do ERP comunicou plano para IBS/CBS | Sim com cronograma / Falou sem prazo / Não perguntamos / Não tem previsão |
| Cadastro de produtos padronizado (NCM/NBS) | Sim / Parcialmente / Não |
| Responsável interno pelo cadastro fiscal | Sim dedicado / Compartilhado / Não, depende do contador |

### Tela 6 — Financeiro, Preço e Caixa

| Campo | Opções |
|---|---|
| Meios de recebimento | PIX / Cartão crédito / Cartão débito / Boleto / TED-transferência / Crediário próprio |
| Prazo médio de recebimento | À vista / Até 30 dias / 30–60 dias / Acima de 60 dias |
| Margem de lucro aproximada | Até 5% / 5%–10% / 10%–20% / Acima de 20% |
| Capital de giro é apertado | Sim / Às vezes / Não |
| Facilidade de reajustar preços | Sim / Parcialmente / Difícil / Impossível |
| Conhece margem por produto | Sim (tem DRE por produto) / Parcialmente / Não |
| Conhece o Split Payment | Sim, entende e se prepara / Já ouviu falar / Não conhece |

**Descrição do Split Payment exibida ao usuário:**
> *"Mecanismo que retém o imposto no pagamento, antes do dinheiro chegar à sua conta."*

### Tela 7 — Governança e Maturidade

| Campo | Opções |
|---|---|
| Contratos longos têm cláusula de revisão tributária | Sim / Não / Não analisamos *(condicional — só aparece se contratos = sim)* |
| Quem cuida do fiscal hoje | Escritório contábil externo / Contador/analista interno / O próprio dono / Ninguém |
| Responsável interno pelo ERP | Sim (TI/sistemas) / Compartilhado / Não há |
| Diretoria acompanha a reforma | Sim ativamente / Conhece superficialmente / Não acompanha |
| Empresa já iniciou preparação | Sim, bem avançada / Iniciou mas no começo / Não iniciou |
| Houve treinamento interno | Sim, equipe treinada / Parcialmente / Não houve |
| Maturidade atual | Alta / Média / Baixa |
| Maior preocupação com a reforma | Custos / Preços / Sistemas / Fluxo de caixa / Fornecedores / Contratos / Não sabe por onde começar |

---

## 4. MOTOR DE DIAGNÓSTICO — 5 EIXOS E REGRAS DE PONTUAÇÃO

### 4.1 Estrutura dos eixos e pesos

| Eixo | Peso no Score Geral |
|---|---|
| Fiscal / Documental | 25% |
| Compras / Créditos | 20% |
| Comercial / Contratos | 20% |
| Financeiro / Caixa | 20% |
| Governança / Sistemas | 15% |

Score geral = média ponderada dos 5 eixos (0–100). Cada eixo é individualmente limitado a 100 pontos.

### 4.2 Níveis de risco

| Faixa de score | Nível |
|---|---|
| 0–19 | BAIXO |
| 20–44 | MODERADO |
| 45–69 | ALTO |
| 70–100 | CRÍTICO |

### 4.3 Eixo 1 — Fiscal / Documental

| Condição | Nível | Pontos | Título do risco | Ação indicada |
|---|---|---|---|---|
| ERP = planilha ou nenhum | CRÍTICO | +30 | Sistema fiscal inadequado para 2026 | Avaliar e contratar ERP imediatamente |
| Emissão = emissor gratuito ou contador | MODERADO | +10 | Emissão fiscal não integrada ao processo operacional | Avaliar integração da emissão NF-e ao fluxo |
| Cadastro de produtos desorganizado | ALTO | +20 | Cadastro de produtos sem padrão | Padronizar NCM/NBS dos 30 principais itens |
| Fornecedor ERP sem plano ou "não sei" | MODERADO | +12 | ERP sem plano de adaptação confirmado | Exigir cronograma escrito do fornecedor |
| Sem responsável interno pelo cadastro fiscal | MODERADO | +10 | Sem responsável interno pelo cadastro fiscal | Designar pessoa interna para interface com contador |
| Operação multi-estado (nacional) | ALTO | +15 | Operação multi-estado: alíquota varia por UF de destino | Confirmar com ERP cálculo de IBS por estado de destino |
| Tem Imposto Seletivo (bebidas, tabaco, veículos) | ALTO | +15 | Imposto Seletivo incide sobre seus produtos | Calcular IS na tabela de preços |
| B2B (vendas para empresas) | MODERADO | +8 | Clientes B2B exigem crédito integral — cadastro é crítico | Auditar dados fiscais de todos os itens vendidos para empresas |

### 4.4 Eixo 2 — Compras / Créditos

| Condição | Nível | Pontos | Título | Ação indicada |
|---|---|---|---|---|
| >60% fornecedores no Simples | ALTO | +22 | Maioria dos fornecedores com crédito limitado | Classificar fornecedores A/B/C e negociar |
| 30%–60% fornecedores no Simples | MODERADO | +10 | Parte dos fornecedores com crédito reduzido | Priorizar renegociações por volume |
| Campo `supplierRegimeType = simples_maioria` | ALTO | +15 | Cadeia de fornecimento com crédito sistematicamente reduzido | Mapear 10 fornecedores críticos |
| Erros em NFs recebidas = frequente | ALTO | +18 | Notas fiscais recebidas com erros frequentes | Programa de qualidade de NF, SLA 90 dias |
| Compras sem NF | CRÍTICO | +25 | Compras sem nota fiscal — crédito zero | Formalizar exigência de NF em todas as compras |
| Folha de pagamento = principal custo | ALTO | +20 | Folha de pagamento é custo principal — sem crédito | Simular impacto na margem e calibrar preços |
| Importações regulares | MODERADO | +8 | Importações: mecânica de crédito específica | Revisar com despachante as novas regras da LC 214/2025 |
| B2B + (>60% Simples OU sem NF regular) | — | +5 (boost silencioso) | — | (reforça pontuação; não gera novo item de risco) |

### 4.5 Eixo 3 — Comercial / Contratos

| Condição | Nível | Pontos | Título | Ação indicada |
|---|---|---|---|---|
| Contratos longos SEM cláusula de revisão | CRÍTICO | +25 | Contratos longos sem proteção tributária | Revisar com urgência e negociar cláusula (LC 214/2025, art. 378) |
| Contratos longos sem análise ("não sei") | ALTO | +15 | Situação dos contratos de longo prazo indefinida | Revisão jurídica imediata de todos os contratos |
| Setor = Serviços | ALTO | +18 | Setor de serviços: maior impacto proporcional da reforma | Revisar tabela de preços e projetar cenários antes de renovar contratos |
| B2C (vende para consumidor final) | MODERADO | +10 | Venda B2C: consumidor final absorve ou rejeita a carga | Desenvolver estratégia de comunicação e repasse gradual |
| Não conhece margem por produto | MODERADO | +8 | Sem visibilidade de margem por produto | Montar DRE por produto antes de definir estratégia de preço |
| Dificuldade ou impossibilidade de reajustar preços | MODERADO | +8 | Dificuldade estrutural de reajuste de preços | Identificar itens que permitem repasse e os que precisam ser descontinuados |
| Tem contratos com governo | MODERADO | +8 | Contratos públicos: equilíbrio econômico em risco | Analisar cláusulas e protocolar pedido de revisão |
| Multi-estado + B2B | MODERADO | +5 | Multi-estado B2B: preço varia por UF do cliente | Verificar se ERP suporta precificação com IBS variável por UF |

### 4.6 Eixo 4 — Financeiro / Caixa

| Condição | Nível | Pontos | Título | Ação indicada |
|---|---|---|---|---|
| Não conhece Split Payment | ALTO | +18 | Split Payment desconhecido — risco real de caixa | Simular impacto no fluxo de caixa |
| Conhece Split Payment superficialmente | MODERADO | +8 | Compreensão superficial do Split Payment | Treinamento aprofundado + simulação |
| Margem até 5% ou 5%–10% | ALTO | +22 | Margem de lucro vulnerável à reforma | Recalcular urgentemente estrutura de preços |
| Capital de giro apertado | ALTO | +18 | Capital de giro apertado — vulnerável ao Split Payment | Simular impacto e revisar limites com banco |
| B2C + margem apertada (<10%) | ALTO | +12 | B2C com margem apertada: risco de inviabilidade de produtos | Mapear 10 itens com menor margem |
| Não conhece margem por produto | MODERADO | +10 | Margem por produto desconhecida — risco de subsídio cruzado | Calcular margem líquida por produto |
| Dificuldade de reajustar preços | MODERADO | +10 | Dificuldade de reajustar preços comprime margem | Estratégia de repasse gradual |
| Regime = Lucro Presumido | MODERADO | +8 | Lucro Presumido será extinto gradualmente | Planejar transição com contador |

### 4.7 Eixo 5 — Governança / Sistemas

| Condição | Nível | Pontos | Título | Ação indicada |
|---|---|---|---|---|
| Ninguém cuida do fiscal | CRÍTICO | +25 | Nenhum responsável pelo tema fiscal/tributário | Definir responsável imediatamente |
| Diretoria não acompanha a reforma | ALTO | +20 | Diretoria não acompanha a reforma tributária | Apresentar briefing executivo com impactos quantificados |
| Preparação não iniciada | ALTO | +18 | Preparação para a reforma ainda não iniciada | Criar grupo de trabalho com cronograma |
| Sem treinamento interno | MODERADO | +12 | Equipe sem treinamento sobre a reforma | Planejar treinamento antes do 2º semestre de 2025 |
| Zero preparação + zero treinamento (combinado) | CRÍTICO | +15 | Zero preparação e zero treinamento — urgência máxima | Iniciar imediatamente: definir responsável, levantar impacto, criar cronograma |
| Sem responsável interno pelo ERP | MODERADO | +10 | Sem responsável interno pelo sistema (ERP) | Designar responsável para acompanhar adaptação |

---

## 5. OPORTUNIDADES IDENTIFICADAS (topOpportunity)

O sistema exibe uma única "maior oportunidade" baseada no perfil, seguindo esta hierarquia de prioridade:

1. **Redução especial (saúde, educação, cesta básica, medicamentos):**
   > *"Sua empresa tem direito a reduções de 60% ou alíquota zero no IBS/CBS. Formalize o enquadramento com o contador e inclua o benefício na tabela de preços para usar como argumento comercial."*

2. **Simples Nacional + B2B:**
   > *"Empresas do Simples que vendem B2B podem optar por recolher IBS/CBS separadamente do DAS — gerando crédito integral de 26,5% para os clientes. Isso é um diferencial comercial poderoso em relação a concorrentes que não oferecem crédito."*

3. **Indústria:**
   > *"A indústria é um dos setores mais favorecidos: não-cumulatividade plena permite crédito em praticamente todos os insumos, incluindo energia elétrica, logística e bens de capital — reduzindo a carga efetiva."*

4. **Exportador:**
   > *"Exportações têm imunidade total do IBS/CBS e os créditos acumulados são ressarcíveis pelo governo — isso pode melhorar significativamente o fluxo de caixa da empresa."*

5. **B2B com fornecedores em regime regular:**
   > *"Empresas B2B com fornecedores de regime regular aproveitam crédito integral de 26,5% em toda a cadeia de compras — o que é um diferencial de custo em relação a concorrentes com fornecedores do Simples."*

6. **Default (todos os outros casos):**
   > *"Monitore a regulamentação e mantenha o cadastro fiscal atualizado — empresas organizadas saem na frente."*

---

## 6. PLANO DE AÇÃO — ESTRUTURA E AÇÕES COMPLETAS

### 6.1 Estrutura de cada ação

Cada ação contém obrigatoriamente:

| Campo | Descrição |
|---|---|
| **Fase** | 1, 2 ou 3 |
| **Título** | O que fazer |
| **Desc** | Como fazer — instrução concreta passo a passo |
| **Motivo** | Por que é necessário — fundamentação |
| **Prazo** | Intervalo em dias |
| **Responsável** | Sugestão de quem deve executar |
| **Eixo** | A qual dimensão de diagnóstico pertence |
| **Prioridade** | urgente / alta / média / baixa |

### 6.2 Rótulos de fase e prazos

| Fase | Rótulo exibido | Prazo |
|---|---|---|
| 1 | Fase 1 — Ações Imediatas | 7 a 15 dias |
| 2 | Fase 2 — Curto Prazo | 30 a 60 dias |
| 3 | Fase 3 — Ações Estruturantes | 60 a 120 dias |

---

### 6.3 FASE 1 — Ações Imediatas

#### `define_responsible` — Definir responsável pelo tema fiscal/tributário
- **Condição:** Ninguém cuida do fiscal
- **Eixo:** Governança / Sistemas | **Prioridade:** Urgente
- **Desc:** *"Escolha uma pessoa interna ou escritório contábil com mandato claro para coordenar a adaptação à reforma. Documente o responsável por escrito com lista de entregas."*
- **Motivo:** *"Sem um ponto focal, as adaptações não terão dono. Tudo se atrasa e os riscos se acumulam sem controle."*
- **Responsável sugerido:** Diretoria / Sócios

#### `erp_adoption` — Contratar sistema de gestão com suporte a IBS/CBS
- **Condição:** Sem ERP ou usa planilha
- **Eixo:** Fiscal / Documental | **Prioridade:** Urgente
- **Desc:** *"Pesquise e contrate sistema com roadmap publicado para reforma tributária: Bling, Omie, Conta Azul, Tiny, TOTVS ou equivalente. Exija data de entrega da atualização antes de assinar."*
- **Motivo:** *"Sem ERP, a emissão de NF-e com os novos campos obrigatórios de IBS e CBS será tecnicamente inviável a partir de 2026."*
- **Responsável sugerido:** Diretoria / TI

#### `erp_contact` — Exigir cronograma técnico do fornecedor do sistema
- **Condição:** Sempre gerado
- **Eixo:** Fiscal / Documental | **Prioridade:** Urgente (ou Alta se já sem ERP)
- **Desc:** *"Envie e-mail formal ao suporte do ERP pedindo: (1) prazo de atualização, (2) versão com IBS/CBS, (3) campos NT 2025.002 suportados. Documente a resposta."*
- **Motivo:** *"Sem confirmação escrita do plano de adaptação, a empresa depende de uma atualização que pode não chegar a tempo para 2026."*
- **Responsável sugerido:** TI / Responsável de sistemas

#### `top30_items` — Mapear os 30 produtos/serviços com maior faturamento
- **Condição:** Sempre gerado
- **Eixo:** Fiscal / Documental | **Prioridade:** Alta
- **Desc:** *"Use o relatório de vendas dos últimos 6 meses. Para cada item, registre: código, descrição, NCM/NBS atual e faturamento mensal. Esta lista alimenta todas as simulações de preço."*
- **Motivo:** *"O impacto da reforma é calculado item a item. Sem essa lista priorizada, nenhuma simulação é possível."*
- **Responsável sugerido:** Comercial / Fiscal

#### `contracts_review` — Revisar contratos de longo prazo com assessoria jurídica
- **Condição:** Contratos longos SEM cláusula ou "não sei"
- **Eixo:** Comercial / Contratos | **Prioridade:** Urgente
- **Desc:** *"Liste todos os contratos acima de 12 meses. Para cada um, identifique se há cláusula de revisão por mudança tributária. Se não houver, solicite aditivo conforme LC 214/2025, art. 378."*
- **Motivo:** *"Contratos sem cláusula de revisão tributária obrigam a empresa a absorver sozinha toda a nova carga fiscal."*
- **Responsável sugerido:** Jurídico / Contador

#### `mgmt_briefing` — Apresentar briefing executivo à diretoria sobre a reforma
- **Condição:** Diretoria não acompanha a reforma
- **Eixo:** Governança / Sistemas | **Prioridade:** Alta
- **Desc:** *"Prepare apresentação de 15 minutos com: (1) o que muda, (2) impacto estimado na margem, (3) cronograma crítico, (4) investimentos necessários."*
- **Motivo:** *"Sem engajamento da liderança, as decisões estratégicas e os recursos necessários não serão priorizados."*
- **Responsável sugerido:** Contador / Responsável fiscal

#### `nf_formal` — Formalizar exigência de NF em todas as compras
- **Condição:** Compras sem nota fiscal
- **Eixo:** Compras / Créditos | **Prioridade:** Urgente
- **Desc:** *"Notifique todos os fornecedores por escrito que a emissão de NF será obrigatória a partir de agora. Suspendam pedidos de fornecedores que se recusarem."*
- **Motivo:** *"Aquisições sem NF não geram crédito de IBS/CBS — cada compra informal vira custo tributário permanente."*
- **Responsável sugerido:** Compras / Financeiro

---

### 6.4 FASE 2 — Curto Prazo

#### `governance_setup` — Organizar governança mínima para a reforma tributária
- **Condição:** Sempre gerado
- **Eixo:** Governança / Sistemas | **Prioridade:** Alta
- **Desc:** *"Defina: (1) responsável por eixo (fiscal, compras, comercial, financeiro), (2) frequência de reunião (quinzenal), (3) checklist de controle mensal."*
- **Motivo:** *"A reforma exige adaptação em múltiplas frentes simultaneamente. Sem coordenação, os times trabalham em silos."*
- **Responsável sugerido:** Diretoria / Gestor de área

#### `catalog_std` — Padronizar cadastro dos 30 principais itens com NCM/NBS
- **Condição:** Sempre gerado
- **Eixo:** Fiscal / Documental | **Prioridade:** Alta
- **Desc:** *"Para cada item da lista da Fase 1, valide: código único, descrição padronizada, NCM (mercadorias) ou NBS (serviços) correto, e regime tributário. Valide com contador."*
- **Motivo:** *"Cada item deve ter NCM/NBS correto para que o IBS/CBS seja calculado na alíquota certa. Erro de cadastro = alíquota errada."*
- **Responsável sugerido:** Fiscal / TI

#### `supplier_abc` — Mapear e classificar os 20 fornecedores mais relevantes
- **Condição:** Sempre gerado
- **Eixo:** Compras / Créditos | **Prioridade:** Alta
- **Desc:** *"Classifique em: A (regime regular, NF correta = crédito integral de 26,5%), B (Simples/MEI = crédito 4–8%), C (PF/informal = sem crédito). Calcule o impacto por classe."*
- **Motivo:** *"O crédito aproveitável em compras é diretamente proporcional ao regime dos fornecedores. Isso afeta toda a margem."*
- **Responsável sugerido:** Compras / Fiscal

#### `fiscal_routine` — Estruturar rotina de conferência fiscal semanal
- **Condição:** Sempre gerado
- **Eixo:** Fiscal / Documental | **Prioridade:** Média
- **Desc:** *"Reserve 1 hora semanal com o responsável fiscal para revisar: NFs emitidas e recebidas, erros de cadastro, créditos potenciais e obrigações pendentes."*
- **Motivo:** *"Erros fiscais descobertos após o fechamento custam mais caro. A rotina semanal evita acúmulo de problemas."*
- **Responsável sugerido:** Fiscal / Contador

#### `supplier_nf_quality` — Programa de qualidade de NF com fornecedores
- **Condição:** NFs com erros frequentes
- **Eixo:** Compras / Créditos | **Prioridade:** Alta
- **Desc:** *"Notifique formalmente os 5 fornecedores com mais erros. Estabeleça SLA: 90 dias para adequação. Forneça checklist com os campos críticos para IBS/CBS."*
- **Motivo:** *"Cada NF com erro é crédito de IBS/CBS comprometido — os erros de hoje viram perda financeira permanente em 2026."*
- **Responsável sugerido:** Compras / Fiscal

#### `marketplace_reform` — Contatar marketplace sobre adaptação e Split Payment
- **Condição:** Opera em marketplace
- **Eixo:** Comercial / Contratos | **Prioridade:** Alta
- **Desc:** *"Solicite ao marketplace: (1) plano de adaptação para IBS/CBS, (2) como funcionará o Split Payment na plataforma, (3) nova forma de repasse ao vendedor."*
- **Motivo:** *"O marketplace precisará adaptar o sistema de repasse. Sem clareza sobre como o Split Payment funcionará lá, o caixa é imprevisível."*
- **Responsável sugerido:** Comercial / TI

#### `export_rules` — Verificar imunidade e ressarcimento de créditos de exportação
- **Condição:** Exporta regularmente
- **Eixo:** Compras / Créditos | **Prioridade:** Média
- **Desc:** *"Confirme com o contador: (1) quais operações têm imunidade total de IBS/CBS, (2) como solicitar ressarcimento de créditos acumulados, (3) prazo de retorno."*
- **Motivo:** *"Exportações têm imunidade do IBS/CBS e créditos ressarcíveis. Isso pode melhorar o caixa — mas exige processo formal."*
- **Responsável sugerido:** Fiscal / Contador

#### `gov_contracts` — Analisar contratos públicos para revisão de equilíbrio
- **Condição:** Tem contratos com governo
- **Eixo:** Comercial / Contratos | **Prioridade:** Alta
- **Desc:** *"Para cada contrato com órgão público, verifique: (1) cláusula de equilíbrio econômico-financeiro, (2) possibilidade de pedido de revisão por mudança tributária, (3) prazo para protocolo."*
- **Motivo:** *"A nova carga pode romper o equilíbrio de contratos licitatórios. O pedido de revisão precisa ser protocolado dentro do prazo."*
- **Responsável sugerido:** Jurídico

#### `simples_option` — Avaliar opção por recolhimento de IBS/CBS fora do DAS
- **Condição:** Simples Nacional + B2B
- **Eixo:** Fiscal / Documental | **Prioridade:** Média
- **Desc:** *"Simule com o contador: se a empresa optar por recolher IBS/CBS separadamente do DAS, os clientes B2B recebem crédito integral de 26,5%. Compare o custo extra com o benefício comercial."*
- **Motivo:** *"A opção de recolhimento separado é um diferencial comercial poderoso e pode viabilizar contratos B2B que hoje seriam menos competitivos."*
- **Responsável sugerido:** Contador

#### `margin_calc` — Calcular margem líquida por produto/serviço principal
- **Condição:** Não conhece margem por produto
- **Eixo:** Financeiro / Caixa | **Prioridade:** Alta
- **Desc:** *"Monte DRE simplificada por produto: Receita − Custos diretos (insumos, NF, frete) − % rateio indireto = Margem líquida. Identifique quais itens têm margem negativa ou inferior a 5%."*
- **Motivo:** *"Sem saber a margem por item, é impossível identificar quais produtos serão inviabilizados pela nova carga tributária."*
- **Responsável sugerido:** Financeiro / Comercial

#### `multistate_erp` — Validar cálculo de IBS por estado de destino no ERP
- **Condição:** Operação nacional/multi-estado
- **Eixo:** Fiscal / Documental | **Prioridade:** Alta
- **Desc:** *"Com o fornecedor do sistema, confirme se o ERP consegue: (1) identificar o estado do comprador, (2) aplicar a alíquota de IBS correta por UF, (3) separar o débito por Comitê Gestor."*
- **Motivo:** *"O IBS usa o princípio do destino — cada UF terá uma alíquota diferente. Sem suporte do ERP, todas as NFs serão emitidas com alíquota errada."*
- **Responsável sugerido:** TI / Fiscal

---

### 6.5 FASE 3 — Ações Estruturantes

#### `pricing_formula` — Recalcular política de precificação para 2026
- **Condição:** Sempre gerado
- **Eixo:** Comercial / Contratos | **Prioridade:** Alta
- **Desc (B2B):** *"Fórmula base: Custo + Margem desejada = Preço Líquido. Preço Líquido ÷ (1 − alíquota efetiva) = Preço Bruto. Para B2B: destaque o crédito gerado como argumento comercial."*
- **Desc (B2C):** *"Fórmula base: Custo + Margem desejada = Preço Líquido. Preço Líquido ÷ (1 − alíquota efetiva) = Preço Bruto. Para B2C: comunique mudança de preço com antecedência mínima de 60 dias."*
- **Motivo:** *"A precificação para 2026 deve ser feita com a nova alíquota incorporada. Usar a fórmula antiga resulta em margem menor do que o planejado."*
- **Responsável sugerido:** Comercial / Financeiro

#### `split_simulation` — Simular impacto do Split Payment no fluxo de caixa
- **Condição:** Capital de giro apertado OU não conhece Split Payment
- **Eixo:** Financeiro / Caixa | **Prioridade:** Urgente
- **Desc:** *"Para cada meio de pagamento usado (PIX, cartão, boleto): calcule quanto será retido mensalmente, quando você receberá o restante, e quanto de capital de giro adicional precisará ter disponível."*
- **Motivo:** *"O Split Payment retém o imposto antes do dinheiro chegar à empresa. Com capital de giro apertado, este mecanismo pode gerar insolvência temporária."*
- **Responsável sugerido:** Financeiro / CFO

#### `nfe_test` — Testar emissão de NF-e com novos campos em homologação
- **Condição:** Sempre gerado
- **Eixo:** Fiscal / Documental | **Prioridade:** Alta
- **Desc:** *"No ambiente de homologação da SEFAZ, emita NF-e de teste com os novos grupos IBS/CBS (campos cClassTrib, cCredPres, grupo IBS/CBS). Registre erros e corrija antes da virada."*
- **Motivo:** *"A NF-e passará a exigir campos obrigatórios de IBS/CBS. Falhas na emissão em produção causam paralisação operacional."*
- **Responsável sugerido:** TI / Fiscal

#### `team_training` — Treinar equipes fiscal, comercial e financeira
- **Condição:** Sem treinamento interno
- **Eixo:** Governança / Sistemas | **Prioridade:** Média
- **Desc:** *"Módulos sugeridos: (1) Fiscal: novos campos NF-e e IBS/CBS; (2) Comercial: créditos de clientes e nova precificação; (3) Financeiro: Split Payment e capital de giro. Mínimo 4h cada equipe."*
- **Motivo:** *"Sem treinamento, erros operacionais aumentam na transição — nota emitida errada, crédito perdido, retrabalho fiscal."*
- **Responsável sugerido:** RH / Gestor de área

#### `b2c_pricing_comms` — Elaborar estratégia de comunicação de preços ao consumidor final
- **Condição:** B2C
- **Eixo:** Comercial / Contratos | **Prioridade:** Média
- **Desc:** *"Defina: (1) quais itens serão repassados, (2) cronograma de reajuste, (3) mensagem ao cliente (não abordar imposto em si, focar no valor entregue)."*
- **Motivo:** *"Consumidores finais são mais sensíveis a preço. Um repasse mal comunicado pode gerar cancelamentos e perda de clientes."*
- **Responsável sugerido:** Comercial / Marketing

#### `regime_transition` — Planejar transição do Lucro Presumido para regime não-cumulativo
- **Condição:** Regime = Lucro Presumido
- **Eixo:** Fiscal / Documental | **Prioridade:** Média
- **Desc:** *"Com o contador, avalie: (1) impacto da mudança de PIS/COFINS cumulativo para não-cumulativo pleno, (2) ajustes necessários nos controles, (3) oportunidades de crédito antes inacessíveis."*
- **Motivo:** *"O Lucro Presumido (PIS/COFINS cumulativos) será extinto. A migração para o regime não-cumulativo exige preparação de controles e processos."*
- **Responsável sugerido:** Contador / Financeiro

#### `final_validation` — Reunião de validação final com contador antes de 2026
- **Condição:** Sempre gerado
- **Eixo:** Governança / Sistemas | **Prioridade:** Alta
- **Desc (checklist):** *"Use este checklist: ☐ ERP atualizado e testado; ☐ Cadastros corretos (NCM/NBS, regimes); ☐ Contratos revisados; ☐ Política de preços publicada; ☐ Equipe treinada; ☐ Split Payment simulado."*
- **Motivo:** *"A validação final garante que nenhum ponto crítico foi esquecido antes da virada para o novo regime em 2026."*
- **Responsável sugerido:** Contador / Diretoria

---

## 7. CHECKLIST EXECUTIVO DE PRONTIDÃO (Tela 10 — Relatório Final)

12 itens com status verde (OK) ou vermelho (pendente), com barra de progresso percentual:

| # | Item | Condição para marcar como OK |
|---|---|---|
| 1 | CNPJ e razão social identificados | CNPJ preenchido válido |
| 2 | Responsável pelo tema fiscal definido | `taxResponsible ≠ ninguem` |
| 3 | Sistema de gestão (ERP) disponível | ERP ≠ planilha e ≠ nenhum |
| 4 | Fornecedor do ERP informado sobre IBS/CBS | `erpVendorReformPlan = sim_cronograma` |
| 5 | Cadastro de produtos padronizado (NCM/NBS) | `catalogStandardized = sim` |
| 6 | Compras realizadas com nota fiscal | `hasRegularNF = sim` |
| 7 | Fornecedores classificados por regime | `simplesSupplierPercent ≠ nao_sei` |
| 8 | Split Payment compreendido | `splitPaymentAware = sim_entendo` |
| 9 | Preparação iniciada | `preparationStarted ≠ nao` |
| 10 | Equipe treinada sobre a reforma | `hadInternalTraining ≠ nao` |
| 11 | Contratos de longo prazo revisados | `hasLongTermContracts = nao` OU `priceRevisionClause = sim` |
| 12 | Diretoria engajada no tema | `managementAwareOfReform = sim` |

---

## 8. PONTOS QUE REQUEREM REVISÃO TÉCNICA/JURÍDICA

Os itens a seguir são afirmações feitas pelo sistema que necessitam de confirmação técnica antes da publicação:

### 8.1 Alíquota de referência — 26,5%
O sistema usa esse valor como referência para crédito integral em toda a cadeia (fornecedores, classificação A/B/C, cálculo de precificação).
- **Verificar:** Se 26,5% é o valor correto e atualizado para a alíquota-referência combinada de IBS + CBS, conforme regulamentação vigente.

### 8.2 Crédito do Simples Nacional — "4% a 8%"
O sistema informa que fornecedores do Simples geram "créditos de 4–8%, não os 26,5% cheios" e os classifica como Classe B (crédito parcial).
- **Verificar:** Se o intervalo 4–8% está correto, qual o fundamento legal do crédito presumido para optantes do Simples, e se há regulamentação definitiva sobre o percentual exato.

### 8.3 LC 214/2025, art. 378 — Revisão de contratos
Citado como base para negociação de cláusula de revisão por desequilíbrio tributário em contratos privados de longo prazo.
- **Verificar:** Se o número do artigo está correto, se o dispositivo trata de contratos privados (não apenas contratos públicos), e qual é a redação exata.

### 8.4 Reduções de 60% por setor
O sistema informa "60% de redução" para: saúde (serviços), educação, outros alimentos, insumos agropecuários, transporte coletivo, hotelaria/restaurantes/turismo, higiene e limpeza, cultura/arte/entretenimento.
- **Verificar:** Se o percentual de 60% está correto para cada um desses setores conforme a LC 214/2025, ou se há diferenciação entre eles.

### 8.5 Alíquota zero — Cesta básica e livros
O sistema informa alíquota zero para alimentos da cesta básica e livros.
- **Verificar:** A lista exata de produtos da cesta básica com alíquota zero e se livros têm de fato alíquota zero ou apenas redução.

### 8.6 Medicamentos — "alíquota zero (lista CMED)"
O sistema informa "60% de redução / alíquota zero (lista CMED)" para medicamentos e farmácias.
- **Verificar:** Quais medicamentos têm alíquota zero (lista CMED) e quais têm 60% de redução. Se essa distinção está correta.

### 8.7 Profissional liberal — "30% de redução, 18 categorias"
- **Verificar:** Se a redução é de 30%, o número exato de categorias profissionais enquadradas e a lista das 18 categorias conforme a LC 214/2025.

### 8.8 Higiene e limpeza — "60% de redução"
- **Verificar:** Se produtos de higiene e limpeza essenciais têm 60% de redução ou alíquota zero, e se "sabão, detergente, papel higiênico, produtos de limpeza" estão na lista correta.

### 8.9 Extinção do Lucro Presumido
O sistema afirma: "O Lucro Presumido (PIS/COFINS cumulativos) será extinto."
- **Verificar:** Se o regime de Lucro Presumido como um todo será extinto ou apenas o regime de apuração do PIS/COFINS a ele associado (cumulativo) será substituído pelo IBS/CBS não-cumulativo. O IRPJ/CSLL pelo Lucro Presumido pode não ser afetado diretamente.

### 8.10 Campos NF-e citados — NT 2025.002 v1.34
O sistema menciona especificamente os campos: `cClassTrib`, `cCredPres` e "grupo IBS/CBS".
- **Verificar:** Se esses são os nomes técnicos exatos dos campos conforme a NT 2025.002 v1.34 e se a versão 1.34 é a versão atual.

### 8.11 Split Payment — LC 227/2026
O sistema atribui à LC 227/2026 a regulamentação do Split Payment e descreve sua incidência sobre PIX, cartão de crédito, cartão de débito, boleto bancário, transferência bancária/TED e venda a prazo própria.
- **Verificar:** Se a denominação "LC 227/2026" está correta, se a vigência e o escopo (meios de pagamento cobertos) estão corretos conforme o texto legal.

### 8.12 Transição — "2026 a 2033, vigência plena em 2033"
O sistema informa que a transição é gradual de 2026 a 2033 e que "alíquotas-teste" vigoram em 2026–2027.
- **Verificar:** O calendário exato de transição previsto na LC 214/2025, incluindo as alíquotas-teste, os percentuais por ano e a data de vigência plena.

### 8.13 Exportações — "imunidade total e créditos ressarcíveis"
O sistema informa imunidade total do IBS/CBS e que "créditos acumulados são ressarcíveis pelo governo."
- **Verificar:** Se a imunidade cobre integralmente IBS e CBS nas exportações, e o mecanismo de ressarcimento (prazo, procedimento, base legal).

### 8.14 Cooperativas — "tratamento especial para atos cooperativos"
- **Verificar:** Qual é o tratamento específico da LC 214/2025 para cooperativas e atos cooperativos, e se há distinção entre tipos de cooperativa (agro, crédito, trabalho).

### 8.15 Zona Franca de Manaus — "benefícios mantidos + crédito presumido"
- **Verificar:** Se os benefícios da ZFM foram de fato mantidos integralmente e o mecanismo de crédito presumido conforme a regulamentação.

### 8.16 Imóveis e Construção Civil — "regime específico com redutor social"
- **Verificar:** O regime específico aplicável e o que é o "redutor social" mencionado — se esse é o termo técnico correto da legislação.

### 8.17 Combustíveis — "regime monofásico com alíquota fixa"
- **Verificar:** O regime aplicável a combustíveis e lubrificantes, se é de fato monofásico e se a alíquota é fixa ou variável.

### 8.18 Setor de serviços — "carga pode subir 5–10x"
O sistema afirma no PDF: "O ISS atual (2–5%) será substituído pelo IBS/CBS. A carga pode subir significativamente, especialmente para empresas intensivas em mão de obra."
- **Verificar:** Se essa afirmação sobre a magnitude do aumento está tecnicamente precisa, considerando o regime de transição e as deduções aplicáveis.

### 8.19 Indústria — crédito de energia elétrica
O sistema informa que a não-cumulatividade plena permite crédito em "praticamente todos os insumos, incluindo energia elétrica, logística e bens de capital."
- **Verificar:** Se a energia elétrica gera crédito integral de IBS/CBS na indústria e se há restrições aplicáveis.

---

## 9. MAPEAMENTO COMPLETO DE CAMPOS DE DADOS (variáveis internas)

Para referência técnica, os nomes internos dos campos usados no motor de diagnóstico:

| Campo interno | Descrição |
|---|---|
| `sector` | Setor da empresa |
| `regime` | Regime tributário |
| `annualRevenue` | Faturamento anual |
| `employeeCount` | Número de colaboradores |
| `establishmentCount` | Número de estabelecimentos |
| `businessType` | Produtos / Serviços / Ambos |
| `geographicScope` | Escopo geográfico |
| `salesStates` | Estados de atuação |
| `specialRegimes` | Regimes especiais (array) |
| `operations` | B2B / B2C / B2B+B2C |
| `salesChannels` | Canais de venda (array) |
| `multiMunicipality` | Serviços em múltiplos municípios |
| `hasLongTermContracts` | Contratos de longo prazo |
| `priceSensitivity` | Sensibilidade de preço |
| `hasExports` | Exporta produtos/serviços |
| `hasMarketplace` | Opera em marketplace |
| `hasGovernmentContracts` | Contratos com governo |
| `supplierCount` | Quantidade de fornecedores |
| `simplesSupplierPercent` | % fornecedores no Simples |
| `supplierRegimeType` | Tipo predominante de regime dos fornecedores |
| `hasRegularNF` | Compra com NF regularmente |
| `mainExpenses` | Principais despesas (array) |
| `hasNFErrors` | Erros em NFs recebidas |
| `hasImports` | Importações |
| `erpSystem` | Sistema de ERP |
| `nfeEmission` | Forma de emissão de NF-e |
| `fiscalDocTypes` | Tipos de documentos fiscais (array) |
| `invoiceVolume` | Volume mensal de documentos |
| `erpIntegratedFinance` | ERP integrado ao financeiro |
| `erpVendorReformPlan` | Plano do fornecedor para IBS/CBS |
| `catalogStandardized` | Cadastro NCM/NBS padronizado |
| `internalFiscalResponsible` | Responsável interno pelo cadastro |
| `paymentMethods` | Meios de recebimento (array) |
| `avgPaymentTerm` | Prazo médio de recebimento |
| `profitMargin` | Margem de lucro |
| `tightWorkingCapital` | Capital de giro apertado |
| `easePriceAdjustment` | Facilidade de reajustar preços |
| `knowsMarginByProduct` | Conhece margem por produto |
| `splitPaymentAware` | Conhece o Split Payment |
| `priceRevisionClause` | Cláusula de revisão tributária em contratos |
| `taxResponsible` | Quem cuida do fiscal |
| `internalERPResponsible` | Responsável interno pelo ERP |
| `managementAwareOfReform` | Diretoria acompanha a reforma |
| `preparationStarted` | Preparação iniciada |
| `hadInternalTraining` | Treinamento interno realizado |
| `selfAssessedMaturity` | Maturidade autoavaliada |
| `mainConcern` | Maior preocupação com a reforma |

---

*Documento gerado em Março/2026 — REFORMA EM AÇÃO*
*Uso exclusivo para revisão técnica e jurídica do conteúdo do aplicativo*
