import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "fifa26-album-v2";

export type StickerEntry = { isCollected: boolean; duplicates: number };
export type AlbumState = Record<string, StickerEntry>;

let state: AlbumState = {};
const listeners = new Set<() => void>();

function load(): AlbumState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    // migrate from v1
    const old = localStorage.getItem("fifa26-album-v1");
    if (old) {
      const parsed: Record<string, number> = JSON.parse(old);
      const migrated: AlbumState = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (v === 0) continue;
        migrated[k] = { isCollected: true, duplicates: v >= 2 ? v - 1 : 0 };
      }
      return migrated;
    }
    return {};
  } catch {
    return {};
  }
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function emit() { listeners.forEach((l) => l()); }

export function initAlbum() {
  state = load();
  emit();
}

function update(code: string, patch: Partial<StickerEntry>) {
  const cur = state[code] ?? { isCollected: false, duplicates: 0 };
  const next: StickerEntry = { ...cur, ...patch };
  if (!next.isCollected) next.duplicates = 0;
  state = { ...state, [code]: next };
  persist();
  emit();
}

export function toggleCollected(code: string) {
  const cur = state[code] ?? { isCollected: false, duplicates: 0 };
  update(code, { isCollected: !cur.isCollected });
}

export function incDuplicate(code: string) {
  const cur = state[code] ?? { isCollected: false, duplicates: 0 };
  if (!cur.isCollected) return;
  update(code, { duplicates: cur.duplicates + 1 });
}

export function decDuplicate(code: string) {
  const cur = state[code] ?? { isCollected: false, duplicates: 0 };
  if (!cur.isCollected) return;
  update(code, { duplicates: Math.max(0, cur.duplicates - 1) });
}

export function resetAlbum() {
  state = {};
  persist();
  emit();
}

export function getEntry(album: AlbumState, code: string): StickerEntry {
  return album[code] ?? { isCollected: false, duplicates: 0 };
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getStateSnapshot() { return state; }

export function useAlbum(): AlbumState {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { initAlbum(); setHydrated(true); }, []);
  const snap = useSyncExternalStore(subscribe, getStateSnapshot, () => ({}));
  return hydrated ? snap : {};
}
