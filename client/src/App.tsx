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
      <Route path="/home" component={HomePage} />
      <Route path="/my-plans" component={MyPlans} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard-educational" component={DashboardEducational} />
      <Route path="/risk-assessment" component={RiskAssessment} />
      <Route path="/system-management" component={SystemManagement} />
      <Route path="/supply-chain" component={SupplyChain} />
      <Route path="/pricing-strategy" component={PricingStrategy} />
      <Route path="/routines" component={Routines} />
      <Route path="/implementation-roadmap" component={ImplementationRoadmap} />
      <Route path="/final-checklist" component={FinalChecklist} />
      <Route path="/financial-simulation" component={FinancialSimulation} />
      <Route path="/product-analysis" component={ProductAnalysis} />
      <Route path="/simples-simulator" component={SimplesSimulator} />
      <Route path="/my-concerns" component={MyConcerns} />
      <Route path="/">
        <Redirect to="/home" />
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
