import { ReactNode } from "react";
import { Link } from "wouter";
import { Building2 } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
          <Link href="/" className="flex items-center space-x-2 mr-6">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span className="hidden font-heading font-bold sm:inline-block">
              Tributo<span className="text-primary">Fácil</span> BR
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Início
            </Link>
            <Link href="/assessment" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Diagnóstico
            </Link>
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
