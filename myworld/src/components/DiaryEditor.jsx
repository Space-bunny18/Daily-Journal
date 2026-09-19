import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Image,
  MapPin,
  Music,
  Pause,
  Play,
  Plus,
  Search,
  LoaderCircle,
  Save,
  Tag,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  uploadMemoryPhoto,
  deleteMemoryPhoto,
} from "../lib/photoService";

import {
  uploadMemoryAudio,
} from "../lib/audioService";
import "./diary-editor.css";

function DiaryEditor({
  theme,
  userId,
  onBack,
  onSave,
  editingMemory,
  initialMood,
  initialPrompt,
}) {
  // =========================
  // EDITOR STATE
  // =========================

  const [mood, setMood] = useState(
    editingMemory?.mood || initialMood || "😊"
  );

  const [title, setTitle] = useState(
    editingMemory?.title || ""
  );

  const [story, setStory] = useState(
    editingMemory?.text || ""
  );

  const [photo, setPhoto] = useState(
    editingMemory?.photo || null
  );
  const [location, setLocation] = useState(
    editingMemory?.location || null
  );

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // =========================
  // TAG STATE
  // =========================

  const defaultTags = [
    "College",
    "Friends",
    "Travel",
    "Family",
    "Personal",
    "Ideas",
  ];

  const [tagsOpen, setTagsOpen] = useState(false);
  const [tags, setTags] = useState(
    Array.isArray(editingMemory?.tags)
      ? editingMemory.tags
      : []
  );
  const [customTag, setCustomTag] = useState("");

  // =========================
  // MUSIC STATE
  // =========================

  const [musicOpen, setMusicOpen] = useState(false);

  const [songName, setSongName] = useState(
    editingMemory?.music?.song || ""
  );

  const [artistName, setArtistName] = useState(
    editingMemory?.music?.artist || ""
  );

  const [audioFile, setAudioFile] = useState(
  editingMemory?.music?.source === "upload"
    ? {
        name:
          editingMemory.music.audioName ||
          "Audio preview",
        type:
          editingMemory.music.audioType || "",
        url: editingMemory.music.audioUrl || "",
        path:
          editingMemory.music.audioPath || null,
      }
    : null
);

  const [isPlaying, setIsPlaying] = useState(false);

  // =========================
  // ONLINE MUSIC SEARCH
  // =========================

  const [musicSearch, setMusicSearch] = useState(
    editingMemory?.music?.source === "itunes"
      ? editingMemory.music.song || ""
      : ""
  );

  const [musicResults, setMusicResults] = useState([]);

  const [musicSearching, setMusicSearching] =
    useState(false);

  const [musicSearchError, setMusicSearchError] =
    useState("");

  const [selectedOnlineMusic, setSelectedOnlineMusic] =
    useState(
      editingMemory?.music?.source === "itunes"
        ? editingMemory.music
        : null
    );

  const [previewingTrackId, setPreviewingTrackId] =
    useState(null);

  // =========================
  // REFS
  // =========================

  const audioRef = useRef(null);
  const searchAudioRef = useRef(null);

  const searchTimerRef = useRef(null);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const colors = theme.colors;

  const moods = [
    "😊",
    "😌",
    "🥰",
    "😐",
    "😔",
    "😤",
    "😭",
  ];

  // =========================
  // PHOTO
  // =========================

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    return;
  }

  try {
    const { data, error } =
      await uploadMemoryPhoto(file, userId);

    if (error) {
      console.error(
        "Could not upload photo:",
        error
      );

      window.alert(
        "Could not upload this photo. Please try again."
      );

      return;
    }

    if (data) {
  const previousPhotoPath = photo?.path;

  const reader = new FileReader();

  reader.onload = async () => {
    setPhoto({
      name: data.name,
      type: data.type,
      url: reader.result,
      path: data.path,
    });

    if (previousPhotoPath) {
      const { error: deleteError } =
        await deleteMemoryPhoto(previousPhotoPath);

      if (deleteError) {
        console.error(
          "Could not delete previous photo:",
          deleteError
        );
      }
    }
  };

  reader.readAsDataURL(file);
}
  } catch (error) {
    console.error(
      "Unexpected photo upload error:",
      error
    );

    window.alert(
      "Could not upload this photo. Please try again."
    );
  } finally {
    event.target.value = "";
  }
};

  const removePhoto = async () => {
  if (photo?.path) {
    const { error } = await deleteMemoryPhoto(
      photo.path
    );

    if (error) {
      console.error(
        "Could not delete photo:",
        error
      );

      window.alert(
        "Could not remove this photo. Please try again."
      );

      return;
    }
  }

  setPhoto(null);
};

  // =========================
  // MUSIC PANEL
  // =========================

  const handleMusicClick = () => {
    setMusicOpen((current) => !current);
  };

  // =========================
  // ONLINE MUSIC SEARCH
  // =========================

  const searchMusic = (query) => {
    const term = query.trim();

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!term) {
      setMusicResults([]);
      setMusicSearching(false);
      setMusicSearchError("");
      return;
    }

    setMusicSearching(true);
    setMusicSearchError("");

    // Small debounce so we don't call the API on
    // every single keystroke.
    searchTimerRef.current = setTimeout(async () => {
      try {
        const url = new URL(
          "https://itunes.apple.com/search"
        );

        url.searchParams.set("term", term);
        url.searchParams.set("country", "IN");
        url.searchParams.set("media", "music");
        url.searchParams.set("entity", "song");
        url.searchParams.set("limit", "8");

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Music search failed");
        }

        const data = await response.json();

        const results = (data.results || []).filter(
          (track) =>
            track.previewUrl &&
            track.trackName &&
            track.artistName
        );

        setMusicResults(results);
      } catch (error) {
        console.error(
          "Music search failed:",
          error
        );

        setMusicResults([]);

        setMusicSearchError(
          "Could not search songs right now. You can still add audio from your computer."
        );
      } finally {
        setMusicSearching(false);
      }
    }, 400);
  };

  // =========================
  // SONG PREVIEW
  // =========================

  const toggleSongPreview = async (track) => {
    if (
      !track.previewUrl ||
      !searchAudioRef.current
    ) {
      return;
    }

    const player = searchAudioRef.current;

    try {
      // Clicking the currently playing song
      // pauses its preview.
      if (
        previewingTrackId === track.trackId
      ) {
        player.pause();
        player.currentTime = 0;

        setPreviewingTrackId(null);

        return;
      }

      // Stop previous preview.
      player.pause();

      player.src = track.previewUrl;
      player.currentTime = 0;

      await player.play();

      setPreviewingTrackId(track.trackId);
    } catch (error) {
      console.error(
        "Song preview failed:",
        error
      );

      setPreviewingTrackId(null);
    }
  };

  // =========================
  // USE ONLINE SONG
  // =========================

  const handleUseOnlineSong = (track) => {
    if (searchAudioRef.current) {
      searchAudioRef.current.pause();
      searchAudioRef.current.currentTime = 0;
    }

    const selectedSong = {
      source: "itunes",
      trackId: track.trackId,
      song: track.trackName,
      artist: track.artistName,
      artwork:
        track.artworkUrl100 || null,
      previewUrl:
        track.previewUrl || null,
      trackUrl:
        track.trackViewUrl || null,
      album:
        track.collectionName || null,
    };

    setSelectedOnlineMusic(selectedSong);

    setSongName(track.trackName);
    setArtistName(track.artistName);

    // If an online song is selected,
    // remove the local audio selection.
    setAudioFile(null);

    setPreviewingTrackId(null);
  };

  // =========================
  // LOCAL AUDIO
  // =========================

  const handleAudioClick = () => {
    audioInputRef.current?.click();
  };

  const handleAudioChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("audio/")) {
    window.alert("Please select a valid audio file.");
    event.target.value = "";
    return;
  }

  try {
    const { data, error } =
      await uploadMemoryAudio(file, userId);

    if (error) {
      console.error(
        "Could not upload audio:",
        error
      );

      window.alert(
        "Could not upload this audio. Please try again."
      );

      return;
    }

    if (!data) return;

    // Keep a local preview for the editor.
    // The actual stored file is now in Supabase Storage.
    const reader = new FileReader();

    reader.onload = () => {
      setAudioFile({
        name: data.name,
        type: data.type,
        url: reader.result,
        path: data.path,
      });

      // Selecting local audio means
      // we're no longer using the online song.
      setSelectedOnlineMusic(null);

      setMusicSearch("");
      setMusicResults([]);
      setIsPlaying(false);
    };

    reader.readAsDataURL(file);
  } catch (error) {
    console.error(
      "Unexpected audio upload error:",
      error
    );

    window.alert(
      "Could not upload this audio. Please try again."
    );
  } finally {
    event.target.value = "";
  }
};

  const toggleAudio = async () => {
    if (!audioRef.current || !audioFile) {
      return;
    }

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();

        setIsPlaying(true);
      } else {
        audioRef.current.pause();

        setIsPlaying(false);
      }
    } catch (error) {
      console.error(
        "Audio playback failed:",
        error
      );

      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // =========================
  // REMOVE MUSIC
  // =========================

  const removeMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (searchAudioRef.current) {
      searchAudioRef.current.pause();
      searchAudioRef.current.currentTime = 0;
    }

    setSongName("");
    setArtistName("");

    setAudioFile(null);

    setSelectedOnlineMusic(null);

    setMusicSearch("");
    setMusicResults([]);

    setPreviewingTrackId(null);

    setIsPlaying(false);

    setMusicOpen(false);
  };
