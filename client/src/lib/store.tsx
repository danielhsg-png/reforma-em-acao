import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiRequest } from "./queryClient";

interface AuthUser {
  id: string;
  email: string;
}

interface AppState {
  companyName: string;
  nomeFantasia: string;
  cnpj: string;
  cnaeCode: string;
  estado: string;
  municipio: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  sector: string;
  regime: string;
  annualRevenue: string;
  establishmentCount: string;
  employeeCount: string;
  businessType: string;
  geographicScope: string;
  operations: string;
  salesChannels: string[];
  salesStates: string[];
  multiMunicipality: string;
  hasLongTermContracts: string;
  priceSensitivity: string;
  hasExports: string;
  hasMarketplace: string;
  hasGovernmentContracts: string;
  supplierCount: string;
  supplierRegimeType: string;
  simplesSupplierPercent: string;
  hasRegularNF: string;
  mainExpenses: string[];
  hasFrequentReturns: string;
  hasNFErrors: string;
  hasImports: string;
  costStructure: string;
  purchaseProfile: string;
  erpSystem: string;
  nfeEmission: string;
  fiscalDocTypes: string[];
  invoiceVolume: string;
  erpIntegratedFinance: string;
  erpVendorReformPlan: string;
  catalogStandardized: string;
  internalFiscalResponsible: string;
  hasEcommerceIntegration: string;
  paymentMethods: string[];
  avgPaymentTerm: string;
  tightWorkingCapital: string;
  easePriceAdjustment: string;
  profitMargin: string;
  monthlyRevenue: string;
  knowsMarginByProduct: string;
  splitPaymentAware: string;
  priceRevisionClause: string;
  taxResponsible: string;
  internalERPResponsible: string;
  managementAwareOfReform: string;
  preparationStarted: string;
  hadInternalTraining: string;
  selfAssessedMaturity: string;
  mainConcern: string;
  specialRegimes: string[];
  riskScore: number;
}

interface AppContextType {
  user: AuthUser | null;
  authLoading: boolean;
  data: AppState;
  companyId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateData: (key: keyof AppState, value: any) => void;
  saveCompany: () => Promise<string>;
  loadCompany: (id: string) => Promise<void>;
  updateCompanyOnServer: () => Promise<void>;
  resetData: () => void;
}

const defaultState: AppState = {
  companyName: "Minha Empresa",
  nomeFantasia: "",
  cnpj: "",
  cnaeCode: "",
  estado: "",
  municipio: "",
  contactName: "",
  contactRole: "",
  contactEmail: "",
  contactPhone: "",
  sector: "varejo",
  regime: "lucro_presumido",
  annualRevenue: "",
  establishmentCount: "1",
  employeeCount: "1_10",
  businessType: "ambos",
  geographicScope: "local",
  operations: "b2c",
  salesChannels: [],
  salesStates: [],
  multiMunicipality: "nao",
  hasLongTermContracts: "nao",
  priceSensitivity: "mercado",
  hasExports: "nao",
  hasMarketplace: "nao",
  hasGovernmentContracts: "nao",
  supplierCount: "ate_20",
  supplierRegimeType: "misto",
  simplesSupplierPercent: "ate_30",
  hasRegularNF: "sim",
  mainExpenses: [],
  hasFrequentReturns: "nao",
  hasNFErrors: "raramente",
  hasImports: "nao",
  costStructure: "mercadorias",
  purchaseProfile: "mixed_suppliers",
  erpSystem: "nenhum",
  nfeEmission: "contador",
  fiscalDocTypes: [],
  invoiceVolume: "ate_100",
  erpIntegratedFinance: "nao",
  erpVendorReformPlan: "nao_sei",
  catalogStandardized: "parcial",
  internalFiscalResponsible: "nao",
  hasEcommerceIntegration: "nao",
  paymentMethods: [],
  avgPaymentTerm: "ate_30",
  tightWorkingCapital: "nao",
  easePriceAdjustment: "dificil",
  profitMargin: "10_20",
  monthlyRevenue: "100k_500k",
  knowsMarginByProduct: "nao",
  splitPaymentAware: "nao",
  priceRevisionClause: "nao_sei",
  taxResponsible: "contador_externo",
  internalERPResponsible: "nao",
  managementAwareOfReform: "parcialmente",
  preparationStarted: "nao",
  hadInternalTraining: "nao",
  selfAssessedMaturity: "baixa",
  mainConcern: "custos",
  specialRegimes: [],
  riskScore: 0,
};

const STORAGE_KEY = "reforma_company_id";

