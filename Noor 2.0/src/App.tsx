import { useEffect, useState, type ReactNode } from "react";
import { currentLang, logout, useApp } from "./lib/core";
import { loadFullQuran } from "./data/quran";
import { registerServiceWorker } from "./lib/pwa";
import { NetPill, SplashOverlay, UpdateBanner } from "./components/pwa";
import { AvatarBadge, Icon, Toasts } from "./components/ui";
import { Footer, AboutPage, PublicNav } from "./pages/landing";
import { PremiumLandingPage } from "./pages/premium-landing";
import { LoginPage, RegisterPage, ResetPage } from "./pages/auth";
import { ReaderPage, SurahIndexPage } from "./pages/quran";
import { MemorizePage, PracticePage, ReviewPage } from "./pages/practice";
import { BookmarksPage, NotesPage, ProfilePage, ProgressPage, SettingsPage } from "./pages/learn";
import { PremiumDashboard } from "./pages/dashboard";
import { TajweedIndexPage, TajweedLessonPage } from "./pages/tajweed";

/* ---------------- tiny hash router ---------------- */

function useHash(): string[] {
  const [hash, setHash] = useState(() => location.hash.replace(/^#\/?/, ""));
  useEffect(() => {
    const fn = () => setHash(location.hash.replace(/^#\/?/, ""));
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return hash.split("/").filter(Boolean);
}

/* ---------------- app shell ---------------- */

const NAV: [string, string, string][] = [
  ["#/app", "nav.dashboard", "home"],
  ["#/app/quran", "nav.quran", "book"],
  ["#/app/practice", "nav.practice", "mic"],
  ["#/app/memorize", "nav.memorize", "brain"],
  ["#/app/review", "nav.review", "refresh"],
  ["#/app/tajweed", "nav.tajweed", "sparkle"],
  ["#/app/progress", "nav.progress", "chart"],
  ["#/app/bookmarks", "nav.bookmarks", "bookmark"],
  ["#/app/notes", "nav.notes", "note"],
];

function Sidebar({ path }: { path: string }) {
  const { user } = useApp();
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  const isActive = (href: string) => {
    const h = href.replace(/^#\//, "");
    if (h === "app") return path === "app";
    return path === h || path.startsWith(h + "/");
  };
  return (
    <aside className="hidden lg:flex flex-col w-[248px] shrink-0 bg-forest text-cream sticky top-0 h-screen border-r-2 border-ink">
      <a href="#/app" className="flex items-center gap-3 px-6 py-6 group">
        <span className="w-10 h-10 rounded-xl bg-sun border-2 border-ink grid place-items-center group-hover:rotate-6 transition-transform">
          <Icon name="moon" className="w-5 h-5 text-ink" />
        </span>
        <span className="font-display text-xl tracking-wide">NOOR</span>
      </a>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV.map(([href, key, icon]) => (
          <a
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              isActive(href) ? "bg-sun text-ink border-2 border-ink shadow-hard-sm -translate-y-px" : "text-cream/75 hover:bg-forest-soft hover:text-cream border-2 border-transparent"
            }`}
          >
            <Icon name={icon} className="w-4.5 h-4.5" />
            {t(key)}
          </a>
        ))}
        <div className="pt-4 mt-4 border-t border-cream/15 space-y-1">
          {[
            ["#/app/profile", "nav.profile", "user"],
            ["#/app/settings", "nav.settings", "gear"],
          ].map(([href, key, icon]) => (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive(href) ? "bg-sun text-ink border-2 border-ink" : "text-cream/75 hover:bg-forest-soft hover:text-cream border-2 border-transparent"
              }`}
            >
              <Icon name={icon} className="w-4.5 h-4.5" />
              {t(key)}
            </a>
          ))}
        </div>
      </nav>
      <div className="p-4 border-t border-cream/15">
        {user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <AvatarBadge color={user.avatar.color} glyph={user.avatar.glyph} size="w-10 h-10 text-base" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-[11px] text-cream/50 truncate">{user.email}</p>
            </div>
            <button onClick={() => { logout(); location.hash = "#/"; }} className="p-2 rounded-lg text-cream/60 hover:text-cream hover:bg-forest-soft transition-colors cursor-pointer" aria-label="Log out">
              <Icon name="logout" className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
        <p className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-2 pt-2 ${online ? "text-cream/50" : "text-sun"}`}>
          <span className={`w-2 h-2 rounded-full ${online ? "bg-sage" : "bg-sun animate-pulse"}`} />
          {online ? "Saved on this device" : "Offline — still working"}
        </p>
      </div>
    </aside>
  );
}

function MobileNav({ path }: { path: string }) {
  const items: [string, string, string][] = [
    ["#/app", "nav.home", "home"],
    ["#/app/quran", "nav.quran", "book"],
    ["#/app/practice", "nav.practice", "mic"],
    ["#/app/review", "nav.review", "refresh"],
    ["#/app/progress", "nav.progress", "chart"],
  ];
  const isActive = (href: string) => {
    const h = href.replace(/^#\//, "");
    if (h === "app") return path === "app";
    return path === h || path.startsWith(h + "/");
  };
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-forest border-t-2 border-ink flex">
      {items.map(([href, key, icon]) => (
        <a key={href} href={href} className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive(href) ? "text-sun" : "text-cream/60"}`}>
          <span className={`w-9 h-9 grid place-items-center rounded-xl border-2 transition-all ${isActive(href) ? "border-sun bg-forest-soft -translate-y-1" : "border-transparent"}`}>
            <Icon name={icon} className="w-5 h-5" />
          </span>
          {t(key)}
        </a>
      ))}
    </nav>
  );
}

function TopBar() {
  const { user } = useApp();
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-forest text-cream border-b-2 border-ink flex items-center justify-between px-5 py-3">
      <a href="#/app" className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-xl bg-sun border-2 border-ink grid place-items-center">
          <Icon name="moon" className="w-4.5 h-4.5 text-ink" />
        </span>
        <span className="font-display text-lg tracking-wide">NOOR</span>
      </a>
      <div className="flex items-center gap-3">
        <NetPill className="hidden sm:inline-flex" />
        <a href="#/app/profile" aria-label="Profile">
          {user && <AvatarBadge color={user.avatar.color} glyph={user.avatar.glyph} size="w-9 h-9 text-sm" />}
        </a>
        <button onClick={() => { logout(); location.hash = "#/"; }} className="text-cream/70 hover:text-cream p-1 cursor-pointer" aria-label="Log out">
          <Icon name="logout" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

function AppShell({ children, path }: { children: ReactNode; path: string }) {
  return (
    <div className="min-h-screen bg-cream dark:bg-forest-deep dark:text-cream flex grain">
      <Sidebar path={path} />
      <div className="flex-1 min-w-0 relative z-10">
        <TopBar />
        <main className="pb-28 lg:pb-16 dark:[&_p]:text-cream/80">{children}</main>
      </div>
      <MobileNav path={path} />
    </div>
  );
}

function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream grain">
      <PublicNav />
      <div className="relative z-10">{children}</div>
      <Footer />
    </div>
  );
}

