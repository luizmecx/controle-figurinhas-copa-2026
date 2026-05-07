import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "fifa26-auth-v1";
export const PASSWORD = "hexa2026";

let signedIn = false;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}
function emit() { listeners.forEach((l) => l()); }

export function signIn(pwd: string): boolean {
  if (pwd !== PASSWORD) return false;
  signedIn = true;
  localStorage.setItem(KEY, "1");
  emit();
  return true;
}

export function signOut() {
  signedIn = false;
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  emit();
}

export function useAuth() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    signedIn = load();
    setHydrated(true);
    emit();
  }, []);
  const v = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => signedIn,
    () => false,
  );
  return { signedIn: hydrated ? v : false, hydrated };
}