const AppContext = createContext<AppContextType | undefined>(undefined);

function stateToPayload(data: AppState) {
  return {
    companyName: data.companyName,
    cnpj: data.cnpj,
    sector: data.sector,
    regime: data.regime,
    operations: data.operations,
    purchaseProfile: data.supplierRegimeType === "simples_maioria" ? "simples_suppliers" : data.supplierRegimeType === "regular_maioria" ? "general_suppliers" : "mixed_suppliers",
    salesStates: data.salesStates,
    costStructure: data.mainExpenses.includes("folha") ? "folha" : data.mainExpenses.includes("mercadorias") ? "mercadorias" : data.costStructure,
    riskScore: data.riskScore,
    monthlyRevenue: data.annualRevenue || data.monthlyRevenue,
    employeeCount: data.employeeCount,
    profitMargin: data.profitMargin,
    erpSystem: data.erpSystem,
    nfeEmission: data.nfeEmission,
    invoiceVolume: data.invoiceVolume,
    supplierCount: data.supplierCount,
    simplesSupplierPercent: data.simplesSupplierPercent,
    hasLongTermContracts: data.hasLongTermContracts,
    priceRevisionClause: data.priceRevisionClause,
    taxResponsible: data.taxResponsible,
    splitPaymentAware: data.splitPaymentAware,
    mainConcern: data.mainConcern,
    specialRegimes: data.specialRegimes,
    extendedData: {
      nomeFantasia: data.nomeFantasia,
      cnaeCode: data.cnaeCode,
      estado: data.estado,
      municipio: data.municipio,
      contactName: data.contactName,
      contactRole: data.contactRole,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      annualRevenue: data.annualRevenue,
      establishmentCount: data.establishmentCount,
      businessType: data.businessType,
      geographicScope: data.geographicScope,
      salesChannels: data.salesChannels,
      multiMunicipality: data.multiMunicipality,
      priceSensitivity: data.priceSensitivity,
      hasExports: data.hasExports,
      hasMarketplace: data.hasMarketplace,
      hasGovernmentContracts: data.hasGovernmentContracts,
      supplierRegimeType: data.supplierRegimeType,
      hasRegularNF: data.hasRegularNF,
      mainExpenses: data.mainExpenses,
      hasFrequentReturns: data.hasFrequentReturns,
      hasNFErrors: data.hasNFErrors,
      hasImports: data.hasImports,
      fiscalDocTypes: data.fiscalDocTypes,
      erpIntegratedFinance: data.erpIntegratedFinance,
      erpVendorReformPlan: data.erpVendorReformPlan,
      catalogStandardized: data.catalogStandardized,
      internalFiscalResponsible: data.internalFiscalResponsible,
      hasEcommerceIntegration: data.hasEcommerceIntegration,
      paymentMethods: data.paymentMethods,
      avgPaymentTerm: data.avgPaymentTerm,
      tightWorkingCapital: data.tightWorkingCapital,
      easePriceAdjustment: data.easePriceAdjustment,
      knowsMarginByProduct: data.knowsMarginByProduct,
      internalERPResponsible: data.internalERPResponsible,
      managementAwareOfReform: data.managementAwareOfReform,
      preparationStarted: data.preparationStarted,
      hadInternalTraining: data.hadInternalTraining,
      selfAssessedMaturity: data.selfAssessedMaturity,
    },
  };
}

