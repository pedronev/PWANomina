// app/utils/recordsUtils.ts

import { VALID_DAYS } from "@/app/constants/records";

// Generadores
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const getCurrentDate = (): string => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Validaciones
export const isValidDay = (day: number): day is (typeof VALID_DAYS)[number] => {
  return VALID_DAYS.includes(day as (typeof VALID_DAYS)[number]);
};

export const isValidCode = (code: string): boolean => {
  return code.trim().length > 0 && /^\d+$/.test(code.trim());
};

export const isValidProcess = (process: string): boolean => {
  return process.trim().length > 0;
};

export const isValidRecordId = (id: string): boolean => {
  return Boolean(id?.trim());
};

// Formatters
export const formatCode = (code: string): string => {
  return code.trim();
};

export const formatProcess = (process: string): string => {
  return process.trim();
};
