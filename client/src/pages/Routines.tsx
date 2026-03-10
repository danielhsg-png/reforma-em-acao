import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Routines() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight">
            Rotinas e Conciliações
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Os dados certos exigem rotinas. Defina agora as tarefas que rodarão toda semana em 2026.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Rotina Semanal (30 minutos)</h2>
          <p className="text-muted-foreground mb-6">
            Toda segunda-feira (ou o dia que escolher), reserve 30 minutos para revisar a saúde dos dados.
          </p>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">Top 20 Itens Mais Vendidos</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Verifique se estão cadastrados corretamente: código, descrição, unidade, NCM/NBS, preço consistente.
                    </p>
                    <Badge>~10 min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">Top 10 Itens Mais Comprados</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Procure por divergências nas notas de fornecedores (descrição diferente, valor inconsistente).
                    </p>
                    <Badge>~10 min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">Registrar Divergências</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Se achar algo errado, corrija imediatamente NO CADASTRO, antes que o erro vire padrão.
                    </p>
                    <Badge>~5 min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 shrink-0">
                    <span className="font-bold text-primary">4</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">Conferência Crítica: Notas com Erro</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Verifique se teve notas rejeitadas na RFB. Se sim, entenda por que e corrija antes de emitir novamente.
                    </p>
                    <Badge>~5 min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Conciliação Semanal por Canal (1 hora)</h2>
          <p className="text-muted-foreground mb-6">
            Feche a conta matemática: Vendido × Recebido × Devolvido × Taxas = Saldo Líquido.
          </p>

          <div className="space-y-4">
            {["Loja Física", "Website/E-commerce", "Marketplace", "Televendas"].map((channel, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold mb-2">{channel}</h4>
                      <p className="text-sm text-muted-foreground">
                        Procure por estornos e chargebacks recorrentes. Onde está o "vazamento"?
                      </p>
                    </div>
                    <Badge variant="secondary">~15 min</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Alert className="border-2 border-primary bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Por que isso é importante?</strong> Em 2026, a RFB faz validação automática de todas as notas. 
            Se você tem o hábito de revisar dados todo mês, achar erros será fácil e rápido. Se nunca revisou, 
            será descoberta brutal quando tiver 500 notas erradas.
          </AlertDescription>
        </Alert>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Cronograma Sugerido</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm"><strong>2ª Feira, 08:00</strong> - Rotina Semanal de Auditoria (30 min)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent/20 shrink-0">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm"><strong>4ª Feira, 14:00</strong> - Conciliação Financeira por Canal (1 hora)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="flex justify-end pt-6 border-t">
          <Link href="/implementation-roadmap">
            <Button size="lg" className="gap-2">
              Próximo: Cronograma de Implementação
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
