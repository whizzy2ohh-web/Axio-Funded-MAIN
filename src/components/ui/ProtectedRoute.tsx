import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-12 w-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
    </div>;
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};
