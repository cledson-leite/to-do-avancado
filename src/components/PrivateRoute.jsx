import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>; // Ou um spinner de loading
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}
