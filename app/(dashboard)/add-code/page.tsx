"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import ProcessSelector from "@/app/components/ui/ProcessSelector";
import CustomKeypad from "@/app/components/ui/CustomKeypad";
import { useWeek } from "@/app/hooks/useWeek";
import { Clock } from "lucide-react";

export default function AddCodePage() {
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const { selectedDay, setSelectedDay, getWeekRange, daysOfWeek } = useWeek();

  const processes = [
    "Proceso A",
    "Proceso B",
    "Proceso C",
    "Proceso D",
    "Proceso E",
  ];

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
        {/* Header compacto */}
        <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Registro de Trabajo
            </h2>
            <p className="text-xs text-gray-500">
              {daysOfWeek.find((d) => d.id === selectedDay)?.full}
            </p>
          </div>
        </div>

        {/* Selector de proceso */}
        <div className="p-4 bg-white border-b border-gray-100">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Selecciona el proceso
          </label>
          <ProcessSelector
            selectedProcess={selectedProcess}
            onProcessSelect={setSelectedProcess}
            processes={processes}
            compact={true}
          />
        </div>

        {/* Código de trabajo - flex-1 para ocupar espacio restante */}
        <div className="flex-1 flex flex-col bg-white">
          {/* <div className="p-4 border-b border-gray-100">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Código de trabajo
            </label>
          </div> */}

          <div className="flex-1 p-2">
            <CustomKeypad value={code} onChange={setCode} />
          </div>

          {/* Botón de guardar */}
          <div className="p-2 border-t border-gray-100">
            <button
              disabled={selectedProcess === null || !code}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm ${
                selectedProcess !== null && code
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Guardar Código
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
