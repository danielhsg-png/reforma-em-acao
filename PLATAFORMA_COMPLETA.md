# REFORMA EM AÇÃO — Descrição Completa da Plataforma
*Documento para análise e aprimoramento por agente de IA*
*Gerado em: 17/03/2026*

---

## 1. VISÃO GERAL

**Nome da plataforma:** REFORMA EM AÇÃO  
**Público-alvo:** Donos de empresa, funcionários responsáveis pela operação fiscal e contadores  
**Objetivo:** Ajudar empresas brasileiras a entenderem e se prepararem para a Reforma Tributária (EC 132/2023, LC 214/2025, LC 227/2026)  
**Modelo de acesso:** Login obrigatório (não há auto-cadastro — o administrador cria usuários)  
**Base legal:** EC 132/2023, LC 214/2025, LC 227/2026, NT 2025.002 v1.34

---

## 2. TELA DE ENTRADA: HUB PRINCIPAL (`/inicio`)

Após login, o usuário cai no hub com 4 caminhos independentes:

### Caminho 1 — PLANO DE AÇÃO
- **O que é:** Diagnóstico personalizado + 8 módulos sequenciais de preparação
- **CTA:** "Criar Meu Plano"
- **Benefício exibido ao usuário:** "Saia com um roteiro claro do que fazer, quando fazer e por onde começar."

### Caminho 2 — SIMULADOR FINANCEIRO
- **O que é:** Simulação quantitativa de impacto tributário com parâmetros financeiros
- **CTA:** "Simular Agora"
- **Benefício:** "Tenha uma visão antecipada de como as novas regras podem afetar seus números."

### Caminho 3 — SIMULADOR SIMPLES NACIONAL
- **O que é:** Análise comparativa DAS vs. IBS/CBS fora do DAS; avaliação de permanecer ou migrar
- **CTA:** "Comparar Cenários"
- **Benefício:** "Descubra qual caminho pode ser mais vantajoso antes de tomar uma decisão."

### Caminho 4 — O QUE MUDA?
- **Status atual:** Em preparação (placeholder temporário)
- **Mensagem:** "Esta area sera destinada à consulta geral sobre as mudanças da Reforma Tributária, com informações introdutórias e conteúdos aplicáveis a diferentes tipos de cenário."

---

## 3. ONBOARDING / DIAGNÓSTICO: 11 PASSOS (`/plano-de-acao/avaliacao`)

O usuário preenche 11 perguntas divididas em 6 blocos. Os dados personalizam todo o Plano de Ação.

---

### BLOCO 1 — IDENTIFICAÇÃO (Passos 1 e 2)

#### Passo 1 — Identificação da Empresa
**Título:** "Identificação da Empresa"  
**Subtítulo:** "Informe os dados básicos do seu negócio para personalizar todo o plano de ação."

| Campo | Tipo | Obrigatório | Placeholder |
|-------|------|-------------|-------------|
| Nome da Empresa | Texto livre | Sim | "Ex: Minha Empresa LTDA" |
| CNPJ | Texto livre | Não | "00.000.000/0000-00" |

**Nota de contexto exibida:** "Ao final deste diagnóstico, você receberá um plano de ação personalizado com módulos estratégicos, cronograma de 51 dias e checklist de implementação."

---

#### Passo 2 — Setor Econômico
**Título:** "Setor Econômico"  
**Subtítulo:** "A Reforma impacta cada setor de forma diferente. Qual é o seu setor principal?"

| Opção | Descrição |
|-------|-----------|
| Indústria | Transformação, manufatura |
| Comércio Atacadista | Distribuição, revenda B2B |
| Comércio Varejista | Venda ao consumidor final |
| Serviços | Consultoria, tecnologia, saúde |
| Agronegócio | Produção rural, cooperativas |
| Outros Setores | Construção, transporte, etc. |

**Alerta contextual exibido:** "Por que importa: A indústria terá regime não-cumulativo pleno com créditos amplos. Serviços que hoje pagam ISS (2-5%) podem enfrentar alíquota de até 26,5%. O varejo será impactado pelo split payment obrigatório em cartão/PIX."

---

### BLOCO 2 — TRIBUTÁRIO (Passos 3 e 4)

#### Passo 3 — Regimes Especiais & Diferenciados
**Título:** "Regimes Especiais & Diferenciados"  
**Subtítulo:** "A LC 214/2025 criou regimes com alíquotas reduzidas ou específicas. Marque os que se aplicam ao seu negócio."

**Instrução:** "Marque todos os regimes especiais que se aplicam. Se nenhum se aplica, avance para o próximo passo."

