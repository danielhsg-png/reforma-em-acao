import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Menu, LayoutDashboard, Settings, Truck, DollarSign, Calendar, Map, CheckSquare, Calculator, BookOpen, AlertTriangle, Package, Scale, MessageCircleQuestion } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const { data } = useAppStore();
  const showNav = location !== "/" && location !== "/assessment";

  const navItems = [
    { href: "/dashboard", label: "Visão Executiva", icon: LayoutDashboard },
    { href: "/dashboard-educational", label: "O Que Muda?", icon: BookOpen },
    { href: "/risk-assessment", label: "Diagnóstico de Risco", icon: AlertTriangle },
    { href: "/financial-simulation", label: "Simulador Financeiro", icon: Calculator },
    { href: "/product-analysis", label: "Análise de Produtos", icon: Package },
    ...(data.regime === "simples" ? [{ href: "/simples-simulator", label: "Simulador Simples", icon: Scale }] : []),
    { href: "/system-management", label: "Gestão de Sistemas", icon: Settings },
    { href: "/supply-chain", label: "Fornecedores", icon: Truck },
    { href: "/pricing-strategy", label: "Precificação", icon: DollarSign },
    { href: "/routines", label: "Rotinas Semanais", icon: Calendar },
    { href: "/implementation-roadmap", label: "Cronograma", icon: Map },
    { href: "/final-checklist", label: "Checklist Final", icon: CheckSquare },
    { href: "/my-concerns", label: "Minhas Dúvidas", icon: MessageCircleQuestion },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                    <SheetTitle className="font-heading uppercase tracking-wider text-sm text-primary">Navegação do Plano</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-4">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button 
                          variant={location === item.href ? "secondary" : "ghost"} 
                          className="w-full justify-start rounded-none px-6 h-12"
                        >
                          <item.icon className="mr-3 h-5 w-5 text-muted-foreground" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Link href="/" className="flex items-center space-x-2 mr-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-heading font-bold sm:inline-block uppercase tracking-wider text-sm sm:text-base">
                REFORMA<span className="text-primary">EM</span>AÇÃO
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-6 text-sm font-medium">
            <Link href="/" className="hidden sm:inline-block transition-colors hover:text-foreground/80 text-foreground/60">
              Início
            </Link>
            
            {showNav ? (
              <div className="hidden md:flex items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 font-bold">
                      <Menu className="h-4 w-4" />
                      Menu do Plano
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] p-0">
                    <SheetHeader className="p-6 text-left bg-muted/30 border-b">
                      <SheetTitle className="font-heading uppercase tracking-tight text-lg">Seu Plano de Ação</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col py-2">
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button 
                            variant={location === item.href ? "secondary" : "ghost"} 
                            className={`w-full justify-start rounded-none px-6 h-12 font-medium ${location === item.href ? "border-l-4 border-primary" : ""}`}
                          >
                            <item.icon className="mr-4 h-5 w-5 text-muted-foreground" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            ) : (
              <Link href="/assessment">
                <Button size="sm" className="hidden sm:flex">Fazer Diagnóstico</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
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
