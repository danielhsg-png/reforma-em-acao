import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PlanStepper from "@/components/PlanStepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Target, Calendar } from "lucide-react";
import { Link } from "wouter";

const phases = [
  {
    phase: 1,
    title: "Fase 1: O Essencial (Proximos 7 Dias)",
    color: "destructive",
    tasks: [
      {
        id: "top30",
        title: "Listar as Top 30 Mercadorias",
        description: "Maior faturamento, giro e margem. Identifique no seu sistema agora. Verifique NCM/NBS de cada item.",
      },
      {
        id: "top20supp",
        title: "Listar os Top 20 Fornecedores",
        description: "Verifique a consistencia das notas. Classifique como A/B/C. Pergunte se estao preparados para campos IBS/CBS.",
      },
      {
        id: "system_confirm",
        title: "Confirmar Atualizacoes com Fornecedor de Sistema",
        description: "Envie email HOJE perguntando: 'Qual seu roadmap para IBS/CBS? Quando terei versao com campos da NT 2025.002 (cClassTrib, cCredPres, aliquotas por item)?'",
      },
      {
        id: "responsible",
        title: "Nomear Responsavel pela Transicao",
        description: "Quem cuidara de cadastro, emissao e conferencia IBS/CBS? Defina agora. Se nao tem equipe interna, contrate suporte do contador ou consultoria.",
      },
      {
        id: "contracts_review",
        title: "Levantar Contratos de Longo Prazo",
        description: "Liste todos os contratos com vigencia alem de 2026 (clientes e fornecedores). Verifique se tem clausula de reequilibrio tributario (LC 214/2025, art. 378).",
      },
    ],
  },
  {
    phase: 2,
    title: "Fase 2: Padronizacao (14 Dias Seguintes)",
    color: "accent",
    tasks: [
      {
        id: "catalog_standard",
        title: "Padronizar Cadastro Minimo Obrigatorio",
        description: "Implemente o padrao: codigo unico, descricao padrao, unidade de medida, NCM/NBS, cClassTrib e cCredPres quando aplicavel. Comece pelos Top 30.",
      },
      {
        id: "weekly_routine",
        title: "Colocar Rotina Semanal em Funcionamento",
        description: "Agende: 2a feira = auditoria de dados (30 min). 4a feira = conciliacao financeira por canal (1 hora). Ultimo dia util do mes = reuniao com contador.",
      },
      {
        id: "supplier_abc",
        title: "Classificar Fornecedores A/B/C",
        description: "Use a matriz: A = nota correta e consistente, B = regular (90 dias para corrigir), C = ruim (substituir imediatamente nos itens criticos).",
      },
      {
        id: "nfe_test",
        title: "Preparar Ambiente de Teste da NF-e",
        description: "Solicite ao fornecedor de sistema acesso a ambiente de homologacao com aliquotas de teste (CBS 0,9% + IBS 0,1%). Emita 10 notas de teste e valide os campos.",
      },
      {
        id: "simples_check",
        title: "Avaliar Opcao de Recolhimento Fora do DAS (se Simples)",
        description: "Se sua empresa e do Simples Nacional e vende B2B, avalie a opcao de recolher IBS/CBS fora do DAS para gerar credito integral para seus clientes (LC 214/2025).",
      },
    ],
  },
  {
    phase: 3,
    title: "Fase 3: Financas e Precificacao (30 Dias Seguintes)",
    color: "primary",
    tasks: [
      {
        id: "pricing_rules",
        title: "Criar Formula de Preco com IBS/CBS",
        description: "Defina: Custo + Margem = Preco Liquido. Preco Liquido x (1 + aliquota) = Preco Final. Comunique a equipe de vendas as novas regras.",
      },
      {
        id: "discount_limits",
        title: "Definir Limites de Desconto",
        description: "Ate 5% sem autorizacao. Acima de 5% precisa aprovacao da gerencia. Promocoes de longo prazo devem ter clausula de reajuste tributario.",
      },
      {
        id: "split_simulation",
        title: "Simular Impacto do Split Payment no Caixa",
        description: "Calcule: faturamento mensal x aliquota IBS/CBS = valor retido na fonte. Ajuste capital de giro e linhas de credito para absorver o impacto.",
      },
      {
        id: "conciliation",
        title: "Ativar Conciliacao Financeira por Canal",
        description: "Faca o primeiro fechamento: Vendido x Recebido x Devolvido x Taxas x Split Payment = Saldo real. Identifique onde esta o vazamento.",
      },
      {
        id: "priority1",
        title: "Definir Prioridade #1 dos Proximos 3 Meses",
        description: "O que DEVE ser corrigido antes de 01/01/2026? O maior risco e a maior oportunidade. Concentre energia aqui.",
      },
    ],
  },
];

