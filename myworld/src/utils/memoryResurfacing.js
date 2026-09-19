export function getResurfacedMemory(memories) {
  if (!Array.isArray(memories) || memories.length === 0) {
    return null;
  }

  const now = Date.now();

  const eligibleMemories = memories.filter((memory) => {
    if (!memory?.date) return false;

    const memoryTime = new Date(memory.date).getTime();

    if (Number.isNaN(memoryTime)) return false;

    // Only resurface memories that are at least 7 days old
    const ageInDays =
      (now - memoryTime) / (1000 * 60 * 60 * 24);

    return ageInDays >= 7;
  });

  if (eligibleMemories.length === 0) {
    return null;
  }

  // Prefer older memories
  const sortedMemories = [...eligibleMemories].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );

  return sortedMemories[0];
}