export interface DayInfo {
  readonly id: number;
  readonly name: string;
  readonly full: string;
  readonly isNextWeek?: boolean;
}

export const DAYS_OF_WEEK: readonly DayInfo[] = [
  { id: 5, name: "Vie", full: "Viernes", isNextWeek: false },
  { id: 6, name: "Sáb", full: "Sábado", isNextWeek: false },
  { id: 0, name: "Dom", full: "Domingo", isNextWeek: false },
  { id: 1, name: "Lun", full: "Lunes", isNextWeek: false },
  { id: 2, name: "Mar", full: "Martes", isNextWeek: false },
  { id: 3, name: "Mié", full: "Miércoles", isNextWeek: false },
  { id: 4, name: "Jue", full: "Jueves", isNextWeek: false },
  { id: 15, name: "Vie", full: "Viernes", isNextWeek: true }, // 15 = viernes siguiente
] as const;

export const getDayName = (dayId: number): string => {
  const day = DAYS_OF_WEEK.find((d) => d.id === dayId);
  return day?.full || "";
};

export const getDayShortName = (dayId: number): string => {
  const day = DAYS_OF_WEEK.find((d) => d.id === dayId);
  return day?.name || "";
};

export const isNextWeekDay = (dayId: number): boolean => {
  return dayId === 15;
};

export const getDisplayName = (dayId: number): string => {
  const day = DAYS_OF_WEEK.find((d) => d.id === dayId);
  if (!day) return "";

  if (day.isNextWeek) {
    return `${day.full} (Siguiente)`;
  }

  return day.full;
};
