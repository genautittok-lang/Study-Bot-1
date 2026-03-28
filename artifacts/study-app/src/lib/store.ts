import { useState, useCallback, useEffect } from "react";
import type { UserData } from "./api";
import { authUser } from "./api";
import { getTelegramUser, initTelegramApp } from "./telegram";
import { initLanguage, detectLanguageByIP, subscribeLang } from "./i18n";

export interface RecentItem {
  reportType: string;
  subject: string;
  subjectName: string;
  typeName: string;
  typeIcon: string;
  ts: number;
}

const RECENT_KEY = "studypro_recent";
const MAX_RECENT = 4;

export function getRecentItems(): RecentItem[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addRecentItem(item: Omit<RecentItem, "ts">) {
  const items = getRecentItems().filter(
    i => !(i.reportType === item.reportType && i.subject === item.subject)
  );
  items.unshift({ ...item, ts: Date.now() });
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT))); } catch {}
}

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
  if (!globalUser) return;
  try {
    const { authUser } = await import("./api");
    const fresh = await authUser({
      telegramId: globalUser.telegramId,
      username: globalUser.username,
      firstName: globalUser.firstName,
      lastName: globalUser.lastName,
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

      let userData;
      try {
        userData = await authUser({
          telegramId,
          username,
          firstName,
          lastName,
        });
      } catch {
        userData = {
          telegramId,
          username: username || "demo_user",
          firstName: firstName || "Student",
          lastName: lastName || "",
          balance: 3,
          totalReports: 7,
          freeReportsUsed: true,
          referralCode: "DEMO2026",
          referralCount: 2,
        };
      }

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
