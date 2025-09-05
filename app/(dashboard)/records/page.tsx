"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import { useWeek } from "@/app/hooks/useWeek";
import { ChevronLeft, ChevronRight, Trash2, Calendar } from "lucide-react";

interface WorkRecord {
  id: string;
  day: number;
  process: string;
  code: string;
  date: string;
}

export default function RecordsPage() {
  const { getWeekRange, daysOfWeek } = useWeek();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Datos mock - en producción vendrían de Supabase
  const mockRecords: WorkRecord[] = [
    {
      id: "1",
      day: 1,
      process: "Proceso A",
      code: "12345",
      date: "2024-09-02",
    },
    {
      id: "2",
      day: 1,
      process: "Proceso B",
      code: "67890",
      date: "2024-09-02",
    },
    {
      id: "3",
      day: 2,
      process: "Proceso A",
      code: "11111",
      date: "2024-09-03",
    },
    {
      id: "4",
      day: 4,
      process: "Proceso C",
      code: "22222",
      date: "2024-09-05",
    },
  ];

  const getCurrentWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay();

    let friday = new Date(today);
    if (currentDay >= 5) {
      friday.setDate(
        today.getDate() - (currentDay - 5) + currentWeekOffset * 7
      );
    } else {
      friday.setDate(
        today.getDate() - (currentDay + 2) + currentWeekOffset * 7
      );
    }

    const thursday = new Date(friday);
    thursday.setDate(friday.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
      });
    };

    return `${formatDate(friday)} - ${formatDate(thursday)}`;
  };

  const getRecordsForDay = (dayId: number) => {
    return mockRecords.filter((record) => record.day === dayId);
  };

  const handleDeleteRecord = (recordId: string) => {
    // Aquí iría la lógica para eliminar de Supabase
    console.log("Eliminar registro:", recordId);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekOffset((prev) =>
      direction === "prev" ? prev - 1 : prev + 1
    );
  };

  const getDayName = (dayId: number) => {
    return daysOfWeek.find((d) => d.id === dayId)?.name || "";
  };

  return (
    <DashboardLayout title="Registros">
      <div className="h-full flex flex-col">
        {/* Header con navegación de semanas */}
        <div className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateWeek("prev")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center">
              <h2 className="font-semibold text-gray-900">
                {getCurrentWeekRange()}
              </h2>
              <p className="text-xs text-gray-500">
                {currentWeekOffset === 0
                  ? "Semana actual"
                  : currentWeekOffset > 0
                  ? `${currentWeekOffset} semana(s) adelante`
                  : `${Math.abs(currentWeekOffset)} semana(s) atrás`}
              </p>
            </div>

            <button
              onClick={() => navigateWeek("next")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabla de registros */}
        <div className="flex-1 overflow-auto">
          {daysOfWeek.map((day) => {
            const dayRecords = getRecordsForDay(day.id);

            return (
              <div key={day.id} className="border-b border-gray-100">
                {/* Header del día */}
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{day.full}</span>
                  <span className="text-sm text-gray-500">
                    ({dayRecords.length} registro
                    {dayRecords.length !== 1 ? "s" : ""})
                  </span>
                </div>

                {/* Registros del día */}
                {dayRecords.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {dayRecords.map((record) => (
                      <div
                        key={record.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {record.process}
                              </p>
                              <p className="text-sm text-gray-500">
                                Código: {record.code}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <p className="text-sm">Sin registros</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumen de la semana */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {mockRecords.length}
              </p>
              <p className="text-xs text-gray-500">Total registros</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {
                  daysOfWeek.filter(
                    (day) => getRecordsForDay(day.id).length > 0
                  ).length
                }
              </p>
              <p className="text-xs text-gray-500">Días trabajados</p>
            </div>
            {/* <div>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(mockRecords.map((r) => r.process)).size}
              </p>
              <p className="text-xs text-gray-500">Procesos únicos</p>
            </div> */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
