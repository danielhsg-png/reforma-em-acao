import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import { Building2, ArrowLeft, User, Lock, CreditCard, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

function getInitials(name: string | null, email: string): string {
  if (name && name.trim()) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { user, logout } = useAppStore();
  const [, navigate] = useLocation();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const initials = getInitials(user?.name ?? null, user?.email ?? "");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/inicio")}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
              data-testid="button-back-home"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar ao Hub</span>
            </button>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center space-x-2">
              <div className="bg-primary/20 p-1.5 rounded-lg">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <span className="font-heading font-bold uppercase tracking-wider text-sm text-foreground">
                REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#F57C00] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-screen-md mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading uppercase tracking-tight" data-testid="text-profile-title">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie seus dados e segurança</p>
        </div>

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

        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Minha Conta</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/40 border border-border/40 p-4 space-y-1">
              <p className="text-sm font-semibold text-foreground">Plano atual: Acesso Completo</p>
              <p className="text-xs text-muted-foreground">Funcionalidades de créditos e pagamento em breve</p>
            </div>
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
      </main>
    </div>
  );
}
