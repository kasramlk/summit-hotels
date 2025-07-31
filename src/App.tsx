import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { HotelProvider } from "@/context/HotelContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Revenue from "./pages/Revenue";
import Occupancy from "./pages/Occupancy";
import Sales from "./pages/Sales";
import Comparison from "./pages/Comparison";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <HotelProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/revenue"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Revenue />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/occupancy"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="text-center p-8">
                        <h1 className="text-2xl font-bold">Occupancy Rates</h1>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="text-center p-8">
                        <h1 className="text-2xl font-bold">Sales Reports</h1>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comparison"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="text-center p-8">
                        <h1 className="text-2xl font-bold">Before/After Comparison</h1>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="text-center p-8">
                        <h1 className="text-2xl font-bold">Analytics</h1>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Billing />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </HotelProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
