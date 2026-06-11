import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

/**
 * Política de Privacidade — Reforma em Ação (VEG TAX)
 * Versão 1.0 — Vigência a partir de 04/05/2026
 * Conteúdo integral. Página pública (acessível com e sem login).
 */
export default function PrivacidadePage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header navy */}
      <header className="bg-[#0f1e35] text-white">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            data-testid="link-back-privacidade"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <span className="text-xs font-semibold tracking-wide text-slate-300">
            REFORMA EM AÇÃO
          </span>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-5 py-10 md:py-14">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-8 md:px-10 md:py-12">
          {/* Título */}
          <div className="border-b border-slate-200 pb-6 mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#f97316] mb-2">
              Plataforma Digital Reforma em Ação
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f1e35]">
              Política de Privacidade
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Versão 1.0 — Vigência a partir de 04/05/2026
            </p>
          </div>

          {/* Corpo */}
          <div className="text-[15px] leading-relaxed text-slate-700 space-y-4">
            <p>
              A VEG TAX CONSULTORIA TRIBUTARIA E GESTAO EMPRESARIAL LTDA (&#8220;VEG TAX&#8221;) é
              comprometida com a transparência, a segurança e o respeito aos direitos dos titulares
              de dados pessoais. Esta Política de Privacidade descreve como coletamos, utilizamos,
              armazenamos, compartilhamos e protegemos os dados pessoais no âmbito da plataforma
              &#8220;Reforma em Ação&#8221;, em conformidade com a Lei nº 13.709/2018 (LGPD) e com o
              Marco Civil da Internet (Lei nº 12.965/2014).
            </p>
            <p>Esta Política integra os Termos de Uso da Plataforma e deve ser lida em conjunto com eles.</p>

            {/* 1 */}
            <Secao titulo="1. IDENTIFICAÇÃO DO CONTROLADOR E DO ENCARREGADO (DPO)" />
            <Sub titulo="1.1 Controlador dos Dados Pessoais" />
            <p>Razão social: VEG TAX CONSULTORIA TRIBUTARIA E GESTAO EMPRESARIAL LTDA</p>
            <p>CNPJ: 50.597.209/0001-52</p>
            <p>Endereço: Rua Coronel Batista, nº 415, Sala 503, Centro, Anápolis/GO — CEP 75.020-080</p>
            <p>E-mail oficial: contato@drdanielguimaraes.com.br</p>
            <p>Telefone: (62) 99222-8431</p>
            <p>Site da Plataforma: app.reformaemacao.com.br</p>
            <Sub titulo="1.2 Encarregado pelo Tratamento de Dados Pessoais (DPO)" />
            <p>Nome: Daniel Henrique de Souza Guimarães</p>
            <p>E-mail: contato@drdanielguimaraes.com.br</p>
            <p>
              O Encarregado é o canal de comunicação entre a VEG TAX, os titulares de dados e a
              Autoridade Nacional de Proteção de Dados (ANPD), nos termos do art. 41 da LGPD.
            </p>

            {/* 2 */}
            <Secao titulo="2. DEFINIÇÕES" />
            <p>Para fins desta Política, adotam-se as definições do art. 5º da LGPD:</p>
            <p>(i) Dado pessoal: informação relacionada a pessoa natural identificada ou identificável;</p>
            <p>
              (ii) Dado anonimizado: dado relativo a titular que não possa ser identificado,
              considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu
              tratamento;
            </p>
            <p>
              (iii) Tratamento: qualquer operação realizada com dados pessoais, como coleta,
              armazenamento, uso, compartilhamento ou exclusão;
            </p>
            <p>
              (iv) Controlador: pessoa natural ou jurídica que toma as decisões referentes ao
              tratamento de dados pessoais;
            </p>
            <p>(v) Operador: pessoa natural ou jurídica que realiza o tratamento em nome do controlador;</p>
            <p>(vi) Titular: pessoa natural a quem se referem os dados pessoais objeto de tratamento;</p>
            <p>
              (vii) Encarregado (DPO): pessoa indicada pelo controlador para atuar como canal de
              comunicação entre o controlador, os titulares e a ANPD;
            </p>
            <p>
              (viii) Consentimento: manifestação livre, informada e inequívoca pela qual o titular
              concorda com o tratamento de seus dados pessoais para uma finalidade determinada.
            </p>

            {/* 3 */}
            <Secao titulo="3. DADOS PESSOAIS QUE COLETAMOS" />
            <Sub titulo="3.1 Dados do Assinante" />
            <p>
              No momento do cadastro e durante o uso da Plataforma, coletamos e armazenamos os
              seguintes dados do Assinante:
            </p>
            <p>
              Cadastro e conta: nome completo, endereço de e-mail, número de telefone, senha
              (armazenada exclusivamente em formato de hash bcrypt — a senha em texto claro jamais é
              armazenada pela VEG TAX) e papel/função na Plataforma.
            </p>
            <p>
              Personalização white-label (quando preenchidos pelo Assinante): nome do escritório ou
              profissional, telefone e e-mail de contato profissional, endereço do site, registro
              profissional (CRC ou OAB) e logotipo (imagem em formato Base64).
            </p>
            <p>
              O titular é responsável pela veracidade, exatidão e atualização dos dados que fornece à
              Plataforma. Dados desatualizados podem comprometer a prestação do serviço e o
              recebimento de comunicações importantes.
            </p>
            <Sub titulo="3.2 Dados de Pagamento" />
            <p>
              Os dados financeiros do Assinante — número do cartão de crédito, data de validade,
              código CVV, nome do titular do cartão, CPF/CNPJ, endereço completo de cobrança e
              telefone — são inseridos diretamente na interface da Pagar.me, tokenizados no navegador
              do Assinante, sem serem armazenados nos servidores da VEG TAX.
            </p>
            <p>
              O CPF trafega pela transação quando o pagamento é realizado por pessoa física, sendo
              transmitido exclusivamente à Pagar.me e não persistido no banco de dados da VEG TAX.
            </p>
            <p>São armazenados na Plataforma apenas os seguintes dados de referência de pagamento:</p>
            <p>(i) Identificador do cliente na Pagar.me (pagarme_customer_id);</p>
            <p>(ii) Identificador da assinatura na Pagar.me (pagarme_subscription_id);</p>
            <p>(iii) Plano contratado e status da assinatura.</p>
            <Sub titulo="3.3 Dados das Empresas Diagnosticadas" />
            <p>
              Na jornada de diagnóstico, o Assinante insere dados relativos às Empresas
              Diagnosticadas — clientes do Assinante. Esses dados são coletados e armazenados na
              Plataforma, podendo incluir: razão social, CNPJ, setor de atividade, regime tributário,
              natureza das operações, perfil de compras, estados de atuação, estrutura de custos,
              faturamento mensal, número de funcionários, margem de lucro, sistema ERP, informações
              sobre emissão de notas fiscais eletrônicas, volume de notas, número e perfil de
              fornecedores, contratos de longo prazo, cláusulas de revisão de preços, responsável
              tributário, ciência sobre o mecanismo de split payment, regimes especiais aplicáveis,
              pontuação de risco e dados complementares.
            </p>
            <p>
              Via consulta automática à BrasilAPI pelo CNPJ informado, podem ser obtidos dados
              cadastrais públicos da empresa (razão social, endereço, etc.).
            </p>
            <p>
              A maioria dos dados se refere a pessoas jurídicas. Contudo, CNPJ vinculado a MEI ou
              informações sobre responsáveis tributários podem se referir a pessoas naturais
              identificáveis, estando sujeitos à proteção da LGPD.
            </p>
            <p>
              Na relação com as Empresas Diagnosticadas, o Assinante atua como controlador dos dados e
              a VEG TAX como operadora, conforme detalhado nos Termos de Uso. Os titulares desses dados
              devem direcionar suas solicitações primeiramente ao Assinante responsável pelo
              diagnóstico.
            </p>
            <Sub titulo="3.4 Dados de Navegação e Técnicos" />
            <p>
              Cookie de sessão: A Plataforma utiliza um único cookie de nome connect.sid, de natureza
              estritamente necessária ao funcionamento do sistema de autenticação, armazenando apenas
              o identificador de sessão do usuário. Características: validade de 7 (sete) dias;
              configuração httpOnly (inacessível via JavaScript), secure (transmitido apenas via HTTPS
              em produção) e sameSite: lax.
            </p>
            <p>
              Não são utilizados cookies de rastreamento, analytics, publicidade ou qualquer
              tecnologia similar. A Plataforma não emprega Google Analytics, Meta/Facebook Pixel,
              Hotjar, Mixpanel, Microsoft Clarity nem qualquer SDK de publicidade ou segmentação
              comportamental.
            </p>
            <p>
              Dados locais do navegador: A Plataforma armazena localmente no dispositivo do Assinante
              (via localStorage) rascunhos de diagnóstico em elaboração e informações de estado da
              aplicação. Esses dados permanecem no dispositivo e não são transmitidos aos servidores da
              VEG TAX, exceto quando o Assinante os salva explicitamente. A guarda desses rascunhos
              locais é de responsabilidade do Assinante.
            </p>
            <p>
              Logs operacionais: (i) email_logs — armazena e-mail do destinatário, assunto, tipo,
              status e data dos e-mails transacionais enviados; (ii) webhook_logs — armazena dados
              recebidos via webhook da Pagar.me, incluindo origem, tipo de evento, endereço IP de
              origem do webhook, e-mail do cliente e payload completo do evento (podendo conter nome,
              e-mail e CPF).
            </p>
            <p>
              Endereço IP: não é registrado nas rotas comuns (login, diagnósticos). É registrado
              exclusivamente no webhook_logs como dado de origem do webhook de pagamento da Pagar.me.
            </p>

            {/* 4 */}
            <Secao titulo="4. FINALIDADES E BASES LEGAIS DO TRATAMENTO" />
            <p>
              O tratamento de dados pessoais pela VEG TAX é realizado com fundamento nas bases legais
              previstas no art. 7º da LGPD, conforme a finalidade específica:
            </p>
            <Tabela
              cabecalho={["Finalidade", "Dados envolvidos", "Base legal (LGPD, art. 7º)"]}
              larguras={["38%", "34%", "28%"]}
              linhas={[
                ["Autenticação e gerenciamento de conta", "Nome, e-mail, senha (hash), papel/role", "Execução de contrato (inciso V)"],
                ["Prestação do serviço de diagnóstico tributário", "Dados do Assinante e da Empresa Diagnosticada", "Execução de contrato (inciso V)"],
                ["Processamento de pagamento e gestão de assinatura", "Dados de cartão (tokenizados), CPF/CNPJ, endereço (via Pagar.me); IDs de assinatura (armazenados)", "Execução de contrato (inciso V)"],
                ["Envio de e-mails transacionais (redefinição de senha, status, alertas)", "E-mail do Assinante", "Execução de contrato (inciso V)"],
                ["Cumprimento de obrigações legais e fiscais", "Logs de pagamento, dados financeiros", "Obrigação legal (inciso II)"],
                ["Manutenção e melhoria da Plataforma; integridade operacional", "Logs operacionais (email_logs, webhook_logs)", "Legítimo interesse (inciso IX)"],
                ["Comunicações comerciais sobre produtos e serviços relacionados (somente com consentimento — opt-in)", "Nome, e-mail", "Consentimento (inciso I)"],
                ["Estatísticas, benchmarking e estudos de mercado", "Dados anonimizados e agregados (não constituem dados pessoais — art. 12 LGPD)", "Não aplicável (dado anonimizado)"],
                ["Atendimento a direitos de titulares e solicitações da ANPD", "Dados necessários à identificação e resposta", "Obrigação legal / Legítimo interesse (incisos II e IX)"],
              ]}
            />
            <p>
              O tratamento realizado com base em legítimo interesse (art. 7º, IX) foi avaliado pela
              VEG TAX considerando que não ofende os interesses ou direitos fundamentais dos titulares,
              destinando-se exclusivamente à integridade operacional e segurança da Plataforma.
            </p>

            {/* 5 */}
            <Secao titulo="5. COMPARTILHAMENTO COM TERCEIROS E SUBOPERADORES" />
            <p>
              A VEG TAX compartilha dados pessoais com terceiros exclusivamente na medida necessária à
              prestação do serviço contratado. Os suboperadores e parceiros atualmente envolvidos são:
            </p>
            <Tabela
              cabecalho={["Terceiro", "Função", "País", "Dados envolvidos"]}
              larguras={["18%", "30%", "12%", "40%"]}
              linhas={[
                ["Pagar.me (v5, PSP)", "Processamento de pagamentos e gestão de assinaturas recorrentes", "Brasil", "Dados do cartão (tokenizados), nome, CPF/CNPJ, telefone, endereço de cobrança e e-mail; retorna IDs de cliente e assinatura"],
                ["SMTP2GO", "Envio de e-mails transacionais (redefinição de senha, alertas)", "EUA", "E-mail do destinatário e conteúdo da mensagem"],
                ["Railway", "Hospedagem do banco de dados PostgreSQL — armazenamento de todos os dados persistidos", "EUA", "Todos os dados armazenados na Plataforma"],
                ["Replit", "Hospedagem e execução da aplicação (Autoscale)", "Exterior", "Dados em trânsito durante a execução da aplicação"],
                ["BrasilAPI", "Consulta de dados cadastrais públicos via CNPJ (auto-preenchimento)", "Brasil", "CNPJ informado pelo Assinante na jornada de diagnóstico"],
                ["IBGE", "Consulta de municípios por estado (dado geográfico)", "Brasil", "Dado não pessoal (geográfico)"],
                ["ViaCEP", "Consulta de endereço por CEP no fluxo de pagamento", "Brasil", "CEP informado pelo Assinante no checkout"],
              ]}
            />
            <p>
              A VEG TAX também recebe, por meio de webhook, notificações de eventos de pagamento
              enviadas pela cadeia de parceiros da Pagar.me. O aplicativo não transmite dados
              ativamente para esses parceiros; os dados recebidos são armazenados no webhook_logs
              conforme descrito na seção 3.4.
            </p>
            <p>
              A VEG TAX não vende, aluga, cede gratuitamente nem comercializa dados pessoais de
              Assinantes ou de Empresas Diagnosticadas a terceiros para fins alheios à prestação do
              serviço.
            </p>
            <p>
              A VEG TAX poderá, ainda, compartilhar dados quando necessário ao cumprimento de ordem
              judicial, requisição de autoridade administrativa competente ou obrigação legal ou
              regulatória, bem como para a proteção de seus direitos em processos judiciais,
              administrativos ou arbitrais.
            </p>

            {/* 6 */}
            <Secao titulo="6. TRANSFERÊNCIA INTERNACIONAL DE DADOS" />
            <p>
              Nos termos dos arts. 33 a 36 da LGPD, a VEG TAX informa que dados pessoais tratados pela
              Plataforma são transferidos e armazenados em servidores localizados fora do Brasil,
              especificamente:
            </p>
            <p>
              (i) Railway: banco de dados PostgreSQL onde são armazenados todos os dados persistidos na
              Plataforma, com servidores nos Estados Unidos da América;
            </p>
            <p>
              (ii) SMTP2GO: infraestrutura de envio de e-mails transacionais, com servidores nos
              Estados Unidos da América;
            </p>
            <p>(iii) Replit: infraestrutura de hospedagem e execução da aplicação, com operação no exterior.</p>
            <p>
              A VEG TAX adota as salvaguardas contratuais e técnicas disponíveis para assegurar que
              essas transferências internacionais sejam realizadas em condições compatíveis com os
              padrões de proteção exigidos pela LGPD. Os demais serviços utilizados (Pagar.me,
              BrasilAPI, IBGE e ViaCEP) operam no Brasil.
            </p>

            {/* 7 */}
            <Secao titulo="7. DADOS ANONIMIZADOS E AGREGADOS" />
            <p>
              A VEG TAX poderá submeter dados tratados na Plataforma a processo de anonimização
              irreversível — pelo qual se elimina a possibilidade de associação, direta ou indireta, a
              um indivíduo ou a uma empresa específica — e utilizar os dados resultantes, de forma
              agregada, para fins estatísticos, de benchmarking setorial, melhoria do produto,
              desenvolvimento de novas funcionalidades e elaboração de estudos e relatórios de mercado
              sobre prontidão à Reforma Tributária do Consumo.
            </p>
            <p>
              Nos termos do art. 12 da LGPD, os dados anonimizados não são considerados dados pessoais e
              não se sujeitam ao regime jurídico de proteção de dados, desde que irreversível o processo
              de anonimização.
            </p>
            <p>
              A VEG TAX compromete-se a não realizar qualquer tentativa de reidentificação de dados
              anonimizados e a jamais divulgar, em seus estudos ou publicações, dados que permitam a
              identificação de Assinantes ou de Empresas Diagnosticadas.
            </p>

            {/* 8 */}
            <Secao titulo="8. COOKIES E TECNOLOGIAS DE RASTREAMENTO" />
            <p>
              A Plataforma utiliza exclusivamente o cookie connect.sid, de natureza estritamente
              necessária ao funcionamento do sistema de autenticação, com as características descritas na
              seção 3.4.
            </p>
            <p>
              Não são utilizados: (i) cookies de analytics (Google Analytics, Hotjar, Mixpanel,
              Microsoft Clarity ou similares); (ii) pixels de rastreamento ou publicidade (Meta/Facebook
              Pixel, Google Ads Tags ou similares); (iii) SDKs de segmentação comportamental,
              retargeting ou publicidade programática.
            </p>
            <p>
              Por se tratar de cookie estritamente necessário ao funcionamento do serviço, não é exigido
              consentimento específico para sua utilização, nos termos das diretrizes aplicáveis sobre
              cookies essenciais.
            </p>
            <p>
              O Assinante pode, a qualquer tempo, configurar seu navegador para bloquear ou excluir
              cookies. O bloqueio do cookie connect.sid impedirá o funcionamento do sistema de
              autenticação e, consequentemente, o acesso à Plataforma.
            </p>

            {/* 9 */}
            <Secao titulo="9. SEGURANÇA DOS DADOS" />
            <p>
              A VEG TAX adota medidas técnicas e organizacionais compatíveis com o estado da técnica e
              proporcionais ao nível de risco envolvido no tratamento, nos termos do art. 46 da LGPD,
              incluindo:
            </p>
            <p>(i) Armazenamento de senhas com algoritmo de hash bcrypt;</p>
            <p>
              (ii) Tokenização de dados de cartão de crédito pelo SDK da Pagar.me, de modo que os dados
              financeiros sensíveis não transitam pelos servidores da VEG TAX;
            </p>
            <p>(iii) Comunicação criptografada via HTTPS em produção;</p>
            <p>(iv) Cookie de sessão com atributos httpOnly, secure e sameSite: lax;</p>
            <p>
              (v) Controle de acesso baseado em papéis de usuário (RBAC), com confirmação de senha para
              ações administrativas críticas;
            </p>
            <p>
              (vi) Sanitização de cabeçalhos sensíveis (authorization, cookie, set-cookie) antes da
              persistência em logs;
            </p>
            <p>(vii) Autenticação Basic Auth para recebimento de webhooks de pagamento.</p>
            <p>
              Nenhum sistema de segurança é absolutamente inviolável. A VEG TAX não garante segurança
              absoluta dos dados, comprometendo-se, contudo, a manter medidas de proteção compatíveis
              com os riscos do tratamento. Em caso de incidente de segurança que possa acarretar risco ou
              dano relevante aos titulares, a VEG TAX notificará a ANPD e os titulares afetados, nos
              termos do art. 48 da LGPD, no prazo e na forma estabelecidos pela Autoridade.
            </p>

            {/* 10 */}
            <Secao titulo="10. RETENÇÃO E ELIMINAÇÃO DE DADOS" />
            <p>
              Os dados pessoais são mantidos pelo tempo necessário ao cumprimento das finalidades que
              motivaram a coleta, observados os prazos mínimos legais, conforme a seguir:
            </p>
            <Tabela
              cabecalho={["Categoria de dado", "Prazo de retenção"]}
              larguras={["55%", "45%"]}
              linhas={[
                ["Dados de conta (cadastro, perfil, personalização white-label)", "Enquanto a conta estiver ativa + 5 (cinco) anos após encerramento ou solicitação de exclusão"],
                ["Diagnósticos e dados de Empresas Diagnosticadas", "Enquanto a conta estiver ativa + 5 (cinco) anos após exclusão do diagnóstico ou encerramento da conta"],
                ["email_logs (registros de e-mails transacionais enviados)", "2 (dois) anos a partir da data de geração do registro"],
                ["webhook_logs (registros de webhooks de pagamento da Pagar.me)", "5 (cinco) anos a partir da data de geração do registro"],
              ]}
            />
            <p>
              Ao término dos prazos, os dados serão eliminados ou anonimizados, salvo obrigação legal de
              guarda por prazo superior ou necessidade de preservação para exercício regular de direitos
              em processos judiciais, administrativos ou arbitrais (art. 16, I e III, da LGPD).
            </p>
            <p>
              A exclusão de diagnósticos pelo Assinante por autoatendimento (hard delete) remove
              fisicamente os dados da empresa diagnosticada e os itens de checklist relacionados, de
              forma definitiva e irreversível. Os registros de email_logs e webhook_logs são retidos
              pelos prazos indicados por razões de integridade operacional e cumprimento de obrigações
              legais, não sendo removidos em cascata.
            </p>
            <p>
              É responsabilidade do Assinante exportar e guardar os relatórios PDF e demais conteúdos que
              considerar relevantes antes da exclusão de diagnósticos ou do encerramento da conta.
            </p>
            <Sub titulo="10.1 Exercício do Direito de Eliminação" />
            <p>
              Enquanto não estiver disponível a funcionalidade de exclusão de conta por autoatendimento,
              o Assinante poderá solicitar a exclusão de sua conta pelo canal oficial
              (contato@drdanielguimaraes.com.br). A solicitação será atendida no prazo de 15 (quinze)
              dias úteis, contados da confirmação da identidade do solicitante.
            </p>
            <p>
              A VEG TAX poderá manter dados em logs pelo prazo remanescente previsto nesta Política,
              justificado pelo cumprimento de obrigação legal, exercício regular de direito ou legítimo
              interesse, nos termos do art. 16 da LGPD.
            </p>

            {/* 11 */}
            <Secao titulo="11. DIREITOS DO TITULAR DE DADOS PESSOAIS" />
            <p>
              Nos termos do art. 18 da LGPD, o Assinante possui os seguintes direitos, exercíveis a
              qualquer tempo mediante solicitação ao Encarregado (DPO):
            </p>
            <p>I — Confirmação da existência de tratamento de dados pessoais;</p>
            <p>II — Acesso aos dados pessoais tratados;</p>
            <p>III — Correção de dados incompletos, inexatos ou desatualizados;</p>
            <p>
              IV — Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados
              em desconformidade com a LGPD;
            </p>
            <p>
              V — Portabilidade dos dados a outro fornecedor, mediante requisição expressa e observados
              os segredos comerciais e industriais da VEG TAX;
            </p>
            <p>
              VI — Eliminação dos dados pessoais tratados com base no consentimento, ressalvadas as
              hipóteses do art. 16 da LGPD;
            </p>
            <p>VII — Informação sobre as entidades com as quais a VEG TAX realizou compartilhamento de dados;</p>
            <p>
              VIII — Informação sobre a possibilidade de não fornecer consentimento e sobre as
              consequências da negativa;
            </p>
            <p>IX — Revogação do consentimento para comunicações comerciais, a qualquer tempo e sem ônus.</p>
            <p>
              Para exercer qualquer desses direitos, o titular deverá enviar solicitação ao Encarregado
              (DPO) pelo e-mail contato@drdanielguimaraes.com.br, identificando-se e especificando o
              direito que deseja exercer. A VEG TAX poderá solicitar informações ou documentos adicionais
              para confirmação da identidade do solicitante, como medida de segurança contra fraudes. A
              resposta será fornecida no prazo de 15 (quinze) dias úteis.
            </p>
            <p>
              Em relação aos dados das Empresas Diagnosticadas, os respectivos titulares deverão exercer
              seus direitos perante o Assinante responsável pelo diagnóstico, que atua como controlador
              dessa relação.
            </p>

            {/* 12 */}
            <Secao titulo="12. COMUNICAÇÕES COMERCIAIS E GESTÃO DO CONSENTIMENTO" />
            <p>
              Com o consentimento expresso, específico e destacado do Assinante (opt-in), a VEG TAX
              poderá utilizar o nome e o endereço de e-mail cadastrados para o envio de comunicações
              comerciais sobre produtos físicos ou digitais, eventos, treinamentos, materiais educativos
              e outros serviços relacionados à Reforma Tributária do Consumo, nos termos do art. 7º, I,
              da LGPD.
            </p>
            <p>
              O consentimento comercial é voluntário e não condiciona o acesso ao serviço contratado. A
              ausência de consentimento não impede o recebimento das comunicações operacionais e
              transacionais inerentes à prestação do serviço.
            </p>
            <p>
              O Assinante poderá revogar o consentimento a qualquer tempo, sem ônus, por meio: (i) do
              link de descadastramento presente em cada comunicação comercial enviada; (ii) de
              solicitação ao canal oficial (contato@drdanielguimaraes.com.br).
            </p>
            <p>
              A revogação do consentimento não afeta a licitude do tratamento realizado anteriormente à
              sua efetivação, nos termos do art. 8º, § 5º, da LGPD.
            </p>

            {/* 13 */}
            <Secao titulo="13. PLATAFORMA NÃO DESTINADA A MENORES DE IDADE" />
            <p>
              A Plataforma destina-se exclusivamente a profissionais maiores de 18 (dezoito) anos ou
              emancipados, com plena capacidade civil. A VEG TAX não coleta nem trata, intencionalmente,
              dados pessoais de crianças ou adolescentes (art. 14 da LGPD).
            </p>
            <p>
              Caso a VEG TAX identifique cadastro realizado por menor de idade, a conta será encerrada e
              os respectivos dados eliminados, ressalvadas as hipóteses legais de retenção.
            </p>

            {/* 14 */}
            <Secao titulo="14. ALTERAÇÕES DESTA POLÍTICA" />
            <p>
              A VEG TAX poderá atualizar esta Política a qualquer tempo. Em caso de alterações
              relevantes, o Assinante será notificado pelo e-mail cadastrado com antecedência mínima de
              30 (trinta) dias da entrada em vigor das mudanças, exceto quando exigida adaptação imediata
              por determinação legal ou regulatória.
            </p>
            <p>
              A versão atualizada estará sempre disponível na Plataforma (app.reformaemacao.com.br), com
              indicação da data de vigência e do número de versão. A continuidade de uso da Plataforma
              após a entrada em vigor das alterações implicará ciência e aceitação das novas condições.
            </p>

            {/* 15 */}
            <Secao titulo="15. CONTATO E CANAL DO TITULAR" />
            <p>
              Para exercer seus direitos como titular, sanar dúvidas, reportar incidentes ou encaminhar
              solicitações sobre o tratamento de dados, o Assinante poderá contatar o Encarregado (DPO):
            </p>
            <p className="font-semibold text-[#0f1e35]">Encarregado (DPO): Daniel Henrique de Souza Guimarães</p>
            <p>E-mail: contato@drdanielguimaraes.com.br</p>
            <p>Telefone: (62) 99222-8431</p>
            <p>Endereço: Rua Coronel Batista, nº 415, Sala 503, Centro, Anápolis/GO — CEP 75.020-080</p>
            <p>
              Caso discorde do atendimento recebido ou deseje apresentar reclamação, o titular poderá, a
              qualquer momento, dirigir-se à Autoridade Nacional de Proteção de Dados (ANPD), por meio do
              site www.gov.br/anpd.
            </p>

            {/* Assinatura */}
            <div className="border-t border-slate-200 mt-8 pt-6 text-sm text-slate-600">
              <p className="mb-1">Anápolis/GO, 04 de maio de 2026.</p>
              <p className="font-semibold text-[#0f1e35] mt-3">
                VEG TAX CONSULTORIA TRIBUTARIA E GESTAO EMPRESARIAL LTDA
              </p>
              <p>CNPJ 50.597.209/0001-52</p>
              <p>Rua Coronel Batista, nº 415, Sala 503, Centro, Anápolis/GO — CEP 75.020-080</p>
              <p>contato@drdanielguimaraes.com.br | (62) 99222-8431</p>
              <p className="text-xs text-slate-400 mt-4">
                Reforma em Ação — Política de Privacidade v1.0 (04/05/2026)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Cabeçalho de seção */
function Secao({ titulo }: { titulo: string }) {
  return <h2 className="text-base font-bold text-[#0f1e35] pt-6 pb-1">{titulo}</h2>;
}

/** Subtítulo */
function Sub({ titulo }: { titulo: string }) {
  return <h3 className="text-sm font-semibold text-[#0f1e35] pt-3">{titulo}</h3>;
}

/** Tabela responsiva com rolagem horizontal em telas pequenas */
function Tabela({
  cabecalho,
  linhas,
  larguras,
}: {
  cabecalho: string[];
  linhas: string[][];
  larguras?: string[];
}) {
  return (
    <div className="overflow-x-auto my-4 -mx-1">
      <table className="w-full min-w-[520px] border-collapse text-[13px]">
        <thead>
          <tr>
            {cabecalho.map((c, i) => (
              <th
                key={i}
                style={larguras ? { width: larguras[i] } : undefined}
                className="border border-slate-300 bg-[#0f1e35] text-white text-left font-semibold px-3 py-2 align-top"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, ri) => (
            <tr key={ri} className={ri % 2 === 1 ? "bg-slate-50" : "bg-white"}>
              {linha.map((cel, ci) => (
                <td
                  key={ci}
                  className="border border-slate-300 px-3 py-2 align-top text-slate-700"
                >
                  {cel}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
