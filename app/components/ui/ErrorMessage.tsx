import { memo } from "react";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorMessageProps {
  readonly message: string | null;
  readonly onDismiss?: () => void;
  readonly className?: string;
}

const ErrorMessage = memo(
  ({ message, onDismiss, className = "" }: ErrorMessageProps) => {
    return (
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />

              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">{message}</p>
              </div>

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
                  aria-label="Cerrar mensaje de error"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

ErrorMessage.displayName = "ErrorMessage";

export default ErrorMessage;
