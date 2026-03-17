import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { Package, Plus, Trash2, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2, Info, Sparkles, ShieldAlert, Search } from "lucide-react";
import { Link } from "wouter";

interface Product {
  id: number;
  name: string;
  category: string;
  revenuePercent: string;
}

const PRODUCT_CATEGORIES = [
  { value: "alimento_basico", label: "Alimento da Cesta Basica", group: "Alimentos" },
  { value: "alimento_reduzido", label: "Alimento com Reducao (carnes, queijos, cafe)", group: "Alimentos" },
  { value: "alimento_geral", label: "Alimento Geral / Industrializado", group: "Alimentos" },
  { value: "bebida_alcoolica", label: "Bebida Alcoolica", group: "Bebidas" },
  { value: "bebida_acucarada", label: "Bebida Acucarada / Refrigerante", group: "Bebidas" },
  { value: "bebida_geral", label: "Bebida Nao Alcoolica / Agua", group: "Bebidas" },
  { value: "medicamento", label: "Medicamento / Farmaco", group: "Saude" },
  { value: "dispositivo_medico", label: "Dispositivo Medico / Protese / Ortese", group: "Saude" },
  { value: "higiene_limpeza", label: "Produto de Higiene ou Limpeza", group: "Higiene" },
  { value: "insumo_agro", label: "Insumo Agropecuario (semente, defensivo, racao)", group: "Agro" },
  { value: "produto_agro", label: "Produto Agropecuario In Natura", group: "Agro" },
  { value: "combustivel", label: "Combustivel / Lubrificante", group: "Combustiveis" },
  { value: "veiculo", label: "Veiculo / Embarcacao / Aeronave", group: "Veiculos" },
  { value: "tabaco", label: "Tabaco / Cigarro", group: "Tabaco" },
  { value: "minerio", label: "Minerio / Recurso Natural Extrativo", group: "Extracao" },
  { value: "livro_cultural", label: "Livro / Producao Cultural / Artistica", group: "Cultura" },
  { value: "educacao", label: "Servico de Educacao", group: "Educacao" },
  { value: "saude_servico", label: "Servico de Saude (consulta, exame, internacao)", group: "Saude" },
  { value: "transporte_coletivo", label: "Transporte Coletivo de Passageiros", group: "Transporte" },
  { value: "transporte_carga", label: "Transporte de Carga / Logistica", group: "Transporte" },
  { value: "imobiliario", label: "Venda/Locacao de Imovel", group: "Imobiliario" },
  { value: "construcao", label: "Material de Construcao / Obra Civil", group: "Construcao" },
  { value: "financeiro", label: "Servico Financeiro / Seguro", group: "Financeiro" },
  { value: "tecnologia", label: "Software / SaaS / Licenca de TI", group: "Tecnologia" },
  { value: "servico_profissional", label: "Servico de Profissional Liberal (advocacia, contabilidade, engenharia)", group: "Servicos" },
  { value: "servico_geral", label: "Servico Geral / Consultoria / Outros", group: "Servicos" },
  { value: "hotelaria", label: "Hospedagem / Hotelaria / Turismo", group: "Turismo" },
  { value: "restaurante", label: "Restaurante / Bar / Alimentacao Fora do Lar", group: "Turismo" },
  { value: "produto_industrial", label: "Produto Industrial / Manufaturado Geral", group: "Industria" },
  { value: "produto_varejo", label: "Mercadoria de Varejo (eletronicos, vestuario, etc.)", group: "Varejo" },
];

interface TaxImpact {
  regime: string;
  aliquotaEfetiva: string;
  reducao: string;
  creditoDisponivel: boolean;
  impostoSeletivo: boolean;
  splitPayment: string;
  referenciaLegal: string;
  alertas: string[];
  oportunidades: string[];
}

