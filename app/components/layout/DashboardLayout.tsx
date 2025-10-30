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
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      {title && (
        <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 pt-6 pb-4 safe-area-pt shadow-sm">
          <div className="flex items-end justify-between mb-4">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight leading-tight"
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-sm text-gray-500 mt-0 font-medium"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
            {headerAction && <div className="ml-4">{headerAction}</div>}
          </div>

          {/* Week Selector */}
          {showWeekSelector && weekSelectorProps && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <WeekSelector {...weekSelectorProps} />
            </motion.div>
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