// =========================
// LOCATION
// =========================

const handleLocationClick = () => {
  if (!navigator.geolocation) {
    setLocationError(
      "Location is not supported by your browser."
    );
    return;
  }

  setLocationLoading(true);
  setLocationError("");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Could not find location");
        }

        const data = await response.json();

        const address = data.address || {};

        const readableLocation =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county ||
          "Current location";

        const area =
          address.suburb ||
          address.neighbourhood ||
          address.road ||
          "";

        setLocation({
          latitude,
          longitude,
          name: readableLocation,
          area,
          displayName:
            area && area !== readableLocation
              ? `${area}, ${readableLocation}`
              : readableLocation,
        });
      } catch (error) {
        console.error("Location lookup failed:", error);

        setLocation({
          latitude,
          longitude,
          name: "Current location",
          area: "",
          displayName: "Current location",
        });
      } finally {
        setLocationLoading(false);
      }
    },
    (error) => {
      console.error("Location permission/error:", error);

      setLocationLoading(false);

      if (error.code === 1) {
        setLocationError(
          "Location permission was denied."
        );
      } else if (error.code === 2) {
        setLocationError(
          "Your location could not be determined."
        );
      } else {
        setLocationError(
          "Unable to get your location right now."
        );
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    }
  );
};

const removeLocation = () => {
  setLocation(null);
  setLocationError("");
};

