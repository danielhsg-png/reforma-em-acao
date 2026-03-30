import { useState, useMemo, useEffect, useRef } from "react";
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
  Home, RefreshCw, Shield, PieChart, CheckSquare,
  ShieldAlert, TrendingDown, ClipboardList, DollarSign, CheckCircle2
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
  const isAlert = article.id === 'infracoes-penalidades';

  if (isAlert) {
    return (
      <div
        onClick={onClick}
        data-testid={`card-article-${article.id}`}
        className="relative bg-red-950/40 border-2 border-red-500 rounded-xl p-5 cursor-pointer hover:border-red-400 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-200 group flex flex-col gap-3"
      >
        <div className="absolute -top-3 left-4">
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
            ⚠ Atenção
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 mt-1">
          <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 group-hover:bg-red-500/30 transition-colors border border-red-500/40">
            <ArticleIcon name={article.icon} className="w-6 h-6 text-red-400" />
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${catConfig.color}`}>
            {catConfig.label}
          </span>
        </div>

        <div>
          <h3 className="font-bold text-red-300 text-base leading-tight mb-1 group-hover:text-red-200 transition-colors">
            {article.title}
          </h3>
          <p className="text-red-300/80 text-sm font-semibold leading-relaxed tracking-wide">
            {article.summary}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-red-500/30">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded ${diffConfig.color}`}>
              {diffConfig.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-red-400/70">
              <Clock className="w-3 h-3" /> {article.readTime} min
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400/70 group-hover:text-red-300 transition-colors" />
        </div>
      </div>
    );
  }

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
        <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 group-hover:text-[hsl(var(--primary))] transition-colors">
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
      <p className="text-sm text-foreground/80 leading-relaxed">{content}</p>
    </div>
  );
}

