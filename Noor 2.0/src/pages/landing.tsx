import { useEffect, useRef, useState } from "react";
import { BASMALA, FEATURED, SURAHS, surahMeta, wordsOf } from "../data/quran";
import { ayahAudioUrl, t, currentLang, setPublicLang, useApp } from "../lib/core";
import { Blob, Btn, Flower, Icon, Pill, Reveal, RingBadge, Squiggle, Star8 } from "../components/ui";
import { InstallCard } from "../components/pwa";

/* ---------------- public nav + footer ---------------- */

export function PublicNav() {
  const { user } = useApp();
  const [lang, setLang] = useState(currentLang());
  return (
    <header className="absolute top-0 inset-x-0 z-40">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between py-5">
        <a href="#/" className="flex items-center gap-3 group">
          <span className="w-11 h-11 rounded-2xl bg-sun border-2 border-ink grid place-items-center shadow-hard-sm group-hover:rotate-6 transition-transform">
            <Icon name="moon" className="w-6 h-6 text-ink" />
          </span>
          <span className="font-display text-2xl text-cream tracking-wide">NOOR</span>
        </a>
        <nav className="hidden md:flex items-center gap-1 text-cream/90 font-semibold text-sm">
          {[
            ["Qur'an", "#/quran"],
            ["Tajweed", "#/tajweed"],
            ["About", "#/about"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="px-4 py-2 rounded-full hover:bg-cream/10 hover:text-cream transition-colors">
              {label}
            </a>
          ))}
          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => {
              const v = e.target.value as "en" | "rw" | "ar";
              setPublicLang(v);
              setLang(v);
            }}
            className="bg-transparent border border-cream/30 rounded-full px-3 py-1.5 text-xs uppercase tracking-wider cursor-pointer ml-2 [&>option]:text-ink"
          >
            <option value="en">EN</option>
            <option value="rw">RW</option>
            <option value="ar">AR</option>
          </select>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <a href="#/app" className="bg-sun text-ink border-2 border-ink px-5 py-2.5 font-bold uppercase tracking-wider text-sm shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              {t("nav.dashboard")}
            </a>
          ) : (
            <>
              <a href="#/login" className="text-cream font-bold uppercase tracking-wider text-sm px-3 py-2 hover:text-sun transition-colors hidden sm:block">
                {t("action.login")}
              </a>
              <a href="#/register" className="bg-cream text-ink border-2 border-ink px-5 py-2.5 font-bold uppercase tracking-wider text-sm shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                {t("action.register")}
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest-deep text-cream/80 border-t-2 border-ink">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-sun border-2 border-cream/30 grid place-items-center">
              <Icon name="moon" className="w-5 h-5 text-ink" />
            </span>
            <span className="font-display text-xl text-cream">NOOR</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            A Qur'an teaching and memorization platform: listen, recite, track word by word, and review with spaced repetition.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-bold uppercase tracking-widest text-sun text-xs mb-3">Learn</p>
            {["Qur'an reader", "Practice", "Memorization", "Tajweed Academy"].map((x, i) => (
              <a key={x} href={["#/quran", "#/app/practice", "#/app/memorize/1/2", "#/tajweed"][i]} className="block py-1.5 hover:text-sun transition-colors">
                {x}
              </a>
            ))}
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-sun text-xs mb-3">Platform</p>
            {["About", "Create account", "Log in", "Progress"].map((x, i) => (
              <a key={x} href={["#/about", "#/register", "#/login", "#/app/progress"][i]} className="block py-1.5 hover:text-sun transition-colors">
                {x}
              </a>
            ))}
          </div>
        </div>
        <div className="text-xs leading-relaxed">
          <p className="font-bold uppercase tracking-widest text-sun text-xs mb-3">Data safety</p>
          <p>
            All Qur'anic Arabic is served from the validated dataset of the complete mushaf — synced once and cached on your device for offline reading. AI is
            never used to compose, rewrite or correct Qur'anic text. Word matching reports what speech recognition matched; it never claims religious authority.
            For rulings, please consult qualified scholars.
          </p>
        </div>
      </div>
      <div className="border-t border-cream/15 py-5 text-center text-xs text-cream/50">NOOR — learning activity only, built with care.</div>
    </footer>
  );
}

