import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/lib/store";
import { User, Lock, CreditCard, CheckCircle2, AlertTriangle, Loader2, Save, ShieldCheck } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

function getInitials(name: string | null, email: string): string {
  if (name && name.trim()) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { user } = useAppStore();

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
    <MainLayout>
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* Profile Header */}
        <div className="mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background text-3xl font-bold border-4 border-white/5 shadow-2xl">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-background" />
          </div>
          
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tighter uppercase italic">
              {user?.name || "Usuário"} <span className="text-primary">Integridade</span>
            </h1>
            <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Gestor de Estratégia Tributária
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-8 space-y-8">
            {/* Personal Info */}
            <Card className="glass-card border-white/5 bg-white/[0.02]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm uppercase tracking-widest font-bold">Informações Básicas</span>
                </div>
                <CardTitle className="text-lg font-bold uppercase tracking-tight">Dados da Conta</CardTitle>
                <CardDescription className="text-sm">Matenha seus dados de contato sempre atualizados.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSave} className="space-y-6">
                  {profileMsg && (
                    <Alert variant={profileMsg.type === "error" ? "destructive" : "default"}
                           className={profileMsg.type === "success" ? "border-green-500/30 bg-green-500/5" : "bg-destructive/10"}>
                      {profileMsg.type === "success"
                        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                        : <AlertTriangle className="h-4 w-4" />}
                      <AlertDescription className={profileMsg.type === "success" ? "text-green-400" : ""}>
                        {profileMsg.text}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name" className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                        Nome Completo
                      </Label>
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 bg-white/5 border-white/10 text-sm focus:border-primary/50 transition-all rounded-xl"
                        placeholder="Nome Sobrenome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email" className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                        E-mail Corporativo
                      </Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 bg-white/5 border-white/10 text-sm focus:border-primary/50 transition-all rounded-xl"
                        placeholder="email@empresa.com.br"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={profileSaving}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-background font-bold gap-2 rounded-xl h-11 px-8"
                  >
                    {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    SALVAR ALTERAÇÕES
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="glass-card border-white/5 bg-white/[0.02]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm uppercase tracking-widest font-bold">Segurança Digital</span>
                </div>
                <CardTitle className="text-lg font-bold uppercase tracking-tight">Alterar Senha</CardTitle>
                <CardDescription className="text-sm">Recomendamos a troca periódica da sua credencial de acesso.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {pwdMsg && (
                    <Alert variant={pwdMsg.type === "error" ? "destructive" : "default"}
                           className={pwdMsg.type === "success" ? "border-green-500/30 bg-green-500/5" : "bg-destructive/10"}>
                      {pwdMsg.type === "success"
                        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                        : <AlertTriangle className="h-4 w-4" />}
                      <AlertDescription className={pwdMsg.type === "success" ? "text-green-400" : ""}>
                        {pwdMsg.text}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                        Senha Atual
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="h-11 bg-white/5 border-white/10 text-sm focus:border-primary/50 transition-all rounded-xl"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                          Nova Senha
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="h-11 bg-white/5 border-white/10 text-sm focus:border-primary/50 transition-all rounded-xl"
                          placeholder="Mínimo 8 caracteres"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                          Confirmar Senha
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="h-11 bg-white/5 border-white/10 text-sm focus:border-primary/50 transition-all rounded-xl"
                          placeholder="Repita a nova senha"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={pwdSaving}
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10 font-bold gap-2 rounded-xl h-11 px-8"
                  >
                    {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    ATUALIZAR ACESSO
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-card border-white/5 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm uppercase tracking-widest font-bold">Status da Licença</span>
                </div>
                <CardTitle className="text-base font-bold uppercase tracking-tight">Plano Executivo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-sm font-bold text-foreground mb-1 italic">ACESSO COMPLETO</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
                    Válido até Dezembro 2026
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm uppercase tracking-wider font-bold text-muted-foreground">
                    <span>Uso de Simuladores</span>
                    <span>100%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-accent italic">Novidades Breve</h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Estamos finalizando o módulo de Gestão de Documentos Fiscais via AI para a próxima atualização.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
