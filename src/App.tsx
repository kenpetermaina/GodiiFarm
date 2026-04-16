import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import MyHerdPage from "@/pages/MyHerdPage";
import MilkRecordsPage from "@/pages/MilkRecordsPage";
import FeedingPage from "@/pages/FeedingPage";
import HealthPage from "@/pages/HealthPage";
import NotesPage from "@/pages/NotesPage";
import BreedingPage from "@/pages/BreedingPage";
import AlertsPage from "@/pages/AlertsPage";
import ReportsPage from "@/pages/ReportsPage";
import ExpensesPage from "@/pages/ExpensesPage";
import IncomePage from "@/pages/IncomePage";
import WorkersPage from "@/pages/WorkersPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { CowProvider } from "./contexts/CowContext";
import { RecordProvider } from "./contexts/RecordContext";

const queryClient = new QueryClient();

function AuthWrapper({ children }: { children: React.ReactNode }) {
  // const [session, setSession] = useState<Session | null>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  // const getInitialSession = async () => {
  //   try {
  //     const { data: { session }, error } = await supabase.auth.getSession();
  //     if (error) {
  //       console.error("Error getting session:", error);
  //     } else {
  //       console.log("Initial session loaded:", session ? "Session exists" : "No session");
  //     }
  //     setSession(session);

  //     // Data is automatically loaded from localStorage via Zustand persist middleware
  //   } catch (err) {
  //     console.error("Exception getting session:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // getInitialSession();

  // const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
  //   console.log("Auth state changed:", event, session ? "session exists" : "no session");
  //   setSession(session);
  //   setLoading(false);

  //   // Data persists in localStorage regardless of auth state
  //   // No need to load/clear data on auth changes
  // });

  // return () => subscription.unsubscribe();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!session) return <LoginPage />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CowProvider>
        <RecordProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route element={<AuthWrapper><AppLayout /></AuthWrapper>}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/my-herd" element={<MyHerdPage />} />
                  <Route path="/milk-records" element={<MilkRecordsPage />} />
                  <Route path="/feeding" element={<FeedingPage />} />
                  <Route path="/health" element={<HealthPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/breeding" element={<BreedingPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/income" element={<IncomePage />} />
                  <Route path="/workers" element={<WorkersPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RecordProvider>
      </CowProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
