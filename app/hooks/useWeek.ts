import { useState } from "react";
import { getWeekRangeForDisplay } from "@/app/utils/weekUtils";

export const useWeek = () => {
  // NUEVA LÓGICA: Determinar el día seleccionado correcto
  const getInitialSelectedDay = () => {
    const today = new Date();
    const currentDay = today.getDay();
    // Si es viernes, seleccionar el día 15 (viernes siguiente en la vista)
    // porque estamos mostrando la semana anterior
    if (currentDay === 5) {
      return 15;
    }
    return currentDay;
  };

  const [selectedDay, setSelectedDay] = useState<number>(
    getInitialSelectedDay()
  );

  const getWeekRange = () => {
    const result = getWeekRangeForDisplay(0);
    return result;
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
