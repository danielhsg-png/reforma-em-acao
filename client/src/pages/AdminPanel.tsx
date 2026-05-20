import { useEffect, useState } from "react";
import { Link } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Trash2,
  ExternalLink,
  Lock,
  UserPlus,
  Send,
  Eye,
  EyeOff,
  Webhook,
  Code2,
  Ban,
  AlertCircle,
  Copy,
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

interface WebhookLog {
  id: string;
  source: string;
  eventType: string | null;
  status: "processed" | "ignored" | "error" | "auth_failed" | "duplicate" | string;
  httpStatus: number;
  ip: string | null;
  authOk: boolean;
  message: string | null;
  externalId: string | null;
  customerEmail: string | null;
  headers: Record<string, any> | null;
  payload: Record<string, any> | null;
  createdAt: string;
}

const WEBHOOK_STATUS_STYLES: Record<string, { label: string; className: string; Icon: any }> = {
  processed: { label: "Processado", className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30", Icon: CheckCircle2 },
  ignored: { label: "Ignorado", className: "bg-slate-500/15 text-slate-700 border-slate-500/30", Icon: Ban },
  duplicate: { label: "Duplicado", className: "bg-blue-500/15 text-blue-700 border-blue-500/30", Icon: Copy },
  auth_failed: { label: "Auth falhou", className: "bg-amber-500/15 text-amber-700 border-amber-500/30", Icon: Lock },
  error: { label: "Erro", className: "bg-red-500/15 text-red-700 border-red-500/30", Icon: AlertCircle },
};

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

type PendingAction =
  | { kind: "toggle_role"; user: AdminUser; nextRole: AdminUser["role"] }
  | { kind: "delete"; user: AdminUser };

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"companies" | "users" | "emails" | "webhooks">("companies");
  const [userSearch, setUserSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [emailKindFilter, setEmailKindFilter] = useState<string>("all");
  const [webhookSearch, setWebhookSearch] = useState("");
  const [webhookStatusFilter, setWebhookStatusFilter] = useState<string>("all");
  const [webhookDetail, setWebhookDetail] = useState<WebhookLog | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createIsAdmin, setCreateIsAdmin] = useState(false);
  const [createSendInvite, setCreateSendInvite] = useState(true);
  const [createShowPassword, setCreateShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const [resendingUserId, setResendingUserId] = useState<string | null>(null);
  const [rowMessage, setRowMessage] = useState<{ userId: string; type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, companiesRes, logsRes, webhookRes] = await Promise.all([
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/companies", { credentials: "include" }),
        fetch("/api/admin/email-logs", { credentials: "include" }),
        fetch("/api/admin/webhook-logs", { credentials: "include" }),
      ]);
      if ([usersRes.status, companiesRes.status, logsRes.status, webhookRes.status].includes(403)) {
        setError("Você não tem permissão para acessar este painel.");
        return;
      }
      if (!usersRes.ok || !companiesRes.ok || !logsRes.ok || !webhookRes.ok) throw new Error("Falha ao carregar dados");
      setUsers(await usersRes.json());
      setCompanies(await companiesRes.json());
      setEmailLogs(await logsRes.json());
      setWebhookLogs(await webhookRes.json());
    } catch (err: any) {
      setError(err.message || "Erro ao carregar painel");
    } finally {
      setLoading(false);
    }
  };

  const openRoleConfirm = (u: AdminUser) => {
    const nextRole: AdminUser["role"] = u.role === "super_admin" ? "user" : "super_admin";
    setPending({ kind: "toggle_role", user: u, nextRole });
    setAdminPassword("");
    setDialogError(null);
  };

  const openDeleteConfirm = (u: AdminUser) => {
    setPending({ kind: "delete", user: u });
    setAdminPassword("");
    setDialogError(null);
  };

  const closePending = () => {
    if (submitting) return;
    setPending(null);
    setAdminPassword("");
    setDialogError(null);
  };

  const executePending = async () => {
    if (!pending || !adminPassword) return;
    setSubmitting(true);
    setDialogError(null);
    try {
      if (pending.kind === "toggle_role") {
        const res = await fetch(`/api/admin/users/${pending.user.id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: pending.nextRole, password: adminPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao alterar role");
        setUsers((prev) => prev.map((x) => (x.id === pending.user.id ? { ...x, role: pending.nextRole } : x)));
      } else {
        const res = await fetch(`/api/admin/users/${pending.user.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ password: adminPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao excluir usuário");
        setUsers((prev) => prev.filter((x) => x.id !== pending.user.id));
        setCompanies((prev) => prev.filter((c) => c.ownerEmail !== pending.user.email));
      }
      setPending(null);
      setAdminPassword("");
    } catch (err: any) {
      setDialogError(err.message || "Falha ao executar ação");
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateUser = () => {
    setCreateName("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateIsAdmin(false);
    setCreateSendInvite(true);
    setCreateShowPassword(false);
    setCreateError(null);
    setCreateSuccess(null);
    setCreateOpen(true);
  };

  const closeCreateUser = () => {
    if (creating) return;
    setCreateOpen(false);
    setCreateError(null);
    setCreateSuccess(null);
  };

  const submitCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    const useManualPassword = createShowPassword && createPassword.length > 0;
    if (useManualPassword && createPassword.length < 8) {
      setCreateError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (!createSendInvite && !useManualPassword) {
      setCreateError("Defina uma senha manual ou ative o envio do convite por e-mail.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: createName.trim() || undefined,
          email: createEmail.trim(),
          password: useManualPassword ? createPassword : undefined,
          role: createIsAdmin ? "super_admin" : "user",
          sendInvite: createSendInvite,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao criar usuário");
      setUsers((prev) => [
        {
          id: data.id,
          email: data.email,
          name: data.name ?? null,
          role: data.role,
          createdAt: data.createdAt ?? null,
        },
        ...prev,
      ]);
      if (createSendInvite && data.emailed) {
        setCreateSuccess(`Usuário ${data.email} criado e e-mail de boas-vindas enviado.`);
      } else if (createSendInvite && !data.emailed) {
        setCreateSuccess(`Usuário ${data.email} criado, mas o e-mail falhou: ${data.emailError ?? "erro desconhecido"}. Use o botão "Reenviar Convite" na lista.`);
      } else {
        setCreateSuccess(`Usuário ${data.email} criado com senha manual.`);
      }
      setCreateName("");
      setCreateEmail("");
      setCreatePassword("");
      setCreateIsAdmin(false);
      setCreateShowPassword(false);
    } catch (err: any) {
      setCreateError(err.message || "Falha ao criar usuário");
    } finally {
      setCreating(false);
    }
  };

  const resendInvite = async (u: AdminUser) => {
    setResendingUserId(u.id);
    setRowMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${u.id}/resend-invite`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Falha ao reenviar convite");
      setRowMessage({ userId: u.id, type: "success", text: `Convite reenviado para ${u.email}` });
    } catch (err: any) {
      setRowMessage({ userId: u.id, type: "error", text: err.message || "Falha ao reenviar convite" });
    } finally {
      setResendingUserId(null);
      setTimeout(() => setRowMessage(null), 5000);
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

  const filteredWebhookLogs = webhookLogs.filter((w) => {
    if (webhookStatusFilter !== "all" && w.status !== webhookStatusFilter) return false;
    if (!webhookSearch.trim()) return true;
    const q = webhookSearch.toLowerCase();
    return (
      (w.eventType ?? "").toLowerCase().includes(q) ||
      (w.customerEmail ?? "").toLowerCase().includes(q) ||
      (w.externalId ?? "").toLowerCase().includes(q) ||
      (w.message ?? "").toLowerCase().includes(q) ||
      (w.source ?? "").toLowerCase().includes(q)
    );
  });

  const webhookProcessed = webhookLogs.filter((w) => w.status === "processed").length;
  const webhookErrors = webhookLogs.filter((w) => w.status === "error" || w.status === "auth_failed").length;
  const webhookIgnored = webhookLogs.filter((w) => w.status === "ignored" || w.status === "duplicate").length;

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
          <Tabs value={tab} onValueChange={(v) => setTab(v as "companies" | "users" | "emails" | "webhooks")}>
            <TabsList className="grid w-full max-w-3xl grid-cols-4">
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
              <TabsTrigger value="webhooks" className="gap-2" data-testid="tab-webhooks">
                <Webhook className="h-4 w-4" />
                Webhooks ({webhookLogs.length})
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
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por e-mail, nome ou role..."
                    className="pl-9"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    data-testid="input-search-users"
                  />
                </div>
                <Button
                  onClick={openCreateUser}
                  className="gap-2 shrink-0"
                  data-testid="button-create-user"
                >
                  <UserPlus className="h-4 w-4" />
                  Adicionar Usuário
                </Button>
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
                            <td className="px-4 py-3">
                              <div className="flex flex-col items-end gap-1.5">
                                <div className="flex items-center justify-end gap-3 text-xs font-semibold flex-wrap">
                                  <Link
                                    href={`/admin/usuario/${u.id}`}
                                    className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-4"
                                    data-testid={`link-user-${u.id}`}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Ver
                                  </Link>
                                  <button
                                    onClick={() => resendInvite(u)}
                                    disabled={resendingUserId === u.id}
                                    className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors disabled:opacity-50"
                                    title="Reenviar e-mail de boas-vindas com link para criar/redefinir senha"
                                    data-testid={`button-resend-invite-${u.id}`}
                                  >
                                    {resendingUserId === u.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Send className="h-3 w-3" />
                                    )}
                                    Reenviar Convite
                                  </button>
                                  <button
                                    onClick={() => openRoleConfirm(u)}
                                    className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                                    data-testid={`button-toggle-role-${u.id}`}
                                  >
                                    <Shield className="h-3 w-3" />
                                    {u.role === "super_admin" ? "Rebaixar" : "Promover"}
                                  </button>
                                  <button
                                    onClick={() => openDeleteConfirm(u)}
                                    className="inline-flex items-center gap-1 text-destructive hover:text-destructive/80 transition-colors"
                                    data-testid={`button-delete-${u.id}`}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Excluir
                                  </button>
                                </div>
                                {rowMessage && rowMessage.userId === u.id && (
                                  <span
                                    className={`text-[11px] font-medium ${
                                      rowMessage.type === "success" ? "text-emerald-600" : "text-destructive"
                                    }`}
                                  >
                                    {rowMessage.text}
                                  </span>
                                )}
                              </div>
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

            <TabsContent value="webhooks" className="mt-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[240px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por evento, e-mail, order id ou mensagem..."
                    className="pl-9"
                    value={webhookSearch}
                    onChange={(e) => setWebhookSearch(e.target.value)}
                    data-testid="input-search-webhooks"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "all", label: "Todos" },
                    { key: "processed", label: "Processados" },
                    { key: "error", label: "Erros" },
                    { key: "auth_failed", label: "Auth" },
                    { key: "ignored", label: "Ignorados" },
                    { key: "duplicate", label: "Duplicados" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setWebhookStatusFilter(f.key)}
                      className={`px-3 h-10 rounded-md text-xs font-semibold transition-colors ${
                        webhookStatusFilter === f.key
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      data-testid={`filter-webhook-${f.key}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
                <div className="rounded-lg border border-border bg-card px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{webhookLogs.length}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">Processados</p>
                  <p className="text-xl font-bold text-emerald-600 mt-0.5">{webhookProcessed}</p>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-red-700 font-semibold">Erros / Auth</p>
                  <p className="text-xl font-bold text-red-600 mt-0.5">{webhookErrors}</p>
                </div>
                <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-700 font-semibold">Ignorados</p>
                  <p className="text-xl font-bold text-slate-600 mt-0.5">{webhookIgnored}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Endpoint Pagar.me: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">POST /api/webhook/pagarme</code>
                </p>
                <Button size="sm" variant="outline" onClick={loadAll} className="gap-1.5" data-testid="button-refresh-webhooks">
                  <Loader2 className="h-3.5 w-3.5" />
                  Atualizar
                </Button>
              </div>

              {filteredWebhookLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <Webhook className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {webhookLogs.length === 0 ? "Nenhum webhook recebido ainda." : "Nenhum resultado para o filtro."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="text-left font-semibold px-4 py-2.5">Data</th>
                          <th className="text-left font-semibold px-4 py-2.5">Origem</th>
                          <th className="text-left font-semibold px-4 py-2.5">Evento</th>
                          <th className="text-left font-semibold px-4 py-2.5">E-mail</th>
                          <th className="text-left font-semibold px-4 py-2.5 hidden xl:table-cell">Order ID</th>
                          <th className="text-left font-semibold px-4 py-2.5">Status</th>
                          <th className="text-left font-semibold px-4 py-2.5">HTTP</th>
                          <th className="text-right font-semibold px-4 py-2.5">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWebhookLogs.map((log) => {
                          const style = WEBHOOK_STATUS_STYLES[log.status] ?? WEBHOOK_STATUS_STYLES.error;
                          const StatusIcon = style.Icon;
                          return (
                            <tr key={log.id} className="border-t border-border hover:bg-muted/30 transition-colors align-top" data-testid={`row-webhook-${log.id}`}>
                              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(log.createdAt)}</td>
                              <td className="px-4 py-3 text-xs text-foreground capitalize">{log.source}</td>
                              <td className="px-4 py-3 text-xs font-mono text-foreground">{log.eventType ?? "—"}</td>
                              <td className="px-4 py-3 text-xs text-foreground break-all max-w-[200px]">{log.customerEmail ?? "—"}</td>
                              <td className="px-4 py-3 text-[11px] text-muted-foreground font-mono hidden xl:table-cell max-w-[180px] truncate" title={log.externalId ?? ""}>
                                {log.externalId ?? "—"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-col gap-0.5">
                                  <Badge className={`${style.className} text-[10px] gap-1 w-fit`}>
                                    <StatusIcon className="h-3 w-3" />
                                    {style.label}
                                  </Badge>
                                  {log.message && (
                                    <span className="text-[10px] text-muted-foreground max-w-[280px] truncate" title={log.message}>
                                      {log.message}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs font-mono text-foreground">{log.httpStatus}</td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => setWebhookDetail(log)}
                                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-xs font-medium"
                                  data-testid={`button-view-payload-${log.id}`}
                                >
                                  <Code2 className="h-3 w-3" />
                                  Ver payload
                                </button>
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

      <Dialog open={!!webhookDetail} onOpenChange={(open) => { if (!open) setWebhookDetail(null); }}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5 text-primary" />
              Webhook recebido
            </DialogTitle>
            <DialogDescription>
              {webhookDetail ? (
                <span className="font-mono text-xs">
                  {webhookDetail.source} · {webhookDetail.eventType ?? "(sem tipo)"} · {formatDate(webhookDetail.createdAt)}
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {webhookDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</p>
                  <p className="font-semibold text-foreground mt-0.5">{webhookDetail.status}</p>
                </div>
                <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">HTTP</p>
                  <p className="font-semibold text-foreground mt-0.5">{webhookDetail.httpStatus}</p>
                </div>
                <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Auth</p>
                  <p className="font-semibold text-foreground mt-0.5">{webhookDetail.authOk ? "OK" : "Falhou"}</p>
                </div>
                <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">IP</p>
                  <p className="font-mono text-[11px] text-foreground mt-0.5 truncate">{webhookDetail.ip ?? "—"}</p>
                </div>
              </div>

              {webhookDetail.message && (
                <div className="rounded-md border border-border bg-muted/20 p-3 text-xs">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Mensagem</p>
                  <p className="text-foreground">{webhookDetail.message}</p>
                </div>
              )}

              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Payload</p>
                <pre className="text-[11px] bg-slate-950 text-slate-100 rounded-md p-3 overflow-x-auto max-h-[300px]">
                  {JSON.stringify(webhookDetail.payload ?? {}, null, 2)}
                </pre>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Headers</p>
                <pre className="text-[11px] bg-slate-950 text-slate-100 rounded-md p-3 overflow-x-auto max-h-[200px]">
                  {JSON.stringify(webhookDetail.headers ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setWebhookDetail(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) closeCreateUser(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Adicionar Usuário
            </DialogTitle>
            <DialogDescription>
              Preencha nome e e-mail. Por padrão, enviaremos um convite com link para o usuário <strong>criar a própria senha</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitCreateUser} className="space-y-4">
            {createError && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{createError}</span>
              </div>
            )}
            {createSuccess && (
              <div className="flex items-start gap-2 text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="create-name">Nome (opcional)</Label>
              <Input
                id="create-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Nome Sobrenome"
                disabled={creating}
                data-testid="input-create-name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-email">E-mail</Label>
              <Input
                id="create-email"
                type="email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                placeholder="usuario@empresa.com.br"
                required
                disabled={creating}
                data-testid="input-create-email"
              />
            </div>

            <label className="flex items-start gap-2 text-sm cursor-pointer select-none rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5">
              <input
                type="checkbox"
                checked={createSendInvite}
                onChange={(e) => setCreateSendInvite(e.target.checked)}
                disabled={creating}
                className="mt-0.5 h-4 w-4 accent-primary"
                data-testid="checkbox-create-send-invite"
              />
              <span className="flex-1">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  Enviar convite por e-mail
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 block">
                  O usuário recebe um link único (válido por 24h) para criar a própria senha e acessar o sistema. Recomendado.
                </span>
              </span>
            </label>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setCreateShowPassword((v) => !v)}
                disabled={creating}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-toggle-manual-password"
              >
                {createShowPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {createShowPassword ? "Ocultar campo de senha manual" : "Definir senha manualmente (avançado)"}
              </button>

              {createShowPassword && (
                <div className="space-y-1.5 pt-1">
                  <Label htmlFor="create-password" className="text-xs">
                    Senha manual <span className="text-muted-foreground font-normal">(opcional — substitui o convite por e-mail)</span>
                  </Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    disabled={creating}
                    data-testid="input-create-password"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Use apenas em casos excepcionais. Você precisará repassar a senha ao usuário por outro canal.
                  </p>
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={createIsAdmin}
                onChange={(e) => setCreateIsAdmin(e.target.checked)}
                disabled={creating}
                className="h-4 w-4 accent-primary"
                data-testid="checkbox-create-super-admin"
              />
              <Shield className="h-4 w-4 text-primary" />
              Conceder acesso de <strong>Super Admin</strong>
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeCreateUser}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="gap-2"
                data-testid="button-submit-create-user"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Criar Usuário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pending} onOpenChange={(open) => { if (!open) closePending(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pending?.kind === "delete" ? (
                <>
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Excluir usuário
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 text-primary" />
                  {pending?.kind === "toggle_role" && pending.nextRole === "super_admin"
                    ? "Promover a Super Admin"
                    : "Rebaixar para Usuário comum"}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="pt-1">
              {pending?.kind === "delete" ? (
                <>
                  Você está prestes a excluir <strong>{pending.user.email}</strong> e todos os diagnósticos
                  preenchidos por esse usuário. Esta ação é <span className="text-destructive font-semibold">permanente</span>.
                </>
              ) : pending ? (
                <>
                  Confirmar alteração de permissão para <strong>{pending.user.email}</strong>.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              executePending();
            }}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3 w-3" />
                Sua senha de administrador
              </Label>
              <Input
                id="admin-password"
                type="password"
                autoFocus
                autoComplete="current-password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11"
                data-testid="input-admin-password"
              />
              <p className="text-[11px] text-muted-foreground">
                Exigimos sua senha toda vez que uma ação sensível é executada no painel.
              </p>
            </div>

            {dialogError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-xs text-destructive">{dialogError}</p>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closePending} disabled={submitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting || !adminPassword}
                variant={pending?.kind === "delete" ? "destructive" : "default"}
                className="gap-2"
                data-testid="button-confirm-admin"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : pending?.kind === "delete" ? (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Confirmar exclusão
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Confirmar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
