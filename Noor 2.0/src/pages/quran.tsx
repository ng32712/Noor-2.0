import { useEffect, useMemo, useRef, useState } from "react";
import {
  BASMALA, SURAHS, ayahKey, datasetFailed, getAyah, isFullLoaded, isSurahIncluded, loadFullQuran, onFullChange,
  searchAyahs, surahAyahs, surahMeta, totalAyahCount, type Ayah,
} from "../data/quran";
import { RECITERS, ayahAudioUrl, markAyahRead, patchSettings, setLastRead, toggleBookmark, upsertNote, useApp } from "../lib/core";
import { Btn, Icon, Modal, Pill, Reveal, toast } from "../components/ui";

/* ---------------- shared audio engine ---------------- */

let audioEl: HTMLAudioElement | null = null;
const getAudio = () => {
  if (!audioEl) audioEl = new Audio();
  return audioEl;
};

export function useAyahAudio(getNext?: (s: number, a: number) => { s: number; a: number } | null) {
  const [playing, setPlaying] = useState<string | null>(null);
  const { data } = useApp();
  const dataRef = useRef(data);
  dataRef.current = data;
  const nextRef = useRef(getNext);
  nextRef.current = getNext;

  const play = (s: number, a: number) => {
    const el = getAudio();
    const key = ayahKey(s, a);
    const reciter = dataRef.current?.settings.reciter ?? "Alafasy_128kbps";
    if (playing === key) {
      el.pause();
      setPlaying(null);
      return;
    }
    el.src = ayahAudioUrl(reciter, s, a);
    el.playbackRate = dataRef.current?.settings.speed ?? 1;
    el.play()
      .then(() => setPlaying(key))
      .catch(() => toast("Audio is unavailable offline — check your connection."));
    el.onended = () => {
      setPlaying(null);
      const auto = dataRef.current?.settings.autoPlay;
      const nx = auto && nextRef.current ? nextRef.current(s, a) : null;
      if (nx) setTimeout(() => play(nx.s, nx.a), 400);
    };
    el.onpause = () => setPlaying(null);
    el.onplay = () => setPlaying(key);
  };
  const stop = () => {
    getAudio().pause();
    setPlaying(null);
  };
  return { playing, play, stop };
}

/* ---------------- surah index ---------------- */

