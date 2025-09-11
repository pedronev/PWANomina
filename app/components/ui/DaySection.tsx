import { memo } from "react";
import { Reorder } from "framer-motion";
import { Calendar } from "lucide-react";
import RecordItem from "./RecordItem";
import type { WorkRecord } from "@/app/hooks/useRecords";

interface DaySectionProps {
  dayId: number;
  dayName: string;
  records: WorkRecord[];
  onDeleteRecord: (recordId: string) => void;
}

const DaySection = memo(
  ({ dayId, dayName, records, onDeleteRecord }: DaySectionProps) => {
    const recordCount = records.length;

    return (
      <div className="border-b border-gray-100">
        {/* Header del día */}
        <Reorder.Item
          key={`separator-${dayId}`}
          value={{ type: "separator", dayId, dayName }}
          dragListener={false}
          className="bg-gray-50 px-4 py-3 flex items-center gap-3 border-b border-gray-100"
        >
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">{dayName}</span>
          <span className="text-sm text-gray-500">
            ({recordCount} registro{recordCount !== 1 ? "s" : ""})
          </span>
        </Reorder.Item>

        {/* Registros del día */}
        {records.map((record) => (
          <RecordItem
            key={record.id}
            record={record}
            onDelete={onDeleteRecord}
          />
        ))}

        {/* Mensaje cuando no hay registros */}
        {recordCount === 0 && (
          <div className="px-4 py-6 text-center text-gray-500">
            <p className="text-sm">Sin registros</p>
          </div>
        )}
      </div>
    );
  }
);

DaySection.displayName = "DaySection";

export default DaySection;
