import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Music,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import "./on-this-day.css";

function OnThisDay({
  theme,
  memories,
  onBack,
  onOpenMemory,
}) {
  const colors = theme.colors;

const today = new Date();

const todayMonth = today.getMonth();
const todayDay = today.getDate();
const todayYear = today.getFullYear();

const monthName = today.toLocaleDateString(
  "en-US",
  {
    month: "long",
  }
);

const dayNumber = todayDay;

const onThisDayMemories = useMemo(() => {
  return memories
    .map((memory) => {
      let memoryDate = null;

      // Prefer the actual saved diary date
      if (memory.date) {
        const parsedDate = new Date(memory.date);

        if (!Number.isNaN(parsedDate.getTime())) {
          memoryDate = parsedDate;
        }
      }

      // Fallback for older memories
      if (!memoryDate && memory.id) {
        const timestamp = Number(memory.id);

        if (Number.isFinite(timestamp)) {
          const parsedDate = new Date(timestamp);

          if (!Number.isNaN(parsedDate.getTime())) {
            memoryDate = parsedDate;
          }
        }
      }

      if (!memoryDate) {
        return null;
      }

      return {
        memory,
        memoryDate,
      };
    })
    .filter(Boolean)
    .filter(({ memoryDate }) => {
      return (
        memoryDate.getMonth() === todayMonth &&
        memoryDate.getDate() === todayDay &&
        memoryDate.getFullYear() !== todayYear
      );
    })
    .sort((a, b) => {
      return (
        b.memoryDate.getFullYear() -
        a.memoryDate.getFullYear()
      );
    })
    .map(({ memory }) => memory);
}, [
  memories,
  todayMonth,
  todayDay,
  todayYear,
]);

  return (
    <main
      className={`on-this-day-page theme-${theme.id}`}
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
    >
      <div className="otd-ambient otd-ambient-one" />
      <div className="otd-ambient otd-ambient-two" />

      {/* NAVBAR */}

      <nav className="otd-nav">
        <motion.button
          className="otd-back"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={17} />
          <span>Back to my world</span>
        </motion.button>

        <div className="otd-brand">
          <span>
            <Sparkles size={15} />
          </span>

          MYWORLD
        </div>

        <div className="otd-nav-label">
          <CalendarDays size={14} />
          On this day
        </div>
      </nav>

      {/* CONTENT */}

      <section className="otd-content">

        {/* HERO */}

        <motion.div
          className="otd-heading"
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
          <span className="otd-eyebrow">
            <Sparkles size={13} />
            A MEMORY FROM THE PAST
          </span>

          <div className="otd-date-display">
            <span>{monthName}</span>
            <strong>{dayNumber}</strong>
          </div>

          <h1>
            On this day,
            <br />
            <em>you were here.</em>
          </h1>

          <p>
            Little pieces of your past,
            returning when you least expect them.
          </p>
        </motion.div>

        {/* MEMORIES */}

        {onThisDayMemories.length > 0 ? (
          <div className="otd-memories">
            <div className="otd-section-heading">
              <div>
                <span>
                  {onThisDayMemories.length}{" "}
                  {onThisDayMemories.length === 1
                    ? "MEMORY"
                    : "MEMORIES"}{" "}
                  FOUND
                </span>

                <h2>
                  From another chapter
                </h2>
              </div>
            </div>

            {onThisDayMemories.map(
              (memory, index) => {
                const memoryDate = memory.date
                    ? new Date(memory.date)
                    : new Date(Number(memory.id));

                    const year = memoryDate.getFullYear();

                const hasMusic =
                  Boolean(
                    memory.music?.song ||
                      memory.music?.artist ||
                      memory.music?.audioUrl ||
                      memory.music?.previewUrl
                  );

                return (
                  <motion.article
                    className="otd-memory-card"
                    key={
                      memory.id ||
                      `${memory.date}-${index}`
                    }
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        0.15 + index * 0.1,
                      duration: 0.55,
                    }}
                    onClick={() =>
                      onOpenMemory(memory)
                    }
                  >
                    <div className="otd-memory-year">
                      <span>
                        {year}
                      </span>

                      <div />
                    </div>

                    <div className="otd-memory-main">
                      <div className="otd-memory-top">
                        <span className="otd-mood">
                          {memory.mood ||
                            "✨"}
                        </span>

                        <span className="otd-memory-date">
                          {memory.day ||
                            ""}
                        </span>
                      </div>

                      <h2>
                        {memory.title ||
                          "Untitled memory"}
                      </h2>

                      <p>
                        {memory.text ||
                          "A moment worth remembering."}
                      </p>

                      <div className="otd-memory-meta">
                        {hasMusic && (
                          <span>
                            <Music size={12} />
                            Soundtrack
                          </span>
                        )}

                        {memory.photo?.url && (
                          <span>
                            📷 Photo
                          </span>
                        )}

                        <ChevronRight
                          size={15}
                          className="otd-arrow"
                        />
                      </div>
                    </div>
                  </motion.article>
                );
              }
            )}
          </div>
        ) : (
          <motion.div
            className="otd-empty"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
          >
            <div className="otd-empty-icon">
              ✨
            </div>

            <h2>
              Nothing from this day yet.
            </h2>

            <p>
              As your diary grows, old memories
              from this date will appear here.
            </p>

            <span>
              Your future self might find
              something beautiful here.
            </span>
          </motion.div>
        )}

      </section>
    </main>
  );
}

export default OnThisDay;