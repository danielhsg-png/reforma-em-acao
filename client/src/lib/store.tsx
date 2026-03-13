import { createContext, useContext, useState, ReactNode } from "react";

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
  updateData: (key: keyof AppState, value: any) => void;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppState>(defaultState);

  const updateData = (key: keyof AppState, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AppContext.Provider value={{ data, updateData }}>
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
