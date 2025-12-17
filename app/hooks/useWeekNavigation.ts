import { useState, useMemo, useCallback } from "react";
import { getWeekRangeForDisplay } from "@/app/utils/weekUtils";

export const useWeekNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const weekRange = useMemo(() => {
    return getWeekRangeForDisplay(currentWeekOffset);
  }, [currentWeekOffset]);

  const weekDescription = useMemo(() => {
    if (currentWeekOffset === 0) return "Semana actual";
    if (currentWeekOffset > 0) return `${currentWeekOffset} semana(s) adelante`;
    return `${Math.abs(currentWeekOffset)} semana(s) atrás`;
  }, [currentWeekOffset]);

  const canNavigateToFuture = useMemo(() => {
    return currentWeekOffset < 0;
  }, [currentWeekOffset]);

  const navigateToPreviousWeek = useCallback(() => {
    setCurrentWeekOffset((prev) => prev - 1);
  }, []);

  const navigateToNextWeek = useCallback(() => {
    if (currentWeekOffset < 0) {
      setCurrentWeekOffset((prev) => prev + 1);
    }
  }, [currentWeekOffset]);

  const navigateToCurrentWeek = useCallback(() => {
    setCurrentWeekOffset(0);
  }, []);

  return {
    currentWeekOffset,
    weekRange,
    weekDescription,
    canNavigateToFuture,
    navigateToPreviousWeek,
    navigateToNextWeek,
    navigateToCurrentWeek,
  };
};
