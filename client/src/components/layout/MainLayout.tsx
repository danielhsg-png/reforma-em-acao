import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Menu, LogOut, Zap, Calendar, Target, FolderOpen, ClipboardList } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

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

  const showNav =
    location.startsWith("/plano-de-acao") &&
    location !== "/plano-de-acao/avaliacao";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[hsl(218,74%,16%)]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(218,74%,16%)]/90 text-white">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            {showNav && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <SheetHeader className="p-4 text-left border-b">
                    <SheetTitle className="font-heading uppercase tracking-wider text-sm text-primary">
                      Menu do Plano
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-4">
                    {planNavItems.map((item) => {
                      if (item.action === "pdf") return null;
                      if (item.anchor) {
                        return (
                          <SheetClose asChild key={item.anchorId}>
                            <button
                              onClick={() => scrollToAnchor(item.anchorId!)}
                              className={`w-full flex items-center gap-3 px-6 h-12 text-sm font-medium hover:bg-accent transition-colors text-left`}
                            >
                              <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                              {item.label}
                            </button>
                          </SheetClose>
                        );
                      }
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link href={item.href!}>
                            <Button
                              variant={location === item.href ? "secondary" : "ghost"}
                              className="w-full justify-start rounded-none px-6 h-12"
                            >
                              <item.icon className="mr-3 h-4 w-4 text-muted-foreground" />
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

            <Link href="/inicio" className="flex items-center space-x-2 mr-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-heading font-bold sm:inline-block uppercase tracking-wider text-sm sm:text-base">
                REFORMA<span className="text-[#F57C00]">EM</span>AÇÃO
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-6 text-sm font-medium">
            <Link href="/inicio" className="hidden sm:inline-block transition-colors hover:text-white text-white/70 gap-1 items-center">
              <Building2 className="h-4 w-4 inline mr-1" />
              Início
            </Link>

            {showNav && (
              <div className="hidden md:flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 font-bold">
                      <Menu className="h-4 w-4" />
                      Menu do Plano
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] p-0">
                    <SheetHeader className="p-6 text-left bg-muted/30 border-b">
                      <SheetTitle className="font-heading uppercase tracking-tight text-lg">
                        Diagnóstico e Plano
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col py-2">
                      {planNavItems.map((item) => {
                        if (item.action === "pdf") return null;
                        if (item.anchor) {
                          return (
                            <SheetClose asChild key={item.anchorId}>
                              <button
                                onClick={() => scrollToAnchor(item.anchorId!)}
                                className="w-full flex items-center gap-4 px-6 h-12 text-sm font-medium hover:bg-accent transition-colors text-left"
                              >
                                <item.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                                {item.label}
                              </button>
                            </SheetClose>
                          );
                        }
                        return (
                          <SheetClose asChild key={item.href}>
                            <Link href={item.href!}>
                              <Button
                                variant={location === item.href ? "secondary" : "ghost"}
                                className={`w-full justify-start rounded-none px-6 h-12 font-medium ${location === item.href ? "border-l-4 border-primary" : ""}`}
                              >
                                <item.icon className="mr-4 h-5 w-5 text-muted-foreground" />
                                {item.label}
                              </Button>
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
              size="sm"
              onClick={() => logout()}
              className="gap-1 text-white/70 hover:text-white hover:bg-white/10"
              data-testid="button-layout-logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-screen-2xl px-4 md:px-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Uma ferramenta de simulação e orientação. As informações não substituem consultoria tributária e jurídica especializada.
          </p>
        </div>
      </footer>
    </div>
  );
}
