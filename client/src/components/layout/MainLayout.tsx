import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Menu, LogOut, Zap, Calendar, Target, FolderOpen, ClipboardList, Shield, Home, Moon, Sun } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface MainLayoutProps {
  children: ReactNode;
}

const planNavItems = [
  {
    label: "Meus Diagnósticos",
    icon: FolderOpen,
    href: "/plano-de-acao/meus-planos",
    anchor: false,
  },
  {
    label: "Fase 1 — Ações Imediatas",
    icon: Zap,
    anchor: true,
    anchorId: "fase-1",
  },
  {
    label: "Fase 2 — Curto Prazo",
    icon: Calendar,
    anchor: true,
    anchorId: "fase-2",
  },
  {
    label: "Fase 3 — Estruturantes",
    icon: Target,
    anchor: true,
    anchorId: "fase-3",
  },
  {
    label: "Plano Completo (PDF)",
    icon: ClipboardList,
    anchor: false,
    action: "pdf",
  },
];

function scrollToAnchor(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const { logout } = useAppStore();
  const { theme, setTheme } = useTheme();

  const showNav =
    location.startsWith("/plano-de-acao") &&
    location !== "/plano-de-acao/avaliacao";

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Header Corporativo OLED */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[hsl(var(--navbar))] backdrop-blur-md">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            {showNav && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-3 md:hidden text-muted-foreground hover:text-primary transition-colors">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 bg-card border-white/5">
                  <SheetHeader className="p-6 text-left border-b border-white/5">
                    <SheetTitle className="font-heading uppercase tracking-[0.2em] text-xs text-primary font-black">
                      Navegação Estratégica
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-6 space-y-1">
                    {planNavItems.map((item) => {
                      if (item.action === "pdf") return null;
                      if (item.anchor) {
                        return (
                          <SheetClose asChild key={item.anchorId}>
                            <button
                              onClick={() => scrollToAnchor(item.anchorId!)}
                              className="w-full flex items-center gap-4 px-6 h-12 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-white/5 transition-all"
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              {item.label}
                            </button>
                          </SheetClose>
                        );
                      }
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link href={item.href!}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start rounded-none px-6 h-12 uppercase tracking-widest text-[10px] font-black",
                                location === item.href ? "text-primary bg-primary/5 border-l-2 border-primary" : "text-muted-foreground"
                              )}
                            >
                              <item.icon className="mr-4 h-4 w-4" />
                              {item.label}
                            </Button>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Link href="/inicio" className="flex items-center gap-3 group">
              <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="font-heading font-black uppercase tracking-tighter text-lg pt-0.5">
                INTEGRIDADE<span className="text-primary italic">DIGITAL</span>
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-8">
            <Link href="/inicio">
              <button className={cn(
                "hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:text-primary",
                location === "/inicio" ? "text-primary" : "text-muted-foreground"
              )}>
                <Home className="h-4 w-4" />
                Início
              </button>
            </Link>

            {showNav && (
              <div className="hidden md:flex">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-10 px-6 gap-3 font-black uppercase tracking-widest text-[10px] border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/40">
                      <Menu className="h-3.5 w-3.5" />
                      Menu do Diagnóstico
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[320px] p-0 bg-card/95 backdrop-blur-xl border-white/5">
                    <SheetHeader className="p-8 text-left border-b border-white/5">
                      <SheetTitle className="font-heading uppercase tracking-[0.3em] text-[10px] text-primary font-black">
                        Plano de Ação Personalizado
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col py-6">
                      {planNavItems.map((item) => {
                        if (item.action === "pdf") return null;
                        if (item.anchor) {
                          return (
                            <SheetClose asChild key={item.anchorId}>
                              <button
                                onClick={() => scrollToAnchor(item.anchorId!)}
                                className="w-full flex items-center gap-4 px-8 h-14 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5 transition-all text-left"
                              >
                                <item.icon className="h-4 w-4 shrink-0 text-primary/50 group-hover:text-primary" />
                                {item.label}
                              </button>
                            </SheetClose>
                          );
                        }
                        return (
                          <SheetClose asChild key={item.href}>
                            <Link href={item.href!}>
                              <button
                                className={cn(
                                  "w-full flex items-center gap-4 px-8 h-14 text-xs font-bold uppercase tracking-widest transition-all text-left",
                                  location === item.href 
                                    ? "text-primary bg-primary/5 border-l-4 border-primary" 
                                    : "text-muted-foreground hover:bg-white/5"
                                )}
                              >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {item.label}
                              </button>
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
              title="Alternar tema claro/escuro"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="h-10 px-4 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-bold uppercase tracking-[0.2em] text-[10px]"
              data-testid="button-layout-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Encerrar</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">{children}</main>

      <footer className="border-t border-white/5 bg-[hsl(var(--navbar))] py-10">
        <div className="container max-w-screen-2xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
               <Shield className="h-4 w-4 text-primary/50" />
               <span className="font-heading font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                 Integridade Digital Sistemas
               </span>
             </div>
             <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50 max-w-xl leading-relaxed">
               Este sistema é uma ferramenta de simulação e orientação estratégica. 
               As projeções não substituem consultoria tributária especializada. 
               Base Normativa: EC 132/2023 | LC 214/2025.
             </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="h-8 w-[1px] bg-white/5 hidden md:block" />
            <p className="text-[10px] font-mono tracking-widest text-primary/30 uppercase">v2026.4.13.OLED</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
