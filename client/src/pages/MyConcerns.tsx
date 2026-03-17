import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, ArrowRight, MessageCircleQuestion, Send, BookOpen, CheckCircle2, AlertTriangle, Info, Lightbulb, Scale, DollarSign, FileText, ShieldAlert, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface ConcernEntry {
  id: number;
  question: string;
}

interface AnswerResult {
  titulo: string;
  resposta: string;
  referenciaLegal: string;
  dicaPratica: string;
  risco: string;
}

const KNOWLEDGE_BASE: { keywords: string[]; answer: AnswerResult }[] = [
  {
    keywords: ["preco", "precificacao", "repassar", "repasse", "margem", "custo", "caro", "aumentar preco", "cobrar mais"],
    answer: {
      titulo: "Impacto nos Precos e Estrategia de Repasse",
      resposta: "Com o IVA Dual (IBS+CBS), a aliquota de referencia sera de 26,5%, cobrada 'por fora' (nao integra a propria base). Para vendas B2B, o preco deve refletir o valor sem imposto, pois o comprador toma credito integral. Para vendas B2C, o consumidor vera o imposto separado na nota. A estrategia de precificacao deve considerar: (1) creditos de insumos que reduzem a carga efetiva, (2) regime especial que pode reduzir a aliquota, (3) concorrentes que terao a mesma carga tributaria.",
      referenciaLegal: "LC 214/2025, art. 12 (calculo por fora); arts. 28-47 (creditos)",
      dicaPratica: "Faca uma simulacao no modulo Simulador Financeiro com seus numeros reais. Compare o imposto atual com o novo cenario e ajuste precos gradualmente durante a transicao (2026-2033).",
      risco: "Empresas que nao recalibrarem precos durante a transicao podem perder margem silenciosamente.",
    },
  },
  {
    keywords: ["credito", "creditos", "tomar credito", "aproveitar", "compensar", "compensacao", "abater", "deduzir"],
    answer: {
      titulo: "Sistema de Creditos IBS/CBS (Nao-Cumulatividade Plena)",
      resposta: "O novo sistema adota a nao-cumulatividade PLENA: voce pode tomar credito de IBS/CBS sobre praticamente TODAS as aquisicoes de bens e servicos utilizados na atividade economica. Isso inclui: materias-primas, mercadorias para revenda, energia eletrica, aluguel (de PJ), frete, software/licencas, servicos de terceiros, manutencao, equipamentos. A principal excecao e: bens e servicos de uso pessoal do socio/empregado, e folha de pagamento (que NAO gera credito).",
      referenciaLegal: "LC 214/2025, arts. 28-47 (creditos); art. 36 (vedacoes de credito)",
      dicaPratica: "Mapeie todas as suas despesas e classifique quais geram credito. O modulo Cadeia de Fornecedores tem uma matriz completa de 12 categorias com indicacao de creditamento.",
      risco: "Nao aproveitar creditos disponiveis e dinheiro perdido. Empresas com custo concentrado em folha de pagamento (que nao gera credito) terao aumento efetivo de carga.",
    },
  },
  {
    keywords: ["split payment", "retencao", "cartao", "pix", "pagamento", "fluxo de caixa", "receber", "adquirente", "maquininha"],
    answer: {
      titulo: "Split Payment: Retencao Automatica na Fonte",
      resposta: "O Split Payment e o mecanismo de recolhimento automatico do IBS/CBS no momento da liquidacao financeira. Quando o cliente paga com cartao de credito/debito, PIX ou boleto registrado, o adquirente (operadora de cartao) ou o banco (PIX) retira automaticamente a parcela do imposto e repassa diretamente ao Fisco. Voce, vendedor, recebe apenas o valor liquido (preco - imposto). Isso elimina a sonegacao mas impacta diretamente o fluxo de caixa.",
      referenciaLegal: "LC 214/2025, arts. 50-55 (Split Payment); LC 227/2026 (regulamentacao)",
      dicaPratica: "Ajuste seu fluxo de caixa: voce nao tera mais o imposto temporariamente em caixa. Se hoje voce usa esse dinheiro como capital de giro, planeje uma linha de credito ou reserva.",
      risco: "Empresas que dependem do imposto cobrado como capital de giro terao um choque de liquidez. O impacto e maior no varejo e servicos B2C.",
    },
  },
  {
    keywords: ["simples", "simples nacional", "das", "mei", "micro", "pequena empresa", "opcao", "sair do simples", "ficar no simples"],
    answer: {
      titulo: "Simples Nacional na Reforma Tributaria",
      resposta: "O Simples Nacional sera MANTIDO, mas com mudancas importantes. A empresa do Simples continuara recolhendo tudo pelo DAS, porem a parcela de IBS/CBS dentro do DAS sera destacada. A grande novidade e que a empresa PODE OPTAR por recolher IBS e CBS FORA do DAS, no regime regular com creditos amplos. Essa opcao e irretratavel para o ano-calendario. Se optar pelo regime regular, seus clientes B2B poderao tomar credito integral (aliquota plena), em vez do credito limitado (aliquota efetiva do Simples).",
      referenciaLegal: "LC 214/2025 (opcao pelo regime regular); Lei Complementar 123/2006 (Simples Nacional)",
      dicaPratica: "Use o Simulador Simples Nacional desta ferramenta para comparar as duas opcoes com seus numeros reais. Considere o perfil dos seus clientes (B2B vs B2C) na decisao.",
      risco: "Se a maioria dos seus clientes e B2B (empresas grandes), permanecer no Simples pode tornar seus precos menos competitivos, pois o cliente toma credito menor.",
    },
  },
  {
    keywords: ["nota fiscal", "nf-e", "nfe", "emissao", "nota", "xml", "campos", "sefaz", "sistema", "erp"],
    answer: {
      titulo: "Novas Obrigacoes na Nota Fiscal Eletronica (NF-e)",
      resposta: "A partir de 2026, todas as NF-e, NFC-e, NFS-e, CT-e e MDF-e precisarao conter campos novos e obrigatorios para IBS e CBS. Os principais campos novos sao: cClassTrib (classificacao tributaria por item), cCredPres (indicador de credito presumido), CST do IBS/CBS (codigo de situacao tributaria), aliquotas de IBS e CBS por item, e o grupo completo de calculo IBS/CBS. A Nota Tecnica 2025.002 v1.34 detalha todos os campos e regras de validacao.",
      referenciaLegal: "NT 2025.002 v1.34 (NF-e/NFC-e); NT 2026.001 (CT-e/BPe); NT 004/005 CGNFSe (NFS-e)",
      dicaPratica: "Verifique com o fornecedor do seu ERP/sistema fiscal se ele ja esta se adequando. Sistemas que nao atualizarem podem travar a emissao de notas a partir de 2026.",
      risco: "NF-e emitida SEM os campos de IBS/CBS gera penalidade automatica de 1% do valor da operacao, sem possibilidade de defesa (LC 214/2025, art. 63).",
    },
  },
  {
    keywords: ["penalidade", "multa", "punicao", "fiscalizacao", "autuacao", "1%", "auto de infracao"],
    answer: {
      titulo: "Penalidades e Multas da Nova Legislacao",
      resposta: "A LC 214/2025 traz uma penalidade automatica especifica: NF-e emitida sem os campos obrigatorios de IBS e CBS gera multa de 1% do valor da operacao, aplicada automaticamente pela SEFAZ, sem necessidade de auto de infracao e sem possibilidade de defesa previa. Isso vale a partir do inicio da obrigatoriedade dos campos. Alem disso, as penalidades gerais por descumprimento de obrigacoes acessorias do IBS/CBS seguem as regras tradicionais de fiscalizacao, com possibilidade de defesa administrativa.",
      referenciaLegal: "LC 214/2025, art. 63 (penalidade de 1%)",
      dicaPratica: "Priorize a atualizacao do sistema de emissao de NF-e. O risco de penalidade automatica e alto e o custo pode ser expressivo para empresas com alto volume de notas.",
      risco: "Exemplo: R$ 500.000/mes em notas sem campos IBS/CBS = R$ 5.000/mes de penalidade = R$ 60.000/ano de perda pura.",
    },
  },
  {
    keywords: ["transicao", "cronograma", "quando", "prazo", "data", "2026", "2027", "2033", "timeline", "fase"],
    answer: {
      titulo: "Cronograma de Transicao 2026-2033",
      resposta: "A transicao sera gradual: 2026 — Fase de teste com aliquota de 1% (CBS 0,9% + IBS 0,1%), compensavel com tributos atuais. 2027 — CBS entra em vigor com aliquota plena (~8,8%), PIS e COFINS sao extintos. IBS permanece em 0,1%. 2029-2032 — IBS sobe progressivamente (+10% ao ano do valor final), enquanto ICMS e ISS diminuem proporcionalmente. 2033 — Sistema pleno: IBS ~17,7% + CBS ~8,8% = 26,5%. ICMS e ISS totalmente extintos.",
      referenciaLegal: "EC 132/2023, art. 124-133 (regras de transicao); LC 214/2025",
      dicaPratica: "Use o Simulador Financeiro para projetar o impacto em cada ano. Aproveite 2026 como ano de aprendizado — o impacto financeiro e minimo (1%).",
      risco: "Empresas que deixarem para se adequar em 2027 (CBS plena) terao pouco tempo. O ideal e comecar a preparacao em 2026.",
    },
  },
  {
    keywords: ["fornecedor", "fornecedores", "cadeia", "compras", "renegociar", "substituir", "trocar fornecedor"],
    answer: {
      titulo: "Impacto nos Fornecedores e Cadeia de Suprimentos",
      resposta: "O novo sistema muda a logica de escolha de fornecedores. Fornecedores do Simples Nacional geram credito limitado (proporcional a aliquota efetiva deles, tipicamente 4-8%), enquanto fornecedores do regime regular geram credito integral (26,5%). Isso pode tornar fornecedores do Simples relativamente mais caros na comparacao liquida. A recomendacao e fazer uma Matriz A/B/C dos seus fornecedores, classificando por: (A) volume de compras, (B) regime tributario, (C) possibilidade de substituicao.",
      referenciaLegal: "LC 214/2025, arts. 28-47 (creditos); art. 44 (credito de fornecedor Simples)",
      dicaPratica: "Use o modulo Cadeia de Fornecedores para classificar seus 20 principais fornecedores. Renegocie precos com fornecedores do Simples ou avalie alternativas no regime regular.",
      risco: "Concentracao de compras em fornecedores do Simples pode reduzir significativamente seu aproveitamento de creditos e aumentar a carga tributaria efetiva.",
    },
  },
  {
    keywords: ["contrato", "contratos", "longo prazo", "reequilibrio", "clausula", "revisao", "renegociar contrato", "aditivo"],
    answer: {
      titulo: "Contratos de Longo Prazo e Clausulas de Reequilibrio",
      resposta: "Contratos firmados antes da reforma que nao contenham clausula de revisao por mudanca tributaria representam um risco grave. Se a nova carga tributaria for maior, voce absorve a diferenca ate o vencimento do contrato. A reforma altera a base de calculo, as aliquotas e o regime de creditamento — tudo isso afeta o preco liquido. Recomenda-se incluir clausulas de reequilibrio tributario em todos os contratos novos e negociar aditivos para contratos existentes.",
      referenciaLegal: "Codigo Civil, art. 317 (onerosidade excessiva); EC 132/2023 (transicao)",
      dicaPratica: "Prepare um modelo de aditivo contratual com clausula especifica de reequilibrio por mudanca na legislacao tributaria. Envie para todos os contratos ativos com mais de 12 meses de vigencia.",
      risco: "Contratos com preco fixo e sem clausula de revisao podem gerar prejuizo por anos. Quanto antes renegociar, melhor.",
    },
  },
  {
    keywords: ["destino", "estado", "interestadual", "icms", "iss", "municipal", "estadual", "onde pagar", "guerra fiscal"],
    answer: {
      titulo: "Principio do Destino e Fim da Guerra Fiscal",
      resposta: "O IBS sera recolhido integralmente no estado de DESTINO (onde o consumidor esta), e nao mais na origem (onde o vendedor esta). Isso acaba com a guerra fiscal entre estados. Para empresas que vendem para multiplos estados, isso significa: (1) obrigacoes acessorias em cada estado de destino, (2) aliquotas de IBS que podem variar por municipio/estado, (3) necessidade de identificar corretamente o local de destino em cada operacao. O Comite Gestor do IBS administrara as aliquotas e a distribuicao.",
      referenciaLegal: "LC 214/2025, arts. 11-15 (principio do destino); EC 132/2023, art. 156-A",
      dicaPratica: "Se voce vende para mais de 3 estados, considere automatizar a identificacao do destino e o calculo da aliquota no seu ERP.",
      risco: "Erro na identificacao do estado de destino gera recolhimento em local errado e possivel autuacao.",
    },
  },
  {
    keywords: ["cashback", "devolucao", "familia", "baixa renda", "consumidor", "social", "pobre"],
    answer: {
      titulo: "Cashback: Devolucao de Imposto para Familias de Baixa Renda",
      resposta: "O programa de Cashback previsto na LC 214/2025 devolve parte do IBS/CBS pago por familias de baixa renda (inscritas no CadUnico). A devolucao e automatica, creditada na conta do beneficiario apos a compra, e varia por tipo de produto: energia eletrica (100% de devolucao de CBS e 20% de IBS), agua e esgoto (100% de devolucao), gas de cozinha (100% de devolucao), e demais produtos (20% de devolucao). Para o empresario, o cashback nao altera a tributacao — voce recolhe normalmente e o governo devolve ao consumidor.",
      referenciaLegal: "LC 214/2025, arts. 105-116 (Cashback)",
      dicaPratica: "Se voce vende para consumidores de baixa renda, comunique que parte do imposto sera devolvida. Isso pode ser um argumento de venda.",
      risco: "Nenhum risco direto para o empresario. O cashback e responsabilidade do governo.",
    },
  },
  {
    keywords: ["contador", "contabilidade", "escrituracao", "obrigacao", "declaracao", "acessoria", "compliance"],
    answer: {
      titulo: "Obrigacoes Acessorias e Papel do Contador",
      resposta: "O novo sistema exige: (1) escrituracao detalhada de debitos e creditos de IBS e CBS separadamente, (2) NF-e com campos novos obrigatorios, (3) conciliacao mensal de creditos com fornecedores, (4) apuracao e recolhimento separado de IBS (Comite Gestor) e CBS (RFB), (5) declaracoes periodicas ao Comite Gestor e a RFB. O papel do contador se torna mais tecnico e estrategico. Se seu contador e externo, verifique se ele esta se capacitando para o novo sistema.",
      referenciaLegal: "LC 214/2025, arts. 56-75 (obrigacoes acessorias e escrituracao)",
      dicaPratica: "Agende uma reuniao com seu contador para discutir: capacitacao, atualizacao de sistemas, e se ha necessidade de reforcar a equipe fiscal.",
      risco: "Contador desatualizado pode gerar erros na apuracao, perda de creditos e penalidades automaticas.",
    },
  },
  {
    keywords: ["imposto seletivo", "seletivo", "is", "pecado", "sin tax", "prejudicial", "meio ambiente", "saude"],
    answer: {
      titulo: "Imposto Seletivo (IS) — O 'Imposto do Pecado'",
      resposta: "O Imposto Seletivo (IS) e um tributo ADICIONAL que incide sobre produtos prejudiciais a saude ou ao meio ambiente. Ele NAO substitui o IBS/CBS — e cobrado ALEM deles. Os produtos sujeitos ao IS sao: bebidas alcoolicas, bebidas acucaradas (refrigerantes), tabaco e cigarros, veiculos (exceto eletricos), embarcacoes e aeronaves de recreio, e extracao de minerios (0,25% a 1%). O IS e nao-cumulativo para o adquirente que utilize o bem como insumo.",
      referenciaLegal: "LC 214/2025, arts. 393-421 (Imposto Seletivo); EC 132/2023, art. 153, VIII",
      dicaPratica: "Se voce comercializa produtos sujeitos ao IS, faca a simulacao financeira incluindo o IS na carga total. Avalie se o mercado absorve o repasse.",
      risco: "A carga tributaria total (IBS + CBS + IS) pode ultrapassar 30% para produtos como bebidas alcoolicas e tabaco.",
    },
  },
  {
    keywords: ["imobiliario", "imovel", "locacao", "aluguel", "incorporacao", "construcao civil", "venda de imovel"],
    answer: {
      titulo: "Regime Especial para Operacoes Imobiliarias",
      resposta: "Operacoes com imoveis tem regime especifico na LC 214/2025. A base de calculo tem um redutor social (R$ 100.000 a R$ 400.000 dependendo da operacao), que reduz o imposto para imoveis de menor valor. Locacao de imoveis tambem tem tratamento diferenciado. Incorporadoras podem tomar creditos sobre insumos da construcao (cimento, aco, mao de obra terceirizada). Para PF que vende imovel, ha regime simplificado.",
      referenciaLegal: "LC 214/2025, arts. 257-263 (regime imobiliario)",
      dicaPratica: "Se voce opera no mercado imobiliario, o impacto pode ser favoravel para imoveis populares (redutor social alto) e desfavoravel para imoveis de alto padrao.",
      risco: "O setor imobiliario tera uma das maiores mudancas operacionais. Contratos de venda e locacao precisam ser revisados.",
    },
  },
  {
    keywords: ["zona franca", "zfm", "manaus", "amazonia", "beneficio", "incentivo", "isencao"],
    answer: {
      titulo: "Zona Franca de Manaus (ZFM) na Reforma",
      resposta: "A Zona Franca de Manaus tera seus beneficios MANTIDOS ate 2073 (prazo constitucional). No novo sistema, a ZFM tera: (1) credito presumido de IBS/CBS para operacoes na regiao, (2) tratamento diferenciado para importacoes, (3) aliquotas reduzidas especificas. Empresas que operam na ZFM manterao vantagem competitiva tributaria.",
      referenciaLegal: "LC 214/2025, arts. 448-473 (ZFM); CF, art. 40 ADCT",
      dicaPratica: "Se voce esta na ZFM, trabalhe com seu contador para entender o mecanismo de credito presumido e como ele se compara aos beneficios atuais.",
      risco: "A regulamentacao detalhada da ZFM no novo sistema ainda esta sendo finalizada. Acompanhe as normas complementares.",
    },
  },
];