| Grupo | Opção | Descrição | Impacto na Alíquota |
|-------|-------|-----------|---------------------|
| Saúde | Serviços de Saúde | Hospitais, clínicas, laboratórios, consultório médico/odontológico | 60% de redução (LC 214, art. 275) |
| Saúde | Dispositivos Médicos e Acessibilidade | Equipamentos hospitalares, próteses, órteses, dispositivos para PcD | 60% de redução (art. 276); alguns itens alíquota zero |
| Saúde | Medicamentos | Fabricação ou comércio de fármacos/remédios | 60% de redução; lista CMED pode ter alíquota zero (art. 277) |
| Educação | Serviços de Educação | Escolas, universidades, cursos técnicos, creches, educação infantil | 60% de redução (art. 274) |
| Alimentos | Cesta Básica Nacional | Arroz, feijão, farinha de mandioca/trigo, pão francês, leite, ovos, hortícolas | Alíquota ZERO para 22 itens (arts. 282-287) |
| Alimentos | Alimentos com Redução | Carnes, peixes, queijos, açúcar, farinha de aveia, óleo, manteiga, café | 60% de redução |
| Agropecuária | Insumos Agropecuários | Sementes, fertilizantes, defensivos, rações, implementos agrícolas | 60% de redução (art. 279) |
| Transporte | Transporte Coletivo de Passageiros | Ônibus urbano, metropolitano, intermunicipal, ferroviário | 60% de redução (art. 280) |
| Profissionais | Profissional Liberal Regulamentado | Advogados, contadores, engenheiros, arquitetos, médicos, dentistas, psicólogos | 30% de redução (18 categorias - LC 214/LC 227) |
| Imobiliário | Operações Imobiliárias | Venda de imóveis, incorporação, locação, loteamento, construção civil | Regime específico com redutor social (arts. 257-263) |
| Combustíveis | Combustíveis e Lubrificantes | Distribuidora, revenda de combustíveis, postos de gasolina | Regime monofásico com alíquota fixa por unidade (arts. 246-256) |
| Financeiro | Serviços Financeiros e Seguros | Bancos, cooperativas de crédito, seguradoras, operadoras de saúde | Regime específico cumulativo (arts. 264-268) |
| Cooperativas | Cooperativa | Cooperativa de qualquer natureza (agro, crédito, trabalho, consumo) | Tratamento especial para atos cooperativos (arts. 269-273) |
| ZFM | Zona Franca de Manaus / ALC | Opera na ZFM, ALC ou áreas de livre comércio da Amazônia | Manutenção de benefícios, crédito presumido (arts. 448-473) |
| Turismo | Hotelaria, Restaurantes e Parques | Hotéis, pousadas, bares, restaurantes, parques de diversão/temáticos | 60% de redução |
| Higiene | Produtos de Higiene e Limpeza | Sabão, detergente, papel higiênico, produtos de limpeza essenciais | 60% de redução (art. 278) |
| Cultura | Produções Artísticas e Culturais | Espetáculos, museus, cinema nacional, livros, música | 60% de redução; livros com alíquota zero |
| Defesa | Segurança Nacional e Defesa | Materiais de uso das Forças Armadas, segurança pública | Redução de alíquota específica |
| Imposto Seletivo | Bebidas Alcoólicas ou Açucaradas | Fabricação ou comércio de cervejas, destilados, refrigerantes | ⚠️ Alíquota ADICIONAL (IS - arts. 393-421) |
| Imposto Seletivo | Tabaco e Cigarros | Fabricação ou comércio de cigarros e derivados do tabaco | ⚠️ Alíquota ADICIONAL |
| Imposto Seletivo | Veículos, Embarcações, Aeronaves | Fabricação/importação de veículos, embarcações esportivas, jatinhos | ⚠️ Alíquota ADICIONAL |
| Imposto Seletivo | Extração de Minérios | Mineração, extração de petróleo e gás, minérios ferrosos e não ferrosos | ⚠️ IS 0,25% a 1% |

**Alerta para Imposto Seletivo:** "Os itens marcados estão sujeitos a um imposto adicional sobre produtos prejudiciais à saúde ou ao meio ambiente (LC 214, arts. 393-421)."

---

#### Passo 4 — Regime Tributário & Perfil de Compras
**Título:** "Regime Tributário & Perfil de Compras"  
**Subtítulo:** "O regime atual define como você será migrado ao IBS/CBS. O perfil dos fornecedores determina os créditos disponíveis."

**Campo 1 — Regime Tributário Atual**

| Opção | Nota contextual exibida |
|-------|------------------------|
| Simples Nacional (DAS unificado) | "A LC 214/25 permite optar por recolher IBS/CBS fora do DAS. Isso gera crédito integral para seus clientes B2B, tornando sua empresa mais competitiva." |
| Lucro Presumido (PIS/COFINS cumulativo) | "O Lucro Presumido será extinto gradualmente. Você passará ao regime não-cumulativo com direito a créditos, mas precisará de controle fiscal mais rigoroso." |
| Lucro Real (PIS/COFINS não-cumulativo) | (sem alerta adicional) |

**Campo 2 — Perfil de Fornecedores (Origem dos Insumos)**

| Opção | Descrição |
|-------|-----------|
| Maioria do Simples Nacional | Créditos limitados à alíquota efetiva do fornecedor |
| Maioria Lucro Real / Presumido | Créditos pela alíquota cheia de 26,5% |
| Mix equilibrado de fornecedores | Créditos variados conforme perfil de cada fornecedor |

---

### BLOCO 3 — OPERACIONAL (Passos 5, 6 e 7)

#### Passo 5 — Abrangência Geográfica
**Título:** "Abrangência Geográfica"  
**Subtítulo:** "Com o princípio do destino, o IBS será recolhido no estado do consumidor. Marque onde você atua."

**Campo:** Grade de checkboxes com todos os 27 estados/DF (AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO)

**Alerta dinâmico:** Se mais de 3 estados selecionados: "Atenção: operação em X estados exige planejamento de obrigações acessórias em cada jurisdição."

---

#### Passo 6 — Porte da Empresa
**Título:** "Porte da Empresa"  
**Subtítulo:** "Faturamento, equipe e margem de lucro determinam o impacto financeiro real da transição."

**Campo 1 — Faturamento Mensal Aproximado**

| Opção |
|-------|
| Até R$ 50 mil/mês |
| R$ 50 mil a R$ 100 mil/mês |
| R$ 100 mil a R$ 500 mil/mês |
| R$ 500 mil a R$ 1 milhão/mês |
| Acima de R$ 1 milhão/mês |

**Campo 2 — Número de Colaboradores**

| Opção |
|-------|
| 1 a 10 pessoas |
| 11 a 50 pessoas |
| 51 a 200 pessoas |
| Acima de 200 pessoas |

**Campo 3 — Margem de Lucro Líquida Estimada**

| Opção | Alerta exibido |
|-------|---------------|
| Até 5% (margem apertada) | ⚠️ "Com margem abaixo de 10%, qualquer aumento de carga tributária pode comprometer a viabilidade do negócio. Recalibração de preços e otimização de créditos serão prioridade máxima." |
| 5% a 10% | ⚠️ Mesmo alerta acima |
| 10% a 20% | (sem alerta) |
| Acima de 20% | (sem alerta) |

---

#### Passo 7 — Perfil de Clientes & Custos
**Título:** "Perfil de Clientes & Custos"  
**Subtítulo:** "Vendas B2B geram créditos para o comprador. O maior custo operacional define onde estão seus créditos mais valiosos."

