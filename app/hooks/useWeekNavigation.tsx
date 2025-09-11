import { useState, useMemo, useCallback } from "react";

export const useWeekNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Memoizar el cálculo del rango de semana
  const weekRange = useMemo(() => {
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
  }, [currentWeekOffset]);

  // Memoizar el texto descriptivo de la semana
  const weekDescription = useMemo(() => {
    if (currentWeekOffset === 0) return "Semana actual";
    if (currentWeekOffset > 0) return `${currentWeekOffset} semana(s) adelante`;
    return `${Math.abs(currentWeekOffset)} semana(s) atrás`;
  }, [currentWeekOffset]);

  // Funciones de navegación memoizadas
  const navigateToPreviousWeek = useCallback(() => {
    setCurrentWeekOffset((prev) => prev - 1);
  }, []);

  const navigateToNextWeek = useCallback(() => {
    setCurrentWeekOffset((prev) => prev + 1);
  }, []);

  const navigateToCurrentWeek = useCallback(() => {
    setCurrentWeekOffset(0);
  }, []);

  return {
    currentWeekOffset,
    weekRange,
    weekDescription,
    navigateToPreviousWeek,
    navigateToNextWeek,
    navigateToCurrentWeek,
  };
};
