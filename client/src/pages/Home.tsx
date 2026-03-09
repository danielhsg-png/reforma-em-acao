import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BarChart3, Clock, FileCheck, ShieldCheck, Zap } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('/src/assets/images/hero-bg.jpg')] bg-cover bg-center opacity-[0.03]"></div>
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Para Empresários, Gestores e Contadores
            </div>
            <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl text-foreground">
              O futuro da sua empresa na <span className="text-primary">Reforma Tributária</span>
            </h1>
            <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-6">
              Forneça informações básicas do seu negócio e receba um diagnóstico surpreendentemente detalhado. Descubra os impactos reais e legais em suas operações e acesse um plano de ação para o curto, médio e longo prazo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/assessment">
                <Button size="lg" className="h-12 px-8 font-medium group text-md">
                  Gerar Plano de Ação Personalizado
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-secondary/20">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">Informações seguras para todas as empresas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Seja sua empresa do Simples Nacional, Lucro Presumido ou Lucro Real, de qualquer setor da economia.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-3 bg-background p-6 rounded-xl shadow-sm border border-border/50">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Simples e Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Responda a perguntas simples sobre sua operação e deixe a complexidade da legislação conosco.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 bg-background p-6 rounded-xl shadow-sm border border-border/50">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Baseado na Lei</h3>
              <p className="text-sm text-muted-foreground">
                Análises fundamentadas nos textos oficiais aprovados (EC 132/23) e projetos de lei regulamentar.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 bg-background p-6 rounded-xl shadow-sm border border-border/50">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Linha do Tempo</h3>
              <p className="text-sm text-muted-foreground">
                Saiba exatamente o que fazer no curto (2024-25), médio (2026-27) e longo prazo (2028+).
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 bg-background p-6 rounded-xl shadow-sm border border-border/50">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Plano de Ação</h3>
              <p className="text-sm text-muted-foreground">
                Um checklist prático de pontos de atenção, recomendações e mudanças sistêmicas necessárias.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
