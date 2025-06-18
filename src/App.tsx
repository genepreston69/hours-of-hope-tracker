
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ServiceEntry from "./pages/ServiceEntry";
import Auth from "./pages/Auth";
import Customers from "./pages/Customers";
import RecoverySurvey from "./pages/RecoverySurvey";
import DirectorDashboard from "./pages/DirectorDashboard";
import IncidentReport from "./pages/IncidentReport";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route 
                  path="/service-entry" 
                  element={
                    <ProtectedRoute>
                      <ServiceEntry />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customers" 
                  element={
                    <ProtectedRoute>
                      <Customers />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/recovery-survey" 
                  element={
                    <ProtectedRoute>
                      <RecoverySurvey />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/director-dashboard" 
                  element={
                    <ProtectedRoute>
                      <DirectorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/incident-report" 
                  element={
                    <ProtectedRoute>
                      <IncidentReport />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
