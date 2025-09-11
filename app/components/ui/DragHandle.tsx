import { motion } from "framer-motion";
import { memo } from "react";

interface DragHandleProps {
  className?: string;
}

const DragHandle = memo(({ className = "" }: DragHandleProps) => {
  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 transition-colors ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center justify-center w-6 h-6 px-1">
        <div className="w-4 h-0.5 bg-gray-400 rounded-full mb-0.5"></div>
        <div className="w-4 h-0.5 bg-gray-400 rounded-full mb-0.5"></div>
        <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
      </div>
    </motion.div>
  );
});

DragHandle.displayName = "DragHandle";

export default DragHandle;
