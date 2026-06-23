import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import KitchenPage from "./pages/KitchenPage";
import Neighborhood from "./components/neighbourhood/Neighbourhood";
import HouseholdSetup from "./pages/HouseholdSetup";
import { ProtectedRoute } from "./components/auth/ProtectedRoute"; // Import the bouncer
import { useEffect } from "react";

export default function App() {

  useEffect(() => {
    console.log(
      "%cBuilt with ☕ by Abhilash Singh", 
      "color: #d97706; font-size: 16px; font-weight: bold; font-family: monospace;"
    );
  }, []);

  return (
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
              <KitchenPage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}