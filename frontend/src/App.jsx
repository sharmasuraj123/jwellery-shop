import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from "./context/AuthContext";
import { Toaster, toast } from "./components/ui/sonner";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-center" />
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
