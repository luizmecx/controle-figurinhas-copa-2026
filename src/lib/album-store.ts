import { useEffect, useState, useCallback, useSyncExternalStore } from "react";

const KEY = "fifa26-album-v1";

// 0 = faltante, 1 = tenho, 2+ = repetidas (count of duplicates)
export type AlbumState = Record<string, number>;

let state: AlbumState = {};
const listeners = new Set<() => void>();

function load(): AlbumState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function emit() {
  listeners.forEach((l) => l());
}

export function initAlbum() {
  state = load();
  emit();
}

export function cycleSticker(code: string) {
  const cur = state[code] ?? 0;
  // 0 -> 1 -> 2 -> 0
  const next = cur >= 2 ? 0 : cur + 1;
  state = { ...state, [code]: next };
  persist();
  emit();
}

export function incrementDuplicate(code: string) {
  const cur = state[code] ?? 0;
  state = { ...state, [code]: Math.max(2, cur + 1) };
  persist();
  emit();
}

export function resetAlbum() {
  state = {};
  persist();
  emit();
}

export function getStateSnapshot(): AlbumState {
  return state;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAlbum(): AlbumState {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    initAlbum();
    setHydrated(true);
  }, []);
  const snap = useSyncExternalStore(
    subscribe,
    getStateSnapshot,
    () => ({}),
  );
  return hydrated ? snap : {};
}

export function getStatus(album: AlbumState, code: string): 0 | 1 | 2 {
  const v = album[code] ?? 0;
  if (v === 0) return 0;
  if (v === 1) return 1;
  return 2;
}

export function getDuplicates(album: AlbumState, code: string): number {
  const v = album[code] ?? 0;
  return v >= 2 ? v - 1 : 0;
}
