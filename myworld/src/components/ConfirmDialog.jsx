import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import "./confirm-dialog.css";

function ConfirmDialog({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="confirm-dialog-backdrop">
      <motion.div
        className="confirm-dialog"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="confirm-dialog-icon">
          <AlertTriangle size={20} />
        </div>

        <div className="confirm-dialog-content">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>

        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="confirm-dialog-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ConfirmDialog;