"use client";

import { motion } from "framer-motion";
import { Calendar, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: "/records",
    icon: Calendar,
    label: "Registros",
  },
  {
    href: "/add-code",
    icon: Plus,
    label: "Agregar",
  },
  {
    href: "/profile",
    icon: User,
    label: "Perfil",
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 safe-area-pb z-50 shadow-lg">
      <div className="flex justify-around items-center px-6 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true} // Prefetch agresivo
              className="relative flex flex-col items-center justify-center min-h-[56px] px-2 py-1 rounded-lg transition-all duration-150 active:scale-95" // Feedback táctil inmediato
              aria-label={item.label}
            >
              {/* Indicador activo */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-50 rounded-lg border border-blue-100"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400, // Más rápido
                    damping: 25,
                    duration: 0.2, // Más corto
                  }}
                />
              )}

              {/* Ícono con animación más rápida */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  duration: 0.15,
                }}
                whileTap={{ scale: 0.9 }} // Feedback inmediato al tocar
              >
                <Icon
                  size={24}
                  className={`${
                    isActive ? "text-blue-600" : "text-gray-500"
                  } transition-colors duration-150`}
                />
              </motion.div>

              {/* Label con transición más rápida */}
              <motion.span
                className={`relative z-10 text-xs font-medium mt-1 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                } transition-colors duration-150`}
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  scale: isActive ? 1 : 0.9,
                }}
                transition={{ duration: 0.15 }}
              >
                {item.label}
              </motion.span>

              {/* Ripple effect más fluido */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-gray-100"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{
                  scale: 1.2,
                  opacity: 0.3,
                  transition: { duration: 0.1 },
                }}
                animate={{
                  scale: 0,
                  opacity: 0,
                  transition: { duration: 0.2, delay: 0.1 },
                }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
