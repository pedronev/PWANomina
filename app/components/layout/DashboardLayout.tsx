"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import WeekSelector from "../ui/WeekSelector";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  showWeekSelector?: boolean;
  weekSelectorProps?: {
    selectedDay: number;
    onDaySelect: (day: number) => void;
    daysOfWeek: Array<{ id: number; name: string; full: string }>;
  };
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  headerAction,
  showWeekSelector = false,
  weekSelectorProps,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      {title && (
        <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200 px-6 py-4 safe-area-pt">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && <div className="ml-4">{headerAction}</div>}
          </div>

          {/* Week Selector */}
          {showWeekSelector && weekSelectorProps && (
            <WeekSelector {...weekSelectorProps} />
          )}
        </header>
      )}

      {/* Contenido principal */}
      <main className="flex-1 pb-20 safe-area-px">
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Navegación inferior */}
      <BottomNavigation />
    </div>
  );
}
