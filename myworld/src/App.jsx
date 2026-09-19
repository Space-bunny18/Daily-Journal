import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  getMemoryPhotoUrl,
  deleteMemoryPhoto,
} from "./lib/photoService";
import {
  getMemoryAudioUrl,
  deleteMemoryAudio,
} from "./lib/audioService";
import {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
} from "./lib/memoryService";

import Onboarding from "./components/onboarding.jsx";
import SmoothScroll from "./components/SmoothScroll";
import themes from "./themes/themes";

import DiaryHome from "./components/DiaryHome";
import DiaryEditor from "./components/DiaryEditor";
import Memories from "./components/Memories";
import Calendar from "./components/Calendar";
import MemoryModal from "./components/MemoryModal";
import MoodTimeline from "./components/MoodTimeline";
import OnThisDay from "./components/OnThisDay";
import Privacy from "./components/Privacy";
import LockScreen from "./components/LockScreen";
import ConfirmDialog from "./components/ConfirmDialog";
import Toast from "./components/Toast";

import { getResurfacedMemory } from "./utils/memoryResurfacing";

import Auth from "./components/Auth";
import ResetPassword from "./components/ResetPassword";
import "./App.css";

/* =========================================================
   LANDING PAGE PARTICLES
========================================================= */

const particles = Array.from(
  { length: 22 },
  (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 5,
  })
);

/* =========================================================
   INITIAL MEMORIES
========================================================= */

const initialMemories = [
  {
    id: 1,
    date: "SEPTEMBER 15",
    day: "TUESDAY",
    time: "9:34 PM",
    mood: "😊",
    title: "Today felt...",
    text: "I laughed more than I expected today. Sometimes the ordinary days quietly become your favorite ones.",
    tag: "A good day",
  },

  {
    id: 2,
    date: "SEPTEMBER 12",
    day: "SATURDAY",
    time: "11:48 PM",
    mood: "🌧️",
    title: "Rainy thoughts...",
    text: "The rain made everything slower today. I stayed inside, listened to music, and somehow felt completely okay.",
    tag: "Slow moments",
  },

  {
    id: 3,
    date: "SEPTEMBER 08",
    day: "TUESDAY",
    time: "7:21 PM",
    mood: "☕",
    title: "Little things...",
    text: "A cup of coffee, a good song, and a conversation I didn't want to end. Maybe happiness is usually this simple.",
    tag: "Small joys",
  },
];

/* =========================================================
   APP
========================================================= */

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [screen, setScreen] = useState("landing");

  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem("myworld-locked") === "true";
  });

  const [autoLockMinutes, setAutoLockMinutes] =
    useState("never");

  useEffect(() => {
  let mounted = true;

  const loadSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!mounted) return;

    const authenticatedUser = session?.user ?? null;

setUser(authenticatedUser);

if (authenticatedUser) {
  const savedAutoLock =
    localStorage.getItem(
      `myworld-autolock-${authenticatedUser.id}`
    ) || "never";

  setAutoLockMinutes(savedAutoLock);

  setScreen("diary");
} else {
  setAutoLockMinutes("never");
  setScreen("landing");
}
    setAuthLoading(false);
  };

  loadSession();

  const {
  data: { subscription },
} = supabase.auth.onAuthStateChange(
  (event, session) => {
    const authenticatedUser =
      session?.user ?? null;

    setUser(authenticatedUser);

    if (authenticatedUser) {
      const savedAutoLock =
        localStorage.getItem(
          `myworld-autolock-${authenticatedUser.id}`
        ) || "never";

      setAutoLockMinutes(savedAutoLock);
    } else {
      setAutoLockMinutes("never");
    }

    if (event === "PASSWORD_RECOVERY") {
      setScreen("reset-password");
    }
  }
);

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

