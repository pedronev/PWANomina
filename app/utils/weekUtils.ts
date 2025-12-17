export const getPostgreSQLWeek = (date: Date): string => {
  const currentDay = date.getDay();

  // Calcular el viernes de la semana actual (viernes a viernes)
  // CAMBIO: Si es viernes (5), quedarse en esa semana
  const friday = new Date(date);
  if (currentDay === 6) {
    // Sábado: ir al viernes anterior
    friday.setDate(date.getDate() - 1);
  } else if (currentDay >= 5) {
    // Viernes: quedarse en el mismo día
    // No hacer nada
  } else {
    // Domingo a jueves: retroceder al viernes anterior
    friday.setDate(date.getDate() - (currentDay + 2));
  }

  // Calcular el primer viernes del año
  const yearStart = new Date(friday.getFullYear(), 0, 1);
  const firstFriday = new Date(yearStart);
  const startDay = yearStart.getDay();

  if (startDay <= 5) {
    firstFriday.setDate(yearStart.getDate() + (5 - startDay));
  } else {
    firstFriday.setDate(yearStart.getDate() + (12 - startDay));
  }

  // Calcular número de semana
  const weekNumber =
    Math.floor(
      (friday.getTime() - firstFriday.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ) + 1;

  return `${friday.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
};

// Función auxiliar para mostrar en la UI
export const getWeekRangeForDisplay = (weekOffset: number = 0): string => {
  const today = new Date();
  const currentDay = today.getDay();

  // Calcular el viernes base
  const baseFriday = new Date(today);
  if (currentDay === 6) {
    // Sábado: ir al viernes anterior
    baseFriday.setDate(today.getDate() - 1);
  } else if (currentDay >= 5) {
    // Viernes: quedarse
  } else {
    // Domingo a jueves: retroceder
    baseFriday.setDate(today.getDate() - (currentDay + 2));
  }

  // Aplicar offset
  baseFriday.setDate(baseFriday.getDate() + weekOffset * 7);

  // Viernes siguiente
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
