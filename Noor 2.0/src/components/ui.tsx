import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------------- custom icon set (hand-drawn strokes) ---------------- */

const PATHS: Record<string, ReactNode> = {
  play: <path d="M8.5 5.8v12.4c0 .9 1 1.5 1.8 1L19 13a1.2 1.2 0 0 0 0-2l-8.7-6.2c-.8-.5-1.8.1-1.8 1Z" fill="currentColor" stroke="none" />,
  pause: <path d="M8 5.5h2.8v13H8zM13.2 5.5H16v13h-2.8z" fill="currentColor" stroke="none" />,
  next: <path d="M6 6l8 6-8 6V6zm10 0h2.5v12H16z" fill="currentColor" stroke="none" />,
  prev: <path d="M18 6l-8 6 8 6V6zM5.5 6H8v12H5.5z" fill="currentColor" stroke="none" />,
  repeat: <path d="M4 12a8 8 0 0 1 13.6-5.7M20 12a8 8 0 0 1-13.6 5.7M17 3.5 18 6.5l-3 .8M7 20.5 6 17.5l3-.8" />,
  mic: <path d="M12 3.5a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3Zm-6.5 8a6.5 6.5 0 0 0 13 0M12 18v2.5m-3 0h6" />,
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Zm0 13A2.5 2.5 0 0 1 6.5 16H20M8 7h8" />,
  bookmark: <path d="M7 3.5h10c.6 0 1 .4 1 1V21l-6-4.5L6 21V4.5c0-.6.4-1 1-1Z" />,
  star: <path d="m12 3 2.5 5.6 6.1.6-4.6 4 1.3 6-5.3-3.2L6.7 19.2l1.3-6-4.6-4 6.1-.6L12 3Z" />,
  search: <path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm5.2 11.7L20 20" />,
  gear: <path d="M12 8.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Zm7.2 3.2 1.8-.9-.8-2.6-2 .3a7.4 7.4 0 0 0-1.2-1.2l.3-2-2.6-.8-.9 1.8a7.6 7.6 0 0 0-1.8 0L11.1 4.8l-2.6.8.3 2c-.5.3-.9.7-1.2 1.2l-2-.3-.8 2.6 1.8.9a7.6 7.6 0 0 0 0 1.8l-1.8.9.8 2.6 2-.3c.3.5.7.9 1.2 1.2l-.3 2 2.6.8.9-1.8a7.6 7.6 0 0 0 1.8 0l.9 1.8 2.6-.8-.3-2c.5-.3.9-.7 1.2-1.2l2 .3.8-2.6-1.8-.9a7.6 7.6 0 0 0 0-1.8Z" />,
  chart: <path d="M4 20V4m0 16h16M8 16v-5m4 5V7m4 9v-8" />,
  flame: <path d="M12 3s5.5 4.2 5.5 9.2A5.5 5.5 0 0 1 12 17.7a5.5 5.5 0 0 1-5.5-5.5c0-2.3 1.2-4 2.5-5.4 0 0 .3 1.9 1.7 2.9C10.5 7.5 12 3 12 3Zm0 18a7 7 0 0 0 7-8.8" />,
  arrowR: <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  arrowL: <path d="M20 12H5m0 0 5.5-5.5M5 12l5.5 5.5" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  x: <path d="m5.5 5.5 13 13m0-13-13 13" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M5 7h14m-9-3h4M8.5 7l.7 13h5.6l.7-13M10.2 10.5v6m3.6-6v6" />,
  edit: <path d="m14.5 5 4.5 4.5L8.5 20H4v-4.5L14.5 5Zm2-2 2.5 2.5" />,
  user: <path d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-7.5 16a7.5 7.5 0 0 1 15 0" />,
  logout: <path d="M14 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H14M10 12h10m0 0-3.5-3.5M20 12l-3.5 3.5" />,
  eye: <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 2.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" />,
  eyeOff: <path d="M4 4l16 16M9.9 5.9A9.5 9.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.5 17.5 0 0 1-3 3.7m-2.3 1.7a9.4 9.4 0 0 1-4.2.9C6 18.5 2.5 12 2.5 12a17.6 17.6 0 0 1 4-4.6M9.5 9.8a2.8 2.8 0 0 0 4 3.9" />,
  lock: <path d="M7 11V8a5 5 0 0 1 10 0v3m-11 0h12v9.5H6V11Zm6 4v2.5" />,
  mail: <path d="M3.5 6h17v12h-17V6Zm0 1 8.5 6 8.5-6" />,
  home: <path d="m4 11 8-7 8 7v9h-5.5v-5.5h-5V20H4v-9Z" />,
  target: <path d="M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 3.6a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2Z" />,
  sparkle: <path d="M12 3c.6 3.8 2 5.7 6 6.5-4 .8-5.4 2.7-6 6.5-.6-3.8-2-5.7-6-6.5 4-.8 5.4-2.7 6-6.5ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />,
  headphones: <path d="M4.5 13.5V12a7.5 7.5 0 0 1 15 0v1.5M4.5 13.5H7v5H5a1.5 1.5 0 0 1-1.5-1.5v-3.5ZM19.5 13.5H17v5h2.5a1.5 1.5 0 0 0 1.5-1.5v-3.5Z" />,
  brain: <path d="M12 4.5a3 3 0 0 0-3-1.8 3.2 3.2 0 0 0-3 2.6A3.6 3.6 0 0 0 4 8.8c0 1 .4 1.9 1 2.5-.8.8-1.3 1.9-1.3 3A4.2 4.2 0 0 0 8 18.5c.7.6 1.6 1 2.5 1 .6 0 1-.1 1.5-.4.5.3 1 .4 1.5.4 1 0 1.9-.4 2.5-1a4.2 4.2 0 0 0 4.3-4.2c0-1.1-.5-2.2-1.3-3 .6-.6 1-1.5 1-2.5a3.6 3.6 0 0 0-2-3.5 3.2 3.2 0 0 0-3-2.6 3 3 0 0 0-3 1.8Zm0 0v14.6" />,
  refresh: <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 3.5v3.8h-3.8" />,
  sun: <path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0-4v2m0 13v2m8.5-8.5h-2m-13 0h-2m13.5-6-1.4 1.4m-9.2 9.2-1.4 1.4m0-12 1.4 1.4m9.2 9.2 1.4 1.4" />,
  moon: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />,
  monitor: <path d="M4 5h16v11H4V5Zm4 15h8m-4-4v4" />,
  globe: <path d="M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Zm-8.5 8.5h17M12 3.5c2.3 2.3 3.5 5.2 3.5 8.5S14.3 18.2 12 20.5C9.7 18.2 8.5 15.3 8.5 12S9.7 5.8 12 3.5Z" />,
  note: <path d="M5 4.5h14v11l-4 4H5v-15Zm10 15v-4h4M8.5 9h7m-7 3.5h4" />,
  clock: <path d="M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 3.5V12l3 2.5" />,
  shield: <path d="M12 3.5 5 6v5.5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-2.5Zm-2.5 8.5 2 2 3.5-4" />,
  heart: <path d="M12 20s-7.5-4.7-7.5-10A4.3 4.3 0 0 1 9 5.7c1.3 0 2.4.7 3 1.7.6-1 1.7-1.7 3-1.7a4.3 4.3 0 0 1 4.5 4.3c0 5.3-7.5 10-7.5 10Z" />,
  list: <path d="M8.5 6h12m-12 6h12m-12 6h12M4 6h.5M4 12h.5M4 18h.5" />,
};