export function SurahIndexPage({ inApp }: { inApp?: boolean }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "Meccan" | "Medinan" | "ready">("all");
  const [sync, setSync] = useState<"syncing" | "ready" | "offline">(isFullLoaded() ? "ready" : "syncing");
  const base = inApp ? "#/app/quran" : "#/quran";

  useEffect(() => {
    loadFullQuran();
    return onFullChange(() => setSync(isFullLoaded() ? "ready" : "offline"));
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const surahs = SURAHS.filter((s) => {
      if (filter === "Meccan" || filter === "Medinan") {
        if (s.type !== filter) return false;
      }
      if (filter === "ready" && !isSurahIncluded(s.id)) return false;
      if (!query) return true;
      return (
        s.name.toLowerCase().includes(query) ||
        s.meaning.toLowerCase().includes(query) ||
        s.arabic.includes(q.trim()) ||
        String(s.id) === query
      );
    });
    const ayahs = q.trim() ? searchAyahs(q) : [];
    return { surahs, ayahs };
  }, [q, filter, sync]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={inApp ? "" : "min-h-screen bg-cream grain"}>
      {!inApp && <div className="h-24" />}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap gap-2 items-center">
              <Pill className="bg-sun">
                <Icon name="book" className="w-3.5 h-3.5" /> The mushaf
              </Pill>
              {sync === "syncing" && (
                <Pill className="bg-lav">
                  <span className="w-2 h-2 rounded-full bg-burg animate-pulse" /> Syncing complete dataset…
                </Pill>
              )}
              {sync === "ready" && (
                <Pill className="bg-paper">
                  <Icon name="check" className="w-3.5 h-3.5 text-forest-soft" /> 114 surahs · {totalAyahCount().toLocaleString()} ayahs on device
                </Pill>
              )}
              {sync === "offline" && (
                <Pill className="bg-blush">
                  <Icon name="shield" className="w-3.5 h-3.5" /> Offline — bundled portion shown
                </Pill>
              )}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.92] mt-4">
              The Qur'an<span className="text-burg">.</span>
            </h1>
            <p className="text-ink/60 mt-3 max-w-md">
              The complete mushaf from the validated dataset — synced once, cached on your device, available offline.
              {sync !== "ready" && " Surahs marked ✳ are already in the bundled portion."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {([["all", "All"], ["ready", "Ready to practice"], ["Meccan", "Meccan"], ["Medinan", "Medinan"]] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`border-2 border-ink rounded-full px-4 py-1.5 text-sm font-bold transition-all cursor-pointer ${filter === k ? "bg-ink text-cream" : "bg-paper hover:bg-sun/60"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-8 max-w-xl">
          <Icon name="search" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search surah, Arabic text or translation…"
            className="w-full border-2 border-ink rounded-2xl bg-paper pl-12 pr-4 py-3.5 font-medium outline-none focus:bg-sun/25 transition-colors shadow-hard-sm"
            aria-label="Search the Qur'an"
          />
        </div>

        {results.ayahs.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50 mb-3">Ayah matches</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {results.ayahs.map((a) => (
                <a key={ayahKey(a.s, a.a)} href={`${base}/${a.s}/${a.a}`} className="card-pop bg-paper rounded-2xl p-5 block">
                  <p className="text-xs font-bold uppercase tracking-widest text-burg">
                    {surahMeta(a.s).name} · {a.s}:{a.a}
                  </p>
                  <p dir="rtl" lang="ar" className="font-quran text-2xl mt-2 leading-[2]">
                    {a.ar.length > 90 ? a.ar.slice(0, 90) + "…" : a.ar}
                  </p>
                  <p className="text-xs text-ink/60 mt-2 line-clamp-2">{a.en}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.surahs.map((s, i) => {
            const ready = isSurahIncluded(s.id);
            return (
              <Reveal key={s.id} delay={Math.min(i, 8) * 40}>
                <a
                  href={ready ? `${base}/${s.id}` : undefined}
                  onClick={(e) => {
                    if (!ready) {
                      e.preventDefault();
                      toast(sync === "syncing" ? "The dataset is still syncing — one moment…" : "Offline — this surah isn't in the bundled portion.");
                    }
                  }}
                  className={`card-pop block rounded-[1.4rem] p-5 bg-paper ${ready ? "" : "opacity-60 hover:opacity-80"} relative overflow-hidden`}
                >
                  {ready && sync === "ready" && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sun border-2 border-ink grid place-items-center">
                      <Icon name="check" className="w-3 h-3" />
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <span className="w-11 h-11 rotate-3 border-2 border-ink rounded-xl grid place-items-center font-display text-lg bg-cream">{s.id}</span>
                    <span dir="rtl" lang="ar" className="font-quran text-3xl">
                      {s.arabic}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-2">
                    <div>
                      <p className="font-display text-xl uppercase leading-tight">
                        {s.name} {ready && sync !== "ready" && <span className="text-burg">✳</span>}
                      </p>
                      <p className="text-xs text-ink/55 mt-0.5">
                        {s.meaning} · {s.ayahs} {s.ayahs === 1 ? "ayah" : "ayahs"}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest border-2 border-ink rounded-full px-2.5 py-1 ${s.type === "Meccan" ? "bg-lav" : "bg-blush"}`}>{s.type}</span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- note modal ---------------- */

function NoteModal({ open, onClose, s, a, existing }: { open: boolean; onClose: () => void; s: number; a: number; existing?: string }) {
  const [text, setText] = useState(existing ?? "");
  useEffect(() => setText(existing ?? ""), [existing, open]);
  return (
    <Modal open={open} onClose={onClose} title={`Note · ${surahMeta(s).name} ${s}:${a}`}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="e.g. Review this ayah tomorrow."
        className="w-full border-2 border-ink rounded-xl bg-cream p-4 font-medium outline-none focus:bg-sun/25 transition-colors"
      />
      <p className="text-xs text-ink/50 mt-2">Private — only you can see this note.</p>
      <div className="flex gap-3 mt-5">
        <Btn
          variant="ink"
          onClick={() => {
            upsertNote(s, a, text.trim());
            toast(text.trim() ? "Note saved" : "Note updated");
            onClose();
          }}
        >
          <Icon name="note" className="w-4 h-4" /> Save note
        </Btn>
        <Btn variant="ghost" onClick={onClose}>
          Cancel
        </Btn>
      </div>
    </Modal>
  );
}

/* ---------------- ayah row ---------------- */

function AyahRow({ ayah, highlight, inApp, audio }: { ayah: Ayah; highlight: boolean; inApp?: boolean; audio: ReturnType<typeof useAyahAudio> }) {
  const { user, data } = useApp();
  const [noteOpen, setNoteOpen] = useState(false);
  const size = data?.settings.arabicSize ?? 34;
  const showTr = data?.settings.showTranslation ?? true;
  const bookmarked = !!user && !!data?.bookmarks.some((b) => b.s === ayah.s && b.a === ayah.a);
  const read = !!data?.readKeys.includes(ayahKey(ayah.s, ayah.a));
  const note = data?.notes.find((n) => n.s === ayah.s && n.a === ayah.a);
  const playing = audio.playing === ayahKey(ayah.s, ayah.a);
  const mem = data?.mem[ayahKey(ayah.s, ayah.a)];
  const practiceBase = inApp ? "#/app" : "#/app";

  const act = (label: string, icon: string, onClick: () => void, active = false) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 border-2 border-ink rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:-translate-y-0.5 ${
        active ? "bg-sun shadow-hard-sm" : "bg-paper hover:bg-cream"
      }`}
    >
      <Icon name={icon} className="w-3.5 h-3.5" /> {label}
    </button>
  );

  return (
    <article id={`ayah-${ayah.s}-${ayah.a}`} className={`rounded-[1.6rem] border-2 p-6 sm:p-7 transition-all duration-500 ${highlight ? "border-ink bg-sun/30 shadow-hard" : "border-ink/10 bg-paper hover:border-ink/40"}`}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="w-10 h-10 rounded-xl rotate-3 bg-forest text-cream grid place-items-center font-display border-2 border-ink">{ayah.a}</span>
        {mem && (
          <span className={`text-[10px] font-bold uppercase tracking-widest border-2 border-ink rounded-full px-2.5 py-1 ${mem.strength >= 80 ? "bg-lav" : mem.strength >= 50 ? "bg-sun" : "bg-blush"}`}>
            Strength {mem.strength}%
          </span>
        )}
        {read && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-forest-soft flex items-center gap-1">
            <Icon name="check" className="w-3.5 h-3.5" /> Read
          </span>
        )}
      </div>
      <p dir="rtl" lang="ar" className="font-quran text-right mt-5 leading-[2.3]" style={{ fontSize: `${size}px` }}>
        {ayah.ar}
        <span className="text-burg font-quran text-[0.6em] mx-1">﴿{ayah.a.toLocaleString("ar-EG")}﴾</span>
      </p>
      {showTr && <p className="text-ink/70 mt-4 leading-relaxed">{ayah.en}</p>}
      {note && (
        <p className="mt-3 text-sm bg-lav/40 border-2 border-ink/15 rounded-xl px-4 py-2.5 flex gap-2">
          <Icon name="note" className="w-4 h-4 shrink-0 mt-0.5" /> {note.text}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mt-5">
        {act(playing ? "Pause" : "Listen", playing ? "pause" : "play", () => audio.play(ayah.s, ayah.a), playing)}
        {act(read ? "Read ✓" : "Mark read", "check", () => {
          if (!user) return toast("Log in to track your reading.");
          markAyahRead(ayah.s, ayah.a);
          toast("Counted toward today's goal");
        }, read)}
        {act("Bookmark", "bookmark", () => {
          if (!user) return toast("Log in to save bookmarks.");
          toggleBookmark(ayah.s, ayah.a);
          toast(bookmarked ? "Bookmark removed" : "Bookmarked");
        }, bookmarked)}
        {act("Note", "note", () => {
          if (!user) return toast("Log in to write notes.");
          setNoteOpen(true);
        }, !!note)}
        <a href={`${practiceBase}/practice/${ayah.s}/${ayah.a}`} className="inline-flex items-center gap-1.5 border-2 border-ink rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-blush hover:-translate-y-0.5 transition-all">
          <Icon name="mic" className="w-3.5 h-3.5" /> Practice
        </a>
        <a href={`${practiceBase}/memorize/${ayah.s}/${ayah.a}`} className="inline-flex items-center gap-1.5 border-2 border-ink rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-lav hover:-translate-y-0.5 transition-all">
          <Icon name="brain" className="w-3.5 h-3.5" /> Memorize
        </a>
      </div>
      <NoteModal open={noteOpen} onClose={() => setNoteOpen(false)} s={ayah.s} a={ayah.a} existing={note?.text} />
    </article>
  );
}

/* ---------------- reader ---------------- */

export function ReaderPage({ s, a, inApp }: { s: number; a?: number; inApp?: boolean }) {
  const { data } = useApp();
  const meta = surahMeta(s);
  const ayahs = surahAyahs(s);
  const audio = useAyahAudio((cs, ca) => {
    const i = ayahs.findIndex((x) => x.s === cs && x.a === ca);
    const nx = ayahs[i + 1];
    return nx ? { s: nx.s, a: nx.a } : null;
  });
  const included = isSurahIncluded(s);
  const scrolled = useRef(false);
  const [dataset, setDataset] = useState<"loading" | "ready" | "offline">(included ? "ready" : "loading");

  useEffect(() => {
    setDataset(isSurahIncluded(s) ? "ready" : "loading");
    loadFullQuran();
    return onFullChange(() => setDataset(isSurahIncluded(s) ? "ready" : isFullLoaded() || datasetFailed() ? "offline" : "loading"));
  }, [s]);

  useEffect(() => {
    setLastRead(s, a ?? ayahs[0]?.a ?? 1);
  }, [s, a]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (a && !scrolled.current && ayahs.length) {
      scrolled.current = true;
      setTimeout(() => document.getElementById(`ayah-${s}-${a}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    }
  }, [a, s, ayahs.length]);

  useEffect(() => () => audio.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const base = inApp ? "#/app/quran" : "#/quran";
  const idx = SURAHS.findIndex((x) => x.id === s);
  const prevS = SURAHS[idx - 1];
  const nextS = SURAHS[idx + 1];

  return (
    <div className={inApp ? "" : "min-h-screen bg-cream grain"}>
      {!inApp && <div className="h-24" />}
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 relative z-10">
        <a href={base} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink/50 hover:text-ink transition-colors">
          <Icon name="arrowL" className="w-4 h-4" /> All surahs
        </a>

        <header className="mt-6 text-center">
          <p dir="rtl" lang="ar" className="font-quran text-6xl sm:text-7xl">
            {meta.arabic}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase mt-3">Surah {meta.name}</h1>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Pill className="bg-paper">{meta.meaning}</Pill>
            <Pill className={meta.type === "Meccan" ? "bg-lav" : "bg-blush"}>{meta.type}</Pill>
            <Pill className="bg-sun">{meta.ayahs} ayahs</Pill>
          </div>
        </header>

        {included && s !== 1 && s !== 9 && (
          <p dir="rtl" lang="ar" className="font-quran text-3xl sm:text-4xl text-center mt-10 text-forest-soft">
            {BASMALA}
          </p>
        )}

        <div className="sticky top-0 z-30 mt-8 bg-cream/95 dark:bg-forest/95 backdrop-blur border-y-2 border-ink/10 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/60">
            Arabic size
            <input
              type="range"
              min={24}
              max={56}
              value={data?.settings.arabicSize ?? 34}
              onChange={(e) => patchSettings({ arabicSize: Number(e.target.value) })}
              className="w-28"
              aria-label="Arabic font size"
            />
          </label>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/60">
            <Icon name="headphones" className="w-4 h-4" />
            <select
              value={data?.settings.reciter ?? "Alafasy_128kbps"}
              onChange={(e) => patchSettings({ reciter: e.target.value })}
              className="border-2 border-ink rounded-lg bg-paper px-2 py-1 text-xs font-bold normal-case tracking-normal cursor-pointer"
              aria-label="Reciter"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/60">
            Speed
            <select
              value={data?.settings.speed ?? 1}
              onChange={(e) => {
                const v = Number(e.target.value);
                patchSettings({ speed: v });
                getAudio().playbackRate = v;
              }}
              className="border-2 border-ink rounded-lg bg-paper px-2 py-1 text-xs font-bold cursor-pointer"
              aria-label="Playback speed"
            >
              {[0.75, 1, 1.25].map((v) => (
                <option key={v} value={v}>
                  {v}×
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => patchSettings({ showTranslation: !(data?.settings.showTranslation ?? true) })}
            className="text-xs font-bold uppercase tracking-widest border-2 border-ink rounded-full px-3 py-1 cursor-pointer bg-paper hover:bg-sun transition-colors"
          >
            Translation: {(data?.settings.showTranslation ?? true) ? "On" : "Off"}
          </button>
        </div>

        <div className="mt-8 space-y-5">
          {!included && (
            <div className="bg-paper border-2 border-ink rounded-[1.6rem] p-10 text-center shadow-hard">
              <p dir="rtl" lang="ar" className={`font-quran text-5xl ${dataset === "loading" ? "animate-pulse" : ""}`}>{meta.arabic}</p>
              {dataset === "loading" ? (
                <>
                  <p className="mt-5 font-bold uppercase tracking-widest text-xs text-ink/50">Loading {meta.ayahs} ayahs from the validated dataset…</p>
                  <div className="flex justify-center gap-2 mt-6">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-3 h-3 rounded-full bg-forest animate-bounce" style={{ animationDelay: `${i * 140}ms` }} />
                    ))}
                  </div>
                  <p className="text-xs text-ink/45 mt-5">Synced once, then cached on your device.</p>
                </>
              ) : (
                <>
                  <p className="mt-5 font-bold uppercase tracking-widest text-xs text-burg">Offline — dataset unreachable</p>
                  <p className="text-sm text-ink/60 mt-2 max-w-md mx-auto">
                    Noor only serves Qur'anic text from its validated dataset — never generated text. Reconnect to sync the complete mushaf; meanwhile these are available on-device:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-5">
                    {[1, 2, 30, 67, 97, 112].filter((id) => isSurahIncluded(id)).map((id) => (
                      <a key={id} href={`${base}/${id}`} className="border-2 border-ink rounded-full bg-sun px-4 py-1.5 text-sm font-bold hover:-translate-y-0.5 transition-all">
                        {surahMeta(id).name}
                      </a>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Btn variant="ink" onClick={() => { loadFullQuran(); setDataset("loading"); }}>
                      <Icon name="refresh" className="w-4 h-4" /> Retry sync
                    </Btn>
                  </div>
                </>
              )}
            </div>
          )}

          {ayahs.map((ayah) => (
            <AyahRow key={ayahKey(ayah.s, ayah.a)} ayah={ayah} highlight={a === ayah.a} inApp={inApp} audio={audio} />
          ))}

          {included && ayahs.length < meta.ayahs && (
            <p className="text-center text-xs font-bold uppercase tracking-widest text-ink/40 py-4">
              ✳ Verified excerpt ({ayahs.length} of {meta.ayahs} ayahs) — the full surah is being validated
            </p>
          )}
        </div>

        <nav className="flex justify-between gap-4 mt-10">
          {prevS ? (
            <a href={`${base}/${prevS.id}`} className="card-pop bg-paper rounded-2xl px-5 py-4 flex-1 max-w-[46%]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">← Previous</p>
              <p className="font-display text-lg uppercase mt-1">{prevS.name}</p>
            </a>
          ) : (
            <span className="flex-1 max-w-[46%]" />
          )}
          {nextS ? (
            <a href={`${base}/${nextS.id}`} className="card-pop bg-paper rounded-2xl px-5 py-4 flex-1 max-w-[46%] text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Next →</p>
              <p className="font-display text-lg uppercase mt-1">{nextS.name}</p>
            </a>
          ) : (
            <span className="flex-1 max-w-[46%]" />
          )}
        </nav>
      </div>
    </div>
  );
}

export function AyahSnippet({ s, a, max = 110 }: { s: number; a: number; max?: number }) {
  const ayah = getAyah(s, a);
  if (!ayah) return null;
  return (
    <p dir="rtl" lang="ar" className="font-quran text-2xl leading-[2]">
      {ayah.ar.length > max ? ayah.ar.slice(0, max) + "…" : ayah.ar}
    </p>
  );
}
