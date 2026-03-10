import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Database, Settings, Zap } from "lucide-react";
import { Link } from "wouter";

export default function SystemManagement() {
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
      description: "Pergunte especificamente: 'Qual é o seu roadmap para a implementação de IBS/CBS? Quando teremos versão de teste?'",
      impact: "Crítico",
    },
    {
      id: "system_update_plan",
      title: "Solicite o plano de atualização para 2026",
      description: "Peça por escrito um cronograma de atualizações de versões, prazos de suporte e custos envolvidos.",
      impact: "Crítico",
    },
    {
      id: "training_request",
      title: "Agende treinamento do fornecedor",
      description: "Solicite um treinamento focado no novo fluxo de validações, campos obrigatórios e cálculos de IBS/CBS.",
      impact: "Alto",
    },
    {
      id: "test_environment",
      title: "Prepare ambiente de testes",
      description: "Peça acesso a um ambiente de testes com alíquotas simuladas (CBS 0,9% + IBS 0,1%) para validar antes do 'go-live'.",
      impact: "Alto",
    },
  ];

  const catalogTasks = [
    {
      id: "catalog_standard",
      title: "Defina padrão de cadastro mínimo obrigatório",
      description: "Todo novo item DEVE ter: código único, descrição padronizada, unidade de medida, fornecedor principal, NCM/NBS, e classificação tributária correta.",
      impact: "Crítico",
    },
    {
      id: "catalog_cleanup",
      title: "Auditoria do catálogo existente",
      description: "Revise os Top 50 itens mais vendidos. Procure por duplicatas, descrições inconsistentes e erros de NCM/NBS.",
      impact: "Alto",
    },
    {
      id: "catalog_training",
      title: "Treine a equipe responsável",
      description: "Quem insere dados no catálogo precisa entender a importância da padronização para o novo regime.",
      impact: "Médio",
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight">
            Gestão de Cadastros e Sistemas
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            O coração da operação. Sistemas e dados devem estar 100% prontos para 2026.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <Alert className="border-2 border-primary bg-primary/5">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-bold">A Janela de Tempo é Apertada</AlertTitle>
          <AlertDescription className="text-sm mt-2">
            Seu fornecedor de ERP precisa estar preparado para testes em 2025, com suporte completo em 2026.
            Se você esperar até 2026 para começar, será tarde.
          </AlertDescription>
        </Alert>

        {/* Seção: Adequação de Sistemas */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2 mb-2">
              <Settings className="h-6 w-6 text-primary" />
              Adequação do Emissor/ERP
            </h2>
            <p className="text-muted-foreground">Tarefas com seu fornecedor de sistema</p>
          </div>

          <div className="grid gap-4">
            {systemTasks.map((task) => (
              <Card key={task.id} className={`transition-all ${completedTasks.includes(task.id) ? "bg-muted/30" : ""}`}>
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
                        <Badge variant={task.impact === "Crítico" ? "destructive" : task.impact === "Alto" ? "default" : "secondary"}>
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

        {/* Seção: Padrão de Cadastro */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2 mb-2">
              <Database className="h-6 w-6 text-accent" />
              Padrão de Cadastro Mínimo Obrigatório
            </h2>
            <p className="text-muted-foreground">Defina isto AGORA, para não ter surpresas em 2026</p>
          </div>

          <div className="grid gap-4">
            {catalogTasks.map((task) => (
              <Card key={task.id} className={`transition-all ${completedTasks.includes(task.id) ? "bg-muted/30" : ""}`}>
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
                        <Badge variant={task.impact === "Crítico" ? "destructive" : task.impact === "Alto" ? "default" : "secondary"}>
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

        {/* Card: Checklist Mínimo do Cadastro */}
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              O Que Todo Item DEVE Ter no Cadastro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                  <div>
                    <strong className="text-sm">Código Único</strong>
                    <p className="text-xs text-muted-foreground">Sem duplicatas no sistema</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                  <div>
                    <strong className="text-sm">Descrição Padronizada</strong>
                    <p className="text-xs text-muted-foreground">Com variações (tamanho, cor, modelo)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                  <div>
                    <strong className="text-sm">Unidade de Medida</strong>
                    <p className="text-xs text-muted-foreground">Fixa e consistente (UN, KG, LT)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                  <div>
                    <strong className="text-sm">Fornecedor Principal</strong>
                    <p className="text-xs text-muted-foreground">Referência para compras</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-3 w-3 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                  <div>
                    <strong className="text-sm">Classificação Tributária</strong>
                    <p className="text-xs text-muted-foreground">NCM, NBS, cClassTrib, cCredPres</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-6 border-t">
          <Link href="/supply-chain">
            <Button size="lg" className="gap-2">
              Próximo: Gestão de Fornecedores
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
