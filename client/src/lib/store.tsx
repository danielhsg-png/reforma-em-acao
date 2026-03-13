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
};

const STORAGE_KEY = "reforma_company_id";

const AppContext = createContext<AppContextType | undefined>(undefined);

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
    const res = await apiRequest("POST", "/api/companies", {
      companyName: data.companyName,
      cnpj: data.cnpj,
      sector: data.sector,
      regime: data.regime,
      operations: data.operations,
      purchaseProfile: data.purchaseProfile,
      salesStates: data.salesStates,
      costStructure: data.costStructure,
      riskScore: data.riskScore,
    });
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
      setData({
        companyName: company.companyName,
        cnpj: company.cnpj,
        sector: company.sector,
        regime: company.regime,
        operations: company.operations,
        purchaseProfile: company.purchaseProfile,
        salesStates: company.salesStates || [],
        costStructure: company.costStructure,
        riskScore: company.riskScore,
      });
      setCompanyId(id);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setCompanyId(null);
    }
  }, []);

  const updateCompanyOnServer = useCallback(async () => {
    if (!companyId) return;
    await apiRequest("PATCH", `/api/companies/${companyId}`, {
      companyName: data.companyName,
      cnpj: data.cnpj,
      sector: data.sector,
      regime: data.regime,
      operations: data.operations,
      purchaseProfile: data.purchaseProfile,
      salesStates: data.salesStates,
      costStructure: data.costStructure,
      riskScore: data.riskScore,
    });
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
