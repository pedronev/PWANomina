export const getPostgreSQLWeek = (date: Date): string => {
  const currentDay = date.getDay();

  const friday = new Date(date);

  // NUEVA LÓGICA: El viernes siempre retrocede una semana
  if (currentDay === 5) {
    // Viernes: retroceder 7 días al viernes anterior
    friday.setDate(date.getDate() - 7);
  } else if (currentDay === 6) {
    // Sábado: ir al viernes anterior (ayer)
    friday.setDate(date.getDate() - 1);
  } else {
    // Domingo a jueves: retroceder al viernes anterior
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

  const result = `${friday.getFullYear()}-W${weekNumber
    .toString()
    .padStart(2, "0")}`;

  return result;
};

export const getWeekRangeForDisplay = (weekOffset: number = 0): string => {
  const today = new Date();
  const currentDay = today.getDay();

  const baseFriday = new Date(today);

  // NUEVA LÓGICA PARA DISPLAY
  if (currentDay === 5) {
    // Viernes: retroceder 7 días (mostrar semana anterior)
    baseFriday.setDate(today.getDate() - 7);
  } else if (currentDay === 6) {
    // Sábado: ir al viernes anterior (ayer)
    baseFriday.setDate(today.getDate() - 1);
  } else {
    // Domingo a jueves: retroceder al viernes anterior
    baseFriday.setDate(today.getDate() - (currentDay + 2));
  }

  // Aplicar offset
  baseFriday.setDate(baseFriday.getDate() + weekOffset * 7);

  // Viernes siguiente (7 días después)
  const nextFriday = new Date(baseFriday);
  nextFriday.setDate(baseFriday.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  const result = `${formatDate(baseFriday)} - ${formatDate(nextFriday)}`;

  return result;
};
