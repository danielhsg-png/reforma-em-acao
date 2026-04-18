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
  CheckCircle2,
  XCircle,
  KeyRound,
  Sparkles,
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

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  kind: "password_reset" | "welcome" | "generic" | string;
  status: "sent" | "failed" | string;
  error: string | null;
  createdAt: string;
}

const KIND_LABEL: Record<string, { label: string; icon: any; color: string }> = {
  password_reset: { label: "Reset de senha", icon: KeyRound, color: "text-amber-600" },
  welcome: { label: "Boas-vindas", icon: Sparkles, color: "text-emerald-600" },
  generic: { label: "Genérico", icon: Mail, color: "text-muted-foreground" },
};

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
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"companies" | "users" | "emails">("companies");
  const [userSearch, setUserSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [emailKindFilter, setEmailKindFilter] = useState<string>("all");
  const [roleSaving, setRoleSaving] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, companiesRes, logsRes] = await Promise.all([
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/companies", { credentials: "include" }),
        fetch("/api/admin/email-logs", { credentials: "include" }),
      ]);
      if ([usersRes.status, companiesRes.status, logsRes.status].includes(403)) {
        setError("Você não tem permissão para acessar este painel.");
        return;
      }
      if (!usersRes.ok || !companiesRes.ok || !logsRes.ok) throw new Error("Falha ao carregar dados");
      setUsers(await usersRes.json());
      setCompanies(await companiesRes.json());
      setEmailLogs(await logsRes.json());
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

  const filteredEmailLogs = emailLogs.filter((e) => {
    if (emailKindFilter !== "all" && e.kind !== emailKindFilter) return false;
    if (!emailSearch.trim()) return true;
    const q = emailSearch.toLowerCase();
    return (
      e.recipient.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      (e.error ?? "").toLowerCase().includes(q)
    );
  });

  const sentCount = emailLogs.filter((l) => l.status === "sent").length;
  const failedCount = emailLogs.filter((l) => l.status === "failed").length;

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
          <Tabs value={tab} onValueChange={(v) => setTab(v as "companies" | "users" | "emails")}>
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="companies" className="gap-2" data-testid="tab-companies">
                <ClipboardList className="h-4 w-4" />
                Diagnósticos ({companies.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
                <UsersIcon className="h-4 w-4" />
                Usuários ({users.length})
              </TabsTrigger>
              <TabsTrigger value="emails" className="gap-2" data-testid="tab-emails">
                <Mail className="h-4 w-4" />
                E-mails ({emailLogs.length})
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

            <TabsContent value="emails" className="mt-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[240px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por destinatário, assunto ou erro..."
                    className="pl-9"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    data-testid="input-search-emails"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[
                    { key: "all", label: "Todos" },
                    { key: "password_reset", label: "Reset" },
                    { key: "welcome", label: "Boas-vindas" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setEmailKindFilter(f.key)}
                      className={`px-3 h-10 rounded-md text-xs font-semibold transition-colors ${
                        emailKindFilter === f.key
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      data-testid={`filter-kind-${f.key}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-lg">
                <div className="rounded-lg border border-border bg-card px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{emailLogs.length}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">Enviados</p>
                  <p className="text-xl font-bold text-emerald-600 mt-0.5">{sentCount}</p>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-red-700 font-semibold">Falhas</p>
                  <p className="text-xl font-bold text-red-600 mt-0.5">{failedCount}</p>
                </div>
              </div>

              {filteredEmailLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <Mail className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {emailLogs.length === 0 ? "Nenhum e-mail enviado ainda." : "Nenhum resultado para o filtro."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="text-left font-semibold px-4 py-2.5">Data</th>
                          <th className="text-left font-semibold px-4 py-2.5">Tipo</th>
                          <th className="text-left font-semibold px-4 py-2.5">Destinatário</th>
                          <th className="text-left font-semibold px-4 py-2.5 hidden lg:table-cell">Assunto</th>
                          <th className="text-left font-semibold px-4 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmailLogs.map((log) => {
                          const kindInfo = KIND_LABEL[log.kind] ?? KIND_LABEL.generic;
                          const KindIcon = kindInfo.icon;
                          const isSent = log.status === "sent";
                          return (
                            <tr
                              key={log.id}
                              className="border-t border-border hover:bg-muted/30 transition-colors"
                              data-testid={`row-email-${log.id}`}
                            >
                              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(log.createdAt)}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  <KindIcon className={`h-3.5 w-3.5 ${kindInfo.color}`} />
                                  <span className="text-xs font-medium text-foreground">{kindInfo.label}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs text-foreground break-all">{log.recipient}</td>
                              <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell max-w-[320px] truncate" title={log.subject}>
                                {log.subject}
                              </td>
                              <td className="px-4 py-3">
                                {isSent ? (
                                  <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px] gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Enviado
                                  </Badge>
                                ) : (
                                  <div className="flex flex-col gap-0.5">
                                    <Badge className="bg-red-500/15 text-red-700 border-red-500/30 text-[10px] gap-1 w-fit">
                                      <XCircle className="h-3 w-3" />
                                      Falhou
                                    </Badge>
                                    {log.error && (
                                      <span className="text-[10px] text-red-600/80 max-w-[260px] truncate" title={log.error}>
                                        {log.error}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
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
