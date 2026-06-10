import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { useAppStore } from "@/lib/store";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Lock, Loader2, Check, CheckCircle2 } from "lucide-react";

// ─── Constantes ──────────────────────────────────────────────────────────────

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const ANNUAL_TOTAL = 1164;
const INSTALLMENT_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  const perMonth = (ANNUAL_TOTAL / n).toFixed(2).replace(".", ",");
  const suffix = n === 1 ? " (à vista)" : "";
  return { n, label: `${n}x de R$ ${perMonth}${suffix}` };
});

const SUMMARY_BENEFITS = [
  "Diagnósticos ilimitados para seus clientes",
  "Plano de ação completo personalizado",
  'Acesso completo à base "O Que Muda?"',
  "Suporte por e-mail",
];

// ─── Funções de máscara (puras, sem biblioteca) ───────────────────────────────

function formatCardNumber(v: string): string {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatDocument(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCep(v: string): string {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

function formatExpiry(v: string): string {
  return v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Checkout() {
  const { user, checkAuth } = useAppStore();
  const [, setLocation] = useLocation();
  const search = useSearch();

  const planParam = new URLSearchParams(search).get("plan");
  const isValidPlan = planParam === "monthly" || planParam === "annual";
  const plan = planParam as "monthly" | "annual" | null;

  // ── Form state — todos os hooks chamados incondicionalmente ─────────────────
  const [holderName,   setHolderName]   = useState("");
  const [document,     setDocument]     = useState("");
  const [phone,        setPhone]        = useState("");
  const [cardNumber,   setCardNumber]   = useState("");
  const [expiry,       setExpiry]       = useState("");
  const [cvv,          setCvv]          = useState("");
  const [cep,          setCep]          = useState("");
  const [street,       setStreet]       = useState("");
  const [addrNumber,   setAddrNumber]   = useState("");
  const [complement,   setComplement]   = useState("");
  const [city,         setCity]         = useState("");
  const [uf,           setUf]           = useState("");
  const [installments, setInstallments] = useState("1");
  const [error,        setError]        = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success,      setSuccess]      = useState(false);

  // ── ViaCEP ───────────────────────────────────────────────────────────────────
  const [cepLoading,   setCepLoading]   = useState(false);
  const lastFetchedCep = useRef<string>("");
  const addrNumberRef  = useRef<HTMLInputElement>(null);
  const isMounted      = useRef(true);
  useEffect(() => () => { isMounted.current = false; }, []);

  const lookupCep = async (cepDigits: string) => {
    if (cepDigits.length !== 8 || cepDigits === lastFetchedCep.current) return;
    lastFetchedCep.current = cepDigits;
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 5000);
    setCepLoading(true);
    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${cepDigits}/json/`,
        { signal: controller.signal }
      );
      if (!isMounted.current) return;
      if (!res.ok) return;
      const data = await res.json();
      if (data.erro) return;
      if (data.logradouro) setStreet(prev => prev === "" ? data.logradouro : prev);
      if (data.localidade) setCity(prev   => prev === "" ? data.localidade : prev);
      if (data.uf)         setUf(prev     => prev === "" ? data.uf         : prev);
      setTimeout(() => addrNumberRef.current?.focus(), 50);
    } catch (err: any) {
      lastFetchedCep.current = "";  // permite re-busca se a rede falhou
      if (err?.name !== "AbortError") console.warn("[ViaCEP] erro na busca:", err);
    } finally {
      clearTimeout(tid);
      if (isMounted.current) setCepLoading(false);
    }
  };

  // Guards via useEffect (evita chamar setLocation durante render)
  useEffect(() => {
    if (!isValidPlan)                    setLocation("/planos");
    else if (user?.plan === "annual")    setLocation("/inicio");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isValidPlan || user?.plan === "annual") return null;

  const isAnnual = plan === "annual";

  // ── Validação client-side ────────────────────────────────────────────────────
  const validateForm = (): string | null => {
    const docDigits   = document.replace(/\D/g, "");
    const phoneDigits = phone.replace(/\D/g, "");
    const cardDigits  = cardNumber.replace(/\D/g, "");
    const cepDigits   = cep.replace(/\D/g, "");

    if (holderName.trim().length < 2)
      return "Informe o nome do titular como está no cartão";
    if (docDigits.length !== 11 && docDigits.length !== 14)
      return "CPF ou CNPJ inválido";
    if (phoneDigits.length !== 10 && phoneDigits.length !== 11)
      return "Telefone inválido";
    if (cardDigits.length < 13 || cardDigits.length > 16)
      return "Número de cartão inválido";

    const [mmStr, yyStr] = expiry.split("/");
    const mm = parseInt(mmStr, 10);
    const yy = parseInt(yyStr, 10);
    if (!mmStr || !yyStr || isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12)
      return "Validade inválida";
    const expDate = new Date(2000 + yy, mm - 1, 1);
    const today   = new Date();
    if (expDate < new Date(today.getFullYear(), today.getMonth(), 1))
      return "Cartão vencido";

    if (cvv.length < 3 || cvv.length > 4)  return "CVV inválido";
    if (cepDigits.length !== 8)             return "CEP inválido";
    if (!street.trim())                     return "Informe o logradouro";
    if (!addrNumber.trim())                 return "Informe o número do endereço";
    if (!city.trim())                       return "Informe a cidade";
    if (!uf)                                return "Selecione a UF";
    return null;
  };

  // ── handleSubmit real ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    const cardDigits  = cardNumber.replace(/\D/g, "");
    const docDigits   = document.replace(/\D/g, "");
    const cepDigits   = cep.replace(/\D/g, "");
    const phoneDigits = phone.replace(/\D/g, "");
    const [mmStr, yyStr] = expiry.split("/");
    const expMonth = parseInt(mmStr, 10);
    const expYear  = 2000 + parseInt(yyStr, 10);

    try {
      // ── Etapa 1: Tokenização (timeout 15s) ───────────────────────────────────
      const tokenController = new AbortController();
      const tokenTid = setTimeout(() => tokenController.abort(), 15_000);
      let tokenId: string;
      try {
        const tokenRes = await fetch(
          `https://api.pagar.me/core/v5/tokens?appId=${import.meta.env.VITE_PAGARME_PUBLIC_KEY}`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            signal:  tokenController.signal,
            body: JSON.stringify({
              type: "card",
              card: {
                number:          cardDigits,
                holder_name:     holderName,
                holder_document: docDigits,
                exp_month:       expMonth,
                exp_year:        expYear,
                cvv,
              },
            }),
          }
        );
        clearTimeout(tokenTid);
        if (!tokenRes.ok) throw new Error("token_failed");
        const tokenData = await tokenRes.json();
        tokenId = tokenData.id;
      } catch {
        setError("Não foi possível validar o cartão. Verifique os dados e tente novamente.");
        return;
      }

      // ── Etapa 2: Submissão ao backend (timeout 60s) ──────────────────────────
      const subController = new AbortController();
      const subTid = setTimeout(() => subController.abort(), 60_000);
      let subRes: Response;
      try {
        subRes = await fetch("/api/subscriptions/create", {
          method:      "POST",
          headers:     { "Content-Type": "application/json" },
          credentials: "include",
          signal:      subController.signal,
          body: JSON.stringify({
            plan,
            card_token:   tokenId,
            installments: isAnnual ? Number(installments) : 1,
            holder_name:  holderName,
            document:     docDigits,
            address: {
              line_1:   `${street}, ${addrNumber}`,
              line_2:   complement || undefined,
              zip_code: cepDigits,
              city,
              state:    uf,
              country:  "BR",
            },
            phone: {
              area_code: phoneDigits.slice(0, 2),
              number:    phoneDigits.slice(2),
            },
          }),
        });
        clearTimeout(subTid);
      } catch {
        setError("A conexão demorou demais. Verifique sua internet e tente novamente.");
        return;
      }

      // ── Etapa 3: Tratar resposta ─────────────────────────────────────────────
      if (subRes.status === 201) {
        await checkAuth();
        setSuccess(true);
        return;
      }

      let body: any = {};
      try { body = await subRes.json(); } catch {}

      if (subRes.status === 402) {
        setError(body.message || "Pagamento recusado. Verifique os dados do cartão.");
      } else if (subRes.status === 409) {
        setError("Você já possui uma assinatura ativa.");
        setTimeout(() => setLocation("/inicio"), 3000);
      } else if (subRes.status === 400) {
        setError("Verifique os dados informados e tente novamente.");
      } else {
        setError(body.message || "Não foi possível processar o pagamento. Tente novamente em instantes.");
      }
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const iC = "h-11 text-sm";

  if (success) {
    return (
      <MainLayout>
        <div className="max-w-screen-lg mx-auto px-4 md:px-8 py-20 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md border-green-200">
            <CardContent className="p-10 flex flex-col items-center gap-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div>
                <h2 className="font-bold font-heading text-2xl mb-2">
                  Assinatura confirmada!
                </h2>
                <p className="text-muted-foreground">
                  Bem-vindo ao {isAnnual ? "Plano Anual" : "Plano Mensal"}. Você já tem acesso
                  ilimitado à plataforma.
                </p>
              </div>
              <button
                onClick={() => setLocation("/inicio")}
                data-testid="button-checkout-success"
                className="w-full h-12 flex items-center justify-center rounded-xl
                           text-white font-bold text-sm uppercase tracking-widest
                           transition-all duration-200
                           shadow-[0_6px_24px_-4px_rgba(249,115,22,0.45)]
                           hover:shadow-[0_10px_32px_-4px_rgba(249,115,22,0.60)]
                           hover:-translate-y-px"
                style={{ backgroundColor: "#f97316" }}
              >
                Começar a usar
              </button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-screen-lg mx-auto px-4 md:px-8 py-10">

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="font-bold font-heading text-2xl md:text-3xl tracking-tight">
            Finalizar assinatura
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAnnual
              ? "Plano Anual — R$ 1.164,00/ano (ou R$ 97/mês em até 12x)"
              : "Plano Mensal — R$ 147,00/mês"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ────────── COLUNA ESQUERDA — Formulário ────────────────────── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* Seção 1 — Dados do titular */}
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-base border-b pb-2">Dados do titular</h2>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="holderName">Nome do titular (como no cartão)</Label>
                <Input
                  id="holderName"
                  placeholder="NOME COMO NO CARTÃO"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                  autoComplete="cc-name"
                  className={iC}
                  data-testid="input-holder-name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="document">CPF ou CNPJ</Label>
                  <Input
                    id="document"
                    placeholder="000.000.000-00"
                    value={document}
                    onChange={(e) => setDocument(formatDocument(e.target.value))}
                    inputMode="numeric"
                    className={iC}
                    data-testid="input-document"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Celular com DDD</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    inputMode="tel"
                    className={iC}
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </div>

            {/* Seção 2 — Cartão de crédito */}
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-base border-b pb-2">Cartão de crédito</h2>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cardNumber">Número do cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  className={iC}
                  data-testid="input-card-number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="expiry">Validade (MM/AA)</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    className={iC}
                    data-testid="input-expiry"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="000"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    className={iC}
                    data-testid="input-cvv"
                  />
                </div>
              </div>
            </div>

            {/* Seção 3 — Endereço de cobrança */}
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-base border-b pb-2">Endereço de cobrança</h2>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => {
                      const formatted = formatCep(e.target.value);
                      setCep(formatted);
                      const digits = formatted.replace(/\D/g, "");
                      if (digits.length === 8) lookupCep(digits);
                    }}
                    inputMode="numeric"
                    className={iC}
                    data-testid="input-cep"
                  />
                  {cepLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground pointer-events-none" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_120px] gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="street">Logradouro</Label>
                  <Input
                    id="street"
                    placeholder="Rua, Av., Alameda..."
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={iC}
                    data-testid="input-street"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="addrNumber">Número</Label>
                  <Input
                    ref={addrNumberRef}
                    id="addrNumber"
                    placeholder="123"
                    value={addrNumber}
                    onChange={(e) => setAddrNumber(e.target.value)}
                    className={iC}
                    data-testid="input-address-number"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="complement">
                  Complemento{" "}
                  <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
                </Label>
                <Input
                  id="complement"
                  placeholder="Apto, sala, bloco..."
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className={iC}
                  data-testid="input-complement"
                />
              </div>

              <div className="grid grid-cols-[1fr_100px] gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="São Paulo"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={iC}
                    data-testid="input-city"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="uf">UF</Label>
                  <Select value={uf} onValueChange={setUf}>
                    <SelectTrigger id="uf" className={iC} data-testid="select-uf">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Seção 4 — Parcelamento (apenas anual) */}
            {isAnnual && (
              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-base border-b pb-2">Parcelamento</h2>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="installments">Parcelas no cartão</Label>
                  <Select value={installments} onValueChange={setInstallments}>
                    <SelectTrigger id="installments" className={iC} data-testid="select-installments">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTALLMENT_OPTIONS.map(({ n, label }) => (
                        <SelectItem key={n} value={String(n)}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-checkout-submit"
              className="w-full h-14 flex items-center justify-center gap-2 rounded-xl
                         text-white font-bold text-sm uppercase tracking-widest
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-[0_6px_24px_-4px_rgba(249,115,22,0.45)]
                         hover:shadow-[0_10px_32px_-4px_rgba(249,115,22,0.60)]
                         hover:-translate-y-px active:translate-y-0"
              style={{ backgroundColor: "#f97316" }}
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processando...</>
              ) : (
                <><Lock className="h-4 w-4" /> Confirmar Assinatura</>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center -mt-4">
              Ao confirmar, você concorda com os Termos de Uso e Política de Privacidade.
            </p>
          </form>

          {/* ────────── COLUNA DIREITA — Resumo do pedido ───────────────── */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-6">
            <Card className="border-2 border-[#f97316]/30">
              <CardContent className="p-6 flex flex-col gap-5">

                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
                    {isAnnual ? "Plano Anual" : "Plano Mensal"}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">
                      R$ {isAnnual ? "97" : "147"}
                    </span>
                    <span className="text-sm text-muted-foreground mb-0.5">/mês</span>
                  </div>
                  {isAnnual && (
                    <>
                      <p className="text-sm text-muted-foreground mt-0.5">ou R$ 1.164,00 à vista</p>
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded px-2 py-1 mt-2">
                        Economia de R$ 600/ano vs mensal
                      </span>
                    </>
                  )}
                </div>

                <div className="h-px bg-border" />

                <ul className="space-y-2.5">
                  {SUMMARY_BENEFITS.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                  <span>Pagamento processado com segurança pelo Pagar.me</span>
                </div>

                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 leading-relaxed">
                  {isAnnual
                    ? "Sem renovação automática — você decide se quer renovar após 12 meses."
                    : "Renovação automática mensal. Cancele quando quiser pelo painel."}
                </p>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
