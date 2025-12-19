// Calcula la semana de UNA FECHA ESPECÍFICA (sin lógica de retroceder)
export const getPostgreSQLWeek = (date: Date): string => {
  const currentDay = date.getDay();

  // Encontrar el VIERNES de la semana de esta fecha
  const friday = new Date(date);

  if (currentDay === 5) {
    // Si ES viernes, usar ese mismo viernes
    // NO retroceder
  } else if (currentDay === 6) {
    // Sábado: viernes fue ayer
    friday.setDate(date.getDate() - 1);
  } else if (currentDay === 0) {
    // Domingo: viernes fue hace 2 días
    friday.setDate(date.getDate() - 2);
  } else {
    // Lunes-Jueves: retroceder al viernes de esta semana
    friday.setDate(date.getDate() - (currentDay + 2));
  }

  const yearStart = new Date(friday.getFullYear(), 0, 1);
  const firstFriday = new Date(yearStart);
  const startDay = yearStart.getDay();

  if (startDay <= 5) {
    firstFriday.setDate(yearStart.getDate() + (5 - startDay));
  } else {
    firstFriday.setDate(yearStart.getDate() + (12 - startDay));
  }

  const weekNumber =
    Math.floor(
      (friday.getTime() - firstFriday.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ) + 1;

  return `${friday.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
};

// Calcula qué semana MOSTRAR en la UI (con lógica de retroceder en viernes)
export const getDisplayWeek = (date: Date): string => {
  const currentDay = date.getDay();
  const baseFriday = new Date(date);

  // Aplicar lógica de "qué semana mostrar"
  if (currentDay === 5) {
    baseFriday.setDate(date.getDate() - 7);
  } else if (currentDay === 6) {
    baseFriday.setDate(date.getDate() - 1);
  } else {
    baseFriday.setDate(date.getDate() - (currentDay + 2));
  }

  // Ahora sí calcular la semana de ese viernes
  return getPostgreSQLWeek(baseFriday);
};

export const getWeekRangeForDisplay = (weekOffset: number = 0): string => {
  const today = new Date();
  const currentDay = today.getDay();

  const baseFriday = new Date(today);

  if (currentDay === 5) {
    baseFriday.setDate(today.getDate() - 7);
  } else if (currentDay === 6) {
    baseFriday.setDate(today.getDate() - 1);
  } else {
    baseFriday.setDate(today.getDate() - (currentDay + 2));
  }

  baseFriday.setDate(baseFriday.getDate() + weekOffset * 7);

  const nextFriday = new Date(baseFriday);
  nextFriday.setDate(baseFriday.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  return `${formatDate(baseFriday)} - ${formatDate(nextFriday)}`;
};
