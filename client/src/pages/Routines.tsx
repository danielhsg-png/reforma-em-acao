import MainLayout from "@/components/layout/MainLayout";
import PlanStepper from "@/components/PlanStepper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Calendar, CheckCircle2, Clock, FileText, AlertTriangle, BarChart3, Search } from "lucide-react";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";

export default function Routines() {
  const { data } = useAppStore();

  return (
    <MainLayout>
      <PlanStepper currentStep={6} />
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight" data-testid="text-routines-title">
            Rotinas e Conciliacoes
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Os dados certos exigem rotinas. Com a validacao automatica da RFB (NT 2025.002), erros que antes passavam despercebidos serao detectados imediatamente.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Rotina Semanal - Amostragem Critica (30 minutos)
          </h2>
          <p className="text-muted-foreground mb-6">
            Toda segunda-feira (ou o dia que escolher), reserve 30 minutos para revisar a saude dos dados. Este habito e a diferenca entre descobrir 1 erro por semana ou 500 erros no fechamento.
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
                      Verifique se estao cadastrados corretamente: codigo unico, descricao padronizada, unidade de medida, NCM/NBS, <strong>cClassTrib</strong> e preco consistente.
                    </p>
                    <div className="p-2 bg-muted rounded text-xs text-muted-foreground">
                      <strong>Checklist rapido:</strong> Codigo OK? Descricao padrao? NCM correto? cClassTrib preenchido? Preco atualizado?
                    </div>
                    <div className="mt-2"><Badge>~10 min</Badge></div>
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
                      Procure por divergencias nas notas de fornecedores: descricao diferente do seu cadastro, NCM/NBS divergente, ausencia de campos IBS/CBS na nota recebida.
                    </p>
                    <div className="p-2 bg-muted rounded text-xs text-muted-foreground">
                      <strong>A partir de 2026:</strong> Verifique se as notas de fornecedores tem os campos IBS/CBS preenchidos. Sem eles, voce nao pode tomar credito.
                    </div>
                    <div className="mt-2"><Badge>~10 min</Badge></div>
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
                    <h4 className="font-bold mb-2">Registrar Divergencias por Fornecedor</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Se achar algo errado, corrija imediatamente NO CADASTRO, antes que o erro vire padrao. Registre qual fornecedor enviou nota com problema e atualize a classificacao A/B/C.
                    </p>
                    <div className="p-2 bg-accent/10 border border-accent/20 rounded text-xs">
                      <strong>Acao imediata:</strong> Correcao no ato. Nao deixe para "resolver depois". Um erro que se repete 100 vezes custa 100x mais para corrigir.
                    </div>
                    <div className="mt-2"><Badge>~5 min</Badge></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-destructive/20 shrink-0">
                    <span className="font-bold text-destructive">4</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">Conferencia de NF-e: Campos IBS/CBS</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Verifique se as NF-e emitidas na semana tem os campos do grupo IBS/CBS preenchidos corretamente: cClassTrib, aliquota CBS, aliquota IBS (UF e municipio), base de calculo e valores.
                    </p>
                    <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
                      <strong>Penalidade:</strong> NF-e sem campos IBS/CBS = multa automatica de 1% sobre o valor da operacao. Conferir semanalmente evita surpresas no fechamento.
                    </div>
                    <div className="mt-2"><Badge>~5 min</Badge></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-accent" />
            Conciliacao Semanal por Canal (1 hora)
          </h2>
          <p className="text-muted-foreground mb-6">
            Feche a conta matematica: <strong>Vendido x Recebido x Devolvido x Taxas = Saldo Liquido</strong>. Com o Split Payment, o valor recebido sera menor que o faturado. Confirme que a retencao esta correta.
          </p>

          <div className="space-y-4">
            {[
              { name: "Loja Fisica", detail: "Vendas em PDV, dinheiro e cartao. Verifique se o Split Payment reteve o valor correto de IBS/CBS nas vendas por cartao.", time: "~15 min" },
              { name: "Website / E-commerce", detail: "Vendas online, gateway de pagamento. O IBS e do estado do comprador (destino). Confira a aliquota aplicada por estado.", time: "~15 min" },
              { name: "Marketplace", detail: "Vendas via plataforma. O marketplace pode reter IBS/CBS antes de repassar. Verifique o relatorio de repasses e confirme os valores.", time: "~15 min" },
              { name: "Televendas / Representante", detail: "Vendas por telefone ou representantes. Boletos registrados com NF-e vinculada terao Split Payment. Confira o recebimento liquido.", time: "~15 min" },
            ].map((channel, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold mb-2">{channel.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {channel.detail}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Procure por estornos e chargebacks recorrentes. Onde esta o "vazamento"?
                      </p>
                    </div>
                    <Badge variant="secondary">{channel.time}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Rotina Mensal com Contador (1 hora)
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-bold text-sm mb-2">Pauta da Reuniao Mensal</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Quantidade de NF-e rejeitadas no mes e motivos</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Volume de creditos IBS/CBS tomados vs. debitos gerados</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Saldo de creditos acumulados (se houver)</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Novidades normativas (RFB, Comite Gestor do IBS)</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Status do Split Payment: retencoes corretas?</li>
                  </ul>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-bold text-sm mb-2">Indicadores para Acompanhar</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Taxa de rejeicao de NF-e (meta: &lt; 1%)</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> % de fornecedores com nota completa (meta: &gt; 90%)</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Margem efetiva por produto apos novo tributo</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Diferenca entre imposto retido (Split) e imposto devido</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Prazo medio de aproveitamento de creditos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Alert className="border-2 border-primary bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Por que isso e importante?</strong> Em 2026, a RFB faz validacao automatica de todas as notas com os novos campos IBS/CBS. Se voce tem o habito de revisar dados toda semana, achar erros sera facil e rapido. Se nunca revisou, sera descoberta brutal quando tiver centenas de notas com penalidade de 1%.
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
                    <p className="text-sm"><strong>2a Feira, 08:00</strong> - Rotina Semanal de Auditoria (30 min)</p>
                    <p className="text-xs text-muted-foreground">Top 20 vendidos + Top 10 comprados + Divergencias + Campos IBS/CBS</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent/20 shrink-0">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm"><strong>4a Feira, 14:00</strong> - Conciliacao Financeira por Canal (1 hora)</p>
                    <p className="text-xs text-muted-foreground">Vendido x Recebido x Devolvido x Taxas x Split Payment = Saldo real</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted shrink-0">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm"><strong>Ultimo dia util do mes</strong> - Reuniao com Contador (1 hora)</p>
                    <p className="text-xs text-muted-foreground">Balanco tributario + Creditos/Debitos + NF-e rejeitadas + Atualizacoes normativas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/plano-de-acao/precificacao">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-pricing">
              <ArrowLeft className="h-5 w-5" />
              Voltar: Precificacao
            </Button>
          </Link>
          <Link href="/plano-de-acao/cronograma">
            <Button size="lg" className="gap-2" data-testid="button-next-roadmap">
              Proximo: Cronograma de Implementacao
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