**Campo 1 — Público principal**

| Opção | Descrição |
|-------|-----------|
| Empresas (B2B) | Seus clientes aproveitam créditos de IBS/CBS. |
| Consumidor Final (B2C) | Preço final inclui 26,5% de IVA Dual visível na nota. |
| Misto (B2B + B2C) | Duas estratégias de preço: com crédito e sem crédito. |

**Campo 2 — Maior custo operacional hoje**

| Opção | Nota de impacto |
|-------|-----------------|
| Folha de Pagamento | ⚠️ "Folha NÃO gera crédito de IBS/CBS. Empresas intensivas em mão de obra tendem a ter aumento de carga tributária efetiva." |
| Estoque / Mercadorias | Gera crédito |
| Logística e Frete | Gera crédito |
| Tecnologia e Licenças | Gera crédito parcial |
| Aluguel / Ocupação | Gera crédito se PJ |

---

### BLOCO 4 — SISTEMAS (Passos 8 e 9)

#### Passo 8 — Sistemas & Emissão Fiscal
**Título:** "Sistemas & Emissão Fiscal"  
**Subtítulo:** "A NF-e precisará de campos novos de IBS e CBS a partir de 2026. Como está sua operação fiscal hoje?"

**Campo 1 — Sistema de Gestão (ERP) Utilizado**

| Opção |
|-------|
| SAP / TOTVS / Oracle (grande porte) |
| Bling / Omie / Tiny / Conta Azul |
| Planilhas / Controle manual |
| Não uso sistema de gestão |
| Sistema próprio / desenvolvido internamente |

**Campo 2 — Como emite NF-e?**

| Opção | Descrição |
|-------|-----------|
| Sistema integrado emite automaticamente | ERP calcula impostos e transmite direto à SEFAZ |
| Emissor gratuito / portal da SEFAZ | Preenchimento manual ou semi-automatizado |
| Meu contador faz tudo | Terceirização completa da emissão fiscal |

**Campo 3 — Volume mensal de notas emitidas**

| Opção |
|-------|
| Até 50 notas/mês |
| 50 a 100 notas/mês |
| 100 a 500 notas/mês |
| Acima de 500 notas/mês |

---

#### Passo 9 — Perfil de Fornecedores
**Título:** "Perfil de Fornecedores"  
**Subtítulo:** "Fornecedores do Simples geram créditos limitados. Isso impacta diretamente seu custo final."

**Campo 1 — Quantos fornecedores ativos você tem?**

| Opção |
|-------|
| Até 10 fornecedores |
| 10 a 20 fornecedores |
| 20 a 50 fornecedores |
| Acima de 50 fornecedores |

**Campo 2 — Qual percentual dos seus fornecedores é do Simples Nacional?**

| Opção | Alerta exibido |
|-------|---------------|
| Menos de 30% | (sem alerta) |
| 30% a 60% | ⚠️ "Fornecedores do Simples geram crédito proporcional à alíquota efetiva deles (4-8%), não à cheia de 26,5%." |
| Mais de 60% | ⚠️ Mesmo alerta acima |
| Não sei informar | (sem alerta) |

---

### BLOCO 5 — PRONTIDÃO (Passo 10)

#### Passo 10 — Contratos & Maturidade Tributária
**Título:** "Contratos & Maturidade Tributária"  
**Subtítulo:** "Contratos antigos podem não prever a nova carga. Avalie também quem cuida da parte fiscal e o conhecimento sobre Split Payment."

*(campos completos do passo 10 capturados internamente — pergunta sobre contratos de longo prazo, quem gerencia fiscal, e nível de conhecimento sobre Split Payment)*

---

### BLOCO 6 — CONCLUSÃO (Passo 11)

#### Passo 11 — Diagnóstico Concluído
**Título:** "Diagnóstico Concluído"  
**Subtítulo:** "Analisamos seus dados com base na EC 132/2023, LC 214/2025 e LC 227/2026."

Ao concluir, o sistema salva os dados e redireciona para o Plano de Ação (Etapa 1: Visão Executiva).

---

## 4. PLANO DE AÇÃO: 8 ETAPAS SEQUENCIAIS

Cada etapa é uma página independente com o componente **PlanStepper** no topo (barra de progresso "Etapa N de 8"), botões de navegação Voltar/Próximo explícitos, e todo conteúdo disposto verticalmente sem tabs ou conteúdo oculto.

---

### ETAPA 1 — VISÃO EXECUTIVA (`/plano-de-acao/visao-executiva`)
**Contribui para o relatório:** Contexto geral

#### Seção: O Que Muda — Visão Geral da Transformação

| Coluna | Conteúdo |
|--------|----------|
| Sistema Antigo (extinto até 2033) | PIS/COFINS (Federal), IPI (Federal), ICMS (Estadual), ISS (Municipal). "5 tributos com legislações diferentes, 27 regulamentos de ICMS, mais de 5.500 regulamentos de ISS." |
| Período de Transição (2026-2033) | 2026: CBS 0,9% + IBS 0,1% (fase de teste). 2027: CBS plena, PIS/COFINS extintos. 2029-2032: ICMS/ISS reduzidos 10%/ano. 2033: ICMS e ISS extintos. IBS pleno. |
| Sistema Novo (IVA Dual) | CBS (Federal) ~8,8%. IBS (Estadual/Municipal) ~17,7%. IS (Imposto Seletivo) para itens específicos. Alíquota combinada de referência: 26,5%. Cálculo "por fora". |

#### Seção: Nova Lógica Tributária — Débito x Crédito
Explica a não-cumulatividade plena (LC 214/2025, arts. 28-47):
- **Débito:** Venda de R$ 100 × 26,5% = R$ 26,50 de débito
- **Crédito:** Compra de R$ 60 × 26,5% = R$ 15,90 de crédito
- **Resultado:** R$ 26,50 - R$ 15,90 = R$ 10,60 a recolher
- **Aviso:** "Se suas compras não forem documentadas corretamente (NF-e sem campos IBS/CBS), você perde o crédito e recolhe R$ 26,50 inteiros."

