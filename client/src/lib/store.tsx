import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiRequest } from "./queryClient";

interface AppState {
  companyName: string;
  cnpj: string;
  sector: string;
  regime: string;
  operations: string;
  purchaseProfile: string;
  salesStates: string[];
  costStructure: string;
  riskScore: number;
  monthlyRevenue: string;
  employeeCount: string;
  profitMargin: string;
  erpSystem: string;
  nfeEmission: string;
  invoiceVolume: string;
  supplierCount: string;
  simplesSupplierPercent: string;
  hasLongTermContracts: string;
  priceRevisionClause: string;
  taxResponsible: string;
  splitPaymentAware: string;
  mainConcern: string;
  specialRegimes: string[];
}

interface AppContextType {
  data: AppState;
  companyId: string | null;
  updateData: (key: keyof AppState, value: any) => void;
  saveCompany: () => Promise<string>;
  loadCompany: (id: string) => Promise<void>;
  updateCompanyOnServer: () => Promise<void>;
}

const defaultState: AppState = {
  companyName: "Minha Empresa",
  cnpj: "",
  sector: "varejo",
  regime: "lucro_presumido",
  operations: "b2c",
  purchaseProfile: "mixed_suppliers",
  salesStates: [],
  costStructure: "mercadorias",
  riskScore: 0,
  monthlyRevenue: "100k_500k",
  employeeCount: "1_10",
  profitMargin: "10_20",
  erpSystem: "nenhum",
  nfeEmission: "contador",
  invoiceVolume: "ate_100",
  supplierCount: "ate_20",
  simplesSupplierPercent: "ate_30",
  hasLongTermContracts: "nao",
  priceRevisionClause: "nao_sei",
  taxResponsible: "contador_externo",
  splitPaymentAware: "nao",
  mainConcern: "custos",
  specialRegimes: [],
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
    purchaseProfile: data.purchaseProfile,
    salesStates: data.salesStates,
    costStructure: data.costStructure,
    riskScore: data.riskScore,
    monthlyRevenue: data.monthlyRevenue,
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
  };
}

function companyToState(company: any): AppState {
  return {
    companyName: company.companyName || defaultState.companyName,
    cnpj: company.cnpj || "",
    sector: company.sector || defaultState.sector,
    regime: company.regime || defaultState.regime,
    operations: company.operations || defaultState.operations,
    purchaseProfile: company.purchaseProfile || defaultState.purchaseProfile,
    salesStates: company.salesStates || [],
    costStructure: company.costStructure || defaultState.costStructure,
    riskScore: company.riskScore || 0,
    monthlyRevenue: company.monthlyRevenue || defaultState.monthlyRevenue,
    employeeCount: company.employeeCount || defaultState.employeeCount,
    profitMargin: company.profitMargin || defaultState.profitMargin,
    erpSystem: company.erpSystem || defaultState.erpSystem,
    nfeEmission: company.nfeEmission || defaultState.nfeEmission,
    invoiceVolume: company.invoiceVolume || defaultState.invoiceVolume,
    supplierCount: company.supplierCount || defaultState.supplierCount,
    simplesSupplierPercent: company.simplesSupplierPercent || defaultState.simplesSupplierPercent,
    hasLongTermContracts: company.hasLongTermContracts || defaultState.hasLongTermContracts,
    priceRevisionClause: company.priceRevisionClause || defaultState.priceRevisionClause,
    taxResponsible: company.taxResponsible || defaultState.taxResponsible,
    splitPaymentAware: company.splitPaymentAware || defaultState.splitPaymentAware,
    mainConcern: company.mainConcern || defaultState.mainConcern,
    specialRegimes: company.specialRegimes || [],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppState>(defaultState);
  const [companyId, setCompanyId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const updateData = (key: keyof AppState, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const saveCompany = useCallback(async (): Promise<string> => {
    const res = await apiRequest("POST", "/api/companies", stateToPayload(data));
    const company = await res.json();
    setCompanyId(company.id);
    try {
      localStorage.setItem(STORAGE_KEY, company.id);
    } catch {}
    return company.id;
  }, [data]);

  const loadCompany = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/companies/${id}`, { credentials: "include" });
      if (!res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        setCompanyId(null);
        return;
      }
      const company = await res.json();
      setData(companyToState(company));
      setCompanyId(id);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setCompanyId(null);
    }
  }, []);

  const updateCompanyOnServer = useCallback(async () => {
    if (!companyId) return;
    await apiRequest("PATCH", `/api/companies/${companyId}`, stateToPayload(data));
  }, [companyId, data]);

  return (
    <AppContext.Provider value={{ data, companyId, updateData, saveCompany, loadCompany, updateCompanyOnServer }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
