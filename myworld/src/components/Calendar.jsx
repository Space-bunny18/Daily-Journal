import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import "./calendar.css";

function Calendar({ theme, memories, onBack, onOpenMemory }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState(null);

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const previousMonth = () => {
  setSelectedDay(null);

  setCurrentDate(
    new Date(year, month - 1, 1)
  );
};

const nextMonth = () => {
  setSelectedDay(null);

  setCurrentDate(
    new Date(year, month + 1, 1)
  );
};

  const getMemoryDate = (memory) => {
  if (memory.date) {
    const date = new Date(memory.date);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  if (!memory.id) return null;

  const date = new Date(Number(memory.id));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

  const memoriesByDay = useMemo(() => {
    const grouped = {};

    memories.forEach((memory) => {
      const date = getMemoryDate(memory);

      if (!date) return;

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month
      ) {
        return;
      }

      const day = date.getDate();

      if (!grouped[day]) {
        grouped[day] = [];
      }

      grouped[day].push(memory);
    });

    return grouped;
  }, [memories, year, month]);

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <main
      className={`calendar-page theme-${theme.id}`}
      style={{
        "--theme-bg": theme.colors.background,
        "--theme-bg-secondary":
          theme.colors.backgroundSecondary,
        "--theme-surface": theme.colors.surface,
        "--theme-text": theme.colors.text,
        "--theme-muted": theme.colors.textMuted,
        "--theme-accent": theme.colors.accent,
        "--theme-accent-soft":
          theme.colors.accentSoft,
        "--theme-border": theme.colors.border,
      }}
    >
      <div className="calendar-ambient calendar-ambient-one" />
      <div className="calendar-ambient calendar-ambient-two" />

      <nav className="calendar-nav">
        <motion.button
          className="calendar-back"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={17} />
          <span>Back to my world</span>
        </motion.button>

        <div className="calendar-brand">
          <span>
            <Sparkles size={15} />
          </span>
          MYWORLD
        </div>

        <div className="calendar-theme">
          {theme.icon} {theme.name}
        </div>
      </nav>

      <section className="calendar-content">
        <motion.div
          className="calendar-heading"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="calendar-eyebrow">
            <Sparkles size={13} />
            YOUR DAYS
          </span>

          <h1>
            Every day has
            <br />
            <em>a memory.</em>
          </h1>

          <p>
            Explore the moments you've chosen
            to keep.
          </p>
        </motion.div>

        <motion.div
          className="calendar-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.6,
          }}
         >
          <div className="calendar-header">
            <button
              className="calendar-arrow"
              onClick={previousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={19} />
            </button>

            <div className="calendar-month">
              <strong>{monthName}</strong>
              <span>{year}</span>
            </div>
            <button
              className="calendar-today-button"
              onClick={() => {
                setCurrentDate(
                  new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                  )
                );
                setSelectedDay(null);
              }}
            >
              Today
            </button>

            <button
              className="calendar-arrow"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          <div className="calendar-weekdays">
            {[
              "SUN",
              "MON",
              "TUE",
              "WED",
              "THU",
              "FRI",
              "SAT",
            ].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              const dayMemories =
                day ? memoriesByDay[day] || [] : [];

              const hasMemory =
                dayMemories.length > 0;

              return (
                <motion.button
                  key={`${year}-${month}-${index}`}
                  className={`calendar-day ${
                    day ? "" : "calendar-day-empty"
                  } ${
                    isToday(day)
                      ? "calendar-day-today"
                      : ""
                  } ${
                    hasMemory
                      ? "calendar-day-memory"
                      : ""
                  } ${
                    selectedDay === day
                      ? "calendar-day-selected"
                      : ""
                  }`}
                  disabled={!day}
                  onClick={() => {
                    if (hasMemory) {
                      setSelectedDay(day);
                    }
                  }}
                  whileHover={
                    day
                      ? {
                          y: -2,
                          scale: 1.03,
                        }
                      : {}
                  }
                  whileTap={
                    day
                      ? { scale: 0.96 }
                      : {}
                  }
                >
                  {day && (
                    <>
                      <span className="calendar-number">
                        {day}
                      </span>

                      {hasMemory && (
                        <span className="calendar-mood">
                          {dayMemories[0].mood}
                        </span>
                      )}

                      {hasMemory && (
                        <span className="calendar-dot" />
                      )}
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span>
              <i className="legend-dot" />
              Memory saved
            </span>

            <span>
              <i className="legend-today" />
              Today
            </span>
          </div>
        </motion.div>
        {selectedDay && memoriesByDay[selectedDay]?.length > 0 && (
          <motion.div
            className="calendar-day-memories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="calendar-day-memories-header">
              <div>
                <span className="calendar-day-eyebrow">
                  YOUR MEMORIES
                </span>

                <h2>
                  {monthName} {selectedDay}
                </h2>
              </div>

              <span className="calendar-memory-count">
                {memoriesByDay[selectedDay].length}{" "}
                {memoriesByDay[selectedDay].length === 1
                  ? "memory"
                  : "memories"}
              </span>
            </div>

            <div className="calendar-memory-list">
              {memoriesByDay[selectedDay].map((memory, index) => (
                <motion.button
                  key={memory.id}
                  className="calendar-memory-item"
                  onClick={() =>
                    onOpenMemory && onOpenMemory(memory)
                  }
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.06,
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="calendar-memory-mood">
                    {memory.mood || "📖"}
                  </div>

                  <div className="calendar-memory-info">
                    <strong>
                      {memory.title || "Untitled memory"}
                    </strong>

                    <p>
                      {memory.text ||
                        "A moment worth remembering."}
                    </p>

                    <div className="calendar-memory-meta">
                      {memory.location?.displayName && (
                        <span>
                          📍 {memory.location.displayName}
                        </span>
                      )}

                      {Array.isArray(memory.tags) &&
                        memory.tags.length > 0 && (
                          <span>
                            #{memory.tags[0]}
                          </span>
                        )}

                      {memory.photo?.url && (
                        <span>🖼️ Photo</span>
                      )}

                      {memory.music?.song && (
                        <span>🎵 Music</span>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    className="calendar-memory-arrow"
                    size={18}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

       <div className="calendar-note">
        ✦ Select a day to explore the memories you kept.
      </div>
      </section>
    </main>
  );
}

export default Calendar;