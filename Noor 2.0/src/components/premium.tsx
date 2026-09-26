import { type ReactNode } from "react";

/* ---------------- Premium Button ---------------- */

export function PremiumButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-forest text-white hover:bg-forest-soft shadow-md hover:shadow-lg",
    secondary: "bg-white text-forest border-2 border-forest/10 hover:border-forest/20 shadow-sm hover:shadow-md",
    ghost: "text-forest hover:bg-forest/5",
    success: "bg-sage text-white hover:bg-sage/90 shadow-md hover:shadow-lg",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

/* ---------------- Premium Card ---------------- */

export function PremiumCard({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`card-premium p-6 ${hover ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- Glass Card ---------------- */

export function GlassCard({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`${dark ? "glass-dark" : "glass"} rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

/* ---------------- Progress Bar ---------------- */

export function ProgressBar({
  value,
  max = 100,
  color = "forest",
  showLabel = true,
  size = "md",
}: {
  value: number;
  max?: number;
  color?: "forest" | "sun" | "burg" | "sage";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colors = {
    forest: "bg-forest",
    sun: "bg-sun",
    burg: "bg-burg",
    sage: "bg-sage",
  };
  
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };
  
  return (
    <div className="w-full">
      <div className={`w-full bg-forest/10 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1.5 text-xs font-medium text-ink/60">
          <span>{value} / {max}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

/* ---------------- Stat Card ---------------- */

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "forest",
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  color?: "forest" | "sun" | "burg" | "sage" | "lav";
}) {
  const bgColors = {
    forest: "bg-forest/5",
    sun: "bg-sun/10",
    burg: "bg-burg/5",
    sage: "bg-sage/10",
    lav: "bg-lav/20",
  };
  
  const iconColors = {
    forest: "text-forest",
    sun: "text-sun-deep",
    burg: "text-burg",
    sage: "text-sage",
    lav: "text-lav-deep",
  };
  
  return (
    <div className="card-soft p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`${bgColors[color]} ${iconColors[color]} p-2.5 rounded-xl`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-semibold ${trend.value >= 0 ? "text-sage" : "text-burg"}`}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-ink mb-1">{value}</div>
      <div className="text-sm text-ink/60">{label}</div>
    </div>
  );
}

/* ---------------- Badge ---------------- */

export function Badge({
  children,
  variant = "default",
  size = "md",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "info";
  size?: "sm" | "md";
}) {
  const variants = {
    default: "bg-forest/10 text-forest",
    success: "bg-sage/15 text-sage",
    warning: "bg-sun/20 text-sun-deep",
    info: "bg-lav/30 text-lav-deep",
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };
  
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

/* ---------------- XP Badge ---------------- */

export function XPBadge({ xp, level }: { xp: number; level: number }) {
  const xpToNext = 100 - (xp % 100);
  
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-sun/20 to-sun/5 border border-sun/30 rounded-xl px-4 py-2.5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-sun rounded-full flex items-center justify-center font-bold text-ink text-sm">
          {level}
        </div>
        <div>
          <div className="text-xs font-semibold text-ink/60">Level {level}</div>
          <div className="text-xs text-ink/40">{xpToNext} XP to next</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Streak Badge ---------------- */

export function StreakBadge({ days, longest }: { days: number; longest: number }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-burg/10 to-burg/5 border border-burg/20 rounded-xl px-4 py-2.5">
      <div className="text-2xl">🔥</div>
      <div>
        <div className="text-lg font-bold text-ink">{days} days</div>
        <div className="text-xs text-ink/60">Current streak</div>
      </div>
      {longest > days && (
        <div className="ml-auto text-xs text-ink/40">
          Best: {longest}
        </div>
      )}
    </div>
  );
}

/* ---------------- Achievement Card ---------------- */

export function AchievementCard({
  icon,
  name,
  description,
  unlocked,
  progress,
}: {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
}) {
  return (
    <div className={`card-soft p-4 ${unlocked ? "ring-2 ring-sun" : "opacity-75"}`}>
      <div className="flex items-start gap-3">
        <div className={`text-3xl ${unlocked ? "" : "grayscale"}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-ink mb-1">{name}</div>
          <div className="text-xs text-ink/60 mb-2">{description}</div>
          {progress !== undefined && !unlocked && (
            <ProgressBar value={progress} max={100} size="sm" showLabel={false} color="sun" />
          )}
          {unlocked && (
            <Badge variant="success" size="sm">✓ Unlocked</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Empty State ---------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-forest/5 rounded-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink/60 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
}

/* ---------------- Loading Skeleton ---------------- */

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-forest/5 rounded-lg shimmer ${className}`} />
  );
}

/* ---------------- Icon Wrapper ---------------- */

export function IconWrapper({
  children,
  size = "md",
  color = "forest",
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  color?: "forest" | "sun" | "burg" | "sage" | "lav";
}) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  
  const colors = {
    forest: "bg-forest/10 text-forest",
    sun: "bg-sun/15 text-sun-deep",
    burg: "bg-burg/10 text-burg",
    sage: "bg-sage/15 text-sage",
    lav: "bg-lav/25 text-lav-deep",
  };
  
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-xl flex items-center justify-center`}>
      {children}
    </div>
  );
}