#### Seção: Regimes Especiais do Usuário (condicional)
Exibida apenas se o usuário selecionou regimes especiais no diagnóstico. Mostra cards com: nome do regime, percentual de redução, base legal.

#### Seção: Impacto no Negócio (personalizado)
3 métricas:
1. **Carga Tributária Efetiva:** "Aumento" — texto adaptado para B2B ou B2C
2. **Geração de Créditos:** "Ampliada" — explica não-cumulatividade plena
3. **Complexidade Sistêmica:** "Crítica" — duplo sistema 2026-2032

#### Seção: Diagnóstico Direto vs. Sugestões de Ação (personalizado)
- Diagnóstico baseado em operations (B2B ou B2C) e perfil de fornecedores
- Sugestões: auditoria de fornecedores + validar ERP

#### Seção: Cronograma de Ação
- Curto Prazo (2024-2025): Mapeamento de fornecedores, Budget de TI, Análise societária
- Médio Prazo (2026-2028): Transição inicial e testes CBS
- Longo Prazo (2029-2033): Extinção gradual ICMS/ISS

#### Card de PDF
Botão "Baixar Relatório em PDF" (exporta o plano via jsPDF)

#### Navegação
→ Próximo: Diagnóstico de Risco

---

### ETAPA 2 — DIAGNÓSTICO DE RISCO (`/plano-de-acao/diagnostico`)
**Contribui para o relatório:** Score de risco

#### Seção: Competitividade — Quem se Organiza Ganha
Dois cards comparativos:

**Empresas Organizadas em 2026:**
- Margens protegidas: conhecem o custo real e ajustam preços sem sustos
- Menos erros: cadastros padronizados = menos notas rejeitadas
- Crédito otimizado: sabem exatamente onde estão os créditos e o cClassTrib correto de cada item
- Negociação forte: clientes B2B preferem fornecedores que geram crédito integral
- Fluxo de caixa previsível: preparadas para o impacto do Split Payment no recebimento

**Empresas Desorganizadas em 2026:**
- Operando no escuro: não sabem o custo real até o fechamento
- Muitos erros: notas devolvidas, retrabalho, penalidades de 1%
- Crédito perdido: compras não-documentadas ou sem cClassTrib = sem crédito
- Descoberta tardia: só percebem o problema quando a margem já foi
- Clientes fogem: B2B migra para fornecedores que emitem nota correta e geram crédito

#### Alerta: Penalidade Automática de 1%
"Se a nota fiscal não tiver o IBS/CBS preenchido corretamente, a RFB aplica automaticamente uma penalidade de 1% sobre o valor da operação, sem aviso prévio e sem direito a defesa prévia (LC 214/2025, art. 63)."

**Exemplo prático:** "Se você emitir R$ 500.000/mês em notas sem os campos IBS/CBS, a penalidade será de R$ 5.000/mês (R$ 60.000/ano) de perda pura."

#### Seção: Checklist de Risco Operacional
8 itens para o usuário marcar (os que se aplicam à sua empresa hoje):

| # | Risco | Descrição |
|---|-------|-----------|
| 1 | Cadastro "Bagunçado" | Descrição ou unidade de medida errada, itens duplicados. Na reforma, cada item precisa de NCM/NBS e cClassTrib corretos para gerar crédito. |
| 2 | Notas sem Padrão de Fornecedores | Fornecedores usam descrições diferentes para o mesmo produto. A partir de 2026, notas sem campos IBS/CBS impedem a tomada de crédito. |
| 3 | Precificação sem Parâmetros | Não há regra clara de preços. Com o cálculo "por fora" e o Split Payment, cada venda sem fórmula definida é uma perda potencial de margem. |
| 4 | Loja Física e Internet com Cadastros/Preços Diferentes | O mesmo produto tem código/preço diferente em cada canal. Com o princípio do destino (IBS por estado), a complexidade aumenta exponencialmente. |
| 5 | Retrabalho no Fechamento | Precisa mexer em notas, cadastros e relatórios todo mês com o contador. Com validação automática da RFB em 2026, erros resultam em penalidade de 1% automática. |
| 6 | Falta de Rotina Semanal de Conferência | Ninguém revisa sistematicamente a saúde dos dados. Sem rotina, erros se acumulam e só aparecem no fechamento. |
| 7 | Fornecedor de Sistema sem Plano para IBS/CBS | Seu ERP/PDV não tem roadmap claro para a NT 2025.002. Sem atualização, você não emitirá NF-e com os novos campos obrigatórios a partir de 01/01/2026. |
| 8 | Contratos Longos sem Cláusula de Revisão Tributária | Contratos de fornecimento ou venda sem previsão de reequilíbrio tributário. A LC 214/2025 (art. 378) permite revisão, mas você precisa agir. |

**Score dinâmico:**
- 0-2 itens: Estado "Controlado" (verde)
- 3+ itens: Estado "AGIR JÁ" (vermelho)

**Se alto risco:** Card adicional explicando as consequências (notas devolvidas, penalidades de 1%, créditos perdidos, retrabalho)

#### Navegação
← Voltar: Visão Executiva | → Próximo: Sistemas e Cadastros

---

### ETAPA 3 — SISTEMAS E CADASTROS (`/plano-de-acao/sistemas`)
**Contribui para o relatório:** Prontidão tecnológica

#### Alerta Urgente
"A NT 2025.002 v1.34 já define os novos campos de NF-e para IBS/CBS. Seu fornecedor de ERP precisa estar preparado para testes em 2025, com suporte completo em janeiro de 2026. Se você esperar até 2026 para começar, será tarde."

#### Seção: Split Payment (Pagamento Cindido)
*LC 214/2025, arts. 50-55 | LC 227/2026*

3 modalidades explicadas:
- **Cartão de Crédito/Débito:** A adquirente (maquininha) retira automaticamente o IBS/CBS antes de repassar ao lojista.
- **PIX / Transferência:** Instituições financeiras farão a retenção automática em operações identificadas (B2B com NF-e vinculada).
- **Boleto Bancário:** Boletos registrados com NF-e vinculada terão o tributo retido na liquidação.

