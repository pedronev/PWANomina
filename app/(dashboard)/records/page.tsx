"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
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
  const [mockRecords, setMockRecords] = useState<WorkRecord[]>([
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
  ]);

  const getCurrentWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay();

    const friday = new Date(today);
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
    setMockRecords((prev) => prev.filter((record) => record.id !== recordId));
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekOffset((prev) =>
      direction === "prev" ? prev - 1 : prev + 1
    );
  };

  // Crear un array plano con separadores para cada día
  const createFlattenedRecords = () => {
    const flattened: (
      | WorkRecord
      | { type: "separator"; dayId: number; dayName: string }
    )[] = [];

    daysOfWeek.forEach((day) => {
      // Agregar separador del día
      flattened.push({
        type: "separator",
        dayId: day.id,
        dayName: day.full,
      });

      // Agregar registros del día
      const dayRecords = getRecordsForDay(day.id);
      flattened.push(...dayRecords);
    });

    return flattened;
  };

  const handleReorder = (
    newOrder: (
      | WorkRecord
      | { type: "separator"; dayId: number; dayName: string }
    )[]
  ) => {
    const updatedRecords: WorkRecord[] = [];
    let currentDay = daysOfWeek[0].id;

    newOrder.forEach((item) => {
      if ("type" in item && item.type === "separator") {
        currentDay = item.dayId;
      } else if ("id" in item) {
        // Actualizar el día del registro basado en su posición
        updatedRecords.push({
          ...item,
          day: currentDay,
        });
      }
    });

    setMockRecords(updatedRecords);
  };

  // Componente para las 3 líneas estilo iOS
  const DragHandle = () => (
    <div className="flex flex-col items-center justify-center w-6 h-6 px-1">
      <div className="w-4 h-0.5 bg-gray-400 rounded-full mb-0.5"></div>
      <div className="w-4 h-0.5 bg-gray-400 rounded-full mb-0.5"></div>
      <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
    </div>
  );

  const flattenedItems = createFlattenedRecords();

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

        {/* Lista unificada de registros */}
        <div className="flex-1 overflow-auto">
          <Reorder.Group
            axis="y"
            values={flattenedItems}
            onReorder={handleReorder}
            className="divide-y divide-gray-100"
          >
            {flattenedItems.map((item) => {
              if ("type" in item && item.type === "separator") {
                const dayRecords = getRecordsForDay(item.dayId);
                return (
                  <Reorder.Item
                    key={`separator-${item.dayId}`}
                    value={item}
                    dragListener={false}
                    className="bg-gray-50 px-4 py-3 flex items-center gap-3 border-b border-gray-100"
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {item.dayName}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({dayRecords.length} registro
                      {dayRecords.length !== 1 ? "s" : ""})
                    </span>
                  </Reorder.Item>
                );
              }

              const record = item as WorkRecord;
              return (
                <Reorder.Item
                  key={record.id}
                  value={record}
                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 bg-white"
                  whileDrag={{
                    scale: 1.02,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    backgroundColor: "#f8fafc",
                    zIndex: 1000,
                  }}
                  animate={{
                    scale: 1,
                    boxShadow: "0 0px 0px rgba(0,0,0,0)",
                    backgroundColor: "#ffffff",
                    zIndex: 1,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <motion.div
                      className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <DragHandle />
                    </motion.div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">
                        {record.code}
                      </p>
                      <p className="text-sm text-gray-500">{record.process}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          {/* Mensaje cuando no hay registros */}
          {mockRecords.length === 0 && (
            <div className="px-4 py-12 text-center text-gray-500">
              <p className="text-sm">No hay registros esta semana</p>
            </div>
          )}
        </div>

        {/* Resumen de la semana */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
