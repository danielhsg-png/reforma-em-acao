import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, ArrowLeft, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Zap, Package, Building, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";

interface Supplier {
  id: string;
  name: string;
  rating: "A" | "B" | "C";
  documentQuality: number;
  creditGeneration: "Alto" | "Medio" | "Baixo";
}

const CREDIT_MAP = [
  { category: "Mercadorias para revenda", credit: "Alto", rate: "26,5%", note: "Credito integral se fornecedor emite NF-e com IBS/CBS", color: "green" },
  { category: "Insumos industriais", credit: "Alto", rate: "26,5%", note: "Materias-primas, embalagens, componentes", color: "green" },
  { category: "Energia eletrica", credit: "Alto", rate: "26,5%", note: "Novidade: antes so gerava credito parcial (PIS/COFINS nao-cumulativo)", color: "green" },
  { category: "Aluguel comercial (PJ)", credit: "Alto", rate: "26,5%", note: "Aluguel pago a pessoa juridica gera credito pleno. PF nao gera.", color: "green" },
  { category: "Frete e logistica", credit: "Alto", rate: "26,5%", note: "CT-e do transportador gera credito. Conferir campos IBS/CBS no CT-e.", color: "green" },
  { category: "Softwares e licencas (SaaS)", credit: "Alto", rate: "26,5%", note: "Servicos de TI contratados de PJ geram credito integral", color: "green" },
  { category: "Servicos tomados (B2B)", credit: "Alto", rate: "26,5%", note: "Contabilidade, limpeza, seguranca, manutencao - se PJ com NF-e", color: "green" },
  { category: "Ativo imobilizado (maquinas, equipamentos)", credit: "Alto", rate: "26,5%", note: "Credito integral no ato da aquisicao (nao mais em 48 parcelas)", color: "green" },
  { category: "Compras de fornecedores Simples Nacional", credit: "Medio", rate: "~4-8%", note: "Credito limitado a aliquota efetiva recolhida pelo fornecedor no DAS", color: "yellow" },
  { category: "Folha de pagamento e encargos", credit: "Zero", rate: "0%", note: "Salarios, FGTS, INSS NAO geram credito de IBS/CBS", color: "red" },
  { category: "Compras de pessoa fisica", credit: "Zero", rate: "0%", note: "Autonomos PF e produtores rurais PF (ate R$ 3,6M) nao geram credito, salvo opcao", color: "red" },
  { category: "Bens de uso pessoal / lazer", credit: "Zero", rate: "0%", note: "Alimentacao de socios, veiculos particulares, entretenimento", color: "red" },
];