export default function ImplementationRoadmap() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalTasks = phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const getColorStyles = (color: string) => {
    switch (color) {
      case "destructive":
        return "border-destructive/20 bg-destructive/5";
      case "accent":
        return "border-accent/20 bg-accent/5";
      case "primary":
        return "border-primary/20 bg-primary/5";
      default:
        return "";
    }
  };

  return (
    <MainLayout>
      <PlanStepper currentStep={7} />
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight" data-testid="text-roadmap-title">
            Cronograma de Implementacao
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Um roadmap pratico de 51 dias para colocar sua operacao em ordem antes de 2026.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Progresso Geral</h3>
              <span className="text-sm font-mono">{completedTasks.length} / {totalTasks} tarefas ({completionPercent}%)</span>
            </div>
            <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 ease-in-out rounded-full" 
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {phases.map((phaseData) => (
          <section key={phaseData.phase}>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl font-bold font-heading text-primary">{phaseData.phase}</div>
              <div>
                <h2 className="text-2xl font-bold font-heading">{phaseData.title}</h2>
              </div>
            </div>

            <div className={`p-6 rounded-lg border-2 ${getColorStyles(phaseData.color)} space-y-4`}>
              {phaseData.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg transition-all ${
                    completedTasks.includes(task.id) ? "bg-background/50 opacity-60" : "bg-background"
                  }`}
                  data-testid={`roadmap-task-${task.id}`}
                >
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id={task.id}
                      checked={completedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                      data-testid={`checkbox-roadmap-${task.id}`}
                    />
                    <div className="flex-1">
                      <Label htmlFor={task.id} className={`text-base font-bold cursor-pointer block ${completedTasks.includes(task.id) ? "line-through" : ""}`}>
                        {task.title}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Marcos Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg bg-background">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Dia 7</p>
                <Badge variant="destructive">Urgente</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Voce sabe quem sao seus Top 30 produtos e Top 20 fornecedores. Ja falou com o fornecedor de sistema. Ja nomeou o responsavel.
              </p>
            </div>
            <div className="p-3 border rounded-lg bg-background">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Dia 21</p>
                <Badge variant="secondary">Importante</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Padrao de cadastro ativo (cClassTrib preenchido). Rotina semanal e uma realidade. Fornecedores classificados A/B/C. Ambiente de teste da NF-e funcionando.
              </p>
            </div>
            <div className="p-3 border rounded-lg bg-background">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Dia 51</p>
                <Badge>Meta</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Formula de preco com IBS/CBS definida. Split Payment simulado. Primeira conciliacao feita. Prioridade #1 clara. Empresa pronta para 2026.
              </p>
            </div>
          </CardContent>
        </Card>

        <Alert className="bg-muted border-2">
          <Calendar className="h-5 w-5 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Lembre-se:</strong> O novo sistema de IBS/CBS entra em vigor em 01/01/2026 com aliquotas de teste (CBS 0,9% + IBS 0,1%). Todas as NF-e emitidas a partir desta data devem ter os novos campos. Nao espere dezembro de 2025 para comecar.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/plano-de-acao/rotinas">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-routines">
              <ArrowLeft className="h-5 w-5" />
              Voltar: Rotinas
            </Button>
          </Link>
          <Link href="/plano-de-acao/checklist">
            <Button size="lg" className="gap-2" data-testid="button-next-checklist">
              Proximo: Checklist Final
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
