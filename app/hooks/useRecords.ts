import { useMemo, useCallback, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import type {
  WorkRecord,
  CreateRecordData,
  RecordStats,
  ReorderItem,
  RecordsHookReturn,
} from "@/app/types/records";
import { DEFAULT_DAY } from "@/app/constants/records";
import {
  getCurrentTimestamp,
  isValidDay,
  isValidCode,
  isValidProcess,
  isValidRecordId,
  formatCode,
  formatProcess,
} from "@/app/utils/recordsUtils";
import { getDisplayWeek, getPostgreSQLWeek } from "../utils/weekUtils";

interface CodigoFromDB {
  id: string;
  empleado_id: string;
  codigo: string;
  proceso: string;
  fecha: string;
  creado_en: string;
  year_week: string;
}

export const useRecords = (weekOffset: number = 0): RecordsHookReturn => {
  const { user } = useAuth();
  const [records, setRecords] = useState<WorkRecord[]>([]);

  // Función auxiliar para convertir fecha a día de la semana según el sistema de la PWA
  const getDayFromDate = (dateString: string): number => {
    const date = new Date(dateString + "T00:00:00");
    const dayOfWeek = date.getDay();
    return dayOfWeek;
  };

  const fetchRecords = useCallback(async () => {
    if (!user) {
      setRecords([]);
      return;
    }

    try {
      const today = new Date();
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + weekOffset * 7);

      const currentWeek = getDisplayWeek(targetDate);

      // Calcular la siguiente semana para el viernes extra
      const nextWeekDate = new Date(targetDate);
      nextWeekDate.setDate(targetDate.getDate() + 7);
      const nextWeek = getPostgreSQLWeek(nextWeekDate);

      // Traer registros de ambas semanas
      const response = await fetch(
        `/api/codigos-trabajo?empleado_id=${user.id}&year_weeks=${currentWeek},${nextWeek}`
      );
      if (!response.ok) throw new Error("Error al obtener códigos");

      const codigosData: CodigoFromDB[] = await response.json();

      const workRecords: WorkRecord[] = codigosData
        .map((codigo) => {
          const day = getDayFromDate(codigo.fecha);

          // Filtrar: de currentWeek traer todos, de nextWeek solo viernes
          const codigoWeek = codigo.year_week;
          if (codigoWeek === nextWeek && day !== 5) {
            return null; // Excluir registros que no sean viernes de la semana siguiente
          }

          // Asignar dayId 15 al viernes de la siguiente semana
          const displayDay = codigoWeek === nextWeek && day === 5 ? 15 : day;

          return {
            id: codigo.id,
            user_id: user.id,
            day: displayDay,
            process: codigo.proceso,
            code: codigo.codigo,
            date: codigo.fecha,
            createdAt: codigo.creado_en,
          };
        })
        .filter((record): record is WorkRecord => record !== null);

      setRecords(workRecords);
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]);
    }
  }, [user, weekOffset]);
  // Cargar datos al inicializar o cambiar usuario
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

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
    async (data: CreateRecordData): Promise<WorkRecord | null> => {
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

      try {
        const today = new Date();
        const currentDay = today.getDay();

        // USAR LA MISMA LÓGICA QUE weekUtils.ts
        const baseFriday = new Date(today);

        if (currentDay === 5) {
          // Viernes: retroceder 7 días
          baseFriday.setDate(today.getDate() - 7);
        } else if (currentDay === 6) {
          // Sábado: retroceder 1 día (al viernes anterior)
          baseFriday.setDate(today.getDate() - 1);
        } else {
          // Domingo a jueves: retroceder al viernes anterior
          baseFriday.setDate(today.getDate() - (currentDay + 2));
        }

        // Aplicar el weekOffset
        const targetFriday = new Date(baseFriday);
        targetFriday.setDate(baseFriday.getDate() + weekOffset * 7);

        // Mapear dayId a offset desde el viernes
        const dayOffsets: { [key: number]: number } = {
          5: 0, // Viernes
          6: 1, // Sábado
          0: 2, // Domingo
          1: 3, // Lunes
          2: 4, // Martes
          3: 5, // Miércoles
          4: 6, // Jueves
          15: 7, // Viernes siguiente
        };

        // Calcular la fecha objetivo
        const targetDate = new Date(targetFriday);
        targetDate.setDate(targetFriday.getDate() + dayOffsets[data.day]);

        // Formatear fecha en formato YYYY-MM-DD
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, "0");
        const day = String(targetDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        const response = await fetch("/api/codigos-trabajo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            empleado_id: user.id,
            codigo: data.code,
            proceso: data.process,
            fecha: formattedDate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al guardar código");
        }

        const savedCodigo = await response.json();

        const newRecord: WorkRecord = {
          id: savedCodigo.id,
          user_id: user.id,
          day: data.day,
          process: formatProcess(data.process),
          code: formatCode(data.code),
          date: formattedDate,
          createdAt: savedCodigo.creado_en || getCurrentTimestamp(),
        };

        setRecords((prev) => [...prev, newRecord]);
        return newRecord;
      } catch (error) {
        console.error("Error guardando código:", error);
        throw error;
      }
    },
    [user, weekOffset]
  );

  const deleteRecord = useCallback(
    async (recordId: string): Promise<boolean> => {
      if (!user) {
        console.error("Usuario no autenticado");
        return false;
      }

      if (!isValidRecordId(recordId)) {
        console.error("Invalid record ID");
        return false;
      }

      try {
        const response = await fetch(`/api/codigos-trabajo/${recordId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar código");
        }

        setRecords((prev) => prev.filter((record) => record.id !== recordId));
        return true;
      } catch (error) {
        console.error("Error eliminando código:", error);
        return false;
      }
    },
    [user]
  );

  const reorderRecords = useCallback(
    async (newOrder: ReorderItem[]): Promise<void> => {
      if (!user) {
        console.error("Usuario no autenticado");
        return;
      }

      const updatedRecords: WorkRecord[] = [];
      const updatePromises: Promise<Response>[] = [];
      let currentDay: number = DEFAULT_DAY;

      const getDayDate = (dayId: number): string => {
        const today = new Date();
        const currentDayOfWeek = today.getDay();

        const targetDate = new Date(today); // Cambiar let a const

        let dayDiff = 0;
        if (currentDayOfWeek >= 5) {
          const daysSinceFriday = currentDayOfWeek - 5;
          const dayOrder: { [key: number]: number } = {
            5: 0,
            6: 1,
            0: 2,
            1: 3,
            2: 4,
            3: 5,
            4: 6,
            15: 7,
          };
          dayDiff = dayOrder[dayId] - daysSinceFriday;
        } else {
          const daysSinceFriday = currentDayOfWeek + 2;
          const dayOrder: { [key: number]: number } = {
            5: 0,
            6: 1,
            0: 2,
            1: 3,
            2: 4,
            3: 5,
            4: 6,
            15: 7,
          };
          dayDiff = dayOrder[dayId] - daysSinceFriday;
        }

        targetDate.setDate(today.getDate() + dayDiff);
        return targetDate.toISOString().split("T")[0];
      };

      newOrder.forEach((item) => {
        if ("type" in item && item.type === "separator") {
          if (isValidDay(item.dayId)) {
            currentDay = item.dayId;
          }
        } else if ("id" in item && item.id) {
          const existingRecord = records.find((r) => r.id === item.id);
          if (existingRecord) {
            const newDate = getDayDate(currentDay);
            const updatedRecord = {
              ...existingRecord,
              day: currentDay,
              date: newDate,
            };

            updatedRecords.push(updatedRecord);

            if (existingRecord.date !== newDate) {
              const updatePromise = fetch("/api/codigos-trabajo/update-fecha", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  codigo_id: existingRecord.id,
                  nueva_fecha: newDate,
                }),
              });

              updatePromises.push(updatePromise);
            }
          }
        }
      });

      setRecords(updatedRecords);

      if (updatePromises.length > 0) {
        try {
          await Promise.all(updatePromises);
        } catch (error) {
          console.error("Error actualizando fechas en BD:", error);
        }
      }
    },
    [user, records]
  );

  const clearAllRecords = useCallback((): void => {
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

    setRecords([]);
  }, [user]);

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