**Impacto no fluxo de caixa:** "Hoje você recebe 100% e recolhe o imposto depois. Com o Split Payment, o imposto é retido na hora. O caixa disponível diminui imediatamente."

#### Seção: Adequação do Emissor/ERP
5 tarefas com nível de impacto (Crítico/Alto/Médio):

| Tarefa | Impacto | Descrição |
|--------|---------|-----------|
| Contate seu fornecedor de ERP/PDV | Crítico | Pergunte: "Qual é o seu roadmap para a implementação de IBS/CBS? Quando teremos versão de teste com os novos campos da NT 2025.002?" |
| Solicite o plano de atualização para 2026 | Crítico | Peça por escrito um cronograma incluindo: novos campos de IBS/CBS na NF-e, cálculo "por fora", cClassTrib, cCredPres e vinculação ao pagamento (Split Payment). |
| Agende treinamento do fornecedor | Alto | Treinamento focado no novo fluxo: campos obrigatórios IBS/CBS, classificação tributária por item (cClassTrib), e como o sistema tratará o Split Payment. |
| Prepare ambiente de testes | Alto | Acesso a um ambiente de testes com alíquotas simuladas (CBS 0,9% + IBS 0,1% = 1,0%) para validar emissão de NF-e antes do go-live em 01/01/2026. |
| Verifique adequação para NFS-e (se presta serviços) | Alto | A NFS-e Nacional ganha novo layout para IBS/CBS (NT 004 e NT 005 SE-CGNFSe). Confirme se o município já aderiu ao padrão nacional. |

**Alerta condicional:** Se o usuário informou "Planilhas" ou "Não uso sistema" no diagnóstico: "O controle manual (planilhas) não suportará a complexidade do novo regime. A NF-e com campos IBS/CBS exige automação. Considere adotar um ERP (Bling, Omie, Tiny, Conta Azul) imediatamente."

#### Seção: Novos Campos Obrigatórios na NF-e
*(NT 2025.002 v1.34)*

Grid de campos críticos que todo sistema deve gerar:

| Campo | Significado | Consequência se ausente |
|-------|-------------|------------------------|
| cClassTrib | Classificação tributária do item (integral/reduzida/isenta/zero) | Perda de crédito ou penalidade de 1% |
| cCredPres | Indicador de crédito presumido (Simples Nacional) | Cliente B2B não reconhece crédito |
| CST (IBS/CBS) | Código de situação tributária | NF-e rejeitada |
| aliqCBS / aliqIBS | Alíquotas efetivas CBS e IBS | Campo obrigatório |
| vCBS / vIBS | Valores calculados de CBS e IBS por item | Campo obrigatório |
| cMunDest | Município de destino para IBS | Determina alíquota municipal |
| Vinculação Split | Chave de pagamento vinculada à NF-e | Sem vinculação = sem retenção automática |

#### Seção: Padrão de Cadastro Mínimo Obrigatório
4 tarefas para o usuário marcar como concluídas:

| Tarefa | Impacto | Descrição |
|--------|---------|-----------|
| Defina padrão de cadastro mínimo obrigatório | Crítico | Todo novo item DEVE ter: código único, descrição padronizada (com variações), unidade de medida fixa (UN, KG, LT), fornecedor principal, NCM/NBS, cClassTrib correto e cCredPres quando aplicável. |
| Auditoria do catálogo existente (Top 30 itens) | Alto | Revise os Top 30 itens mais vendidos. Procure por duplicatas, descrições inconsistentes, NCM/NBS incorretos e itens sem classificação tributária. |
| Implemente regra anti-duplicidade | Alto | Antes de criar novo cadastro, pesquise por código interno, descrição e fornecedor. |
| Treine a equipe responsável | Médio | Quem insere dados no catálogo precisa entender: por que padronizar descrições, como conferir NCM/NBS, e qual o impacto de um cClassTrib errado. |

**Card: O Que Todo Item DEVE Ter no Cadastro**

Campos obrigatórios (azul — risco operacional):
- Código Único
- Descrição Padronizada
- Unidade de Medida
- Fornecedor Principal

Campos críticos tributários (vermelho — risco de multa):
- NCM (Produtos) / NBS (Serviços)
- cClassTrib
- cCredPres (quando aplicável)

#### Navegação
← Voltar: Diagnóstico de Risco | → Próximo: Gestão de Fornecedores

---

### ETAPA 4 — FORNECEDORES (`/plano-de-acao/fornecedores`)
**Contribui para o relatório:** Mapa de créditos

#### Seção: Mapa de Geração de Créditos
*(LC 214/2025, arts. 28-47)*

| Categoria de Despesa | Crédito | Alíquota Efetiva | Observação |
|---------------------|---------|------------------|------------|
| Mercadorias para revenda | Alto | 26,5% | Crédito integral se fornecedor emite NF-e com IBS/CBS |
| Insumos industriais | Alto | 26,5% | Matérias-primas, embalagens, componentes |
| Energia elétrica | Alto | 26,5% | Novidade: antes só gerava crédito parcial (PIS/COFINS não-cumulativo) |
| Aluguel comercial (PJ) | Alto | 26,5% | Aluguel pago a pessoa jurídica gera crédito pleno. PF não gera. |
| Frete e logística | Alto | 26,5% | CT-e do transportador gera crédito. Conferir campos IBS/CBS no CT-e. |
| Softwares e licenças (SaaS) | Alto | 26,5% | Serviços de TI contratados de PJ geram crédito integral |
| Serviços tomados (B2B) | Alto | 26,5% | Contabilidade, limpeza, segurança, manutenção — se PJ com NF-e |
| Ativo imobilizado (máquinas, equipamentos) | Alto | 26,5% | Crédito integral no ato da aquisição (não mais em 48 parcelas) |
| Compras de fornecedores Simples Nacional | Médio | ~4-8% | Crédito limitado à alíquota efetiva recolhida pelo fornecedor no DAS |
| Folha de pagamento e encargos | Zero | 0% | Salários, FGTS, INSS NÃO geram crédito de IBS/CBS |
| Compras de pessoa física | Zero | 0% | Autônomos PF e produtores rurais PF (até R$ 3,6M) não geram crédito, salvo opção |
| Bens de uso pessoal / lazer | Zero | 0% | Alimentação de sócios, veículos particulares, entretenimento |

