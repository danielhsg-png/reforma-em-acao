import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, UserCircle, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";

interface MainLayoutProps {
  children: ReactNode;
}

function getInitials(name: string | null, email: string): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAppStore();
  const [location, navigate] = useLocation();
  const initials = getInitials(user?.name ?? null, user?.email ?? "");
  const isSuperAdmin = user?.role === "super_admin";
  const isOnAdmin = location.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[hsl(218,74%,16%)]/95 backdrop-blur text-white">
        <div className="mx-auto flex h-14 w-full max-w-screen-xl items-center justify-between px-4 md:px-8">
          <Link
            href="/inicio"
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F57C00]/60 rounded-md"
            aria-label="Ir para o início"
          >
            <img
              src="/logo-png-branca.png"
              alt="Reforma em Ação"
              className="h-7 w-auto select-none"
              draggable={false}
            />
          </Link>

          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <Link
                href="/admin"
                className={`hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  isOnAdmin
                    ? "bg-[#F57C00] text-white"
                    : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/15"
                }`}
                data-testid="link-admin-panel"
              >
                <Shield className="h-3.5 w-3.5" />
                Painel Admin
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-8 w-8 rounded-full bg-[#F57C00] flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#F57C00]/50"
                  data-testid="button-avatar"
                  aria-label="Menu do usuário"
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="pb-1">
                  {user?.name && (
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  )}
                  <p
                    className={`text-xs text-muted-foreground truncate ${
                      user?.name ? "" : "font-semibold text-foreground"
                    }`}
                  >
                    {user?.email}
                  </p>
                  {isSuperAdmin && (
                    <span className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider">
                      <Shield className="h-2.5 w-2.5" />
                      Super Admin
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isSuperAdmin && (
                  <>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin")}
                      className="gap-2 cursor-pointer sm:hidden"
                      data-testid="menu-item-admin"
                    >
                      <Shield className="h-4 w-4 text-primary" />
                      Painel Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="sm:hidden" />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => navigate("/perfil")}
                  className="gap-2 cursor-pointer"
                  data-testid="menu-item-profile"
                >
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="gap-2 cursor-pointer text-muted-foreground"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/50 py-5">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-3 px-4 md:flex-row md:px-8">
          <p className="text-xs text-muted-foreground text-center md:text-left max-w-lg">
            Ferramenta de orientação e simulação. As informações não substituem consultoria tributária e
            jurídica especializada. Base normativa: EC 132/2023, LC 214/2025 e LC 227/2026.
          </p>
          <span className="text-xs text-muted-foreground font-mono shrink-0">REFORMA EM AÇÃO</span>
        </div>
      </footer>
    </div>
  );
}
