"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import ProcessSelector from "@/app/components/ui/ProcessSelector";
import CustomKeypad from "@/app/components/ui/CustomKeypad";
import ErrorMessage from "@/app/components/ui/ErrorMessage";
import SuccessMessage from "@/app/components/ui/SuccessMessage";
import { useWeek } from "@/app/hooks/useWeek";
import { useAddCode } from "@/app/hooks/useAddCode";
import { useAuth } from "@/app/context/AuthContext";

export default function AddCodePage() {
  const { selectedDay, setSelectedDay, getWeekRange, daysOfWeek } = useWeek();
  const { user } = useAuth();
  const [availableProcesses, setAvailableProcesses] = useState<string[]>([]);
  const [isLoadingProcesses, setIsLoadingProcesses] = useState(true);

  const {
    selectedProcess,
    code,
    isLoading,
    error,
    successMessage,
    setSelectedProcess,
    setCode,
    handleSave,
    canSave,
  } = useAddCode(selectedDay, availableProcesses);

  useEffect(() => {
    const fetchUserProcesses = async () => {
      if (!user) return;

      setIsLoadingProcesses(true);
      try {
        const response = await fetch(
          `/api/empleado-procesos?empleado_id=${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          const processNames = data.map((p: any) => p.nombre);
          setAvailableProcesses(processNames);
        }
      } catch (error) {
        console.error("Error loading processes:", error);
      } finally {
        setIsLoadingProcesses(false);
      }
    };

    fetchUserProcesses();
  }, [user]);

  if (isLoadingProcesses) {
    return (
      <DashboardLayout title="Agregar Código" subtitle={getWeekRange()}>
        <div className="flex items-center justify-center h-full">
          <p>Cargando procesos...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (availableProcesses.length === 0) {
    return (
      <DashboardLayout title="Agregar Código" subtitle={getWeekRange()}>
        <div className="flex items-center justify-center h-full p-6 text-center">
          <p className="text-gray-600">
            No tienes procesos asignados. Contacta al administrador.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Agregar Código"
      subtitle={getWeekRange()}
      showWeekSelector={true}
      weekSelectorProps={{
        selectedDay,
        onDaySelect: setSelectedDay,
        daysOfWeek,
      }}
    >
      <div className="h-full flex flex-col overflow-hidden overflow-x-hidden">
        <div className="flex-none p-3 bg-white border-b border-gray-100">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Selecciona el proceso
          </label>
          <ProcessSelector
            selectedProcess={selectedProcess}
            onProcessSelect={setSelectedProcess}
            processes={availableProcesses}
            compact={true}
          />
        </div>

        {/* Mensajes */}
        <div className="flex-none">
          {successMessage && (
            <div className="px-3 pt-2">
              <SuccessMessage
                message={successMessage}
                onDismiss={() => setCode(code)}
              />
            </div>
          )}
          {error && (
            <div className="px-3 pt-2">
              <ErrorMessage message={error} onDismiss={() => setCode(code)} />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-white min-h-0">
          <div className="flex-1 p-2 min-h-0 overflow-hidden">
            <CustomKeypad value={code} onChange={setCode} />
          </div>

          <div className="flex-none p-2 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={!canSave || isLoading}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-xl transition-all duration-200 shadow-sm ${
                canSave && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </div>
              ) : (
                "Guardar Código"
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
