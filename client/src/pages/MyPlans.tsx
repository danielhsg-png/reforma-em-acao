import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { Building2, Plus, FileText, ArrowRight, LogOut, Calendar, ClipboardList, Loader2, ChevronLeft } from "lucide-react";

interface CompanySummary {
  id: string;
  companyName: string;
  cnpj: string;
  sector: string;
  regime: string;
  createdAt: string;
}

const SECTOR_LABELS: Record<string, string> = {
  varejo: "Varejo",
  servicos: "Serviços",
  industria: "Indústria",
  construcao: "Construção Civil",
  tecnologia: "Tecnologia",
  saude: "Saúde",
  educacao: "Educação",
  alimentacao: "Alimentação",
  transporte: "Transporte",
  agro: "Agropecuária",
  financeiro: "Financeiro",
  imobiliario: "Imobiliário",
};

const REGIME_LABELS: Record<string, string> = {
  simples: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  mei: "MEI",
};

export default function MyPlans() {
  const { user, logout, loadCompany, resetData } = useAppStore();
  const [, navigate] = useLocation();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/my/companies", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlan = async (id: string) => {
    await loadCompany(id);
    navigate("/plano-de-acao");
  };

  const handleNewPlan = () => {
    resetData();
    navigate("/plano-de-acao");
  };

  const handleLogout = async () => {
    await logout();
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatCnpj = (cnpj: string) => {
    if (!cnpj || cnpj.length < 14) return cnpj || "—";
    const clean = cnpj.replace(/\D/g, "");
    if (clean.length === 14) {
      return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12)}`;
    }
    return cnpj;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <Link href="/inicio" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-heading font-bold uppercase tracking-wider text-sm sm:text-base">
                REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2" data-testid="button-logout">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background border-b">
          <div className="container max-w-screen-xl mx-auto py-8 px-4 md:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold font-heading text-foreground uppercase tracking-tight flex items-center gap-3" data-testid="text-my-plans-title">
                  <ClipboardList className="h-7 w-7 text-primary" />
                  Meus Planos de Ação
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerencie seus diagnósticos e planos de ação personalizados.
                </p>
              </div>
              <Button size="lg" onClick={handleNewPlan} className="gap-2 font-medium" data-testid="button-new-plan">
                <Plus className="h-5 w-5" />
                Gerar Novo Plano de Ação
              </Button>
            </div>
          </div>
        </div>

        <div className="container max-w-screen-xl mx-auto py-8 px-4 md:px-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : companies.length === 0 ? (
            <Card className="border-dashed max-w-lg mx-auto">
              <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
                <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-bold text-muted-foreground mb-2">Nenhum plano gerado ainda</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  Clique no botão acima para gerar seu primeiro plano de ação personalizado
                  com base nas informações do seu negócio.
                </p>
                <Button onClick={handleNewPlan} className="gap-2" data-testid="button-new-plan-empty">
                  <Plus className="h-4 w-4" />
                  Gerar Meu Primeiro Plano
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Card
                  key={company.id}
                  className="shadow-sm hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-primary/50 hover:border-l-primary"
                  onClick={() => handleOpenPlan(company.id)}
                  data-testid={`card-company-${company.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate" data-testid={`text-company-name-${company.id}`}>
                          {company.companyName}
                        </CardTitle>
                        <CardDescription className="font-mono text-xs mt-1" data-testid={`text-company-cnpj-${company.id}`}>
                          CNPJ: {formatCnpj(company.cnpj)}
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="text-[10px]">
                        {SECTOR_LABELS[company.sector] || company.sector}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {REGIME_LABELS[company.regime] || company.regime}
                      </Badge>
                    </div>
                    {company.createdAt && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Criado em {formatDate(company.createdAt)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-screen-2xl px-4 md:px-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Uma ferramenta de simulação e orientação. As informações não substituem consultoria tributária e jurídica especializada.
          </p>
        </div>
      </footer>
    </div>
  );
}
