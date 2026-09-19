import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import themes from "../themes/themes";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import "./Onboarding.css";

function Onboarding({ onBack, onComplete }) {
  const [selectedTheme, setSelectedTheme] = React.useState(null);

  const selected = themes.find((theme) => theme.id === selectedTheme);

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className={`onboarding onboarding-${selectedTheme || "default"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="onboarding-background">
          <div className="onboarding-glow glow-one" />
          <div className="onboarding-glow glow-two" />

          <div className="mini-stars">
            {Array.from({ length: 15 }).map((_, index) => (
              <motion.span
                key={index}
                className="mini-star"
                style={{
                  left: `${(index * 37) % 100}%`,
                  top: `${(index * 61) % 100}%`,
                }}
                animate={{
                  opacity: [0.1, 0.8, 0.1],
                  scale: [0.7, 1.2, 0.7],
                }}
                transition={{
                  duration: 2.5 + (index % 3),
                  repeat: Infinity,
                  delay: index * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        <header className="onboarding-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={17} />
            <span>Back</span>
          </button>

          <div className="onboarding-brand">
            <Sparkles size={16} />
            MYWORLD
          </div>

          <div className="step-indicator">
            <span className="step-active">01</span>
            <span>/</span>
            <span>02</span>
          </div>
        </header>

        <section className="onboarding-content">
          <motion.div
            className="onboarding-heading"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="small-heading">
              <Sparkles size={13} />
              Let's make it yours
            </span>

            <h1>
              Choose your
              <br />
              <em>world.</em>
            </h1>

            <p>
              Your diary should feel like <strong>you.</strong>
              <br />
              Pick the atmosphere that feels most like home.
            </p>
          </motion.div>

          <div className="theme-grid">
            {themes.map((theme, index) => {
              const isSelected = selectedTheme === theme.id;

              return (
                <motion.button
                  key={theme.id}
                  className={`theme-card ${
                    isSelected ? "theme-selected" : ""
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -7,
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                >
                  <div className="theme-preview">
                    <div
                      className="preview-gradient"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${theme.preview[0]}, transparent 35%), radial-gradient(circle at 80% 70%, ${theme.preview[1]}, transparent 40%), ${theme.preview[2]}`,
                      }}
                    />

                    <span className="theme-large-icon">
                      {theme.icon}
                    </span>

                    <div className="preview-sparkle sparkle-a">✦</div>
                    <div className="preview-sparkle sparkle-b">·</div>

                    {isSelected && (
                      <motion.div
                        className="selected-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>

                  <div className="theme-info">
                    <div>
                      <h3>{theme.name}</h3>
                      <p>{theme.description}</p>
                    </div>

                    <ArrowRight size={17} className="theme-arrow" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            className="onboarding-bottom"
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedTheme ? 1 : 0.35 }}
          >
            <div className="selection-message">
              {selected ? (
                <>
                  <span>{selected.icon}</span>
                  You're choosing <strong>{selected.name}</strong>
                </>
              ) : (
                <>
                  <span>✦</span>
                  You can change this anytime
                </>
              )}
            </div>

            <motion.button
              className="continue-button"
              disabled={!selectedTheme}
              whileHover={selectedTheme ? { scale: 1.03 } : {}}
              whileTap={selectedTheme ? { scale: 0.97 } : {}}
              onClick={() => {
                if (selectedTheme) {
                  onComplete(selectedTheme);
                }
              }}
            >
              <span>Enter my world</span>
              <span className="continue-icon">
                <ArrowRight size={18} />
              </span>
            </motion.button>
          </motion.div>
        </section>
      </motion.main>
    </AnimatePresence>
  );
}

export default Onboarding;