import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainLayout from "@/components/layout/MainLayout";
import {
  reformaArticles, CATEGORY_CONFIG, DIFFICULTY_CONFIG,
  type ReformaArticle
} from "@/lib/reformaContent";
import {
  Search, BookOpen, Clock, ChevronRight, X,
  FileText, AlertTriangle, Scale, Calendar, Wallet,
  TrendingUp, FileCheck, Info, Percent, Layers,
  Heart, ShoppingCart, Building2, Wheat, Stethoscope,
  GraduationCap, Factory, Landmark, Users, CreditCard,
  Home, RefreshCw, Shield, PieChart, CheckSquare
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, FileText, AlertTriangle, Scale, Calendar,
  Wallet, TrendingUp, FileCheck, Info, Percent, Layers,
  Heart, ShoppingCart, Building2, Wheat, Stethoscope,
  GraduationCap, Factory, Landmark, Users, CreditCard,
  Home, RefreshCw, Shield, PieChart, CheckSquare,
};

const CATEGORIES = [
  { key: "todos",        label: "Todos" },
  { key: "fundamentos",  label: "Fundamentos" },
  { key: "operacoes",    label: "Operações e Tecnologia" },
  { key: "setores",      label: "Setores da Economia" },
  { key: "regimes",      label: "Regimes Tributários" },
  { key: "contratos",    label: "Contratos e Preços" },
  { key: "planejamento", label: "Planejamento e Adequação" },
];

function ArticleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? BookOpen;
  return <Icon className={className} />;
}

function ArticleCard({ article, onClick }: { article: ReformaArticle; onClick: () => void }) {
  const catConfig = CATEGORY_CONFIG[article.category];
  const diffConfig = DIFFICULTY_CONFIG[article.difficulty];
  return (
    <div
      onClick={onClick}
      data-testid={`card-article-${article.id}`}
      className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 cursor-pointer hover:border-[hsl(var(--primary))] hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0 group-hover:bg-[hsl(var(--primary))]/20 transition-colors">
          <ArticleIcon name={article.icon} className="w-5 h-5 text-[hsl(var(--primary))]" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${catConfig.color}`}>
          {catConfig.label}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-white text-sm leading-tight mb-1 group-hover:text-[hsl(var(--primary))] transition-colors">
          {article.title}
        </h3>
        <p className="text-[hsl(var(--muted-foreground))] text-xs leading-relaxed line-clamp-3">
          {article.summary}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[hsl(var(--border))]">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${diffConfig.color}`}>
            {diffConfig.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
            <Clock className="w-3 h-3" /> {article.readTime} min
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors" />
      </div>
    </div>
  );
}

