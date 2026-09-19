import { motion } from "framer-motion";
import { Lock, Delete, ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import "./lock-screen.css";

function LockScreen({ theme, onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleNumber = (number) => {
    if (pin.length >= 6) return;

    setPin((current) => current + number);
    setError("");
  };

  const handleDelete = () => {
    setPin((current) => current.slice(0, -1));
    setError("");
  };

  const handleUnlock = useCallback(() => {
    const savedPin = localStorage.getItem("myworld-pin");

    if (!savedPin) {
      onUnlock();
      return;
    }

    if (pin === savedPin) {
      localStorage.removeItem("myworld-locked");
      setPin("");
      setError("");
      onUnlock();
      return;
    }

    setError("Incorrect PIN. Try again.");
    setPin("");
  }, [onUnlock, pin]);

  // Allow Enter key to unlock
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && pin.length >= 4) {
        handleUnlock();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pin, handleUnlock]);

  return (
    <div
      className="lock-screen"
      style={{
        "--lock-bg":
          theme?.colors?.background || "#f8f6f2",
        "--lock-surface":
          theme?.colors?.surface || "#ffffff",
        "--lock-text":
          theme?.colors?.text || "#1f1f1f",
        "--lock-muted":
          theme?.colors?.textMuted || "#777",
        "--lock-accent":
          theme?.colors?.accent || "#8b6f47",
        "--lock-border":
          theme?.colors?.border ||
          "rgba(0,0,0,0.08)",
      }}
    >
      <motion.div
        className="lock-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ICON */}

        <motion.div
          className="lock-icon"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
        >
          <Lock size={27} />
        </motion.div>

        {/* BRAND */}

        <div className="lock-brand">
          <span>MYWORLD</span>
        </div>

        <h1>Your world is locked</h1>

        <p className="lock-description">
          Enter your PIN to return to your diary.
        </p>

        {/* PIN DOTS */}

        <div className="pin-dots">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <motion.span
              key={index}
              className={`pin-dot ${
                index < pin.length
                  ? "pin-dot-filled"
                  : ""
              }`}
              animate={
                index < pin.length
                  ? {
                      scale: [1, 1.25, 1],
                    }
                  : {}
              }
            />
          ))}
        </div>

        {/* ERROR */}

        <motion.div
          className="lock-error"
          initial={false}
          animate={{
            opacity: error ? 1 : 0,
            y: error ? 0 : -5,
          }}
        >
          {error || " "}
        </motion.div>

        {/* KEYPAD */}

        <div className="pin-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
            (number) => (
              <motion.button
                key={number}
                className="pin-key"
                onClick={() =>
                  handleNumber(String(number))
                }
                whileTap={{ scale: 0.92 }}
              >
                {number}
              </motion.button>
            )
          )}

          {/* EMPTY KEY */}

          <motion.button
            className="pin-key pin-key-empty"
            disabled
          />

          {/* ZERO */}

          <motion.button
            className="pin-key"
            onClick={() => handleNumber("0")}
            whileTap={{ scale: 0.92 }}
          >
            0
          </motion.button>

          {/* DELETE */}

          <motion.button
            className="pin-key pin-delete"
            onClick={handleDelete}
            whileTap={{ scale: 0.9 }}
            aria-label="Delete"
          >
            <Delete size={19} />
          </motion.button>
        </div>

        {/* UNLOCK */}

        <motion.button
          className="unlock-button"
          onClick={handleUnlock}
          disabled={pin.length < 4}
          whileHover={
            pin.length >= 4
              ? { y: -2 }
              : {}
          }
          whileTap={
            pin.length >= 4
              ? { scale: 0.97 }
              : {}
          }
        >
          <span>Unlock MyWorld</span>
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default LockScreen;