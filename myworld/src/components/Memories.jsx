import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Image,
  Music,
  Search,
  Sparkles,
  Heart,
} from "lucide-react";
import { useMemo, useState } from "react";
import MemoryModal from "./MemoryModal";
import ConfirmDialog from "./ConfirmDialog";
import "./memories.css";
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

function Memories({
  theme,
  memories,
  onBack,
  onDeleteMemory,
  onEditMemory,
  onToggleFavorite,
}) {
  const [selectedMemory, setSelectedMemory] =
    useState(null);

  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [favoriteFilter, setFavoriteFilter] =
  useState(false);

  const colors = theme.colors;
  const [showDeleteDialog, setShowDeleteDialog] =
  useState(false);

  // =========================
  // DELETE
  // =========================

const handleDelete = () => {
  if (!selectedMemory) return;

  setShowDeleteDialog(true);
};

  // =========================
  // SEARCH
  // =========================

const filteredMemories = useMemo(() => {
  const query = search.toLowerCase().trim();

  return memories.filter((memory) => {
    const matchesMood =
      moodFilter === "all" ||
      memory.mood === moodFilter;
      const matchesFavorite =
        !favoriteFilter ||
        memory.favorite === true;

   if (!matchesMood || !matchesFavorite) {
  return false;
}
      const musicValues = [
        memory.music?.song,
        memory.music?.artist,
        memory.music?.album,
      ];

      return [
        memory.title,
        memory.text,
        memory.tag,
        memory.date,
        memory.mood,
        ...musicValues,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [memories, search, moodFilter, favoriteFilter]);

  return (
    <main
      className={`memories-page theme-${theme.id}`}
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
      <div className="memories-ambient memories-ambient-one" />
      <div className="memories-ambient memories-ambient-two" />

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="memories-nav">
        <motion.button
          className="memories-back"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={17} />

          <span>
            Back to my world
          </span>
        </motion.button>

        <div className="memories-brand">
          <span>
            <Sparkles size={15} />
          </span>

          MYWORLD
        </div>

        <div className="memories-count">
          {memories.length} memories
        </div>
      </nav>

      {/* =========================
          HEADER
      ========================= */}

      <section className="memories-content">
        <motion.div
          className="memories-heading"
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
          <span className="memories-eyebrow">
            <Sparkles size={13} />

            YOUR STORY
          </span>

          <h1>
            Little moments,
            <br />
            <em>kept forever.</em>
          </h1>

          <p>
            Every thought, feeling and moment you've
            chosen to remember.
          </p>
        </motion.div>

        {/* =========================
            SEARCH
        ========================= */}

        <motion.div
          className="memories-search"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.6,
          }}
        >
          <Search size={18} />

          <input
            type="text"
            placeholder="Search your memories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >
              Clear
            </button>
          )}
        </motion.div>
        <div className="mood-filter">
          <button
            className={moodFilter === "all" ? "active" : ""}
            onClick={() => setMoodFilter("all")}
          >
            All
          </button>

          {[
            "😊",
            "😌",
            "🥰",
            "😐",
            "😔",
            "😤",
            "😭",
          ].map((mood) => (
            <button
              key={mood}
              className={moodFilter === mood ? "active" : ""}
              onClick={() => setMoodFilter(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
        <div className="favorite-filter">
          <button
            className={favoriteFilter ? "active" : ""}
            onClick={() =>
              setFavoriteFilter((current) => !current)
            }
          >
            <Heart
              size={15}
              fill={favoriteFilter ? "currentColor" : "none"}
            />
            Favorites
          </button>
        </div>
        {/* =========================
            META
        ========================= */}

        <div className="memories-meta">
          <span>
            {filteredMemories.length}{" "}
            {filteredMemories.length === 1
              ? "memory"
              : "memories"}
          </span>

          <span>
            <CalendarDays size={14} />

            Your timeline
          </span>
        </div>

        {/* =========================
            TIMELINE
        ========================= */}

        <div className="memory-timeline">
          {filteredMemories.length > 0 ? (
            filteredMemories.map(
              (memory, index) => {
                const hasMusic =
                  Boolean(
                    memory.music?.song ||
                      memory.music?.artist ||
                      memory.music?.audioUrl ||
                      memory.music?.previewUrl
                  );

                return (
                  <motion.article
                    className="timeline-memory"
                    key={
                      memory.id ||
                      `${memory.date}-${index}`
                    }
                    onClick={() =>
                      setSelectedMemory(
                        memory
                      )
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
                      duration: 0.5,
                      delay: index * 0.06,
                    }}
                  >
                    {/* MARKER */}

                    <div className="timeline-marker">
                      <span>
                        {memory.mood}
                      </span>
                    </div>

                    {/* DATE */}

                    <div className="timeline-date">
                      <span>
                        {formatMemoryDate(memory.date)}
                      </span>

                      <small>
                        {memory.day}
                        {memory.time
                          ? ` · ${memory.time}`
                          : ""}
                      </small>
                    </div>

                    {/* CARD */}

                    <div className="timeline-card">
                      {memory.photo?.url && (
                        <div className="timeline-photo">
                          <img
                            src={
                              memory.photo.url
                            }
                            alt={
                              memory.title ||
                              "Diary memory"
                            }
                          />
                        </div>
                      )}

                      <div className="timeline-card-content">
                        {/* TOP */}

                        <div className="timeline-card-top">
                          <span className="timeline-tag">
                            {memory.tag ||
                              "Memory"}
                          </span>
                          <button
                            className={`favorite-button ${
                              memory.favorite ? "favorite-active" : ""
                            }`}
                            onClick={(event) => {
                              event.stopPropagation();

                              onToggleFavorite(
                                memory.id,
                                !memory.favorite
                              );
                            }}
                            aria-label={
                              memory.favorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            <Heart
                              size={15}
                              fill={memory.favorite ? "currentColor" : "none"}
                            />
                          </button>
                          <div className="timeline-card-icons">
                            {memory.photo
                              ?.url && (
                              <Image
                                size={15}
                              />
                            )}

                            {hasMusic && (
                              <Music
                                size={15}
                                className="timeline-music-icon"
                              />
                            )}
                          </div>
                        </div>

                        {/* TITLE */}

                        <h2>
                          {memory.title}
                        </h2>

                        {/* STORY */}

                        <p>
                          "{memory.text}"
                        </p>

                        {/* =========================
                            SOUNDTRACK
                        ========================= */}

                        {hasMusic && (
                          <motion.div
                            className="timeline-soundtrack"
                            initial={{
                              opacity: 0,
                              y: 6,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.3,
                              delay:
                                index *
                                0.06 +
                                0.15,
                            }}
                          >
                            {/* ARTWORK */}

                            {memory.music
                              ?.artwork ? (
                              <img
                                src={
                                  memory
                                    .music
                                    .artwork
                                }
                                alt=""
                                className="timeline-soundtrack-art"
                              />
                            ) : (
                              <div className="timeline-soundtrack-art timeline-soundtrack-placeholder">
                                <Music
                                  size={14}
                                />
                              </div>
                            )}

                            {/* SONG INFO */}

                            <div className="timeline-soundtrack-info">
                              <strong>
                                {memory
                                  .music
                                  ?.song ||
                                  "Audio memory"}
                              </strong>

                              <span>
                                {memory
                                  .music
                                  ?.artist ||
                                  "Your audio"}
                              </span>
                            </div>

                            <span className="timeline-soundtrack-label">
                              SOUNDTRACK
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              }
            )
          ) : (
            <motion.div
              className="empty-memories"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
            >
              <div className="empty-icon">
                ✦
              </div>

              <h2>
                {memories.length === 0
                  ? "Your story starts here"
                  : "No memories found"}
              </h2>

              <p>
                {memories.length === 0
                  ? "Write your first memory and start building your world."
                  : search
                  ? "Try searching for something else."
                  : favoriteFilter
                  ? "You haven't added any favorites yet."
                  : moodFilter !== "all"
                  ? "Try choosing a different mood."
                  : "Your memories will appear here."}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* =========================
          MEMORY MODAL
      ========================= */}

      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          onClose={() =>
            setSelectedMemory(null)
          }
          onDelete={handleDelete}
          onEdit={onEditMemory}
        />
      )}
      {showDeleteDialog && (
        <ConfirmDialog
          title="Delete this memory?"
          message="This memory will be permanently removed from your world."
          confirmText="Delete memory"
          cancelText="Keep memory"
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={() => {
            onDeleteMemory(selectedMemory.id);
            setShowDeleteDialog(false);
            setSelectedMemory(null);
          }}
        />
      )}
    </main>
  );
}

export default Memories;