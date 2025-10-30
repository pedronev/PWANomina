"use client";

import DashboardLayout from "@/app/components/layout/DashboardLayout";
import { LogOut, User, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const formatLastAccess = (dateString: string | null) => {
    if (!dateString) return "Nunca";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Ahora mismo";
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minutos`;
    if (diffInMinutes < 1440)
      return `Hace ${Math.floor(diffInMinutes / 60)} horas`;

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout title="Mi Perfil">
      <div className="p-6 space-y-6 h-screen">
        {/* Tarjeta principal de usuario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 ">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user?.nombre || "Usuario"}
              </h2>
              <p className="text-gray-500 text-sm">@{user?.username}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 text-sm font-medium">
                  Activo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información de la cuenta */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información de la cuenta
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Nombre completo</span>
              </div>
              <span className="font-medium text-gray-900">
                {user?.nombre || "Sin especificar"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Usuario</span>
              </div>
              <span className="font-medium text-gray-900">
                {user?.username || "Sin especificar"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Último acceso</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatLastAccess(user?.ultimo_acceso || null)}
              </span>
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
