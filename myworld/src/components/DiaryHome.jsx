import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Heart,
  Image,
  Lock,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import "./diary-home.css";
import DailyPrompt from "./DailyPrompt";
import { achievements } from "../achievements/achievements";
import { getAchievementsStatus } from "../achievements/achievementUtils";
const formatMemoryDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function DiaryHome({
  theme,
  onWrite,
  userName,
  memories,
  memoriesLoading,
  onViewAll,
  onCalendar,
  onMoodTimeline,
  resurfacedMemory,
  onThisDay,
  onPrivacy,
}) {
  const colors = theme.colors;
  const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";

  return "Good night";
};

  // =========================
  // SEARCH
  // =========================

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // =========================
  // MOOD
  // =========================

  const [selectedMood, setSelectedMood] = useState("😊");
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  // =========================
  // DYNAMIC STATS
  // =========================

  const totalEntries = memories.length;

  const uniqueMoods = new Set(
    memories
      .map((memory) => memory.mood)
      .filter(Boolean)
  ).size;

  /*
    New memories use Date.now() as their ID.
    Demo memories use small IDs, so we only use
    valid timestamp IDs for streak calculation.
  */
  /*
    =========================
    JOURNAL STREAK
    =========================

    A streak counts unique calendar days on which
    the user wrote a memory.

    Multiple memories on the same day count as
    one streak day.

    The streak is active only when the most recent
    writing day is today or yesterday.
  */

  const getMemoryDateKey = (memory) => {
    if (!memory?.date) return null;

    const parsedDate = new Date(memory.date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return [
      parsedDate.getFullYear(),
      String(parsedDate.getMonth() + 1).padStart(2, "0"),
      String(parsedDate.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const uniqueWritingDays = [
    ...new Set(
      memories
        .map(getMemoryDateKey)
        .filter(Boolean)
    ),
  ].sort((a, b) => b.localeCompare(a));

  const today = new Date();

  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = [
    yesterday.getFullYear(),
    String(yesterday.getMonth() + 1).padStart(2, "0"),
    String(yesterday.getDate()).padStart(2, "0"),
  ].join("-");

  let streak = 0;

  if (
    uniqueWritingDays.length > 0 &&
    (
      uniqueWritingDays[0] === todayKey ||
      uniqueWritingDays[0] === yesterdayKey
    )
  ) {
    streak = 1;

    for (let i = 1; i < uniqueWritingDays.length; i++) {
      const previousDate = new Date(
        `${uniqueWritingDays[i - 1]}T00:00:00`
      );

      const currentDate = new Date(
        `${uniqueWritingDays[i]}T00:00:00`
      );

      const difference =
        (previousDate.getTime() -
          currentDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
    // =========================
  // ACHIEVEMENTS
  // =========================

  const achievementStatus = getAchievementsStatus(
    memories,
    streak
  );

  useEffect(() => {
  const previouslyUnlocked = JSON.parse(
    localStorage.getItem("myworld-unlocked-achievements") || "[]"
  );

  const currentlyUnlocked = achievements
    .filter((achievement) => achievementStatus[achievement.id])
    .map((achievement) => achievement.id);

  const newlyUnlocked = currentlyUnlocked.find(
    (id) => !previouslyUnlocked.includes(id)
  );

  if (newlyUnlocked) {
    const achievement = achievements.find(
      (item) => item.id === newlyUnlocked
    );

    setTimeout(() => {
        setUnlockedAchievement(achievement);
      }, 0);

    localStorage.setItem(
      "myworld-unlocked-achievements",
      JSON.stringify(currentlyUnlocked)
    );
  } else if (
    !localStorage.getItem("myworld-unlocked-achievements")
  ) {
    localStorage.setItem(
      "myworld-unlocked-achievements",
      JSON.stringify(currentlyUnlocked)
    );
  }
}, [memories, streak, achievementStatus]);
  const unlockedAchievements = achievements.filter(
    (achievement) =>
      achievementStatus[achievement.id]
  );

  const nextAchievements = achievements
    .filter(
      (achievement) =>
        !achievementStatus[achievement.id]
    )
    .slice(0, 3);
  // =========================
  // SEARCH RESULTS
  // =========================

  const filteredMemories = memories.filter(
    (memory) => {
      const query =
        searchQuery.toLowerCase().trim();

      if (!query) return false;

      return [
      memory.title,
      memory.text,
      memory.mood,
      memory.tag,
      memory.date,
      memory.day,
      memory.location?.name,
      memory.location?.area,
      memory.location?.displayName,
      memory.music?.song,
      memory.music?.artist,
      ...(Array.isArray(memory.tags) ? memory.tags : []),
    ]
      .filter(Boolean)
      .some((value) =>
        String(value)
          .toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <>
    {unlockedAchievement && (
      <motion.div
        className="achievement-toast"
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
      >
        <div className="achievement-toast-icon">
          🏆
        </div>

        <div className="achievement-toast-content">
          <span>ACHIEVEMENT UNLOCKED</span>

          <strong>
            {unlockedAchievement.icon}{" "}
            {unlockedAchievement.title}
          </strong>

          <small>
            {unlockedAchievement.description}
          </small>
        </div>

        <button
          className="achievement-toast-close"
          onClick={() => setUnlockedAchievement(null)}
          aria-label="Close achievement notification"
        >
          ×
        </button>
      </motion.div>
    )}
    <main
      className={`diary-home theme-${theme.id}`}
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
      <div className="diary-ambient diary-ambient-one" />
      <div className="diary-ambient diary-ambient-two" />

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="diary-nav">
        <div className="diary-brand">
          <span className="diary-brand-icon">
            <Sparkles size={15} />
          </span>

          <span>MYWORLD</span>
        </div>

        <div className="diary-nav-actions">
          <button
            className={`icon-button ${
              searchOpen
                ? "icon-button-active"
                : ""
            }`}
            aria-label="Search"
            onClick={() => {
              setSearchOpen(
                (current) => !current
              );
              setSearchQuery("");
            }}
          >
            <Search size={18} />
          </button>

          <button
            className="icon-button"
            aria-label="Privacy"
            onClick={onPrivacy}
          >
            <Lock size={17} />
          </button>

          <div className="profile-circle">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </nav>

      {/* =========================
          SEARCH PANEL
      ========================= */}

      <div
        className={`search-panel ${
          searchOpen
            ? "search-panel-open"
            : ""
        }`}
      >
        <div className="search-panel-inner">
          <div className="search-input-wrap">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search your world..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              autoFocus={searchOpen}
            />

            {searchQuery && (
              <button
                className="search-clear"
                onClick={() =>
                  setSearchQuery("")
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* SEARCH RESULTS */}

          {searchQuery && (
            <div className="search-results">
              {filteredMemories.length > 0 ? (
                <>
                  <div className="search-results-label">
                    {filteredMemories.length}{" "}
                    {filteredMemories.length === 1
                      ? "memory"
                      : "memories"}{" "}
                    found
                  </div>

                  {filteredMemories
                    .slice(0, 5)
                    .map((memory) => (
                      <button
                        className="search-result"
                        key={memory.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className="search-result-mood">
                          {memory.mood}
                        </span>

                        <span className="search-result-content">
                          <strong>
                            {memory.title ||
                              "Untitled memory"}
                          </strong>

                         <small>
                          {formatMemoryDate(memory.date)}
                        </small>
                        </span>

                        <span className="search-result-arrow">
                          →
                        </span>
                      </button>
                    ))}
                </>
              ) : (
                <div className="search-empty">
                  <Search size={22} />

                  <strong>
                    No memories found
                  </strong>

                  <span>
                    Try searching for a
                    different word.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* SEARCH HINT */}

          {!searchQuery && (
            <div className="search-hint">
              <Sparkles size={14} />

              <span>
                Search memories, moods,
                moments or tags
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <section className="diary-content">
        {memoriesLoading && (
          <div className="memories-loading">
            Loading your world...
          </div>
        )}
        {/* =========================
            WELCOME
        ========================= */}

        <motion.div
          className="welcome-section"
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
          <div>
            <span className="welcome-label">
              <Sparkles size={13} />
              {theme.name} world
            </span>

            <h1>
              {getGreeting()},
              <br />
              <span>{userName || "there"}.</span>
            </h1>

            <p>
              Take a moment. What's
              happening in your world today?
            </p>
          </div>

          <motion.button
            className="write-button"
            onClick={() =>
              onWrite(selectedMood)
            }
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Plus size={19} />
            <span>Write today</span>
          </motion.button>
        </motion.div>

        {/* =========================
            QUICK STATS
        ========================= */}

        <div className="quick-stats">
          <div className="stat-item">
            <BookOpen size={18} />

            <div>
              <strong>
                {totalEntries}
              </strong>

              <span>entries</span>
            </div>
          </div>

          <div className="stat-item">
            <Heart size={18} />

            <div>
              <strong>
                {uniqueMoods}
              </strong>

              <span>moods</span>
            </div>
          </div>

          <div className="stat-item">
            <CalendarDays size={18} />

            <div>
              <strong>
                {streak}
              </strong>

              <span>day streak</span>
            </div>
          </div>
        </div>

        {/* =========================
            TODAY CARD
        ========================= */}

        <section className="today-card">
          <div className="today-card-top">
            <div>
              <span className="section-label">
                TODAY
              </span>

              <h2>
                How are you feeling?
              </h2>
            </div>

            <span className="today-date">
              {new Date()
                .toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                  }
                )
                .toUpperCase()}
            </span>
          </div>

          <div className="mood-row">
            {[
              "😊",
              "😌",
              "🥰",
              "😐",
              "😔",
              "😤",
              "😭",
            ].map((mood) => (
              <motion.button
                key={mood}
                className={`mood-button ${
                  selectedMood === mood
                    ? "mood-active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedMood(mood)
                }
                whileHover={{
                  y: -5,
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.92,
                }}
              >
                {mood}
              </motion.button>
            ))}
          </div>

          <button
            className="start-writing"
            onClick={() =>
              onWrite(selectedMood)
            }
          >
            <span>
              Start writing your day...
            </span>

            <Plus size={18} />
          </button>
        </section>

        {/* =========================
            CALENDAR
        ========================= */}

        <motion.button
          className="calendar-launch"
          onClick={onCalendar}
          whileHover={{
            y: -3,
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          <span className="calendar-launch-icon">
            <CalendarDays size={20} />
          </span>

          <span className="calendar-launch-text">
            <strong>
              Explore your days
            </strong>

            <small>
              Open your memory calendar
            </small>
          </span>

          <span className="calendar-launch-arrow">
            →
          </span>
        </motion.button>

        {/* =========================
            MOOD TIMELINE
        ========================= */}

        <motion.button
          className="mood-timeline-launch"
          onClick={() =>
            onMoodTimeline()
          }
          whileHover={{
            y: -3,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          <div className="mood-timeline-launch-icon">
            🌈
          </div>

          <div className="mood-timeline-launch-text">
            <strong>
              Your mood journey
            </strong>

            <span>
              See how you've been feeling
            </span>
          </div>

          <span className="mood-timeline-launch-arrow">
            →
          </span>
        </motion.button>

        {/* =========================
            ON THIS DAY
        ========================= */}

        <motion.button
          className="on-this-day-launch"
          onClick={onThisDay}
          whileHover={{
            y: -3,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          <div className="on-this-day-launch-icon">
            ✨
          </div>

          <div className="on-this-day-launch-text">
            <strong>
              On this day
            </strong>

            <span>
              Revisit a moment from your past
            </span>
          </div>

          <span className="on-this-day-launch-arrow">
            →
          </span>
        </motion.button>
            {/* =========================
                MEMORY RESURFACING
            ========================= */}

            {resurfacedMemory && (
              <motion.section
                className="resurfaced-memory"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="resurfaced-memory-header">
                  <div>
                    <span className="section-label">
                      ✦ FROM YOUR PAST
                    </span>

                    <h2>A moment worth revisiting.</h2>
                  </div>

                  <span className="resurfaced-memory-date">
                    {formatMemoryDate(resurfacedMemory.date)}
                  </span>
                </div>

                <div className="resurfaced-memory-content">
                  <span className="resurfaced-memory-mood">
                    {resurfacedMemory.mood}
                  </span>

                  <div>
                    <h3>
                      {resurfacedMemory.title ||
                        "A moment you saved"}
                    </h3>

                    <p>
                      "{resurfacedMemory.text ||
                        "A moment worth remembering."}"
                    </p>
                  </div>
                </div>
              </motion.section>
            )}
        {/* =========================
            DAILY PROMPT
        ========================= */}
        <DailyPrompt
          theme={theme}
          onWrite={(prompt) =>
            onWrite(selectedMood, prompt)
          }
        />
                {/* =========================
            ACHIEVEMENTS
        ========================= */}

        <section className="achievements-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                YOUR JOURNEY
              </span>

              <h2>
                Achievements
              </h2>
            </div>

            <span className="achievement-count">
              {unlockedAchievements.length}/
              {achievements.length}
            </span>
          </div>

          <div className="achievements-card">
            {unlockedAchievements.length > 0 ? (
              <div className="achievement-unlocked-row">
                {unlockedAchievements
                  .slice()
                  .reverse()
                  .map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      className="achievement-item achievement-item-unlocked"
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                    >
                      <span className="achievement-icon">
                        {achievement.icon}
                      </span>

                      <div>
                        <strong>
                          {achievement.title}
                        </strong>

                        <small>
                          {achievement.description}
                        </small>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="achievement-empty">
                <span className="achievement-empty-icon">
                  ✨
                </span>

                <div>
                  <strong>
                    Your first achievement is waiting
                  </strong>

                  <small>
                    Keep writing and your journey will
                    unlock new milestones.
                  </small>
                </div>
              </div>
            )}

            {nextAchievements.length > 0 && (
              <div className="achievement-next">
                <span className="achievement-next-label">
                  NEXT TO UNLOCK
                </span>

                <div className="achievement-next-list">
                  {nextAchievements.map(
                    (achievement) => (
                      <div
                        key={achievement.id}
                        className="achievement-next-item"
                      >
                        <span>
                          {achievement.icon}
                        </span>

                        <div>
                          <strong>
                            {achievement.title}
                          </strong>

                          <small>
                            {achievement.requirement}
                          </small>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
        {/* =========================
            RECENT MEMORIES
        ========================= */}

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                YOUR MEMORIES
              </span>

              <h2>
                Recent moments
              </h2>
            </div>

            <button
              className="view-all"
              onClick={onViewAll}
            >
              View all →
            </button>
          </div>

          <div className="entries-grid">
            {memories
              .slice(0, 3)
              .map((entry, index) => (
                <motion.article
                  className="entry-card"
                  key={entry.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                >
                  {/* PHOTO */}

                  {entry.photo?.url && (
                    <div className="entry-photo">
                      <img
                        src={entry.photo.url}
                        alt={
                          entry.title ||
                          "Diary memory"
                        }
                      />
                    </div>
                  )}

                  {/* CONTENT */}

                  <div className="entry-card-content">
                    <div className="entry-top">
                      <span>
                        {formatMemoryDate(entry.date)}
                      </span>

                      <span className="entry-mood">
                        {entry.mood}
                      </span>
                    </div>

                    <div className="entry-line" />

                    <h3>
                      {entry.title || "Untitled memory"}
                    </h3>

                  <p>
                    "{entry.text || "A moment worth remembering."}"
                  </p>

                    <div className="entry-footer">
                      <div className="entry-meta">

                        {/* LOCATION */}
                        {entry.location && (
                          <span className="entry-location">
                            📍{" "}
                            {entry.location.displayName ||
                              entry.location.name ||
                              "Location"}
                          </span>
                        )}

                        {/* TAGS */}
                        {Array.isArray(entry.tags) &&
                          entry.tags.length > 0 && (
                            <div className="entry-tags">
                              {entry.tags.slice(0, 3).map((tag) => (
                                <span
                                  className="entry-tag"
                                  key={tag}
                                >
                                  #{tag}
                                </span>
                              ))}

                              {entry.tags.length > 3 && (
                                <span className="entry-tag-more">
                                  +{entry.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                        {/* OLD TAG SUPPORT */}
                        {!entry.location &&
                          (!Array.isArray(entry.tags) ||
                            entry.tags.length === 0) && (
                            <span>
                              {entry.tag || "Memory"}
                            </span>
                          )}

                      </div>

                      <div className="entry-icons">
                        {/* MUSIC */}
                        {entry.music && (
                          <span
                            className="entry-music-icon"
                            title={
                              entry.music.song ||
                              "Music attached"
                            }
                          >
                            🎵
                          </span>
                        )}

                        {/* PHOTO */}
                        {entry.photo?.url && (
                          <Image size={15} />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
          </div>
        </section>
      </section>
    </main>
    </>
  );
}

export default DiaryHome;