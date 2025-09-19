// app/components/auth/ProtectedRoute.tsx

"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import LoadingScreen from "./LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir al login
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, no mostrar nada (se está redirigiendo)
  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
