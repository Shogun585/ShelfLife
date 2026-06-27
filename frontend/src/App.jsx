import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Neighborhood from "./components/neighbourhood/Neighbourhood";
import HouseholdSetup from "./pages/HouseholdSetup";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import React, { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import PageLoader from "./components/ui/PageLoader";

const KitchenPage = React.lazy(() => import('./pages/KitchenPage'))

const queryClient = new QueryClient();

export default function App() {

  useEffect(() => {
    console.log(
      "%cBuilt with ☕ by Abhilash Singh", 
      "color: #d97706; font-size: 16px; font-weight: bold; font-family: monospace;"
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Routes>

          <Route path="/" element={<AuthPage />} />
          
          <Route 
            path="/setup" 
            element={
              <ProtectedRoute>
                <HouseholdSetup />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/neighborhood" 
            element={
              <ProtectedRoute>
                <Neighborhood />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/kitchen" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <KitchenPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    
  );
}