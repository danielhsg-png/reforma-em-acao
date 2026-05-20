import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Building2,
  Mail,
  Calendar,
  User,
  BarChart3,
  CheckSquare,
  ClipboardList,
} from "lucide-react";

interface AdminCompanyDetailResponse {
  company: {
    id: string;
    userId: string | null;
    companyName: string;
    cnpj: string;
    sector: string;
    regime: string;
    operations: string;
    purchaseProfile: string;
    salesStates: string[];
    costStructure: string;
    riskScore: number;
    monthlyRevenue: string;
    employeeCount: string;
    profitMargin: string;
    erpSystem: string;
    nfeEmission: string;
    invoiceVolume: string;
    supplierCount: string;
    simplesSupplierPercent: string;
    hasLongTermContracts: string;
    priceRevisionClause: string;
    taxResponsible: string;
    splitPaymentAware: string;
    mainConcern: string;
    specialRegimes: string[];
    extendedData: Record<string, any> | null;
    createdAt: string | null;
  };
  checklist: Array<{ id: string; questionId: string; question: string; status: string }>;
  tasks: Array<{ id: string; week: number; taskName: string; completed: boolean }>;
  owner: { id: string; email: string; name: string | null; role: string } | null;
}

const LABELS: Record<string, string> = {
  // sector
  varejo: "Varejo",
  servicos: "Serviços",
  industria: "Indústria",
  construcao: "Construção",
  tecnologia: "Tecnologia",
  agro: "Agropecuária",
  // regime
  simples: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  mei: "MEI",
  // yes/no
  sim: "Sim",
  nao: "Não",
  nao_sei: "Não sei",
};

