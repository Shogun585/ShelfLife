import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Neighborhood from "./components/neighbourhood/Neighbourhood";
import HouseholdSetup from "./pages/HouseholdSetup";
import { ProtectedRoute } from "./components/auth/ProtectedRoute"; // Import the bouncer
import React, { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const KitchenPage = React.lazy(() => import('./pages/KitchenPage'))

const queryClient = new QueryClient();

export default function App() {

  const PageLoader = () => (
    <div className="flex h-screen w-full items-center justify-center bg-sky-200">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-900 border-t-transparent"></div>
    </div>
  );

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