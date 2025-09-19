"use client";

import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
