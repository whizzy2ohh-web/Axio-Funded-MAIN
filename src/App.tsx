import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import CheckoutResult from "./pages/CheckoutResult";
import { AppLayout } from "./components/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Accounts from "./pages/app/Accounts";
import Trade from "./pages/app/Trade";
import History from "./pages/app/History";
import Leaderboard from "./pages/app/Leaderboard";
import Payouts from "./pages/app/Payouts";
import Settings from "./pages/app/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/Axio-Funded-MAIN">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout/success" element={<CheckoutResult kind="success" />} />
            <Route path="/checkout/cancel" element={<CheckoutResult kind="cancel" />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="trade" element={<Trade />} />
              <Route path="history" element={<History />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
