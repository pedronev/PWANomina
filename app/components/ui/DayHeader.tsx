"use client";

import { memo } from "react";
import { Reorder } from "framer-motion";
import { Calendar } from "lucide-react";
import type { DaySeparator } from "@/app/types/records";

interface DayHeaderProps {
  readonly item: DaySeparator;
  readonly recordCount: number;
  readonly weekOffset?: number;
}

const getDayDate = (dayId: number, weekOffset: number = 0) => {
  const today = new Date();
  const currentDay = today.getDay();

  // USAR LA MISMA LÓGICA QUE weekUtils.ts
  const baseFriday = new Date(today);

  if (currentDay === 5) {
    // Viernes: retroceder 7 días
    baseFriday.setDate(today.getDate() - 7);
  } else if (currentDay === 6) {
    // Sábado: retroceder 1 día
    baseFriday.setDate(today.getDate() - 1);
  } else {
    // Domingo a jueves: retroceder al viernes anterior
    baseFriday.setDate(today.getDate() - (currentDay + 2));
  }

  // Aplicar weekOffset
  baseFriday.setDate(baseFriday.getDate() + weekOffset * 7);

  // Mapear dayId a offset desde el viernes
  const dayOffsets: { [key: number]: number } = {
    5: 0, // Viernes
    6: 1, // Sábado
    0: 2, // Domingo
    1: 3, // Lunes
    2: 4, // Martes
    3: 5, // Miércoles
    4: 6, // Jueves
    15: 7, // Viernes siguiente
  };

  const targetDate = new Date(baseFriday);
  targetDate.setDate(baseFriday.getDate() + dayOffsets[dayId]);

  return targetDate;
};

const DayHeader = memo(
  ({ item, recordCount, weekOffset = 0 }: DayHeaderProps) => {
    const isNextWeek = item.dayId === 15;
    const dayDate = getDayDate(item.dayId, weekOffset);

    const dayNumber = dayDate.getDate();
    const monthName = dayDate.toLocaleDateString("es-ES", { month: "short" });

    return (
      <Reorder.Item
        key={`separator-${item.dayId}`}
        value={item}
        dragListener={false}
        className={`px-4 py-3 flex items-center gap-3 border-b border-gray-100 ${
          isNextWeek ? "bg-orange-50 border-orange-200" : "bg-gray-50"
        }`}
      >
        <Calendar
          className={`w-4 h-4 ${
            isNextWeek ? "text-orange-500" : "text-gray-500"
          }`}
        />
        <div className="flex items-center gap-2 flex-1">
          <span
            className={`font-medium ${
              isNextWeek ? "text-orange-700" : "text-gray-700"
            }`}
          >
            {item.dayName}
          </span>
          <span
            className={`text-sm font-medium ${
              isNextWeek ? "text-orange-600" : "text-gray-600"
            }`}
          >
            {dayNumber} {monthName}
          </span>
          {isNextWeek && (
            <span className="text-xs text-orange-600 font-normal">
              (Siguiente semana)
            </span>
          )}
        </div>
        <span
          className={`text-sm ${
            isNextWeek ? "text-orange-600" : "text-gray-500"
          }`}
        >
          ({recordCount} registro{recordCount !== 1 ? "s" : ""})
        </span>
      </Reorder.Item>
    );
  }
);

DayHeader.displayName = "DayHeader";

export default DayHeader;
