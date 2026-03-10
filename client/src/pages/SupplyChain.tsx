import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface Supplier {
  id: string;
  name: string;
  rating: "A" | "B" | "C";
  documentQuality: number;
  creditGeneration: "Alto" | "Médio" | "Baixo";
}

export default function SupplyChain() {
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
          creditGeneration: "Médio",
        },
      ]);
      setNewSupplier({ name: "", rating: "A" });
    }
  };

  const updateRating = (id: string, rating: "A" | "B" | "C") => {
    setSuppliers(suppliers.map((s) => (s.id === id ? { ...s, rating } : s)));
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight">
            Gestão de Fornecedores & Créditos
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            A inteligência de compras muda: comprar bem agora significa "preço + nota correta + fornecedor consistente".
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Classificação de Fornecedores (Matriz A/B/C)</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-700">Fornecedores A (Bom)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                  <span>Documento sempre consistente</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                  <span>Descrição padronizada</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                  <span>Resolve divergências rápido</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 mr-2 shrink-0" />
                  <span>Alta previsibilidade</span>
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
                  <span>Documento consistente às vezes</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span>Descrição varia</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span>Demora a resolver problemas</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 shrink-0" />
                  <span>Previsibilidade média</span>
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
                  <span>Sem padrão</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                  <span>Não resolve problemas</span>
                </div>
                <div className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 mr-2 shrink-0" />
                  <span>Baixa previsibilidade</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Plano de Ação para Compras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-sm"><strong>Fornecedores A:</strong> Ampliar volumes. São a base de sua competitividade.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                <span className="text-sm"><strong>Fornecedores B:</strong> Criar plano de correção. Definir prazo para melhoria. Se não melhorarem em 90 dias, substituir.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                <span className="text-sm"><strong>Fornecedores C:</strong> Substituir imediatamente nos itens que mais afetam a margem.</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading mb-6">Registre seus Fornecedores</h2>
          <div className="space-y-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <Label className="text-xs text-muted-foreground">Fornecedor</Label>
                      <p className="font-bold">{supplier.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Classificação</Label>
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
                      <Label className="text-xs text-muted-foreground">Crédito</Label>
                      <Badge variant={supplier.creditGeneration === "Alto" ? "default" : supplier.creditGeneration === "Médio" ? "secondary" : "outline"}>
                        {supplier.creditGeneration}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Qualidade Doc.</Label>
                      <p className="font-bold">{supplier.documentQuality}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="supplier-name">Nome do Fornecedor</Label>
                    <Input
                      id="supplier-name"
                      placeholder="Digite o nome do fornecedor"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    />
                  </div>
                  <Button onClick={addSupplier} className="w-full">
                    Adicionar Fornecedor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="flex justify-end pt-6 border-t">
          <Link href="/pricing-strategy">
            <Button size="lg" className="gap-2">
              Próximo: Inteligência de Precificação
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
