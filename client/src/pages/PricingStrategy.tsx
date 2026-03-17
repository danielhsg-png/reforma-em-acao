import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, DollarSign, TrendingDown, AlertTriangle, CreditCard, Landmark, ShieldCheck, Calculator, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";

export default function PricingStrategy() {
  const { data } = useAppStore();

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight" data-testid="text-pricing-title">
            Inteligencia de Precificacao
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            A reforma muda como voce precifica. O imposto agora e calculado "por fora" (LC 214/2025, art. 12) e o Split Payment altera o fluxo de caixa.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <Alert className="border-2 border-primary bg-primary/5">
          <Calculator className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-bold">Calculo "Por Fora" - Entenda a Mudanca</AlertTitle>
          <AlertDescription className="text-sm mt-2 space-y-2">
            <p>Hoje o ICMS e calculado "por dentro" (o imposto integra a propria base). Com o IBS/CBS, o calculo e "por fora": o imposto incide sobre o preco do produto, nao sobre ele mesmo.</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="p-2 bg-background rounded border text-xs">
                <strong className="text-destructive">Antes (ICMS por dentro):</strong> Produto R$ 100 com 18% ICMS = R$ 100 ja inclui R$ 18 de imposto. Preco na etiqueta: R$ 100.
              </div>
              <div className="p-2 bg-background rounded border text-xs">
                <strong className="text-green-700">Agora (IBS/CBS por fora):</strong> Produto R$ 100 + 26,5% = R$ 126,50. O tributo e destacado separadamente na nota. Preco na etiqueta: R$ 126,50.
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Estrategia B2B vs B2C</h2>
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
                    Seus clientes corporativos <strong>precisam tomar credito</strong> de IBS/CBS. A nota correta e com cClassTrib adequado gera credito integral para o comprador. Fornecedores organizados serao preferidos.
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm font-bold text-primary">Vantagem competitiva: credito integral para o cliente.</p>
                  <p className="text-xs text-muted-foreground mt-1">Se voce gera credito de 26,5%, seu cliente efetivamente "desconta" isso do imposto dele. Argumento poderoso de vendas.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold">Tarefas para 2026:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Garantir que NF-e tem todos os campos IBS/CBS preenchidos (cClassTrib, aliquotas, valores)</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Trabalhar com preco liquido nas negociacoes: Preco Liquido + IBS/CBS = Preco Bruto</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Treinar equipe de vendas para falar sobre "transferencia de credito" como diferencial</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Se for Simples Nacional, avaliar opcao de recolher IBS/CBS fora do DAS para gerar credito integral</li>
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
                    O consumidor final nao toma credito. O preco final inclui 26,5% de IVA destacado na nota. O <strong>Split Payment retira o imposto na hora</strong> (cartao/PIX), alterando seu fluxo de caixa.
                  </p>
                </div>
                <div className="p-3 bg-accent/10 rounded border border-accent/20">
                  <p className="text-sm font-bold text-accent">Risco: fluxo de caixa e percepcao de preco.</p>
                  <p className="text-xs text-muted-foreground mt-1">Hoje voce recebe 100% e paga imposto depois. Com Split Payment, o imposto e retido na hora pelo intermediario financeiro.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold">Tarefas para 2026:</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Simular impacto do Split Payment no caixa diario (quanto menos recebera por venda)</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Revisar tabelas de preco considerando que o tributo sera visivel para o consumidor</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Adaptar preco por destino (IBS varia por estado, principio do destino)</li>
                    <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Monitorar elasticidade: consumidor pode nao aceitar preco com tributo destacado</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Impacto do Split Payment no Caixa
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-sm mb-3 text-destructive">Antes (sem Split Payment)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Venda no cartao</span>
                      <span className="font-mono">R$ 1.000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Voce recebe (- taxa adquirente ~2%)</span>
                      <span className="font-mono">R$ 980</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Imposto recolhido depois (prazo)</span>
                      <span className="font-mono text-muted-foreground">guia separada</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 border border-green-200 rounded font-bold">
                      <span>Caixa disponivel imediato</span>
                      <span className="font-mono text-green-700">R$ 980</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-3 text-primary">Depois (com Split Payment)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Venda no cartao</span>
                      <span className="font-mono">R$ 1.000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-destructive/10 border border-destructive/20 rounded">
                      <span>IBS/CBS retido na fonte (26,5%)</span>
                      <span className="font-mono text-destructive">- R$ 265</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Taxa adquirente (~2%)</span>
                      <span className="font-mono">- R$ 20</span>
                    </div>
                    <div className="flex justify-between p-2 bg-accent/10 border border-accent/20 rounded font-bold">
                      <span>Caixa disponivel imediato</span>
                      <span className="font-mono text-accent">R$ 715</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted rounded text-xs text-muted-foreground">
                <strong>Nota:</strong> Voce pode abater creditos de IBS/CBS das suas compras, reduzindo o imposto efetivo. No exemplo acima, se tiver R$ 150 de creditos, o imposto retido (R$ 265) sera compensado e voce recebera a diferenca. O mecanismo de compensacao sera operado pelo Comite Gestor do IBS.
              </div>
            </CardContent>
          </Card>
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
                  <h4 className="font-bold text-sm text-destructive mb-2">Margem Baixa (&lt; 15%)</h4>
                  <p className="text-xs text-muted-foreground">
                    {data.profitMargin === "ate_5" || data.profitMargin === "5_10" 
                      ? "SUA EMPRESA esta nesta faixa. Qualquer aumento de carga tributaria pode comprometer a viabilidade. Recalibracao de precos e prioridade URGENTE."
                      : "Produtos com margem abaixo de 15% vao sofrer com aumento de imposto. Considere aumentar margem antes da reforma."}
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-background">
                  <h4 className="font-bold text-sm text-destructive mb-2">Combos e Promocoes Travados</h4>
                  <p className="text-xs text-muted-foreground">
                    Promocoes e combos com preco fixo sem regra de reajuste vao perder dinheiro em 2026. Inclua clausula de reequilibrio tributario em todas as promocoes de longo prazo.
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-background">
                  <h4 className="font-bold text-sm text-destructive mb-2">Descontos sem Regra</h4>
                  <p className="text-xs text-muted-foreground">
                    Se cada vendedor desconta do seu jeito, a margem desaba. Defina limites rigidos: ate 5% sem autorizacao, acima precisa aprovacao.
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-background">
                  <h4 className="font-bold text-sm text-destructive mb-2">Precos Diferentes por Canal</h4>
                  <p className="text-xs text-muted-foreground">
                    Loja fisica com preco X, website Y, marketplace Z. Alem de confundir, o IBS por destino (estado do comprador) adiciona complexidade. Padronize.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {data.hasLongTermContracts === "sim" && (
          <section>
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <Landmark className="h-6 w-6 text-accent" />
              Contratos de Longo Prazo
            </h2>
            <Alert className={`border-2 ${data.priceRevisionClause === "nao" ? "border-destructive bg-destructive/5" : "border-accent bg-accent/5"}`}>
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-bold">
                {data.priceRevisionClause === "nao" 
                  ? "CRITICO: Contratos SEM clausula de revisao tributaria"
                  : "Atencao: Revise as clausulas existentes"}
              </AlertTitle>
              <AlertDescription className="text-sm mt-2 space-y-2">
                <p>
                  A LC 214/2025 (art. 378) preve que contratos celebrados antes da vigencia da CBS e do IBS poderao ser revisados para reequilibrio economico-financeiro decorrente da mudanca tributaria.
                </p>
                <p className="font-bold">
                  {data.priceRevisionClause === "nao" 
                    ? "Seus contratos NAO tem clausula de revisao. Renegocie AGORA para incluir clausula de reequilibrio tributario antes de 2026."
                    : "Verifique se as clausulas existentes cobrem especificamente a transicao IBS/CBS e o Split Payment."}
                </p>
              </AlertDescription>
            </Alert>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Acoes Praticas de Precificacao</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-primary">1</div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Criar Formula de Preco com IBS/CBS</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Defina a formula: Custo + Margem = Preco Liquido. Preco Liquido x (1 + aliquota IBS/CBS) = Preco Final.
                    </p>
                    <div className="p-2 bg-muted rounded text-xs font-mono">
                      Custo R$ 50 + Margem 30% = R$ 65 (liquido) + 26,5% = R$ 82,23 (preco final)
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
                    <h4 className="font-bold mb-1">Ajustar Tabelas por Estado de Destino</h4>
                    <p className="text-sm text-muted-foreground">
                      A aliquota do IBS varia por estado de destino (principio do destino, EC 132/2023). Se voce vende para {data.salesStates.length > 0 ? data.salesStates.length : "multiplos"} estados, cada destino pode ter aliquota diferente. Seu sistema precisa suportar isso.
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
                    <h4 className="font-bold mb-1">Limitar Descontos com Regras Claras</h4>
                    <p className="text-sm text-muted-foreground">
                      Defina: vendedor pode dar desconto maximo de 5% sem autorizacao. Acima disso, precisa aprovar com gerencia. Separe precos sensiveis (prazo longo, desconto solto, preco fixo).
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
                    <h4 className="font-bold mb-1">Simular o Split Payment no Fluxo de Caixa</h4>
                    <p className="text-sm text-muted-foreground">
                      Calcule quanto do seu faturamento sera retido na fonte pelo Split Payment. Ajuste capital de giro e linhas de credito para absorver o impacto. Utilize o Simulador Financeiro disponível na tela inicial da plataforma para projetar cenários.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {data.specialRegimes.length > 0 && (
          <Card className="border-green-200 bg-green-50/30 shadow-sm" data-testid="card-regime-pricing">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-green-600" />
                Impacto dos Regimes Especiais na Precificacao
              </CardTitle>
              <CardDescription>
                Seus regimes especiais alteram a base de calculo. Ajuste seus precos considerando a aliquota efetiva reduzida.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.specialRegimes.some((r) => ["saude_servicos", "educacao", "hotelaria_turismo", "profissional_liberal"].includes(r)) && (
                <div className="p-3 bg-background rounded-lg border text-xs space-y-1">
                  <p className="font-bold text-green-700">Servicos com aliquota reduzida:</p>
                  <p>Sua aliquota efetiva sera significativamente menor que 26,5%. Na precificacao B2C, isso significa que o preco final tera uma parcela tributaria menor, tornando-o mais competitivo. Na precificacao B2B, seus clientes tomarao credito proporcional a aliquota reduzida (nao a plena).</p>
                </div>
              )}
              {data.specialRegimes.includes("cesta_basica") && (
                <div className="p-3 bg-background rounded-lg border text-xs space-y-1">
                  <p className="font-bold text-green-700">Cesta Basica Nacional (aliquota zero):</p>
                  <p>Produtos da cesta basica terao aliquota ZERO de IBS/CBS. Isso elimina o componente tributario do preco de venda, mas voce ainda pode tomar creditos sobre insumos adquiridos com tributacao normal.</p>
                </div>
              )}
              {data.specialRegimes.some((r) => r.startsWith("seletivo_")) && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs space-y-1">
                  <p className="font-bold text-red-700">Imposto Seletivo (custo adicional):</p>
                  <p>Alem do IBS/CBS, seus produtos sofrem incidencia do Imposto Seletivo. Isso AUMENTA o custo tributario total e deve ser repassado ao preco ou absorvido na margem. Faca simulacoes no modulo financeiro para calibrar.</p>
                </div>
              )}
              {data.specialRegimes.includes("combustiveis") && (
                <div className="p-3 bg-background rounded-lg border text-xs space-y-1">
                  <p className="font-bold text-amber-700">Regime Monofasico (Combustiveis):</p>
                  <p>A tributacao ocorre em fase unica (refinaria/distribuidora). Se voce e revendedor, NAO recolhe IBS/CBS na venda, mas tambem nao toma creditos. O preco e diretamente impactado pela aliquota fixa definida pelo Comite Gestor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Link href="/plano-de-acao/fornecedores">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-supply">
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </Button>
          </Link>
          <Link href="/plano-de-acao/rotinas">
            <Button size="lg" className="gap-2" data-testid="button-next-routines">
              Proximo: Rotinas e Conciliacoes
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
