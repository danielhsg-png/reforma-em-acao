import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('/src/assets/images/hero-bg.jpg')] bg-cover bg-center opacity-[0.03]"></div>
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Atualizado com as últimas definições da Reforma
            </div>
            <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl text-foreground">
              Entenda os impactos da <span className="text-primary">Reforma Tributária</span> na sua empresa
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-6">
              Descubra em poucos minutos como as mudanças na tributação de bens e serviços vão afetar seus preços, processos, sistemas e planejamento financeiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/assessment">
                <Button size="lg" className="h-12 px-8 font-medium group">
                  Iniciar Diagnóstico Gratuito
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-start space-y-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Análise Rápida e Prática</h3>
              <p className="text-muted-foreground">
                Com informações básicas sobre seu modelo de negócio, setor e porte, geramos uma visão imediata dos principais pontos de atenção.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Dashboard Executivo</h3>
              <p className="text-muted-foreground">
                Receba um relatório visual e direto ao ponto, traduzindo termos técnicos complexos para uma linguagem de negócios focada em decisão.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Recomendações Priorizadas</h3>
              <p className="text-muted-foreground">
                Saiba exatamente por onde começar. Mapeamos os riscos e oportunidades em áreas como precificação, TI, contratos e supply chain.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
