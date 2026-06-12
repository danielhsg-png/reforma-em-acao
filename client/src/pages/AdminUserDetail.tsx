import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Shield,
  User as UserIcon,
  ClipboardList,
  ArrowRight,
  Building2,
  Pencil,
  KeyRound,
  CheckCircle2,
  Save,
} from "lucide-react";

interface UserDetailResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    role: "user" | "super_admin";
    createdAt: string | null;
    termsAcceptedAt: string | null;
    termsVersion: string | null;
    marketingOptIn: boolean;
    marketingOptInAt: string | null;
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

function formatPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
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
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdNew, setPwdNew] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [pwdAdmin, setPwdAdmin] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const loadUser = async () => {
    if (!userId) return;
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
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const openEdit = () => {
    if (!data) return;
    setEditName(data.user.name ?? "");
    setEditEmail(data.user.email);
    setEditPhone(data.user.phone ?? "");
    setEditError(null);
    setEditOpen(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setEditError(null);
    setEditSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editName.trim() === "" ? null : editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim() === "" ? null : editPhone.trim(),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Erro ao atualizar dados");
      setData((prev) => prev ? {
        ...prev,
        user: {
          ...prev.user,
          name: payload.name ?? null,
          email: payload.email,
          phone: payload.phone ?? null,
        },
      } : prev);
      setEditOpen(false);
      setToast({ type: "success", text: "Dados atualizados com sucesso." });
    } catch (err: any) {
      setEditError(err.message || "Erro ao atualizar");
    } finally {
      setEditSaving(false);
    }
  };

  const openPwd = () => {
    setPwdNew("");
    setPwdConfirm("");
    setPwdAdmin("");
    setPwdError(null);
    setPwdOpen(true);
  };

  const submitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setPwdError(null);
    if (pwdNew.length < 8) {
      setPwdError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (pwdNew !== pwdConfirm) {
      setPwdError("A confirmação não corresponde à nova senha.");
      return;
    }
    if (pwdAdmin.length < 1) {
      setPwdError("Informe sua senha de administrador para confirmar.");
      return;
    }
    setPwdSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: pwdNew, adminPassword: pwdAdmin }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Erro ao redefinir senha");
      setPwdOpen(false);
      setToast({ type: "success", text: `Nova senha definida para ${payload.email}.` });
    } catch (err: any) {
      setPwdError(err.message || "Erro ao redefinir senha");
    } finally {
      setPwdSaving(false);
    }
  };

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
            {toast && (
              <div
                className={`mb-4 rounded-md border px-4 py-3 text-sm flex items-start gap-2 ${
                  toast.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
                }`}
                data-testid="admin-user-toast"
              >
                {toast.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                )}
                <span>{toast.text}</span>
              </div>
            )}

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
                    {data.user.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3.5 w-3.5" />
                        {data.user.phone}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Calendar className="h-3 w-3" />
                      Cadastrado em {formatDate(data.user.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="flex flex-col items-end gap-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Diagnósticos</p>
                      <p className="text-3xl font-bold text-primary font-heading">{data.companies.length}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={openEdit}
                        className="gap-1.5"
                        data-testid="button-edit-user"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar dados
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={openPwd}
                        className="gap-1.5"
                        data-testid="button-set-password"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Definir nova senha
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" />
                  Consentimento LGPD
                </h2>
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">
                    {data.user.termsAcceptedAt
                      ? <>Termos aceitos em <span className="text-foreground font-medium">{formatDate(data.user.termsAcceptedAt)}</span> — versão <span className="text-foreground font-medium">{data.user.termsVersion ?? "—"}</span></>
                      : <span className="text-amber-600 dark:text-amber-400">Termos: aceite não registrado</span>
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.user.marketingOptIn
                      ? <>Marketing: <span className="text-emerald-600 dark:text-emerald-400 font-medium">autorizado</span>{data.user.marketingOptInAt ? <> em <span className="text-foreground font-medium">{formatDate(data.user.marketingOptInAt)}</span></> : null}</>
                      : <>Marketing: <span className="text-muted-foreground">não autorizado</span></>
                    }
                  </p>
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

      <Dialog open={editOpen} onOpenChange={(open) => { if (!editSaving) setEditOpen(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Editar dados do usuário
            </DialogTitle>
            <DialogDescription>
              Atualize nome, e-mail e telefone. O usuário continuará logado com a sessão atual, mas o próximo login usará o novo e-mail.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitEdit} className="space-y-4">
            {editError && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{editError}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nome Sobrenome"
                disabled={editSaving}
                data-testid="input-edit-name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="usuario@empresa.com.br"
                required
                disabled={editSaving}
                data-testid="input-edit-email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Telefone / WhatsApp</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(formatPhoneMask(e.target.value))}
                placeholder="(11) 99999-9999"
                disabled={editSaving}
                data-testid="input-edit-phone"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={editSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={editSaving} className="gap-2" data-testid="button-submit-edit">
                {editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={pwdOpen} onOpenChange={(open) => { if (!pwdSaving) setPwdOpen(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Definir nova senha
            </DialogTitle>
            <DialogDescription>
              A nova senha entra em vigor imediatamente. Repasse-a ao usuário por um canal seguro — ele poderá trocá-la depois nas configurações de perfil.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitPwd} className="space-y-4">
            {pwdError && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="pwd-new">Nova senha</Label>
              <Input
                id="pwd-new"
                type="password"
                value={pwdNew}
                onChange={(e) => setPwdNew(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                disabled={pwdSaving}
                data-testid="input-pwd-new"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd-confirm">Confirmar nova senha</Label>
              <Input
                id="pwd-confirm"
                type="password"
                value={pwdConfirm}
                onChange={(e) => setPwdConfirm(e.target.value)}
                placeholder="Repita a nova senha"
                required
                minLength={8}
                disabled={pwdSaving}
                data-testid="input-pwd-confirm"
              />
            </div>
            <div className="space-y-1.5 pt-1 border-t border-border/50">
              <Label htmlFor="pwd-admin" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Sua senha de administrador (confirmação)
              </Label>
              <Input
                id="pwd-admin"
                type="password"
                value={pwdAdmin}
                onChange={(e) => setPwdAdmin(e.target.value)}
                placeholder="Sua senha atual"
                required
                disabled={pwdSaving}
                data-testid="input-pwd-admin"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPwdOpen(false)}
                disabled={pwdSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={pwdSaving} className="gap-2" data-testid="button-submit-pwd">
                {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Salvar nova senha
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
