declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          isVisible: boolean;
          isActive: boolean;
          setParams: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          isVisible: boolean;
        };
        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        colorScheme: "light" | "dark";
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        platform: string;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        openTelegramLink: (url: string) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        version: string;
      };
    };
  }
}

export function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

export function getTelegramUser() {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user ?? null;
}

export function getTelegramVersion(): string {
  return getTelegramWebApp()?.version || "6.0";
}

export function initTelegramApp() {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
  }
}

export function hapticFeedback(type: "light" | "medium" | "heavy" = "light") {
  try {
    getTelegramWebApp()?.HapticFeedback?.impactOccurred(type);
  } catch {}
}

export function hapticSuccess() {
  try {
    getTelegramWebApp()?.HapticFeedback?.notificationOccurred("success");
  } catch {}
}

export function hapticError() {
  try {
    getTelegramWebApp()?.HapticFeedback?.notificationOccurred("error");
  } catch {}
}

export function hapticWarning() {
  try {
    getTelegramWebApp()?.HapticFeedback?.notificationOccurred("warning");
  } catch {}
}

export function hapticSelection() {
  try {
    getTelegramWebApp()?.HapticFeedback?.selectionChanged();
  } catch {}
}

export function showBackButton(cb: () => void) {
  try {
    const tg = getTelegramWebApp();
    if (tg?.BackButton) {
      tg.BackButton.onClick(cb);
      tg.BackButton.show();
    }
  } catch {}
}

export function hideBackButton(cb: () => void) {
  try {
    const tg = getTelegramWebApp();
    if (tg?.BackButton) {
      tg.BackButton.offClick(cb);
      tg.BackButton.hide();
    }
  } catch {}
}

export function openTelegramLink(url: string) {
  const tg = getTelegramWebApp();
  if (tg && typeof tg.openTelegramLink === "function") {
    tg.openTelegramLink(url);
  } else {
    window.open(url, "_blank");
  }
}

export function shareViaTelegram(text: string) {
  const encoded = encodeURIComponent(text);
  const url = `https://t.me/share/url?url=${encodeURIComponent("https://t.me/studyflush_bot")}&text=${encoded}`;
  openTelegramLink(url);
}

export function openExternalLink(url: string) {
  const tg = getTelegramWebApp();
  if (tg && typeof tg.openLink === "function") {
    tg.openLink(url);
  } else {
    window.open(url, "_blank");
  }
}
