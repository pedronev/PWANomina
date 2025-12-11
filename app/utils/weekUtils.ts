export const getPostgreSQLWeek = (date: Date): string => {
  const currentDay = date.getDay();

  // Calcular el viernes de la semana actual (viernes a jueves)
  const friday = new Date(date);
  if (currentDay >= 5) {
    friday.setDate(date.getDate() - (currentDay - 5));
  } else {
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
