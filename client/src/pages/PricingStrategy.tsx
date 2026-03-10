import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, TrendingDown, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function PricingStrategy() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight">
            Inteligência de Precificação
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            A reforma muda como você precifica. B2B e B2C exigem estratégias diferentes.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Estratégia B2B vs B2C</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge>B2B</Badge>
                  Venda para Empresas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm mb-2">O que muda?</h4>
                  <p className="text-sm text-muted-foreground">
                    Seus clientes corporativos preferem fornecedores organizados, porque eles precisam tomar crédito. 
                    Se sua nota está correta e gera crédito integral, o cliente fica feliz.
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm font-bold text-primary">Vantagem: Pode gerar fidelização por qualidade tributária.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold">Tarefas para 2026:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Garantir que nota fiscal tem IBS/CBS preenchido corretamente.</li>
                    <li>✓ Treinar equipe de vendas para falar sobre "transferência de crédito".</li>
                    <li>✓ Estar pronto para responder dúvidas do cliente sobre tributação.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">B2C</Badge>
                  Venda para Consumidor Final
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm mb-2">O que muda?</h4>
                  <p className="text-sm text-muted-foreground">
                    O foco é o preço final e a manutenção da margem. O consumidor não vê crédito tributário. 
                    Ele vê só o preço na etiqueta.
                  </p>
                </div>
                <div className="p-3 bg-accent/10 rounded border border-accent/20">
                  <p className="text-sm font-bold text-accent">Risco: Pressão para repassar 100% do aumento ao cliente.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold">Tarefas para 2026:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Aumentar margem em insumos para absorver parte do imposto.</li>
                    <li>✓ Revisar tabelas de preço por destino (IBS muda por estado).</li>
                    <li>✓ Monitorar demanda: consumidor pode não aceitar aumento de preço.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Onde a Margem "Vaza"?</h2>
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-lg">Identifique Estes Problemas Agora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg bg-background">
                  <h4 className="font-bold text-sm text-destructive mb-2">Margem Baixa</h4>
                  <p className="text-xs text-muted-foreground">
                    Produtos com margem abaixo de 15% vão sofrer com aumento de imposto. Considere aumentar margem em 2025 antes da reforma.
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-background">
                  <h4 className="font-bold text-sm text-destructive mb-2">Combos Travados</h4>
                  <p className="text-xs text-muted-foreground">
                    Promoções e combos com preço fixo sem regra de reajuste vão perder dinheiro em 2026.
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-background">
                  <h4 className="font-bold text-sm text-destructive mb-2">Descontos sem Regra</h4>
                  <p className="text-xs text-muted-foreground">
                    Se cada vendedor desconta do seu jeito, a margem desaba. Defina limites rígidos agora.
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-background">
                  <h4 className="font-bold text-sm text-destructive mb-2">Preços Diferentes por Canal</h4>
                  <p className="text-xs text-muted-foreground">
                    Loja física com preço X, website com preço Y, marketplace com preço Z. Unificar é urgente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Ações Práticas de Precificação</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-primary">1</div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Criar Regras de Preço</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Defina a fórmula: Custo + Margem + IBS/CBS (com a alíquota estimada para 2026).
                    </p>
                    <div className="p-2 bg-muted rounded text-xs font-mono">
                      Exemplo: Custo R$ 50 + Margem 30% + IBS 15% = Preço R$ 91,75
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-primary">2</div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Ajustar Tabelas por Destino</h4>
                    <p className="text-sm text-muted-foreground">
                      A alíquota do IBS varia por estado. São Paulo pode ter 15%, Minas Gerais 18%. Ajuste preços conforme o destino.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Limitar Descontos</h4>
                    <p className="text-sm text-muted-foreground">
                      Defina: vendedor pode dar desconto máximo de 5% sem autorização. Acima disso, precisa aprovar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-primary">4</div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Revisar Preços Sensíveis</h4>
                    <p className="text-sm text-muted-foreground">
                      Produtos com prazo longo, desconto solto ou preço fixo sem regra de reajuste. Renegocie contratos agora.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="flex justify-end pt-6 border-t">
          <Link href="/routines">
            <Button size="lg" className="gap-2">
              Próximo: Rotinas e Conciliações
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
