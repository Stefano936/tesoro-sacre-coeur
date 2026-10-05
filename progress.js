export const STORAGE_KEY = 'sacre-coeur-v1';
export function loadProgress(storage, ids) {
  try {
    const data = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
    return { found: new Set(Array.isArray(data) ? data.filter(id => ids.includes(id)) : []), persistent: true };
  } catch { return { found: new Set(), persistent: false }; }
}
export function discover(found, id, ids) {
  if (!ids.includes(id) || found.has(id)) return false;
  found.add(id); return true;
}
export function saveProgress(storage, found) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify([...found])); return true; } catch { return false; }
}
export function clearProgress(storage) {
  try { storage.removeItem(STORAGE_KEY); return true; } catch { return false; }
}
export const canWin = (found, ids, current) => current === 'tesoro' && ids.every(id => found.has(id));
