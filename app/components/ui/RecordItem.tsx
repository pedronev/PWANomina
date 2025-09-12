import { memo, useCallback } from "react";
import { Reorder } from "framer-motion";
import { Trash2 } from "lucide-react";
import DragHandle from "./DragHandle";
import type { WorkRecord } from "@/app/types/records";

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
      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 bg-white"
      style={{
        transition: "background-color 0.15s ease",
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
        backgroundColor: "#f8fafc",
        zIndex: 1000,
        rotate: 1,
      }}
      // Forzar reset de animaciones cuando termina el drag
      animate={{
        scale: 1,
        boxShadow: "0 0px 0px rgba(0,0,0,0)",
        backgroundColor: "#ffffff",
        zIndex: 1,
        rotate: 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      dragElastic={0.1}
      dragTransition={{
        bounceStiffness: 600,
        bounceDamping: 20,
      }}
      // Callback cuando termina el drag
      onDragEnd={() => {
        // Forzar reset manual si es necesario
        setTimeout(() => {
          const element = document.querySelector(
            `[data-record-id="${record.id}"]`
          );
          if (element) {
            (element as HTMLElement).style.transform = "none";
            (element as HTMLElement).style.zIndex = "1";
          }
        }, 100);
      }}
      data-record-id={record.id}
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
