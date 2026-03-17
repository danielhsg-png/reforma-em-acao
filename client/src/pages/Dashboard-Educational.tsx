import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function DashboardEducational() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Em Construcao</Badge>
          </div>
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight" data-testid="text-oquemuda-title">
            O Que Muda
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Conteudo educacional sobre a Reforma Tributaria brasileira.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8">
        <Card className="max-w-2xl mx-auto shadow-sm">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading mb-2">Conteudo em Preparacao</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Esta area recebera conteudo educacional complementar sobre a Reforma Tributaria. 
                Todo o conteudo essencial para o diagnostico e planejamento da sua empresa 
                esta integrado diretamente no <strong>Plano de Acao</strong>.
              </p>
            </div>
            <Link href="/plano-de-acao">
              <Button className="gap-2" data-testid="button-goto-plano">
                Ir para o Plano de Acao
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}