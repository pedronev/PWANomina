export interface DayInfo {
  id: number;
  name: string;
  full: string;
}

export const DAYS_OF_WEEK: DayInfo[] = [
  { id: 5, name: "Vie", full: "Viernes" },
  { id: 6, name: "Sáb", full: "Sábado" },
  { id: 0, name: "Dom", full: "Domingo" },
  { id: 1, name: "Lun", full: "Lunes" },
  { id: 2, name: "Mar", full: "Martes" },
  { id: 3, name: "Mié", full: "Miércoles" },
  { id: 4, name: "Jue", full: "Jueves" },
];

export const getDayName = (dayId: number): string => {
  return DAYS_OF_WEEK.find((d) => d.id === dayId)?.full || "";
};

export const getDayShortName = (dayId: number): string => {
  return DAYS_OF_WEEK.find((d) => d.id === dayId)?.name || "";
};
