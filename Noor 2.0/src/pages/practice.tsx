import { useEffect, useMemo, useState } from "react";
import { ayahKey, getAyah, includedSurahs, loadFullQuran, onFullChange, surahAyahs, surahMeta, wordsOf } from "../data/quran";
import { ayahAudioUrl, recordPractice, reviewQueue, useApp, type QueueItem } from "../lib/core";
import { Btn, Icon, Pill, toast } from "../components/ui";
import { RecitationPractice } from "../components/recitation";
import { useAyahAudio } from "./quran";

/* ---------------- practice / memorize page ---------------- */

export function PracticePage({ s, a, mode = "practice" }: { s?: number; a?: number; mode?: "practice" | "memorize" | "review" }) {
  const { data } = useApp();
  const [selS, setSelS] = useState(s ?? data?.lastRead?.s ?? 1);
  const [selA, setSelA] = useState(a ?? data?.lastRead?.a ?? 1);
  const [dataTick, setDataTick] = useState(0);

  useEffect(() => {
    loadFullQuran();
    return onFullChange(() => setDataTick((x) => x + 1));
  }, []);

  useEffect(() => {
    if (s) setSelS(s);
    if (a) setSelA(a);
  }, [s, a]);

  const resolved = useMemo(() => {
    if (getAyah(selS, selA)) return { s: selS, a: selA };
    const list = surahAyahs(selS);
    if (list.length) return { s: selS, a: list[0].a };
    return { s: 1, a: 1 };
  }, [selS, selA, dataTick]);

  /* ---------- picker ---------- */
  if (!s || !a) {
    const isMem = mode === "memorize";
    return (
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">
        <Pill className={isMem ? "bg-lav" : "bg-blush"}>
          <Icon name={isMem ? "brain" : "mic"} className="w-3.5 h-3.5" /> {isMem ? "Memorization" : "Recitation practice"}
        </Pill>
        <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.92] mt-4">
          Pick an ayah,
          <br />
          <span className="text-burg">find your voice.</span>
        </h1>
        <p className="text-ink/60 mt-4 max-w-lg">Listen first, then recite — the tracker marks every word live as speech recognition hears you.</p>
        <div className="mt-8 grid md:grid-cols-[240px_1fr] gap-6">
          <div className="bg-paper border-2 border-ink rounded-3xl p-5 h-fit">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-3">
              Surahs — {includedSurahs().length}/114 {includedSurahs().length < 114 ? "· syncing…" : "· complete"}
            </p>
            <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto scrollbar-thin pr-1">
              {includedSurahs().map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelS(id);
                    setSelA(surahAyahs(id)[0].a);
                  }}
                  className={`text-left px-3.5 py-2.5 rounded-xl border-2 font-bold text-sm flex justify-between items-center transition-all cursor-pointer ${
                    selS === id ? "border-ink bg-sun" : "border-transparent hover:bg-cream"
                  }`}
                >
                  <span>{surahMeta(id).name}</span>
                  <span className="text-xs text-ink/50">{surahAyahs(id).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-3">Choose an ayah of {surahMeta(selS).name}</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {surahAyahs(selS).map((ay) => {
                const m = data?.mem[ayahKey(ay.s, ay.a)];
                return (
                  <a
                    key={ayahKey(ay.s, ay.a)}
                    href={`#/app/${isMem ? "memorize" : "practice"}/${ay.s}/${ay.a}`}
                    className="card-pop bg-paper rounded-2xl p-4 text-center block"
                  >
                    <span className="font-display text-2xl">{ay.a}</span>
                    {m && (
                      <span
                        className={`block h-1.5 rounded-full mt-2 ${m.strength >= 80 ? "bg-forest-soft" : m.strength >= 50 ? "bg-sun-deep" : "bg-blush-deep"}`}
                        style={{ opacity: 0.9 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <SessionView s={resolved.s} a={resolved.a} mode={mode} />;
}

/* ---------------- live session view ---------------- */

function SessionView({ s, a, mode }: { s: number; a: number; mode: "practice" | "memorize" | "review" }) {
  const { data } = useApp();
  const audio = useAyahAudio();
  const [repeat, setRepeat] = useState(1);
  const meta = surahMeta(s);
  const ayah = getAyah(s, a);
  const words = wordsOf(s, a);
  const hidden = mode === "memorize";
  const list = surahAyahs(s);
  const idx = list.findIndex((x) => x.a === a);
  const next = list[idx + 1];
  const base = mode === "memorize" ? "memorize" : "practice";

  const listenTimes = () => {
    const el = new Audio(ayahAudioUrl(data?.settings.reciter ?? "Alafasy_128kbps", s, a));
    el.playbackRate = data?.settings.speed ?? 1;
    let left = repeat;
    el.onended = () => {
      left--;
      if (left > 0) el.play().catch(() => {});
    };
    el.play().catch(() => toast("Audio is unavailable offline — check your connection."));
  };

  if (!ayah || words.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16 text-center">
        <p className="font-display text-3xl uppercase">Loading ayah…</p>
        <p className="text-sm text-ink/55 mt-2">The validated dataset is syncing — this takes a few seconds the first time.</p>
        <a href={`#/app/${base}`} className="inline-block mt-6">
          <Btn variant="ink">Back</Btn>
        </a>
      </div>
    );
  }

  const saveAttempt = (r: { states: string[]; matched: number; uncertain: number; missed: number; total: number; elapsedMs: number; selfAssessed?: boolean }) => {
    recordPractice({
      s,
      a,
      mode,
      words: r.states.map((st) => (st === "matched" ? ("ok" as const) : ("review" as const))),
      rawWords: words,
      durationMs: r.elapsedMs,
      selfAssessed: r.selfAssessed,
      completionStatus: r.missed === 0 ? "complete" : "partial",
    });
  };

  const onNext = () => {
    if (mode === "review" && data) {
      const q = reviewQueue(data);
      const flat: QueueItem[] = [...q.attention, ...q.soon, ...q.strong];
      const cur = flat.findIndex((x) => x.s === s && x.a === a);
      const nx = flat[cur + 1];
      if (nx) {
        location.hash = `#/app/practice/${nx.s}/${nx.a}/review`;
        return;
      }
      toast("Queue clear — beautiful work.");
      location.hash = "#/app/review";
      return;
    }
    if (next) location.hash = `#/app/${base}/${s}/${next.a}`;
    else {
      const ns = surahAyahs(s + 1);
      if (ns.length) location.hash = `#/app/${base}/${s + 1}/${ns[0].a}`;
      else toast("That was the last ayah in the dataset.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Pill className={hidden ? "bg-lav" : mode === "review" ? "bg-sun" : "bg-blush"}>
          <Icon name={hidden ? "brain" : "mic"} className="w-3.5 h-3.5" />
          {hidden ? "Memorization challenge" : mode === "review" ? "Review attempt" : "Recitation practice"}
        </Pill>
        <div className="flex gap-2 text-xs font-bold">
          {idx > 0 && (
            <a href={`#/app/${base}/${s}/${list[idx - 1].a}`} className="border-2 border-ink rounded-full bg-paper px-3.5 py-1.5 hover:bg-cream transition-colors">
              ← {list[idx - 1].a}
            </a>
          )}
          {next && (
            <a href={`#/app/${base}/${s}/${next.a}`} className="border-2 border-ink rounded-full bg-paper px-3.5 py-1.5 hover:bg-cream transition-colors">
              {next.a} →
            </a>
          )}
        </div>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl uppercase leading-[0.95] mt-5">
        {meta.name} <span className="text-burg">{s}:{a}</span>
      </h1>
      {!hidden && <p className="text-ink/65 mt-3 leading-relaxed">{ayah.en}</p>}
      {hidden && <p className="text-ink/65 mt-3 leading-relaxed italic">Translation only — the Arabic stays hidden until your attempt.</p>}

      {/* listen bar */}
      <div className="card-pop bg-paper rounded-2xl p-4 mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={listenTimes}
          className="w-11 h-11 rounded-full bg-ink text-cream border-2 border-ink grid place-items-center hover:bg-burg transition-colors cursor-pointer"
          aria-label="Listen to the ayah"
        >
          <Icon name="play" className="w-5 h-5 translate-x-[1px]" />
        </button>
        <div>
          <p className="font-bold uppercase tracking-widest text-xs text-ink/60">Step 1 · Listen</p>
          <p className="text-xs text-ink/45">Hear it as many times as you like</p>
        </div>
        <label className="ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/55">
          Repeat
          <select value={repeat} onChange={(e) => setRepeat(Number(e.target.value))} className="border-2 border-ink rounded-lg bg-cream px-2 py-1.5 cursor-pointer">
            {[1, 2, 3, 5].map((n) => (
              <option key={n} value={n}>
                ×{n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        <p className="font-bold uppercase tracking-widest text-xs text-ink/60 mb-3">{hidden ? "Step 2 · Recite from memory" : "Step 2 · Recite aloud"}</p>
        <RecitationPractice
          words={words}
          hidden={hidden}
          onSaved={saveAttempt}
          onNext={onNext}
          nextLabel={mode === "review" ? "Next in queue" : "Continue"}
          playAyah={() => audio.play(s, a)}
          onWordDrill={(word, ok) => recordPractice({ s, a, mode: "word", words: [ok ? "ok" : "review"], rawWords: [word] })}
        />
      </div>
    </div>
  );
}

export function MemorizePage({ s, a }: { s?: number; a?: number }) {
  const { data } = useApp();
  if (!s || !a) {
    const target = data?.goals.targetSurah ?? 1;
    const first = surahAyahs(target)[0] ?? surahAyahs(1)[0];
    return <PracticePage mode="memorize" s={first.s} a={first.a} />;
  }
  return <PracticePage mode="memorize" s={s} a={a} />;
}

/* ---------------- review page ---------------- */

export function ReviewPage() {
  const { data } = useApp();
  const q = reviewQueue(data);

  const Item = ({ item, tone }: { item: QueueItem; tone: "burg" | "sun" | "paper" }) => {
    const meta = surahMeta(item.s);
    const overdueDays = Math.max(0, Math.round((Date.now() - (item.rec.due ?? Date.now())) / 86400000));
    const toneCls = tone === "burg" ? "bg-burg text-cream" : tone === "sun" ? "bg-sun text-ink" : "bg-paper text-ink";
    return (
      <div className={`card-pop rounded-2xl p-5 flex items-center justify-between gap-4 ${toneCls}`}>
        <div>
          <p className="font-display text-xl uppercase leading-tight">
            {meta.name} {item.s}:{item.a}
          </p>
          <p className={`text-xs mt-1 font-bold uppercase tracking-widest ${tone === "burg" ? "text-cream/70" : "text-ink/55"}`}>
            Strength {item.rec.strength}% · {tone === "burg" ? `overdue ${overdueDays || 1}d` : tone === "sun" ? "due soon" : "holding firm"}
          </p>
        </div>
        <a
          href={`#/app/practice/${item.s}/${item.a}/review`}
          className={`shrink-0 inline-flex items-center gap-1.5 border-2 border-ink rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 ${
            tone === "burg" ? "bg-sun text-ink" : "bg-ink text-cream"
          }`}
        >
          <Icon name="mic" className="w-3.5 h-3.5" /> Practice
        </a>
      </div>
    );
  };

  const empty = q.attention.length + q.soon.length + q.strong.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">
      <Pill className="bg-lav">
        <Icon name="refresh" className="w-3.5 h-3.5" /> Smart revision
      </Pill>
      <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.92] mt-4">
        Your review
        <br />
        <span className="text-lav-deep">queue.</span>
      </h1>
      <p className="text-ink/60 mt-4 max-w-lg">
        Personalized from every attempt: weak ayahs surface first, missed words get flagged, and successes schedule the next review automatically.
      </p>

      {empty ? (
        <div className="bg-paper border-2 border-ink rounded-[2rem] shadow-hard p-10 text-center mt-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-sun border-2 border-ink grid place-items-center">
            <Icon name="star" className="w-8 h-8" />
          </div>
          <p className="font-display text-3xl uppercase mt-5">Nothing due yet</p>
          <p className="text-sm text-ink/60 mt-2 max-w-sm mx-auto">Practice and memorize a few ayahs — your queue builds itself from every attempt.</p>
          <a href="#/app/practice" className="inline-block mt-6">
            <Btn variant="ink">Start practicing</Btn>
          </a>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {q.attention.length > 0 && (
            <section>
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl uppercase">Needs attention</h2>
                <span className="font-bold text-burg">{q.attention.length} {q.attention.length === 1 ? "ayah" : "ayahs"}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {q.attention.map((it) => (
                  <Item key={ayahKey(it.s, it.a)} item={it} tone="burg" />
                ))}
              </div>
            </section>
          )}
          {q.soon.length > 0 && (
            <section>
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl uppercase">Review soon</h2>
                <span className="font-bold text-sun-deep">{q.soon.length} {q.soon.length === 1 ? "ayah" : "ayahs"}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {q.soon.map((it) => (
                  <Item key={ayahKey(it.s, it.a)} item={it} tone="sun" />
                ))}
              </div>
            </section>
          )}
          {q.strong.length > 0 && (
            <section>
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl uppercase">Strong</h2>
                <span className="font-bold text-forest-soft">{q.strong.length} {q.strong.length === 1 ? "ayah" : "ayahs"}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {q.strong.map((it) => (
                  <Item key={ayahKey(it.s, it.a)} item={it} tone="paper" />
                ))}
              </div>
            </section>
          )}
          <div className="text-center pt-4">
            {q.attention.length > 0 ? (
              <a href={`#/app/practice/${q.attention[0].s}/${q.attention[0].a}/review`}>
                <Btn variant="ink">
                  <Icon name="mic" className="w-4 h-4" /> Start review
                </Btn>
              </a>
            ) : q.soon.length > 0 ? (
              <a href={`#/app/practice/${q.soon[0].s}/${q.soon[0].a}/review`}>
                <Btn variant="ink">
                  <Icon name="mic" className="w-4 h-4" /> Start review
                </Btn>
              </a>
            ) : (
              <a href={`#/app/practice/${q.strong[0].s}/${q.strong[0].a}/review`}>
                <Btn variant="ink">
                  <Icon name="mic" className="w-4 h-4" /> Start review
                </Btn>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