function Section({ title, color, titleColor, content }: { title: string; color: string; titleColor: string; content: string }) {
  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${titleColor}`}>{title}</p>
      <p className="text-sm text-white/90 leading-relaxed">{content}</p>
    </div>
  );
}

function ArticleModal({ article, onClose, onRelated }: { article: ReformaArticle; onClose: () => void; onRelated: (id: string) => void }) {
  const catConfig = CATEGORY_CONFIG[article.category];
  const related = reformaArticles.filter(a => article.relatedArticles.includes(a.id));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[hsl(var(--card))] border-[hsl(var(--border))] text-white max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/15 flex items-center justify-center">
              <ArticleIcon name={article.icon} className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${catConfig.color}`}>
              {catConfig.label}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-white leading-tight">
            {article.title}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {article.lawBasis.map(law => (
              <span key={law} className="text-xs text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 px-2 py-0.5 rounded">
                {law}
              </span>
            ))}
            <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
              <Clock className="w-3 h-3" /> {article.readTime} min de leitura
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="pb-6 space-y-5">
            <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mt-4">
              {article.summary}
            </p>

            <Section
              title="O que diz a lei"
              color="border-blue-500/40 bg-blue-500/5"
              titleColor="text-blue-300"
              content={article.sections.oquedizalei}
            />
            <Section
              title="O que muda na prática"
              color="border-orange-500/40 bg-orange-500/5"
              titleColor="text-orange-300"
              content={article.sections.oquemudata}
            />
            <Section
              title="O que sua empresa precisa fazer"
              color="border-green-500/40 bg-green-500/5"
              titleColor="text-green-300"
              content={article.sections.oquefarzer}
            />

            <div className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background))] rounded-lg p-3 border border-[hsl(var(--border))]">
              <span className="font-semibold text-white">Base legal: </span>
              {article.sections.baseLegal}
            </div>

            {related.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-2">Artigos relacionados</p>
                <div className="flex flex-col gap-2">
                  {related.map(r => (
                    <button
                      key={r.id}
                      onClick={() => onRelated(r.id)}
                      data-testid={`button-related-${r.id}`}
                      className="flex items-center gap-2 text-left p-2 rounded-lg bg-[hsl(var(--background))] hover:bg-[hsl(var(--primary))]/10 transition-colors group"
                    >
                      <ArticleIcon name={r.icon} className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
                      <span className="text-sm text-white group-hover:text-[hsl(var(--primary))] transition-colors">{r.title}</span>
                      <ChevronRight className="w-3 h-3 text-[hsl(var(--muted-foreground))] ml-auto shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardEducational() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedArticle, setSelectedArticle] = useState<ReformaArticle | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reformaArticles.filter(a => {
      const matchCat = activeCategory === "todos" || a.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.categoryLabel.toLowerCase().includes(q) ||
        a.sections.oquedizalei.toLowerCase().includes(q) ||
        a.sections.oquemudata.toLowerCase().includes(q) ||
        a.sections.oquefarzer.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  const featured = useMemo(() => reformaArticles.filter(a => a.featured).slice(0, 3), []);

  const handleRelated = (id: string) => {
    const article = reformaArticles.find(a => a.id === id);
    if (article) setSelectedArticle(article);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[hsl(var(--background))]">

        {/* HERO */}
        <div className="bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] border-b border-[hsl(var(--border))] px-6 py-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-xs text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
              Transição ativa — 2026 a 2033
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">O Que Muda?</h1>
            <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-xl mx-auto">
              Base de conhecimento da Reforma Tributária baseada na EC 132/2023,
              LC 214/2025 e LC 227/2026. Linguagem direta, para decisões reais.
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por tema, produto, setor ou tecnologia..."
                data-testid="input-search-articles"
                className="pl-10 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-white placeholder:text-[hsl(var(--muted-foreground))] h-11 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" data-testid="button-clear-search">
                  <X className="w-4 h-4 text-[hsl(var(--muted-foreground))] hover:text-white transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

          {/* DESTAQUES */}
          {!search && activeCategory === "todos" && featured.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-4">
                Essenciais para começar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map(a => (
                  <ArticleCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} />
                ))}
              </div>
            </section>
          )}

          {/* FILTROS */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                data-testid={`button-category-${cat.key}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat.key
                    ? "bg-[hsl(var(--primary))] text-black"
                    : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-white border border-[hsl(var(--border))]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* RESULTADO */}
          {search && (
            <p className="text-sm text-[hsl(var(--muted-foreground))]" data-testid="text-search-results">
              {filtered.length === 0
                ? "Nenhum artigo encontrado para"
                : `${filtered.length} artigo${filtered.length > 1 ? "s" : ""} encontrado${filtered.length > 1 ? "s" : ""} para`}{" "}
              <span className="text-white font-medium">"{search}"</span>
            </p>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(a => (
                <ArticleCard key={a.id} article={a} onClick={() => setSelectedArticle(a)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
              <p className="text-white font-medium mb-1">Nenhum resultado encontrado</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Tente palavras como "IBS", "Split Payment", "Simples Nacional" ou um setor
              </p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("todos"); }} data-testid="button-clear-filters">
                Limpar filtros
              </Button>
            </div>
          )}

          {/* RODAPÉ LEGAL */}
          <div className="border-t border-[hsl(var(--border))] pt-6 pb-2">
            <p className="text-xs text-[hsl(var(--muted-foreground))] text-center leading-relaxed">
              Conteúdo baseado na EC 132/2023, LC 214/2025 e LC 227/2026.
              As informações têm caráter educativo e não substituem assessoria jurídica ou contábil especializada.
              Consulte um profissional habilitado antes de tomar decisões tributárias.
            </p>
          </div>
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onRelated={handleRelated}
        />
      )}
    </MainLayout>
  );
}
