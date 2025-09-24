import { motion } from "framer-motion";
import { memo } from "react";

interface DragHandleProps {
  className?: string;
  onPointerDown?: (e: React.PointerEvent) => void;
}

const DragHandle = memo(
  ({ className = "", onPointerDown }: DragHandleProps) => {
    return (
      <motion.div
        className={`cursor-grab active:cursor-grabbing p-2 rounded hover:bg-gray-200 transition-colors select-none ${className}`}
        onPointerDown={onPointerDown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        style={{ touchAction: "none" }} // Importante para touch devices
      >
        <div className="flex flex-col items-center justify-center w-6 h-6">
          <div className="w-4 h-0.5 bg-gray-400 rounded-full mb-0.5"></div>
          <div className="w-4 h-0.5 bg-gray-400 rounded-full mb-0.5"></div>
          <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
        </div>
      </motion.div>
    );
  }
);

DragHandle.displayName = "DragHandle";

export default DragHandle;
