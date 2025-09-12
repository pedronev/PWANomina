// app/hooks/useAddCode.ts

import { useState, useCallback } from "react";
import { useRecords } from "./useRecords";
import {
  isValidCode,
  isValidProcess,
  isValidDay,
} from "@/app/utils/recordsUtils";
import type { CreateRecordData } from "@/app/types/records";

interface UseAddCodeReturn {
  readonly selectedProcess: number | null;
  readonly code: string;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly setSelectedProcess: (index: number | null) => void;
  readonly setCode: (code: string) => void;
  readonly handleSave: () => Promise<void>;
  readonly canSave: boolean;
}

export const useAddCode = (
  selectedDay: number,
  processes: readonly string[]
): UseAddCodeReturn => {
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addRecord } = useRecords();

  // Validar si se puede guardar
  const canSave = Boolean(
    selectedProcess !== null &&
      code.trim() &&
      selectedProcess >= 0 &&
      selectedProcess < processes.length &&
      isValidDay(selectedDay) &&
      isValidCode(code)
  );

  // Limpiar error cuando cambian los valores
  const setCodeWithErrorClear = useCallback(
    (newCode: string) => {
      setCode(newCode);
      if (error) setError(null);
    },
    [error]
  );

  const setSelectedProcessWithErrorClear = useCallback(
    (index: number | null) => {
      setSelectedProcess(index);
      if (error) setError(null);
    },
    [error]
  );

  // Función para guardar
  const handleSave = useCallback(async (): Promise<void> => {
    if (!canSave) {
      setError("Por favor completa todos los campos correctamente");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validaciones adicionales
      if (
        selectedProcess === null ||
        selectedProcess < 0 ||
        selectedProcess >= processes.length
      ) {
        throw new Error("Proceso seleccionado no válido");
      }

      if (!isValidCode(code)) {
        throw new Error("El código debe contener solo números");
      }

      if (!isValidDay(selectedDay)) {
        throw new Error("Día seleccionado no válido");
      }

      const processName = processes[selectedProcess];
      if (!isValidProcess(processName)) {
        throw new Error("Proceso no válido");
      }

      // Crear registro
      const recordData: CreateRecordData = {
        day: selectedDay,
        process: processName,
        code: code.trim(),
      };

      const newRecord = addRecord(recordData);

      if (!newRecord) {
        throw new Error("Error al crear el registro");
      }

      // Solo limpiar el código, mantener el proceso seleccionado
      setCode("");

      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      console.error("Error saving record:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [canSave, selectedProcess, code, selectedDay, processes, addRecord]);

  return {
    selectedProcess,
    code,
    isLoading,
    error,
    setSelectedProcess: setSelectedProcessWithErrorClear,
    setCode: setCodeWithErrorClear,
    handleSave,
    canSave,
  };
};
