import { useState, useMemo, useCallback } from "react";

export interface WorkRecord {
  id: string;
  day: number;
  process: string;
  code: string;
  date: string;
}

const INITIAL_RECORDS: WorkRecord[] = [
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
];

export const useRecords = () => {
  const [records, setRecords] = useState<WorkRecord[]>(INITIAL_RECORDS);

  // Memoizar función de filtrado por día
  const getRecordsForDay = useCallback(
    (dayId: number) => {
      return records.filter((record) => record.day === dayId);
    },
    [records]
  );

  // Memoizar función de eliminación
  const deleteRecord = useCallback((recordId: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== recordId));
  }, []);

  // Memoizar función de reordenamiento
  const reorderRecords = useCallback(
    (
      newOrder: (
        | WorkRecord
        | { type: "separator"; dayId: number; dayName: string }
      )[]
    ) => {
      const updatedRecords: WorkRecord[] = [];
      let currentDay = 5; // Empieza en viernes

      newOrder.forEach((item) => {
        if ("type" in item && item.type === "separator") {
          currentDay = item.dayId;
        } else if ("id" in item) {
          updatedRecords.push({
            ...item,
            day: currentDay,
          });
        }
      });

      setRecords(updatedRecords);
    },
    []
  );

  // Memoizar estadísticas
  const stats = useMemo(() => {
    const totalRecords = records.length;
    const uniqueDays = new Set(records.map((r) => r.day)).size;

    return {
      totalRecords,
      workingDays: uniqueDays,
    };
  }, [records]);

  return {
    records,
    getRecordsForDay,
    deleteRecord,
    reorderRecords,
    stats,
  };
};
