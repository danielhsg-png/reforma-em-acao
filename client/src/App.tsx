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
import PlanoDeAcaoJornada from "@/pages/PlanoDeAcaoJornada";
import DashboardEducational from "@/pages/Dashboard-Educational";
import FinancialSimulation from "@/pages/FinancialSimulation";
import SimplesSimulator from "@/pages/SimplesSimulator";
import ProfilePage from "@/pages/ProfilePage";

function AuthenticatedRoutes() {
  return (
    <Switch>
      <Route path="/inicio" component={HomePage} />
      <Route path="/perfil" component={ProfilePage} />
      <Route path="/plano-de-acao" component={PlanoDeAcaoJornada} />
      <Route path="/plano-de-acao/meus-planos" component={MyPlans} />
      <Route path="/simulador-financeiro" component={FinancialSimulation} />
      <Route path="/simulador-simples" component={SimplesSimulator} />
      <Route path="/o-que-muda" component={DashboardEducational} />

      <Route path="/plano-de-acao/avaliacao"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/visao-executiva"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/diagnostico"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/sistemas"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/fornecedores"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/precificacao"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/rotinas"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/cronograma"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/checklist"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/analise-produtos"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/plano-de-acao/preocupacoes"><Redirect to="/plano-de-acao" /></Route>

      <Route path="/home"><Redirect to="/inicio" /></Route>
      <Route path="/my-plans"><Redirect to="/plano-de-acao/meus-planos" /></Route>
      <Route path="/assessment"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/dashboard"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/risk-assessment"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/system-management"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/supply-chain"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/pricing-strategy"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/routines"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/implementation-roadmap"><Redirect to="/plano-de-acao" /></Route>
      <Route path="/final-checklist"><Redirect to="/plano-de-acao" /></Route>
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
