import { memo } from "react";
import { CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessMessageProps {
  readonly message: string | null;
  readonly onDismiss?: () => void;
  readonly className?: string;
}

const SuccessMessage = memo(
  ({ message, onDismiss, className = "" }: SuccessMessageProps) => {
    return (
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />

              <div className="flex-1">
                <p className="text-sm text-green-800 font-medium">{message}</p>
              </div>

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex-shrink-0 p-1 hover:bg-green-100 rounded transition-colors"
                  aria-label="Cerrar mensaje de éxito"
                >
                  <X className="w-4 h-4 text-green-500" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

SuccessMessage.displayName = "SuccessMessage";

export default SuccessMessage;
