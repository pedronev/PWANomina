// app/constants/records.ts

import type { WorkRecord } from "@/app/types/records";

export const STORAGE_KEY = "work-records" as const;

export const VALID_DAYS = [0, 1, 2, 3, 4, 5, 6, 15] as const; // Agregado 15 para viernes siguiente

export const DEFAULT_DAY = 5 as const; // Viernes

export const INITIAL_RECORDS: readonly WorkRecord[] = [
  {
    id: "demo-1",
    day: 1,
    process: "Proceso A",
    code: "12345",
    date: "2024-09-02",
    createdAt: "2024-09-02T10:00:00.000Z",
  },
  {
    id: "demo-2",
    day: 1,
    process: "Proceso B",
    code: "67890",
    date: "2024-09-02",
    createdAt: "2024-09-02T11:00:00.000Z",
  },
  {
    id: "demo-3",
    day: 2,
    process: "Proceso A",
    code: "11111",
    date: "2024-09-03",
    createdAt: "2024-09-03T09:00:00.000Z",
  },
  {
    id: "demo-4",
    day: 4,
    process: "Proceso C",
    code: "22222",
    date: "2024-09-05",
    createdAt: "2024-09-05T14:00:00.000Z",
  },
] as const;
