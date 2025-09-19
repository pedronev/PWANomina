import { useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "@/app/context/AuthContext";
import type {
  WorkRecord,
  CreateRecordData,
  RecordStats,
  ReorderItem,
  RecordsHookReturn,
} from "@/app/types/records";
import { STORAGE_KEY, DEFAULT_DAY } from "@/app/constants/records";
import {
  generateId,
  getCurrentDate,
  getCurrentTimestamp,
  isValidDay,
  isValidCode,
  isValidProcess,
  isValidRecordId,
  formatCode,
  formatProcess,
} from "@/app/utils/recordsUtils";

export const useRecords = (weekOffset: number = 0): RecordsHookReturn => {
  const { user } = useAuth();
  const [allRecords, setAllRecords] = useLocalStorage<WorkRecord[]>(
    STORAGE_KEY,
    []
  );

  // Filtrar solo los registros del usuario autenticado
  const records = useMemo(() => {
    if (!user) return [];

    const today = new Date();
    const currentDay = today.getDay();

    // Calcular el viernes de la semana seleccionada
    const friday = new Date(today);
    if (currentDay >= 5) {
      friday.setDate(today.getDate() - (currentDay - 5) + weekOffset * 7);
    } else {
      friday.setDate(today.getDate() - (currentDay + 2) + weekOffset * 7);
    }

    const thursday = new Date(friday);
    thursday.setDate(friday.getDate() + 6);

    // Formatear fechas para comparación
    const startDate = friday.toISOString().split("T")[0];
    const endDate = thursday.toISOString().split("T")[0];

    return allRecords.filter((record) => {
      return (
        record.user_id === user.id &&
        record.date >= startDate &&
        record.date <= endDate
      );
    });
  }, [allRecords, user, weekOffset]);

  // Queries
  const getRecordsForDay = useCallback(
    (dayId: number): WorkRecord[] => {
      if (!isValidDay(dayId)) {
        console.warn(`Invalid day ID: ${dayId}`);
        return [];
      }
      return records.filter((record) => record.day === dayId);
    },
    [records]
  );

  const findRecordsByCode = useCallback(
    (code: string): WorkRecord[] => {
      if (!code?.trim()) return [];
      const searchCode = code.trim().toLowerCase();
      return records.filter((record) =>
        record.code.toLowerCase().includes(searchCode)
      );
    },
    [records]
  );

  const getRecordsByProcess = useCallback(
    (process: string): WorkRecord[] => {
      if (!process?.trim()) return [];
      return records.filter((record) => record.process === process.trim());
    },
    [records]
  );

  // Mutations
  const addRecord = useCallback(
    (data: CreateRecordData): WorkRecord | null => {
      if (!user) {
        console.error("Usuario no autenticado");
        return null;
      }

      if (!isValidDay(data.day)) {
        console.error(`Invalid day: ${data.day}`);
        return null;
      }

      if (!isValidCode(data.code)) {
        console.error(`Invalid code: ${data.code}`);
        return null;
      }

      if (!isValidProcess(data.process)) {
        console.error(`Invalid process: ${data.process}`);
        return null;
      }

      const newRecord: WorkRecord = {
        id: generateId(),
        user_id: user.id,
        day: data.day,
        process: formatProcess(data.process),
        code: formatCode(data.code),
        date: getCurrentDate(),
        createdAt: getCurrentTimestamp(),
      };

      setAllRecords((prev) => [...prev, newRecord]);
      return newRecord;
    },
    [user, setAllRecords]
  );

  const deleteRecord = useCallback(
    (recordId: string): boolean => {
      if (!user) {
        console.error("Usuario no autenticado");
        return false;
      }

      if (!isValidRecordId(recordId)) {
        console.error("Invalid record ID");
        return false;
      }

      const recordExists = records.some((record) => record.id === recordId);
      if (!recordExists) {
        console.warn(`Record with ID ${recordId} not found`);
        return false;
      }

      setAllRecords((prev) => prev.filter((record) => record.id !== recordId));
      return true;
    },
    [user, records, setAllRecords]
  );

  const reorderRecords = useCallback(
    (newOrder: ReorderItem[]): void => {
      if (!user) {
        console.error("Usuario no autenticado");
        return;
      }

      const updatedRecords: WorkRecord[] = [];
      let currentDay: number = DEFAULT_DAY;

      newOrder.forEach((item) => {
        if ("type" in item && item.type === "separator") {
          if (isValidDay(item.dayId)) {
            currentDay = item.dayId;
          }
        } else if ("id" in item && item.id) {
          const existingRecord = records.find((r) => r.id === item.id);
          if (existingRecord) {
            updatedRecords.push({
              ...existingRecord,
              day: currentDay,
            });
          }
        }
      });

      // Actualizar solo los registros del usuario actual
      setAllRecords((prev) => {
        const otherUsersRecords = prev.filter(
          (record) => record.user_id !== user.id
        );
        return [...otherUsersRecords, ...updatedRecords];
      });
    },
    [user, records, setAllRecords]
  );

  const clearAllRecords = useCallback((): void => {
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

    setAllRecords((prev) =>
      prev.filter((record) => record.user_id !== user.id)
    );
  }, [user, setAllRecords]);

  // Stats
  const stats = useMemo((): RecordStats => {
    const recordsByDay: Record<number, number> = {};

    records.forEach((record) => {
      recordsByDay[record.day] = (recordsByDay[record.day] || 0) + 1;
    });

    return {
      totalRecords: records.length,
      workingDays: Object.keys(recordsByDay).length,
      recordsByDay,
    };
  }, [records]);

  return {
    records,
    getRecordsForDay,
    findRecordsByCode,
    getRecordsByProcess,
    stats,
    addRecord,
    deleteRecord,
    reorderRecords,
    clearAllRecords,
  };
};
