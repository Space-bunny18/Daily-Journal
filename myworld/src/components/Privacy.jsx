import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  Smartphone,
  Eye,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { exportMemoryData } from "../utils/exportMemoryData";
import "./privacy.css";

function Privacy({
  theme,
  onBack,
  autoLockMinutes,
  onAutoLockChange,
  themes,
  onThemeChange,
  onLogout,
  memories,
}) {
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [pinConfigured, setPinConfigured] = useState(() => {
    return Boolean(localStorage.getItem("myworld-pin"));
  });

  return (
    <div
      className="privacy-page"
      style={{
        "--privacy-bg":
          theme?.colors?.background || "#f8f6f2",
        "--privacy-surface":
          theme?.colors?.surface || "#ffffff",
        "--privacy-text":
          theme?.colors?.text || "#1f1f1f",
        "--privacy-muted":
          theme?.colors?.textMuted || "#777",
        "--privacy-accent":
          theme?.colors?.accent || "#8b6f47",
        "--privacy-border":
          theme?.colors?.border || "rgba(0,0,0,0.08)",
      }}
    >
      <div className="privacy-container">
        {/* BACK BUTTON */}

        <motion.button
          className="privacy-back"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.96 }}
        >
          <ArrowLeft size={19} />
          <span>Back</span>
        </motion.button>

        {/* HEADER */}

        <motion.div
          className="privacy-header"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="privacy-header-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <p className="privacy-eyebrow">
              YOUR SPACE
            </p>

            <h1>Privacy & Security</h1>

            <p>
              Keep your memories personal, private,
              and protected.
            </p>
          </div>
        </motion.div>

        {/* APP SECURITY */}

        <div className="privacy-section">
          <h2>App Security</h2>

          {/* APP LOCK */}

          <motion.div
            className="privacy-card"
            whileHover={{ y: -2 }}
          >
            <div className="privacy-card-icon">
              <Lock size={21} />
            </div>

            <div className="privacy-card-content">
              <h3>App Lock</h3>

              <p>
                Require a PIN before opening your diary.
              </p>
            </div>

            <button
              className="privacy-card-action privacy-action-button"
              onClick={() => {
                setShowPinSetup(true);
                setPin("");
                setConfirmPin("");
                setPinError("");
              }}
            >
              <span>
                {pinConfigured ? "Change" : "Set up"}
              </span>

              <ChevronRight size={18} />
            </button>

            {pinConfigured && (
              <div className="privacy-status privacy-status-active">
                Enabled
              </div>
            )}
            {pinConfigured && (
              <button
                className="disable-pin-button"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Disable App Lock? Your diary will no longer require a PIN."
                  );

                  if (!confirmed) return;

                  localStorage.removeItem("myworld-pin");
                  localStorage.removeItem("myworld-locked");

                  setPinConfigured(false);
                }}
              >
                Disable App Lock
              </button>
            )}
          </motion.div>

          {/* LOCK MYWORLD */}

          {pinConfigured && (
            <motion.button
              className="lock-myworld-button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                localStorage.setItem(
                  "myworld-locked",
                  "true"
                );

                window.location.reload();
              }}
            >
              <Lock size={18} />

              <div>
                <strong>Lock MyWorld</strong>

                <span>
                  Lock your diary until your PIN is entered.
                </span>
              </div>

              <ChevronRight size={18} />
            </motion.button>
          )}

          {/* DEVICE PRIVACY */}

          <motion.div
            className="privacy-card"
            whileHover={{ y: -2 }}
          >
            <div className="privacy-card-icon">
              <Smartphone size={21} />
            </div>

            <div className="privacy-card-content">
              <h3>Device Privacy</h3>

              <p>
                Your diary stays on this device for now.
              </p>
            </div>

            <div className="privacy-status">
              <span className="privacy-status-dot" />
              Local
            </div>
          </motion.div>
        </div>
        <div className="privacy-section">
          <h2>Appearance</h2>

          <div className="theme-settings-grid">
            {themes.map((item) => (
              <motion.button
                key={item.id}
                className={`theme-settings-card ${
                  theme?.id === item.id
                    ? "theme-settings-card-active"
                    : ""
                }`}
                onClick={() => onThemeChange(item.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="theme-settings-preview"
                  style={{
                    background: item.colors.background,
                  }}
                >
                  <span
                    style={{
                      background: item.colors.accent,
                    }}
                  />
                  <span
                    style={{
                      background: item.colors.text,
                    }}
                  />
                  <span
                    style={{
                      background: item.colors.surface,
                    }}
                  />
                </div>

                <div className="theme-settings-info">
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </div>

                {theme?.id === item.id && (
                  <span className="theme-settings-check">
                    ✓
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="privacy-section">
          <h2>Automatic Lock</h2>

          <motion.div
            className="privacy-card"
            whileHover={{ y: -2 }}
          >
            <div className="privacy-card-icon">
              <Lock size={21} />
            </div>

            <div className="privacy-card-content">
              <h3>Auto-Lock</h3>
              <p>
                Automatically lock your diary after inactivity.
              </p>
            </div>

            <select
              className="privacy-select"
              value={autoLockMinutes}
              onChange={(event) => {
                onAutoLockChange(event.target.value);
              }}
            >
              <option value="never">Never</option>
              <option value="1">1 min</option>
              <option value="5">5 min</option>
              <option value="15">15 min</option>
            </select>
          </motion.div>
        </div>

        {/* PRIVACY */}
        <div className="privacy-section">
          <h2>Privacy</h2>

          <motion.div
            className="privacy-card"
            whileHover={{ y: -2 }}
          >
            <div className="privacy-card-icon">
              <Eye size={21} />
            </div>

            <div className="privacy-card-content">
              <h3>Private by default</h3>

              <p>
                Your diary entries aren't publicly visible.
              </p>
            </div>

            <div className="privacy-status privacy-status-active">
              Protected
            </div>
          </motion.div>
        </div>
        {/* ACCOUNT */}

        <div className="privacy-section">
          <h2>Account</h2>

          <motion.button
            className="privacy-card"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            style={{
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              border: "1px solid var(--privacy-border)",
              color: "var(--privacy-text)",
            }}
          >
            <div className="privacy-card-icon">
              <ArrowLeft size={21} />
            </div>

            <div className="privacy-card-content">
              <h3>Log out</h3>

              <p>
                Sign out of your MyWorld account on this device.
              </p>
            </div>

            <ChevronRight size={18} />
          </motion.button>
        </div>
        <motion.button
          className="privacy-card"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            exportMemoryData(memories);
          }}
          style={{
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            border: "1px solid var(--privacy-border)",
            color: "var(--privacy-text)",
          }}
        >
          <div className="privacy-card-icon">
            <ShieldCheck size={21} />
          </div>

          <div className="privacy-card-content">
            <h3>Export My Data</h3>

            <p>
              Download a backup of your MyWorld memories.
            </p>
          </div>

          <ChevronRight size={18} />
        </motion.button>
        {/* NOTE */}
        <div className="privacy-note">
          <Lock size={16} />

          <span>
            More privacy controls can be added as
            MyWorld grows.
          </span>
        </div>
      </div>

      {/* PIN SETUP MODAL */}

      <AnimatePresence>
        {showPinSetup && (
          <motion.div
            className="pin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pin-modal"
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
            >
              {/* CLOSE */}

              <button
                className="pin-close"
                onClick={() => {
                  setShowPinSetup(false);
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* ICON */}

              <div className="pin-modal-icon">
                <Lock size={24} />
              </div>

              <h2>
                {pinConfigured
                  ? "Change your PIN"
                  : "Set your PIN"}
              </h2>

              <p>
                {pinConfigured
                  ? "Create a new PIN to protect your personal diary."
                  : "Create a PIN to protect your personal diary."}
              </p>

              {/* PIN */}

              <label>
                PIN
              </label>

              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(event) => {
                  const value =
                    event.target.value.replace(/\D/g, "");

                  setPin(value);
                  setPinError("");
                }}
                placeholder="Enter 4–6 digits"
              />

              {/* CONFIRM PIN */}

              <label>
                Confirm PIN
              </label>

              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={confirmPin}
                onChange={(event) => {
                  const value =
                    event.target.value.replace(/\D/g, "");

                  setConfirmPin(value);
                  setPinError("");
                }}
                placeholder="Enter PIN again"
              />

              {/* ERROR */}

              {pinError && (
                <p className="pin-error">
                  {pinError}
                </p>
              )}

              {/* SAVE */}

              <button
                className="pin-save-button"
                onClick={() => {
                  if (
                    pin.length < 4 ||
                    pin.length > 6
                  ) {
                    setPinError(
                      "PIN must be 4–6 digits."
                    );
                    return;
                  }

                  if (pin !== confirmPin) {
                    setPinError(
                      "PINs do not match."
                    );
                    return;
                  }

                  localStorage.setItem(
                    "myworld-pin",
                    pin
                  );

                  setPinConfigured(true);

                  setShowPinSetup(false);
                  setPin("");
                  setConfirmPin("");
                  setPinError("");
                }}
              >
                {pinConfigured
                  ? "Update PIN"
                  : "Continue"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Privacy;