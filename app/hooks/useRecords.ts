import { useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type {
  WorkRecord,
  CreateRecordData,
  RecordStats,
  ReorderItem,
  RecordsHookReturn,
} from "@/app/types/records";
import {
  STORAGE_KEY,
  INITIAL_RECORDS,
  DEFAULT_DAY,
} from "@/app/constants/records";
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

export const useRecords = (): RecordsHookReturn => {
  const [records, setRecords] = useLocalStorage<WorkRecord[]>(STORAGE_KEY, [
    ...INITIAL_RECORDS,
  ]);

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
        day: data.day,
        process: formatProcess(data.process),
        code: formatCode(data.code),
        date: getCurrentDate(),
        createdAt: getCurrentTimestamp(),
      };

      setRecords((prev) => [...prev, newRecord]);
      return newRecord;
    },
    [setRecords]
  );

  const deleteRecord = useCallback(
    (recordId: string): boolean => {
      if (!isValidRecordId(recordId)) {
        console.error("Invalid record ID");
        return false;
      }

      const recordExists = records.some((record) => record.id === recordId);
      if (!recordExists) {
        console.warn(`Record with ID ${recordId} not found`);
        return false;
      }

      setRecords((prev) => prev.filter((record) => record.id !== recordId));
      return true;
    },
    [records, setRecords]
  );

  const reorderRecords = useCallback(
    (newOrder: ReorderItem[]): void => {
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

      setRecords(updatedRecords);
    },
    [records, setRecords]
  );

  const clearAllRecords = useCallback((): void => {
    setRecords([]);
  }, [setRecords]);

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