/* ---------------- i18n helper ---------------- */

function t(key: string): string {
  const { t: tr } = require_t();
  return tr(key);
}
function require_t() {
  // late-bound to avoid circular import at module evaluation
  return { t: (key: string) => coreT(key) };
}
import { t as coreT } from "./lib/core";

/* ---------------- root ---------------- */

export default function App() {
  const parts = useHash();
  const { user, data } = useApp();
  const path = parts.join("/") || "home";

  // pre-sync the complete validated dataset (cached on-device for offline use)
  useEffect(() => {
    loadFullQuran().catch(() => {});
  }, []);

  // PWA: register the service worker once
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // theme + language side effects
  useEffect(() => {
    const theme = data?.settings.theme ?? "light";
    const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    const lang = currentLang();
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [data?.settings.theme, data?.settings.lang, user]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  // guards
  const needsAuth = parts[0] === "app";
  const isAuthPage = ["login", "register", "reset"].includes(parts[0] ?? "");
  useEffect(() => {
    if (needsAuth && !user) location.hash = "#/login";
    if (isAuthPage && user) location.hash = "#/app";
  }, [needsAuth, isAuthPage, user]);

  let page: ReactNode;

  if (needsAuth && !user) {
    page = null;
  } else {
    const [p0, p1, p2, p3] = parts;
    switch (p0 ?? "") {
      case "":
        page = <PremiumLandingPage />;
        break;
      case "about":
        page = <AboutPage />;
        break;
      case "login":
        page = <LoginPage />;
        break;
      case "register":
        page = <RegisterPage />;
        break;
      case "reset":
        page = <ResetPage />;
        break;
      case "quran":
        page = p1 ? (
          <PublicShell><ReaderPage s={Number(p1)} a={p2 ? Number(p2) : undefined} /></PublicShell>
        ) : (
          <PublicShell><SurahIndexPage /></PublicShell>
        );
        break;
      case "tajweed":
        page = p1 ? (
          <PublicShell><TajweedLessonPage id={p1} /></PublicShell>
        ) : (
          <PublicShell><TajweedIndexPage /></PublicShell>
        );
        break;
      case "app": {
        if (!user) break;
        let inner: ReactNode;
        switch (p1 ?? "") {
          case "":
            inner = <PremiumDashboard />;
            break;
          case "quran":
            inner = p2 ? <ReaderPage s={Number(p2)} a={p3 ? Number(p3) : undefined} inApp /> : <SurahIndexPage inApp />;
            break;
          case "practice": {
            const pmode = parts[4];
            inner = <PracticePage s={p2 ? Number(p2) : undefined} a={p3 ? Number(p3) : undefined} mode={pmode === "review" ? "review" : pmode === "memorize" ? "memorize" : "practice"} />;
            break;
          }
          case "memorize":
            inner = <MemorizePage s={p2 ? Number(p2) : undefined} a={p3 ? Number(p3) : undefined} />;
            break;
          case "review":
            inner = <ReviewPage />;
            break;
          case "tajweed":
            inner = p2 ? <TajweedLessonPage id={p2} inApp /> : <TajweedIndexPage inApp />;
            break;
          case "progress":
            inner = <ProgressPage />;
            break;
          case "bookmarks":
            inner = <BookmarksPage />;
            break;
          case "notes":
            inner = <NotesPage />;
            break;
          case "profile":
            inner = <ProfilePage />;
            break;
          case "settings":
            inner = <SettingsPage />;
            break;
          default:
            inner = <PremiumDashboard />;
        }
        page = <AppShell path={path}>{inner}</AppShell>;
        break;
      }
      default:
        page = <PremiumLandingPage />;
    }
  }

  return (
    <>
      <SplashOverlay />
      {page}
      <UpdateBanner />
      <Toasts />
    </>
  );
}
