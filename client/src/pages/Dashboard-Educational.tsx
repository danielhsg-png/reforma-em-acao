import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Construction } from "lucide-react";

export default function DashboardEducational() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="gap-1">
              <Construction className="h-3 w-3" />
              Em Preparacao
            </Badge>
          </div>
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight" data-testid="text-oquemuda-title">
            O Que Muda
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Consulta geral sobre a Reforma Tributaria brasileira.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-16 px-4 md:px-8">
        <Card className="max-w-2xl mx-auto shadow-sm border-dashed border-2">
          <CardContent className="pt-10 pb-10 text-center space-y-6">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold font-heading" data-testid="text-oquemuda-status">
                Area em Preparacao
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed" data-testid="text-oquemuda-description">
                Esta area sera destinada a consulta geral sobre as mudancas da Reforma Tributaria, 
                com informacoes introdutorias e conteudos aplicaveis a diferentes tipos de cenario.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}