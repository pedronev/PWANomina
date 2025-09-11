import { useMemo, useCallback } from "react";
import { DAYS_OF_WEEK } from "@/app/utils/daysUtils";
import type { WorkRecord } from "./useRecords";

export const useDragDrop = (
  records: WorkRecord[],
  getRecordsForDay: (dayId: number) => WorkRecord[],
  reorderRecords: (newOrder: any[]) => void
) => {
  // Crear array plano optimizado para drag & drop
  const flattenedItems = useMemo(() => {
    const flattened: (
      | WorkRecord
      | { type: "separator"; dayId: number; dayName: string }
    )[] = [];

    DAYS_OF_WEEK.forEach((day) => {
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
  }, [getRecordsForDay]);

  // Función optimizada para manejar reordenamiento
  const handleReorder = useCallback(
    (newOrder: any[]) => {
      reorderRecords(newOrder);
    },
    [reorderRecords]
  );

  return {
    flattenedItems,
    handleReorder,
  };
};
