import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import NotFound from "./pages/NotFound";
import { AppTour } from "@/components/AppTour";
import PrivateRoute from "@/components/PrivateRoute";

const queryClient = new QueryClient();

// Dashboard wrapper with AppTour
const DashboardWithTour = () => (
  <>
    <AppTour />
    <Index />
  </>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="expense-tracker-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main Application Dashboard */}
              <Route
                path="/index"
                element={
                  <PrivateRoute>
                    <DashboardWithTour />
                  </PrivateRoute>
                }
              />
              {/* Landing Page Route */}
              <Route path="/" element={<LandingPage />} />

              {/* Google OAuth Callback */}
              <Route path="/auth/callback" element={<GoogleAuthCallback />} />

              {/* Redirect any unknown routes to landing */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