export default function SupplyChain() {
  const { data } = useAppStore();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Fornecedor Principal (Exemplo)",
      rating: "A",
      documentQuality: 95,
      creditGeneration: "Alto",
    },
  ]);

  const [newSupplier, setNewSupplier] = useState({ name: "", rating: "A" as const });

  const addSupplier = () => {
    if (newSupplier.name.trim()) {
      setSuppliers([
        ...suppliers,
        {
          id: Date.now().toString(),
          name: newSupplier.name,
          rating: newSupplier.rating,
          documentQuality: 75,
          creditGeneration: "Medio",
        },
      ]);
      setNewSupplier({ name: "", rating: "A" });
    }
  };

  const updateRating = (id: string, rating: "A" | "B" | "C") => {
    setSuppliers(suppliers.map((s) => (s.id === id ? { ...s, rating } : s)));
  };

  const removeSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight" data-testid="text-supply-title">
            Gestao de Fornecedores & Creditos
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            A inteligencia de compras muda: comprar bem agora significa "preco + nota correta + fornecedor consistente". A LC 214/2025 garante credito amplo, mas so para aquisicoes documentadas.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Mapa de Geracao de Creditos (LC 214/2025, arts. 28-47)
          </h2>
          <p className="text-muted-foreground mb-6">
            Avalie cada tipo de despesa da sua empresa e entenda quanto credito de IBS/CBS ela gera. Quanto mais despesas na faixa "Alto", menor seu imposto efetivo.
          </p>
          <div className="space-y-2">
            {CREDIT_MAP.map((item, idx) => (
              <div key={idx} className={`p-3 border rounded-lg flex flex-col sm:flex-row sm:items-center gap-2 ${
                item.color === "green" ? "border-green-200 bg-green-50/50" : 
                item.color === "yellow" ? "border-accent/30 bg-accent/5" : 
                "border-destructive/20 bg-destructive/5"
              }`} data-testid={`credit-map-${idx}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.credit === "Alto" ? "default" : item.credit === "Medio" ? "secondary" : "destructive"} className="text-xs">
                      {item.credit === "Zero" ? "Sem credito" : `Credito ${item.credit}`}
                    </Badge>
                    <span className="font-bold text-sm">{item.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-mono font-bold text-sm ${
                    item.color === "green" ? "text-green-700" : 
                    item.color === "yellow" ? "text-accent" : 
                    "text-destructive"
                  }`}>{item.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {data.costStructure === "folha" && (
          <Alert className="border-2 border-destructive bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-destructive font-bold">Alerta: Maior custo e Folha de Pagamento</AlertTitle>
            <AlertDescription className="text-sm mt-2">
              Voce informou que seu maior custo operacional e Folha de Pagamento. Como salarios e encargos NAO geram credito de IBS/CBS, sua empresa fica com menos creditos para abater do debito nas vendas. Isso significa que sua carga tributaria efetiva tende a ser maior. Considere o simulador financeiro para quantificar o impacto.
            </AlertDescription>
          </Alert>
        )}

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Classificacao de Fornecedores (Matriz A/B/C)</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-700">Fornecedores A (Bom)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                  <span>Documento sempre consistente e padronizado</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                  <span>NCM/NBS e cClassTrib corretos na NF-e</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                  <span>Resolve divergencias rapidamente</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                  <span>Gera credito integral (26,5%)</span>
                </div>
                <div className="p-2 bg-green-100 rounded mt-2 text-xs font-medium text-green-800">
                  Acao: Ampliar volumes. Base da competitividade.
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/50 bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-accent">Fornecedores B (Regular)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span>Documento consistente as vezes</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span>Descricao varia, NCM nem sempre correto</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span>Demora a resolver problemas</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span>Credito parcial ou atrasado</span>
                </div>
                <div className="p-2 bg-accent/10 rounded mt-2 text-xs font-medium text-accent-foreground">
                  Acao: Plano de correcao com prazo de 90 dias. Se nao melhorar, substituir.
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-destructive">Fornecedores C (Ruim)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                  <span>Documento frequentemente inconsistente</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                  <span>Sem padrao, sem NCM/NBS correto</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                  <span>Nao resolve problemas / informal</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                  <span>Credito minimo ou zero</span>
                </div>
                <div className="p-2 bg-destructive/10 rounded mt-2 text-xs font-medium text-destructive">
                  Acao: Substituir IMEDIATAMENTE nos itens que mais afetam a margem.
                </div>
              </CardContent>
            </Card>
          </div>

          {data.simplesSupplierPercent === "acima_60" && (
            <Alert className="border-2 border-accent bg-accent/5 mb-6">
              <AlertTriangle className="h-5 w-5 text-accent" />
              <AlertTitle className="text-accent font-bold">Mais de 60% dos fornecedores sao Simples Nacional</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                Isso significa que a maioria dos seus creditos de IBS/CBS sera pela aliquota efetiva do DAS (4-8%), nao pela aliquota cheia de 26,5%. O impacto no custo final e significativo. Avalie diversificar fornecedores para empresas do Lucro Real/Presumido nos itens de maior volume.
              </AlertDescription>
            </Alert>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Registre seus Fornecedores</h2>
          <div className="space-y-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow" data-testid={`card-supplier-${supplier.id}`}>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <Label className="text-xs text-muted-foreground">Fornecedor</Label>
                      <p className="font-bold">{supplier.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Classificacao</Label>
                      <Select value={supplier.rating} onValueChange={(val) => updateRating(supplier.id, val as "A" | "B" | "C")}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A (Bom)</SelectItem>
                          <SelectItem value="B">B (Regular)</SelectItem>
                          <SelectItem value="C">C (Ruim)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Credito</Label>
                      <Badge variant={supplier.creditGeneration === "Alto" ? "default" : supplier.creditGeneration === "Medio" ? "secondary" : "outline"}>
                        {supplier.creditGeneration}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Qualidade Doc.</Label>
                      <p className="font-bold">{supplier.documentQuality}%</p>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeSupplier(supplier.id)}>
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="supplier-name">Nome do Fornecedor</Label>
                    <Input
                      id="supplier-name"
                      placeholder="Digite o nome do fornecedor"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      data-testid="input-supplier-name"
                    />
                  </div>
                  <Button onClick={addSupplier} data-testid="button-add-supplier">
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Estrategia: Simples Nacional e Opcao de Recolhimento Fora do DAS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              A LC 214/2025 permite que empresas do Simples Nacional <strong>optem por recolher IBS/CBS fora do DAS</strong>. Neste caso, o fornecedor Simples passa a gerar credito integral (26,5%) para seus clientes B2B.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="p-3 bg-background rounded-lg border">
                <h5 className="font-bold text-sm text-foreground mb-1">Sem opcao (padrao)</h5>
                <p className="text-xs">Fornecedor Simples recolhe no DAS. Credito para o comprador: aliquota efetiva (~4-8%).</p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-green-200">
                <h5 className="font-bold text-sm text-green-700 mb-1">Com opcao fora do DAS</h5>
                <p className="text-xs">Fornecedor Simples recolhe IBS/CBS separadamente. Credito para o comprador: aliquota cheia (26,5%).</p>
              </div>
            </div>
            <p className="text-xs italic mt-2">
              Pergunte aos seus fornecedores Simples se pretendem optar pelo recolhimento fora do DAS. Isso pode mudar sua classificacao de B/C para A.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6 border-t">
          <Link href="/plano-de-acao/sistemas">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-system">
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </Button>
          </Link>
          <Link href="/plano-de-acao/precificacao">
            <Button size="lg" className="gap-2" data-testid="button-next-pricing">
              Proximo: Inteligencia de Precificacao
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
