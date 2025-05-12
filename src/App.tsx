
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ServiceEntry from "./pages/ServiceEntry";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Public route */}
              <Route path="/" element={<Dashboard />} />
              
              {/* Authentication route - redirect to dashboard if already logged in */}
              <Route element={<ProtectedRoute requireAuth={false} />}>
                <Route path="/auth" element={<Auth />} />
              </Route>
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/service-entry" element={<ServiceEntry />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
