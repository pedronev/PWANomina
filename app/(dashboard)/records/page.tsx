"use client";

import { useMemo } from "react";
import { Reorder } from "framer-motion";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import WeekNavigation from "@/app/components/ui/WeekNavigation";
import WeekSummary from "@/app/components/ui/WeekSummary";
import RecordItem from "@/app/components/ui/RecordItem";
import DayHeader from "@/app/components/ui/DayHeader";
import { useRecords } from "@/app/hooks/useRecords";
import { useWeekNavigation } from "@/app/hooks/useWeekNavigation";
import { DAYS_OF_WEEK } from "@/app/utils/daysUtils";
import type { WorkRecord } from "@/app/types/records";

export default function RecordsPage() {
  const { records, getRecordsForDay, deleteRecord, reorderRecords, stats } =
    useRecords();

  const {
    weekRange,
    weekDescription,
    navigateToPreviousWeek,
    navigateToNextWeek,
  } = useWeekNavigation();

  // Crear array plano con separadores para drag & drop
  const flattenedItems = useMemo(() => {
    const flattened: (
      | WorkRecord
      | { type: "separator"; dayId: number; dayName: string }
    )[] = [];

    DAYS_OF_WEEK.forEach((day) => {
      // Agregar separador del día
      flattened.push({
        type: "separator",
        dayId: day.id,
        dayName: day.full,
      });

      // Agregar registros del día
      const dayRecords = getRecordsForDay(day.id);
      flattened.push(...dayRecords);
    });

    return flattened;
  }, [getRecordsForDay]);

  return (
    <DashboardLayout title="Registros">
      <div className="h-full flex flex-col">
        <WeekNavigation
          weekRange={weekRange}
          weekDescription={weekDescription}
          onPreviousWeek={navigateToPreviousWeek}
          onNextWeek={navigateToNextWeek}
        />

        <div className="flex-1 overflow-auto">
          <Reorder.Group
            axis="y"
            values={flattenedItems}
            onReorder={reorderRecords}
            className="divide-y divide-gray-100"
            layoutScroll
            style={{
              overflowY: "auto",
            }}
          >
            {flattenedItems.map((item) => {
              // Si es un separador de día
              if ("type" in item && item.type === "separator") {
                const dayRecords = getRecordsForDay(item.dayId);
                return (
                  <DayHeader
                    key={`separator-${item.dayId}`}
                    item={item}
                    recordCount={dayRecords.length}
                  />
                );
              }

              // Si es un registro
              const record = item as WorkRecord;
              return (
                <RecordItem
                  key={record.id}
                  record={record}
                  onDelete={deleteRecord}
                />
              );
            })}
          </Reorder.Group>

          {/* Mensaje cuando no hay registros */}
          {records.length === 0 && (
            <div className="px-4 py-12 text-center text-gray-500">
              <p className="text-sm">No hay registros esta semana</p>
            </div>
          )}
        </div>

        <WeekSummary
          totalRecords={stats.totalRecords}
          workingDays={stats.workingDays}
        />
      </div>
    </DashboardLayout>
  );
}
