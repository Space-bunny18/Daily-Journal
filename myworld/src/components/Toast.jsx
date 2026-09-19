import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import "./toast.css";

function Toast({
  message,
  type = "success",
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const isError = type === "error";

  return (
    <motion.div
      className={`toast ${
        isError ? "toast-error" : "toast-success"
      }`}
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: 20,
        scale: 0.96,
      }}
      transition={{ duration: 0.2 }}
    >
      {isError ? (
        <AlertCircle size={18} />
      ) : (
        <CheckCircle2 size={18} />
      )}

      <span>{message}</span>

      <button
        className="toast-close"
        onClick={() => onClose?.()}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
}

export default Toast;