#### Seção: Estratégia Simples Nacional — Vale a Pena Migrar?
Comparação detalhada entre permanecer no Simples versus optar por recolher IBS/CBS fora do DAS para gerar crédito integral para clientes B2B.

#### Seção: Classificação de Fornecedores (A/B/C)
Ferramenta interativa para o usuário cadastrar seus fornecedores principais e classificá-los:
- **A:** Gera crédito alto (emite NF-e com todos os campos IBS/CBS)
- **B:** Gera crédito médio (Simples Nacional ou campos incompletos)
- **C:** Não gera crédito (pessoa física, planilha, sem NF-e)

O usuário pode adicionar fornecedores pelo nome e classificar cada um.

#### Navegação
← Voltar: Sistemas e Cadastros | → Próximo: Inteligência de Precificação

---

### ETAPA 5 — PRECIFICAÇÃO (`/plano-de-acao/precificacao`)
**Contribui para o relatório:** Estratégia de preços

#### Alerta Principal: Cálculo "Por Fora"
"Hoje o ICMS é calculado 'por dentro' (o imposto integra a própria base). Com o IBS/CBS, o cálculo é 'por fora': o imposto incide sobre o preço do produto, não sobre ele mesmo."
- **Antes:** Produto R$ 100 com 18% ICMS = R$ 100 já inclui R$ 18 de imposto.
- **Agora:** Produto R$ 100 + 26,5% = R$ 126,50. O tributo é destacado separadamente.

#### Seção: Estratégia B2B vs B2C

**B2B — Venda para Empresas:**
- O que muda: Seus clientes corporativos precisam tomar crédito de IBS/CBS. A nota correta com cClassTrib adequado gera crédito integral para o comprador.
- Vantagem: "Se você gera crédito de 26,5%, seu cliente efetivamente 'desconta' isso do imposto dele. Argumento poderoso de vendas."
- Tarefas para 2026:
  1. Garantir que NF-e tem todos os campos IBS/CBS preenchidos
  2. Trabalhar com preço líquido nas negociações: Preço Líquido + IBS/CBS = Preço Bruto
  3. Treinar equipe de vendas para falar sobre "transferência de crédito" como diferencial
  4. Se for Simples Nacional, avaliar opção de recolher IBS/CBS fora do DAS

**B2C — Venda para Consumidor Final:**
- O que muda: O consumidor final não toma crédito. O preço final inclui 26,5% de IVA destacado na nota. O Split Payment retira o imposto na hora (cartão/PIX), alterando o fluxo de caixa.
- Risco: "Hoje você recebe 100% e paga imposto depois. Com Split Payment, o imposto é retido na hora pelo intermediário financeiro."
- Tarefas para 2026:
  1. Simular o impacto do Split Payment no fluxo de caixa (usar Simulador Financeiro)
  2. Decidir estratégia de preços: manter preço atual absorvendo impacto, repassar aumento, ou reformular tabela
  3. Comunicar mudança aos clientes com antecedência
  4. Preparar capital de giro para absorver diferença no fluxo

#### Seção: Princípio do Destino
Com o IBS, o imposto é recolhido no estado/município do comprador, não do vendedor.

Impacto prático por tipo de empresa:
- **Venda local (mesmo estado):** Sem mudança relevante
- **Venda interestadual (B2B):** IBS calculado pela alíquota do estado de destino. A NF-e deve indicar cMunDest corretamente.
- **E-commerce B2C:** Cada venda terá alíquota diferente por estado de destino. O sistema precisa calcular automaticamente.
- **Marketplace:** A plataforma pode ser responsável pelo recolhimento do IBS.

#### Seção: Cashback Tributário (B2C)
A LC 214/2025 prevê devolução de parte do IBS/CBS para consumidores de baixa renda via CadÚnico.

**O que significa para o vendedor:**
- Não altera sua obrigação tributária diretamente
- O cashback é administrado pelo governo, não pelo vendedor
- Pode ser usado como argumento de marketing: "Compre aqui e receba cashback do governo"

#### Seção: Contratos de Longo Prazo
LC 214/2025, art. 378 — Permite revisão de contratos por desequilíbrio tributário.

**Ação recomendada:**
- Contratos com duração acima de 12 meses devem ter cláusula de revisão tributária
- Revisar contratos existentes antes de 2026
- Negociar inclusão de cláusula de reequilíbrio em todos os contratos novos

**Régua de impacto:**
- 0-2 anos: revisão possível
- 3-5 anos: revisão urgente
- 5+ anos: revisão crítica — risco de absorver toda a carga

#### Navegação
← Voltar: Fornecedores | → Próximo: Rotinas e Conciliações

---

### ETAPA 6 — ROTINAS SEMANAIS (`/plano-de-acao/rotinas`)
**Contribui para o relatório:** Checklist operacional

#### Seção: Rotina Semanal — Amostragem Crítica (30 minutos)
"Toda segunda-feira, reserve 30 minutos para revisar a saúde dos dados."

| # | Atividade | Duração | Checklist |
|---|-----------|---------|-----------|
| 1 | Top 20 Itens Mais Vendidos | ~10 min | Código OK? Descrição padrão? NCM correto? cClassTrib preenchido? Preço atualizado? |
| 2 | Top 10 Itens Mais Comprados | ~10 min | Divergências nas notas de fornecedores: descrição diferente, NCM/NBS divergente, ausência de campos IBS/CBS |
| 3 | Registrar Divergências por Fornecedor | ~5 min | Corrigir imediatamente no cadastro. Registrar qual fornecedor enviou nota com problema. Atualizar classificação A/B/C. |
| 4 | Conferência de NF-e: Campos IBS/CBS | ~5 min | NF-e emitidas na semana com campos do grupo IBS/CBS: cClassTrib, alíquota CBS, alíquota IBS (UF e município), base de cálculo e valores. |

