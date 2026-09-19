import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Heart,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import "./mood-timeline.css";

const MOODS = [
  { emoji: "😊", name: "Happy" },
  { emoji: "😌", name: "Calm" },
  { emoji: "🥰", name: "Loved" },
  { emoji: "😐", name: "Neutral" },
  { emoji: "😔", name: "Sad" },
  { emoji: "😤", name: "Frustrated" },
  { emoji: "😭", name: "Emotional" },
];

function MoodTimeline({
  theme,
  memories,
  onBack,
}) {
  const colors = theme.colors;

  const moodStats = useMemo(() => {
    return MOODS.map((mood) => {
      const count = memories.filter(
        (memory) => memory.mood === mood.emoji
      ).length;

      return {
        ...mood,
        count,
      };
    });
  }, [memories]);

  const totalMoodEntries = moodStats.reduce(
    (total, mood) => total + mood.count,
    0
  );

  const mostCommonMood = useMemo(() => {
    if (!moodStats.length) return null;

    return [...moodStats].sort(
      (a, b) => b.count - a.count
    )[0];
  }, [moodStats]);

  const moodTimeline = useMemo(() => {
    return [...memories]
      .filter((memory) => memory.mood)
      .sort((a, b) => {
        const aTime = Number(a.id);
        const bTime = Number(b.id);

        if (
          Number.isFinite(aTime) &&
          Number.isFinite(bTime)
        ) {
          return bTime - aTime;
        }

        return 0;
      })
      .slice(0, 12);
  }, [memories]);

  return (
    <main
      className={`mood-timeline-page theme-${theme.id}`}
      style={{
        "--theme-bg": colors.background,
        "--theme-bg-secondary":
          colors.backgroundSecondary,
        "--theme-surface": colors.surface,
        "--theme-text": colors.text,
        "--theme-muted": colors.textMuted,
        "--theme-accent": colors.accent,
        "--theme-accent-soft": colors.accentSoft,
        "--theme-border": colors.border,
      }}
    >
      <div className="mood-ambient mood-ambient-one" />
      <div className="mood-ambient mood-ambient-two" />

      {/* NAVBAR */}

      <nav className="mood-timeline-nav">
        <motion.button
          className="mood-back-button"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={17} />
          <span>Back to my world</span>
        </motion.button>

        <div className="mood-brand">
          <span>
            <Sparkles size={15} />
          </span>
          MYWORLD
        </div>

        <div className="mood-nav-label">
          <BarChart3 size={14} />
          Mood timeline
        </div>
      </nav>

      <section className="mood-timeline-content">

        {/* HEADER */}

        <motion.div
          className="mood-heading"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <span className="mood-eyebrow">
            <Heart size={13} />
            HOW YOU'VE BEEN FEELING
          </span>

          <h1>
            Your emotions,
            <br />
            <em>over time.</em>
          </h1>

          <p>
            A gentle look at the moods you've
            captured throughout your journey.
          </p>
        </motion.div>

        {/* SUMMARY */}

        <div className="mood-summary-grid">

          <motion.div
            className="mood-summary-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
          >
            <span className="summary-icon">
              🌈
            </span>

            <div>
              <strong>
                {totalMoodEntries}
              </strong>

              <span>
                Mood entries
              </span>
            </div>
          </motion.div>

          <motion.div
            className="mood-summary-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.18,
            }}
          >
            <span className="summary-icon">
              {mostCommonMood?.emoji || "✨"}
            </span>

            <div>
              <strong>
                {mostCommonMood
                  ? mostCommonMood.name
                  : "No mood yet"}
              </strong>

              <span>
                Most recorded mood
              </span>
            </div>
          </motion.div>

        </div>

        {/* MOOD BREAKDOWN */}

        <motion.section
          className="mood-breakdown"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
          }}
        >
          <div className="section-heading">
            <div>
              <span>MOOD BREAKDOWN</span>
              <h2>Your emotional palette</h2>
            </div>

            <BarChart3 size={19} />
          </div>

          <div className="mood-bars">
            {moodStats.map((mood, index) => {
              const percentage =
                totalMoodEntries > 0
                  ? Math.round(
                      (mood.count /
                        totalMoodEntries) *
                        100
                    )
                  : 0;

              return (
                <div
                  className="mood-bar-row"
                  key={mood.emoji}
                >
                  <div className="mood-bar-label">
                    <span className="mood-bar-emoji">
                      {mood.emoji}
                    </span>

                    <span className="mood-bar-name">
                      {mood.name}
                    </span>
                  </div>

                  <div className="mood-bar-track">
                    <motion.div
                      className="mood-bar-fill"
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${percentage}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        delay:
                          0.35 + index * 0.08,
                      }}
                    />
                  </div>

                  <span className="mood-bar-count">
                    {mood.count}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* TIMELINE */}

        <motion.section
          className="mood-history"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
          }}
        >
          <div className="section-heading">
            <div>
              <span>RECENT EMOTIONS</span>
              <h2>Your mood journey</h2>
            </div>

            <CalendarDays size={19} />
          </div>

          {moodTimeline.length > 0 ? (
            <div className="mood-history-list">
              {moodTimeline.map(
                (memory, index) => (
                  <motion.div
                    className="mood-history-item"
                    key={
                      memory.id ||
                      `${memory.date}-${index}`
                    }
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        0.4 + index * 0.06,
                    }}
                  >
                    <div className="mood-history-line">
                      <span className="mood-history-dot">
                        {memory.mood}
                      </span>

                      {index <
                        moodTimeline.length - 1 && (
                        <span className="mood-history-connector" />
                      )}
                    </div>

                    <div className="mood-history-content">
                      <div className="mood-history-top">
                        <strong>
                          {MOODS.find(
                            (mood) =>
                              mood.emoji ===
                              memory.mood
                          )?.name ||
                            "Mood"}
                        </strong>

                        <span>
                          {memory.date}
                        </span>
                      </div>

                      <h3>
                        {memory.title ||
                          "Untitled memory"}
                      </h3>

                      <p>
                        {memory.text ||
                          "A moment worth remembering."}
                      </p>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          ) : (
            <div className="mood-empty">
              <div>🌱</div>

              <h3>
                Your mood story starts here.
              </h3>

              <p>
                Add your first diary entry and
                choose how you're feeling.
              </p>
            </div>
          )}
        </motion.section>

      </section>
    </main>
  );
}

export default MoodTimeline;