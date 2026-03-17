import { useEffect } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppStore } from "@/lib/store";
import NotFound from "@/pages/not-found";

import Login from "@/pages/Login";
import HomePage from "@/pages/HomePage";
import MyPlans from "@/pages/MyPlans";
import Assessment from "@/pages/Assessment";
import Dashboard from "@/pages/Dashboard";
import DashboardEducational from "@/pages/Dashboard-Educational";
import RiskAssessment from "@/pages/RiskAssessment";
import SystemManagement from "@/pages/SystemManagement";
import SupplyChain from "@/pages/SupplyChain";
import PricingStrategy from "@/pages/PricingStrategy";
import Routines from "@/pages/Routines";
import ImplementationRoadmap from "@/pages/ImplementationRoadmap";
import FinalChecklist from "@/pages/FinalChecklist";
import FinancialSimulation from "@/pages/FinancialSimulation";
import ProductAnalysis from "@/pages/ProductAnalysis";
import SimplesSimulator from "@/pages/SimplesSimulator";
import MyConcerns from "@/pages/MyConcerns";

function AuthenticatedRoutes() {
  return (
    <Switch>
      <Route path="/inicio" component={HomePage} />
      <Route path="/plano-de-acao" component={MyPlans} />
      <Route path="/plano-de-acao/avaliacao" component={Assessment} />
      <Route path="/plano-de-acao/visao-executiva" component={Dashboard} />
      <Route path="/plano-de-acao/diagnostico" component={RiskAssessment} />
      <Route path="/plano-de-acao/sistemas" component={SystemManagement} />
      <Route path="/plano-de-acao/fornecedores" component={SupplyChain} />
      <Route path="/plano-de-acao/precificacao" component={PricingStrategy} />
      <Route path="/plano-de-acao/rotinas" component={Routines} />
      <Route path="/plano-de-acao/cronograma" component={ImplementationRoadmap} />
      <Route path="/plano-de-acao/checklist" component={FinalChecklist} />
      <Route path="/plano-de-acao/analise-produtos" component={ProductAnalysis} />
      <Route path="/plano-de-acao/preocupacoes" component={MyConcerns} />
      <Route path="/simulador-financeiro" component={FinancialSimulation} />
      <Route path="/simulador-simples" component={SimplesSimulator} />
      <Route path="/o-que-muda" component={DashboardEducational} />

      <Route path="/home"><Redirect to="/inicio" /></Route>
      <Route path="/my-plans"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/assessment"><Redirect to="/plano-de-acao/avaliacao" /></Route>
      <Route path="/dashboard"><Redirect to="/plano-de-acao/visao-executiva" /></Route>
      <Route path="/risk-assessment"><Redirect to="/plano-de-acao/diagnostico" /></Route>
      <Route path="/system-management"><Redirect to="/plano-de-acao/sistemas" /></Route>
      <Route path="/supply-chain"><Redirect to="/plano-de-acao/fornecedores" /></Route>
      <Route path="/pricing-strategy"><Redirect to="/plano-de-acao/precificacao" /></Route>
      <Route path="/routines"><Redirect to="/plano-de-acao/rotinas" /></Route>
      <Route path="/implementation-roadmap"><Redirect to="/plano-de-acao/cronograma" /></Route>
      <Route path="/final-checklist"><Redirect to="/plano-de-acao/checklist" /></Route>
      <Route path="/product-analysis"><Redirect to="/plano-de-acao/analise-produtos" /></Route>
      <Route path="/my-concerns"><Redirect to="/plano-de-acao/preocupacoes" /></Route>
      <Route path="/financial-simulation"><Redirect to="/simulador-financeiro" /></Route>
      <Route path="/simples-simulator"><Redirect to="/simulador-simples" /></Route>
      <Route path="/dashboard-educational"><Redirect to="/o-que-muda" /></Route>

      <Route path="/">
        <Redirect to="/inicio" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { user, authLoading, checkAuth } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <AuthenticatedRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
