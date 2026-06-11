import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

/**
 * Termos de Uso — Reforma em Ação (VEG TAX)
 * Versão 1.0 — Vigência a partir de 04/05/2026
 * Conteúdo integral. Página pública (acessível com e sem login).
 */
export default function TermosPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header navy */}
      <header className="bg-[#0f1e35] text-white">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            data-testid="link-back-termos"
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
              Termos de Uso
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Versão 1.0 — Vigência a partir de 04/05/2026
            </p>
          </div>

          {/* Corpo */}
          <div className="prose-legal text-[15px] leading-relaxed text-slate-700 space-y-4">
            <p>
              Estes Termos de Uso (&#8220;Termos&#8221;) regulam o acesso e a utilização
              da plataforma digital &#8220;Reforma em Ação&#8221;, disponível no domínio
              app.reformaemacao.com.br, de titularidade da VEG TAX CONSULTORIA TRIBUTARIA
              E GESTAO EMPRESARIAL LTDA (&#8220;VEG TAX&#8221;). Ao se cadastrar ou utilizar
              a Plataforma, o usuário (&#8220;Assinante&#8221;) declara ter lido, compreendido
              e aceito integralmente os presentes Termos, bem como a Política de Privacidade
              que os integra por referência.
            </p>

            {/* CLÁUSULA 1 */}
            <Clausula titulo="CLÁUSULA 1 — IDENTIFICAÇÃO E QUALIFICAÇÃO DAS PARTES" />
            <p>
              1.1 VEG TAX CONSULTORIA TRIBUTARIA E GESTAO EMPRESARIAL LTDA, pessoa jurídica
              de direito privado, inscrita no CNPJ/MF sob o nº 50.597.209/0001-52, com sede
              na Rua Coronel Batista, nº 415, Sala 503, Centro, Anápolis, Estado de Goiás,
              CEP 75.020-080, doravante denominada &#8220;VEG TAX&#8221;, é a desenvolvedora
              e titular exclusiva da plataforma digital denominada &#8220;Reforma em Ação&#8221;.
            </p>
            <p>
              1.2 O Assinante é o profissional — advogado, contador, consultor tributário ou
              equivalente — pessoa física ou jurídica, que realiza cadastro na Plataforma e
              aceita os presentes Termos de Uso.
            </p>
            <p>
              1.3 Contatos oficiais da VEG TAX: e-mail contato@drdanielguimaraes.com.br |
              telefone (62) 99222-8431.
            </p>

            {/* CLÁUSULA 2 */}
            <Clausula titulo="CLÁUSULA 2 — DEFINIÇÕES" />
            <p>Para fins destes Termos, as expressões a seguir terão os significados indicados:</p>
            <p>
              (i) &#8220;Plataforma&#8221;: o sistema digital &#8220;Reforma em Ação&#8221;,
              operado em modelo de software como serviço (SaaS), desenvolvido para diagnóstico
              tributário de prontidão à Reforma Tributária do Consumo;
            </p>
            <p>
              (ii) &#8220;Assinante&#8221;: profissional — advogado, contador, consultor
              tributário ou similar — pessoa física ou jurídica, que realiza cadastro na
              Plataforma e adquire acesso, pago ou gratuito (Trial), às suas funcionalidades;
            </p>
            <p>
              (iii) &#8220;Empresa Diagnosticada&#8221;: empresa sobre a qual o Assinante
              realiza o diagnóstico de prontidão tributária; em regra, trata-se de cliente do
              Assinante que não é, ele próprio, assinante direto da Plataforma;
            </p>
            <p>
              (iv) &#8220;Diagnóstico&#8221;: conjunto estruturado de dados inseridos pelo
              Assinante e processado pela Plataforma, resultando em avaliação de prontidão à
              Reforma Tributária em cinco eixos temáticos, com geração de plano de ação
              personalizado em formato PDF;
            </p>
            <p>
              (v) &#8220;PDF White-label&#8221;: relatório gerado ao final do Diagnóstico,
              personalizado com a identidade visual do Assinante (marca, logotipo, dados de
              contato e registro profissional), destinado à entrega ao cliente do Assinante;
            </p>
            <p>
              (vi) &#8220;Trial&#8221;: modalidade de acesso gratuito que permite ao Assinante
              realizar 1 (um) Diagnóstico sem assinatura paga;
            </p>
            <p>
              (vii) &#8220;Plano&#8221;: modalidade de assinatura paga que concede ao Assinante
              acesso irrestrito às funcionalidades disponíveis na Plataforma.
            </p>

            {/* CLÁUSULA 3 */}
            <Clausula titulo="CLÁUSULA 3 — ACEITAÇÃO DOS TERMOS E CONDIÇÕES" />
            <p>
              3.1 Ao realizar o cadastro na Plataforma, o Assinante declara ter lido,
              compreendido e aceito integralmente os presentes Termos de Uso, bem como a
              Política de Privacidade da VEG TAX, que integra estes Termos por referência.
            </p>
            <p>
              3.2 A utilização da Plataforma, ainda que parcial, implica a aceitação irrestrita
              dos presentes Termos. Caso o Assinante não concorde com qualquer de suas
              disposições, deverá abster-se de utilizá-la.
            </p>
            <p>
              3.3 Estes Termos constituem contrato vinculante entre a VEG TAX e o Assinante,
              nos termos do art. 3º da Lei nº 9.609/1998 (Lei do Software), do art. 1º da Lei
              nº 12.965/2014 (Marco Civil da Internet) e das disposições do Código Civil
              aplicáveis aos contratos eletrônicos.
            </p>
            <p>
              3.4 O acesso à Plataforma é restrito a pessoas maiores de 18 (dezoito) anos ou
              emancipadas, com plena capacidade civil para assumir as obrigações aqui previstas.
              A Plataforma não se destina a menores de idade, e a VEG TAX não coleta
              intencionalmente dados de crianças ou adolescentes.
            </p>

            {/* CLÁUSULA 4 */}
            <Clausula titulo="CLÁUSULA 4 — CADASTRO, CONTA E REQUISITOS DE ACESSO" />
            <p>
              4.1 O cadastro é realizado diretamente pelo Assinante mediante preenchimento de
              formulário com nome completo, endereço de e-mail e criação de senha pessoal.
            </p>
            <p>
              4.2 O Assinante é inteiramente responsável pela veracidade, precisão e atualidade
              dos dados cadastrais fornecidos, obrigando-se a mantê-los permanentemente
              atualizados, em especial o endereço de e-mail, que constitui o canal oficial de
              comunicação entre a VEG TAX e o Assinante.
            </p>
            <p>
              4.3 A senha de acesso é de uso pessoal e intransferível. O Assinante compromete-se
              a não compartilhá-la com terceiros e a comunicar imediatamente à VEG TAX qualquer
              indício de acesso não autorizado à sua conta, pelo canal oficial indicado na
              Cláusula 1.
            </p>
            <p>
              4.4 Cada conta é individual e não pode ser cedida, transferida ou compartilhada
              com terceiros sem prévia anuência escrita da VEG TAX.
            </p>
            <p>
              4.5 Senhas são armazenadas exclusivamente em formato de hash bcrypt. A VEG TAX
              não tem acesso à senha em texto claro e não pode recuperá-la — apenas redefini-la
              mediante envio de token ao e-mail cadastrado, com validade de 60 (sessenta) minutos.
            </p>
            <p>
              4.6 A VEG TAX reserva-se o direito de recusar ou cancelar cadastros que violem
              estes Termos ou que apresentem indícios de fraude ou má-fé.
            </p>
            <p>
              4.7 Todos os atos praticados mediante autenticação com as credenciais do Assinante
              presumem-se de sua autoria e responsabilidade.
            </p>

            {/* CLÁUSULA 5 */}
            <Clausula titulo="CLÁUSULA 5 — DESCRIÇÃO DO SERVIÇO E FUNCIONALIDADES" />
            <p>
              5.1 A Plataforma &#8220;Reforma em Ação&#8221; é um sistema de diagnóstico
              tributário voltado à avaliação do grau de prontidão de empresas frente à Reforma
              Tributária do Consumo, nos termos da Emenda Constitucional nº 132/2023, da Lei
              Complementar nº 214/2025 e demais atos normativos aplicáveis.
            </p>
            <p>5.2 São funcionalidades disponíveis ao Assinante:</p>
            <p>
              a) Diagnóstico de Prontidão: jornada estruturada de coleta e análise de dados da
              Empresa Diagnosticada, gerando avaliação em 5 (cinco) eixos temáticos — Fiscal,
              Compras, Comercial, Financeiro e Governança —, com classificação em 4 (quatro)
              níveis de prontidão e plano de ação personalizado em formato PDF;
            </p>
            <p>
              b) PDF White-label: funcionalidade exclusiva para Assinantes com Plano ativo, que
              permite customizar o relatório PDF com a identidade visual do Assinante (logotipo,
              nome do escritório ou profissional, e-mail, telefone, site e registro profissional
              CRC/OAB) para entrega ao respectivo cliente. A personalização ocorre exclusivamente
              no PDF; a interface da Plataforma sempre exibe a identidade visual &#8220;Reforma
              em Ação&#8221;;
            </p>
            <p>
              c) Base de Conhecimento &#8220;O Que Muda?&#8221;: conteúdo educativo e informativo
              sobre a Reforma Tributária do Consumo, disponibilizado pela VEG TAX.
            </p>
            <p>
              5.3 A Plataforma poderá conter funcionalidades em desenvolvimento, sinalizadas como
              &#8220;Em Breve&#8221;, cuja disponibilização depende de implementação técnica
              futura. A existência dessas indicações não gera direito adquirido ao Assinante. A
              VEG TAX comunicará oportunamente a disponibilização de novas funcionalidades.
            </p>
            <p>
              5.4 A VEG TAX reserva-se o direito de modificar, adicionar ou descontinuar
              funcionalidades, com comunicação prévia de no mínimo 30 (trinta) dias, exceto em
              caso de necessidade técnica urgente ou determinação legal que imponha prazo diverso.
            </p>

            {/* CLÁUSULA 6 */}
            <Clausula titulo="CLÁUSULA 6 — PLANOS DE ASSINATURA, PREÇOS E FORMA DE PAGAMENTO" />
            <p>
              6.1 O acesso às funcionalidades completas da Plataforma exige a aquisição de um dos
              Planos de assinatura disponíveis, conforme condições a seguir.
            </p>
            <Sub titulo="6.2 Plano Mensal" />
            <p>a) Valor: R$ 147,00 (cento e quarenta e sete reais) por mês;</p>
            <p>
              b) Renovação: automática, com cobrança mensal no cartão de crédito cadastrado ao
              término de cada período, salvo cancelamento pelo Assinante antes do início do ciclo
              seguinte;
            </p>
            <p>
              c) Atenção: o Plano Mensal renova-se automaticamente. O Assinante deverá adotar as
              providências necessárias para cancelar a renovação automática caso não deseje
              prosseguir com a assinatura.
            </p>
            <Sub titulo="6.3 Plano Anual" />
            <p>a) Valor: R$ 1.164,00 (um mil, cento e sessenta e quatro reais) por ano;</p>
            <p>b) Parcelamento: pagamento em até 12 (doze) parcelas sem juros no cartão de crédito;</p>
            <p>
              c) Renovação: NÃO automática. O Plano Anual não é renovado automaticamente ao
              término do período contratado. Para continuidade do acesso, o Assinante deverá
              realizar nova contratação.
            </p>
            <Sub titulo="6.4 Período de Trial" />
            <p>
              a) O Assinante poderá realizar 1 (um) Diagnóstico gratuitamente, sem necessidade de
              assinatura paga;
            </p>
            <p>b) A funcionalidade de PDF White-label não está disponível no Trial;</p>
            <p>
              c) O acesso ao segundo Diagnóstico e às funcionalidades completas exige a aquisição
              de um Plano.
            </p>
            <Sub titulo="6.5 Forma de Pagamento" />
            <p>
              a) O pagamento é processado exclusivamente mediante cartão de crédito, pela
              plataforma de pagamentos Pagar.me;
            </p>
            <p>
              b) Os dados do cartão são tokenizados diretamente no navegador do Assinante pelo SDK
              da Pagar.me, não sendo armazenados nos servidores da VEG TAX;
            </p>
            <p>
              c) Não são aceitas outras formas de pagamento, como PIX, boleto bancário ou
              transferência bancária.
            </p>
            <Sub titulo="6.6 Bloqueio por Inadimplência" />
            <p>
              a) Em caso de recusa ou falha no processamento do cartão de crédito, o acesso do
              Assinante será bloqueado até a regularização do pagamento;
            </p>
            <p>b) O Assinante deverá cadastrar novo cartão de crédito válido para retomada do acesso.</p>
            <p>
              6.7 Os preços poderão ser reajustados com comunicação prévia de no mínimo 30 (trinta)
              dias, assegurando-se ao Assinante o direito de cancelamento sem ônus adicional caso
              discorde dos novos valores.
            </p>

            {/* CLÁUSULA 7 */}
            <Clausula titulo="CLÁUSULA 7 — DIREITO DE ARREPENDIMENTO E POLÍTICA DE CANCELAMENTO" />
            <p>
              7.1 Embora a relação estabelecida entre a VEG TAX e o Assinante tenha natureza
              preponderantemente profissional e empresarial — uma vez que a Plataforma constitui
              insumo da atividade econômica do Assinante —, a VEG TAX assegura ao Assinante, por
              liberalidade e independentemente da qualificação jurídica da relação, o direito de
              desistir da contratação no prazo de 7 (sete) dias corridos, contados da data de
              ativação do Plano, em linha com o parâmetro do art. 49 da Lei nº 8.078/1990.
            </p>
            <p>
              7.2 Para exercer o direito de arrependimento, o Assinante deverá enviar solicitação
              expressa ao endereço contato@drdanielguimaraes.com.br dentro do referido prazo. O
              exercício tempestivo desse direito implica:
            </p>
            <p>
              a) Reembolso integral do valor pago, no prazo de até 10 (dez) dias úteis, pelo mesmo
              meio de pagamento utilizado;
            </p>
            <p>b) Encerramento imediato do acesso à Plataforma.</p>
            <Sub titulo="7.3 Cancelamento Após o Prazo de Arrependimento" />
            <p>
              a) Plano Mensal: o cancelamento interrompe a renovação automática. O Assinante
              manterá acesso até o término do período mensal em curso, sem direito a reembolso
              proporcional pelo período restante;
            </p>
            <p>
              b) Plano Anual: o cancelamento é permitido a qualquer tempo e encerra o acesso ao
              término do período anual contratado. Não haverá reembolso proporcional pelo período
              remanescente não utilizado, salvo acordo específico entre as partes.
            </p>
            <p>
              7.4 Enquanto não estiver disponível a opção de cancelamento por autoatendimento na
              Plataforma, o Assinante deverá solicitar o cancelamento pelo canal oficial de contato
              indicado na Cláusula 1.
            </p>

            {/* CLÁUSULA 8 */}
            <Clausula titulo="CLÁUSULA 8 — DEVERES E CONDUTAS VEDADAS DO ASSINANTE" />
            <p>
              8.1 O Assinante obriga-se a utilizar a Plataforma em conformidade com a legislação
              vigente, com estes Termos, com a Política de Privacidade e com os princípios da
              boa-fé e da lealdade contratual.
            </p>
            <p>8.2 São condutas expressamente vedadas ao Assinante:</p>
            <p>
              a) Ceder, transferir, sublicenciar, arrendar ou de qualquer forma disponibilizar a
              terceiros o acesso à sua conta, sem prévia autorização escrita da VEG TAX;
            </p>
            <p>b) Compartilhar credenciais de acesso com outras pessoas, físicas ou jurídicas;</p>
            <p>
              c) Realizar engenharia reversa, descompilar, desassemblar ou tentar extrair o
              código-fonte, algoritmos ou metodologia da Plataforma;
            </p>
            <p>
              d) Reproduzir, copiar, distribuir, comercializar ou modificar, no todo ou em parte,
              o conteúdo da Plataforma, os relatórios gerados ou a base de conhecimento, sem
              autorização escrita prévia da VEG TAX;
            </p>
            <p>
              e) Utilizar a Plataforma para fins ilícitos, fraudulentos ou contrários à ordem
              pública, à moral e aos bons costumes;
            </p>
            <p>f) Introduzir vírus, malware ou qualquer código malicioso na Plataforma;</p>
            <p>g) Tentar acessar áreas restritas ou dados de outros usuários da Plataforma;</p>
            <p>
              h) Inserir dados falsos, incorretos ou de empresas para as quais não detenha
              autorização de tratamento;
            </p>
            <p>
              i) Utilizar a Plataforma para revenda ou oferta comercial de diagnósticos em nome de
              terceiros, sem autorização expressa da VEG TAX;
            </p>
            <p>
              j) Utilizar robôs, scripts, crawlers ou qualquer meio automatizado para acessar,
              extrair dados ou sobrecarregar a Plataforma.
            </p>
            <p>
              8.3 O descumprimento de qualquer das vedações previstas nesta Cláusula ensejará a
              suspensão ou o cancelamento imediato da conta, sem prejuízo das responsabilidades
              civil e criminal cabíveis e do dever de indenizar previsto na Cláusula 14.
            </p>

            {/* CLÁUSULA 9 */}
            <Clausula titulo="CLÁUSULA 9 — DADOS DE TERCEIROS — DECLARAÇÃO E RESPONSABILIDADE DO ASSINANTE" />
            <p>
              9.1 Ao utilizar a Plataforma, o Assinante inserirá dados de Empresas Diagnosticadas
              — clientes do Assinante —, incluindo dados comercialmente sensíveis como faturamento,
              margem de lucro, regime tributário e estrutura operacional, conforme exigido pela
              jornada de diagnóstico.
            </p>
            <p>9.2 Ao inserir tais dados, o Assinante declara e garante expressamente que:</p>
            <p>
              a) Possui autorização adequada da empresa e de seus representantes para coletar e
              tratar os dados inseridos na Plataforma para fins de diagnóstico tributário;
            </p>
            <p>
              b) Cumpre e continuará cumprindo todas as obrigações que lhe incumbem como controlador
              dos dados pessoais de seus clientes, nos termos da Lei nº 13.709/2018 (LGPD);
            </p>
            <p>
              c) Possui base legal válida, nos termos do art. 7º da LGPD, para o tratamento dos
              dados inseridos;
            </p>
            <p>
              d) Informou seus clientes sobre a utilização da Plataforma e o tratamento de seus
              dados, observando os deveres de transparência e informação previstos na LGPD.
            </p>
            <p>
              9.3 Na relação entre o Assinante e as Empresas Diagnosticadas, o Assinante atua como
              controlador dos dados pessoais e a VEG TAX como operadora, nos termos do art. 39 da
              LGPD, processando esses dados exclusivamente conforme as instruções decorrentes das
              funcionalidades da Plataforma.
            </p>
            <p>
              9.4 O Assinante é o único e exclusivo responsável pelas eventuais violações à LGPD ou
              a qualquer outra norma de proteção de dados decorrentes da inserção indevida de dados
              de terceiros na Plataforma, isentando a VEG TAX de qualquer responsabilidade perante
              os titulares dos dados ou perante a Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
            <p>
              9.5 Recomenda-se ao Assinante manter com seus clientes instrumento contratual que
              contemple expressamente o tratamento de dados para fins de diagnóstico tributário, em
              conformidade com a LGPD.
            </p>

            {/* CLÁUSULA 10 */}
            <Clausula titulo="CLÁUSULA 10 — WHITE-LABEL — RESPONSABILIDADE SOBRE O PDF GERADO" />
            <p>
              10.1 A funcionalidade de PDF White-label permite ao Assinante personalizar o relatório
              de diagnóstico com sua identidade visual (logotipo, nome do escritório ou profissional,
              e-mail, telefone, site e registro profissional CRC/OAB), para fins de entrega ao
              respectivo cliente.
            </p>
            <p>
              10.2 A customização de marca ocorre exclusivamente no PDF gerado. A interface da
              Plataforma preservará sempre a identidade visual &#8220;Reforma em Ação&#8221;, de
              titularidade da VEG TAX.
            </p>
            <p>10.3 O Assinante é o único responsável pelo conteúdo do PDF White-label, especialmente:</p>
            <p>a) Pela veracidade e regularidade de sua identificação profissional inserida (registro CRC/OAB);</p>
            <p>
              b) Pelos eventuais comentários, análises ou orientações adicionais que acrescentar ao
              documento antes de entregá-lo ao cliente;
            </p>
            <p>
              c) Pela responsabilidade técnica e profissional perante seu cliente decorrente do uso e
              da interpretação do diagnóstico.
            </p>
            <p>
              10.4 A VEG TAX não se responsabiliza pelo uso do PDF White-label após a geração e o
              download pelo Assinante, tampouco por alegações de terceiros decorrentes de conteúdo
              customizado ou análises adicionadas pelo Assinante.
            </p>

            {/* CLÁUSULA 11 */}
            <Clausula titulo="CLÁUSULA 11 — PROPRIEDADE INTELECTUAL E LICENÇA DE USO" />
            <p>
              11.1 A VEG TAX é a titular exclusiva de todos os direitos de propriedade intelectual
              relativos à Plataforma &#8220;Reforma em Ação&#8221;, incluindo, sem limitação:
            </p>
            <p>a) O software e seus componentes, algoritmos, código-fonte e infraestrutura;</p>
            <p>b) A marca &#8220;Reforma em Ação&#8221; e os demais elementos de identidade visual da Plataforma;</p>
            <p>c) A metodologia de diagnóstico, os critérios de avaliação e os cinco eixos temáticos;</p>
            <p>d) O conteúdo da base de conhecimento &#8220;O Que Muda?&#8221;;</p>
            <p>e) O design, os layouts e as interfaces da Plataforma.</p>
            <p>
              11.2 A VEG TAX concede ao Assinante uma licença de uso não exclusiva, não
              transferível, não sublicenciável e revogável para acessar e utilizar a Plataforma e
              os relatórios por ela gerados, nos limites e condições estabelecidos nestes Termos,
              pelo período de vigência do Plano contratado.
            </p>
            <p>11.3 A licença não autoriza o Assinante a:</p>
            <p>a) Reproduzir ou distribuir a metodologia da Plataforma, no todo ou em parte;</p>
            <p>
              b) Criar produtos ou serviços derivados da Plataforma sem prévia autorização escrita
              da VEG TAX;
            </p>
            <p>
              c) Remover ou alterar avisos de direitos autorais ou de propriedade intelectual
              presentes na Plataforma ou nos relatórios.
            </p>
            <p>
              11.4 Os relatórios PDF gerados e personalizados (white-label) poderão ser utilizados
              pelo Assinante para entrega a seus clientes nos termos desta licença, sem que isso
              implique cessão de quaisquer direitos sobre a metodologia ou sobre o sistema gerador
              do diagnóstico.
            </p>

            {/* CLÁUSULA 12 */}
            <Clausula titulo="CLÁUSULA 12 — TITULARIDADE DOS DADOS INSERIDOS E USO DE DADOS ANONIMIZADOS" />
            <p>
              12.1 Os dados inseridos pelo Assinante na Plataforma permanecem de titularidade do
              Assinante e/ou das respectivas Empresas Diagnosticadas, conforme o caso, não havendo
              transferência de propriedade à VEG TAX.
            </p>
            <p>
              12.2 O Assinante concede à VEG TAX licença não exclusiva, gratuita e limitada para
              armazenar, processar, reproduzir e exibir os dados inseridos, exclusivamente na
              medida necessária à prestação do serviço contratado, ao cumprimento de obrigações
              legais e ao exercício regular de direitos.
            </p>
            <p>
              12.3 O Assinante autoriza a VEG TAX a utilizar dados em formato anonimizado e agregado
              — isto é, sem qualquer possibilidade de identificação do Assinante, das Empresas
              Diagnosticadas ou de pessoas naturais — para fins estatísticos, de benchmarking
              setorial, melhoria do produto, desenvolvimento de novas funcionalidades, elaboração de
              estudos e relatórios de mercado sobre prontidão à Reforma Tributária do Consumo.
            </p>
            <p>
              12.4 Nos termos do art. 12 da Lei nº 13.709/2018 (LGPD), os dados anonimizados não são
              considerados dados pessoais, deixando de se sujeitar ao regime jurídico de proteção de
              dados, desde que irreversível o processo de anonimização.
            </p>
            <p>
              12.5 A VEG TAX compromete-se a não realizar qualquer tentativa de reidentificação de
              dados anonimizados e a jamais divulgar dados que permitam, direta ou indiretamente, a
              identificação de Assinantes ou de Empresas Diagnosticadas em seus estudos, relatórios
              ou publicações.
            </p>

            {/* CLÁUSULA 13 */}
            <Clausula titulo="CLÁUSULA 13 — GARANTIAS, DISPONIBILIDADE E LIMITAÇÃO DE RESPONSABILIDADE" />
            <p>
              13.1 A Plataforma é fornecida &#8220;no estado em que se encontra&#8221; (as is) e
              &#8220;conforme disponibilidade&#8221; (as available), sem garantias de qualquer
              natureza, expressas ou implícitas, incluindo, sem limitação, garantias de
              disponibilidade ininterrupta, operação livre de erros, adequação a finalidade
              específica ou obtenção de resultados determinados, na máxima extensão permitida pela
              legislação aplicável.
            </p>
            <p>
              13.2 A VEG TAX envidará esforços comercialmente razoáveis para manter a Plataforma
              disponível e funcional, sem que isso constitua garantia de nível de serviço (SLA)
              específico.
            </p>
            <p>
              13.3 O Diagnóstico gerado pela Plataforma constitui ferramenta de apoio, orientação e
              suporte à tomada de decisão profissional. O resultado do Diagnóstico e o respectivo
              plano de ação NÃO substituem, em nenhuma hipótese, parecer jurídico, consultoria
              tributária individualizada ou qualquer outra forma de aconselhamento profissional
              especializado.
            </p>
            <p>
              13.4 A responsabilidade pela análise, interpretação, contextualização e uso do
              Diagnóstico na relação com o cliente final é exclusiva do Assinante, na qualidade de
              profissional habilitado (advogado, contador ou consultor tributário).
            </p>
            <p>
              13.5 A Plataforma é fundamentada na legislação da Reforma Tributária do Consumo, que se
              encontra em constante evolução normativa e regulatória (EC 132/2023, LC 214/2025, LC
              227/2026, Decreto 12.955/2026, Resolução CGIBS 6/2026, Portaria Conjunta MF/CGIBS
              7/2026, entre outros). A VEG TAX envidará esforços razoáveis para manter o conteúdo
              atualizado, mas não garante a atualidade permanente nem a completude absoluta das
              informações ante alterações normativas supervenientes.
            </p>
            <p>13.6 A VEG TAX não se responsabiliza por:</p>
            <p>a) Decisões tomadas pelo Assinante ou por seus clientes com base nos resultados do Diagnóstico;</p>
            <p>
              b) Prejuízos diretos, indiretos, incidentais, lucros cessantes, perda de chance ou
              danos consequentes decorrentes do uso ou da impossibilidade de uso da Plataforma;
            </p>
            <p>
              c) Erros, imprecisões ou desatualizações decorrentes de mudanças normativas ou
              regulatórias posteriores à última atualização da Plataforma;
            </p>
            <p>
              d) Interrupções temporárias do serviço decorrentes de manutenção, atualização técnica,
              falha de infraestrutura de terceiros (incluindo provedores de hospedagem, banco de
              dados, e-mail e pagamento) ou caso fortuito ou força maior;
            </p>
            <p>
              e) Perda de dados decorrente de falha de infraestrutura de terceiros, ressalvadas as
              medidas de segurança razoáveis adotadas pela VEG TAX.
            </p>
            <p>
              13.7 Em nenhuma hipótese a responsabilidade total da VEG TAX perante o Assinante, por
              qualquer causa, excederá o valor total pago pelo Assinante nos 3 (três) meses
              anteriores ao evento gerador do dano.
            </p>
            <p>
              13.8 Os presentes limites de responsabilidade aplicam-se na medida máxima permitida
              pelo ordenamento jurídico brasileiro.
            </p>

            {/* CLÁUSULA 14 */}
            <Clausula titulo="CLÁUSULA 14 — INDENIZAÇÃO" />
            <p>
              14.1 O Assinante obriga-se a indenizar e manter indenes a VEG TAX, seus sócios,
              administradores, empregados e prepostos, em relação a toda e qualquer demanda judicial
              ou administrativa, reclamação, autuação, multa, condenação, acordo ou prejuízo de
              qualquer natureza — incluindo honorários advocatícios e custas processuais — movidos ou
              impostos por terceiros, incluindo clientes do Assinante, Empresas Diagnosticadas,
              titulares de dados pessoais e autoridades públicas, que decorram de:
            </p>
            <p>a) Uso da Plataforma em desacordo com estes Termos ou com a legislação aplicável;</p>
            <p>b) Dados, informações e conteúdos inseridos pelo Assinante na Plataforma;</p>
            <p>
              c) Violação de direitos de terceiros, incluindo direitos de propriedade intelectual,
              sigilo profissional e proteção de dados pessoais;
            </p>
            <p>
              d) Descumprimento, pelo Assinante, de suas obrigações como controlador de dados
              pessoais perante seus clientes;
            </p>
            <p>e) Conteúdo do PDF White-label e análises ou orientações fornecidas pelo Assinante a seus clientes.</p>
            <p>
              14.2 Caso a VEG TAX venha a ser condenada ou compelida a arcar com qualquer valor em
              razão das hipóteses previstas no item 14.1, ser-lhe-á assegurado o direito de regresso
              integral contra o Assinante, acrescido de correção monetária e juros legais.
            </p>
            <p>
              14.3 A VEG TAX comunicará o Assinante sobre qualquer demanda de terceiros relacionada
              às hipóteses desta Cláusula, facultando-lhe assumir a defesa, sem prejuízo do direito
              da VEG TAX de apresentar defesa própria.
            </p>

            {/* CLÁUSULA 15 */}
            <Clausula titulo="CLÁUSULA 15 — ARMAZENAMENTO, EXPORTAÇÃO E BACKUP DE RELATÓRIOS" />
            <p>
              15.1 É de exclusiva responsabilidade do Assinante realizar o download, a exportação e a
              guarda dos relatórios PDF gerados pela Plataforma, mantendo cópias próprias dos
              documentos que considerar relevantes.
            </p>
            <p>
              15.2 Após o encerramento da conta, por qualquer motivo, a VEG TAX não garante a
              disponibilidade, recuperação ou restauração de diagnósticos, relatórios ou quaisquer
              dados, observados os prazos de retenção previstos na Política de Privacidade.
            </p>
            <p>
              15.3 A VEG TAX não se responsabiliza pela perda de rascunhos de diagnóstico armazenados
              localmente no navegador do Assinante (localStorage), os quais não são transmitidos aos
              servidores da Plataforma até que o Assinante os salve explicitamente.
            </p>
            <p>
              15.4 A exclusão de diagnósticos pelo Assinante é definitiva e irreversível, não havendo
              possibilidade de recuperação posterior.
            </p>

            {/* CLÁUSULA 16 */}
            <Clausula titulo="CLÁUSULA 16 — COMUNICAÇÕES COMERCIAIS" />
            <p>
              16.1 Além das comunicações operacionais e transacionais inerentes à prestação do
              serviço (confirmação de cadastro, redefinição de senha, status de pagamento e
              atualizações sobre a Plataforma), a VEG TAX poderá enviar comunicações de natureza
              comercial ao Assinante, desde que este tenha prestado consentimento específico,
              informado e destacado, nos termos do art. 7º, I, da Lei nº 13.709/2018 (LGPD).
            </p>
            <p>
              16.2 O consentimento para o recebimento de comunicações comerciais é opcional e
              voluntário, podendo ser prestado no ato do cadastro por meio de seleção expressa
              (opt-in). A recusa ao consentimento comercial não restringe o acesso do Assinante ao
              serviço contratado.
            </p>
            <p>
              16.3 As comunicações comerciais poderão ter por objeto produtos físicos ou digitais,
              eventos, treinamentos, materiais educativos e outros serviços relacionados à Reforma
              Tributária do Consumo, oferecidos ou indicados pela VEG TAX.
            </p>
            <p>16.4 O Assinante poderá revogar o consentimento a qualquer tempo, sem ônus, por meio:</p>
            <p>a) Do link de descadastramento presente em cada comunicação comercial enviada;</p>
            <p>b) De solicitação ao canal oficial (contato@drdanielguimaraes.com.br).</p>
            <p>
              16.5 A revogação do consentimento não afeta a licitude das comunicações realizadas
              antes da sua efetivação, nos termos do art. 8º, § 5º, da LGPD.
            </p>
            <p>
              16.6 As comunicações de natureza operacional e transacional não dependem de
              consentimento adicional e serão remetidas ao Assinante independentemente de sua opção
              em relação às comunicações comerciais.
            </p>

            {/* CLÁUSULA 17 */}
            <Clausula titulo="CLÁUSULA 17 — PRIVACIDADE E PROTEÇÃO DE DADOS" />
            <p>
              17.1 O tratamento de dados pessoais do Assinante e de eventuais terceiros pela VEG TAX
              observa as disposições da Lei nº 13.709/2018 (LGPD) e do Marco Civil da Internet (Lei
              nº 12.965/2014).
            </p>
            <p>
              17.2 As regras, finalidades, bases legais, categorias de dados tratados, direitos dos
              titulares e demais informações sobre o tratamento de dados pessoais estão descritos
              integralmente na Política de Privacidade da VEG TAX, disponível na Plataforma, a qual
              integra estes Termos por referência.
            </p>
            <p>17.3 O Assinante confirma ter lido e compreendido a Política de Privacidade antes de realizar seu cadastro.</p>

            {/* CLÁUSULA 18 */}
            <Clausula titulo="CLÁUSULA 18 — SUSPENSÃO, CANCELAMENTO E ENCERRAMENTO DA CONTA" />
            <p>18.1 A VEG TAX poderá suspender ou cancelar o acesso do Assinante nas seguintes hipóteses:</p>
            <p>a) Violação de qualquer disposição destes Termos de Uso;</p>
            <p>b) Inadimplência no pagamento, após notificação para regularização;</p>
            <p>c) Fornecimento de dados cadastrais falsos ou enganosos;</p>
            <p>d) Utilização da Plataforma para fins ilícitos ou contrários a estes Termos;</p>
            <p>e) Determinação de autoridade judicial, administrativa ou regulatória competente.</p>
            <p>
              18.2 Em caso de risco iminente à segurança da Plataforma, de outros usuários ou de
              dados — incluindo suspeita fundada de fraude, ataque cibernético, uso abusivo ou
              automatizado —, a VEG TAX poderá suspender o acesso do Assinante imediatamente e sem
              aviso prévio, comunicando-o em até 5 (cinco) dias úteis com a justificativa da medida.
            </p>
            <p>
              18.3 Nos casos de suspensão ou cancelamento por descumprimento do Assinante (alíneas a,
              c, d e e do item 18.1 e item 18.2), não haverá direito a reembolso de valores pagos.
            </p>
            <p>
              18.4 Em caso de encerramento da conta, os dados e diagnósticos armazenados poderão ser
              excluídos, observados os prazos de retenção estabelecidos na Política de Privacidade.
            </p>
            <p>
              18.5 O Assinante poderá solicitar o encerramento voluntário de sua conta a qualquer
              momento pelo canal oficial (contato@drdanielguimaraes.com.br). O encerramento
              voluntário não gera direito a reembolso, exceto na hipótese de arrependimento
              tempestivo prevista na Cláusula 7.
            </p>

            {/* CLÁUSULA 19 */}
            <Clausula titulo="CLÁUSULA 19 — VALIDADE DAS COMUNICAÇÕES ELETRÔNICAS" />
            <p>
              19.1 Todas as comunicações enviadas pela VEG TAX ao endereço de e-mail cadastrado pelo
              Assinante consideram-se válidas, eficazes e recebidas para todos os fins de direito,
              inclusive para os avisos previstos nestes Termos (alterações contratuais, reajustes de
              preço, suspensões e notificações em geral).
            </p>
            <p>
              19.2 Constitui ônus exclusivo do Assinante manter seu endereço de e-mail atualizado e
              monitorar regularmente sua caixa de entrada, incluindo pastas de spam ou lixo
              eletrônico. A VEG TAX não se responsabiliza pelo não recebimento de comunicações
              decorrente de e-mail desatualizado, caixa cheia, filtros de spam ou falhas do provedor
              de e-mail do Assinante.
            </p>
            <p>
              19.3 Avisos exibidos diretamente na interface da Plataforma (notificações in-app)
              também constituem meio válido de comunicação entre a VEG TAX e o Assinante.
            </p>

            {/* CLÁUSULA 20 */}
            <Clausula titulo="CLÁUSULA 20 — ALTERAÇÕES DESTES TERMOS" />
            <p>
              20.1 A VEG TAX reserva-se o direito de modificar estes Termos a qualquer tempo, com
              comunicação ao Assinante pelo endereço de e-mail cadastrado, com antecedência mínima de
              30 (trinta) dias da entrada em vigor das alterações, exceto quando exigida adaptação
              imediata por determinação legal ou judicial.
            </p>
            <p>
              20.2 A continuidade do uso da Plataforma após o referido prazo implicará aceitação
              tácita das novas condições. Caso o Assinante não concorde com as alterações, poderá
              cancelar seu Plano sem ônus adicional, nos termos da Cláusula 7.
            </p>
            <p>
              20.3 A versão atualizada dos Termos estará sempre disponível na Plataforma, com
              indicação da data de sua última atualização e do número de versão.
            </p>

            {/* CLÁUSULA 21 */}
            <Clausula titulo="CLÁUSULA 21 — LEI APLICÁVEL E FORO" />
            <p>21.1 Estes Termos são regidos pelas leis da República Federativa do Brasil.</p>
            <p>
              21.2 Para a resolução de quaisquer controvérsias decorrentes destes Termos, as partes
              elegem o Foro da Comarca de Anápolis, Estado de Goiás, com expressa renúncia a qualquer
              outro, por mais privilegiado que seja.
            </p>
            <p>
              21.3 Antes de recorrer ao Poder Judiciário, as partes comprometem-se a buscar, de
              boa-fé, solução amigável para quaisquer divergências decorrentes destes Termos.
            </p>

            {/* CLÁUSULA 22 */}
            <Clausula titulo="CLÁUSULA 22 — DISPOSIÇÕES GERAIS" />
            <p>
              22.1 A tolerância de qualquer das partes ao inadimplemento de cláusulas destes Termos
              não constituirá novação nem renúncia ao direito de exigir seu cumprimento.
            </p>
            <p>
              22.2 Caso qualquer disposição destes Termos seja declarada inválida, ilegal ou
              inexequível por decisão judicial transitada em julgado, as demais disposições
              permanecerão em pleno vigor e efeito, devendo a disposição atingida ser interpretada ou
              substituída de modo a preservar, na máxima medida possível, a intenção original das
              partes.
            </p>
            <p>
              22.3 Estes Termos, em conjunto com a Política de Privacidade, constituem o acordo
              integral entre as partes em relação ao objeto aqui tratado, prevalecendo sobre
              quaisquer entendimentos ou negociações anteriores.
            </p>
            <p>
              22.4 A VEG TAX poderá ceder ou transferir seus direitos e obrigações decorrentes destes
              Termos a qualquer empresa de seu grupo econômico ou em decorrência de fusão, aquisição
              ou reestruturação societária, com comunicação prévia ao Assinante.
            </p>
            <p>
              22.5 As obrigações que por sua natureza devam subsistir ao término da relação
              contratual — em especial as previstas nas Cláusulas 9, 11, 12, 13, 14 e 21 —
              permanecerão válidas e eficazes após o encerramento da conta, pelo prazo prescricional
              aplicável.
            </p>
            <p>
              22.6 Estes Termos foram elaborados em língua portuguesa, na forma exigida pela
              legislação brasileira para contratos de prestação de serviços celebrados no Brasil.
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
                Reforma em Ação — Termos de Uso v1.0 (04/05/2026)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Cabeçalho de cláusula */
function Clausula({ titulo }: { titulo: string }) {
  return (
    <h2 className="text-base font-bold text-[#0f1e35] pt-6 pb-1">{titulo}</h2>
  );
}

/** Subtítulo de item (ex: "6.2 Plano Mensal") */
function Sub({ titulo }: { titulo: string }) {
  return <h3 className="text-sm font-semibold text-[#0f1e35] pt-3">{titulo}</h3>;
}
