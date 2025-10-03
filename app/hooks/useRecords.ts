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
  getCurrentDate,
  getCurrentTimestamp,
  isValidDay,
  isValidCode,
  isValidProcess,
  isValidRecordId,
  formatCode,
  formatProcess,
} from "@/app/utils/recordsUtils";

interface CodigoFromDB {
  id: string;
  empleado_id: string;
  codigo: string;
  proceso: string;
  fecha: string;
  creado_en: string;
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

  // Función para obtener códigos de la base de datos
  const fetchRecords = useCallback(async () => {
    if (!user) {
      setRecords([]);
      return;
    }

    try {
      // Usar la misma lógica que el trigger de la BD
      const today = new Date();

      // Ajustar fecha basada en weekOffset
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + weekOffset * 7);

      // Calcular year_week usando la misma lógica que PostgreSQL TO_CHAR
      const getPostgreSQLWeek = (date: Date): string => {
        const year = date.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const days = Math.floor(
          (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
        );
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
      };

      const currentWeek = getPostgreSQLWeek(targetDate);

      console.log("Fecha objetivo:", targetDate.toISOString());
      console.log("Semana calculada:", currentWeek);
      console.log("WeekOffset:", weekOffset);

      const response = await fetch(
        `/api/codigos-trabajo?empleado_id=${user.id}&year_week=${currentWeek}`
      );
      if (!response.ok) throw new Error("Error al obtener códigos");

      const codigosData: CodigoFromDB[] = await response.json();
      console.log("Códigos obtenidos:", codigosData);

      const workRecords: WorkRecord[] = codigosData.map((codigo) => {
        const day = getDayFromDate(codigo.fecha);

        return {
          id: codigo.id,
          user_id: user.id,
          day: day,
          process: codigo.proceso,
          code: codigo.codigo,
          date: codigo.fecha,
          createdAt: codigo.creado_en,
        };
      });

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
        const response = await fetch("/api/codigos-trabajo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            empleado_id: user.id,
            codigo: data.code,
            proceso: data.process,
            fecha: getCurrentDate(),
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
          date: getCurrentDate(),
          createdAt: savedCodigo.creado_en || getCurrentTimestamp(),
        };

        setRecords((prev) => [...prev, newRecord]);
        return newRecord;
      } catch (error) {
        console.error("Error guardando código:", error);
        throw error;
      }
    },
    [user]
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
          console.log(
            `${updatePromises.length} fechas actualizadas en la base de datos`
          );
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
