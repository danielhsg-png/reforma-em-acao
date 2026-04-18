import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Mail,
  Calendar,
  Shield,
  User as UserIcon,
  ClipboardList,
  ArrowRight,
  Building2,
} from "lucide-react";

interface UserDetailResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: "user" | "super_admin";
    createdAt: string | null;
  };
  companies: Array<{
    id: string;
    companyName: string;
    cnpj: string;
    sector: string;
    regime: string;
    riskScore: number;
    createdAt: string | null;
  }>;
}

const SECTOR_LABELS: Record<string, string> = {
  varejo: "Varejo",
  servicos: "Serviços",
  industria: "Indústria",
  construcao: "Construção",
  tecnologia: "Tecnologia",
  agro: "Agropecuária",
  saude: "Saúde",
  educacao: "Educação",
};

const REGIME_LABELS: Record<string, string> = {
  simples: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  mei: "MEI",
};

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

export default function AdminUserDetail() {
  const [, params] = useRoute<{ id: string }>("/admin/usuario/:id");
  const userId = params?.id;

  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/users/${userId}`, { credentials: "include" });
        if (res.status === 403) { setError("Você não tem permissão para acessar este painel."); return; }
        if (res.status === 404) { setError("Usuário não encontrado."); return; }
        if (!res.ok) throw new Error("Falha ao carregar usuário");
        setData(await res.json());
      } catch (err: any) {
        setError(err.message || "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

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
        ) : data ? (
          <>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="h-14 w-14 shrink-0 rounded-full bg-primary/15 flex items-center justify-center">
                    <UserIcon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-[240px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold font-heading text-foreground">
                        {data.user.name || "Sem nome"}
                      </h1>
                      {data.user.role === "super_admin" && (
                        <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] gap-1">
                          <Shield className="h-3 w-3" />
                          Super Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5" />
                      {data.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Calendar className="h-3 w-3" />
                      Cadastrado em {formatDate(data.user.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Diagnósticos</p>
                    <p className="text-3xl font-bold text-primary font-heading">{data.companies.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Diagnósticos preenchidos
              </h2>
            </div>

            {data.companies.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <Building2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Este usuário ainda não gerou nenhum diagnóstico.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="text-left font-semibold px-4 py-2.5">Empresa</th>
                        <th className="text-left font-semibold px-4 py-2.5 hidden md:table-cell">Setor / Regime</th>
                        <th className="text-left font-semibold px-4 py-2.5 hidden sm:table-cell">Score</th>
                        <th className="text-left font-semibold px-4 py-2.5 hidden md:table-cell">Criado em</th>
                        <th className="text-right font-semibold px-4 py-2.5">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.companies.map((c) => (
                        <tr
                          key={c.id}
                          className="border-t border-border hover:bg-muted/30 transition-colors"
                          data-testid={`row-company-${c.id}`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground">{c.companyName || "—"}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">{formatCnpj(c.cnpj)}</div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary" className="text-[10px]">
                                {SECTOR_LABELS[c.sector] || c.sector}
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">
                                {REGIME_LABELS[c.regime] || c.regime}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-sm font-bold text-primary">{c.riskScore ?? 0}</span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                            {formatDate(c.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              href={`/admin/diagnostico/${c.id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
                              data-testid={`link-view-${c.id}`}
                            >
                              Ver relatório
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}
