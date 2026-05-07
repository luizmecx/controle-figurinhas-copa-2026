import { useEffect, useState, useSyncExternalStore } from "react";
import { getCurrentUser } from "./auth";

export type StickerEntry = { isCollected: boolean; duplicates: number };
export type AlbumState = Record<string, StickerEntry>;

let state: AlbumState = {};
const listeners = new Set<() => void>();

function getKey() {
  const user = getCurrentUser();
  return user ? `fifa26-album-v2-${user}` : "fifa26-album-v2";
}

function load(): AlbumState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(getKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // tolerate legacy v1 (number)
    const out: AlbumState = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number") {
        out[k] = { isCollected: v >= 1, duplicates: v >= 2 ? v - 1 : 0 };
      } else if (v && typeof v === "object") {
        out[k] = v as StickerEntry;
      }
    }
    return out;
  } catch {
    return {};
  }
}

import { syncWithServer } from "./api";

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(getKey(), JSON.stringify(state));
  syncWithServer();
}
function emit() { listeners.forEach((l) => l()); }

export function initAlbum() {
  state = load();
  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("database-synced", () => {
    state = load();
    emit();
  });
}

function get(code: string): StickerEntry {
  return state[code] ?? { isCollected: false, duplicates: 0 };
}

export function toggleCollected(code: string) {
  const cur = get(code);
  const next: StickerEntry = cur.isCollected
    ? { isCollected: false, duplicates: 0 }
    : { isCollected: true, duplicates: cur.duplicates };
  state = { ...state, [code]: next };
  persist(); emit();
}

export function setDuplicates(code: string, n: number) {
  const cur = get(code);
  if (!cur.isCollected) return;
  const v = Math.max(0, Math.min(99, n));
  state = { ...state, [code]: { ...cur, duplicates: v } };
  persist(); emit();
}

export function incDuplicate(code: string) {
  const cur = get(code);
  if (!cur.isCollected) return;
  setDuplicates(code, cur.duplicates + 1);
}

export function decDuplicate(code: string) {
  const cur = get(code);
  if (!cur.isCollected) return;
  setDuplicates(code, cur.duplicates - 1);
}

export function resetAlbum() {
  state = {};
  persist(); emit();
}

export function getEntry(album: AlbumState, code: string): StickerEntry {
  return album[code] ?? { isCollected: false, duplicates: 0 };
}

// Legacy compat helpers used elsewhere
export function getStatus(album: AlbumState, code: string): 0 | 1 | 2 {
  const e = getEntry(album, code);
  if (!e.isCollected) return 0;
  return e.duplicates > 0 ? 2 : 1;
}
export function getDuplicates(album: AlbumState, code: string): number {
  return getEntry(album, code).duplicates;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAlbum(): AlbumState {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { initAlbum(); setHydrated(true); }, []);
  const snap = useSyncExternalStore(subscribe, () => state, () => ({}));
  return hydrated ? snap : {};
}
