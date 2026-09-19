import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Edit3,
  Image,
  Music,
  Pause,
  Play,
  X,
  ExternalLink,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./memory-modal.css";
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
function MemoryModal({
  memory,
  onClose,
  onDelete,
  onEdit,
}) {
  const [isMusicPlaying, setIsMusicPlaying] =
    useState(false);

  const musicRef = useRef(null);

// =========================
// STOP MUSIC ON CLOSE / CHANGE
// =========================

useEffect(() => {
  const audioElement = musicRef.current;

  return () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };
}, [memory?.id]);

// =========================
// NO MEMORY
// =========================

if (!memory) return null;

const music = memory.music;

const hasMusic =
  music &&
  (music.song ||
    music.artist ||
    music.audioUrl ||
    music.previewUrl);

const isOnlineMusic =
  music?.source === "itunes" ||
  Boolean(music?.previewUrl);

// =========================
// MUSIC PLAYBACK
// =========================

const toggleMusic = async () => {
    if (!musicRef.current || !hasMusic) {
      return;
    }

    try {
      if (musicRef.current.paused) {
        await musicRef.current.play();
        setIsMusicPlaying(true);
      } else {
        musicRef.current.pause();
        setIsMusicPlaying(false);
      }
    } catch (error) {
      console.error(
        "Memory music playback failed:",
        error
      );

      setIsMusicPlaying(false);
    }
  };

  const handleMusicEnded = () => {
    setIsMusicPlaying(false);
  };

  

  // =========================
  // MUSIC URL
  // =========================

  const musicUrl = isOnlineMusic
    ? music?.previewUrl
    : music?.audioUrl;

  return (
    <AnimatePresence>
      <motion.div
        className="memory-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="memory-modal"
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.97,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {/* =========================
              CLOSE
          ========================= */}

          <button
            className="memory-modal-close"
            onClick={onClose}
            aria-label="Close memory"
          >
            <X size={18} />
          </button>

          {/* =========================
              PHOTO
          ========================= */}

          {memory.photo?.url && (
            <div className="memory-modal-photo">
              <img
                src={memory.photo.url}
                alt={
                  memory.title ||
                  "Diary memory"
                }
              />
            </div>
          )}

          {/* =========================
              CONTENT
          ========================= */}

          <div className="memory-modal-content">
            {/* DATE */}

            <div className="memory-modal-meta">
              <span className="memory-modal-date">
                <CalendarDays size={14} />

                {formatMemoryDate(memory.date)}
              </span>
              <span>
                {memory.day}

                {memory.time
                  ? ` · ${memory.time}`
                  : ""}
              </span>
            </div>

            {/* MOOD */}

            <div className="memory-modal-mood">
              {memory.mood}
            </div>

            {/* TITLE */}

            <h2>
              {memory.title}
            </h2>

            <div className="memory-modal-divider" />

            {/* STORY */}
          <p>
            {memory.text}
          </p>

          {/* =========================
              LOCATION
          ========================= */}

          {memory.location && (
            <motion.div
              className="memory-location"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
                delay: 0.05,
              }}
            >
              <div className="memory-location-icon">
                📍
              </div>

              <div className="memory-location-content">
                <span className="memory-detail-label">
                  LOCATION
                </span>

                <strong>
                  {memory.location.displayName ||
                    memory.location.name ||
                    "Saved location"}
                </strong>

                {memory.location.latitude &&
                  memory.location.longitude && (
                    <small>
                      {memory.location.latitude.toFixed(4)}
                      {" · "}
                      {memory.location.longitude.toFixed(4)}
                    </small>
                  )}
              </div>
            </motion.div>
          )}

          {/* =========================
              TAGS
          ========================= */}

          {Array.isArray(memory.tags) &&
            memory.tags.length > 0 && (
              <motion.div
                className="memory-tags"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.1,
                }}
              >
                <span className="memory-detail-label">
                  TAGS
                </span>

                <div className="memory-tags-list">
                  {memory.tags.map((tag) => (
                    <span
                      className="memory-tag"
                      key={tag}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

          {/* =========================
              SOUNDTRACK
          ========================= */}

            {hasMusic && (
              <motion.div
                className="memory-soundtrack"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.1,
                }}
              >
                <div className="memory-soundtrack-label">
                  <Music size={13} />

                  <span>
                    SOUNDTRACK
                  </span>
                </div>

                <div className="memory-soundtrack-card">
                  {/* ARTWORK */}

                  {music?.artwork ? (
                    <img
                      className="memory-soundtrack-art"
                      src={music.artwork}
                      alt=""
                    />
                  ) : (
                    <div className="memory-soundtrack-art memory-soundtrack-placeholder">
                      <Music size={22} />
                    </div>
                  )}

                  {/* DETAILS */}

                  <div className="memory-soundtrack-details">
                    <strong>
                      {music.song ||
                        "Untitled song"}
                    </strong>

                    <span>
                      {music.artist ||
                        "Unknown artist"}
                    </span>

                    {music.album && (
                      <small>
                        {music.album}
                      </small>
                    )}
                  </div>

                  {/* PLAY */}

                  {musicUrl && (
                    <button
                      type="button"
                      className={`memory-soundtrack-play ${
                        isMusicPlaying
                          ? "is-playing"
                          : ""
                      }`}
                      onClick={
                        toggleMusic
                      }
                      aria-label={
                        isMusicPlaying
                          ? "Pause soundtrack"
                          : "Play soundtrack"
                      }
                    >
                      {isMusicPlaying ? (
                        <Pause size={18} />
                      ) : (
                        <Play size={18} />
                      )}
                    </button>
                  )}
                </div>

                {/* HIDDEN AUDIO */}

                {musicUrl && (
                  <audio
                    ref={musicRef}
                    src={musicUrl}
                    onEnded={
                      handleMusicEnded
                    }
                    preload="none"
                  />
                )}

                {/* APPLE LINK */}

                {isOnlineMusic &&
                  music?.trackUrl && (
                    <a
                      className="memory-soundtrack-link"
                      href={music.trackUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink
                        size={12}
                      />

                      View this song on
                      Apple Music / iTunes
                    </a>
                  )}

                {/* LOCAL AUDIO LABEL */}

                {!isOnlineMusic &&
                  music?.audioUrl && (
                    <span className="memory-local-audio-label">
                      <Music size={12} />

                      Added from your
                      device
                    </span>
                  )}

                {/* APPLE ATTRIBUTION */}

                {isOnlineMusic && (
                  <p className="memory-soundtrack-attribution">
                    Music preview provided
                    courtesy of iTunes.
                  </p>
                )}
              </motion.div>
            )}

            {/* =========================
                FOOTER
            ========================= */}

            <div className="memory-modal-footer">
              <div className="memory-modal-info">
                <span>
                  {memory.tag ||
                    "Memory"}
                </span>

                {memory.photo?.url && (
                  <span className="memory-photo-label">
                    <Image size={14} />

                    Photo memory
                  </span>
                )}

                {hasMusic && (
                  <span className="memory-music-label">
                    <Music size={14} />

                    Soundtrack
                  </span>
                )}
              </div>

              {/* ACTIONS */}

              <div className="memory-modal-actions">
                <button
                  className="memory-edit-button"
                  onClick={() =>
                    onEdit(memory)
                  }
                >
                  <Edit3 size={14} />

                  Edit
                </button>

                <button
                  className="memory-delete-button"
                  onClick={onDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MemoryModal;