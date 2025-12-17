import { useState } from "react";
import { getWeekRangeForDisplay } from "@/app/utils/weekUtils";

export const useWeek = () => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());

  const getWeekRange = () => {
    return getWeekRangeForDisplay(0);
  };

  const daysOfWeek = [
    { id: 5, name: "Vie", full: "Viernes", isNextWeek: false },
    { id: 6, name: "Sáb", full: "Sábado", isNextWeek: false },
    { id: 0, name: "Dom", full: "Domingo", isNextWeek: false },
    { id: 1, name: "Lun", full: "Lunes", isNextWeek: false },
    { id: 2, name: "Mar", full: "Martes", isNextWeek: false },
    { id: 3, name: "Mié", full: "Miércoles", isNextWeek: false },
    { id: 4, name: "Jue", full: "Jueves", isNextWeek: false },
    { id: 15, name: "Vie", full: "Viernes", isNextWeek: true },
  ];

  return {
    selectedDay,
    setSelectedDay,
    getWeekRange,
    daysOfWeek,
    selectedDayName:
      daysOfWeek.find((d) => d.id === selectedDay)?.full || "Viernes",
  };
};
