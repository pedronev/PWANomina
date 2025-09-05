"use client";

import DashboardLayout from "@/app/components/layout/DashboardLayout";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    // Aquí iría la lógica de cerrar sesión con Supabase
    router.push("/login");
  };

  return (
    <DashboardLayout title="Mi Perfil">
      <div className="p-6 space-y-6">
        {/* Tarjeta de usuario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Usuario Demo</h2>
              <p className="text-gray-500">usuario@ejemplo.com</p>
            </div>
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-6 hover:bg-red-50 transition-all duration-200 group active:scale-98"
          >
            <div className="w-12 h-12 bg-red-100 group-hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-gray-900 group-hover:text-red-600 font-semibold text-lg transition-colors duration-200">
                Cerrar Sesión
              </span>
              <p className="text-gray-500 text-sm">Salir de la aplicación</p>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
