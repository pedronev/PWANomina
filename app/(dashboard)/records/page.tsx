"use client";

import { Reorder } from "framer-motion";
import DashboardLayout from "@/app/components/layout/DashboardLayout";
import WeekNavigation from "@/app/components/ui/WeekNavigation";
import DaySection from "@/app/components/ui/DaySection";
import WeekSummary from "@/app/components/ui/WeekSummary";
import { useRecords } from "@/app/hooks/useRecords";
import { useWeekNavigation } from "@/app/hooks/useWeekNavigation";
import { DAYS_OF_WEEK } from "@/app/utils/daysUtils";

export default function RecordsPage() {
  const { records, getRecordsForDay, deleteRecord, reorderRecords, stats } =
    useRecords();

  const {
    weekRange,
    weekDescription,
    navigateToPreviousWeek,
    navigateToNextWeek,
  } = useWeekNavigation();

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
            values={[]} // Simplificado por ahora
            onReorder={reorderRecords}
            className="divide-y divide-gray-100"
          >
            {DAYS_OF_WEEK.map((day) => {
              const dayRecords = getRecordsForDay(day.id);

              return (
                <DaySection
                  key={day.id}
                  dayId={day.id}
                  dayName={day.full}
                  records={dayRecords}
                  onDeleteRecord={deleteRecord}
                />
              );
            })}
          </Reorder.Group>

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
