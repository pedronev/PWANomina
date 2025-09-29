import { memo, useCallback } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Trash2 } from "lucide-react";
import DragHandle from "./DragHandle";
import type { WorkRecord } from "@/app/types/records";

interface RecordItemProps {
  record: WorkRecord;
  onDelete: (recordId: string) => void;
}

const RecordItem = memo(({ record, onDelete }: RecordItemProps) => {
  const dragControls = useDragControls();

  const handleDelete = useCallback(() => {
    onDelete(record.id);
  }, [onDelete, record.id]);

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragControls.start(e);
    },
    [dragControls]
  );

  return (
    <Reorder.Item
      key={record.id}
      value={record}
      dragListener={false}
      dragControls={dragControls}
      className="px-2 py-1 flex items-center justify-between hover:bg-gray-50 bg-white cursor-default"
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
      data-record-id={record.id}
    >
      <div className="flex items-center gap-3 flex-1">
        <DragHandle onPointerDown={startDrag} />

        <div className="flex-1 pointer-events-none">
          <p className="font-bold text-gray-900 text-lg">{record.code}</p>
          <p className="text-sm text-gray-500">{record.process}</p>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors pointer-events-auto"
        aria-label={`Eliminar registro ${record.code}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </Reorder.Item>
  );
});

RecordItem.displayName = "RecordItem";

export default RecordItem;