function getProductImpact(category: string): TaxImpact {
  const impacts: Record<string, TaxImpact> = {
    alimento_basico: {
      regime: "Cesta Basica Nacional",
      aliquotaEfetiva: "0% (aliquota zero)",
      reducao: "100%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Isento — sem recolhimento na fonte",
      referenciaLegal: "LC 214/2025, arts. 282-287",
      alertas: ["Necessario enquadramento correto no NCM da cesta basica. Lista taxativa de 22 itens."],
      oportunidades: ["Credito integral sobre insumos tributados normalmente. Margem preservada integralmente.", "Competitividade de preco: sem carga tributaria no preco final."],
    },
    alimento_reduzido: {
      regime: "Alimentos com Reducao de 60%",
      aliquotaEfetiva: "~10,6% (60% de reducao sobre 26,5%)",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025, Anexo XVII",
      alertas: ["Verificar se o produto consta na lista de reducao de 60%. Nem todos os alimentos se qualificam."],
      oportunidades: ["Aliquota efetiva bem menor que a plena. Possibilidade de tomar creditos integrais sobre insumos.", "Vantagem competitiva frente a produtos com aliquota plena."],
    },
    alimento_geral: {
      regime: "Aliquota Plena",
      aliquotaEfetiva: "26,5%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, art. 12",
      alertas: ["Sem reducao especial. O preco final incluira 26,5% de IVA Dual visivel na nota.", "Se o alimento puder ser reclassificado para cesta basica ou lista de reducao, buscar enquadramento."],
      oportunidades: ["Creditos integrais sobre toda a cadeia de insumos."],
    },
    bebida_alcoolica: {
      regime: "Aliquota Plena + Imposto Seletivo",
      aliquotaEfetiva: "26,5% + IS variavel",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: true,
      splitPayment: "Aplicavel — retencao integral de IBS/CBS + IS",
      referenciaLegal: "LC 214/2025, arts. 393-421",
      alertas: ["Imposto Seletivo (IS) incide ALEM do IBS/CBS. Carga tributaria total sera superior a 26,5%.", "O IS e nao-cumulativo e nao gera credito para o adquirente."],
      oportunidades: ["Planejamento de preco deve absorver o IS. Avalie se o mercado suporta o repasse."],
    },
    bebida_acucarada: {
      regime: "Aliquota Plena + Imposto Seletivo",
      aliquotaEfetiva: "26,5% + IS variavel",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: true,
      splitPayment: "Aplicavel — retencao integral de IBS/CBS + IS",
      referenciaLegal: "LC 214/2025, arts. 393-421",
      alertas: ["Refrigerantes e bebidas acucaradas sofrem incidencia de Imposto Seletivo adicional.", "A aliquota do IS sera definida por decreto e pode variar."],
      oportunidades: ["Considerar reformulacao de produtos com menor teor de acucar para escapar do IS."],
    },
    bebida_geral: {
      regime: "Aliquota Plena",
      aliquotaEfetiva: "26,5%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, art. 12",
      alertas: [],
      oportunidades: ["Agua mineral e sucos naturais sem adicao de acucar nao sofrem IS."],
    },
    medicamento: {
      regime: "Reducao de 60% (pode chegar a zero)",
      aliquotaEfetiva: "~10,6% ou 0% (lista CMED)",
      reducao: "60% a 100%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025, art. 277; Resolucoes CMED",
      alertas: ["Verificar se o medicamento consta na lista de aliquota zero da CMED.", "Medicamentos de referencia vs. genericos podem ter tratamento diferenciado."],
      oportunidades: ["Lista da CMED pode zerar completamente a tributacao para medicamentos essenciais.", "Credito integral sobre insumos farmaceuticos tributados normalmente."],
    },
    dispositivo_medico: {
      regime: "Reducao de 60%",
      aliquotaEfetiva: "~10,6%",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025, art. 276",
      alertas: ["Enquadramento depende do registro ANVISA e classificacao NCM correta."],
      oportunidades: ["Proteses, orteses e dispositivos para PcD podem ter aliquota ZERO.", "Forte vantagem competitiva para equipamentos hospitalares."],
    },
    higiene_limpeza: {
      regime: "Reducao de 60%",
      aliquotaEfetiva: "~10,6%",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025, art. 278",
      alertas: ["Somente produtos de higiene pessoal e limpeza listados no Anexo. Cosmeticos de luxo ficam na aliquota plena."],
      oportunidades: ["Competitividade de preco frente a produtos importados ou premium."],
    },
    insumo_agro: {
      regime: "Reducao de 60%",
      aliquotaEfetiva: "~10,6%",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025, art. 279",
      alertas: ["Lista de insumos agropecuarios e taxativa. Verificar NCM."],
      oportunidades: ["Produtores rurais podem tomar credito integral. Cadeia agro beneficiada."],
    },
    produto_agro: {
      regime: "Pode ter aliquota zero ou reducao",
      aliquotaEfetiva: "0% a 10,6%",
      reducao: "60% a 100%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Depende do enquadramento",
      referenciaLegal: "LC 214/2025, arts. 279, 282-287",
      alertas: ["Hortifrutigranjeiros in natura podem ter aliquota zero (cesta basica)."],
      oportunidades: ["Verificar se o produto pode ser enquadrado na cesta basica nacional para aliquota zero."],
    },
    combustivel: {
      regime: "Monofasico (aliquota fixa por unidade)",
      aliquotaEfetiva: "Aliquota fixa (R$/litro ou R$/kg)",
      reducao: "Regime especifico",
      creditoDisponivel: false,
      impostoSeletivo: true,
      splitPayment: "Regime monofasico — recolhimento na 1a fase",
      referenciaLegal: "LC 214/2025, arts. 246-256",
      alertas: ["Tributacao concentrada na refinaria/distribuidora. Revendedores NAO recolhem IBS/CBS.", "NAO ha creditos para o revendedor no regime monofasico.", "Incide Imposto Seletivo adicional (combustiveis fosseis)."],
      oportunidades: ["Simplificacao operacional: sem calculo de IBS/CBS na revenda.", "Biocombustiveis podem ter tratamento diferenciado favoravel."],
    },
    veiculo: {
      regime: "Aliquota Plena + Imposto Seletivo",
      aliquotaEfetiva: "26,5% + IS variavel",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: true,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, arts. 393-421",
      alertas: ["IS incide sobre veiculos, embarcacoes esportivas e aeronaves.", "Veiculos eletricos podem ter IS menor ou isencao (a definir por decreto)."],
      oportunidades: ["Veiculos eletricos e hibridos podem ter vantagem competitiva tributaria."],
    },
    tabaco: {
      regime: "Aliquota Plena + Imposto Seletivo",
      aliquotaEfetiva: "26,5% + IS elevado",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: true,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, arts. 393-421",
      alertas: ["Imposto Seletivo maximo incide sobre tabaco. Carga tributaria total sera muito elevada.", "Possibilidade de regime monofasico para o IS do tabaco."],
      oportunidades: [],
    },
    minerio: {
      regime: "Aliquota Plena + Imposto Seletivo (0,25% a 1%)",
      aliquotaEfetiva: "26,5% + IS 0,25% a 1%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: true,
      splitPayment: "Aplicavel",
      referenciaLegal: "LC 214/2025, arts. 393-421",
      alertas: ["IS sobre extracao mineral e relativamente baixo (0,25% a 1%) mas incide sobre exportacoes tambem."],
      oportunidades: ["Creditos integrais sobre toda a cadeia de insumos da extracao."],
    },
    livro_cultural: {
      regime: "Aliquota zero (livros) / Reducao 60% (cultural)",
      aliquotaEfetiva: "0% (livros) / ~10,6% (servicos culturais)",
      reducao: "100% (livros) / 60% (cultural)",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Isento (livros) / Reduzido (cultural)",
      referenciaLegal: "LC 214/2025; CF art. 150, VI, d",
      alertas: ["Imunidade constitucional para livros, jornais, periodicos e papel de impressao."],
      oportunidades: ["Livros fisicos e digitais com aliquota ZERO. Creditos sobre insumos mantidos.", "Producoes artisticas e culturais com 60% de reducao."],
    },
    educacao: {
      regime: "Reducao de 60%",
      aliquotaEfetiva: "~10,6%",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025, art. 274",
      alertas: ["Aplicavel a educacao regular (infantil, fundamental, medio, superior, tecnico)."],
      oportunidades: ["Mensalidades escolares com carga tributaria muito menor que a plena.", "PROUNI e entidades sem fins lucrativos podem ter imunidade total."],
    },
    saude_servico: {
      regime: "Reducao de 60%",
      aliquotaEfetiva: "~10,6%",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025, art. 275",
      alertas: ["Aplicavel a hospitais, clinicas, laboratorios, consultorios."],
      oportunidades: ["Servicos de saude com aliquota significativamente menor que servicos gerais.", "Creditos sobre equipamentos medicos e insumos hospitalares."],
    },
    transporte_coletivo: {
      regime: "Reducao de 60%",
      aliquotaEfetiva: "~10,6%",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025, art. 280",
      alertas: ["Aplicavel a transporte urbano, metropolitano e intermunicipal de passageiros."],
      oportunidades: ["Tarifa com componente tributario menor, favorecendo acessibilidade."],
    },
    transporte_carga: {
      regime: "Aliquota Plena",
      aliquotaEfetiva: "26,5%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, art. 12",
      alertas: ["Transporte de carga nao tem reducao especial. Aliquota plena de 26,5%."],
      oportunidades: ["Creditos integrais sobre combustivel, pedagio, manutencao de frota.", "Clientes B2B tomam credito integral sobre o frete."],
    },
    imobiliario: {
      regime: "Regime Especifico com Redutor Social",
      aliquotaEfetiva: "Variavel (redutor de R$ 100.000 a R$ 400.000)",
      reducao: "Regime especifico",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Regime especifico",
      referenciaLegal: "LC 214/2025, arts. 257-263",
      alertas: ["Base de calculo com redutor social. Imoveis populares podem ter carga muito reduzida.", "Locacao de imoveis tem regime diferenciado com base reduzida."],
      oportunidades: ["Redutor social beneficia imoveis de menor valor.", "Incorporadoras podem tomar creditos sobre insumos da construcao."],
    },
    construcao: {
      regime: "Aliquota Plena",
      aliquotaEfetiva: "26,5%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, art. 12",
      alertas: ["Materiais de construcao sem reducao especial."],
      oportunidades: ["Creditos integrais em toda a cadeia produtiva. Oportunidade de eficiencia tributaria."],
    },
    financeiro: {
      regime: "Regime Especifico Cumulativo",
      aliquotaEfetiva: "Aliquota especifica (variavel por operacao)",
      reducao: "Regime cumulativo",
      creditoDisponivel: false,
      impostoSeletivo: false,
      splitPayment: "Regime especifico",
      referenciaLegal: "LC 214/2025, arts. 264-268",
      alertas: ["Servicos financeiros e seguros seguem regime cumulativo: NAO geram creditos para clientes.", "Base de calculo diferenciada (spread bancario, premio de seguro)."],
      oportunidades: ["Simplificacao: sem obrigacao de detalhar creditos por operacao."],
    },
    tecnologia: {
      regime: "Aliquota Plena",
      aliquotaEfetiva: "26,5%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, art. 12",
      alertas: ["Software e SaaS nao tem reducao especial. Migram de ISS (2-5%) para 26,5%.", "ATENCAO: Empresas de TI que pagavam ISS terao aumento expressivo de carga tributaria."],
      oportunidades: ["Creditos sobre hardware, infraestrutura, cloud e insumos de TI.", "Clientes B2B tomam credito integral — vantagem na precificacao."],
    },
    servico_profissional: {
      regime: "Reducao de 30%",
      aliquotaEfetiva: "~18,55%",
      reducao: "30%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025; LC 227/2026 (18 categorias)",
      alertas: ["Reducao de 30% para 18 categorias de profissionais liberais regulamentados.", "Mesmo com reducao, a carga sera maior que o ISS atual (2-5%) para a maioria."],
      oportunidades: ["Creditos sobre aluguel de escritorio, equipamentos, software de gestao.", "30% de reducao na aliquota e melhor do que a aliquota plena de servicos gerais."],
    },
    servico_geral: {
      regime: "Aliquota Plena",
      aliquotaEfetiva: "26,5%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, art. 12",
      alertas: ["Servicos que pagavam ISS (2-5%) terao aumento significativo de carga tributaria.", "Este e o maior impacto da reforma para o setor de servicos."],
      oportunidades: ["Creditos sobre insumos, aluguel PJ, tecnologia, frete. Otimize ao maximo.", "Em operacoes B2B, o cliente toma credito integral — ajuste a precificacao."],
    },
    hotelaria: {
      regime: "Reducao de 60%",
      aliquotaEfetiva: "~10,6%",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025",
      alertas: ["Hospedagem e servicos turisticos com 60% de reducao na aliquota."],
      oportunidades: ["Competitividade do turismo nacional frente a destinos internacionais.", "Creditos sobre reforma, equipamentos, insumos do hotel."],
    },
    restaurante: {
      regime: "Reducao de 60%",
      aliquotaEfetiva: "~10,6%",
      reducao: "60%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel sobre aliquota reduzida",
      referenciaLegal: "LC 214/2025",
      alertas: ["Restaurantes e bares com 60% de reducao na aliquota."],
      oportunidades: ["Aliquota efetiva significativamente menor que servicos gerais.", "Creditos sobre insumos alimenticios, equipamentos de cozinha."],
    },
    produto_industrial: {
      regime: "Aliquota Plena",
      aliquotaEfetiva: "26,5%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel — retencao integral",
      referenciaLegal: "LC 214/2025, art. 12",
      alertas: ["Aliquota plena, porem com creditos amplos em toda a cadeia produtiva."],
      oportunidades: ["Industria e o setor mais beneficiado pela nao-cumulatividade plena.", "Creditos sobre energia, insumos, frete, equipamentos, manutencao."],
    },
    produto_varejo: {
      regime: "Aliquota Plena",
      aliquotaEfetiva: "26,5%",
      reducao: "0%",
      creditoDisponivel: true,
      impostoSeletivo: false,
      splitPayment: "Aplicavel — retencao integral no cartao/PIX",
      referenciaLegal: "LC 214/2025, art. 12; arts. 50-55 (Split Payment)",
      alertas: ["Split Payment retira o imposto automaticamente na venda por cartao/PIX.", "Fluxo de caixa impactado: voce recebe o valor liquido (sem imposto)."],
      oportunidades: ["Creditos sobre estoque, frete, aluguel, tecnologia."],
    },
  };

  return impacts[category] || {
    regime: "Aliquota Plena",
    aliquotaEfetiva: "26,5%",
    reducao: "0%",
    creditoDisponivel: true,
    impostoSeletivo: false,
    splitPayment: "Aplicavel",
    referenciaLegal: "LC 214/2025, art. 12",
    alertas: [],
    oportunidades: [],
  };
}