function companyToState(company: any): AppState {
  const ext = company.extendedData || {};
  return {
    companyName: company.companyName || defaultState.companyName,
    nomeFantasia: ext.nomeFantasia || "",
    cnpj: company.cnpj || "",
    cnaeCode: ext.cnaeCode || "",
    estado: ext.estado || "",
    municipio: ext.municipio || "",
    contactName: ext.contactName || "",
    contactRole: ext.contactRole || "",
    contactEmail: ext.contactEmail || "",
    contactPhone: ext.contactPhone || "",
    sector: company.sector || defaultState.sector,
    regime: company.regime || defaultState.regime,
    annualRevenue: ext.annualRevenue || company.monthlyRevenue || "",
    establishmentCount: ext.establishmentCount || "1",
    employeeCount: company.employeeCount || defaultState.employeeCount,
    businessType: ext.businessType || "ambos",
    geographicScope: ext.geographicScope || "local",
    operations: company.operations || defaultState.operations,
    salesChannels: ext.salesChannels || [],
    salesStates: company.salesStates || [],
    multiMunicipality: ext.multiMunicipality || "nao",
    hasLongTermContracts: company.hasLongTermContracts || defaultState.hasLongTermContracts,
    priceSensitivity: ext.priceSensitivity || "mercado",
    hasExports: ext.hasExports || "nao",
    hasMarketplace: ext.hasMarketplace || "nao",
    hasGovernmentContracts: ext.hasGovernmentContracts || "nao",
    supplierCount: company.supplierCount || defaultState.supplierCount,
    supplierRegimeType: ext.supplierRegimeType || "misto",
    simplesSupplierPercent: company.simplesSupplierPercent || defaultState.simplesSupplierPercent,
    hasRegularNF: ext.hasRegularNF || "sim",
    mainExpenses: ext.mainExpenses || [],
    hasFrequentReturns: ext.hasFrequentReturns || "nao",
    hasNFErrors: ext.hasNFErrors || "raramente",
    hasImports: ext.hasImports || "nao",
    costStructure: company.costStructure || defaultState.costStructure,
    purchaseProfile: company.purchaseProfile || defaultState.purchaseProfile,
    erpSystem: company.erpSystem || defaultState.erpSystem,
    nfeEmission: company.nfeEmission || defaultState.nfeEmission,
    fiscalDocTypes: ext.fiscalDocTypes || [],
    invoiceVolume: company.invoiceVolume || defaultState.invoiceVolume,
    erpIntegratedFinance: ext.erpIntegratedFinance || "nao",
    erpVendorReformPlan: ext.erpVendorReformPlan || "nao_sei",
    catalogStandardized: ext.catalogStandardized || "parcial",
    internalFiscalResponsible: ext.internalFiscalResponsible || "nao",
    hasEcommerceIntegration: ext.hasEcommerceIntegration || "nao",
    paymentMethods: ext.paymentMethods || [],
    avgPaymentTerm: ext.avgPaymentTerm || "ate_30",
    tightWorkingCapital: ext.tightWorkingCapital || "nao",
    easePriceAdjustment: ext.easePriceAdjustment || "dificil",
    profitMargin: company.profitMargin || defaultState.profitMargin,
    monthlyRevenue: company.monthlyRevenue || defaultState.monthlyRevenue,
    knowsMarginByProduct: ext.knowsMarginByProduct || "nao",
    splitPaymentAware: company.splitPaymentAware || defaultState.splitPaymentAware,
    priceRevisionClause: company.priceRevisionClause || defaultState.priceRevisionClause,
    taxResponsible: company.taxResponsible || defaultState.taxResponsible,
    internalERPResponsible: ext.internalERPResponsible || "nao",
    managementAwareOfReform: ext.managementAwareOfReform || "parcialmente",
    preparationStarted: ext.preparationStarted || "nao",
    hadInternalTraining: ext.hadInternalTraining || "nao",
    selfAssessedMaturity: ext.selfAssessedMaturity || "baixa",
    mainConcern: company.mainConcern || defaultState.mainConcern,
    specialRegimes: company.specialRegimes || [],
    riskScore: company.riskScore || 0,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState<AppState>(defaultState);
  const [companyId, setCompanyId] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  });

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) { const u = await res.json(); setUser(u); }
      else setUser(null);
    } catch { setUser(null); }
    finally { setAuthLoading(false); }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Erro ao fazer login"); }
    const u = await res.json();
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null); setData(defaultState); setCompanyId(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const updateData = (key: keyof AppState, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const resetData = () => {
    setData(defaultState); setCompanyId(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const saveCompany = useCallback(async (): Promise<string> => {
    const res = await apiRequest("POST", "/api/companies", stateToPayload(data));
    const company = await res.json();
    setCompanyId(company.id);
    try { localStorage.setItem(STORAGE_KEY, company.id); } catch {}
    return company.id;
  }, [data]);

  const loadCompany = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/companies/${id}`, { credentials: "include" });
      if (!res.ok) { localStorage.removeItem(STORAGE_KEY); setCompanyId(null); return; }
      const company = await res.json();
      setData(companyToState(company));
      setCompanyId(id);
    } catch { localStorage.removeItem(STORAGE_KEY); setCompanyId(null); }
  }, []);

  const updateCompanyOnServer = useCallback(async () => {
    if (!companyId) return;
    await apiRequest("PATCH", `/api/companies/${companyId}`, stateToPayload(data));
  }, [companyId, data]);

  return (
    <AppContext.Provider value={{ user, authLoading, data, companyId, login, logout, checkAuth, updateData, saveCompany, loadCompany, updateCompanyOnServer, resetData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within an AppProvider");
  return ctx;
}
