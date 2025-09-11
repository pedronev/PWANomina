import { useState } from "react";

export const useWeek = () => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());

  const getWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calcular viernes de la semana actual (viernes a jueves)
    let friday;
    if (currentDay >= 5) {
      // Si es viernes (5) o sábado (6)
      friday = new Date(today);
      friday.setDate(today.getDate() - (currentDay - 5));
    } else {
      // Si es domingo (0) a jueves (4)
      friday = new Date(today);
      friday.setDate(today.getDate() - (currentDay + 2));
    }

    // Viernes de la siguiente semana
    const nextFriday = new Date(friday);
    nextFriday.setDate(friday.getDate() + 7);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
      });
    };

    return `${formatDate(friday)} - ${formatDate(nextFriday)}`;
  };

  const daysOfWeek = [
    { id: 5, name: "Vie", full: "Viernes", isNextWeek: false },
    { id: 6, name: "Sáb", full: "Sábado", isNextWeek: false },
    { id: 0, name: "Dom", full: "Domingo", isNextWeek: false },
    { id: 1, name: "Lun", full: "Lunes", isNextWeek: false },
    { id: 2, name: "Mar", full: "Martes", isNextWeek: false },
    { id: 3, name: "Mié", full: "Miércoles", isNextWeek: false },
    { id: 4, name: "Jue", full: "Jueves", isNextWeek: false },
    { id: 15, name: "Vie", full: "Viernes", isNextWeek: true }, // 15 = viernes siguiente
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
