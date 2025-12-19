import { Fragment } from "react";

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
  const getDateForDay = (dayId: number, isNextWeek = false) => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();

    // NUEVA LÓGICA: Si hoy es viernes, retroceder 7 días
    const baseFriday = new Date(today);

    if (currentDayOfWeek === 5) {
      // Viernes: retroceder 7 días
      baseFriday.setDate(today.getDate() - 7);
    } else if (currentDayOfWeek === 6) {
      // Sábado: ir al viernes anterior (ayer)
      baseFriday.setDate(today.getDate() - 1);
    } else if (currentDayOfWeek >= 5) {
      // No debería pasar
      baseFriday.setDate(today.getDate() - (currentDayOfWeek - 5));
    } else {
      // Domingo a jueves: retroceder al viernes anterior
      baseFriday.setDate(today.getDate() - (currentDayOfWeek + 2));
    }

    let targetDayOffset;
    if (isNextWeek) {
      targetDayOffset = 7;
    } else {
      const dayOrder = { 5: 0, 6: 1, 0: 2, 1: 3, 2: 4, 3: 5, 4: 6 };
      targetDayOffset = dayOrder[dayId as keyof typeof dayOrder];
    }

    const targetDate = new Date(baseFriday);
    targetDate.setDate(baseFriday.getDate() + targetDayOffset);

    return targetDate.getDate();
  };

  return (
    <div style={{ display: "flex", width: "100%", gap: "1px" }}>
      {daysOfWeek.map((day) => (
        <Fragment key={day.id}>
          {day.isNextWeek && (
            <div
              style={{
                width: "2px",
                backgroundColor: "#e5e7eb",
                margin: "4px 8px",
                borderRadius: "1px",
                alignSelf: "stretch",
              }}
            />
          )}

          <button
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
                selectedDay === day.id ? "white" : "rgba(255, 255, 255, 0.1)",
              color: selectedDay === day.id ? "#2563eb" : "#6b7280",
              boxShadow:
                selectedDay === day.id
                  ? "0 1px 3px rgba(0, 0, 0, 0.1)"
                  : "none",
              transform: selectedDay === day.id ? "scale(1.05)" : "scale(1)",
              border: "none",
            }}
            onMouseEnter={(e) => {
              if (selectedDay !== day.id) {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDay !== day.id) {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)";
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
        </Fragment>
      ))}
    </div>
  );
}
