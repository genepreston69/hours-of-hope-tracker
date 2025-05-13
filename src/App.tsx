
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ServiceEntry from "./pages/ServiceEntry";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Wrap BrowserRouter with AppProvider to ensure all routes have access to AppContext */}
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route element={<ProtectedRoute requireAuth={false} />}>
                <Route path="/auth" element={<Auth />} />
              </Route>
              
              {/* Root path now forwards to dashboard without requiring auth */}
              <Route path="/" element={<Index />} />
              
              {/* Public dashboard route */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/service-entry" element={<ServiceEntry />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
