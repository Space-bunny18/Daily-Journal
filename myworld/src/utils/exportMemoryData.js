export function exportMemoryData(memories) {
  if (!Array.isArray(memories) || memories.length === 0) {
    return false;
  }

  const exportData = {
    app: "MyWorld",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    memories,
  };

  const json = JSON.stringify(exportData, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const date = new Date()
    .toISOString()
    .slice(0, 10);

  link.download = `myworld-backup-${date}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  return true;
}