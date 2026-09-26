import { useEffect, useState } from "react";

/* ============================================================
   PWA engine — install lifecycle, SW registration, sync status.
   UI-independent: components subscribe to module-level state.
   ============================================================ */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface PwaInfo {
  canPrompt: boolean;
  installed: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  iosChrome: boolean;
}

let deferred: BeforeInstallPromptEvent | null = null;
const info: PwaInfo = { canPrompt: false, installed: false, isIOS: false, isStandalone: false, iosChrome: false };
const pwaListeners = new Set<() => void>();
const emit = () => pwaListeners.forEach((l) => l());

const readFlag = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const writeFlag = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private mode */
  }
};

if (typeof window !== "undefined") {
  const ua = navigator.userAgent;
  info.isStandalone =
    window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
  const iosDevice = /iphone|ipad|ipod/i.test(ua);
  info.iosChrome = iosDevice && /crios/i.test(ua);
  info.isIOS = iosDevice;
  if (info.isStandalone || readFlag("noor_installed") === "1") info.installed = true;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // we decide when to surface the prompt
    deferred = e as BeforeInstallPromptEvent;
    info.canPrompt = true;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    info.canPrompt = false;
    info.installed = true;
    writeFlag("noor_installed", "1");
    emit();
  });
}

export function getPwaInfo(): PwaInfo {
  return { ...info };
}

export function usePwa(): PwaInfo & {
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
  /** Should any install UI be shown at all? */
  relevant: boolean;
} {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((x) => x + 1);
    pwaListeners.add(l);
    return () => {
      pwaListeners.delete(l);
    };
  }, []);

  const promptInstall = async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!deferred) return "unavailable";
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      deferred = null;
      info.canPrompt = false;
      if (choice.outcome === "accepted") {
        info.installed = true;
        writeFlag("noor_installed", "1");
        emit();
        return "accepted";
      }
      emit();
      return "dismissed";
    } catch {
      return "unavailable";
    }
  };

  return { ...info, promptInstall, relevant: !info.installed && (info.canPrompt || info.isIOS) };
}

/* ---------------- service worker + updates ---------------- */

let waitingWorker: ServiceWorker | null = null;
let updateReady = false;
const swListeners = new Set<() => void>();

export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return; // dev server handles its own assets

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener("statechange", () => {
            // A fresh worker is ready while one still controls the page
            if (next.state === "installed" && navigator.serviceWorker.controller) {
              waitingWorker = next;
              updateReady = true;
              swListeners.forEach((l) => l());
            }
          });
        });
      })
      .catch(() => {
        /* SW is progressive enhancement — never block the app */
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // only fires after the learner chose "Update"
      window.location.reload();
    });
  });
}

export function applyUpdate(): void {
  waitingWorker?.postMessage("SKIP_WAITING");
  // if for some reason no controller swap happens, reload shortly
  setTimeout(() => window.location.reload(), 4000);
}

export function useSwUpdate(): { updateReady: boolean; applyUpdate: () => void } {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((x) => x + 1);
    swListeners.add(l);
    return () => {
      swListeners.delete(l);
    };
  }, []);
  return { updateReady, applyUpdate };
}

/* ---------------- network + sync ---------------- */

const netListeners = new Set<() => void>();
let online = typeof navigator !== "undefined" ? navigator.onLine : true;

if (typeof window !== "undefined") {
  const setOn = () => {
    online = true;
    markSynced();
    netListeners.forEach((l) => l());
  };
  const setOff = () => {
    online = false;
    netListeners.forEach((l) => l());
  };
  window.addEventListener("online", setOn);
  window.addEventListener("offline", setOff);
}

/** Called whenever learner data mutates while online — nothing to push
    (the account store is device-local), but the timestamp powers the
    "synced" indicator and future cloud sync. */
export function markSynced(): void {
  if (!online) return;
  writeFlag("noor_last_sync", String(Date.now()));
}

export function lastSyncAt(): number | null {
  const v = readFlag("noor_last_sync");
  return v ? Number(v) : null;
}

export function useNetStatus(): boolean {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((x) => x + 1);
    netListeners.add(l);
    return () => {
      netListeners.delete(l);
    };
  }, []);
  return online;
}