useEffect(() => {
  if (
    screen !== "landing" &&
    screen !== "onboarding"
  ) {
    localStorage.setItem(
      "myworld-screen",
      screen
    );
  }
}, [screen]);
 const [selectedTheme, setSelectedTheme] = useState(() => {
  const savedThemeId = localStorage.getItem("myworld-theme");

  if (!savedThemeId) return null;

  return Array.isArray(themes)
    ? themes.find((theme) => theme.id === savedThemeId) || null
    : themes[savedThemeId] || null;
});

  const [activeMemory, setActiveMemory] =
    useState(0);

  const [editingMemory, setEditingMemory] =
    useState(null);

  const [
    selectedCalendarMemory,
    setSelectedCalendarMemory,
  ] = useState(null);
  const [showCalendarDeleteDialog, setShowCalendarDeleteDialog] =
  useState(false);
  const [showOnThisDayDeleteDialog, setShowOnThisDayDeleteDialog] =
  useState(false);
const [toast, setToast] = useState(null);
useEffect(() => {
  if (
    autoLockMinutes === "never" ||
    !selectedTheme ||
    isLocked
  ) {
    return;
  }

  const timeoutDuration =
    Number(autoLockMinutes) * 60 * 1000;

  let lockTimer;

  const resetLockTimer = () => {
    clearTimeout(lockTimer);

    lockTimer = setTimeout(() => {
      localStorage.setItem(
        "myworld-locked",
        "true"
      );

      setIsLocked(true);
    }, timeoutDuration);
  };

  const activityEvents = [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
  ];

  activityEvents.forEach((event) => {
    window.addEventListener(
      event,
      resetLockTimer
    );
  });

  resetLockTimer();

  return () => {
    clearTimeout(lockTimer);

    activityEvents.forEach((event) => {
      window.removeEventListener(
        event,
        resetLockTimer
      );
    });
  };
}, [
  autoLockMinutes,
  selectedTheme,
  isLocked,
]);

  /* =======================================================
     DRAFT DATA
  ======================================================= */

  // Mood selected before opening the editor
  const [draftMood, setDraftMood] =
    useState("😊");

  // Daily prompt passed into the editor
  const [draftPrompt, setDraftPrompt] =
    useState("");

 /* =======================================================
   MEMORIES
======================================================= */

const [memories, setMemories] = useState([]);
const [memoriesLoading, setMemoriesLoading] =
  useState(false);
const resurfacedMemory =
  getResurfacedMemory(memories);

useEffect(() => {
  if (!user) return;

  const loadUserMemories = async () => {
    setMemoriesLoading(true);
    const { data, error } =
      await getMemories(user.id);

    if (error) {
      console.error(
        "Could not load user memories:",
        error
      );

      setMemoriesLoading(false);
      return;
    }

   const formattedMemories = await Promise.all(
        (data || []).map(async (memory) => {
          let photo = memory.photo || null;

          if (photo?.path) {
            const { data: photoUrlData, error: photoUrlError } =
              await getMemoryPhotoUrl(photo.path);

            if (!photoUrlError && photoUrlData) {
              photo = {
                ...photo,
                url: photoUrlData,
              };
            }
          }
          let music = memory.music || null;

  if (music?.source === "upload" && music?.audioPath) {
    const {
      data: audioUrlData,
      error: audioUrlError,
    } = await getMemoryAudioUrl(music.audioPath);

    if (!audioUrlError && audioUrlData) {
      music = {
        ...music,
        audioUrl: audioUrlData,
      };
    }
  }

          return {
            id: memory.id,
            date: memory.entry_date,
            day: memory.day,
            time: memory.time,
            mood: memory.mood,
            favorite: memory.favorite ?? false,
            title: memory.title,
            text: memory.story,
            tag: memory.tag,
            photo,
            location: memory.location,
            tags: Array.isArray(memory.tags)
              ? memory.tags
              : [],
            music,
          };
        })
      );

    setMemories(formattedMemories);
    setMemoriesLoading(false);
  };

  loadUserMemories();
}, [user]);
const handleToggleFavorite = async (
  memoryId,
  favorite
) => {
  const memoryToUpdate = memories.find(
    (memory) => memory.id === memoryId
  );

  if (!memoryToUpdate) return;

  const updatedMemory = {
    ...memoryToUpdate,
    favorite,
  };

  const { data, error } = await updateMemory(
    user.id,
    memoryId,
    updatedMemory
  );

  if (error) {
    console.error(
      "Could not update favorite:",
      error
    );

    setToast({
      message: "Could not update favorite. Please try again.",
      type: "error",
    });
    return;
  }

  if (data) {
    setMemories((currentMemories) =>
      currentMemories.map((memory) =>
        memory.id === memoryId
          ? {
              ...memory,
              favorite: data.favorite ?? favorite,
            }
          : memory
      )
    );
  }
};
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Could not sign out:", error);
    setToast({
        message: "Could not log out. Please try again.",
        type: "error",
      });
    return;
  }

  setUser(null);
  setMemories([]);
  setEditingMemory(null);
  setSelectedCalendarMemory(null);
  setActiveMemory(0);
  setDraftMood("😊");
  setDraftPrompt("");
  localStorage.removeItem("myworld-locked");
  setIsLocked(false);
  localStorage.setItem("myworld-screen", "landing");
  setScreen("landing");
};
const landingMemories =
  memories.length > 0
    ? memories
    : initialMemories;
