import { motion } from "framer-motion";
import {
  ArrowRight,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import "./daily-prompt.css";

const prompts = [
  "What's something small that made today better?",
  "What is one thing you're grateful for today?",
  "What made you smile when you least expected it?",
  "What is something you want to remember about today?",
  "If today had a soundtrack, what song would it be?",
  "What is something you're looking forward to?",
  "What thought has been on your mind lately?",
  "What is one thing you did today that you're proud of?",
  "Who made your day a little brighter?",
  "What would you tell your future self about today?",
  "What felt peaceful today?",
  "What is something you almost forgot but want to remember?",
  "What are you feeling right now, without judging it?",
  "What little moment deserves a place in your diary?",
];

function DailyPrompt({
  theme,
  onWrite,
}) {
  const colors = theme.colors;

  const today = new Date();

  // Keeps the same prompt throughout the day.
  const dayIndex =
    Math.floor(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).getTime() /
        (1000 * 60 * 60 * 24)
    ) % prompts.length;

  const prompt = prompts[dayIndex];

  return (
    <motion.section
      className="daily-prompt"
      style={{
        "--theme-bg": colors.background,
        "--theme-bg-secondary":
          colors.backgroundSecondary,
        "--theme-surface": colors.surface,
        "--theme-text": colors.text,
        "--theme-muted": colors.textMuted,
        "--theme-accent": colors.accent,
        "--theme-accent-soft":
          colors.accentSoft,
        "--theme-border": colors.border,
      }}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
    >
      <div className="daily-prompt-glow" />

      <div className="daily-prompt-icon">
        <Lightbulb size={19} />
      </div>

      <div className="daily-prompt-content">
        <span className="daily-prompt-eyebrow">
          <Sparkles size={12} />
          TODAY'S THOUGHT
        </span>

        <p>{prompt}</p>

        <motion.button
          className="daily-prompt-button"
          onClick={() => onWrite(prompt)}
          whileHover={{
            x: 3,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          Write about it
          <ArrowRight size={15} />
        </motion.button>
      </div>
    </motion.section>
  );
}

export default DailyPrompt;