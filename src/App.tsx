
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DataVault from "./pages/DataVault";
import ExposureMonitor from "./pages/ExposureMonitor";
import RiskAssessment from "./pages/RiskAssessment";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AiPredictorPage from "./pages/AiPredictorPage";
import { UserProvider } from "./contexts/UserContext";
import { ScannerProvider } from "./providers/ScannerProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <BrowserRouter>
          <ScannerProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout><Dashboard /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/vault" element={
                <ProtectedRoute>
                  <MainLayout><DataVault /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/monitor" element={
                <ProtectedRoute>
                  <MainLayout><ExposureMonitor /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/risk-assessment" element={
                <ProtectedRoute>
                  <MainLayout><RiskAssessment /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/ai-predictor" element={
                <ProtectedRoute>
                  <MainLayout><AiPredictorPage /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout><Settings /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ScannerProvider>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
