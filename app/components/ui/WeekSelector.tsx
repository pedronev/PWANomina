interface WeekSelectorProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
  daysOfWeek: Array<{
    id: number;
    name: string;
    full: string;
    isNextWeek?: boolean;
  }>;
}

export default function WeekSelector({
  selectedDay,
  onDaySelect,
  daysOfWeek,
}: WeekSelectorProps) {
  // Calcular fecha para cada día de la semana actual (viernes a jueves + viernes siguiente)
  const getDateForDay = (dayId: number, isNextWeek = false) => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0=domingo, 1=lunes, etc.

    // Determinar cuántos días desde el viernes de esta semana
    let daysSinceFriday;
    if (currentDayOfWeek >= 5) {
      // viernes=5, sábado=6
      daysSinceFriday = currentDayOfWeek - 5;
    } else {
      // domingo=0, lunes=1, martes=2, miércoles=3, jueves=4
      daysSinceFriday = currentDayOfWeek + 2;
    }

    let targetDayOffset;

    if (isNextWeek) {
      // Viernes de la siguiente semana
      targetDayOffset = 7; // 7 días después del viernes actual
    } else {
      // Orden de días en nuestra semana: vie=0, sáb=1, dom=2, lun=3, mar=4, mié=5, jue=6
      const dayOrder = { 5: 0, 6: 1, 0: 2, 1: 3, 2: 4, 3: 5, 4: 6 };
      targetDayOffset = dayOrder[dayId as keyof typeof dayOrder];
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - daysSinceFriday + targetDayOffset);

    return targetDate.getDate();
  };

  return (
    <div style={{ display: "flex", width: "100%", gap: "1px" }}>
      {daysOfWeek.map((day) => (
        <button
          key={day.id}
          onClick={() => onDaySelect(day.id)}
          style={{
            flex: "1 1 0",
            minWidth: "0",
            padding: "8px 1px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            backgroundColor:
              selectedDay === day.id
                ? "white"
                : day.isNextWeek
                ? "rgba(251, 146, 60, 0.15)" // Orange background for next week
                : "rgba(255, 255, 255, 0.1)",
            color:
              selectedDay === day.id
                ? "#2563eb"
                : day.isNextWeek
                ? "#ea580c" // Orange text for next week
                : "#6b7280",
            boxShadow:
              selectedDay === day.id
                ? "0 1px 3px rgba(0, 0, 0, 0.1)"
                : day.isNextWeek
                ? "0 1px 2px rgba(251, 146, 60, 0.2)"
                : "none",
            transform: selectedDay === day.id ? "scale(1.05)" : "scale(1)",
            border: day.isNextWeek
              ? "1px solid rgba(251, 146, 60, 0.3)"
              : "none",
          }}
          onMouseEnter={(e) => {
            if (selectedDay !== day.id) {
              e.currentTarget.style.backgroundColor = day.isNextWeek
                ? "rgba(251, 146, 60, 0.25)"
                : "rgba(255, 255, 255, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedDay !== day.id) {
              e.currentTarget.style.backgroundColor = day.isNextWeek
                ? "rgba(251, 146, 60, 0.15)"
                : "rgba(255, 255, 255, 0.1)";
            }
          }}
        >
          <div style={{ lineHeight: "1" }}>
            <div style={{ opacity: "0.75", marginBottom: "1px" }}>
              {getDateForDay(day.id === 15 ? 5 : day.id, day.isNextWeek)}
            </div>
            <div>{day.name}</div>
            {day.isNextWeek && (
              <div
                style={{ fontSize: "8px", opacity: "0.7", marginTop: "1px" }}
              >
                Sig.
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
