import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { HotelProvider } from "@/context/HotelContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import { Layout } from "@/components/Layout";
import AdminLayout from "@/components/AdminLayout";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHotelManagement from "./pages/AdminHotelManagement";
import AdminDataEntry from "./pages/AdminDataEntry";
import Dashboard from "./pages/Dashboard";
import Revenue from "./pages/Revenue";
import Occupancy from "./pages/Occupancy";
import Sales from "./pages/Sales";
import Comparison from "./pages/Comparison";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
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
                      <Occupancy />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Sales />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comparison"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Comparison />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Analytics />
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
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <RoleBasedRoute adminOnly>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/hotels"
                element={
                  <RoleBasedRoute adminOnly>
                    <AdminLayout>
                      <AdminHotelManagement />
                    </AdminLayout>
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleBasedRoute adminOnly>
                    <AdminLayout>
                      <div className="space-y-6">
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </AdminLayout>
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/data-entry"
                element={
                  <RoleBasedRoute adminOnly>
                    <AdminLayout>
                      <AdminDataEntry />
                    </AdminLayout>
                  </RoleBasedRoute>
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
