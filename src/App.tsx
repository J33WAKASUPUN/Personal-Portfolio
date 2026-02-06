import { useState, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./dashboard/utils/authContext";
import ProtectedRoute from "./dashboard/auth/ProtectedRoute";
import LoginPage from "./dashboard/auth/LoginPage";
import DashboardLayout from "./dashboard/layout/DashboardLayout";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import PreLoader from "./components/PreLoader";

const queryClient = new QueryClient();

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />

        {/* Pre-loader */}
        {!isLoaded && <PreLoader onLoadComplete={handleLoadComplete} />}

        {/* Main App - renders in background during preload */}
        <div className={isLoaded ? 'opacity-100 transition-opacity duration-500' : 'opacity-0 h-0 overflow-hidden'}>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />

                {/* Dashboard Routes */}
                <Route path="/dashboard/login" element={<LoginPage />} />
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect /dashboard to /dashboard/home */}
                <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;