const emptyProduct = (): Product => ({
  id: Date.now() + Math.random(),
  name: "",
  category: "",
  revenuePercent: "",
});

export default function ProductAnalysis() {
  const { data } = useAppStore();
  const [products, setProducts] = useState<Product[]>([emptyProduct()]);

  const addProduct = () => {
    if (products.length < 10) {
      setProducts([...products, emptyProduct()]);
    }
  };

  const removeProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const analyzedProducts = products.filter((p) => p.name && p.category);

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-3 uppercase tracking-tight flex items-center gap-3" data-testid="text-product-title">
            <Package className="h-8 w-8 text-primary" />
            Analise de Produtos & Servicos
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Insira os seus 10 principais produtos ou servicos e descubra como cada um sera tributado no novo sistema IBS/CBS.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto py-12 px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Seus Produtos / Servicos
                </CardTitle>
                <CardDescription>
                  Cadastre ate 10 itens que representam a maior parte do seu faturamento. 
                  Para cada um, selecione a categoria tributaria mais adequada.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.map((product, index) => (
                  <div key={product.id} className="p-4 border rounded-lg space-y-3 bg-muted/10" data-testid={`product-entry-${index}`}>
                    <div className="flex items-center justify-between">
                      <Label className="font-bold text-sm">Produto {index + 1}</Label>
                      {products.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          data-testid={`button-remove-product-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Nome do produto ou servico"
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                      data-testid={`input-product-name-${index}`}
                    />
                    <Select
                      value={product.category}
                      onValueChange={(val) => updateProduct(product.id, "category", val)}
                      data-testid={`select-product-category-${index}`}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria tributaria" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="% do faturamento (ex: 25)"
                      value={product.revenuePercent}
                      onChange={(e) => updateProduct(product.id, "revenuePercent", e.target.value.replace(/[^0-9.]/g, ""))}
                      data-testid={`input-product-revenue-${index}`}
                    />
                  </div>
                ))}

                {products.length < 10 && (
                  <Button
                    variant="outline"
                    onClick={addProduct}
                    className="w-full gap-2"
                    data-testid="button-add-product"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Produto ({products.length}/10)
                  </Button>
                )}
              </CardContent>
            </Card>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-700">
                A analise e baseada nas categorias tributarias da LC 214/2025. 
                Para enquadramento preciso do NCM/NBS dos seus produtos, 
                consulte seu contador ou assessor tributario.
              </AlertDescription>
            </Alert>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {analyzedProducts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
                  <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-bold text-muted-foreground mb-2">Nenhum produto analisado</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Preencha o nome e a categoria dos seus produtos ao lado para ver a analise detalhada do impacto tributario de cada um.
                  </p>
                </CardContent>
              </Card>
            ) : (
              analyzedProducts.map((product, index) => {
                const impact = getProductImpact(product.category);
                const isSeletivo = impact.impostoSeletivo;
                const isReduced = parseFloat(impact.reducao) > 0 || impact.reducao.includes("100");
                const isZero = impact.aliquotaEfetiva.includes("0%") && !impact.aliquotaEfetiva.includes("26");

                return (
                  <Card key={product.id} className={`shadow-sm border-l-4 ${isSeletivo ? "border-l-red-500" : isZero ? "border-l-green-500" : isReduced ? "border-l-blue-500" : "border-l-amber-500"}`} data-testid={`card-product-impact-${index}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            {PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label}
                            {product.revenuePercent && (
                              <Badge variant="secondary" className="text-[10px]">{product.revenuePercent}% do faturamento</Badge>
                            )}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={isSeletivo ? "destructive" : isZero ? "default" : "secondary"}
                          className={isZero && !isSeletivo ? "bg-green-100 text-green-800" : ""}
                        >
                          {impact.regime.length > 30 ? impact.regime.substring(0, 30) + "..." : impact.regime}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Aliquota Efetiva</p>
                          <p className={`text-sm font-bold ${isSeletivo ? "text-red-600" : isZero ? "text-green-600" : ""}`}>{impact.aliquotaEfetiva}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Reducao</p>
                          <p className="text-sm font-bold">{impact.reducao}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Credito IBS/CBS</p>
                          <p className={`text-sm font-bold ${impact.creditoDisponivel ? "text-green-600" : "text-red-600"}`}>
                            {impact.creditoDisponivel ? "Disponivel" : "Indisponivel"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-muted-foreground">Split Payment:</span>
                          <span>{impact.splitPayment}</span>
                        </div>
                        {impact.impostoSeletivo && (
                          <div className="flex items-center gap-2 text-xs text-red-600 font-bold">
                            <ShieldAlert className="h-3 w-3" />
                            Sujeito a Imposto Seletivo adicional
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="font-bold">Ref. Legal:</span>
                          <span>{impact.referenciaLegal}</span>
                        </div>
                      </div>

                      {impact.alertas.length > 0 && (
                        <div className="space-y-1">
                          {impact.alertas.map((alerta, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded p-2">
                              <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                              <span>{alerta}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {impact.oportunidades.length > 0 && (
                        <div className="space-y-1">
                          {impact.oportunidades.map((op, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-green-700 bg-green-50 rounded p-2">
                              <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" />
                              <span>{op}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}

            {analyzedProducts.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Resumo do Portfólio
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{analyzedProducts.length}</div>
                      <div className="text-[10px] text-muted-foreground">Produtos Analisados</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {analyzedProducts.filter((p) => {
                          const imp = getProductImpact(p.category);
                          return parseFloat(imp.reducao) > 0 || imp.reducao.includes("100");
                        }).length}
                      </div>
                      <div className="text-[10px] text-muted-foreground">Com Reducao</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">
                        {analyzedProducts.filter((p) => {
                          const imp = getProductImpact(p.category);
                          return imp.aliquotaEfetiva === "26,5%";
                        }).length}
                      </div>
                      <div className="text-[10px] text-muted-foreground">Aliquota Plena</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {analyzedProducts.filter((p) => getProductImpact(p.category).impostoSeletivo).length}
                      </div>
                      <div className="text-[10px] text-muted-foreground">Imposto Seletivo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-start pt-8 border-t mt-8">
          <Link href="/inicio">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
