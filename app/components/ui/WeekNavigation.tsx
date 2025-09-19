import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavigationProps {
  weekRange: string;
  weekDescription: string;
  canNavigateToFuture: boolean;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const WeekNavigation = memo(
  ({
    weekRange,
    weekDescription,
    canNavigateToFuture,
    onPreviousWeek,
    onNextWeek,
  }: WeekNavigationProps) => {
    return (
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onPreviousWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="text-center">
            <h2 className="font-semibold text-gray-900">{weekRange}</h2>
            <p className="text-xs text-gray-500">{weekDescription}</p>
          </div>

          {canNavigateToFuture ? (
            <button
              onClick={onNextWeek}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <div className="p-2 w-9 h-9" />
          )}
        </div>
      </div>
    );
  }
);

WeekNavigation.displayName = "WeekNavigation";

export default WeekNavigation;
