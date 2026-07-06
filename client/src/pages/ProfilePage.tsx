import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "@/lib/store";
import { User, Lock, CreditCard, CheckCircle2, AlertTriangle, Loader2, Paintbrush } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function ProfilePage() {
  const { user, logout, checkAuth } = useAppStore();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMsg, setCancelMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Personalização do PDF — logo ───────────────────────────────────────────
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoRemoving, setLogoRemoving] = useState(false);
  const [logoMsg, setLogoMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Personalização do PDF — campos de texto ─────────────────────────────────
  const [brandName, setBrandName] = useState(user?.brandName ?? "");
  const [brandPhone, setBrandPhone] = useState(user?.brandPhone ?? "");
  const [brandEmail, setBrandEmail] = useState(user?.brandEmail ?? "");
  const [brandWebsite, setBrandWebsite] = useState(user?.brandWebsite ?? "");
  const [brandRegistration, setBrandRegistration] = useState(user?.brandRegistration ?? "");
  const [brandSaving, setBrandSaving] = useState(false);
  const [brandMsg, setBrandMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao salvar");
      setProfileMsg({ type: "success", text: "Dados atualizados com sucesso!" });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "As senhas não coincidem" });
      return;
    }
    if (newPassword.length < 8) {
      setPwdMsg({ type: "error", text: "A nova senha deve ter pelo menos 8 caracteres" });
      return;
    }
    setPwdSaving(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao alterar senha");
      setPwdMsg({ type: "success", text: "Senha alterada com sucesso!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message });
    } finally {
      setPwdSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    setCancelMsg(null);
    try {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Não foi possível cancelar a assinatura.");
      setCancelMsg({ type: "success", text: data.message || "Assinatura cancelada." });
      try { await checkAuth(); } catch (e) { console.error("[ProfilePage] checkAuth após cancelamento falhou (non-fatal):", e); }
    } catch (err: any) {
      setCancelMsg({ type: "error", text: err.message || "Ocorreu um erro. Tente novamente." });
    } finally {
      setCancelLoading(false);
    }
  };

  // ── Logo: carregar no mount ──────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/user/branding/logo", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setLogoPreview(d.logo ?? null))
      .catch(() => setLogoPreview(null))
      .finally(() => setLogoLoading(false));
  }, []);

  // ── Logo: upload ─────────────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setLogoMsg({ type: "error", text: "Arquivo muito grande. Máximo 500 KB. Reduza a resolução e tente novamente." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setLogoUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch("/api/user/branding/logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ logo: dataUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao enviar logo");
        setLogoPreview(dataUrl);
        setLogoMsg({ type: "success", text: "Logo enviado com sucesso!" });
      } catch (err: any) {
        setLogoMsg({ type: "error", text: err.message });
      } finally {
        setLogoUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      setLogoMsg({ type: "error", text: "Erro ao ler o arquivo. Tente novamente." });
      setLogoUploading(false);
    };

    reader.readAsDataURL(file);
  };

  // ── Logo: remoção ─────────────────────────────────────────────────────────────
  const handleRemoveLogo = async () => {
    setLogoMsg(null);
    setLogoRemoving(true);
    try {
      const res = await fetch("/api/user/branding/logo", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao remover logo");
      setLogoPreview(null);
      setLogoMsg({ type: "success", text: "Logo removido." });
    } catch (err: any) {
      setLogoMsg({ type: "error", text: err.message });
    } finally {
      setLogoRemoving(false);
    }
  };

  // ── Branding text: salvar ─────────────────────────────────────────────────────
  const handleBrandSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandMsg(null);
    setBrandSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          brandName: brandName.trim(),
          brandPhone: brandPhone.trim(),
          brandEmail: brandEmail.trim(),
          brandWebsite: brandWebsite.trim(),
          brandRegistration: brandRegistration.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao salvar");
      await checkAuth();
      setBrandMsg({ type: "success", text: "Personalização salva com sucesso!" });
    } catch (err: any) {
      setBrandMsg({ type: "error", text: err.message });
    } finally {
      setBrandSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-screen-md mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading uppercase tracking-tight" data-testid="text-profile-title">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie seus dados e segurança</p>
        </div>

        {/* ── Card: Dados Pessoais ─────────────────────────────────────────────── */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Dados Pessoais</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              {profileMsg && (
                <Alert variant={profileMsg.type === "error" ? "destructive" : "default"}
                       className={profileMsg.type === "success" ? "border-green-500/30 bg-green-500/5" : ""}>
                  {profileMsg.type === "success"
                    ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                    : <AlertTriangle className="h-4 w-4" />}
                  <AlertDescription className={profileMsg.type === "success" ? "text-green-400" : ""}>
                    {profileMsg.text}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="profile-name" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Nome completo
                </Label>
                <Input
                  id="profile-name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 bg-card border-border/60"
                  data-testid="input-profile-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email" className="text-xs text-muted-foreground uppercase tracking-wide">
                  E-mail
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 bg-card border-border/60"
                  data-testid="input-profile-email"
                />
              </div>
              <button
                type="submit"
                disabled={profileSaving}
                data-testid="button-save-profile"
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#F57C00] hover:bg-[#E56A00] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {profileSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Salvar alterações
              </button>
            </form>
          </CardContent>
        </Card>

        {/* ── Card: Personalização do PDF ─────────────────────────────────────── */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Personalização do PDF</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">

            {user?.plan === "trial" && (
              <Alert className="border-amber-500/30 bg-amber-500/5">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-600 text-xs">
                  A personalização do PDF está disponível para assinantes. Configure agora e ative ao assinar.
                </AlertDescription>
              </Alert>
            )}

            {/* Seção logo */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Logo do escritório</p>

              {logoMsg && (
                <Alert
                  variant={logoMsg.type === "error" ? "destructive" : "default"}
                  className={logoMsg.type === "success" ? "border-green-500/30 bg-green-500/5" : ""}
                >
                  {logoMsg.type === "success"
                    ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                    : <AlertTriangle className="h-4 w-4" />}
                  <AlertDescription className={logoMsg.type === "success" ? "text-green-400" : ""}>
                    {logoMsg.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-4">
                <div className="h-16 w-40 rounded-md border border-border/60 bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
                  {logoLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo atual"
                      className="max-h-14 max-w-[152px] object-contain"
                      data-testid="img-brand-logo-preview"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem logo</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    data-testid="input-brand-logo-file"
                    onChange={handleFileSelect}
                  />
                  <button
                    type="button"
                    disabled={logoUploading || logoRemoving}
                    data-testid="button-brand-logo-upload"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-card border border-border/60 hover:border-primary/50 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {logoUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {logoUploading ? "Enviando…" : logoPreview ? "Trocar logo" : "Enviar logo"}
                  </button>

                  {logoPreview && (
                    <button
                      type="button"
                      disabled={logoRemoving || logoUploading}
                      data-testid="button-brand-logo-remove"
                      onClick={handleRemoveLogo}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-border/60 hover:border-destructive/50 hover:text-destructive text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {logoRemoving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {logoRemoving ? "Removendo…" : "Remover logo"}
                    </button>
                  )}

                  <p className="text-xs text-muted-foreground">PNG ou JPEG · máx. 500 KB</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/40" />

            {/* Seção campos de texto */}
            <form onSubmit={handleBrandSave} className="space-y-4">

              {brandMsg && (
                <Alert
                  variant={brandMsg.type === "error" ? "destructive" : "default"}
                  className={brandMsg.type === "success" ? "border-green-500/30 bg-green-500/5" : ""}
                >
                  {brandMsg.type === "success"
                    ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                    : <AlertTriangle className="h-4 w-4" />}
                  <AlertDescription className={brandMsg.type === "success" ? "text-green-400" : ""}>
                    {brandMsg.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="brand-name" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Nome do escritório ou profissional
                </Label>
                <Input
                  id="brand-name"
                  type="text"
                  placeholder="Ex: Contabilidade Silva & Associados"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="h-10 bg-card border-border/60"
                  data-testid="input-brand-name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="brand-phone" className="text-xs text-muted-foreground uppercase tracking-wide">
                    Telefone de contato
                  </Label>
                  <Input
                    id="brand-phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={brandPhone}
                    onChange={(e) => setBrandPhone(e.target.value)}
                    className="h-10 bg-card border-border/60"
                    data-testid="input-brand-phone"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand-email" className="text-xs text-muted-foreground uppercase tracking-wide">
                    E-mail de contato
                  </Label>
                  <Input
                    id="brand-email"
                    type="email"
                    placeholder="contato@escritorio.com.br"
                    value={brandEmail}
                    onChange={(e) => setBrandEmail(e.target.value)}
                    className="h-10 bg-card border-border/60"
                    data-testid="input-brand-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="brand-website" className="text-xs text-muted-foreground uppercase tracking-wide">
                    Site
                  </Label>
                  <Input
                    id="brand-website"
                    type="text"
                    placeholder="www.escritorio.com.br"
                    value={brandWebsite}
                    onChange={(e) => setBrandWebsite(e.target.value)}
                    className="h-10 bg-card border-border/60"
                    data-testid="input-brand-website"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand-registration" className="text-xs text-muted-foreground uppercase tracking-wide">
                    Registro profissional (CRC/OAB)
                  </Label>
                  <Input
                    id="brand-registration"
                    type="text"
                    placeholder="CRC 1SP999999/O-9"
                    value={brandRegistration}
                    onChange={(e) => setBrandRegistration(e.target.value)}
                    className="h-10 bg-card border-border/60"
                    data-testid="input-brand-registration"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={brandSaving}
                data-testid="button-save-brand"
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#F57C00] hover:bg-[#E56A00] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {brandSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Salvar personalização
              </button>

            </form>
          </CardContent>
        </Card>

        {/* ── Card: Segurança ──────────────────────────────────────────────────── */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Segurança</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {pwdMsg && (
                <Alert variant={pwdMsg.type === "error" ? "destructive" : "default"}
                       className={pwdMsg.type === "success" ? "border-green-500/30 bg-green-500/5" : ""}>
                  {pwdMsg.type === "success"
                    ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                    : <AlertTriangle className="h-4 w-4" />}
                  <AlertDescription className={pwdMsg.type === "success" ? "text-green-400" : ""}>
                    {pwdMsg.text}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="current-password" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Senha atual
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="h-10 bg-card border-border/60"
                  data-testid="input-current-password"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Nova senha
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-10 bg-card border-border/60"
                  data-testid="input-new-password"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Confirmar nova senha
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-10 bg-card border-border/60"
                  data-testid="input-confirm-password"
                />
              </div>
              <button
                type="submit"
                disabled={pwdSaving}
                data-testid="button-change-password"
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-card border border-border hover:border-[#F57C00] hover:text-[#F57C00] text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pwdSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Alterar senha
              </button>
            </form>
          </CardContent>
        </Card>

        {/* ── Card: Minha Conta ────────────────────────────────────────────────── */}
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Minha Conta</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cancelMsg && (
              <Alert variant={cancelMsg.type === "error" ? "destructive" : "default"}
                     className={cancelMsg.type === "success" ? "border-green-500/30 bg-green-500/5" : ""}>
                {cancelMsg.type === "success"
                  ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                  : <AlertTriangle className="h-4 w-4" />}
                <AlertDescription className={cancelMsg.type === "success" ? "text-green-400" : ""}>
                  {cancelMsg.text}
                </AlertDescription>
              </Alert>
            )}
            <div className="rounded-lg bg-muted/40 border border-border/40 p-4 space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Plano atual: {
                  user?.plan === "trial" ? "Período de teste (gratuito)"
                  : user?.plan === "monthly" ? "Plano Mensal"
                  : user?.plan === "annual" ? "Plano Anual"
                  : "—"
                }
              </p>
              {user?.plan !== "trial" && user?.subscriptionStatus && (
                <p className="text-xs text-muted-foreground">
                  Situação: {
                    user?.subscriptionStatus === "active" ? "Ativa"
                    : user?.subscriptionStatus === "canceled" ? "Cancelada"
                    : user?.subscriptionStatus === "past_due" ? "Pagamento pendente"
                    : user?.subscriptionStatus === "pending" ? "Processando"
                    : user?.subscriptionStatus === "unpaid" ? "Não paga"
                    : null
                  }
                </p>
              )}
            </div>
            {user?.subscriptionStatus === "active" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={cancelLoading}
                    data-testid="button-cancel-subscription"
                    className="flex items-center gap-2 px-5 py-2 rounded-md bg-card border border-destructive/40 text-destructive hover:bg-destructive/10 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {cancelLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {cancelLoading ? "Cancelando..." : "Cancelar assinatura"}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent data-testid="dialog-cancel-subscription">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja cancelar sua assinatura? Se você estiver dentro dos 7 dias de arrependimento (CDC Art. 49), terá direito ao estorno integral. Após esse prazo, você mantém o acesso até o fim do período já pago.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="button-cancel-dialog-back">Voltar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelSubscription}
                      disabled={cancelLoading}
                      data-testid="button-confirm-cancel-subscription"
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {cancelLoading ? "Cancelando..." : "Sim, cancelar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardContent>
        </Card>

        <div className="pt-2 pb-8">
          <button
            onClick={() => logout()}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
            data-testid="button-profile-logout"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
