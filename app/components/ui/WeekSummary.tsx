import { memo } from "react";

interface WeekSummaryProps {
  totalRecords: number;
  workingDays: number;
}

const WeekSummary = memo(({ totalRecords, workingDays }: WeekSummaryProps) => {
  return (
    <div className="bg-white border-t border-gray-100 p-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
          <p className="text-xs text-gray-500">Total registros</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">{workingDays}</p>
          <p className="text-xs text-gray-500">Días trabajados</p>
        </div>
      </div>
    </div>
  );
});

WeekSummary.displayName = "WeekSummary";

export default WeekSummary;
