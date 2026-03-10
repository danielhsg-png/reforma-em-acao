export interface CompanyProfile {
  companyName: string;
  cnpj: string;
  sector: string;
  regime: string;
  operations: string;
  purchaseProfile: string;
  salesStates: string[];
  costStructure: string;
  geographicPresence: string;
  salesChannels: string[];
  targetAudience: string;
  interstateSalesPercentage: string;
}

export interface RiskAssessment {
  messyCatalog: boolean;
  unstandardizedSuppliers: boolean;
  noPricingRules: boolean;
  inconsistentChannels: boolean;
  closingRework: boolean;
  noWeeklyReview: boolean;
  riskScore: number;
}

export interface TopProduct {
  id: string;
  name: string;
  code: string;
  salesPercentage: number;
  marginPercentage: number;
  status: "pending" | "reviewed" | "optimized";
}

export interface SupplierRating {
  id: string;
  name: string;
  rating: "A" | "B" | "C";
  documentConsistency: number;
  responseTime: number;
  notes: string;
}

export interface Task {
  id: string;
  phase: 1 | 2 | 3;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export interface ChecklistItem {
  id: string;
  question: string;
  status: "yes" | "no" | "validating";
  notes: string;
}
