import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const phases = [
  {
    phase: 1,
    title: "Fase 1: O Essencial (Próximos 7 Dias)",
    color: "destructive",
    tasks: [
      {
        id: "top30",
        title: "Listar as Top 30 Mercadorias",
        description: "Maior faturamento, giro e margem. Identifique no seu sistema agora.",
      },
      {
        id: "top20supp",
        title: "Listar os Top 20 Fornecedores",
        description: "Verifique o padrão de suas notas. Há consistência?",
      },
      {
        id: "system_confirm",
        title: "Confirmar Atualizações com Fornecedor de Sistema",
        description: "Envie email hoje mesmo perguntando sobre IBS/CBS.",
      },
      {
        id: "responsible",
        title: "Nomear Responsável",
        description: "Quem cuidará de cadastro, emissão e conferência? Defina agora.",
      },
    ],
  },
  {
    phase: 2,
    title: "Fase 2: Padronização (14 Dias Seguintes)",
    color: "accent",
    tasks: [
      {
        id: "catalog_standard",
        title: "Padronizar Cadastro Mínimo Obrigatório",
        description: "Implemente o padrão que definimos na seção 'Gestão de Cadastros'.",
      },
      {
        id: "weekly_routine",
        title: "Colocar Rotina Semanal em Funcionamento",
        description: "Agende os horários e atribua às pessoas.",
      },
      {
        id: "supplier_abc",
        title: "Classificar Fornecedores A/B/C",
        description: "Use a matriz que criamos. Comece com os Top 20.",
      },
    ],
  },
  {
    phase: 3,
    title: "Fase 3: Finanças (30 Dias Seguintes)",
    color: "primary",
    tasks: [
      {
        id: "pricing_rules",
        title: "Definir Regras de Preço e Limites de Desconto",
        description: "Comunique à equipe de vendas as novas regras.",
      },
      {
        id: "conciliation",
        title: "Ativar Conciliação Financeira por Canal",
        description: "Faça o primeiro fechamento. Qual é o saldo real?",
      },
      {
        id: "priority1",
        title: "Definir Prioridade #1 dos Próximos 3 Meses",
        description: "O que DEVE ser corrigido antes de 2026? Concentrate aqui.",
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

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case "destructive":
        return "destructive";
      case "accent":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight">
            Cronograma de Implementação
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Um roadmap prático de 51 dias para colocar sua operação em ordem.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
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
                    completedTasks.includes(task.id) ? "bg-background/50" : "bg-background"
                  }`}
                >
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
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Marcos Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg bg-background">
              <p className="text-sm font-bold mb-1">Dia 7</p>
              <p className="text-xs text-muted-foreground">Você sabe quem são seus Top 30 produtos e Top 20 fornecedores.</p>
            </div>
            <div className="p-3 border rounded-lg bg-background">
              <p className="text-sm font-bold mb-1">Dia 21</p>
              <p className="text-xs text-muted-foreground">Seu padrão de cadastro está ativo. Rotina semanal é uma realidade.</p>
            </div>
            <div className="p-3 border rounded-lg bg-background">
              <p className="text-sm font-bold mb-1">Dia 51</p>
              <p className="text-xs text-muted-foreground">Preços e limites de desconto definidos. Primeira conciliação feita.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-6 border-t">
          <Link href="/final-checklist">
            <Button size="lg" className="gap-2">
              Próximo: Checklist Final
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