#### Seção: Conciliação Semanal por Canal (1 hora)
"Feche a conta matemática: Vendido × Recebido × Devolvido × Taxas = Saldo Líquido"

| Canal | O que conferir |
|-------|---------------|
| Loja Física | Vendas em PDV. Verificar se o Split Payment reteve o valor correto de IBS/CBS nas vendas por cartão. |
| Website / E-commerce | Vendas online via gateway. O IBS é do estado do comprador (destino). Conferir a alíquota aplicada por estado. |
| Marketplace | A plataforma pode reter IBS/CBS antes de repassar. Verificar o relatório de repasses. |
| Televendas / Representante | Boletos registrados com NF-e vinculada terão Split Payment. Confirmar o recebimento líquido. |

#### Seção: Rotina Mensal com Contador (1 hora)

**Pauta da Reunião Mensal:**
- Quantidade de NF-e rejeitadas no mês e motivos
- Volume de créditos IBS/CBS tomados vs. débitos gerados
- Saldo de créditos acumulados (se houver)
- Novidades normativas (RFB, Comitê Gestor do IBS)
- Status do Split Payment: retenções corretas?

**Indicadores para Acompanhar:**
- Taxa de rejeição de NF-e (meta: < 1%)
- % de fornecedores com nota completa (meta: > 90%)
- Margem efetiva por produto após novo tributo
- Diferença entre imposto retido (Split) e imposto devido
- Prazo médio de aproveitamento de créditos

**Cronograma Sugerido:**
- 2ª Feira, 08:00 — Rotina Semanal de Auditoria (30 min)
- 4ª Feira, 14:00 — Conciliação Financeira por Canal (1 hora)
- Último dia útil do mês — Reunião com Contador (1 hora)

#### Navegação
← Voltar: Precificação | → Próximo: Cronograma de Implementação

---

### ETAPA 7 — CRONOGRAMA (`/plano-de-acao/cronograma`)
**Contribui para o relatório:** Roadmap executivo

Roadmap prático de **51 dias** em 3 fases, com tarefas marcáveis e barra de progresso.

#### Fase 1 — O Essencial (Próximos 7 Dias)
*Foco: Eliminar os riscos críticos identificados no diagnóstico*

Inclui tarefas como: contatar fornecedor de ERP, definir padrão de cadastro, identificar Top 20 fornecedores.

#### Fase 2 — Organização (Dias 8 a 30)
*Foco: Implementar as rotinas e ajustar processos*

Inclui: auditoria de catálogo, classificação A/B/C de fornecedores, implementar rotina semanal, revisar contratos.

#### Fase 3 — Validação (Dias 31 a 51)
*Foco: Testar, medir e ajustar antes de 2026*

Inclui: ambiente de testes com ERP, simulação de emissão de NF-e com novos campos, treinamento da equipe, reunião de validação com contador.

#### Navegação
← Voltar: Rotinas | → Próximo: Checklist Final

---

### ETAPA 8 — REVISÃO FINAL (`/plano-de-acao/checklist`)
**Contribui para o relatório:** Relatório PDF final

#### Medidor de Prontidão
Barra de progresso mostrando "X de 9 Itens Concluídos" e percentual "Pronto para 2026". Os dados são salvos no banco de dados PostgreSQL.

#### 9 Indicadores Críticos
Cada um com 3 opções de resposta: ✅ Sim | ❌ Não | 🔄 Em Validação

| # | Indicador |
|---|-----------|
| 1 | O sistema tem plano IBS/CBS para 2026? |
| 2 | O responsável por cadastro/emissão/conferência está definido? |
| 3 | O mapeamento das Top 30 mercadorias está pronto? |
| 4 | A classificação (A/B/C) dos Top 20 fornecedores está pronta? |
| 5 | O padrão de cadastro está ativo? |
| 6 | A rotina semanal de conferência está rodando? |
| 7 | As regras de preço e desconto estão definidas? |
| 8 | A conciliação por canal está ativa? |
| 9 | A prioridade nº 1 dos próximos 14 dias está definida? |

**Status dinâmico:**
- ≥ 80% Sim: "Excelente! Você Está Pronto" (verde)
- 50-79% Sim: "Atenção: Há Tarefas Críticas Pendentes" (âmbar)
- < 50% Sim: "Aviso: Preparação Insuficiente — Concentre a próxima semana nas Fases 1 e 2 do Cronograma." (vermelho)

#### Aviso Legal
"Este aplicativo fornece orientação prática de preparação operacional, fundamentada em normas públicas (EC 132/23, LC 214/25, LC 227/26). As ações sugeridas NÃO substituem: validação técnica do seu contador ou auditor, análise jurídica de contratos por advogado tributarista, testes de integração com seu fornecedor de sistema, consulta específica sobre seu regime tributário e setor."

#### Ações Finais
- Botão: "PDF" — Exporta o relatório completo
- Botão: "Ver Dashboard Executivo" — Retorna à Etapa 1

#### Navegação
← Voltar: Cronograma | + Baixar PDF | Ver Dashboard Executivo

---

## 5. FERRAMENTAS INDEPENDENTES

### 5.1 SIMULADOR FINANCEIRO (`/simulador-financeiro`)

Ferramenta separada do plano. Permite comparar cenários numéricos.

**Inputs (formulário lateral):**
- Regime atual (Simples / Lucro Presumido / Lucro Real)
- Faturamento mensal (faixas)
- Margem de lucro estimada (faixas)
- Custo de insumos (% do faturamento)
- Tipo de operação (B2B / B2C)
- Regimes especiais (se houver)

**Outputs (visualização):**
- Cenário Tributário Estimado: comparação ano a ano 2026-2033 com alíquotas de transição
- Tab "Split Payment": impacto no fluxo de caixa com retenção automática
- Breakdown de créditos disponíveis

---

### 5.2 SIMULADOR SIMPLES NACIONAL (`/simulador-simples`)

Wizard de 7 passos (collapsible em blocos) para análise profunda do Simples Nacional.