// =========================
// TAGS
// =========================

const toggleTag = (tag) => {
  setTags((currentTags) =>
    currentTags.includes(tag)
      ? currentTags.filter((item) => item !== tag)
      : [...currentTags, tag]
  );
};

const addCustomTag = () => {
  const value = customTag.trim();

  if (!value) return;

  const exists = tags.some(
    (tag) => tag.toLowerCase() === value.toLowerCase()
  );

  if (!exists) {
    setTags((currentTags) => [...currentTags, value]);
  }

  setCustomTag("");
};

const removeTag = (tag) => {
  setTags((currentTags) =>
    currentTags.filter((item) => item !== tag)
  );
};

const handleTagKeyDown = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addCustomTag();
  }
};

// =========================
// SAVE
// =========================

const handleSave = () => {
  const hasMusic =
    selectedOnlineMusic ||
    songName.trim() ||
    artistName.trim() ||
    audioFile;

  const entry = {
    ...(editingMemory?.id
      ? { id: editingMemory.id }
      : {}),
    title,
    story,
    mood,

    date: new Date().toISOString(),

photo: photo
  ? {
      name: photo.name,
      type: photo.type,
      path: photo.path,
    }
  : null,

    location: location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          name: location.name,
          area: location.area,
          displayName: location.displayName,
        }
      : null,

    tags: [...tags],

    music: hasMusic
      ? selectedOnlineMusic
        ? {
            ...selectedOnlineMusic,
          }
       : {
            source: "upload",
            song: songName.trim(),
            artist: artistName.trim(),
            audioPath: audioFile?.path || null,
            audioName: audioFile?.name || null,
            audioType: audioFile?.type || null,
          }
      : null,
  };

  console.log("New diary entry:", entry);

  if (onSave) {
    onSave(entry);
  }
};

  // =========================
  // UI
  // =========================

  return (
    <main
      className={`diary-editor theme-${theme.id}`}
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
      {/* =========================
          HEADER
      ========================= */}

      <header className="editor-header">
        <motion.button
          className="editor-back"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />

          <span>
            Back to my world
          </span>
        </motion.button>

        <div className="editor-logo">
          <span>✦</span>
          MYWORLD
        </div>

        <motion.button
          className="save-top-button"
          onClick={handleSave}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Save size={16} />

          Save memory
        </motion.button>
      </header>

      <section className="editor-content">
        {/* =========================
            INTRO
        ========================= */}

        <motion.div
          className="editor-intro"
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
          <span className="editor-date">
            {new Date()
              .toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )
              .toUpperCase()
              .replace(",", " ·")}
          </span>

          <h1>
            How was your
            <br />
            <em>day?</em>
          </h1>

          <p>
            Put the moment into words.
            It doesn't have to be perfect.
          </p>
        </motion.div>
        {/* =========================
    DAILY PROMPT
========================= */}