function ArticleModal({ article, onClose, onRelated }: { article: ReformaArticle; onClose: () => void; onRelated: (id: string) => void }) {
  const catConfig = CATEGORY_CONFIG[article.category];
  const related = reformaArticles.filter(a => article.relatedArticles.includes(a.id));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[hsl(var(--card))] border-[hsl(var(--border))] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 shrink-0 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/15 flex items-center justify-center">
              <ArticleIcon name={article.icon} className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${catConfig.color}`}>
              {catConfig.label}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground leading-tight">
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

        <div
          className="flex-1 overflow-y-scroll px-6 min-h-0"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(249,115,22,0.55) transparent" }}
          data-testid="article-modal-scroll"
        >
          <div className="pb-6 pt-5 space-y-5">
            <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
              {article.summary}
            </p>

            <Section
              title="O que diz a lei"
              color="border-blue-500/40 bg-blue-500/5"
              titleColor="text-blue-600"
              content={article.sections.oquedizalei}
            />
            <Section
              title="O que muda na prática"
              color="border-orange-500/40 bg-orange-500/5"
              titleColor="text-orange-600"
              content={article.sections.oquemudata}
            />
            <Section
              title="O que sua empresa precisa fazer"
              color="border-green-500/40 bg-green-500/5"
              titleColor="text-green-600"
              content={article.sections.oquefarzer}
            />

            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3 border border-border">
              <span className="font-semibold text-foreground">Base legal: </span>
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
                      <span className="text-sm text-foreground group-hover:text-[hsl(var(--primary))] transition-colors">{r.title}</span>
                      <ChevronRight className="w-3 h-3 text-[hsl(var(--muted-foreground))] ml-auto shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const INFRACTION_GROUPS = [
  {
    id: "g1",
    title: "Falhas documentais",
    subtitle: "Declarações, arquivos digitais e eventos de NF",
    Icon: ClipboardList,
    base: "LC 214/2025, Cap. IV — Categorias D, G e Q",
    items: [
      { letra: "D", label: "Atraso ou erro em declarações e arquivos fiscais", risco: "Declaração de IBS/CBS transmitida com atraso, com campos incorretos ou omissa. É causa frequente de auto de infração acessório.", como: "Rotina de conferência pré-transmissão com validação pelo sistema e revisão com o contador antes do envio." },
      { letra: "G", label: "Eventos de documentos fiscais fora do prazo", risco: "Cancelamento, carta de correção ou inutilização de NF-e registrados fora do prazo regulamentar.", como: "Alertas automáticos no ERP com prazo máximo de cancelamento; política interna de eventos documentais." },
      { letra: "Q", label: "Contingência com valor divergente", risco: "NF emitida em contingência com valor ou dados diferentes da declaração prévia enviada ao fisco.", como: "Validar e transmitir o documento definitivo imediatamente após o retorno da conectividade." },
    ],
  },
  {
    id: "g2",
    title: "Cadastro e conformidade operacional",
    subtitle: "Inscrições, atualizações e deveres instrumentais",
    Icon: Building2,
    base: "LC 214/2025, Cap. IV — Categorias A, B, C, E, F, I, S e T",
    items: [
      { letra: "A · B · C", label: "Inscrição, atualização e encerramento cadastral", risco: "Não se inscrever no cadastro do IBS/CBS no prazo, não comunicar alterações de dados, ou encerrar o estabelecimento sem a baixa formal.", como: "Definir responsável pelo cadastro fiscal e estabelecer rotina de verificação a cada alteração societária, de endereço ou de atividade." },
      { letra: "E · F", label: "Softwares fiscais e equipamentos de medição", risco: "Uso de emissor de NF-e sem homologação, sistema paralelo não validado, ou equipamentos de medição sem lacre ou calibração.", como: "Confirmar com o fornecedor do ERP a homologação dos sistemas; manter equipamentos com calibração e documentação vigente." },
      { letra: "I · S · T", label: "Fiscalização, trânsito e ZFM", risco: "Impedir ou dificultar agente fiscal; violar lacres em unidades de carga; descumprir obrigações específicas da Zona Franca de Manaus ou Áreas de Livre Comércio.", como: "Designar responsável para atender fiscalizações; treinar a equipe de logística; mapear obrigações específicas da ZFM com assessoria especializada." },
    ],
  },
  {
    id: "g3",
    title: "Documentos fiscais irregulares",
    subtitle: "Operações sem nota, documentos inválidos e cancelamentos",
    Icon: FileText,
    base: "LC 214/2025, Cap. IV — Categorias J, K, L, M, O e P",
    items: [
      { letra: "J · O", label: "Operação sem documento fiscal", risco: "Venda ou prestação de serviço sem NF emitida; entrada de mercadoria de produtor rural ou importação sem NF de entrada quando exigida.", como: "Política zero de operação informal; mapear todas as hipóteses em que a empresa deve emitir NF de entrada e incluir no processo." },
      { letra: "K · L · M", label: "Documento inválido, reutilizado ou adulterado", risco: "Reúso de NF cancelada; aceitação de nota de fornecedor com CNPJ ou inscrição estadual cancelados; adulteração de valores em documento fiscal.", como: "Controle rigoroso de numeração e status; validar situação cadastral do fornecedor antes de aceitar a nota; arquivo digital seguro e imutável." },
      { letra: "P", label: "Cancelamento extemporâneo", risco: "Cancelar NF-e fora do prazo regulamentar (que pode ser de horas, conforme a legislação técnica vigente).", como: "Alertas automáticos no sistema; garantir que pedidos de cancelamento sejam transmitidos dentro do prazo." },
    ],
  },
  {
    id: "g4",
    title: "Crédito indevido, devoluções e comércio exterior",
    subtitle: "Apropriação de crédito, retornos e operações internacionais",
    Icon: DollarSign,
    base: "LC 214/2025, Cap. IV — Categorias N, H e R",
    items: [
      { letra: "N", label: "Crédito fiscal apropriado indevidamente", risco: "Tomar crédito de IBS/CBS sem respaldo documental, fora das condições legais, em duplicidade, ou de operação isenta ou não tributada.", como: "Rotina de validação de créditos antes da escrituração; confirmar com o contador quais operações geram crédito e quais condições são exigidas." },
      { letra: "H", label: "Devoluções, retornos e desfazimentos", risco: "Não registrar ou emitir corretamente os documentos correspondentes a devoluções, retornos ou desfazimentos de operações.", como: "Processo estruturado para devoluções com NF-e e eventos corretos; auditoria mensal de retornos versus documentos emitidos." },
      { letra: "R", label: "Omissões em importação ou exportação", risco: "Omitir informações ou documentos exigidos pelo fisco em operações de comércio exterior no contexto do IBS e da CBS.", como: "Integrar os setores de comércio exterior e fiscal; confirmar com o contador quais obrigações informacionais se aplicam a cada operação." },
    ],
  },
];

export default function DashboardEducational() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedArticle, setSelectedArticle] = useState<ReformaArticle | null>(null);
  const [searchHighlight, setSearchHighlight] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [openInfraction, setOpenInfraction] = useState<string | null>(null);
  const [showInfractions, setShowInfractions] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      searchRef.current?.focus();
      setSearchHighlight(true);
      setTimeout(() => setSearchHighlight(false), 1800);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

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
            <h1 className="text-3xl font-bold text-foreground mb-3">O Que Muda?</h1>
            <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-xl mx-auto">
              Base de conhecimento da Reforma Tributária baseada na EC 132/2023,
              LC 214/2025 e LC 227/2026. Linguagem direta, para decisões reais.
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <Input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por tema, produto, setor ou tecnologia..."
                data-testid="input-search-articles"
                className={`pl-10 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-foreground placeholder:text-[hsl(var(--muted-foreground))] h-11 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all duration-300 ${
                  searchHighlight
                    ? "border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary))]/60 shadow-lg shadow-orange-500/20 scale-[1.01]"
                    : ""
                }`}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" data-testid="button-clear-search">
                  <X className="w-4 h-4 text-[hsl(var(--muted-foreground))] hover:text-foreground transition-colors" />
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
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-foreground border border-[hsl(var(--border))]"
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
              <span className="text-foreground font-medium">"{search}"</span>
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
              <p className="text-foreground font-medium mb-1">Nenhum resultado encontrado</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Tente palavras como "IBS", "Split Payment", "Simples Nacional" ou um setor
              </p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("todos"); }} data-testid="button-clear-filters">
                Limpar filtros
              </Button>
            </div>
          )}

          {/* INFRAÇÕES E PENALIDADES */}
          <section className="space-y-4">
            <button
              onClick={() => setShowInfractions(!showInfractions)}
              data-testid="button-toggle-infracoes"
              className="w-full flex items-center justify-between p-4 rounded-xl border border-amber-400/50 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-sm">Infrações e Penalidades</p>
                  <p className="text-xs text-muted-foreground">LC 214/2025 — o que sua empresa deve evitar</p>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 text-amber-600 transition-transform duration-200 ${showInfractions ? "rotate-90" : ""}`} />
            </button>

            {showInfractions && (
              <div className="space-y-4" data-testid="section-infracoes">

                {/* MULTAS */}
                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <h3 className="font-semibold text-foreground text-sm">Multas por descumprimento — LC 214/2025</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-amber-300/60 bg-amber-500/5 p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600">75%</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">Multa padrão</p>
                      <p className="text-xs text-muted-foreground mt-1">Sonegação, fraude ou evasão de tributo</p>
                    </div>
                    <div className="rounded-lg border border-red-300/60 bg-red-500/5 p-3 text-center">
                      <p className="text-2xl font-bold text-red-600">150%</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">Multa agravada</p>
                      <p className="text-xs text-muted-foreground mt-1">Reincidência ou embaraço ao fisco</p>
                    </div>
                    <div className="rounded-lg border border-slate-300/60 bg-slate-500/5 p-3 text-center">
                      <p className="text-2xl font-bold text-slate-600">Acessória</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">Multa por obrigação acessória</p>
                      <p className="text-xs text-muted-foreground mt-1">Atraso, omissão ou erro em declarações</p>
                    </div>
                  </div>
                </div>

                {/* GRUPOS TEMÁTICOS */}
                <div className="space-y-3">
                  {INFRACTION_GROUPS.map((grp) => {
                    const isOpen = openInfraction === grp.id;
                    return (
                      <div key={grp.id} className={`rounded-xl border overflow-hidden ${isOpen ? "border-amber-400/60" : "border-[hsl(var(--border))]"}`} data-testid={`card-group-${grp.id}`}>
                        <button
                          className="w-full flex items-center gap-3 p-4 hover:bg-[hsl(var(--accent))]/30 transition-colors text-left"
                          onClick={() => setOpenInfraction(isOpen ? null : grp.id)}
                          data-testid={`button-group-${grp.id}`}
                        >
                          <grp.Icon className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">{grp.title}</p>
                            <p className="text-xs text-muted-foreground">{grp.subtitle}</p>
                          </div>
                          <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 text-amber-600 ${isOpen ? "rotate-90" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="border-t border-[hsl(var(--border))] p-4 space-y-3 bg-[hsl(var(--background))]">
                            <p className="text-xs text-muted-foreground bg-[hsl(var(--card))] px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] inline-block">{grp.base}</p>
                            {grp.items.map((item, idx) => (
                              <div key={idx} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">{item.letra}</span>
                                  <p className="text-sm font-medium text-foreground leading-snug">{item.label}</p>
                                </div>
                                <div className="pl-0 space-y-1.5">
                                  <div className="flex gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground leading-relaxed"><span className="font-medium text-foreground">Risco: </span>{item.risco}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground leading-relaxed"><span className="font-medium text-foreground">Como evitar: </span>{item.como}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* REDUÇÕES LEGAIS */}
                <div className={`rounded-xl border overflow-hidden ${openInfraction === "g5" ? "border-green-400/60" : "border-green-300/50"}`} data-testid="card-group-g5">
                  <button
                    className="w-full flex items-center gap-3 p-4 hover:bg-green-500/5 transition-colors text-left"
                    onClick={() => setOpenInfraction(openInfraction === "g5" ? null : "g5")}
                    data-testid="button-group-g5"
                  >
                    <TrendingDown className="w-4 h-4 text-green-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-700">Reduções legais da multa</p>
                      <p className="text-xs text-muted-foreground">Como reduzir penalidades após notificação fiscal</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 text-green-600 ${openInfraction === "g5" ? "rotate-90" : ""}`} />
                  </button>
                  {openInfraction === "g5" && (
                    <div className="border-t border-green-200/60 p-4 bg-green-500/5 space-y-2">
                      {[
                        { pct: "−50%", desc: "Pagamento integral do débito dentro do prazo de impugnação" },
                        { pct: "−30%", desc: "Pagamento integral após a decisão de 1ª instância" },
                        { pct: "−20%", desc: "Pagamento após decisão de 2ª instância (antes do trânsito em julgado)" },
                        { pct: "−50%", desc: "Multa de ofício quando houver adesão a parcelamento especial (PERT/PERSE)" },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-green-200/60 bg-white/5 p-2.5">
                          <span className="text-sm font-bold text-green-600 w-12 shrink-0">{r.pct}</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* INFO LEGAL */}
                <div className={`rounded-xl border overflow-hidden ${openInfraction === "g6" ? "border-[hsl(var(--primary))]/50" : "border-[hsl(var(--border))]"}`} data-testid="card-group-g6">
                  <button
                    className="w-full flex items-center gap-3 p-4 hover:bg-[hsl(var(--accent))]/30 transition-colors text-left"
                    onClick={() => setOpenInfraction(openInfraction === "g6" ? null : "g6")}
                    data-testid="button-group-g6"
                  >
                    <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Natureza das multas e denúncia espontânea</p>
                      <p className="text-xs text-muted-foreground">Princípios gerais e como agir antes da ação fiscal</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground ${openInfraction === "g6" ? "rotate-90" : ""}`} />
                  </button>
                  {openInfraction === "g6" && (
                    <div className="border-t border-[hsl(var(--border))] p-4 bg-[hsl(var(--background))] space-y-3">
                      <div className="rounded-lg border border-blue-300/40 bg-blue-500/5 p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Caráter não confiscatório e proporcionalidade</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">A LC 214/2025 segue orientação do STF: multas devem ser proporcionais ao dano causado e não podem ter caráter confiscatório. Multas acima de 100% do tributo já foram afastadas pela jurisprudência.</p>
                      </div>
                      <div className="rounded-lg border border-green-300/40 bg-green-500/5 p-3">
                        <p className="text-xs font-semibold text-green-700 mb-1">Denúncia espontânea — afasta a multa de mora</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Se a empresa identificar o erro e comunicar ao fisco antes do início de qualquer procedimento fiscal, pode afastar a multa de mora (mas não os juros). Essa proteção vale para IBS e CBS da mesma forma que já valia para tributos federais.</p>
                      </div>
                      <div className="rounded-lg border border-amber-300/40 bg-amber-500/5 p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">Responsabilidade solidária e subsidiária</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Sócios-administradores podem ser responsabilizados solidariamente em casos de dissolução irregular ou dolo. Gestores de empresas do grupo respondem subsidiariamente por débitos de IBS/CBS quando há dissolução irregular.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </section>

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