**Passo 1 — Dados Básicos**
- Anexo do Simples (I ao V)
- RBT12 (Receita Bruta dos últimos 12 meses)
- Faturamento mensal atual
- Ano de referência

**Passo 2 — Folha e Pró-labore**
- Valor da folha de pagamento
- Pró-labore dos sócios
- Encargos trabalhistas
- Sazonalidade (% de variação)
- Cálculo automático do Fator R

**Passo 3 — Perfil Comercial**
- % de vendas B2B vs B2C
- % de clientes contribuintes (PJ)
- Sensibilidade dos clientes ao preço
- Valorização do crédito pelo cliente (para B2B)

**Passo 4 — Compras e Créditos**
- Valor de insumos mensais
- % de fornecedores no Simples Nacional
- % de fornecedores no Lucro Real/Presumido
- Despesas creditáveis adicionais (%)
- Concentração de fornecedores (% no maior)

**Passo 5 — Margem e Contratos**
- Margem bruta estimada (%)
- Margem líquida estimada (%)
- Contratos de longo prazo (sim/não)
- Há cláusula de reajuste tributário?
- Facilidade de repasse de aumento ao cliente

**Passo 6 — Complexidade Operacional**
- Tem ERP? (sim/não/planilha)
- Emissão fiscal (sistema integrado / manual / contador)
- Volume de notas por mês
- Opera interestadual?
- Tem filiais?
- Nível de suporte contábil (nenhum / básico / completo)

**Passo 7 — Resultado (Veredito)**

Resultado dividido em:
1. **Card de Veredito:** Recomendação de "Permanecer no Simples" ou "Considerar Sair"
2. **Índice de Confiança:** % de certeza da recomendação
3. **Card de Fatores:** Top fatores que levaram à decisão (positivos e negativos)
4. **Card de Atenção:** Alertas específicos para o perfil da empresa

Duas tabs de detalhamento:
- **Detalhamento Numérico:** Comparação DAS vs. IBS/CBS fora do DAS com créditos detalhados
- **Impacto nos Clientes:** Análise B2B do impacto nos clientes com perfil comercial

---

## 6. DADOS COLETADOS E COMO SÃO USADOS

| Campo | Uso no plano |
|-------|-------------|
| companyName | Aparece no título de todas as páginas do plano |
| sector | Personaliza alertas e recomendações (indústria vs. varejo vs. serviços) |
| specialRegimes | Exibe seção "Seus Regimes Especiais" na Etapa 1; ajusta alíquotas no Simulador |
| regime (Simples/LP/LR) | Personaliza recomendações de migração e créditos |
| purchaseProfile | Personaliza diagnóstico de risco e mapa de créditos |
| salesStates | Ativa alertas de complexidade interestadual |
| monthlyRevenue | Dimensiona impacto financeiro |
| employeeCount | Contextualiza porte |
| profitMargin | Ativa alertas de margem apertada |
| operations (B2B/B2C/misto) | Personaliza toda a estratégia de precificação |
| costStructure | Identifica créditos mais valiosos vs. custos sem crédito |
| erpSystem | Ativa alertas sobre planilha/controle manual |
| nfeEmission | Avalia maturidade fiscal |
| invoiceVolume | Dimensiona risco de penalidades |
| supplierCount | Dimensiona complexidade da auditoria de fornecedores |
| simplesSupplierPercent | Ativa alertas sobre perda de crédito |
| riskScore | Calculado na Etapa 2; armazenado para o relatório |
| checklist (9 itens) | Persiste no banco de dados PostgreSQL por empresa |

---

## 7. ESTRUTURA TÉCNICA

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Express.js + TypeScript
- **Banco de dados:** PostgreSQL com Drizzle ORM
- **Autenticação:** express-session + bcryptjs (sessão server-side, cookie-based, 7 dias)
- **Exportação:** PDF via jsPDF
- **Roteamento frontend:** wouter (português)

---

## 8. PONTOS DE MELHORIA IDENTIFICADOS PARA ANÁLISE DO AGENTE

A seguir, as áreas mais relevantes para aprimoramento de informações, experiência e preenchimento:

### 8.1 Diagnóstico (Onboarding)
- **Passo 9 (Fornecedores):** O usuário pode não saber o percentual exato de fornecedores no Simples. A opção "Não sei informar" já existe — mas talvez valha simplificar ou trocar por uma pergunta mais concreta ("Você costuma comprar de mercearias/autônomos/pequenos prestadores locais?" → inferência).
- **Passo 10 (Contratos & Maturidade):** O conteúdo completo deste passo não está totalmente descrito neste documento — seria relevante revisá-lo.
- **Passo 5 (Abrangência):** 27 checkboxes de estados pode ser excessivo para quem opera apenas localmente. Poderia ter opção "Apenas meu estado" como atalho.

### 8.2 Plano de Ação — Conteúdo
- **Etapa 1 (Visão Executiva):** Muito conteúdo educacional — pode ser simplificado para dono de negócio não-técnico.
- **Etapa 3 (Sistemas):** Os campos de NF-e (cClassTrib, cCredPres, CST) são técnicos demais para quem não é contador. Poderia ter explicação mais acessível ou glossário.
- **Etapa 4 (Fornecedores):** O cadastro de fornecedores está em memória (não persiste no banco). Um usuário que sai e volta perde o trabalho.
- **Etapa 5 (Precificação):** Não há calculadora interativa de preços. O usuário lê sobre como recalcular, mas não faz o cálculo na tela.
- **Etapa 7 (Cronograma):** As tarefas são pré-definidas e não personalizadas com base no score de risco do usuário.

### 8.3 Experiência Geral
- Os botões de navegação "Próximo" estão sempre habilitados — o usuário pode avançar sem ler nada. Não há validação obrigatória por etapa.
- O relatório PDF existe mas não foi descrito em detalhe aqui. Vale verificar se cobre todos os 8 módulos.
- A "O QUE MUDA" está em preparação — é um espaço vazio que poderia confundir o usuário sobre o valor da plataforma.

---

*Fim do documento. Total de 11 perguntas de diagnóstico + 8 módulos do plano + 2 simuladores independentes.*
