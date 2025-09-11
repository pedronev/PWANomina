import { memo, useCallback } from "react";
import { Reorder } from "framer-motion";
import { Trash2 } from "lucide-react";
import DragHandle from "./DragHandle";
import type { WorkRecord } from "@/app/hooks/useRecords";

interface RecordItemProps {
  record: WorkRecord;
  onDelete: (recordId: string) => void;
}

const RecordItem = memo(({ record, onDelete }: RecordItemProps) => {
  const handleDelete = useCallback(() => {
    onDelete(record.id);
  }, [onDelete, record.id]);

  return (
    <Reorder.Item
      key={record.id}
      value={record}
      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 bg-white"
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        backgroundColor: "#f8fafc",
        zIndex: 1000,
      }}
      animate={{
        scale: 1,
        boxShadow: "0 0px 0px rgba(0,0,0,0)",
        backgroundColor: "#ffffff",
        zIndex: 1,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <DragHandle />

        <div className="flex-1">
          <p className="font-bold text-gray-900 text-lg">{record.code}</p>
          <p className="text-sm text-gray-500">{record.process}</p>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        aria-label={`Eliminar registro ${record.code}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </Reorder.Item>
  );
});

RecordItem.displayName = "RecordItem";

export default RecordItem;