function findBestAnswer(question: string): AnswerResult | null {
  const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let bestMatch: { answer: AnswerResult; score: number } | null = null;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const kw = keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (q.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { answer: entry.answer, score };
    }
  }

  return bestMatch?.answer || null;
}

const emptyConcern = (): ConcernEntry => ({
  id: Date.now() + Math.random(),
  question: "",
});

export default function MyConcerns() {
  const { data } = useAppStore();
  const [concerns, setConcerns] = useState<ConcernEntry[]>([emptyConcern()]);
  const [analyzedIds, setAnalyzedIds] = useState<Set<number>>(new Set());

  const addConcern = () => {
    if (concerns.length < 5) {
      setConcerns([...concerns, emptyConcern()]);
    }
  };

  const updateConcern = (id: number, question: string) => {
    setConcerns(concerns.map((c) => (c.id === id ? { ...c, question } : c)));
    setAnalyzedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const analyzeAll = () => {
    const ids = new Set(concerns.filter((c) => c.question.trim().length > 0).map((c) => c.id));
    setAnalyzedIds(ids);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight flex items-center gap-3" data-testid="text-concerns-title">
            <MessageCircleQuestion className="h-8 w-8 text-primary" />
            Minhas Duvidas sobre a Reforma
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Escreva ate 5 duvidas ou preocupacoes que voce tem sobre a Reforma Tributaria. 
            Vamos buscar respostas especificas com base na legislacao vigente.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8">
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Suas Perguntas ({concerns.length}/5)
              </CardTitle>
              <CardDescription>
                Escreva suas duvidas de forma livre. Exemplos: "Como vai funcionar o split payment no meu comercio?", 
                "Vale a pena sair do Simples Nacional?", "Como recalcular meus precos?"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {concerns.map((concern, index) => (
                <div key={concern.id} className="space-y-2" data-testid={`concern-entry-${index}`}>
                  <div className="flex items-center justify-between">
                    <Label className="font-bold text-sm">Duvida {index + 1}</Label>
                    {concerns.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setConcerns(concerns.filter((c) => c.id !== concern.id));
                          setAnalyzedIds((prev) => {
                            const next = new Set(prev);
                            next.delete(concern.id);
                            return next;
                          });
                        }}
                        className="h-8 text-xs text-muted-foreground hover:text-destructive"
                        data-testid={`button-remove-concern-${index}`}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  <Textarea
                    placeholder="Digite sua duvida ou preocupacao aqui..."
                    value={concern.question}
                    onChange={(e) => updateConcern(concern.id, e.target.value)}
                    className="min-h-[80px]"
                    data-testid={`textarea-concern-${index}`}
                  />
                </div>
              ))}

              <div className="flex items-center gap-3">
                {concerns.length < 5 && (
                  <Button
                    variant="outline"
                    onClick={addConcern}
                    className="gap-2"
                    data-testid="button-add-concern"
                  >
                    + Adicionar Duvida
                  </Button>
                )}
                <Button
                  onClick={analyzeAll}
                  className="gap-2"
                  disabled={concerns.every((c) => !c.question.trim())}
                  data-testid="button-analyze-concerns"
                >
                  <Send className="h-4 w-4" />
                  Buscar Respostas
                </Button>
              </div>
            </CardContent>
          </Card>

          {concerns.some((c) => analyzedIds.has(c.id) && c.question.trim()) && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Respostas Personalizadas
              </h2>

              {concerns
                .filter((c) => analyzedIds.has(c.id) && c.question.trim())
                .map((concern, index) => {
                  const answer = findBestAnswer(concern.question);

                  if (!answer) {
                    return (
                      <Card key={concern.id} className="border-amber-200 bg-amber-50/30" data-testid={`card-answer-${index}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-amber-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Duvida: "{concern.question.substring(0, 80)}..."
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-amber-700 mb-3">
                            Nao encontramos uma resposta especifica para esta pergunta em nossa base de conhecimento. 
                            Recomendamos:
                          </p>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                              <Info className="h-3 w-3 mt-0.5 text-amber-600 shrink-0" />
                              <span>Reformule a pergunta usando termos como: preco, credito, split payment, simples, nota fiscal, penalidade, transicao, fornecedor, contrato, destino, cashback, contador, imposto seletivo.</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Info className="h-3 w-3 mt-0.5 text-amber-600 shrink-0" />
                              <span>Consulte os modulos do plano de acao que cobrem os principais temas da reforma de forma detalhada.</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Info className="h-3 w-3 mt-0.5 text-amber-600 shrink-0" />
                              <span>Para duvidas muito especificas do seu caso, consulte seu contador ou assessor tributario.</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }

                  return (
                    <Card key={concern.id} className="shadow-sm border-l-4 border-l-primary" data-testid={`card-answer-${index}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="secondary" className="text-[10px] mb-2">Sua pergunta</Badge>
                            <p className="text-sm text-muted-foreground italic mb-2">"{concern.question}"</p>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-primary shrink-0" />
                              {answer.titulo}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-sm leading-relaxed">
                          {answer.resposta}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-xs font-bold text-blue-800">Referencia Legal</span>
                            </div>
                            <p className="text-xs text-blue-700">{answer.referenciaLegal}</p>
                          </div>

                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-bold text-green-800">Dica Pratica</span>
                            </div>
                            <p className="text-xs text-green-700">{answer.dicaPratica}</p>
                          </div>
                        </div>

                        <Alert className="bg-red-50 border-red-200">
                          <ShieldAlert className="h-4 w-4 text-red-600" />
                          <AlertTitle className="text-red-800 text-xs">Ponto de Atencao</AlertTitle>
                          <AlertDescription className="text-xs text-red-700">
                            {answer.risco}
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}

          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Temas Populares que Voce Pode Perguntar
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Como recalcular meus precos?",
                  "O que e split payment?",
                  "Vale sair do Simples?",
                  "Quais creditos posso tomar?",
                  "Quando começa a transição?",
                  "Nota fiscal vai mudar?",
                  "Qual a penalidade por erro?",
                  "Imposto seletivo me afeta?",
                  "Como renegociar contratos?",
                  "O que muda nos fornecedores?",
                  "Cashback afeta meu negocio?",
                  "Zona Franca de Manaus",
                ].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => {
                      if (concerns.length < 5) {
                        const newConcern = emptyConcern();
                        newConcern.question = topic;
                        setConcerns([...concerns, newConcern]);
                      } else {
                        const lastEmpty = concerns.find((c) => !c.question.trim());
                        if (lastEmpty) {
                          updateConcern(lastEmpty.id, topic);
                        }
                      }
                    }}
                    data-testid={`button-topic-${topic.substring(0, 20).replace(/\s/g, "-")}`}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-start pt-8 border-t mt-8">
          <Link href="/inicio">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