export function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name] ?? PATHS.star}
    </svg>
  );
}

/* ---------------- decorative stickers ---------------- */

export function Flower({ className = "w-10 h-10", color = "var(--color-sun)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {[0, 45, 90, 135].map((r) => (
        <g key={r} transform={`rotate(${r} 32 32)`}>
          <ellipse cx="32" cy="14" rx="9" ry="13" fill={color} stroke="var(--color-ink)" strokeWidth="2" />
          <ellipse cx="32" cy="50" rx="9" ry="13" fill={color} stroke="var(--color-ink)" strokeWidth="2" />
        </g>
      ))}
      <circle cx="32" cy="32" r="8" fill="var(--color-blush-deep)" stroke="var(--color-ink)" strokeWidth="2" />
    </svg>
  );
}

export function Star8({ className = "w-8 h-8", color = "var(--color-blush)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M32 4l6 18 18-6-6 18 18 6-18 6 6 18-18-6-6 18-6-18-18 6 6-18-18-6 18-6-6-18 18 6z"
        fill={color}
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ className = "w-24 h-6", color = "var(--color-blush-deep)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 20" className={className} aria-hidden="true">
      <path d="M2 12c8-10 16-10 24 0s16 10 24 0 16-10 24 0 16 10 24 0 16-10 20-4" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Blob({ className = "w-64 h-64", color = "var(--color-lav)", opacity = 1 }: { className?: string; color?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" style={{ opacity }}>
      <path
        d="M48.7,-62.5C62.3,-54.2,72,-38.5,76.2,-21.2C80.4,-3.9,79.1,15,71.4,30.2C63.7,45.4,49.6,56.9,33.9,64.3C18.2,71.7,0.9,75,-16.5,71.6C-33.9,68.2,-51.4,58.1,-62.1,43.2C-72.8,28.3,-76.7,8.6,-72.6,-8.7C-68.5,-26,-56.4,-40.9,-42.4,-49.9C-28.4,-58.9,-12.5,-62,3.2,-65.9C18.9,-69.8,35.1,-70.8,48.7,-62.5Z"
        fill={color}
        transform="translate(100 100)"
      />
    </svg>
  );
}

export function RingBadge({ text, className = "w-28 h-28" }: { text: string; className?: string }) {
  return (
    <div className={`${className} relative spin-slow`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <path id="ring-circ" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <circle cx="50" cy="50" r="48" fill="var(--color-sun)" stroke="var(--color-ink)" strokeWidth="2.5" />
        <text fontSize="11.5" fontWeight="700" letterSpacing="2.5" fill="var(--color-ink)" fontFamily="Space Grotesk, sans-serif">
          <textPath href="#ring-circ">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <Icon name="sparkle" className="w-7 h-7 text-ink" />
      </div>
    </div>
  );
}

/* ---------------- scroll reveal ---------------- */

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- buttons & pills ---------------- */

export function Btn({
  children,
  onClick,
  variant = "ink",
  className = "",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "ink" | "cream" | "sun" | "burg" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm border-2 border-ink px-5 py-3 transition-all duration-200 active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer";
  const variants: Record<string, string> = {
    ink: "bg-ink text-cream shadow-[4px_4px_0_0_var(--color-sun)] hover:shadow-[2px_2px_0_0_var(--color-sun)] hover:translate-x-[2px] hover:translate-y-[2px]",
    cream: "bg-cream text-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:shadow-[2px_2px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px]",
    sun: "bg-sun text-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:shadow-[2px_2px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px]",
    burg: "bg-burg text-cream shadow-[4px_4px_0_0_var(--color-ink)] hover:shadow-[2px_2px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px]",
    ghost: "bg-transparent text-ink border-transparent shadow-none hover:bg-ink/5 px-3",
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Pill({ children, className = "bg-cream" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 border-2 border-ink px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] ${className}`}>
      {children}
    </span>
  );
}

export function SectionHead({ kicker, title, dark = false }: { kicker: string; title: string; dark?: boolean }) {
  return (
    <div className="max-w-3xl">
      <Pill className={dark ? "bg-forest-soft text-cream border-cream/70" : "bg-cream"}>
        <span className="w-2 h-2 rounded-full bg-burg inline-block" />
        {kicker}
      </Pill>
      <h2 className={`font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] mt-5 uppercase ${dark ? "text-cream" : "text-ink"}`}>{title}</h2>
    </div>
  );
}

/* ---------------- stat ring ---------------- */

export function StatRing({ value, max, size = 120, label, sub, color = "var(--color-sun)" }: { value: number; max: number; size?: number; label?: string; sub?: string; color?: string }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, max ? value / max : 0);
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(16,27,21,0.12)" strokeWidth="10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="ring-anim"
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl leading-none">
          {value}
          <span className="text-sm text-ink/50">/{max}</span>
        </div>
        {label && <div className="text-[10px] font-bold uppercase tracking-widest text-ink/60 mt-1">{label}</div>}
        {sub && <div className="text-[10px] text-ink/50">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------------- modal ---------------- */

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative bg-paper border-2 border-ink shadow-hard rounded-3xl w-full max-w-lg p-6 sm:p-8 animate-[none]">
        {title && (
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="font-display text-2xl uppercase">{title}</h3>
            <button onClick={onClose} className="p-1.5 border-2 border-ink rounded-full bg-cream hover:bg-blush transition-colors cursor-pointer" aria-label="Close">
              <Icon name="x" className="w-4 h-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ---------------- toasts ---------------- */

type Toast = { id: number; msg: string };
let toastId = 0;
const toastListeners = new Set<(t: Toast[]) => void>();
let toasts: Toast[] = [];

export function toast(msg: string) {
  toasts = [...toasts, { id: ++toastId, msg }];
  toastListeners.forEach((l) => l(toasts));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== toastId);
    toastListeners.forEach((l) => l(toasts));
  }, 3200);
}

export function Toasts() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const l = (t: Toast[]) => setItems([...t]);
    toastListeners.add(l);
    return () => {
      toastListeners.delete(l);
    };
  }, []);
  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none px-4">
      {items.map((t) => (
        <div key={t.id} className="bg-ink text-cream border-2 border-cream/20 px-5 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sun inline-block shrink-0" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------------- misc ---------------- */

export function AvatarBadge({ color, glyph, size = "w-11 h-11 text-lg" }: { color: string; glyph: string; size?: string }) {
  return <div className={`${color} ${size} ${size.includes("w-") ? "" : ""} rounded-full border-2 border-ink grid place-items-center font-display text-cream shrink-0`}>{glyph}</div>;
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}
