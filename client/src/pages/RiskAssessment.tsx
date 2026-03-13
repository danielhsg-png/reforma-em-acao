import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, TrendingDown } from "lucide-react";
import { useAppStore } from "@/lib/store";

const RISK_ITEMS = [
  {
    id: "messy_catalog",
    title: "Cadastro 'Baguncado'",
    description: "Descricao ou unidade de medida errada, itens duplicados no sistema. Na reforma, cada item precisa de NCM/NBS e cClassTrib corretos para gerar credito.",
  },
  {
    id: "supplier_standards",
    title: "Notas sem Padrao de Fornecedores",
    description: "Fornecedores usam descricoes diferentes para o mesmo produto. A partir de 2026, notas sem campos IBS/CBS impedem a tomada de credito.",
  },
  {
    id: "no_pricing",
    title: "Precificacao sem Parametros",
    description: "Nao ha regra clara de precos. Com o calculo 'por fora' e o Split Payment, cada venda sem formula definida e uma perda potencial de margem.",
  },
  {
    id: "channel_inconsistency",
    title: "Loja Fisica e Internet com Cadastros/Precos Diferentes",
    description: "O mesmo produto tem codigo/preco diferente em cada canal. Com o principio do destino (IBS por estado), a complexidade aumenta exponencialmente.",
  },
  {
    id: "closing_rework",
    title: "Retrabalho no Fechamento",
    description: "Precisa mexer em notas, cadastros e relatorios todo mes com o contador. Com validacao automatica da RFB em 2026, erros resultam em penalidade de 1% automatica.",
  },
  {
    id: "no_routine",
    title: "Falta de Rotina Semanal de Conferencia",
    description: "Ninguem revisa sistematicamente a saude dos dados. Sem rotina, erros se acumulam e so aparecem no fechamento, quando ja e tarde e caro corrigir.",
  },
  {
    id: "no_erp_update",
    title: "Fornecedor de Sistema sem Plano para IBS/CBS",
    description: "Seu ERP/PDV nao tem roadmap claro para a NT 2025.002. Sem atualizacao, voce nao emitira NF-e com os novos campos obrigatorios a partir de 01/01/2026.",
  },
  {
    id: "no_contract_clause",
    title: "Contratos Longos sem Clausula de Revisao Tributaria",
    description: "Contratos de fornecimento ou venda sem previsao de reequilibrio tributario. A LC 214/2025 (art. 378) permite revisao, mas voce precisa agir.",
  },
];

export default function RiskAssessment() {
  const [, setLocation] = useLocation();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { updateData } = useAppStore();

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const riskScore = selectedItems.length;
  const isHighRisk = riskScore >= 3;

  const handleContinue = () => {
    updateData("riskScore", riskScore);
    setLocation("/system-management");
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight">
            Diagnóstico de Risco
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Responda sinceramente: quantos desses sinais existem na sua operação hoje?
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-8">
        
        <div className="grid gap-6">
          {RISK_ITEMS.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleItem(item.id)}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="h-5 w-5 rounded border-gray-300 text-primary"
                      />
                      <label htmlFor={item.id} className="text-lg font-bold text-foreground cursor-pointer">
                        {item.title}
                      </label>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2 ml-9">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pontuação e Resultado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Sua Pontuação de Risco</h3>
              <p className="text-sm text-muted-foreground">{selectedItems.length} de {RISK_ITEMS.length} itens marcados</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`text-5xl font-bold font-heading ${riskScore >= 3 ? "text-destructive" : "text-green-600"}`}>
                {riskScore}
              </div>
            </div>
          </div>

          {isHighRisk ? (
            <Alert className="border-2 border-destructive bg-destructive/5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-lg text-destructive font-bold">Estado: AGIR JÁ</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                Você marcou 3 ou mais itens de risco. Sua operação não está pronta para 2026. 
                <strong className="block mt-2">
                  As próximas fases (Gestão de Cadastros, Fornecedores, Precificação) são CRÍTICAS.
                </strong>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-2 border-green-200 bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-lg text-green-700 font-bold">Estado: Controlado</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                Sua operação tem menos de 3 pontos críticos. Ainda há tempo para se preparar adequadamente.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {isHighRisk && (
          <Card className="border-accent bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Lightbulb className="h-5 w-5" />
                Por Que Isso Importa?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Em 2026, a RFB será <strong>muito mais rigorosa</strong> com os dados de entrada (NF-e estruturada no padrão novo). 
                Se sua operação está "bagunçada" hoje, você vai ter:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span><strong>Notas devolvidas</strong> sistematicamente pela validação automática.</span>
                </li>
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span><strong>Penalidades de 1%</strong> sobre operações com dados incorretos.</span>
                </li>
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span><strong>Créditos perdidos</strong> porque a RFB não reconhecerá notas mal emitidas.</span>
                </li>
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span><strong>Retrabalho brutal</strong> e custos operacionais altos para corrigir.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" size="lg" onClick={() => setLocation("/dashboard-educational")}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>
          <Button size="lg" onClick={handleContinue}>
            Próximo: Gestão de Cadastros
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
