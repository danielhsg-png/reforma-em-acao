import { useEffect, useState } from "react";
import { Link } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users as UsersIcon,
  ClipboardList,
  Shield,
  Search,
  Loader2,
  Mail,
  Calendar,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "super_admin";
  createdAt: string | null;
}

interface AdminCompany {
  id: string;
  companyName: string;
  cnpj: string;
  sector: string;
  regime: string;
  riskScore: number;
  createdAt: string | null;
  ownerEmail: string | null;
  ownerName: string | null;
}

const SECTOR_LABELS: Record<string, string> = {
  varejo: "Varejo",
  servicos: "Serviços",
  industria: "Indústria",
  construcao: "Construção",
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

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"companies" | "users">("companies");
  const [userSearch, setUserSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [roleSaving, setRoleSaving] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, companiesRes] = await Promise.all([
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/companies", { credentials: "include" }),
      ]);
      if (usersRes.status === 403 || companiesRes.status === 403) {
        setError("Você não tem permissão para acessar este painel.");
        return;
      }
      if (!usersRes.ok || !companiesRes.ok) throw new Error("Falha ao carregar dados");
      setUsers(await usersRes.json());
      setCompanies(await companiesRes.json());
    } catch (err: any) {
      setError(err.message || "Erro ao carregar painel");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (u: AdminUser) => {
    const next: AdminUser["role"] = u.role === "super_admin" ? "user" : "super_admin";
    if (!confirm(`Alterar ${u.email} para ${next === "super_admin" ? "Super Admin" : "Usuário comum"}?`)) return;
    setRoleSaving(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao alterar role");
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: next } : x)));
    } catch (err: any) {
      alert(err.message || "Não foi possível alterar");
    } finally {
      setRoleSaving(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.name ?? "").toLowerCase().includes(q) ||
      u.role.includes(q)
    );
  });

  const filteredCompanies = companies.filter((c) => {
    if (!companySearch.trim()) return true;
    const q = companySearch.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(q) ||
      (c.cnpj ?? "").toLowerCase().includes(q) ||
      (c.ownerEmail ?? "").toLowerCase().includes(q) ||
      (c.ownerName ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <MainLayout>
      <div className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-screen-xl mx-auto py-8 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-heading uppercase tracking-tight">Painel Admin</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gestão de usuários e diagnósticos gerados na plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto px-4 md:px-8 py-6">
        {error ? (
          <div className="max-w-md mx-auto mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertTriangle className="h-10 w-10 mx-auto text-destructive mb-3" />
            <p className="text-sm font-semibold text-foreground">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={tab} onValueChange={(v) => setTab(v as "companies" | "users")}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="companies" className="gap-2" data-testid="tab-companies">
                <ClipboardList className="h-4 w-4" />
                Diagnósticos ({companies.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
                <UsersIcon className="h-4 w-4" />
                Usuários ({users.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="companies" className="mt-6 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por empresa, CNPJ ou e-mail do dono..."
                  className="pl-9"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  data-testid="input-search-companies"
                />
              </div>

              {filteredCompanies.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {companies.length === 0 ? "Nenhum diagnóstico gerado ainda." : "Nenhum resultado para a busca."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="text-left font-semibold px-4 py-2.5">Empresa</th>
                          <th className="text-left font-semibold px-4 py-2.5 hidden md:table-cell">Dono</th>
                          <th className="text-left font-semibold px-4 py-2.5 hidden lg:table-cell">Setor / Regime</th>
                          <th className="text-left font-semibold px-4 py-2.5 hidden md:table-cell">Criado em</th>
                          <th className="text-right font-semibold px-4 py-2.5">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCompanies.map((c) => (
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
                              {c.ownerEmail ? (
                                <>
                                  {c.ownerName && (
                                    <div className="text-xs text-foreground">{c.ownerName}</div>
                                  )}
                                  <div className="text-[11px] text-muted-foreground">{c.ownerEmail}</div>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary" className="text-[10px]">
                                  {SECTOR_LABELS[c.sector] || c.sector}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">
                                  {REGIME_LABELS[c.regime] || c.regime}
                                </Badge>
                              </div>
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
            </TabsContent>

            <TabsContent value="users" className="mt-6 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por e-mail, nome ou role..."
                  className="pl-9"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  data-testid="input-search-users"
                />
              </div>

              {filteredUsers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <UsersIcon className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum resultado.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="text-left font-semibold px-4 py-2.5">Usuário</th>
                          <th className="text-left font-semibold px-4 py-2.5 hidden md:table-cell">Criado em</th>
                          <th className="text-left font-semibold px-4 py-2.5">Role</th>
                          <th className="text-right font-semibold px-4 py-2.5">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr
                            key={u.id}
                            className="border-t border-border hover:bg-muted/30 transition-colors"
                            data-testid={`row-user-${u.id}`}
                          >
                            <td className="px-4 py-3">
                              {u.name && <div className="font-semibold text-foreground">{u.name}</div>}
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {u.email}
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(u.createdAt)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {u.role === "super_admin" ? (
                                <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] gap-1">
                                  <Shield className="h-3 w-3" />
                                  Super Admin
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px]">Usuário</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => toggleRole(u)}
                                disabled={roleSaving === u.id}
                                className="text-xs font-semibold text-primary hover:underline underline-offset-4 disabled:opacity-60"
                                data-testid={`button-toggle-role-${u.id}`}
                              >
                                {roleSaving === u.id
                                  ? "Salvando..."
                                  : u.role === "super_admin"
                                  ? "Rebaixar"
                                  : "Promover a admin"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
}