function label(v: string | null | undefined): string {
  if (!v) return "—";
  return LABELS[v] ?? v.replace(/_/g, " ");
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function formatCnpj(cnpj: string): string {
  const clean = (cnpj || "").replace(/\D/g, "");
  if (clean.length === 14) {
    return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12)}`;
  }
  return cnpj || "—";
}

function Row({ lbl, val }: { lbl: string; val: string | null | undefined }) {
  const v = val && String(val).trim() ? String(val) : "—";
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{lbl}</span>
      <span className="text-sm text-foreground text-right break-all">{v}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h3>
        </div>
        <div className="space-y-0">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminCompanyDetail() {
  const [, params] = useRoute<{ id: string }>("/admin/diagnostico/:id");
  const companyId = params?.id;

  const [data, setData] = useState<AdminCompanyDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/companies/${companyId}`, { credentials: "include" });
        if (res.status === 403) {
          setError("Você não tem permissão para acessar este painel.");
          return;
        }
        if (res.status === 404) {
          setError("Diagnóstico não encontrado.");
          return;
        }
        if (!res.ok) throw new Error("Falha ao carregar diagnóstico");
        setData(await res.json());
      } catch (err: any) {
        setError(err.message || "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const ext = data?.company.extendedData ?? {};
  const c = data?.company;

  return (
    <MainLayout>
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8 py-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
          data-testid="link-back-admin"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar ao Painel Admin
        </Link>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertTriangle className="h-10 w-10 mx-auto text-destructive mb-3" />
            <p className="text-sm font-semibold text-foreground">{error}</p>
          </div>
        ) : c ? (
          <>
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight text-foreground">
                    {c.companyName || "—"}
                  </h1>
                  <p className="text-sm text-muted-foreground font-mono mt-1">CNPJ: {formatCnpj(c.cnpj)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{label(c.sector)}</Badge>
                    <Badge variant="outline" className="text-[10px]">{label(c.regime)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    Criado em {formatDate(c.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* Score + Dono */}
              <Card className="md:col-span-2 lg:col-span-1">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Score de Risco</h3>
                  </div>
                  <div className="text-5xl font-bold font-heading text-primary mb-2">{c.riskScore ?? 0}</div>
                  <p className="text-xs text-muted-foreground mb-5">Calculado no momento do diagnóstico.</p>

                  <div className="pt-4 border-t border-border/40">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Dono do diagnóstico</p>
                    {data?.owner ? (
                      <>
                        {data.owner.name && (
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            {data.owner.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3 w-3" />
                          {data.owner.email}
                        </p>
                        {data.owner.role === "super_admin" && (
                          <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] mt-2">Super Admin</Badge>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">— sem dono associado —</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Section title="Identificação" icon={Building2}>
                <Row lbl="Nome fantasia" val={ext.nomeFantasia} />
                <Row lbl="CNAE" val={ext.cnaeCode} />
                <Row lbl="Estado" val={ext.estado} />
                <Row lbl="Município" val={ext.municipio} />
              </Section>

              <Section title="Contato" icon={Mail}>
                <Row lbl="Responsável" val={ext.contactName} />
                <Row lbl="Cargo" val={ext.contactRole} />
                <Row lbl="E-mail" val={ext.contactEmail} />
                <Row lbl="Telefone" val={ext.contactPhone} />
              </Section>

              <Section title="Perfil do Negócio" icon={Building2}>
                <Row lbl="Setor" val={label(c.sector)} />
                <Row lbl="Regime" val={label(c.regime)} />
                <Row lbl="Operações" val={c.operations} />
                <Row lbl="Tipo de negócio" val={ext.businessType} />
                <Row lbl="Escopo geográfico" val={ext.geographicScope} />
                <Row lbl="Faturamento anual" val={ext.annualRevenue || c.monthlyRevenue} />
                <Row lbl="Nº de estabelecimentos" val={ext.establishmentCount} />
                <Row lbl="Funcionários" val={c.employeeCount} />
                <Row lbl="Margem de lucro" val={c.profitMargin} />
              </Section>

              <Section title="Comercial" icon={BarChart3}>
                <Row lbl="Estados de venda" val={(c.salesStates || []).join(", ") || "—"} />
                <Row lbl="Contratos longos" val={label(c.hasLongTermContracts)} />
                <Row lbl="Sensibilidade a preço" val={ext.priceSensitivity} />
                <Row lbl="Cláusula revisão preço" val={label(c.priceRevisionClause)} />
                <Row lbl="Exportações" val={label(ext.hasExports)} />
                <Row lbl="Contratos gov." val={label(ext.hasGovernmentContracts)} />
              </Section>

              <Section title="Compras / Fornecedores" icon={CheckSquare}>
                <Row lbl="Qtd. fornecedores" val={c.supplierCount} />
                <Row lbl="Perfil tributário" val={c.purchaseProfile} />
                <Row lbl="% Simples nos fornecedores" val={c.simplesSupplierPercent} />
                <Row lbl="Estrutura de custos" val={c.costStructure} />
                <Row lbl="Despesas principais" val={(ext.mainExpenses || []).join(", ") || "—"} />
                <Row lbl="Retornos frequentes" val={label(ext.hasFrequentReturns)} />
              </Section>

              <Section title="Fiscal / Sistemas" icon={ClipboardList}>
                <Row lbl="ERP" val={c.erpSystem} />
                <Row lbl="Emissão NFe" val={c.nfeEmission} />
                <Row lbl="Volume NF" val={c.invoiceVolume} />
                <Row lbl="Tipos de documento" val={(ext.fiscalDocTypes || []).join(", ") || "—"} />
                <Row lbl="Integração ERP-financeiro" val={label(ext.erpIntegratedFinance)} />
                <Row lbl="Plano reforma do ERP" val={label(ext.erpVendorReformPlan)} />
                <Row lbl="Catálogo padronizado" val={ext.catalogStandardized} />
                <Row lbl="Responsável fiscal int." val={label(ext.internalFiscalResponsible)} />
                <Row lbl="E-commerce integrado" val={label(ext.hasEcommerceIntegration)} />
              </Section>

              <Section title="Financeiro / Capital" icon={BarChart3}>
                <Row lbl="Meios de pagamento" val={(ext.paymentMethods || []).join(", ") || "—"} />
                <Row lbl="Capital de giro apertado" val={label(ext.tightWorkingCapital)} />
                <Row lbl="Facilidade reajuste" val={ext.easePriceAdjustment} />
                <Row lbl="Sabe margem por produto" val={label(ext.knowsMarginByProduct)} />
                <Row lbl="Ciência do split payment" val={label(c.splitPaymentAware)} />
              </Section>

              <Section title="Governança" icon={User}>
                <Row lbl="Responsável tributário" val={c.taxResponsible} />
                <Row lbl="Responsável ERP interno" val={ext.internalERPResponsible} />
                <Row lbl="Gestão ciente da reforma" val={ext.managementAwareOfReform} />
                <Row lbl="Preparação iniciada" val={label(ext.preparationStarted)} />
                <Row lbl="Treinamento interno" val={label(ext.hadInternalTraining)} />
                <Row lbl="Maior preocupação" val={c.mainConcern} />
                <Row lbl="Regimes especiais" val={(c.specialRegimes || []).join(", ") || "—"} />
              </Section>
            </div>

            {(data?.checklist?.length || data?.tasks?.length) ? (
              <div className="grid gap-5 md:grid-cols-2 mt-6">
                {data.checklist.length > 0 && (
                  <Card>
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-md bg-primary/10">
                          <CheckSquare className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Checklist ({data.checklist.length})
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {data.checklist.map((item) => (
                          <li key={item.id} className="flex items-start gap-2 text-sm">
                            <Badge
                              variant={item.status === "done" ? "default" : "outline"}
                              className="text-[9px] shrink-0 mt-0.5"
                            >
                              {item.status}
                            </Badge>
                            <span className="text-muted-foreground">{item.question}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {data.tasks.length > 0 && (
                  <Card>
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-md bg-primary/10">
                          <ClipboardList className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Tarefas de implementação ({data.tasks.length})
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {data.tasks.map((t) => (
                          <li key={t.id} className="flex items-start gap-2 text-sm">
                            <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">S{t.week}</Badge>
                            <span className={t.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                              {t.taskName}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}