{initialPrompt && !editingMemory && (
  <motion.div
    className="editor-prompt"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    style={{
      background: colors.accentSoft,
      border: `1px solid ${colors.border}`,
      color: colors.text,
    }}
  >
    <div className="editor-prompt-icon">
      ✦
    </div>

    <div className="editor-prompt-content">
      <span
        className="editor-prompt-label"
        style={{ color: colors.accent }}
      >
        TODAY'S THOUGHT
      </span>

      <p>{initialPrompt}</p>

      <span className="editor-prompt-hint">
        Let this thought guide your entry — or simply write whatever feels right.
      </span>
    </div>
  </motion.div>
)}
        {/* =========================
            EDITOR PAPER
        ========================= */}

        <motion.div
          className="editor-paper"
          initial={{
            opacity: 0,
            y: 30,
            rotate: 0.5,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
        >
          <div className="paper-corner" />

          {/* =========================
              MOOD
          ========================= */}

          <div className="editor-section">
            <label>
              HOW ARE YOU FEELING?
            </label>

            <div className="editor-moods">
              {moods.map((item) => (
                <motion.button
                  key={item}
                  type="button"
                  className={`editor-mood ${
                    mood === item
                      ? "editor-mood-active"
                      : ""
                  }`}
                  onClick={() =>
                    setMood(item)
                  }
                  whileHover={{
                    y: -4,
                    scale: 1.08,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="editor-divider" />

          {/* =========================
              TITLE
          ========================= */}

          <div className="editor-section">
            <label>
              GIVE THIS MEMORY A TITLE
            </label>

            <input
              className="title-input"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Something worth remembering..."
              maxLength={80}
            />
          </div>

          {/* =========================
              STORY
          ========================= */}

          <div className="editor-section story-section">
            <label>
              TELL YOUR STORY
            </label>

            <textarea
              className="story-input"
              value={story}
              onChange={(event) =>
                setStory(event.target.value)
              }
              placeholder="Today I..."
              rows={9}
            />
          </div>

          {/* =========================
              PHOTO PREVIEW
          ========================= */}

          <AnimatePresence>
            {photo && (
              <motion.div
                className="photo-preview"
                initial={{
                  opacity: 0,
                  y: 15,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.98,
                }}
              >
                <img
                  src={photo.url}
                  alt="Diary memory"
                />

                <button
                  type="button"
                  className="remove-photo"
                  onClick={removePhoto}
                  aria-label="Remove photo"
                >
                  <X size={17} />
                </button>

                <div className="photo-name">
                  {photo.name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =========================
              MUSIC PANEL
          ========================= */}

          <AnimatePresence>
              {musicOpen && (
                <motion.div
                  className="music-panel"
                  initial={{
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -6,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                {/* MUSIC HEADER */}

                <div className="music-panel-header">
                  <div>
                    <span className="music-panel-icon">
                      <Music size={17} />
                    </span>

                    <div>
                      <strong>
                        What were you
                        listening to?
                      </strong>

                      <small>
                        Add a soundtrack to
                        this memory.
                      </small>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeMusic}
                    aria-label="Remove music"
                    className="music-remove"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* =========================
                    SEARCH
                ========================= */}

                <div className="music-search-section">
                  <div className="music-search-box">
                    <Search size={17} />

                    <input
                      type="text"
                      value={musicSearch}
                      onChange={(event) => {
                        const value =
                          event.target.value;

                        setMusicSearch(value);

                        searchMusic(value);
                      }}
                      placeholder="Search songs, artists..."
                      maxLength={100}
                    />

                    {musicSearching && (
                      <LoaderCircle
                        size={17}
                        className="music-search-spinner"
                      />
                    )}
                  </div>

                  {/* ERROR */}

                  {musicSearchError && (
                    <p className="music-search-error">
                      {musicSearchError}
                    </p>
                  )}

                  {/* =========================
                      SELECTED SONG
                  ========================= */}

                  {selectedOnlineMusic && (
                    <div className="selected-song-card">
                      {selectedOnlineMusic.artwork ? (
                        <img
                          src={
                            selectedOnlineMusic.artwork
                          }
                          alt=""
                        />
                      ) : (
                        <div className="selected-song-art-placeholder">
                          <Music size={20} />
                        </div>
                      )}

                      <div className="selected-song-info">
                        <strong>
                          {
                            selectedOnlineMusic.song
                          }
                        </strong>

                        <span>
                          {
                            selectedOnlineMusic.artist
                          }
                        </span>
                      </div>

                      <button
                        type="button"
                        className="selected-song-remove"
                        onClick={() => {
                          setSelectedOnlineMusic(
                            null
                          );

                          setSongName("");
                          setArtistName("");
                        }}
                        aria-label="Remove selected song"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* =========================
                      SEARCH RESULTS
                  ========================= */}

                  {musicResults.length >
                    0 &&
                    !selectedOnlineMusic && (
                      <div className="music-results">
                        {musicResults.map(
                          (track) => (
                            <div
                              className="music-result-item"
                              key={
                                track.trackId
                              }
                            >
                              <img
                                src={
                                  track.artworkUrl100
                                }
                                alt=""
                                className="music-result-art"
                              />

                              <div className="music-result-info">
                                <strong>
                                  {
                                    track.trackName
                                  }
                                </strong>

                                <span>
                                  {
                                    track.artistName
                                  }
                                </span>
                              </div>

                              {/* PREVIEW */}

                              <button
                                type="button"
                                className={`music-preview-button ${
                                  previewingTrackId ===
                                  track.trackId
                                    ? "is-playing"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleSongPreview(
                                    track
                                  )
                                }
                                aria-label={
                                  previewingTrackId ===
                                  track.trackId
                                    ? "Pause preview"
                                    : "Play preview"
                                }
                              >
                                {previewingTrackId ===
                                track.trackId ? (
                                  <Pause
                                    size={16}
                                  />
                                ) : (
                                  <Play
                                    size={16}
                                  />
                                )}
                              </button>

                              {/* USE */}

                              <button
                                type="button"
                                className="music-use-button"
                                onClick={() =>
                                    handleUseOnlineSong(track)
                                  }
                              >
                                Use
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {/* NO RESULTS */}

                  {musicSearch.trim() &&
                    !musicSearching &&
                    musicResults.length ===
                      0 &&
                    !musicSearchError && (
                      <p className="music-no-results">
                        No songs found. Try
                        another search.
                      </p>
                    )}

                  {/* APPLE ATTRIBUTION */}

                  <p className="music-attribution">
                    Music previews provided
                    courtesy of iTunes.
                  </p>

                  {selectedOnlineMusic?.trackUrl && (
                    <a
                      className="music-store-link"
                      href={
                        selectedOnlineMusic.trackUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      View this song on Apple
                      Music / iTunes ↗
                    </a>
                  )}
                </div>

                {/* ONE SHARED PREVIEW PLAYER */}

                <audio
                  ref={searchAudioRef}
                  onEnded={() =>
                    setPreviewingTrackId(null)
                  }
                  preload="none"
                />

                {/* =========================
                    LOCAL AUDIO DIVIDER
                ========================= */}

                <div className="music-manual-divider">
                  <span>
                    or add your own audio
                  </span>
                </div>

                {/* =========================
                    LOCAL AUDIO
                ========================= */}

                <div className="audio-section">
                  {!audioFile ? (
                    <button
                      type="button"
                      className="audio-upload-button"
                      onClick={handleAudioClick}
                    >
                      <Music size={16} />

                      <span>
                        <strong>
                          Add audio preview
                        </strong>

                        <small>
                          MP3, WAV, OGG or other
                          audio file
                        </small>
                      </span>

                      <Plus size={16} />
                    </button>
                  ) : (
                    <div className="audio-player-card">
                      <button
                        type="button"
                        className="audio-play-button"
                        onClick={toggleAudio}
                        aria-label={
                          isPlaying
                            ? "Pause audio"
                            : "Play audio"
                        }
                      >
                        {isPlaying ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} />
                        )}
                      </button>

                      <div className="audio-player-info">
                        <strong>
                          {songName.trim() ||
                            audioFile.name}
                        </strong>

                        <small>
                          {artistName.trim() ||
                            audioFile.name}
                        </small>
                      </div>

                      <button
                        type="button"
                        className="audio-change-button"
                        onClick={handleAudioClick}
                      >
                        Change
                      </button>

                      <button
                        type="button"
                        className="audio-remove-button"
                        onClick={() => {
                          if (
                            audioRef.current
                          ) {
                            audioRef.current.pause();
                          }

                          setAudioFile(null);
                          setIsPlaying(false);
                        }}
                        aria-label="Remove audio"
                      >
                        <X size={16} />
                      </button>

                      <audio
                        ref={audioRef}
                        src={audioFile.url}
                        onEnded={
                          handleAudioEnded
                        }
                        preload="metadata"
                      />
                    </div>
                  )}
                </div>

                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  style={{
                    display: "none",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="editor-divider" />

          {/* =========================
              MEMORY TOOLS
          ========================= */}

          <div className="memory-tools">
            {/* PHOTO */}

            <button
              type="button"
              className={`memory-tool ${
                photo
                  ? "memory-tool-active"
                  : ""
              }`}
              onClick={handlePhotoClick}
            >
              <span className="tool-icon">
                <Image size={17} />
              </span>

              <span>
                <strong>
                  {photo
                    ? "Change photo"
                    : "Photo"}
                </strong>

                <small>
                  {photo
                    ? "Choose another image"
                    : "Add a moment"}
                </small>
              </span>

              <Plus size={15} />
            </button>

            {/* MUSIC */}

            <button
              type="button"
              className={`memory-tool ${
                selectedOnlineMusic ||
                songName.trim() ||
                artistName.trim() ||
                audioFile
                  ? "memory-tool-active"
                  : ""
              }`}
              onClick={handleMusicClick}
            >
              <span className="tool-icon">
                <Music size={17} />
              </span>

              <span>
                <strong>
                  {songName.trim()
                    ? songName
                    : "Music"}
                </strong>

                <small>
                  {songName.trim()
                    ? artistName ||
                      "Audio added"
                    : "What were you listening to?"}
                </small>
              </span>

              {musicOpen ? (
                <X size={15} />
              ) : (
                <Plus size={15} />
              )}
            </button>
            {/* LOCATION */}
            <button
              type="button"
              className={`memory-tool ${
                location ? "memory-tool-active" : ""
              }`}
              onClick={handleLocationClick}
              disabled={locationLoading}
            >
              <span className="tool-icon">
                <MapPin size={17} />
              </span>

              <span>
                <strong>
                  {location
                    ? location.name
                    : "Location"}
                </strong>

                <small>
                  {location
                    ? location.area || "Location added"
                    : locationLoading
                    ? "Finding your location..."
                    : "Where did this happen?"}
                </small>
              </span>

              {locationLoading ? (
                <LoaderCircle
                  size={15}
                  className="location-spinner"
                />
              ) : location ? (
                <span
                  className="location-remove"
                  role="button"
                  tabIndex={0}
                  aria-label="Remove location"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeLocation();
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      event.stopPropagation();
                      removeLocation();
                    }
                  }}
                >
                  <X size={15} />
                </span>
              ) : (
                <Plus size={15} />
              )}
            </button>
            {/* TAG */}

            <button
              type="button"
              className={`memory-tool ${
                tags.length > 0
                  ? "memory-tool-active"
                  : ""
              }`}
              onClick={() =>
                setTagsOpen((current) => !current)
              }
            >
              <span className="tool-icon">
                <Tag size={17} />
              </span>

              <span>
                <strong>
                  {tags.length > 0
                    ? `${tags.length} ${
                        tags.length === 1 ? "tag" : "tags"
                      }`
                    : "Tag"}
                </strong>

                <small>
                  {tags.length > 0
                    ? tags.join(" · ")
                    : "Add a category"}
                </small>
              </span>

              {tagsOpen ? (
                <X size={15} />
              ) : (
                <Plus size={15} />
              )}
            </button>
          </div>
          {/* =========================
              TAG PANEL
          ========================= */}

          <AnimatePresence>
            {tagsOpen && (
              <motion.div
                className="tag-panel"
                style={{
                  marginTop: "16px",
                  padding: "18px",
                  borderRadius: "16px",
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <div className="tag-panel-header">
                  <div>
                    <strong>Add tags to this memory</strong>
                    <small>
                      Organize this moment so you can find it later.
                    </small>
                  </div>

                  <button
                    type="button"
                    className="tag-panel-close"
                    onClick={() => setTagsOpen(false)}
                    aria-label="Close tags"
                  >
                    <X size={16} />
                  </button>
                </div>

                {tags.length > 0 && (
                  <div
                    style={{
                      marginBottom: "10px",
                      fontSize: "12px",
                      color: colors.textMuted,
                    }}
                  >
                    {tags.length}{" "}
                    {tags.length === 1 ? "tag" : "tags"} selected
                  </div>
                )}

                <div className="tag-options">
                  {defaultTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-option ${
                        tags.includes(tag)
                          ? "tag-option-active"
                          : ""
                      }`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        margin: "4px",
                        padding: "8px 12px",
                        borderRadius: "999px",
                        border: `1px solid ${
                          tags.includes(tag)
                            ? colors.accent
                            : colors.border
                        }`,
                        background: tags.includes(tag)
                          ? colors.accentSoft
                          : "transparent",
                        color: colors.text,
                        cursor: "pointer",
                      }}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {tags.includes(tag) && <X size={13} />}
                    </button>
                  ))}
                </div>

                <div
                  className="custom-tag-row"
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "14px",
                  }}
                >
                  <input
                    type="text"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${colors.border}`,
                      background: "transparent",
                      color: colors.text,
                      outline: "none",
                    }}
                    value={customTag}
                    onChange={(event) =>
                      setCustomTag(event.target.value)
                    }
                    onKeyDown={handleTagKeyDown}
                    placeholder="Create your own tag..."
                    maxLength={30}
                  />

                  <button
                    type="button"
                    onClick={addCustomTag}
                  >
                    Add
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="selected-tags">
                    <span>Selected</span>

                    <div className="selected-tags-list">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="selected-tag"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <X size={12} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="tag-done-button"
                  onClick={() => setTagsOpen(false)}
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {locationError && (
  <motion.p
    className="location-error"
    initial={{
      opacity: 0,
      y: -5,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
  >
    <MapPin size={14} />
    {locationError}
  </motion.p>
)}
          {/* =========================
              SAVE
          ========================= */}

          <motion.button
            type="button"
            className="save-memory-button"
            onClick={handleSave}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={18} />

            Save this memory
          </motion.button>

          {/* =========================
              HIDDEN PHOTO INPUT
          ========================= */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhotoChange}
            style={{
              display: "none",
            }}
          />
        </motion.div>

        <p className="editor-footer">
          ✦ Your memory belongs to you.
        </p>
      </section>
    </main>
  );
}

export default DiaryEditor;