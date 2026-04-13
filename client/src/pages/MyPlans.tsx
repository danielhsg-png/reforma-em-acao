import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useLocation } from "wouter";
import { Building2, Plus, FileText, ArrowRight, Calendar, ClipboardList, Loader2, Search } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";

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
  servicos: "Outros / Não listado",
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
  const { loadCompany, resetData } = useAppStore();
  const [, navigate] = useLocation();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      // Silently handle error
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

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
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

  const filteredCompanies = companies.filter(c => 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cnpj.includes(searchTerm)
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto animate-fade-in-up">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary mb-1">
              <ClipboardList className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Gestão Estratégica</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase italic">
              Meus <span className="text-primary">Planos</span> de Ação
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              Central de inteligência para acompanhamento de diagnósticos e planos de adaptação tributária.
            </p>
          </div>

          <Button 
            size="lg" 
            onClick={handleNewPlan} 
            className="bg-primary hover:bg-primary/90 text-background font-bold gap-2 shadow-lg shadow-primary/20 rounded-xl px-8 h-14"
            data-testid="button-new-plan"
          >
            <Plus className="h-5 w-5" />
            GERAR NOVO DIAGNÓSTICO
          </Button>
        </div>

        {/* Stats & Filter Bar */}
        <div className="glass-card p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-6 px-4">
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-muted-foreground font-bold">Total de Planos</span>
              <span className="text-xl font-bold font-mono">{companies.length}</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-muted-foreground font-bold">Última Atividade</span>
              <span className="text-sm font-medium">
                {companies.length > 0 ? formatDate(companies[0].createdAt) : "—"}
              </span>
            </div>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Buscar por empresa ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white/5 border-white/10 text-sm focus:border-primary/50 transition-all rounded-xl"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm uppercase tracking-widest font-bold text-muted-foreground">Sincronizando Base de Dados...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <Card className="glass-card border-dashed border-white/10 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-primary/5 p-6 rounded-full mb-6">
                <FileText className="h-12 w-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Nenhum plano identificado</h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-8">
                {searchTerm 
                  ? `Não encontramos resultados para "${searchTerm}". Tente outro termo.` 
                  : "Comece agora a proteger sua empresa da transição tributária gerando seu primeiro diagnóstico."}
              </p>
              {!searchTerm && (
                <Button onClick={handleNewPlan} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 gap-2 h-11 px-6 rounded-xl font-bold">
                  <Plus className="h-4 w-4" />
                  GERAR MEU PRIMEIRO PLANO
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="glass-card group hover:scale-[1.02] cursor-pointer relative overflow-hidden flex flex-col h-full bg-white/[0.03]"
                onClick={() => handleOpenPlan(company.id)}
                data-testid={`card-company-${company.id}`}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="bg-white/5 p-2 rounded-lg mb-3">
                      <Building2 className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                  <CardTitle className="text-lg font-bold tracking-tight line-clamp-2 uppercase" data-testid={`text-company-name-${company.id}`}>
                    {company.companyName}
                  </CardTitle>
                  <CardDescription className="text-sm font-mono uppercase tracking-widest text-muted-foreground pt-1" data-testid={`text-company-cnpj-${company.id}`}>
                    CNPJ: {formatCnpj(company.cnpj)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-end pt-0">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-sm uppercase tracking-wider font-bold border-white/10 text-muted-foreground">
                      {SECTOR_LABELS[company.sector] || company.sector}
                    </Badge>
                    <Badge variant="outline" className="border-primary/20 text-primary/70 text-sm uppercase tracking-wider font-bold bg-primary/5">
                      {REGIME_LABELS[company.regime] || company.regime}
                    </Badge>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm text-muted-foreground uppercase font-bold tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {formatDate(company.createdAt)}
                    </div>
                    <span className="text-primary/0 group-hover:text-primary transition-colors">Abrir Relatório</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
