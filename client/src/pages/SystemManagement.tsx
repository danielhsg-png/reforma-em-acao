import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Database, Settings, Zap, FileText, Code, Monitor, Shield } from "lucide-react";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";

export default function SystemManagement() {
  const { data } = useAppStore();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const systemTasks = [
    {
      id: "system_contact",
      title: "Contate seu fornecedor de ERP/PDV",
      description: "Pergunte especificamente: 'Qual e o seu roadmap para a implementacao de IBS/CBS? Quando teremos versao de teste com os novos campos da NT 2025.002?'",
      impact: "Critico",
    },
    {
      id: "system_update_plan",
      title: "Solicite o plano de atualizacao para 2026",
      description: "Peca por escrito um cronograma de atualizacoes incluindo: novos campos de IBS/CBS na NF-e, calculo 'por fora', cClassTrib, cCredPres e vinculacao ao pagamento (Split Payment).",
      impact: "Critico",
    },
    {
      id: "training_request",
      title: "Agende treinamento do fornecedor",
      description: "Solicite treinamento focado no novo fluxo de validacoes: campos obrigatorios IBS/CBS, classificacao tributaria por item (cClassTrib), e como o sistema tratara o Split Payment.",
      impact: "Alto",
    },
    {
      id: "test_environment",
      title: "Prepare ambiente de testes",
      description: "Peca acesso a um ambiente de testes com aliquotas simuladas (CBS 0,9% + IBS 0,1% = 1,0%) para validar emissao de NF-e antes do 'go-live' em 01/01/2026.",
      impact: "Alto",
    },
    {
      id: "nfse_check",
      title: "Verifique adequacao para NFS-e (se presta servicos)",
      description: "A NFS-e Nacional ganha novo layout para IBS/CBS (NT 004 e NT 005 SE-CGNFSe). Confirme se o municipio ja aderiu ao padrao nacional e se o sistema emite no novo formato.",
      impact: "Alto",
    },
  ];

  const catalogTasks = [
    {
      id: "catalog_standard",
      title: "Defina padrao de cadastro minimo obrigatorio",
      description: "Todo novo item DEVE ter: codigo unico, descricao padronizada (com variacoes: modelo, cor, tamanho), unidade de medida fixa (UN, KG, LT), fornecedor principal, NCM/NBS, cClassTrib correto e cCredPres quando aplicavel.",
      impact: "Critico",
    },
    {
      id: "catalog_cleanup",
      title: "Auditoria do catalogo existente (Top 30 itens)",
      description: "Revise os Top 30 itens mais vendidos (faturamento, giro e margem). Procure por duplicatas, descricoes inconsistentes, NCM/NBS incorretos e itens sem classificacao tributaria.",
      impact: "Alto",
    },
    {
      id: "catalog_anti_dup",
      title: "Implemente regra anti-duplicidade",
      description: "Antes de criar novo cadastro, pesquise por: codigo interno, descricao e fornecedor. Se existir item similar, corrija o existente ao inves de criar duplicata.",
      impact: "Alto",
    },
    {
      id: "catalog_training",
      title: "Treine a equipe responsavel",
      description: "Quem insere dados no catalogo precisa entender: por que padronizar descricoes, como conferir NCM/NBS, e qual o impacto de um cClassTrib errado (perda de credito ou penalidade).",
      impact: "Medio",
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight" data-testid="text-system-title">
            Gestao de Cadastros e Sistemas
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            O coracao da operacao. Sistemas e dados devem estar 100% prontos para 2026.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <Alert className="border-2 border-primary bg-primary/5">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-bold">A Janela de Tempo e Apertada</AlertTitle>
          <AlertDescription className="text-sm mt-2">
            A NT 2025.002 v1.34 ja define os novos campos de NF-e para IBS/CBS. Seu fornecedor de ERP precisa estar preparado para testes em 2025, com suporte completo em janeiro de 2026. Se voce esperar ate 2026 para comecar, sera tarde.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="erp" className="space-y-6">
          <TabsList className="bg-secondary h-auto flex flex-wrap gap-1 p-1">
            <TabsTrigger value="erp" className="py-2 px-3 text-sm">Adequacao ERP</TabsTrigger>
            <TabsTrigger value="nfe" className="py-2 px-3 text-sm">Campos NF-e</TabsTrigger>
            <TabsTrigger value="cadastro" className="py-2 px-3 text-sm">Padrao de Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="erp" className="animate-in fade-in space-y-6">
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-heading flex items-center gap-2 mb-2">
                  <Settings className="h-6 w-6 text-primary" />
                  Adequacao do Emissor/ERP
                </h2>
                <p className="text-muted-foreground">Tarefas com seu fornecedor de sistema</p>
              </div>

              <div className="grid gap-4">
                {systemTasks.map((task) => (
                  <Card key={task.id} className={`transition-all ${completedTasks.includes(task.id) ? "bg-muted/30" : ""}`} data-testid={`card-task-${task.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id={task.id}
                          checked={completedTasks.includes(task.id)}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                          data-testid={`checkbox-task-${task.id}`}
                        />
                        <div className="flex-1">
                          <Label htmlFor={task.id} className="text-base font-bold cursor-pointer block">
                            {task.title}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                          <div className="mt-3">
                            <Badge variant={task.impact === "Critico" ? "destructive" : task.impact === "Alto" ? "default" : "secondary"}>
                              {task.impact}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {(data.erpSystem === "nenhum" || data.erpSystem === "planilha") && (
              <Alert className="border-2 border-destructive bg-destructive/5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertTitle className="text-destructive font-bold">Alerta Critico: Voce nao tem sistema de gestao</AlertTitle>
                <AlertDescription className="text-sm mt-2">
                  O controle manual (planilhas) nao suportara a complexidade do novo regime. A NF-e com campos IBS/CBS exige automacao. Considere adotar um ERP (Bling, Omie, Tiny, Conta Azul) imediatamente.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="nfe" className="animate-in fade-in space-y-6">
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-heading flex items-center gap-2 mb-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Novos Campos Obrigatorios na NF-e
                </h2>
                <p className="text-muted-foreground">Baseado na NT 2025.002 v1.34 (RFB/ENCAT)</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      cClassTrib - Classificacao Tributaria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Codigo que define o tratamento tributario de cada item na NF-e. Cada produto ou servico precisa ter um cClassTrib cadastrado corretamente.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-muted rounded">
                        <strong>Tributacao integral:</strong> Aliquota cheia de IBS + CBS aplicada
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <strong>Reducao de aliquota:</strong> Produtos da cesta basica, medicamentos, etc.
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <strong>Isencao/Imunidade:</strong> Exportacoes, operacoes especificas previstas na LC 214
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <strong>Diferimento:</strong> Tributacao adiada para etapa posterior da cadeia
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      cCredPres - Credito Presumido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Indicador que informa ao comprador qual credito ele pode tomar. Essencial para transacoes com o Simples Nacional.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-muted rounded">
                        <strong>Credito integral:</strong> Vendedor recolhe aliquota cheia; comprador toma credito de 26,5%
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <strong>Credito presumido:</strong> Simples Nacional que recolhe IBS/CBS no DAS; comprador toma credito pela aliquota efetiva (4-8%)
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <strong>Sem credito:</strong> Vendedor isento ou imune; comprador nao toma credito
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    Grupo de Campos IBS/CBS por Item da NF-e
                  </CardTitle>
                  <CardDescription>Cada item da nota fiscal devera conter estes campos adicionais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { field: "CST IBS/CBS", desc: "Codigo de Situacao Tributaria especifico para IBS e CBS" },
                      { field: "cClassTrib", desc: "Classificacao tributaria do item (determina aliquota e tratamento)" },
                      { field: "cCredPres", desc: "Tipo de credito presumido para o adquirente" },
                      { field: "pAliqIBS_UF", desc: "Aliquota de IBS do estado de destino" },
                      { field: "pAliqIBS_Mun", desc: "Aliquota de IBS do municipio de destino" },
                      { field: "pAliqCBS", desc: "Aliquota de CBS federal" },
                      { field: "vBC_IBSCBS", desc: "Base de calculo (preco 'por fora')" },
                      { field: "vIBS", desc: "Valor calculado do IBS" },
                      { field: "vCBS", desc: "Valor calculado da CBS" },
                    ].map((item) => (
                      <div key={item.field} className="p-2 border rounded text-xs">
                        <span className="font-mono font-bold text-primary">{item.field}</span>
                        <p className="text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t">
                  <p className="text-xs text-muted-foreground">
                    Em 2026 (fase de teste): CBS = 0,9%, IBS = 0,1%. Estes campos devem estar preenchidos em todas as NF-e emitidas a partir de 01/01/2026.
                  </p>
                </CardFooter>
              </Card>

              <Card className="mt-6 border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Documentos Fiscais Impactados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-sm mb-2">Documentos com novos campos</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" /> NF-e (modelo 55) - NT 2025.002</li>
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" /> NFC-e (modelo 65) - consumidor final</li>
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" /> CT-e (transporte) - NT 2026.001</li>
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" /> BPe (passageiro) - NT 2025.001/002</li>
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" /> NFS-e Nacional - NT 004/005 CGNFSe</li>
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" /> NFCom (telecom) - Anexo DANFE-COM</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-2">Vinculacao ao pagamento</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> NF-e vinculada ao meio de pagamento</li>
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> CT-e com campo de vinculacao Split Payment</li>
                        <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> BPe com vinculacao a pagamento</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded">
                        A NT 2026.001 (v1.00/v1.01) de CT-e e BPe trata especificamente da vinculacao entre documento fiscal e liquidacao financeira para operacionalizar o Split Payment.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="cadastro" className="animate-in fade-in space-y-6">
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-heading flex items-center gap-2 mb-2">
                  <Database className="h-6 w-6 text-accent" />
                  Padrao de Cadastro Minimo Obrigatorio
                </h2>
                <p className="text-muted-foreground">Defina isto AGORA, para nao ter surpresas em 2026</p>
              </div>

              <div className="grid gap-4">
                {catalogTasks.map((task) => (
                  <Card key={task.id} className={`transition-all ${completedTasks.includes(task.id) ? "bg-muted/30" : ""}`} data-testid={`card-task-${task.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id={task.id}
                          checked={completedTasks.includes(task.id)}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={task.id} className="text-base font-bold cursor-pointer block">
                            {task.title}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                          <div className="mt-3">
                            <Badge variant={task.impact === "Critico" ? "destructive" : task.impact === "Alto" ? "default" : "secondary"}>
                              {task.impact}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  O Que Todo Item DEVE Ter no Cadastro
                </CardTitle>
                <CardDescription>
                  Padrao minimo para garantir emissao correta da NF-e com IBS/CBS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                      <div>
                        <strong className="text-sm">Codigo Unico</strong>
                        <p className="text-xs text-muted-foreground">Sem duplicatas. Pesquisar antes de criar novo item.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                      <div>
                        <strong className="text-sm">Descricao Padronizada</strong>
                        <p className="text-xs text-muted-foreground">Com variacoes (tamanho, cor, modelo). Consistente com a descricao do fornecedor.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                      <div>
                        <strong className="text-sm">Unidade de Medida</strong>
                        <p className="text-xs text-muted-foreground">Fixa e consistente (UN, KG, LT, CX, PCT). Mesma unidade na compra e na venda.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                      <div>
                        <strong className="text-sm">Fornecedor Principal</strong>
                        <p className="text-xs text-muted-foreground">Referencia para compras e conferencia de notas recebidas.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="h-3 w-3 rounded-full bg-destructive mt-1.5 mr-3 shrink-0" />
                      <div>
                        <strong className="text-sm">NCM (Produtos) / NBS (Servicos)</strong>
                        <p className="text-xs text-muted-foreground">Revisado e correto. Determina o enquadramento tributario no IBS/CBS.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-3 w-3 rounded-full bg-destructive mt-1.5 mr-3 shrink-0" />
                      <div>
                        <strong className="text-sm">cClassTrib</strong>
                        <p className="text-xs text-muted-foreground">Classificacao tributaria correta (integral, reduzida, isenta). Errar este campo = perda de credito ou penalidade.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-3 w-3 rounded-full bg-destructive mt-1.5 mr-3 shrink-0" />
                      <div>
                        <strong className="text-sm">cCredPres (quando aplicavel)</strong>
                        <p className="text-xs text-muted-foreground">Indicador de credito presumido para vendas a clientes B2B. Essencial para empresas do Simples Nacional.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/risk-assessment">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-risk">
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </Button>
          </Link>
          <Link href="/supply-chain">
            <Button size="lg" className="gap-2" data-testid="button-next-supply">
              Proximo: Gestao de Fornecedores
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
