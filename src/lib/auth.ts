import { useEffect, useState, useSyncExternalStore } from "react";

const USERS_KEY = "fifa26-users";
const SESSION_KEY = "fifa26-session";

let currentUser: string | null = null;
const listeners = new Set<() => void>();

function loadUsers(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadSession() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY) || null;
}

function emit() { listeners.forEach((l) => l()); }

export function getCurrentUser() {
  return currentUser;
}

export function signUp(user: string, pwd: string): { success: boolean; error?: string } {
  const users = loadUsers();
  const lowerUser = user.trim().toLowerCase();
  
  if (!lowerUser) return { success: false, error: "Nome de usuário vazio" };
  if (users[lowerUser]) return { success: false, error: "Este usuário já existe. Tente outro!" };

  users[lowerUser] = pwd;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return { success: true };
}

export function signIn(user: string, pwd: string): { success: boolean; error?: string } {
  const users = loadUsers();
  const lowerUser = user.trim().toLowerCase();

  if (!users[lowerUser]) return { success: false, error: "Usuário não encontrado" };
  if (users[lowerUser] !== pwd) return { success: false, error: "Senha incorreta" };

  currentUser = lowerUser;
  localStorage.setItem(SESSION_KEY, lowerUser);
  emit();
  return { success: true };
}

export function signOut() {
  currentUser = null;
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
  emit();
}

export function useAuth() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    currentUser = loadSession();
    setHydrated(true);
    emit();
  }, []);
  const user = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => currentUser,
    () => null,
  );
  return { signedIn: !!user, user: hydrated ? user : null, hydrated };
}
