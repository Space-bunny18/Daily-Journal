export function getAchievementsStatus(memories = [], streak = 0) {
  const totalMemories = memories.length;

 const hasPhoto = memories.some(
    (memory) =>
      memory?.photo?.path ||
      memory?.photo?.url
  );

  const hasMusic = memories.some(
    (memory) => memory?.music
  );

  const hasLocation = memories.some(
    (memory) => memory?.location
  );

  return {
    "first-step": totalMemories >= 1,

    "getting-into-it": totalMemories >= 5,

    "story-keeper": totalMemories >= 10,

    "picture-this": hasPhoto,

    "soundtrack-of-me": hasMusic,

    "been-there": hasLocation,

    "three-day-rhythm": streak >= 3,

    "week-of-me": streak >= 7,

    "century-of-moments": totalMemories >= 100,
  };
}