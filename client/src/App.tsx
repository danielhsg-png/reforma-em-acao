import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/store";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <Route component={NotFound} />
    </Switch>
  );
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