/* ---------------- hero ---------------- */

function HeroCard() {
  const words = wordsOf(1, 2);
  const [demo, setDemo] = useState(0);
  const timer = useRef<number | null>(null);
  const runDemo = () => {
    if (timer.current) return;
    setDemo(0);
    let i = 0;
    timer.current = window.setInterval(() => {
      i++;
      setDemo(i);
      if (i > words.length && timer.current) {
        window.clearInterval(timer.current);
        timer.current = null;
        setTimeout(() => setDemo(0), 1400);
      }
    }, 520);
  };
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
  const play = () => {
    const audio = new Audio(ayahAudioUrl("Husary_128kbps", 1, 2));
    audio.play().catch(() => {});
    runDemo();
  };
  return (
    <div className="relative">
      <Blob className="absolute -top-16 -right-10 w-72 h-72 hidden sm:block" color="var(--color-forest-soft)" />
      <div className="relative bg-paper border-2 border-ink rounded-[2rem] shadow-hard p-7 sm:p-9 rotate-1 hover:rotate-0 transition-transform duration-500">
        <div className="flex items-center justify-between mb-5">
          <Pill className="bg-blush">
            <Icon name="headphones" className="w-3.5 h-3.5" /> Surah 1 · Ayah 2
          </Pill>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-burg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-burg animate-pulse" /> Tracking preview
          </span>
        </div>
        <p dir="rtl" lang="ar" className="font-quran text-[30px] sm:text-[36px] leading-[2.2] text-ink text-right">
          {words.map((w, i) => (
            <span
              key={i}
              className={`inline-block px-1 rounded-lg word-chip ${demo > i ? (demo === i + 1 ? "word-current" : "word-ok") : ""}`}
            >
              {w}
            </span>
          ))}
        </p>
        <p className="text-sm text-ink/65 mt-3 italic">“All praise is due to Allah, Lord of the worlds —”</p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={play}
            className="w-12 h-12 rounded-full bg-ink text-cream border-2 border-ink grid place-items-center hover:bg-burg transition-colors cursor-pointer"
            aria-label="Play ayah"
          >
            <Icon name="play" className="w-5 h-5 translate-x-[1px]" />
          </button>
          <div className="text-xs font-bold uppercase tracking-widest text-ink/60">
            Listen → recite
            <br />
            <span className="text-burg">4 words tracked</span>
          </div>
        </div>
      </div>
      <div className="absolute -top-10 -left-6 sm:-left-12 floaty" style={{ ["--rot" as string]: "-12deg" }}>
        <Flower className="w-20 h-20" />
      </div>
      <div className="absolute -bottom-12 -right-4 sm:-right-10">
        <RingBadge text="LISTEN • RECITE • TRACK • MEMORIZE • " className="w-28 h-28 sm:w-32 sm:h-32" />
      </div>
      <div className="absolute -left-3 bottom-10 hidden sm:block">
        <Star8 className="w-12 h-12 floaty" color="var(--color-blush)" />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="grain bg-forest relative overflow-hidden">
      <div className="absolute inset-0 dot-grid-light opacity-40" />
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-32 md:pt-40 pb-24 md:pb-32 grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <Reveal>
            <Pill className="bg-forest-soft text-cream border-cream/60">
              <Icon name="sparkle" className="w-3.5 h-3.5 text-sun" /> Qur'an teaching & memorization platform
            </Pill>
          </Reveal>
          <h1 className="font-display text-cream uppercase leading-[0.88] text-[17vw] sm:text-7xl md:text-8xl xl:text-[7.2rem] mt-7">
            <Reveal>Your journey</Reveal>
            <Reveal delay={90}>
              <span className="relative inline-block mt-2">
                with the{" "}
                <span className="relative inline-block px-3 bg-sun text-ink border-2 border-ink -rotate-1 shadow-hard-sm">
                  Qur'an
                  <svg viewBox="0 0 120 12" className="absolute -bottom-2 left-2 right-2 w-[92%] h-3" aria-hidden="true">
                    <path d="M3 8c20-6 40-6 58-2s38 4 56-2" fill="none" stroke="var(--color-burg)" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </Reveal>
            <Reveal delay={180}>
              <span className="block mt-2 text-lav">starts here.</span>
            </Reveal>
          </h1>
          <Reveal delay={260}>
            <p className="text-cream/80 text-lg md:text-xl max-w-xl mt-8 leading-relaxed">
              Listen, read, recite and memorize the Qur'an with <strong className="text-sun">word-by-word tracking</strong> and smart revision — built around
              your own pace and your own progress.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <div className="flex flex-wrap gap-4 mt-9">
              <a href="#/register" className="inline-block">
                <Btn variant="sun" className="text-base px-8 py-4">
                  {t("action.start")} <Icon name="arrowR" className="w-5 h-5" />
                </Btn>
              </a>
              <a href="#features" className="inline-block">
                <Btn variant="cream" className="text-base px-8 py-4">
                  Explore features
                </Btn>
              </a>
            </div>
          </Reveal>
          <Reveal delay={420}>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-10 text-cream/70 text-sm font-semibold">
              {["114 surahs", "Word-by-word tracker", "Hidden-ayah memorization", "Spaced revision"].map((x) => (
                <span key={x} className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sun" /> {x}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-5 relative mt-6 lg:mt-0">
          <Reveal delay={200}>
            <HeroCard />
          </Reveal>
        </div>
      </div>
      <div className="relative z-10 bg-sun border-y-2 border-ink overflow-hidden marquee" aria-hidden="true">
        <div className="marquee-track flex w-max items-center gap-8 py-3.5 px-4">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-8">
              {["114 SURAH", "WORD-BY-WORD TRACKING", "TAJWEED ACADEMY", "SMART REVISION", "LISTEN → RECITE → TRACK", "HIDDEN-AYAH TESTS", "PERSONAL PROGRESS", "STREAKS & GOALS"].map((s) => (
                <span key={s} className="flex items-center gap-8 font-display text-lg md:text-xl uppercase whitespace-nowrap text-ink">
                  {s}
                  <Star8 className="w-5 h-5" color="var(--color-burg)" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- explore quran (cream) ---------------- */

function ExploreSection() {
  return (
    <section className="grain bg-cream relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div>
              <Pill className="bg-sun">
                <Icon name="book" className="w-3.5 h-3.5" /> The mushaf
              </Pill>
              <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.92] mt-5">
                Explore
                <br />
                the <span className="text-burg">Qur'an.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-sm text-ink/70 leading-relaxed">
              114 surahs with ayah navigation, translation, adjustable Arabic type, bookmarks, notes and one-tap recitation audio from renowned qaris.
            </p>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {FEATURED.slice(0, 4).map((id, i) => {
            const s = surahMeta(id);
            const tilt = ["-rotate-1", "rotate-1", "rotate-[0.5deg]", "-rotate-[0.5deg]"][i % 4];
            const bg = ["bg-paper", "bg-lav/60", "bg-blush/50", "bg-sun/50"][i % 4];
            return (
              <Reveal key={id} delay={i * 90}>
                <a href={`#/quran/${id}`} className={`card-pop block ${bg} rounded-[1.6rem] p-6 ${tilt} hover:rotate-0`}>
                  <div className="flex items-start justify-between">
                    <span className="font-display text-4xl text-ink/25">{String(s.id).padStart(2, "0")}</span>
                    <span className="w-9 h-9 rounded-full bg-ink text-cream grid place-items-center text-xs font-bold">{s.ayahs}</span>
                  </div>
                  <p dir="rtl" lang="ar" className="font-quran text-4xl mt-6 text-ink">
                    {s.arabic}
                  </p>
                  <p className="font-display text-xl uppercase mt-2">{s.name}</p>
                  <p className="text-sm text-ink/60 mt-1">
                    {s.meaning} · {s.type}
                  </p>
                  <span className="inline-flex items-center gap-2 mt-5 text-sm font-bold uppercase tracking-widest text-burg">
                    {t("quran.read")} <Icon name="arrowR" className="w-4 h-4" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={150}>
          <div className="flex flex-wrap items-center gap-3 mt-10">
            <span className="text-sm font-bold uppercase tracking-widest text-ink/50">Also inside:</span>
            {FEATURED.slice(4).map((id) => (
              <a key={id} href={`#/quran/${id}`} className="border-2 border-ink bg-paper rounded-full px-4 py-1.5 text-sm font-bold hover:bg-sun transition-colors">
                {surahMeta(id).name}
              </a>
            ))}
            <a href="#/quran" className="ml-auto">
              <Btn variant="ink">All 114 surahs</Btn>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- features (burgundy) ---------------- */

function Features() {
  const items = [
    { n: "01", title: "Listen", icon: "headphones", bg: "bg-sun", text: "Hear authentic recitations from renowned qaris, with repeat, range-loop and speed control." },
    { n: "02", title: "Recite", icon: "mic", bg: "bg-lav", text: "Recite after listening and practice naturally — the microphone follows your voice in Arabic." },
    { n: "03", title: "Memorize", icon: "brain", bg: "bg-blush", text: "Hide the ayah and recite from memory. Mistakes stay hidden until you choose to review them." },
    { n: "04", title: "Track", icon: "chart", bg: "bg-cream", text: "Every ayah is split into verified word units and checked one by one, in real time." },
  ];
  return (
    <section id="features" className="grain bg-burg relative overflow-hidden">
      <Blob className="absolute -top-24 -left-24 w-96 h-96" color="var(--color-burg-deep)" />
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <Reveal>
          <Pill className="bg-burg-deep text-cream border-cream/50">
            <Icon name="sparkle" className="w-3.5 h-3.5 text-sun" /> The method
          </Pill>
          <h2 className="font-display text-cream uppercase leading-[0.92] text-5xl sm:text-6xl md:text-7xl mt-6 max-w-4xl">
            A better way to <span className="text-sun">learn,</span> understand and <span className="text-blush">memorize.</span>
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mt-16 max-w-5xl">
          {items.map((f, i) => (
            <Reveal key={f.n} delay={i * 110} className={i % 2 === 1 ? "sm:translate-y-10" : ""}>
              <div className={`card-pop ${f.bg} rounded-[1.8rem] p-8 h-full relative overflow-hidden`}>
                <span className="absolute -right-3 -top-5 font-display text-[7rem] leading-none text-ink/10 select-none">{f.n}</span>
                <div className="w-16 h-16 rounded-2xl bg-ink text-cream grid place-items-center mb-6 rotate-3">
                  <Icon name={f.icon} className="w-8 h-8" />
                </div>
                <h3 className="font-display text-4xl uppercase">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/75 max-w-xs">{f.text}</p>
                <Squiggle className="w-24 h-5 mt-6" color="var(--color-burg)" />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-20 sm:mt-24 flex flex-wrap items-center gap-5">
          <Flower className="w-14 h-14 floaty" />
          <p className="font-display text-cream uppercase text-2xl md:text-3xl">
            Listen <span className="text-sun">→</span> Recite <span className="text-sun">→</span> Track <span className="text-sun">→</span> Hide <span className="text-sun">→</span> Recall
          </p>
          <Star8 className="w-10 h-10 floaty" color="var(--color-sun)" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- live demo (pink) ---------------- */

function LiveDemo() {
  const words = wordsOf(112, 1);
  const [states, setStates] = useState<string[]>(words.map(() => "pending"));
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  const simulate = () => {
    if (running) return;
    setRunning(true);
    setStates(words.map(() => "pending"));
    let i = 0;
    timer.current = window.setInterval(() => {
      setStates((prev) => {
        const next = [...prev];
        if (i > 0) next[i - 1] = "ok";
        if (i < words.length) next[i] = "current";
        return next;
      });
      i++;
      if (i > words.length) {
        if (timer.current) window.clearInterval(timer.current);
        timer.current = null;
        setRunning(false);
      }
    }, 640);
  };
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
  const play = () => {
    new Audio(ayahAudioUrl("Alafasy_128kbps", 112, 1)).play().catch(() => {});
    simulate();
  };

  return (
    <section className="grain bg-blush relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal>
            <Pill className="bg-cream">
              <Icon name="mic" className="w-3.5 h-3.5 text-burg" /> The core loop
            </Pill>
            <h2 className="font-display uppercase leading-[0.92] text-5xl sm:text-6xl md:text-7xl mt-6">
              Listen →<br />
              Recite →<br />
              <span className="text-burg">Track.</span>
            </h2>
            <p className="mt-6 text-ink/75 max-w-md leading-relaxed">
              This is the heartbeat of Noor. An ayah is split into verified words; as you recite, speech recognition marks each word — recognized or needs
              review — so you always know exactly where you stand.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-wrap gap-3 mt-8">
              <Btn variant="ink" onClick={play}>
                <Icon name="play" className="w-4 h-4" /> See it move
              </Btn>
              <a href="#/register">
                <Btn variant="cream">Do it with your voice</Btn>
              </a>
            </div>
            <p className="text-xs text-ink/55 mt-4 max-w-sm">
              This animation is a preview. Inside the app, the tracker listens to your real microphone and matches your recitation word by word.
            </p>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="bg-paper border-2 border-ink rounded-[2rem] shadow-hard p-8 sm:p-10 -rotate-1 hover:rotate-0 transition-transform duration-500 relative">
            <div className="absolute -top-6 left-8">
              <Pill className="bg-sun">
                <Icon name="book" className="w-3.5 h-3.5" /> Surah Al-Ikhlas · 1
              </Pill>
            </div>
            <p dir="rtl" lang="ar" className="font-quran text-3xl sm:text-4xl text-right mt-4">
              {words.map((w, i) => (
                <span
                  key={i}
                  className={`word-chip inline-block px-2 py-0.5 mx-0.5 rounded-xl border-2 ${
                    states[i] === "ok" ? "word-ok border-ink" : states[i] === "current" ? "word-current border-ink" : "border-transparent bg-cream"
                  }`}
                >
                  {w}
                </span>
              ))}
            </p>
            <div className="mt-8 space-y-3">
              {[
                ["1 · Listen", "Hear the ayah from your chosen qari", "headphones"],
                ["2 · Recite", "Tap start and recite aloud", "mic"],
                ["3 · Track", "Words light up as they're matched", "check"],
              ].map(([a, b, ic], i) => (
                <div key={a} className="flex items-center gap-4 bg-cream border-2 border-ink/10 rounded-2xl px-4 py-3">
                  <span className={`w-9 h-9 rounded-full grid place-items-center border-2 border-ink ${i <= states.filter((s) => s === "ok").length - 1 ? "bg-sun" : "bg-paper"}`}>
                    <Icon name={ic} className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider">{a}</p>
                    <p className="text-xs text-ink/60">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- smart revision (lavender) ---------------- */

function RevisionSection() {
  const cards = [
    { label: "Needs attention", count: "3 ayahs", bg: "bg-burg text-cream", note: "Weak & overdue — review first", tilt: "-rotate-2" },
    { label: "Review soon", count: "5 ayahs", bg: "bg-sun text-ink", note: "Due within the next 3 days", tilt: "rotate-1 translate-y-4" },
    { label: "Strong", count: "10 ayahs", bg: "bg-paper text-ink", note: "Held firm — next review scheduled", tilt: "-rotate-1 translate-y-1" },
  ];
  return (
    <section className="grain bg-lav relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1 grid gap-6 max-w-md mx-auto w-full">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 110}>
                <div className={`card-pop ${c.bg} rounded-3xl px-7 py-6 flex items-center justify-between gap-4 ${c.tilt} hover:rotate-0`}>
                  <div>
                    <p className="font-display text-2xl uppercase">{c.label}</p>
                    <p className="text-sm opacity-75 mt-1">{c.note}</p>
                  </div>
                  <span className="font-display text-3xl whitespace-nowrap border-2 border-current rounded-2xl px-4 py-2">{c.count}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <Reveal>
              <Pill className="bg-cream">
                <Icon name="refresh" className="w-3.5 h-3.5 text-lav-deep" /> Smart revision
              </Pill>
              <h2 className="font-display uppercase leading-[0.92] text-5xl sm:text-6xl md:text-7xl mt-6">
                Focus on what
                <br />
                needs <span className="text-lav-deep">attention.</span>
              </h2>
              <p className="mt-6 text-ink/75 max-w-md leading-relaxed">
                Noor builds a personal revision queue from your attempts: weak memorizations surface first, frequently missed words get flagged, and each
                success pushes the ayah further into the future — spaced repetition, quietly working for you.
              </p>
              <a href="#/register" className="inline-block mt-8">
                <Btn variant="ink">
                  Build my queue <Icon name="arrowR" className="w-4 h-4" />
                </Btn>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- tajweed (yellow) ---------------- */

function TajweedTeaser() {
  const rules = ["Izhar", "Ikhfa", "Idgham", "Iqlab", "Qalqalah", "Ghunnah", "Madd", "Noon Sakinah", "Tanween", "Meem Sakinah"];
  return (
    <section className="grain bg-sun relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <Reveal>
              <Pill className="bg-cream">
                <Icon name="sparkle" className="w-3.5 h-3.5 text-burg" /> Tajweed Academy
              </Pill>
              <h2 className="font-display uppercase leading-[0.92] text-5xl sm:text-6xl md:text-7xl mt-6">
                Recite it the way
                <br />
                it was <span className="text-burg">revealed.</span>
              </h2>
              <p className="mt-6 text-ink/75 max-w-lg leading-relaxed">
                Ten visual lessons — learn the rule, see a live example straight from the mushaf, listen, then test yourself. Every example is drawn from the
                validated dataset, never invented.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-8">
                {rules.map((r, i) => (
                  <a
                    key={r}
                    href={`#/tajweed/${["izhar", "ikhfa", "idgham", "iqlab", "qalqalah", "ghunnah", "madd", "noon-sakinah", "tanween", "meem-sakinah"][i]}`}
                    className="border-2 border-ink bg-paper rounded-full px-4 py-1.5 text-sm font-bold hover:bg-blush hover:-translate-y-0.5 transition-all"
                  >
                    {r}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={150} className="lg:col-span-2">
            <div className="bg-paper border-2 border-ink rounded-[2rem] shadow-hard p-8 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between">
                <Pill className="bg-lav">Lesson · Ikhfa</Pill>
                <Flower className="w-10 h-10" color="var(--color-lav)" />
              </div>
              <p dir="rtl" lang="ar" className="font-quran text-4xl text-right mt-6">
                مِن <span className="bg-lav px-2 rounded-xl border-2 border-ink">شَ</span>رِّ الْوَسْوَاسِ
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mt-2 text-right" dir="rtl">
                Surah An-Nas · 114:4
              </p>
              <p className="mt-5 text-sm text-ink/70 leading-relaxed">
                The noon before ش is concealed — hide it in the nose for two counts and let it flow into the next letter.
              </p>
              <div className="flex gap-2 mt-6">
                {["Learn", "Example", "Listen", "Quiz"].map((s, i) => (
                  <span key={s} className={`flex-1 text-center text-[11px] font-bold uppercase tracking-wider border-2 border-ink rounded-full py-1.5 ${i === 1 ? "bg-sun" : "bg-cream"}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- install (cream) ---------------- */

function InstallSection() {
  return (
    <section className="grain bg-cream relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-28 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div>
            <Pill className="bg-blush">
              <Icon name="monitor" className="w-3.5 h-3.5" /> Works offline
            </Pill>
            <h2 className="font-display uppercase leading-[0.92] text-5xl sm:text-6xl md:text-7xl mt-6">
              One tap away,
              <br />
              <span className="text-burg">even offline.</span>
            </h2>
            <p className="mt-6 text-ink/75 max-w-md leading-relaxed">
              Install Noor on your home screen and it opens full-screen like a native app. The complete Qur'an, your bookmarks, notes, memorization and
              revision queue are cached on your device — weak connection or none, your learning keeps going.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-7 text-sm font-semibold text-ink/70">
              {["📱 Home-screen icon", "⚡ Instant launch", "☁ Syncs when you're back online"].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <InstallCard />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- final CTA ---------------- */

function FinalCta() {
  return (
    <section className="grain bg-forest relative overflow-hidden">
      <div className="absolute inset-0 dot-grid-light opacity-30" />
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 py-28 md:py-36 text-center">
        <div className="flex justify-center gap-6 mb-10">
          <Flower className="w-16 h-16 floaty" />
          <Star8 className="w-12 h-12 floaty self-end" color="var(--color-sun)" />
          <Flower className="w-10 h-10 floaty self-start" color="var(--color-blush)" />
        </div>
        <Reveal>
          <h2 className="font-display text-cream uppercase leading-[0.9] text-5xl sm:text-7xl md:text-8xl">
            Ready to start your
            <br />
            <span className="text-sun">Qur'an journey?</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p dir="rtl" lang="ar" className="font-quran text-3xl text-cream/80 mt-10">
            {BASMALA}
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <a href="#/register">
              <Btn variant="sun" className="text-base px-9 py-4">
                Create my free account
              </Btn>
            </a>
            <a href="#/quran">
              <Btn variant="cream" className="text-base px-9 py-4">
                Open the mushaf
              </Btn>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <Hero />
      <ExploreSection />
      <Features />
      <LiveDemo />
      <RevisionSection />
      <TajweedTeaser />
      <InstallSection />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ---------------- about ---------------- */

export function AboutPage() {
  const flow = [
    ["Owner-provided PDF", "The project owner supplies a trusted, verified mushaf PDF — the single source of truth."],
    ["Validated dataset", "Text is carefully digitized into a static, versioned dataset bundled with the app."],
    ["Application", "Reader, search, word tracker, memorization and tajweed examples all read from that dataset."],
  ];
  return (
    <div className="min-h-screen bg-forest grain">
      <PublicNav />
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 pt-36 pb-24">
        <Pill className="bg-forest-soft text-cream border-cream/60">
          <Icon name="shield" className="w-3.5 h-3.5 text-sun" /> About Noor
        </Pill>
        <h1 className="font-display text-cream uppercase leading-[0.9] text-5xl sm:text-7xl mt-7">
          Serious learning,
          <br />
          <span className="text-sun">playful by design.</span>
        </h1>
        <p className="text-cream/80 text-lg max-w-2xl mt-8 leading-relaxed">
          Noor is a Qur'an teaching and memorization platform. It pairs a validated Qur'an dataset with a modern learning loop — listen, recite, track word by
          word, hide, recall, review — so progress compounds day after day.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {flow.map(([title, body], i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="bg-paper border-2 border-ink rounded-3xl shadow-hard p-7 h-full relative">
                <span className="absolute -top-4 -left-3 w-10 h-10 rounded-full bg-burg text-cream border-2 border-ink grid place-items-center font-display">{i + 1}</span>
                <h3 className="font-display text-2xl uppercase mt-2">{title}</h3>
                <p className="text-sm text-ink/70 mt-3 leading-relaxed">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="bg-lav border-2 border-ink rounded-3xl shadow-hard p-8 md:p-10 mt-16">
            <h3 className="font-display text-3xl uppercase flex items-center gap-3">
              <Icon name="shield" className="w-7 h-7" /> Qur'an data safety
            </h3>
            <ul className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-3 text-ink/80">
              {[
                "The app never asks an AI model to generate Qur'anic Arabic.",
                "AI never rewrites, 'corrects' or substitutes verse text.",
                "Search, quizzes and tajweed examples all cite the validated dataset.",
                "Word matching only reports what speech recognition matched — it never claims your tajweed is definitively correct.",
                "Progress numbers describe learning activity only, never religious merit.",
                "For rulings and authoritative questions, consult qualified scholars.",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <Icon name="check" className="w-5 h-5 shrink-0 mt-0.5 text-burg" />
                  <span className="text-sm leading-relaxed">{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-wrap items-center justify-between gap-6 mt-16 bg-forest-soft border-2 border-cream/30 rounded-3xl p-8">
            <div>
              <h3 className="font-display text-cream text-3xl uppercase">Every learner gets their own space.</h3>
              <p className="text-cream/75 mt-2 max-w-xl">Accounts are fully isolated — your bookmarks, notes, memorization states, goals and streak belong only to you.</p>
            </div>
            <a href="#/register">
              <Btn variant="sun">Start learning</Btn>
            </a>
          </div>
        </Reveal>
      </div>
      <Footer />
    </div>
  );
}

/* keep surahs referenced for future landing stats */
export const __SURAH_COUNT = SURAHS.length;
