import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "fifa26-auth-v1";
export const PASSWORD = "hexa2026";

let authed = false;
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

export function initAuth() {
  if (typeof window === "undefined") return;
  authed = localStorage.getItem(KEY) === "1";
  emit();
}

export function login(pw: string): boolean {
  if (pw !== PASSWORD) return false;
  authed = true;
  localStorage.setItem(KEY, "1");
  emit();
  return true;
}

export function logout() {
  authed = false;
  localStorage.removeItem(KEY);
  emit();
}

function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); }
function snap() { return authed; }

export function useAuth(): { ready: boolean; authed: boolean } {
  const [ready, setReady] = useState(false);
  useEffect(() => { initAuth(); setReady(true); }, []);
  const a = useSyncExternalStore(subscribe, snap, () => false);
  return { ready, authed: a };
}
