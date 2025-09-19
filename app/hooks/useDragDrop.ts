import { useMemo, useCallback } from "react";
import { DAYS_OF_WEEK } from "@/app/utils/daysUtils";
import type { WorkRecord } from "@/app/types/records";

export const useDragDrop = (
  records: WorkRecord[],
  getRecordsForDay: (dayId: number) => WorkRecord[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reorderRecords: (newOrder: any[]) => void
) => {
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

  const handleReorder = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
