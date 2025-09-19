"use client";

import { memo } from "react";
import { Reorder } from "framer-motion";
import { Calendar } from "lucide-react";
import type { DaySeparator } from "@/app/types/records";

interface DayHeaderProps {
  readonly item: DaySeparator;
  readonly recordCount: number;
}

const DayHeader = memo(({ item, recordCount }: DayHeaderProps) => {
  const isNextWeek = item.dayId === 15;

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
      <span
        className={`font-medium ${
          isNextWeek ? "text-orange-700" : "text-gray-700"
        }`}
      >
        {item.dayName}
        {isNextWeek && (
          <span className="text-xs text-orange-600 ml-2 font-normal">
            (Siguiente semana)
          </span>
        )}
      </span>
      <span
        className={`text-sm ${
          isNextWeek ? "text-orange-600" : "text-gray-500"
        }`}
      >
        ({recordCount} registro{recordCount !== 1 ? "s" : ""})
      </span>
    </Reorder.Item>
  );
});

DayHeader.displayName = "DayHeader";

export default DayHeader;
