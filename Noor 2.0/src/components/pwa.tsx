import { useEffect, useState } from "react";
import { applyUpdate, useNetStatus, usePwa, useSwUpdate } from "../lib/pwa";
import { Btn, Flower, Icon, Pill, Star8, toast } from "./ui";

/* ---------------- iOS share-sheet instructions ---------------- */

export function IosSteps({ compact = false }: { compact?: boolean }) {
  const steps: [string, React.ReactNode][] = [
    [
      "Tap the Share button",
      <span key="s" className="inline-flex items-center gap-1.5 align-middle border-2 border-ink bg-paper rounded-lg px-2 py-0.5 text-xs font-bold">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v13m0-13-4.5 4.5M12 3l4.5 4.5M5 11v8.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V11" />
        </svg>
        Share
      </span>,
    ],
    ["Choose “Add to Home Screen”", null],
    ["Tap “Add” — Noor opens like a native app", null],
  ];
  return (
    <ol className={`${compact ? "space-y-2" : "space-y-3"}`}>
      {steps.map(([label, extra], i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-7 h-7 shrink-0 rounded-full bg-ink text-cream grid place-items-center font-display text-sm mt-0.5">{i + 1}</span>
          <span className={`${compact ? "text-sm" : "text-base"} font-semibold leading-relaxed`}>
            {label}
            {extra && <span className="ml-2">{extra}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- install button ---------------- */

export function InstallButton({ variant = "ink", size = "" }: { variant?: "ink" | "cream" | "sun"; size?: string }) {
  const pwa = usePwa();
  const [iosOpen, setIosOpen] = useState(false);
  if (!pwa.relevant) return null;

  const handle = async () => {
    if (pwa.isIOS) {
      setIosOpen((v) => !v);
      return;
    }
    const res = await pwa.promptInstall();
    if (res === "accepted") toast("✓ Noor has been added to your home screen.");
    if (res === "dismissed") toast("You can install any time from Settings.");
  };

  return (
    <span className="inline-block relative">
      <Btn variant={variant} onClick={handle} className={size}>
        <Icon name="monitor" className="w-4 h-4" /> {pwa.isIOS ? "Add to Home Screen" : "Install Noor"}
      </Btn>
      {iosOpen && (
        <span className="absolute left-0 top-full mt-3 z-50 block w-72 bg-paper border-2 border-ink shadow-hard rounded-2xl p-5 text-ink text-left">
          <span className="font-display text-lg uppercase block mb-3">On iPhone / iPad</span>
          <IosSteps compact />
        </span>
      )}
    </span>
  );
}

/* ---------------- install card (landing + dashboard) ---------------- */

export function InstallCard({ compact = false }: { compact?: boolean }) {
  const pwa = usePwa();
  if (!pwa.relevant) return null;

  return (
    <div className={`relative bg-paper border-2 border-ink shadow-hard ${compact ? "rounded-3xl p-6" : "rounded-[2rem] p-8 sm:p-10"} overflow-hidden`}>
      <span className="absolute -top-6 -right-6 opacity-90 pointer-events-none">
        <Flower className={compact ? "w-20 h-20" : "w-28 h-28"} />
      </span>
      <span className="absolute -bottom-5 -left-5 pointer-events-none">
        <Star8 className={compact ? "w-16 h-16" : "w-24 h-24"} color="var(--color-lav)" />
      </span>
      <div className="relative">
        <Pill className="bg-sun">
          <Icon name="monitor" className="w-3.5 h-3.5" /> Install the app
        </Pill>
        <h3 className={`font-display uppercase leading-[0.95] mt-4 ${compact ? "text-3xl" : "text-4xl sm:text-5xl"}`}>
          Take Noor
          <br />
          <span className="text-burg">with you.</span>
        </h3>
        <p className={`text-ink/70 mt-3 leading-relaxed ${compact ? "text-sm" : ""} max-w-sm`}>
          Install it on your home screen and keep your learning journey one tap away — offline-ready, opens full-screen like a native app.
        </p>
        <div className="mt-6">
          {pwa.isIOS ? (
            <div className="bg-cream border-2 border-ink rounded-2xl p-5">
              <p className="font-bold uppercase tracking-widest text-xs text-ink/55 mb-3">On iPhone / iPad</p>
              <IosSteps compact />
            </div>
          ) : (
            <InstallButton variant="ink" />
          )}
        </div>
        {pwa.installed || !pwa.relevant ? null : (
          <p className="text-xs text-ink/50 mt-4 flex items-center gap-2">
            <Icon name="shield" className="w-3.5 h-3.5" /> No app store needed — installs straight from your browser.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- update banner ---------------- */

export function UpdateBanner() {
  const { updateReady } = useSwUpdate();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (updateReady) setVisible(true);
  }, [updateReady]);
  if (!updateReady || !visible) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[95] px-4 w-full max-w-md">
      <div className="bg-ink text-cream border-2 border-cream/25 shadow-hard rounded-2xl px-5 py-4 flex items-center gap-4">
        <span className="w-9 h-9 shrink-0 rounded-xl bg-sun border-2 border-cream/30 grid place-items-center">
          <Icon name="refresh" className="w-4.5 h-4.5 text-ink" />
        </span>
        <div className="flex-1">
          <p className="font-bold text-sm">A new version of Noor is ready.</p>
          <p className="text-xs text-cream/60">Your recitation won't be interrupted until you choose.</p>
        </div>
        <button
          onClick={() => applyUpdate()}
          className="shrink-0 bg-sun text-ink border-2 border-cream/40 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-blush transition-colors cursor-pointer"
        >
          Update
        </button>
        <button onClick={() => setVisible(false)} className="shrink-0 text-cream/60 hover:text-cream cursor-pointer" aria-label="Dismiss update">
          <Icon name="x" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- launch splash (standalone only) ---------------- */

export function SplashOverlay() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    // one short branded moment per app launch, never on in-app navigation
    const shown = sessionStorage.getItem("noor_splash");
    return standalone && !shown;
  });
  const [fading, setFading] = useState(false);
  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("noor_splash", "1");
    const t1 = setTimeout(() => setFading(true), 750);
    const t2 = setTimeout(() => setShow(false), 1150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [show]);
  if (!show) return null;
  return (
    <div
      className={`fixed inset-0 z-[120] bg-forest grain grid place-items-center transition-opacity duration-400 ${fading ? "opacity-0" : "opacity-100"}`}
      aria-hidden="true"
    >
      <div className="text-center">
        <span className="inline-grid place-items-center w-20 h-20 rounded-[1.4rem] bg-sun border-2 border-ink shadow-hard animate-[none]">
          <Icon name="moon" className="w-10 h-10 text-ink" />
        </span>
        <p className="font-display text-3xl text-cream tracking-wide mt-5">NOOR</p>
        <p className="text-cream/60 text-xs font-bold uppercase tracking-[0.3em] mt-2">Qur'an learning</p>
      </div>
    </div>
  );
}

/* ---------------- online / offline pill ---------------- */

export function NetPill({ className = "" }: { className?: string }) {
  const online = useNetStatus();
  return (
    <span
      className={`inline-flex items-center gap-1.5 border-2 border-ink rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
        online ? "bg-paper text-ink/70" : "bg-blush text-ink"
      } ${className}`}
      role="status"
    >
      <span className={`w-2 h-2 rounded-full ${online ? "bg-forest-soft" : "bg-burg animate-pulse"}`} />
      {online ? "Online" : "Offline — progress saves locally"}
    </span>
  );
}
