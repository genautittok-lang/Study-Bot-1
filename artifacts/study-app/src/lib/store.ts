import { useState, useCallback, useEffect } from "react";
import type { UserData } from "./api";
import { authUser } from "./api";
import { getTelegramUser, initTelegramApp } from "./telegram";
import { initLanguage, detectLanguageByIP, subscribeLang } from "./i18n";

let globalUser: UserData | null = null;
let globalPhotoUrl: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function setUser(u: UserData) {
  globalUser = u;
  notify();
}

export async function refreshUser() {
  const current = userSignal.value;
  if (!current) return;
  try {
    const { authUser } = await import("./api");
    const fresh = await authUser({
      telegramId: current.telegramId,
      username: current.username,
      firstName: current.firstName,
      lastName: current.lastName,
    });
    setUser(fresh);
  } catch {}
}

export function updateBalance(balance: number) {
  if (globalUser) {
    globalUser = { ...globalUser, balance };
    notify();
  }
}

export function useUser() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return globalUser;
}

export function usePhotoUrl() {
  return globalPhotoUrl;
}

export function useLang() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribeLang(() => setTick((t) => t + 1));
  }, []);
}

export function useInitApp() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const init = useCallback(async () => {
    try {
      initTelegramApp();
      initLanguage();
      detectLanguageByIP();

      const tgUser = getTelegramUser();

      let telegramId = tgUser?.id ?? 0;
      let firstName = tgUser?.first_name;
      let username = tgUser?.username;
      let lastName = tgUser?.last_name;

      if (telegramId === 0) {
        telegramId = 999999999;
        firstName = "Student";
        username = "demo_user";
      }

      globalPhotoUrl = tgUser?.photo_url || null;

      const userData = await authUser({
        telegramId,
        username,
        firstName,
        lastName,
      });

      setUser(userData);
      setLoading(false);
    } catch (err) {
      console.error("Init error:", err);
      setError("Failed to load. Try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return { loading, error, retry: init };
}
