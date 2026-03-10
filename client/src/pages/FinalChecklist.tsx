import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Download, TrendingUp } from "lucide-react";

interface ChecklistItem {
  id: string;
  question: string;
  status: "yes" | "no" | "validating";
}

export default function FinalChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", question: "O sistema tem plano IBS/CBS para 2026?", status: "validating" },
    { id: "2", question: "O responsável por cadastro/emissão/conferência está definido?", status: "validating" },
    { id: "3", question: "O mapeamento das Top 30 mercadorias está pronto?", status: "validating" },
    { id: "4", question: "A classificação (A/B/C) dos Top 20 fornecedores está pronta?", status: "validating" },
    { id: "5", question: "O padrão de cadastro está ativo?", status: "validating" },
    { id: "6", question: "A rotina semanal de conferência está rodando?", status: "validating" },
    { id: "7", question: "As regras de preço e desconto estão definidas?", status: "validating" },
    { id: "8", question: "A conciliação por canal está ativa?", status: "validating" },
    { id: "9", question: "A prioridade nº 1 dos próximos 14 dias está definida?", status: "validating" },
  ]);

  const updateStatus = (id: string, status: "yes" | "no" | "validating") => {
    setChecklist(checklist.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const yesCount = checklist.filter((item) => item.status === "yes").length;
  const completionPercentage = (yesCount / checklist.length) * 100;

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight">
            Checklist Final do Dono
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Validação da preparação para 2026. Responda com honestidade.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nível de Preparação</p>
                <p className="text-2xl font-bold">{yesCount} de {checklist.length} Itens Concluídos</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{Math.round(completionPercentage)}%</div>
                <p className="text-xs text-muted-foreground">Pronto para 2026</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Valide Estes 9 Indicadores Críticos</h2>
          <div className="space-y-4">
            {checklist.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <Label className="text-base font-bold cursor-pointer">{item.question}</Label>
                    </div>
                    <Select value={item.status} onValueChange={(val) => updateStatus(item.id, val as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Sim
                          </span>
                        </SelectItem>
                        <SelectItem value="no">
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            Não
                          </span>
                        </SelectItem>
                        <SelectItem value="validating">
                          <span className="flex items-center gap-2">
                            <Badge variant="secondary">Em Validação</Badge>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Resultado */}
        <div>
          {completionPercentage >= 80 ? (
            <Alert className="border-2 border-green-200 bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-lg text-green-700 font-bold">Excelente! Você Está Pronto</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                Sua empresa tem alta probabilidade de passar por 2026 sem grandes sustos operacionais. 
                Continue com as rotinas e mantenha o padrão que estabeleceu.
              </AlertDescription>
            </Alert>
          ) : completionPercentage >= 50 ? (
            <Alert className="border-2 border-accent bg-accent/5">
              <AlertTriangle className="h-5 w-5 text-accent" />
              <AlertTitle className="text-lg text-accent font-bold">Atenção: Há Tarefas Críticas Pendentes</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                Você completou mais da metade, mas há itens críticos faltando. Acele a entrega dos itens em "Não" 
                ou "Em Validação" para reduzir riscos em 2026.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-2 border-destructive bg-destructive/5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-lg text-destructive font-bold">Aviso: Preparação Insuficiente</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                Menos de 50% de prontidão. Sua empresa está em risco. RECOMENDAÇÃO: 
                Concentre a próxima semana nas Fases 1 e 2 do Cronograma de Implementação. 
                Considere contratar suporte externo (contador, consultor, fornecedor de sistema).
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Aviso Legal Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Este aplicativo fornece orientação prática de preparação operacional</strong>, 
              fundamentada em normas públicas (EC 132/23, LC 214/25, LC 227/26) e comunicados oficiais.
            </p>
            <p>
              <strong>As ações sugeridas NÃO substituem:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Validação técnica do seu contador ou auditor</li>
              <li>• Análise jurídica de contratos por advogado tributarista</li>
              <li>• Testes de integração com seu fornecedor de sistema</li>
              <li>• Consulta específica sobre seu regime tributário e setor</li>
            </ul>
            <p className="italic mt-3">
              Use este relatório como base para uma conversa com seus assessores. A implementação exige alinhamento 
              técnico-jurídico-contábil-operacional.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Baixar Relatório em PDF
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