/* =========================================================
   AUTH LOADING
========================================================= */

if (authLoading) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf7fb",
        color: "#7d5a72",
        fontSize: "14px",
        letterSpacing: "0.08em",
      }}
    >
      MYWORLD
    </div>
  );
}
if (screen === "reset-password") {
  return <ResetPassword />;
}
if (!user && screen !== "landing" && screen !== "auth") {
  return (
    <Auth
      onAuthenticated={(authenticatedUser) => {
        setUser(authenticatedUser);

        const savedAutoLock =
          localStorage.getItem(
            `myworld-autolock-${authenticatedUser.id}`
          ) || "never";

        setAutoLockMinutes(savedAutoLock);

        const savedThemeId =
          localStorage.getItem("myworld-theme");

        if (savedThemeId) {
          setScreen("diary");
        } else {
          setScreen("onboarding");
        }
      }}
    />
  );
}
if (isLocked && selectedTheme) {
  return (
    <LockScreen
      theme={selectedTheme}
      onUnlock={() => {
        setIsLocked(false);
        setScreen("diary");
      }}
    />
  );
}
  /* =========================================================
   PRIVACY & SECURITY
========================================================= */

if (
  screen === "privacy" &&
  selectedTheme
) {
  return (
    <>
      <Privacy
      theme={selectedTheme}
      themes={themes}
      memories={memories}
      autoLockMinutes={autoLockMinutes}
     onAutoLockChange={(value) => {
      setAutoLockMinutes(value);

      if (user?.id) {
        localStorage.setItem(
          `myworld-autolock-${user.id}`,
          value
        );
      }
    }}
      onThemeChange={(themeId) => {
        const newTheme = Array.isArray(themes)
          ? themes.find((item) => item.id === themeId)
          : themes[themeId];

        if (!newTheme) return;

        localStorage.setItem(
          "myworld-theme",
          newTheme.id
        );

        setSelectedTheme(newTheme);
      }}
      onBack={() => setScreen("diary")}
            onLogout={handleLogout}
    />

    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
    </>
  );
}

  /* =========================================================
     DIARY HOME
  ========================================================= */

  if (
    screen === "diary" &&
    selectedTheme
  ) {
    return (
      <DiaryHome
        theme={selectedTheme}
        resurfacedMemory={resurfacedMemory}
        userName={
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          user?.email?.split("@")[0] ||
          "there"
        }
        memories={memories}
        memoriesLoading={memoriesLoading}

        onWrite={(mood, prompt) => {
          setDraftMood(mood || "😊");
          setDraftPrompt(prompt || "");
          setScreen("editor");
        }}

        onViewAll={() =>
          setScreen("memories")
        }

        onCalendar={() =>
          setScreen("calendar")
        }

        onMoodTimeline={() =>
          setScreen("mood-timeline")
        }

        onThisDay={() =>
          setScreen("on-this-day")
        }
        onPrivacy={() => setScreen("privacy")}
      />
    );
  }

  /* =========================================================
     ON THIS DAY
  ========================================================= */

  if (
    screen === "on-this-day" &&
    selectedTheme
  ) {
    return (
      <>
        <OnThisDay
          theme={selectedTheme}
          memories={memories}

          onBack={() => {
            setSelectedCalendarMemory(null);
            setScreen("diary");
          }}

          onOpenMemory={(memory) => {
            setSelectedCalendarMemory(memory);
          }}
        />

        {selectedCalendarMemory && (
          <MemoryModal
            memory={selectedCalendarMemory}

            onClose={() => {
              setSelectedCalendarMemory(null);
            }}

            onDelete={() => {
              setShowOnThisDayDeleteDialog(true);
            }}

            onEdit={(memory) => {
              setEditingMemory(memory);
              setSelectedCalendarMemory(null);
              setScreen("editor");
            }}
          />
        )}
        {showOnThisDayDeleteDialog && (
          <ConfirmDialog
            title="Delete this memory?"
            message="This memory will be permanently removed from your world."
            confirmText="Delete memory"
            cancelText="Keep memory"
            onCancel={() => setShowOnThisDayDeleteDialog(false)}
            onConfirm={async () => {
              if (!selectedCalendarMemory) return;

              const memoryToDelete = memories.find(
                (memory) => memory.id === selectedCalendarMemory.id
              );

              if (
                memoryToDelete?.music?.source === "upload" &&
                memoryToDelete?.music?.audioPath
              ) {
                const { error: audioError } =
                  await deleteMemoryAudio(
                    memoryToDelete.music.audioPath
                  );

                if (audioError) {
                  console.error(
                    "Could not delete memory audio:",
                    audioError
                  );

                 setToast({
                  message:
                    "The audio could not be deleted. The memory was not removed.",
                  type: "error",
                });
                  return;
                }
              }

              if (memoryToDelete?.photo?.path) {
                const { error: photoError } =
                  await deleteMemoryPhoto(
                    memoryToDelete.photo.path
                  );

                if (photoError) {
                  console.error(
                    "Could not delete memory photo:",
                    photoError
                  );

                 setToast({
                    message:
                      "The photo could not be deleted. The memory was not removed.",
                    type: "error",
                  });

                  return;
                }
              }

              const { error } = await deleteMemory(
                user.id,
                selectedCalendarMemory.id
              );

              if (error) {
                console.error(
                  "Could not delete memory:",
                  error
                );

               setToast({
                  message:
                    "Your memory could not be deleted. Please try again.",
                  type: "error",
                });
                return;
              }

              setMemories((currentMemories) =>
                currentMemories.filter(
                  (memory) =>
                    memory.id !== selectedCalendarMemory.id
                )
              );

              setSelectedCalendarMemory(null);
              setShowOnThisDayDeleteDialog(false);
            }} 
          />
        )}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  /* =========================================================
     MEMORIES
  ========================================================= */

  if (
    screen === "memories" &&
    selectedTheme
  ) {
      return (
      <>

        <Memories
          theme={selectedTheme}
          memories={memories}
          onToggleFavorite={handleToggleFavorite}

          onBack={() =>
            setScreen("diary")
          }

          onDeleteMemory={async (memoryId) => {

            const memoryToDelete = memories.find(
                (memory) => memory.id === memoryId
              );

              if (
                memoryToDelete?.music?.source === "upload" &&
                memoryToDelete?.music?.audioPath
              ) {
                const { error: audioError } =
                  await deleteMemoryAudio(
                    memoryToDelete.music.audioPath
                  );

                if (audioError) {
                  console.error(
                    "Could not delete memory audio:",
                    audioError
                  );

                  setToast({
                      message:
                        "The audio could not be deleted. The memory was not removed.",
                      type: "error",
                    });

                  return;
                }
              }

              if (memoryToDelete?.photo?.path) {
                const { error: photoError } =
                  await deleteMemoryPhoto(
                    memoryToDelete.photo.path
                  );

                if (photoError) {
                  console.error(
                    "Could not delete memory photo:",
                    photoError
                  );

                  setToast({
                    message:
                      "The photo could not be deleted. The memory was not removed.",
                    type: "error",
                  });

                  return;
                }
              }

              const { error } = await deleteMemory(
                user.id,
                memoryId
              );

              if (error) {
                console.error(
                  "Could not delete memory:",
                  error
                );

                setToast({
                  message:
                    "Your memory could not be deleted. Please try again.",
                  type: "error",
                });

                return;
              }

              setMemories(
                (currentMemories) =>
                  currentMemories.filter(
                    (memory) =>
                      memory.id !== memoryId
                  )
              );
              setToast({
                message: "Memory deleted.",
                type: "success",
              });
            }}

          onEditMemory={(memory) => {
            setEditingMemory(memory);
            setDraftPrompt("");
            setScreen("editor");
          }}
      />
    </>
    );
  }

  /* =========================================================
     DIARY EDITOR
  ========================================================= */

  if (
    screen === "editor" &&
    selectedTheme
  ) {
    return (
      <DiaryEditor
        theme={selectedTheme}
        userId={user.id}
        editingMemory={editingMemory}
        initialMood={draftMood}
        initialPrompt={draftPrompt}

        onBack={() => {
          setEditingMemory(null);
          setDraftPrompt("");
          setScreen("diary");
        }}

        onSave={async (entry) => {
          if (editingMemory) {

            const updatedMemory = {
              ...editingMemory,

              mood: entry.mood,

              title:
                entry.title ||
                "Untitled memory",

              text:
                entry.story ||
                "A moment worth remembering.",

              photo:
                entry.photo ||
                null,

              location:
                entry.location ||
                null,

              tags:
                Array.isArray(entry.tags)
                  ? entry.tags
                  : [],

              music:
                entry.music ||
                null,
            };

            /* =================================================
              SAVE UPDATE TO SUPABASE
            ================================================= */

            const { data, error } =
              await updateMemory(
                user.id,
                editingMemory.id,
                updatedMemory
              );

            if (error) {
              console.error(
                "Could not update memory:",
                error
              );

             setToast({
                message:
                  "Your memory could not be updated. Please try again.",
                type: "error",
              });

              return;
            }

            /* =================================================
              UPDATE LOCAL REACT STATE
            ================================================= */

           if (data) {
              let photo = data.photo || null;

              if (photo?.path) {
                const {
                  data: photoUrlData,
                  error: photoUrlError,
                } = await getMemoryPhotoUrl(photo.path);

                if (!photoUrlError && photoUrlData) {
                  photo = {
                    ...photo,
                    url: photoUrlData,
                  };
                }
              }
              let music = data.music || null;

              if (music?.source === "upload" && music?.audioPath) {
                const {
                  data: audioUrlData,
                  error: audioUrlError,
                } = await getMemoryAudioUrl(music.audioPath);

                if (!audioUrlError && audioUrlData) {
                  music = {
                    ...music,
                    audioUrl: audioUrlData,
                  };
                }
              }

              const savedMemory = {
                id: data.id,
                date: data.entry_date,
                day: data.day,
                time: data.time,
                mood: data.mood,
                favorite: data.favorite ?? false,
                title: data.title,
                text: data.story,
                tag: data.tag,
                photo,
                location: data.location,
                tags: Array.isArray(data.tags)
                  ? data.tags
                  : [],
               music,
              };

              setMemories(
                (currentMemories) =>
                  currentMemories.map(
                    (memory) =>
                      memory.id === editingMemory.id
                        ? savedMemory
                        : memory
                  )
              );
            }
          } else {
        /* =================================================
          CREATE NEW MEMORY
        ================================================= */

        const now = new Date();

        const newMemory = {
          id: Date.now(),
          date: now.toISOString(),
          favorite: false,
          day: now
            .toLocaleDateString("en-US", {
              weekday: "long",
            })
            .toUpperCase(),
          time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
          mood: entry.mood,

          title:
            entry.title ||
            "Untitled memory",

          text:
            entry.story ||
            "A moment worth remembering.",

          tag: "New memory",

          photo:
            entry.photo ||
            null,

          location:
            entry.location ||
            null,

          tags:
            Array.isArray(entry.tags)
              ? entry.tags
              : [],

          music:
            entry.music ||
            null,
        };

        /* =================================================
          SAVE TO SUPABASE
        ================================================= */

        const { data, error } =
          await createMemory(
            user.id,
            newMemory
          );

        if (error) {
          console.error(
            "Could not save memory:",
            error
          );

         setToast({
            message:
              "Your memory could not be saved. Please try again.",
            type: "error",
          });

          return;
        }

            /* =================================================
              USE DATABASE VERSION
            ================================================= */

            if (data) {
              let photo = data.photo || null;

              if (photo?.path) {
                const {
                  data: photoUrlData,
                  error: photoUrlError,
                } = await getMemoryPhotoUrl(photo.path);

                if (!photoUrlError && photoUrlData) {
                  photo = {
                    ...photo,
                    url: photoUrlData,
                  };
                }
              }
              let music = data.music || null;

if (music?.source === "upload" && music?.audioPath) {
  const {
    data: audioUrlData,
    error: audioUrlError,
  } = await getMemoryAudioUrl(music.audioPath);

  if (!audioUrlError && audioUrlData) {
    music = {
      ...music,
      audioUrl: audioUrlData,
    };
  }
}
              const savedMemory = {
                id: data.id,
                date: data.entry_date,
                day: data.day,
                time: data.time,
                mood: data.mood,
                favorite: data.favorite ?? false,
                title: data.title,
                text: data.story,
                tag: data.tag,
                photo,
                location: data.location,
                tags: Array.isArray(data.tags)
                  ? data.tags
                  : [],
                music,
              };

              setMemories(
                (currentMemories) => [
                  savedMemory,
                  ...currentMemories,
                ]
              );
            }
          }

          setEditingMemory(null);
          setDraftPrompt("");
          setActiveMemory(0);
          setScreen("diary");
        }}
      />
    );
  }

  /* =========================================================
     MOOD TIMELINE
  ========================================================= */

  if (
    screen === "mood-timeline" &&
    selectedTheme
  ) {
    return (
      <MoodTimeline
        theme={selectedTheme}
        memories={memories}
        onBack={() =>
          setScreen("diary")
        }
      />
    );
  }

  /* =========================================================
     ONBOARDING
  ========================================================= */

  if (screen === "onboarding") {
    return (
      <Onboarding
        onBack={() =>
          setScreen("landing")
        }

        onComplete={(themeId) => {
          const theme =
            Array.isArray(themes)
              ? themes.find(
                  (item) =>
                    item.id === themeId
                )
              : themes[themeId];

          if (!theme) {
            console.error(
              "Theme not found:",
              themeId
            );

            return;
          }

          localStorage.setItem("myworld-theme", theme.id);
          setSelectedTheme(theme);
          setScreen("diary");
        }}
      />
    );
  }

  /* =========================================================
     CALENDAR
  ========================================================= */

  if (
    screen === "calendar" &&
    selectedTheme
  ) {
    return (
      <>
        <Calendar
          theme={selectedTheme}
          memories={memories}

          onBack={() => {
            setSelectedCalendarMemory(null);
            setScreen("diary");
          }}

          onOpenMemory={(memory) => {
            setSelectedCalendarMemory(memory);
          }}
        />

        {selectedCalendarMemory && (
          <MemoryModal
            memory={selectedCalendarMemory}

            onClose={() => {
              setSelectedCalendarMemory(null);
            }}

            onDelete={() => {
              setShowCalendarDeleteDialog(true);
            }}

            onEdit={(memory) => {
              setEditingMemory(memory);
              setSelectedCalendarMemory(null);
              setScreen("editor");
            }}
          />
        )}
        {showCalendarDeleteDialog && (
          <ConfirmDialog
            title="Delete this memory?"
            message="This memory will be permanently removed from your world."
            confirmText="Delete memory"
            cancelText="Keep memory"
            onCancel={() => setShowCalendarDeleteDialog(false)}
            onConfirm={async () => {
  if (!selectedCalendarMemory) return;

  const memoryToDelete = memories.find(
    (memory) => memory.id === selectedCalendarMemory.id
  );

  if (
    memoryToDelete?.music?.source === "upload" &&
    memoryToDelete?.music?.audioPath
  ) {
    const { error: audioError } =
      await deleteMemoryAudio(
        memoryToDelete.music.audioPath
      );

    if (audioError) {
      console.error(
        "Could not delete memory audio:",
        audioError
      );

    setToast({
        message:
          "The audio could not be deleted. The memory was not removed.",
        type: "error",
      });

      return;
    }
  }

  if (memoryToDelete?.photo?.path) {
    const { error: photoError } =
      await deleteMemoryPhoto(
        memoryToDelete.photo.path
      );

    if (photoError) {
      console.error(
        "Could not delete memory photo:",
        photoError
      );

     setToast({
        message:
          "The photo could not be deleted. The memory was not removed.",
        type: "error",
      });

      return;
    }
  }

  const { error } = await deleteMemory(
    user.id,
    selectedCalendarMemory.id
  );

  if (error) {
    console.error(
      "Could not delete memory:",
      error
    );

   setToast({
      message:
        "Your memory could not be deleted. Please try again.",
      type: "error",
    });

    return;
  }

  setMemories((currentMemories) =>
    currentMemories.filter(
      (memory) =>
        memory.id !== selectedCalendarMemory.id
    )
  );

  setSelectedCalendarMemory(null);
  setShowCalendarDeleteDialog(false);
}}
          />
        )}
      </>
    );
  }
if (screen === "auth") {
  return (
    <Auth
      onAuthenticated={(authenticatedUser) => {
        setUser(authenticatedUser);

        const savedAutoLock =
          localStorage.getItem(
            `myworld-autolock-${authenticatedUser.id}`
          ) || "never";

        setAutoLockMinutes(savedAutoLock);

        const savedThemeId =
          localStorage.getItem("myworld-theme");

        if (savedThemeId) {
          setScreen("diary");
        } else {
          setScreen("onboarding");
        }
      }}
    />
  );
}
  /* =========================================================
     LANDING PAGE
  ========================================================= */

  return (
    <>
      {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
      <SmoothScroll />

      <main className="app">

        {/* Ambient background */}

        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />

        {/* Floating particles */}

        <div className="particles">
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="particle"

              style={{
                left: particle.left,
                top: particle.top,
              }}

              animate={{
                y: [-10, 10, -10],
                opacity: [
                  0.15,
                  0.7,
                  0.15,
                ],
                scale: [
                  0.8,
                  1.2,
                  0.8,
                ],
              }}

              transition={{
                duration:
                  particle.duration,

                delay:
                  particle.delay,

                repeat: Infinity,

                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Navbar */}

        <nav className="navbar">
          <div className="brand">
            <span className="brand-icon">
              <Sparkles size={15} />
            </span>

            <span>MYWORLD</span>
          </div>

          <div className="nav-pill">
            <span className="status-dot" />
            Your private space
          </div>
        </nav>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hero">

          <motion.div
            className="hero-content"

            initial={{
              opacity: 0,
              y: 35,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          >

            <motion.div
              className="eyebrow"

              initial={{
                opacity: 0,
                y: 15,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                delay: 0.2,
                duration: 0.6,
              }}
            >
              <Sparkles size={14} />
              A place for your thoughts
            </motion.div>

            <h1>
              Your story.
              <br />
              <span>Your world.</span>
            </h1>

            <p className="hero-description">
              A beautiful digital diary for the
              moments you want to remember, the
              thoughts you want to keep, and the
              person you're becoming.
            </p>

            <motion.button
              className="primary-button"

              onClick={() =>
                setScreen("auth")
              }
              whileHover={{
                scale: 1.03,
                y: -2,
              }}

              whileTap={{
                scale: 0.97,
              }}
            >
              <span>
                Begin your story
              </span>

              <span className="button-icon">
                <ArrowRight size={18} />
              </span>
            </motion.button>

            <div className="privacy-note">
              <span>✦</span>
              Your memories. Your space.
              Your rules.
            </div>

          </motion.div>

          {/* Diary preview */}

          <motion.div
            className="floating-diary"

            initial={{
              opacity: 0,
              scale: 0.85,
              rotate: 4,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              rotate: 2,
              y: [0, -10, 0],
            }}

            transition={{
              opacity: {
                duration: 1,
              },

              scale: {
                duration: 1,
              },

              rotate: {
                duration: 1,
              },

              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >

            <div className="diary-glow" />

            <div className="diary-card">

              <div className="diary-top">
                <span>
                  SEPTEMBER
                </span>

                <span>
                  15
                </span>
              </div>

              <div className="diary-line" />

              <div className="diary-mood">
                😊
              </div>

              <h3>
                Today felt...
              </h3>

              <p>
                "Sometimes the smallest
                moments end up being the ones
                we remember."
              </p>

              <div className="diary-footer">
                <span>
                  Tuesday
                </span>

                <span>
                  9:34 PM
                </span>
              </div>

            </div>

            <motion.div
              className="floating-orb orb-one"

              animate={{
                y: [-8, 8, -8],
                rotate: [0, 8, 0],
              }}

              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.div>

            <motion.div
              className="floating-orb orb-two"

              animate={{
                y: [8, -8, 8],
              }}

              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ·
            </motion.div>

          </motion.div>

          {/* =================================================
              REAL SCROLL INDICATOR
          ================================================= */}

          <button
            className="scroll-indicator"

            onClick={() => {
              document
                .getElementById("explore")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            <span>
              SCROLL TO EXPLORE
            </span>

            <motion.div
              className="scroll-line"

              animate={{
                scaleY: [
                  0.3,
                  1,
                  0.3,
                ],
              }}

              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </button>

        </section>

        {/* ===================================================
            EXPLORE SECTION
        =================================================== */}

        <section
          id="explore"
          className="explore-section"
        >

          <motion.div
            className="explore-content"

            initial={{
              opacity: 0,
              y: 40,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
              amount: 0.3,
            }}

            transition={{
              duration: 0.8,
            }}
          >

            <span className="explore-eyebrow">
              ✦ MORE THAN A DIARY
            </span>

            <h2>
              Every day has
              <br />
              <span>a story.</span>
            </h2>

            <p>
              Write the messy days. Save the
              beautiful ones. Keep the little
              moments that would otherwise
              disappear.
            </p>

            <div className="memory-experience">

              {/* MAIN MEMORY */}

              <motion.div
                className="memory-card"
                key={activeMemory}

                initial={{
                  opacity: 0,
                  y: 20,
                  rotate: -2,
                }}

                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: -2,
                }}

                viewport={{
                  once: true,
                }}

                animate={{
                  rotate: -2,
                }}

                transition={{
                  duration: 0.5,
                }}
              >

                <div className="memory-tape" />

                <div className="memory-header">
                  <span>
                    {
                      landingMemories[activeMemory].date
                    }
                  </span>

                  <span>
                    {
                    landingMemories[activeMemory].day
                    }
                  </span>
                </div>

                <div className="memory-divider" />

                <div className="memory-mood">
                  {
                    landingMemories[activeMemory].mood
                  }
                </div>

                <h3>
                  {
                    landingMemories[activeMemory].title
                  }
                </h3>

                <p>
                  "
                  {
                    landingMemories[activeMemory].text
                  }
                  "
                </p>

                <div className="memory-footer">

                  <span>
                    {
                      landingMemories[activeMemory].tag
                    }
                  </span>

                  <span>
                    {
                     landingMemories[activeMemory].time
                    }
                  </span>

                </div>

              </motion.div>

              {/* MEMORY SELECTOR */}

              <div className="memory-selector">

                <span className="selector-label">
                  ✦ little moments
                </span>

                {landingMemories.map(
                  (memory, index) => (
                    <motion.button
                      key={memory.date}

                      className={`memory-option ${
                        activeMemory ===
                        index
                          ? "memory-option-active"
                          : ""
                      }`}

                      onClick={() =>
                        setActiveMemory(
                          index
                        )
                      }

                      whileHover={{
                        x: 6,
                      }}

                      whileTap={{
                        scale: 0.97,
                      }}
                    >

                      <span className="memory-option-icon">
                        {
                          memory.mood
                        }
                      </span>

                      <span className="memory-option-info">

                        <strong>
                          {
                            memory.tag
                          }
                        </strong>

                        <small>
                          {
                            memory.date
                          }
                        </small>

                      </span>

                      <span className="memory-option-arrow">
                        →
                      </span>

                    </motion.button>
                  )
                )}

              </div>

            </div>

          </motion.div>

        </section>

      </main>
    </>
  );
}

export default App;