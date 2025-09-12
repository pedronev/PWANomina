"use client";

import DashboardLayout from "@/app/components/layout/DashboardLayout";
import ProcessSelector from "@/app/components/ui/ProcessSelector";
import CustomKeypad from "@/app/components/ui/CustomKeypad";
import ErrorMessage from "@/app/components/ui/ErrorMessage";
import { useWeek } from "@/app/hooks/useWeek";
import { useAddCode } from "@/app/hooks/useAddCode";

// Constantes de procesos (esto podría venir de una API o config)
const AVAILABLE_PROCESSES = ["Proceso A", "Proceso B", "Proceso C"] as const;

export default function AddCodePage() {
  const { selectedDay, setSelectedDay, getWeekRange, daysOfWeek } = useWeek();

  const {
    selectedProcess,
    code,
    isLoading,
    error,
    setSelectedProcess,
    setCode,
    handleSave,
    canSave,
  } = useAddCode(selectedDay, AVAILABLE_PROCESSES);

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
      <div className="h-full flex flex-col">
        {/* Selector de proceso */}
        <div className="p-4 bg-white border-b border-gray-100">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Selecciona el proceso
          </label>
          <ProcessSelector
            selectedProcess={selectedProcess}
            onProcessSelect={setSelectedProcess}
            processes={[...AVAILABLE_PROCESSES]}
            compact={true}
          />
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="px-4 pt-4">
            <ErrorMessage
              message={error}
              onDismiss={() => setCode(code)} // Limpiar error al interactuar
            />
          </div>
        )}

        {/* Código de trabajo */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 p-2">
            <CustomKeypad value={code} onChange={setCode} />
          </div>

          {/* Botón de guardar */}
          <div className="p-2 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={!canSave || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-2xl transition-all duration-200 shadow-sm ${
                canSave && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
